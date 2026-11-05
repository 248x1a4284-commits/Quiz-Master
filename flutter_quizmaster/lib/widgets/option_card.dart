import 'package:flutter/material.dart';

class OptionCard extends StatelessWidget {
  final String text;
  final String letter;
  final bool isSelected;
  final bool isSubmitted;
  final bool isCorrect;
  final bool isEliminated;
  final VoidCallback onTap;

  const OptionCard({
    super.key,
    required this.text,
    required this.letter,
    required this.isSelected,
    required this.isSubmitted,
    required this.isCorrect,
    this.isEliminated = false,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    if (isEliminated) {
      return Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.grey.withOpacity(0.2), style: BorderStyle.solid),
          color: Colors.grey.withOpacity(0.05),
        ),
        child: Row(
          children: [
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                color: Colors.grey.withOpacity(0.2),
                borderRadius: BorderRadius.circular(8),
              ),
              alignment: Alignment.center,
              child: Text(
                letter,
                style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.grey),
              ),
            ),
            const SizedBox(width: 12),
            const Text(
              'Option eliminated',
              style: TextStyle(color: Colors.grey, fontStyle: FontStyle.italic),
            ),
          ],
        ),
      );
    }

    Color borderColor = Colors.grey.withOpacity(0.25);
    Color backgroundColor = Theme.of(context).cardColor;
    Color badgeColor = Colors.grey.withOpacity(0.15);
    Color badgeTextColor = Colors.black87;

    if (isSelected && !isSubmitted) {
      borderColor = const Color(0xFF4F46E5);
      backgroundColor = const Color(0xFFEEF2FF);
      badgeColor = const Color(0xFF4F46E5);
      badgeTextColor = Colors.white;
    } else if (isSubmitted) {
      if (isCorrect) {
        borderColor = const Color(0xFF10B981);
        backgroundColor = const Color(0xFFECFDF5);
        badgeColor = const Color(0xFF10B981);
        badgeTextColor = Colors.white;
      } else if (isSelected && !isCorrect) {
        borderColor = const Color(0xFFEF4444);
        backgroundColor = const Color(0xFFFEF2F2);
        badgeColor = const Color(0xFFEF4444);
        badgeTextColor = Colors.white;
      } else {
        backgroundColor = Colors.grey.withOpacity(0.04);
      }
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      child: Material(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(16),
        child: InkWell(
          borderRadius: BorderRadius.circular(16),
          onTap: isSubmitted ? null : onTap,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: borderColor, width: isSelected ? 2 : 1),
            ),
            child: Row(
              children: [
                Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                    color: badgeColor,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  alignment: Alignment.center,
                  child: Text(
                    letter,
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                      color: badgeTextColor,
                    ),
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Text(
                    text,
                    style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w500,
                      height: 1.3,
                    ),
                  ),
                ),
                if (isSubmitted && isCorrect)
                  const Icon(Icons.check_circle_rounded, color: Color(0xFF10B981), size: 22)
                else if (isSubmitted && isSelected && !isCorrect)
                  const Icon(Icons.cancel_rounded, color: Color(0xFFEF4444), size: 22),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
