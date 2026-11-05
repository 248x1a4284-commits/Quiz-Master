import 'package:flutter/material.dart';

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
}
