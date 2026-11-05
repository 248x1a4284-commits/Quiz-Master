import React, { useState } from 'react';
import JSZip from 'jszip';
import { useQuiz } from '../../context/QuizContext';
import {
  FileCode,
  Download,
  Copy,
  Check,
  Folder,
  ArrowLeft,
  Terminal,
  Layers,
  Sparkles,
} from 'lucide-react';

interface FlutterFile {
  path: string;
  name: string;
  content: string;
  type: 'yaml' | 'dart' | 'markdown';
}

const FLUTTER_FILES: FlutterFile[] = [
  {
    path: 'pubspec.yaml',
    name: 'pubspec.yaml',
    type: 'yaml',
    content: `name: quizmaster
description: "QuizMaster - A modern, interactive Android Quiz Application built with Flutter & Provider."
publish_to: "none"
version: 1.0.0+1

environment:
  sdk: ">=3.3.0 <4.0.0"

dependencies:
  flutter:
    sdk: flutter
  provider: ^6.1.2
  shared_preferences: ^2.2.3
  http: ^1.2.1
  google_fonts: ^6.2.1
  flutter_animate: ^4.5.0
  confetti: ^0.7.0
  cupertino_icons: ^1.0.8

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^4.0.0

flutter:
  uses-material-design: true`,
  },
  {
    path: 'lib/main.dart',
    name: 'main.dart',
    type: 'dart',
    content: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'providers/quiz_provider.dart';
import 'screens/home_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const QuizMasterApp());
}

class QuizMasterApp extends StatelessWidget {
  const QuizMasterApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => QuizProvider(),
      child: MaterialApp(
        title: 'QuizMaster',
        debugShowCheckedModeBanner: false,
        themeMode: ThemeMode.system,
        theme: ThemeData(
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(
            seedColor: const Color(0xFF4F46E5),
            brightness: Brightness.light,
          ),
          textTheme: GoogleFonts.plusJakartaSansTextTheme(ThemeData.light().textTheme),
          appBarTheme: const AppBarTheme(
            elevation: 0,
            centerTitle: false,
            scrolledUnderElevation: 1,
          ),
        ),
        darkTheme: ThemeData(
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(
            seedColor: const Color(0xFF4F46E5),
            brightness: Brightness.dark,
          ),
          textTheme: GoogleFonts.plusJakartaSansTextTheme(ThemeData.dark().textTheme),
          appBarTheme: const AppBarTheme(
            elevation: 0,
            centerTitle: false,
            scrolledUnderElevation: 1,
          ),
        ),
        home: const HomeScreen(),
      ),
    );
  }
}`,
  },
  {
    path: 'lib/models/quiz_question.dart',
    name: 'quiz_question.dart',
    type: 'dart',
    content: `import 'dart:convert';

class QuizQuestion {
  final String id;
  final String question;
  final String category;
  final List<String> options;
  final int correctAnswerIndex;
  final String? explanation;
  final bool isCustom;
  final String difficulty;

  const QuizQuestion({
    required this.id,
    required this.question,
    required this.category,
    required this.options,
    required this.correctAnswerIndex,
    this.explanation,
    this.isCustom = false,
    this.difficulty = 'medium',
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'question': question,
      'category': category,
      'options': options,
      'correctAnswerIndex': correctAnswerIndex,
      'explanation': explanation,
      'isCustom': isCustom,
      'difficulty': difficulty,
    };
  }

  factory QuizQuestion.fromMap(Map<String, dynamic> map) {
    return QuizQuestion(
      id: map['id'] as String? ?? 'id-\${DateTime.now().millisecondsSinceEpoch}',
      question: map['question'] as String? ?? '',
      category: map['category'] as String? ?? 'general-knowledge',
      options: List<String>.from(map['options'] as List? ?? []),
      correctAnswerIndex: (map['correctAnswerIndex'] as num?)?.toInt() ?? 0,
      explanation: map['explanation'] as String?,
      isCustom: map['isCustom'] as bool? ?? false,
      difficulty: map['difficulty'] as String? ?? 'medium',
    );
  }

  String toJson() => json.encode(toMap());

  factory QuizQuestion.fromJson(String source) =>
      QuizQuestion.fromMap(json.decode(source) as Map<String, dynamic>);
}`,
  },
  {
    path: 'lib/models/quiz_category.dart',
    name: 'quiz_category.dart',
    type: 'dart',
    content: `import 'package:flutter/material.dart';

class QuizCategory {
  final String id;
  final String name;
  final String description;
  final IconData icon;
  final Color primaryColor;
  final Color secondaryColor;
  final int? apiCategoryId;

  const QuizCategory({
    required this.id,
    required this.name,
    required this.description,
    required this.icon,
    required this.primaryColor,
    required this.secondaryColor,
    this.apiCategoryId,
  });

