import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:pg_poc/styles.dart';

class URLdetailDialog extends StatelessWidget {
  URLdetailDialog({
    super.key,
    required this.screenSize,
    required this.id,
    required this.originalURL,
    required this.createdBy,
    required this.compactURL,
    required this.compressedURL,
  });

  final Size screenSize;
  final String id;
  final String originalURL;
  final String createdBy;
  final String compactURL;
  final String compressedURL;

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20.0)), //this right here
      child: SizedBox(
        height: screenSize.height * 0.75,
        width: screenSize.width * 0.8,
        child: Padding(
          padding: const EdgeInsets.all(12.0),
          child: SingleChildScrollView(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    IconButton(
                        onPressed: () => Navigator.pop(context),
                        icon: const Icon(Icons.close))
                  ],
                ),
                const Text('ID: ', style: kUrlScreenCardTitleStyle),
                CopyToClipboardContainer(bodyText: id),
                // const SizedBox(height: 30),
                const Text('Original URL: ', style: kUrlScreenCardTitleStyle),
                CopyToClipboardContainer(bodyText: originalURL),

                const Text('Created By: ', style: kUrlScreenCardTitleStyle),
                CopyToClipboardContainer(bodyText: createdBy),

                const Text('Compact URL: ', style: kUrlScreenCardTitleStyle),
                CopyToClipboardContainer(
                  bodyText: compactURL,
                  isClipboardEnabled: true,
                ),

                const Text('Compressed URL: ', style: kUrlScreenCardTitleStyle),
                CopyToClipboardContainer(
                  bodyText: compressedURL,
                  isClipboardEnabled: true,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class CopyToClipboardContainer extends StatelessWidget {
  CopyToClipboardContainer({
    super.key,
    required this.bodyText,
    this.isClipboardEnabled = false,
  });

  bool isClipboardEnabled;
  final String bodyText;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      margin: EdgeInsets.all(20),
      padding: EdgeInsets.all(20),
      decoration: BoxDecoration(
        border: Border.all(color: Colors.white),
        borderRadius: BorderRadius.circular(5),
      ),
      child: Column(
        children: [
          SelectableText(
            bodyText,
            style: kUrlScreenCardBodyTextStyle,
            // showCursor: true,
          ),
          Visibility(
            visible: isClipboardEnabled,
            child: IconButton(
                onPressed: () async =>
                    await Clipboard.setData(ClipboardData(text: bodyText)),
                icon: const Icon(Icons.copy)),
          )
        ],
      ),
    );
  }
}
