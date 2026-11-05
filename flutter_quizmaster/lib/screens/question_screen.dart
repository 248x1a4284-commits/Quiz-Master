import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/quiz_provider.dart';
import '../widgets/option_card.dart';
import '../widgets/progress_bar.dart';
import 'results_screen.dart';

class QuestionScreen extends StatelessWidget {
  const QuestionScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final quiz = Provider.of<QuizProvider>(context);
    final question = quiz.currentQuestion;

    if (question == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Quiz')),
        body: const Center(child: Text('No question available.')),
      );
    }

    final letters = ['A', 'B', 'C', 'D'];
    final isLast = quiz.currentIndex + 1 >= quiz.totalQuestions;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          quiz.activeCategory?.name ?? 'Quiz',
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
        ),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 16),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: const Color(0xFF4F46E5).withOpacity(0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Row(
              children: [
                const Icon(Icons.stars_rounded, color: Color(0xFF4F46E5), size: 16),
                const SizedBox(width: 4),
                Text(
                  '${quiz.score} pts',
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF4F46E5),
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Progress header (e.g. Question 3 of 5)
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Question ${quiz.currentIndex + 1} of ${quiz.totalQuestions}',
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF4F46E5),
                    ),
                  ),
                  if (!quiz.usedFiftyFifty && !quiz.isAnswerSubmitted)
                    TextButton.icon(
                      style: TextButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      ),
                      onPressed: () => quiz.applyFiftyFifty(),
                      icon: const Icon(Icons.flash_on, size: 16, color: Color(0xFFF59E0B)),
                      label: const Text('50:50 Lifeline', style: TextStyle(fontSize: 12, color: Color(0xFFF59E0B))),
                    ),
                ],
              ),
              const SizedBox(height: 8),

              // Progress Bar
              QuizProgressBar(
                current: quiz.currentIndex + 1,
                total: quiz.totalQuestions,
              ),

              const SizedBox(height: 20),

              // Question Prompt
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Theme.of(context).cardColor,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: Colors.grey.withOpacity(0.2)),
                ),
                child: Text(
                  question.question,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    height: 1.4,
                  ),
                ),
              ),

              const SizedBox(height: 20),

              // Four Multiple Choice Options
              Expanded(
                child: ListView.builder(
                  itemCount: question.options.length,
                  itemBuilder: (context, index) {
                    final text = question.options[index];
                    final isSelected = quiz.selectedAnswerIndex == index;
                    final isCorrect = question.correctAnswerIndex == index;
                    final isEliminated = quiz.eliminatedOptions.contains(index);

                    return OptionCard(
                      text: text,
                      letter: letters[index],
                      isSelected: isSelected,
                      isSubmitted: quiz.isAnswerSubmitted,
                      isCorrect: isCorrect,
                      isEliminated: isEliminated,
                      onTap: () {
                        quiz.selectAnswer(index);
                      },
                    );
                  },
                ),
              ),

              // Explanation note if submitted
              if (quiz.isAnswerSubmitted && question.explanation != null)
                Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFF4F46E5).withOpacity(0.08),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFF4F46E5).withOpacity(0.2)),
                  ),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Icon(Icons.info_outline, size: 18, color: Color(0xFF4F46E5)),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          question.explanation!,
                          style: const TextStyle(fontSize: 12, height: 1.3),
                        ),
                      ),
                    ],
                  ),
                ),

              // Action Button (Submit Answer vs Next Question)
              SizedBox(
                width: double.infinity,
                height: 50,
                child: !quiz.isAnswerSubmitted
                    ? ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF4F46E5),
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                          elevation: 0,
                        ),
                        onPressed: quiz.selectedAnswerIndex != null ? () => quiz.submitAnswer() : null,
                        child: const Text('Submit Answer', style: TextStyle(fontWeight: FontWeight.bold)),
                      )
                    : ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF4F46E5),
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                          elevation: 0,
                        ),
                        onPressed: () {
                          final hasMore = quiz.nextQuestion();
                          if (!hasMore) {
                            Navigator.pushReplacement(
                              context,
                              MaterialPageRoute(builder: (_) => const ResultsScreen()),
                            );
                          }
                        },
                        icon: const Icon(Icons.arrow_forward_rounded, size: 18),
                        label: Text(
                          isLast ? 'View Results' : 'Next Question',
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
