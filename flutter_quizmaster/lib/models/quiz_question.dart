import 'dart:convert';

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
      id: map['id'] as String? ?? 'id-${DateTime.now().millisecondsSinceEpoch}',
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
}
