import 'package:flutter/material.dart';

class CustomTextField extends StatelessWidget {
  final String labelText;
  final IconData prefixIcon;
  final IconData suffixIcon;
  final bool obscureText;
  final TextEditingController controller;
  final TextInputType keyboardType;
  final TextInputAction textInputAction;
  final void Function(String)? onChanged;
  final int? maxLines;
  final String? hintText;

  const CustomTextField({
    Key? key,
    required this.labelText,
    required this.prefixIcon,
    this.suffixIcon = Icons.abc,
    this.obscureText = false,
    required this.controller,
    this.keyboardType = TextInputType.text,
    this.textInputAction = TextInputAction.done,
    this.onChanged,
    this.maxLines,
    this.hintText,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return TextField(
      maxLines: maxLines,
      controller: controller,
      keyboardType: keyboardType,
      textInputAction: textInputAction,
      onChanged: onChanged,
      obscureText: obscureText,
      decoration: InputDecoration(
        hintText: hintText,
        labelText: labelText,
        prefixIcon: Icon(prefixIcon),
        suffixIcon: suffixIcon != Icons.abc ? Icon(suffixIcon) : null,
        border: const OutlineInputBorder(),
        focusedBorder: OutlineInputBorder(
          borderSide: BorderSide(
            color: Theme.of(context).colorScheme.primary,
          ),
        ),
        enabledBorder: OutlineInputBorder(
          borderSide: BorderSide(
            color: Theme.of(context).colorScheme.onSurface.withOpacity(0.5),
          ),
        ),
        labelStyle: TextStyle(
          color: Theme.of(context).colorScheme.onSurface.withOpacity(0.5),
        ),
      ),
    );
  }
}