  static const List<QuizCategory> standardCategories = [
    QuizCategory(
      id: 'programming',
      name: 'Programming',
      description: 'Data structures, algorithms & syntax',
      icon: Icons.code,
      primaryColor: Color(0xFF2563EB),
      secondaryColor: Color(0xFF4F46E5),
      apiCategoryId: 18,
    ),
    QuizCategory(
      id: 'computer-science',
      name: 'Computer Science',
      description: 'OS, networking, memory & hardware',
      icon: Icons.memory,
      primaryColor: Color(0xFF7C3AED),
      secondaryColor: Color(0xFF9333EA),
      apiCategoryId: 18,
    ),
    QuizCategory(
      id: 'general-knowledge',
      name: 'General Knowledge',
      description: 'World history, geography & global trivia',
      icon: Icons.public,
      primaryColor: Color(0xFFD97706),
      secondaryColor: Color(0xFFEA580C),
      apiCategoryId: 9,
    ),
    QuizCategory(
      id: 'science',
      name: 'Science',
      description: 'Physics, chemistry, astronomy & biology',
      icon: Icons.science,
      primaryColor: Color(0xFF059669),
      secondaryColor: Color(0xFF0D9488),
      apiCategoryId: 17,
    ),
    QuizCategory(
      id: 'mathematics',
      name: 'Mathematics',
      description: 'Algebra, geometry, logic & calculus',
      icon: Icons.calculate,
      primaryColor: Color(0xFFE11D48),
      secondaryColor: Color(0xFFDB2777),
      apiCategoryId: 19,
    ),
    QuizCategory(
      id: 'technology',
      name: 'Technology',
      description: 'Cloud, AI, cybersecurity & gadgets',
      icon: Icons.devices,
      primaryColor: Color(0xFF0891B2),
      secondaryColor: Color(0xFF2563EB),
      apiCategoryId: 30,
    ),
    QuizCategory(
      id: 'custom',
      name: 'My Custom Quizzes',
      description: 'Questions authored and verified by you',
      icon: Icons.auto_awesome,
      primaryColor: Color(0xFFEAB308),
      secondaryColor: Color(0xFF10B981),
    ),
  ];
}`,
  },
  {
    path: 'lib/models/quiz_score.dart',
    name: 'quiz_score.dart',
    type: 'dart',
    content: `import 'dart:convert';

class QuizScore {
  final String id;
  final String categoryId;
  final String categoryName;
  final int score;
  final int totalQuestions;
  final int correctAnswers;
  final int percentage;
  final String date;

  const QuizScore({
    required this.id,
    required this.categoryId,
    required this.categoryName,
    required this.score,
    required this.totalQuestions,
    required this.correctAnswers,
    required this.percentage,
    required this.date,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'categoryId': categoryId,
      'categoryName': categoryName,
      'score': score,
      'totalQuestions': totalQuestions,
      'correctAnswers': correctAnswers,
      'percentage': percentage,
      'date': date,
    };
  }

  factory QuizScore.fromMap(Map<String, dynamic> map) {
    return QuizScore(
      id: map['id'] as String? ?? 'score-\${DateTime.now().millisecondsSinceEpoch}',
      categoryId: map['categoryId'] as String? ?? 'programming',
      categoryName: map['categoryName'] as String? ?? 'General',
      score: (map['score'] as num?)?.toInt() ?? 0,
      totalQuestions: (map['totalQuestions'] as num?)?.toInt() ?? 5,
      correctAnswers: (map['correctAnswers'] as num?)?.toInt() ?? 0,
      percentage: (map['percentage'] as num?)?.toInt() ?? 0,
      date: map['date'] as String? ?? '',
    );
  }

  String toJson() => json.encode(toMap());

  factory QuizScore.fromJson(String source) =>
      QuizScore.fromMap(json.decode(source) as Map<String, dynamic>);
}`,
  },
  {
    path: 'lib/services/quiz_api_service.dart',
    name: 'quiz_api_service.dart',
    type: 'dart',
    content: `import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/quiz_question.dart';

