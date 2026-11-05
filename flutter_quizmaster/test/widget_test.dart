import 'package:flutter_test/flutter_test.dart';
import 'package:quizmaster/main.dart';
import 'package:quizmaster/models/quiz_question.dart';

void main() {
  testWidgets('QuizMaster smoke test - verifies home screen and title', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const QuizMasterApp());

    // Verify QuizMaster title is present in the App Bar
    expect(find.text('QuizMaster'), findsOneWidget);

    // Verify Quick Play button exists
    expect(find.text('Quick Play Quiz'), findsOneWidget);

    // Verify Featured Categories section exists
    expect(find.text('Featured Categories'), findsOneWidget);
  });

  test('QuizQuestion model serializes and deserializes correctly', () {
    const question = QuizQuestion(
      id: 'test-1',
      question: 'What is Dart?',
      category: 'programming',
      options: ['Language', 'Car', 'Food', 'Game'],
      correctAnswerIndex: 0,
      explanation: 'Dart is a client-optimized language developed by Google.',
    );

    final map = question.toMap();
    final reconstructed = QuizQuestion.fromMap(map);

    expect(reconstructed.id, equals('test-1'));
    expect(reconstructed.question, equals('What is Dart?'));
    expect(reconstructed.correctAnswerIndex, equals(0));
    expect(reconstructed.options.length, equals(4));
    expect(reconstructed.options[0], equals('Language'));
  });
}
