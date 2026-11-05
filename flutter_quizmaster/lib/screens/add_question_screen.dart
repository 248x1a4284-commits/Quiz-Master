import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/quiz_question.dart';
import '../providers/quiz_provider.dart';

class AddQuestionScreen extends StatefulWidget {
  const AddQuestionScreen({super.key});

  @override
  State<AddQuestionScreen> createState() => _AddQuestionScreenState();
}

class _AddQuestionScreenState extends State<AddQuestionScreen> {
  final _formKey = GlobalKey<FormState>();

  final _questionController = TextEditingController();
  final _optionAController = TextEditingController();
  final _optionBController = TextEditingController();
  final _optionCController = TextEditingController();
  final _optionDController = TextEditingController();
  final _explanationController = TextEditingController();

  String _selectedCategory = 'programming';
  int _correctAnswerIndex = 0;

  @override
  void dispose() {
    _questionController.dispose();
    _optionAController.dispose();
    _optionBController.dispose();
    _optionCController.dispose();
    _optionDController.dispose();
    _explanationController.dispose();
    super.dispose();
  }

  void _saveQuestion() async {
    if (!_formKey.currentState!.validate()) return;

    final question = QuizQuestion(
      id: 'custom-${DateTime.now().millisecondsSinceEpoch}',
      question: _questionController.text.trim(),
      category: _selectedCategory,
      options: [
        _optionAController.text.trim(),
        _optionBController.text.trim(),
        _optionCController.text.trim(),
        _optionDController.text.trim(),
      ],
      correctAnswerIndex: _correctAnswerIndex,
      explanation: _explanationController.text.trim().isNotEmpty
          ? _explanationController.text.trim()
          : null,
      isCustom: true,
    );

    final quiz = Provider.of<QuizProvider>(context, listen: false);
    final success = await quiz.addCustomQuestion(question);

    if (mounted) {
      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Question successfully created and saved!'),
            backgroundColor: Color(0xFF10B981),
          ),
        );
        Navigator.pop(context);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Error saving question. Please try again.'),
            backgroundColor: Color(0xFFEF4444),
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Add Custom Question', style: TextStyle(fontWeight: FontWeight.bold)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Question Input
              const Text('Question Prompt', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
              const SizedBox(height: 6),
              TextFormField(
                controller: _questionController,
                maxLines: 3,
                decoration: InputDecoration(
                  hintText: 'Enter your question text here...',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                ),
                validator: (val) {
                  if (val == null || val.trim().isEmpty) return 'Question is required.';
                  if (val.trim().length < 6) return 'Question must be at least 6 characters.';
                  return null;
                },
              ),
              const SizedBox(height: 16),

              // Category Selector
              const Text('Category', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
              const SizedBox(height: 6),
              DropdownButtonFormField<String>(
                value: _selectedCategory,
                decoration: InputDecoration(
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                ),
                items: const [
                  DropdownMenuItem(value: 'programming', child: Text('Programming')),
                  DropdownMenuItem(value: 'computer-science', child: Text('Computer Science')),
                  DropdownMenuItem(value: 'general-knowledge', child: Text('General Knowledge')),
                  DropdownMenuItem(value: 'science', child: Text('Science')),
                  DropdownMenuItem(value: 'mathematics', child: Text('Mathematics')),
                  DropdownMenuItem(value: 'technology', child: Text('Technology')),
                ],
                onChanged: (val) {
                  if (val != null) setState(() => _selectedCategory = val);
                },
              ),
              const SizedBox(height: 20),

              // Options A, B, C, D
              const Text(
                'Multiple-Choice Options & Correct Answer',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
              ),
              const SizedBox(height: 4),
              const Text(
                'Select the radio button next to the option that is correct.',
                style: TextStyle(fontSize: 11, color: Colors.grey),
              ),
              const SizedBox(height: 12),

              _buildOptionField('Option A', _optionAController, 0),
              _buildOptionField('Option B', _optionBController, 1),
              _buildOptionField('Option C', _optionCController, 2),
              _buildOptionField('Option D', _optionDController, 3),

              const SizedBox(height: 12),

              // Explanation (Optional)
              const Text('Explanation (Optional)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
              const SizedBox(height: 6),
              TextFormField(
                controller: _explanationController,
                maxLines: 2,
                decoration: InputDecoration(
                  hintText: 'Explain why the correct answer is right...',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                ),
              ),

              const SizedBox(height: 24),

              // Save Button
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF4F46E5),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    elevation: 0,
                  ),
                  onPressed: _saveQuestion,
                  icon: const Icon(Icons.check_circle_outline, size: 20),
                  label: const Text('Save Question', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildOptionField(String label, TextEditingController controller, int index) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      child: Row(
        children: [
          Radio<int>(
            value: index,
            groupValue: _correctAnswerIndex,
            activeColor: const Color(0xFF10B981),
            onChanged: (val) {
              if (val != null) setState(() => _correctAnswerIndex = val);
            },
          ),
          Expanded(
            child: TextFormField(
              controller: controller,
              decoration: InputDecoration(
                labelText: label,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
              ),
              validator: (val) {
                if (val == null || val.trim().isEmpty) return '$label is required.';
                return null;
              },
            ),
          ),
        ],
      ),
    );
  }
}