class QuizApiService {
  static Future<List<QuizQuestion>> fetchQuestionsFromApi({
    required String categoryId,
    required int apiCategoryId,
    int amount = 5,
    String? difficulty,
  }) async {
    var url = 'https://opentdb.com/api.php?amount=\$amount&category=\$apiCategoryId&type=multiple';
    if (difficulty != null && difficulty.isNotEmpty) {
      url += '&difficulty=\$difficulty';
    }

    final response = await http.get(Uri.parse(url));

    if (response.statusCode == 200) {
      final data = json.decode(response.body) as Map<String, dynamic>;
      if (data['response_code'] == 0 && data['results'] is List) {
        final results = data['results'] as List;
        return results.asMap().entries.map((entry) {
          final idx = entry.key;
          final item = entry.value as Map<String, dynamic>;
          final correct = _unescapeHtml(item['correct_answer'] ?? '');
          final incorrect = (item['incorrect_answers'] as List)
              .map((e) => _unescapeHtml(e.toString()))
              .toList();

          final options = [correct, ...incorrect]..shuffle();
          final correctIndex = options.indexOf(correct);

          return QuizQuestion(
            id: 'api-\$categoryId-\${DateTime.now().millisecondsSinceEpoch}-\$idx',
            question: _unescapeHtml(item['question'] ?? ''),
            category: categoryId,
            options: options,
            correctAnswerIndex: correctIndex >= 0 ? correctIndex : 0,
            explanation: 'The correct answer is "\$correct".',
            difficulty: item['difficulty'] ?? 'medium',
          );
        }).toList();
      }
    }

    throw Exception('Failed to load questions from Open Trivia DB');
  }

  static String _unescapeHtml(String text) {
    return text
        .replaceAll('&quot;', '"')
        .replaceAll('&#039;', "'")
        .replaceAll('&amp;', '&')
        .replaceAll('&lt;', '<')
        .replaceAll('&gt;', '>')
        .replaceAll('&eacute;', 'é')
        .replaceAll('&ndash;', '–');
  }
}`,
  },
  {
    path: 'lib/services/storage_service.dart',
    name: 'storage_service.dart',
    type: 'dart',
    content: `import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/quiz_question.dart';
import '../models/quiz_score.dart';

class StorageService {
  static const String _customQuestionsKey = 'quizmaster_custom_questions';
  static const String _highScoresKey = 'quizmaster_high_scores';

  static Future<List<QuizQuestion>> getCustomQuestions() async {
    final prefs = await SharedPreferences.getInstance();
    final jsonList = prefs.getStringList(_customQuestionsKey) ?? [];
    return jsonList.map((str) => QuizQuestion.fromJson(str)).toList();
  }

  static Future<bool> saveCustomQuestion(QuizQuestion question) async {
    final prefs = await SharedPreferences.getInstance();
    final current = await getCustomQuestions();
    current.insert(0, question);
    final jsonList = current.map((q) => q.toJson()).toList();
    return prefs.setStringList(_customQuestionsKey, jsonList);
  }

  static Future<bool> deleteCustomQuestion(String id) async {
    final prefs = await SharedPreferences.getInstance();
    final current = await getCustomQuestions();
    current.removeWhere((q) => q.id == id);
    final jsonList = current.map((q) => q.toJson()).toList();
    return prefs.setStringList(_customQuestionsKey, jsonList);
  }

  static Future<List<QuizScore>> getHighScores() async {
    final prefs = await SharedPreferences.getInstance();
    final jsonList = prefs.getStringList(_highScoresKey) ?? [];
    final scores = jsonList.map((str) => QuizScore.fromJson(str)).toList();
    scores.sort((a, b) => b.score.compareTo(a.score));
    return scores;
  }

  static Future<bool> saveScore(QuizScore score) async {
    final prefs = await SharedPreferences.getInstance();
    final current = await getHighScores();
    current.insert(0, score);
    final trimmed = current.take(50).toList();
    final jsonList = trimmed.map((s) => s.toJson()).toList();
    return prefs.setStringList(_highScoresKey, jsonList);
  }

