import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/quiz_question.dart';
import '../models/quiz_score.dart';

class StorageService {
  static const String _customQuestionsKey = 'quizmaster_custom_questions';
  static const String _highScoresKey = 'quizmaster_high_scores';

  // Load custom questions
  static Future<List<QuizQuestion>> getCustomQuestions() async {
    final prefs = await SharedPreferences.getInstance();
    final jsonList = prefs.getStringList(_customQuestionsKey) ?? [];
    return jsonList.map((str) => QuizQuestion.fromJson(str)).toList();
  }

  // Save a custom question
  static Future<bool> saveCustomQuestion(QuizQuestion question) async {
    final prefs = await SharedPreferences.getInstance();
    final current = await getCustomQuestions();
    current.insert(0, question);
    final jsonList = current.map((q) => q.toJson()).toList();
    return prefs.setStringList(_customQuestionsKey, jsonList);
  }

  // Delete a custom question
  static Future<bool> deleteCustomQuestion(String id) async {
    final prefs = await SharedPreferences.getInstance();
    final current = await getCustomQuestions();
    current.removeWhere((q) => q.id == id);
    final jsonList = current.map((q) => q.toJson()).toList();
    return prefs.setStringList(_customQuestionsKey, jsonList);
  }

  // High Scores / Leaderboard
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
    // Keep top 50
    final trimmed = current.take(50).toList();
    final jsonList = trimmed.map((s) => s.toJson()).toList();
    return prefs.setStringList(_highScoresKey, jsonList);
  }

  static Future<bool> clearHighScores() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.remove(_highScoresKey);
  }
}
