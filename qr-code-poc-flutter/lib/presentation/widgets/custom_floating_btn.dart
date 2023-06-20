import 'package:flutter/material.dart';

class CustomFloatingActionButton extends StatelessWidget {
  const CustomFloatingActionButton({
    required this.icon,
    required this.onPressed,
    required this.title,
    super.key,
  });

  final IconData icon;
  final VoidCallback onPressed;
  final String title;

  @override
  Widget build(BuildContext context) {
    return FilledButton(
      onPressed: onPressed,
      child: ButtonTheme(
        child: SizedBox(
          height: 55,
          width: 135,
          child: Center(
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                Icon(icon),
                Text(title),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