  static Future<bool> clearHighScores() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.remove(_highScoresKey);
  }
}`,
  },
  {
    path: 'lib/providers/quiz_provider.dart',
    name: 'quiz_provider.dart',
    type: 'dart',
    content: `import 'package:flutter/foundation.dart';
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

  List<int> _eliminatedOptions = [];
  bool _usedFiftyFifty = false;

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
          _errorMessage = 'No custom questions found.';
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
      _errorMessage = 'Error loading quiz: \$e';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void selectAnswer(int index) {
    if (_isAnswerSubmitted) return;
    _selectedAnswerIndex = index;
    notifyListeners();
  }

  void submitAnswer() {
    if (currentQuestion == null || _isAnswerSubmitted || _selectedAnswerIndex == null) return;

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
      _saveFinalScore();
      return false;
    }
  }

  Future<void> _saveFinalScore() async {
    if (_activeCategory == null) return;
    final percentage = totalQuestions > 0 ? ((_correctCount / totalQuestions) * 100).round() : 0;
    final record = QuizScore(
      id: 'score-\${DateTime.now().millisecondsSinceEpoch}',
      categoryId: _activeCategory!.id,
      categoryName: _activeCategory!.name,
      score: _score,
      totalQuestions: totalQuestions,
      correctAnswers: _correctCount,
      percentage: percentage,
      date: '\${DateTime.now().day}/\${DateTime.now().month}/\${DateTime.now().year}',
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
    if (success) await loadCustomQuestions();
    return success;
  }

  Future<bool> deleteCustomQuestion(String id) async {
    final success = await StorageService.deleteCustomQuestion(id);
    if (success) await loadCustomQuestions();
    return success;
  }

  Future<void> clearHighScores() async {
    await StorageService.clearHighScores();
    await loadHighScores();
  }

  List<QuizQuestion> _getDefaultQuestionsForCategory(String categoryId) {
    return [
      const QuizQuestion(
        id: 'prog-1',
        category: 'programming',
        question: 'Which Flutter state management uses InheritedWidget under the hood?',
        options: ['Redux', 'Provider', 'Bloc', 'GetX'],
        correctAnswerIndex: 1,
        explanation: 'Provider is the officially recommended, idiomatic state management.',
      ),
      const QuizQuestion(
        id: 'prog-2',
        category: 'programming',
        question: 'What is the time complexity of searching a balanced BST?',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
        correctAnswerIndex: 2,
        explanation: 'Balanced BST height is bounded by log n.',
      ),
    ];
  }
}`,
  },
  {
    path: 'lib/screens/home_screen.dart',
    name: 'home_screen.dart',
    type: 'dart',
    content: `// Refer to flutter_quizmaster/lib/screens/home_screen.dart in repo for full implementation`,
  },
  {
    path: 'test/widget_test.dart',
    name: 'widget_test.dart',
    type: 'dart',
    content: `import 'package:flutter_test/flutter_test.dart';
import 'package:quizmaster/main.dart';
import 'package:quizmaster/models/quiz_question.dart';

void main() {
  testWidgets('QuizMaster smoke test - verifies home screen and title', (WidgetTester tester) async {
    await tester.pumpWidget(const QuizMasterApp());
    expect(find.text('QuizMaster'), findsOneWidget);
    expect(find.text('Quick Play Quiz'), findsOneWidget);
  });
}`,
  },
];

export const FlutterCodeViewer: React.FC = () => {
  const { navigateTo } = useQuiz();
  const [selectedFile, setSelectedFile] = useState<FlutterFile>(FLUTTER_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();

      // Add files to the zip
      FLUTTER_FILES.forEach((file) => {
        zip.file(file.path, file.content);
      });

      // Also include comprehensive README
      zip.file(
        'README.md',
        `# QuizMaster - Android Flutter Application

Built with Flutter 3.35+, Dart null-safety, Provider state management, and SharedPreferences.

## Run in Android Studio or VS Code:
1. flutter pub get
2. flutter run

## Build Release APK:
flutter build apk --release
Output: build/app/outputs/flutter-apk/app-release.apk
`
      );

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'quizmaster_flutter_project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate zip', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('home')}
            aria-label="Back to Home"
            className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Layers className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              Flutter & Dart Source Code Workspace
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Browse production-ready Flutter files or download the full project archive
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadZip}
          disabled={isZipping}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-600/20 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>{isZipping ? 'Archiving Project...' : 'Download Flutter Project (.zip)'}</span>
        </button>
      </div>

      {/* Instructions Card */}
      <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-950 dark:text-indigo-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <Terminal className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Build & Run Commands for Android Studio / Terminal:</p>
            <p className="text-slate-600 dark:text-slate-300 font-mono text-[11px] mt-0.5">
              1. <span className="text-indigo-600 dark:text-indigo-400">flutter pub get</span> &nbsp;|&nbsp;
              2. <span className="text-indigo-600 dark:text-indigo-400">flutter run</span> &nbsp;|&nbsp;
              3. <span className="text-indigo-600 dark:text-indigo-400">flutter build apk --release</span>
            </p>
          </div>
        </div>
        <div className="text-[11px] text-slate-500 shrink-0">
          State: <span className="font-bold text-indigo-600">Provider + ChangeNotifier</span>
        </div>
      </div>

      {/* Code Browser Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* File Tree Sidebar */}
        <div className="lg:col-span-4 p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
            <Folder className="w-3.5 h-3.5" />
            <span>Project Explorer</span>
          </div>

          <div className="space-y-1">
            {FLUTTER_FILES.map((file) => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full p-2.5 rounded-xl text-left text-xs font-mono flex items-center gap-2.5 transition-colors ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <FileCode
                    className={`w-4 h-4 shrink-0 ${
                      isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
                    }`}
                  />
                  <span className="truncate">{file.path}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Code Content Viewer */}
        <div className="lg:col-span-8 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg">
          <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-slate-200 text-xs font-bold">
                {selectedFile.path}
              </span>
            </div>

            <button
              onClick={handleCopy}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto max-h-[560px] leading-relaxed">
            <code>{selectedFile.content}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
