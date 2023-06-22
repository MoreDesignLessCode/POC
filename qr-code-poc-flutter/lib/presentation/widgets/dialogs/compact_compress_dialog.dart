import 'package:flutter/material.dart';
import 'package:pg_poc/data/provider/url_provider.dart';
import 'package:pg_poc/presentation/widgets/custom_textfield.dart';
import 'package:provider/provider.dart';

class CompactCompressDialog extends StatelessWidget {
  CompactCompressDialog({
    super.key,
    required this.title,
    required this.screenSize,
    required this.dialogType,
    this.buttonTitle = "Generate",
  });
  final String title;
  final Size screenSize;
  final String buttonTitle;
  final String dialogType;

  final TextEditingController linkController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20.0)),
      child: SizedBox(
        width: screenSize.width * 0.8,
        // height: screenSize.height * 0.5,
        child: Padding(
          padding: const EdgeInsets.all(12.0),
          child: SingleChildScrollView(
            reverse: true,
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                    const CloseButton(),
                  ],
                ),
                SizedBox(height: screenSize.height * 0.01),
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      CustomTextField(
                        maxLines: null,
                        labelText: 'link',
                        prefixIcon: Icons.add,
                        controller: linkController,
                        hintText: 'http://example.com',
                      ),
                      SizedBox(height: screenSize.height * 0.025),
                      ElevatedButton(
                          onPressed: () async {
                            // to avoid the async gaps, defined before using them below
                            final urlProvider = Provider.of<UrlProvider>(
                                context,
                                listen: false);
                            final scaffoldMessenger =
                                ScaffoldMessenger.of(context);
                            final navigatorPop = Navigator.pop(context);

                            if (dialogType == "compact") {
                              await urlProvider.postCompactURL(
                                  link: linkController.text);
                              if (urlProvider.postCompactIsLoading) {
                                const SnackBar snackBar =
                                    SnackBar(content: Text('posting'));
                                scaffoldMessenger.showSnackBar(snackBar);
                              }
                              if (urlProvider.postCompactErrorMessage.isEmpty) {
                                const SnackBar snackBar = SnackBar(
                                    content: Text('posted successfully'));
                                scaffoldMessenger.showSnackBar(snackBar);
                                urlProvider.getAllUrls();
                              } else {
                                const SnackBar snackBar =
                                    SnackBar(content: Text('failed to post'));
                                scaffoldMessenger.showSnackBar(snackBar);
                              }
                            } else if (dialogType == "compress") {
                              await urlProvider.postCompressURL(
                                  link: linkController.text);
                              if (urlProvider.postCompressIsLoading) {
                                const SnackBar snackBar =
                                    SnackBar(content: Text('posting'));
                                scaffoldMessenger.showSnackBar(snackBar);
                              }
                              if (urlProvider
                                  .postCompressErrorMessage.isEmpty) {
                                const SnackBar snackBar = SnackBar(
                                    content: Text('posted successfully'));
                                scaffoldMessenger.showSnackBar(snackBar);
                                urlProvider.getAllUrls();
                              } else {
                                const SnackBar snackBar =
                                    SnackBar(content: Text('failed to post'));
                                scaffoldMessenger.showSnackBar(snackBar);
                              }
                            }

                            navigatorPop;
                          },
                          child: Text(buttonTitle)),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
