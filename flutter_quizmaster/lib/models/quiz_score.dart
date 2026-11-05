import 'dart:convert';

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
      id: map['id'] as String? ?? 'score-${DateTime.now().millisecondsSinceEpoch}',
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
}
