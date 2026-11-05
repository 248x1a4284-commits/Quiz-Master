import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/quiz_provider.dart';

class LeaderboardScreen extends StatelessWidget {
  const LeaderboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final quiz = Provider.of<QuizProvider>(context);
    final scores = quiz.highScores;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Best Scores', style: TextStyle(fontWeight: FontWeight.bold)),
        actions: [
          if (scores.isNotEmpty)
            IconButton(
              icon: const Icon(Icons.delete_outline),
              tooltip: 'Clear History',
              onPressed: () {
                showDialog(
                  context: context,
                  builder: (ctx) => AlertDialog(
                    title: const Text('Clear High Scores?'),
                    content: const Text('This will remove all score history from this device.'),
                    actions: [
                      TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
                      TextButton(
                        onPressed: () {
                          quiz.clearHighScores();
                          Navigator.pop(ctx);
                        },
                        child: const Text('Clear', style: TextStyle(color: Colors.red)),
                      ),
                    ],
                  ),
                );
              },
            ),
        ],
      ),
      body: scores.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.emoji_events_outlined, size: 64, color: Colors.grey[400]),
                  const SizedBox(height: 12),
                  const Text(
                    'No Scores Recorded Yet',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Complete a quiz round to see your highest score here!',
                    style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                  ),
                ],
              ),
            )
          : ListView.builder(
              padding: const EdgeInsets.all(16.0),
              itemCount: scores.length,
              itemBuilder: (context, index) {
                final score = scores[index];
                Color rankColor = Colors.grey[300]!;
                if (index == 0) rankColor = const Color(0xFFFBBF24);
                if (index == 1) rankColor = const Color(0xFF94A3B8);
                if (index == 2) rankColor = const Color(0xFFD97706);

                return Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Theme.of(context).cardColor,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.grey.withOpacity(0.18)),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 36,
                        height: 36,
                        decoration: BoxDecoration(
                          color: rankColor.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        alignment: Alignment.center,
                        child: Text(
                          '#${index + 1}',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 13,
                            color: index < 3 ? Colors.black87 : Colors.grey[700],
                          ),
                        ),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              score.categoryName,
                              style: const TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              '${score.date} · ${score.correctAnswers}/${score.totalQuestions} Correct',
                              style: TextStyle(fontSize: 11, color: Colors.grey[600]),
                            ),
                          ],
                        ),
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text(
                            '${score.score} pts',
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.extrabold,
                              color: Color(0xFF4F46E5),
                            ),
                          ),
                          Text(
                            '${score.percentage}%',
                            style: TextStyle(fontSize: 11, color: Colors.grey[600]),
                          ),
                        ],
                      ),
                    ],
                  ),
                );
              },
            ),
    );
  }
}
