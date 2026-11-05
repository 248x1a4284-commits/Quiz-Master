import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/quiz_question.dart';

class QuizApiService {
  static Future<List<QuizQuestion>> fetchQuestionsFromApi({
    required String categoryId,
    required int apiCategoryId,
    int amount = 5,
    String? difficulty,
  }) async {
    var url = 'https://opentdb.com/api.php?amount=$amount&category=$apiCategoryId&type=multiple';
    if (difficulty != null && difficulty.isNotEmpty) {
      url += '&difficulty=$difficulty';
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
            id: 'api-$categoryId-${DateTime.now().millisecondsSinceEpoch}-$idx',
            question: _unescapeHtml(item['question'] ?? ''),
            category: categoryId,
            options: options,
            correctAnswerIndex: correctIndex >= 0 ? correctIndex : 0,
            explanation: 'The correct answer is "$correct".',
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
}
