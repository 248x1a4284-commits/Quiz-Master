import 'package:flutter/foundation.dart';
import '../models/quiz_question.dart';
import '../models/quiz_category.dart';
import '../models/quiz_score.dart';
import '../services/storage_service.dart';
import '../services/quiz_api_service.dart';

class QuizProvider extends ChangeNotifier {
  List<QuizCategory> _categories = QuizCategory.standardCategories;
  QuizCategory? _activeCategory;
  List<QuizQuestion> _activeQuestions = [];
  int _currentIndex = 0;
  int? _selectedAnswerIndex;
  bool _isAnswerSubmitted = false;

  int _score = 0;
  int _correctCount = 0;
  int _incorrectCount = 0;

  List<QuizScore> _highScores = [];
  List<QuizQuestion> _customQuestions = [];
  bool _isLoading = false;
  String? _errorMessage;

  // Lifelines
  List<int> _eliminatedOptions = [];
  bool _usedFiftyFifty = false;

  // Getters
  List<QuizCategory> get categories => _categories;
  QuizCategory? get activeCategory => _activeCategory;
  List<QuizQuestion> get activeQuestions => _activeQuestions;
  int get currentIndex => _currentIndex;
  QuizQuestion? get currentQuestion =>
      _activeQuestions.isNotEmpty && _currentIndex < _activeQuestions.length
          ? _activeQuestions[_currentIndex]
          : null;

  int? get selectedAnswerIndex => _selectedAnswerIndex;
  bool get isAnswerSubmitted => _isAnswerSubmitted;
  int get score => _score;
  int get correctCount => _correctCount;
  int get incorrectCount => _incorrectCount;
  int get totalQuestions => _activeQuestions.length;
  List<QuizScore> get highScores => _highScores;
  List<QuizQuestion> get customQuestions => _customQuestions;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  List<int> get eliminatedOptions => _eliminatedOptions;
  bool get usedFiftyFifty => _usedFiftyFifty;

  int get highestScore {
    if (_highScores.isEmpty) return 0;
    return _highScores.map((s) => s.score).reduce((a, b) => a > b ? a : b);
  }

  QuizProvider() {
    init();
  }

  Future<void> init() async {
    await loadHighScores();
    await loadCustomQuestions();
  }

  Future<void> loadHighScores() async {
    _highScores = await StorageService.getHighScores();
    notifyListeners();
  }

  Future<void> loadCustomQuestions() async {
    _customQuestions = await StorageService.getCustomQuestions();
    notifyListeners();
  }

