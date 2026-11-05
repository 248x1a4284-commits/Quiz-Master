import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/quiz_provider.dart';
import 'home_screen.dart';
import 'question_screen.dart';

class ResultsScreen extends StatelessWidget {
  const ResultsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final quiz = Provider.of<QuizProvider>(context, listen: false);
    final total = quiz.totalQuestions;
    final correct = quiz.correctCount;
    final incorrect = quiz.incorrectCount;
    final score = quiz.score;
    final percentage = total > 0 ? ((correct / total) * 100).round() : 0;

    String performanceTitle = 'Keep Practicing!';
    String performanceMessage = 'Good effort! Review the questions to improve your knowledge.';
    Color badgeColor = const Color(0xFFF59E0B);

    if (percentage == 100) {
      performanceTitle = 'Perfect Score!';
      performanceMessage = 'Incredible mastery! You answered every question correctly.';
      badgeColor = const Color(0xFF10B981);
    } else if (percentage >= 80) {
      performanceTitle = 'Outstanding Work!';
      performanceMessage = 'You showed impressive competence in this topic.';
      badgeColor = const Color(0xFF4F46E5);
    } else if (percentage >= 60) {
      performanceTitle = 'Great Effort!';
      performanceMessage = 'Well done! A little more study will get you to the top tier.';
      badgeColor = const Color(0xFF0891B2);
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Quiz Results', style: TextStyle(fontWeight: FontWeight.bold)),
        automaticallyImplyLeading: false,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Trophy Icon with glow
              Container(
                width: 90,
                height: 90,
                decoration: BoxDecoration(
                  color: badgeColor.withOpacity(0.12),
                  shape: BoxShape.circle,
                ),
                child: Icon(Icons.emoji_events_rounded, size: 50, color: badgeColor),
              ),
              const SizedBox(height: 16),

              Text(
                performanceTitle,
                style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 6),
              Text(
                performanceMessage,
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 13, color: Colors.grey[600]),
              ),

              const SizedBox(height: 24),

              // Score Circle
              Container(
                width: 130,
                height: 130,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(color: const Color(0xFF4F46E5).withOpacity(0.3), width: 6),
                  color: const Color(0xFF4F46E5).withOpacity(0.05),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      '$percentage%',
                      style: const TextStyle(
                        fontSize: 32,
                        fontWeight: FontWeight.extrabold,
                        color: Color(0xFF4F46E5),
                      ),
                    ),
                    Text(
                      '$score pts',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: Colors.grey[600],
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 28),

              // Metrics Breakdown Grid
              Row(
                children: [
                  _MetricCard(
                    title: 'Total Questions',
                    value: '$total',
                    icon: Icons.help_outline_rounded,
                    color: Colors.grey[700]!,
                  ),
                  const SizedBox(width: 10),
                  _MetricCard(
                    title: 'Correct',
                    value: '$correct',
                    icon: Icons.check_circle_rounded,
                    color: const Color(0xFF10B981),
                  ),
                  const SizedBox(width: 10),
                  _MetricCard(
                    title: 'Incorrect',
                    value: '$incorrect',
                    icon: Icons.cancel_rounded,
                    color: const Color(0xFFEF4444),
                  ),
                ],
              ),

              const Spacer(),

              // Action Buttons: Restart & Home
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                      onPressed: () {
                        Navigator.pushAndRemoveUntil(
                          context,
                          MaterialPageRoute(builder: (_) => const HomeScreen()),
                          (route) => false,
                        );
                      },
                      icon: const Icon(Icons.home_rounded, size: 18),
                      label: const Text('Home', style: TextStyle(fontWeight: FontWeight.bold)),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF4F46E5),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        elevation: 0,
                      ),
                      onPressed: () {
                        if (quiz.activeCategory != null) {
                          quiz.startQuiz(quiz.activeCategory!).then((_) {
                            Navigator.pushReplacement(
                              context,
                              MaterialPageRoute(builder: (_) => const QuestionScreen()),
                            );
                          });
                        }
                      },
                      icon: const Icon(Icons.replay_rounded, size: 18),
                      label: const Text('Restart Quiz', style: TextStyle(fontWeight: FontWeight.bold)),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _MetricCard extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;
  final Color color;

  const _MetricCard({
    required this.title,
    required this.value,
    required this.icon,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
        decoration: BoxDecoration(
          color: color.withOpacity(0.08),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: color.withOpacity(0.2)),
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 20),
            const SizedBox(height: 6),
            Text(
              value,
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: color,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              title,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(fontSize: 10, color: Colors.grey[600]),
            ),
          ],
        ),
      ),
    );
  }
}
