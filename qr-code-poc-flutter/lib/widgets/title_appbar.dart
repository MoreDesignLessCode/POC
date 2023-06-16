import 'package:flutter/material.dart';

class CustomTitleAppBar extends StatelessWidget implements PreferredSizeWidget {
  const CustomTitleAppBar({super.key, required this.title});

  final String title;

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    return SafeArea(
      child: Padding(
          padding: EdgeInsets.only(
            top: 70,
            left: screenSize.width * 0.05,
          ),
          child: Text(
            title,
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 24,
            ),
          )),
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(120);
}