  // Start a Quiz
  Future<void> startQuiz(QuizCategory category, {bool useApi = false}) async {
    _isLoading = true;
    _errorMessage = null;
    _activeCategory = category;
    notifyListeners();

    try {
      List<QuizQuestion> pool = [];

      if (category.id == 'custom') {
        pool = List.from(_customQuestions);
        if (pool.isEmpty) {
          _errorMessage = 'No custom questions found. Create some first!';
          _isLoading = false;
          notifyListeners();
          return;
        }
      } else if (useApi && category.apiCategoryId != null) {
        try {
          pool = await QuizApiService.fetchQuestionsFromApi(
            categoryId: category.id,
            apiCategoryId: category.apiCategoryId!,
            amount: 5,
          );
        } catch (e) {
          // Fallback to built-in default questions
          pool = _getDefaultQuestionsForCategory(category.id);
        }
      } else {
        pool = _getDefaultQuestionsForCategory(category.id);
      }

      pool.shuffle();
      _activeQuestions = pool.take(5).toList();
      _currentIndex = 0;
      _selectedAnswerIndex = null;
      _isAnswerSubmitted = false;
      _score = 0;
      _correctCount = 0;
      _incorrectCount = 0;
      _eliminatedOptions = [];
      _usedFiftyFifty = false;
    } catch (e) {
      _errorMessage = 'Failed to load quiz questions: $e';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void selectAnswer(int index) {
    if (_isAnswerSubmitted) return; // Prevent change after submit
    _selectedAnswerIndex = index;
    notifyListeners();
  }

  void submitAnswer() {
    if (currentQuestion == null || _isAnswerSubmitted || _selectedAnswerIndex == null) {
      return;
    }

    _isAnswerSubmitted = true;
    final isCorrect = _selectedAnswerIndex == currentQuestion!.correctAnswerIndex;

    if (isCorrect) {
      _score += 100;
      _correctCount++;
    } else {
      _incorrectCount++;
    }

    notifyListeners();
  }

  bool nextQuestion() {
    if (_currentIndex + 1 < _activeQuestions.length) {
      _currentIndex++;
      _selectedAnswerIndex = null;
      _isAnswerSubmitted = false;
      _eliminatedOptions = [];
      notifyListeners();
      return true;
    } else {
      // Quiz Finished -> Record High Score
      _saveFinalScore();
      return false; // signifies quiz completion
    }
  }

  Future<void> _saveFinalScore() async {
    if (_activeCategory == null) return;
    final percentage = totalQuestions > 0 ? ((_correctCount / totalQuestions) * 100).round() : 0;
    final record = QuizScore(
      id: 'score-${DateTime.now().millisecondsSinceEpoch}',
      categoryId: _activeCategory!.id,
      categoryName: _activeCategory!.name,
      score: _score,
      totalQuestions: totalQuestions,
      correctAnswers: _correctCount,
      percentage: percentage,
      date: '${DateTime.now().day}/${DateTime.now().month}/${DateTime.now().year}',
    );

    await StorageService.saveScore(record);
    await loadHighScores();
  }

  void applyFiftyFifty() {
    if (_usedFiftyFifty || currentQuestion == null || _isAnswerSubmitted) return;

    final correctIndex = currentQuestion!.correctAnswerIndex;
    final incorrectIndices = [0, 1, 2, 3]..remove(correctIndex);
    incorrectIndices.shuffle();

    _eliminatedOptions = incorrectIndices.take(2).toList();
    _usedFiftyFifty = true;
    notifyListeners();
  }

  Future<bool> addCustomQuestion(QuizQuestion question) async {
    final success = await StorageService.saveCustomQuestion(question);
    if (success) {
      await loadCustomQuestions();
    }
    return success;
  }

  Future<bool> deleteCustomQuestion(String id) async {
    final success = await StorageService.deleteCustomQuestion(id);
    if (success) {
      await loadCustomQuestions();
    }
    return success;
  }

  Future<void> clearHighScores() async {
    await StorageService.clearHighScores();
    await loadHighScores();
  }

  List<QuizQuestion> _getDefaultQuestionsForCategory(String categoryId) {
    // Curated high quality questions per category
    switch (categoryId) {
      case 'programming':
        return [
          const QuizQuestion(
            id: 'prog-1',
            category: 'programming',
            question: 'Which Flutter state management approach uses InheritedWidget under the hood?',
            options: ['Redux', 'Provider', 'Bloc', 'GetX'],
            correctAnswerIndex: 1,
            explanation: 'Provider is the officially recommended, idiomatic state management built on InheritedWidget.',
          ),
          const QuizQuestion(
            id: 'prog-2',
            category: 'programming',
            question: 'What is the time complexity of searching a balanced BST?',
            options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
            correctAnswerIndex: 2,
            explanation: 'Balanced BST height is bounded by log n.',
          ),
          const QuizQuestion(
            id: 'prog-3',
            category: 'programming',
            question: 'Which Dart keyword declares a compile-time constant?',
            options: ['final', 'const', 'static', 'var'],
            correctAnswerIndex: 1,
            explanation: '"const" creates canonical compile-time constants.',
          ),
          const QuizQuestion(
            id: 'prog-4',
            category: 'programming',
            question: 'What does the "?." operator represent in Dart?',
            options: ['Ternary operator', 'Null-aware member access', 'Null assertion', 'Bitwise shift'],
            correctAnswerIndex: 1,
            explanation: 'Null-aware member access prevents NoSuchMethodError on null objects.',
          ),
        ];
      case 'computer-science':
        return [
          const QuizQuestion(
            id: 'cs-1',
            category: 'computer-science',
            question: 'What OS primitive prevents concurrent access to critical sections?',
            options: ['Mutex / Semaphore', 'Page Swapping', 'DMA Controller', 'Deadlock'],
            correctAnswerIndex: 0,
            explanation: 'Mutual exclusion prevents race conditions.',
          ),
          const QuizQuestion(
            id: 'cs-2',
            category: 'computer-science',
            question: 'Which OSI layer handles end-to-end communication and TCP flow control?',
            options: ['Network', 'Data Link', 'Transport', 'Application'],
            correctAnswerIndex: 2,
            explanation: 'Layer 4 is the Transport Layer.',
          ),
        ];
      default:
        return [
          const QuizQuestion(
            id: 'gk-1',
            category: 'general-knowledge',
            question: 'What is the deepest trench on Earth?',
            options: ['Java Trench', 'Puerto Rico Trench', 'Mariana Trench', 'Tonga Trench'],
            correctAnswerIndex: 2,
            explanation: 'The Mariana Trench reaches ~11,000 meters in depth.',
          ),
          const QuizQuestion(
            id: 'sci-1',
            category: 'science',
            question: 'Which particle mediates the electromagnetic force?',
            options: ['Gluon', 'Photon', 'W Boson', 'Higgs Boson'],
            correctAnswerIndex: 1,
            explanation: 'Photons are the gauge bosons of electromagnetism.',
          ),
        ];
    }
  }
}
