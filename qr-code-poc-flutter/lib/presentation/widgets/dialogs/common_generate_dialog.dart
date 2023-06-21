import 'package:flutter/material.dart';

class CommonGenerateDialog extends StatelessWidget {
  const CommonGenerateDialog({
    super.key,
    required this.screenSize,
    required this.buttonTitle,
    required this.dialogTitle,
  });

  final String buttonTitle;
  final String dialogTitle;
  final Size screenSize;
  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20.0)), //this right here
      child: SizedBox(
        // height: screenSize.height * 0.5,
        // width: screenSize.width * 0.8,
        child: Padding(
          padding: const EdgeInsets.all(12.0),
          child: SingleChildScrollView(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Text(dialogTitle),
                    ),
                    IconButton(
                        onPressed: () => Navigator.pop(context),
                        icon: const Icon(Icons.close))
                  ],
                ),
                const Padding(
                  padding: EdgeInsets.all(8.0),
                  child: TextField(
                    decoration:
                        InputDecoration(hintText: 'https://example.com'),
                  ),
                ),
                ElevatedButton(onPressed: () {}, child: Text(buttonTitle))
              ],
            ),
          ),
        ),
      ),
    );
  }
}
