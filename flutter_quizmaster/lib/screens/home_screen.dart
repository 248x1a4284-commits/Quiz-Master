import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/quiz_provider.dart';
import '../widgets/category_card.dart';
import 'categories_screen.dart';
import 'add_question_screen.dart';
import 'leaderboard_screen.dart';
import 'question_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final quiz = Provider.of<QuizProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF4F46E5), Color(0xFF7C3AED)],
                ),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.psychology, color: Colors.white, size: 20),
            ),
            const SizedBox(width: 10),
            const Text(
              'QuizMaster',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.leaderboard_rounded),
            tooltip: 'Leaderboard',
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const LeaderboardScreen()),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Welcome & Highest Score Hero Card
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF1E1B4B), Color(0xFF312E81)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF312E81).withOpacity(0.3),
                    blurRadius: 16,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Welcome to QuizMaster!',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.15),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.emoji_events, color: Color(0xFFFBBF24), size: 16),
                            const SizedBox(width: 4),
                            Text(
                              '${quiz.highestScore} pts',
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Challenge yourself across 6 core academic & tech categories, or craft your own custom questions.',
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.85),
                      fontSize: 13,
                      height: 1.4,
                    ),
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                      foregroundColor: const Color(0xFF312E81),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                    ),
                    onPressed: () {
                      final randomCat = quiz.categories.first;
                      quiz.startQuiz(randomCat).then((_) {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => const QuestionScreen()),
                        );
                      });
                    },
                    icon: const Icon(Icons.play_arrow_rounded, size: 20),
                    label: const Text('Quick Play Quiz', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Quick Navigation Buttons (Add Question & Categories)
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const AddQuestionScreen()),
                      );
                    },
                    icon: const Icon(Icons.add_circle_outline, size: 18),
                    label: const Text('Add Questions', style: TextStyle(fontSize: 13)),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: OutlinedButton.icon(
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const CategoriesScreen()),
                      );
                    },
                    icon: const Icon(Icons.category_outlined, size: 18),
                    label: const Text('All Categories', style: TextStyle(fontSize: 13)),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 24),

            // Categories Section Title
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Featured Categories',
                  style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold),
                ),
                TextButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const CategoriesScreen()),
                    );
                  },
                  child: const Text('View All'),
                ),
              ],
            ),

            const SizedBox(height: 10),

            // Categories Grid
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
                childAspectRatio: 0.95,
              ),
              itemCount: quiz.categories.take(4).length,
              itemBuilder: (context, index) {
                final category = quiz.categories[index];
                return CategoryCard(
                  category: category,
                  onTap: () {
                    quiz.startQuiz(category).then((_) {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const QuestionScreen()),
                      );
                    });
                  },
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
