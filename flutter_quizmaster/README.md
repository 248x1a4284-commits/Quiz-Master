# QuizMaster - Android Quiz Application (Flutter & Dart)

**QuizMaster** is a complete, modern, user-friendly Android Quiz Application built with Flutter and Dart using `Provider` for state management and `SharedPreferences` for local persistence.

---

## 🚀 Key Features

1. **Home Screen**:
   - Application logo and title with gradient branding.
   - Dynamic user highest score and streak tracker.
   - One-tap Quick Play action.
   - Category grid showcasing featured domains.
   - Navigation to My Quizzes, All Categories, Leaderboard, and Add Questions.

2. **Quiz Categories**:
   - **Programming**: Data structures, algorithms, syntax & frameworks.
   - **Computer Science**: Operating systems, networking, memory & computer architecture.
   - **General Knowledge**: World history, geography, civilizations & trivia.
   - **Science**: Physics, chemistry, biology & cosmos.
   - **Mathematics**: Algebra, calculus, geometry & discrete math.
   - **Technology**: Cloud computing, AI, cybersecurity & mobile innovations.
   - **My Custom Quizzes**: User-authored quiz collections.
   - Online mode via **Open Trivia DB Public API** and instant **Offline Curated Bank**.

3. **Question Screen**:
   - Displays 1 question at a time with 4 multiple-choice options.
   - Enforces single-selection with highlight styling.
   - Automated score calculation (100 points per correct answer).
   - Prevents answering the same question multiple times.
   - **50:50 Lifeline**: Eliminates two incorrect options.
   - Visual progress indicator (e.g., Question 3 of 5).
   - Post-submission answer verification with explanation.

4. **Results Screen**:
   - Total questions, correct answers, and incorrect answers breakdown.
   - Final score and calculated percentage.
   - Contextual performance encouragement message.
   - Restart Quiz and Return to Home buttons.

5. **Add Custom Questions (Verified Form)**:
   - Full form validation for Question, Category, Option A, B, C, D, and Correct Answer radio selector.
   - Optional educational explanation field.
   - Stored permanently in device local storage.

6. **Leaderboard / Best Scores**:
   - Tracks top historical quiz attempts with dates and accuracy percentages.
   - Gold, Silver, and Bronze medal indicators.
   - Preserved across device restarts via `SharedPreferences`.

---

## 📂 Project Structure

```
flutter_quizmaster/
├── pubspec.yaml                 # Dependencies and asset declarations
├── README.md                    # Setup and build instructions
├── test/
│   └── widget_test.dart         # Flutter widget & unit tests
└── lib/
    ├── main.dart                # Application entry point & Theme configuration
    ├── models/
    │   ├── quiz_question.dart   # Question data model & JSON serialization
    │   ├── quiz_category.dart   # Category metadata & styling
    │   └── quiz_score.dart      # Score & leaderboard record model
    ├── services/
    │   ├── quiz_api_service.dart# Open Trivia DB HTTP integration
    │   └── storage_service.dart # SharedPreferences local storage wrapper
    ├── providers/
    │   └── quiz_provider.dart   # ChangeNotifier shared application state
    ├── screens/
    │   ├── home_screen.dart     # Home dashboard & quick play
    │   ├── categories_screen.dart # Category selection & mode switcher
    │   ├── question_screen.dart # Interactive multiple choice quiz screen
    │   ├── results_screen.dart  # Score summary & performance review
    │   ├── add_question_screen.dart # Custom question creator with validation
    │   └── leaderboard_screen.dart # High score leaderboard
    └── widgets/
        ├── category_card.dart   # Reusable domain card
        ├── option_card.dart     # Multiple-choice option button
        └── progress_bar.dart    # Linear quiz progress indicator
```

---

## 🛠️ Getting Started

### Prerequisites
- [Flutter SDK](https://flutter.dev/docs/get-started/install) (version 3.3.0 or newer)
- [Android Studio](https://developer.android.com/studio) or [VS Code](https://code.visualstudio.com/) with Flutter extension
- Android SDK Platform 34+ and Android Emulator or physical device

### Installation & Running

1. **Clone or navigate to the directory**:
   ```bash
   cd flutter_quizmaster
   ```

2. **Install dependencies**:
   ```bash
   flutter pub get
   ```

3. **Run on an Android device or emulator**:
   ```bash
   flutter run
   ```

4. **Run tests**:
   ```bash
   flutter test
   ```

---

## 📦 Generating a Release APK

To generate a standalone release APK for installation on Android devices:

```bash
flutter build apk --release
```

The resulting APK will be located at:
`build/app/outputs/flutter-apk/app-release.apk`

To generate an optimized Android App Bundle (AAB) for Google Play:
```bash
flutter build appbundle --release
```
The AAB bundle will be located at:
`build/app/outputs/bundle/release/app-release.aab`
