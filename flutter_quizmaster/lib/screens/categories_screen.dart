import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/quiz_provider.dart';
import '../widgets/category_card.dart';
import 'question_screen.dart';

class CategoriesScreen extends StatefulWidget {
  const CategoriesScreen({super.key});

  @override
  State<CategoriesScreen> createState() => _CategoriesScreenState();
}

class _CategoriesScreenState extends State<CategoriesScreen> {
  bool _useLiveApi = false;

  @override
  Widget build(BuildContext context) {
    final quiz = Provider.of<QuizProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Quiz Categories', style: TextStyle(fontWeight: FontWeight.bold)),
      ),
      body: quiz.isLoading
          ? const Center(child: CircularProgressIndicator())
          : Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
              child: Column(
                children: [
                  // Source switch banner
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    decoration: BoxDecoration(
                      color: Theme.of(context).cardColor,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: Colors.grey.withOpacity(0.2)),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            Icon(
                              _useLiveApi ? Icons.wifi : Icons.storage_rounded,
                              size: 18,
                              color: const Color(0xFF4F46E5),
                            ),
                            const SizedBox(width: 8),
                            Text(
                              _useLiveApi ? 'Live Trivia API' : 'Curated Offline Bank',
                              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
                            ),
                          ],
                        ),
                        Switch.adaptive(
                          value: _useLiveApi,
                          activeColor: const Color(0xFF4F46E5),
                          onChanged: (val) {
                            setState(() {
                              _useLiveApi = val;
                            });
                          },
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 12),

                  // Category Grid
                  Expanded(
                    child: GridView.builder(
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        crossAxisSpacing: 12,
                        mainAxisSpacing: 12,
                        childAspectRatio: 0.95,
                      ),
                      itemCount: quiz.categories.length,
                      itemBuilder: (context, index) {
                        final category = quiz.categories[index];
                        return CategoryCard(
                          category: category,
                          onTap: () {
                            quiz.startQuiz(category, useApi: _useLiveApi).then((_) {
                              Navigator.push(
                                context,
                                MaterialPageRoute(builder: (_) => const QuestionScreen()),
                              );
                            });
                          },
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}
