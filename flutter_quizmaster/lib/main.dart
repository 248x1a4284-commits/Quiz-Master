import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'providers/quiz_provider.dart';
import 'screens/home_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const QuizMasterApp());
}

class QuizMasterApp extends StatelessWidget {
  const QuizMasterApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => QuizProvider(),
      child: MaterialApp(
        title: 'QuizMaster',
        debugShowCheckedModeBanner: false,
        themeMode: ThemeMode.system,
        theme: ThemeData(
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(
            seedColor: const Color(0xFF4F46E5),
            brightness: Brightness.light,
          ),
          textTheme: GoogleFonts.plusJakartaSansTextTheme(ThemeData.light().textTheme),
          appBarTheme: const AppBarTheme(
            elevation: 0,
            centerTitle: false,
            scrolledUnderElevation: 1,
          ),
        ),
        darkTheme: ThemeData(
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(
            seedColor: const Color(0xFF4F46E5),
            brightness: Brightness.dark,
          ),
          textTheme: GoogleFonts.plusJakartaSansTextTheme(ThemeData.dark().textTheme),
          appBarTheme: const AppBarTheme(
            elevation: 0,
            centerTitle: false,
            scrolledUnderElevation: 1,
          ),
        ),
        home: const HomeScreen(),
      ),
    );
  }
}
