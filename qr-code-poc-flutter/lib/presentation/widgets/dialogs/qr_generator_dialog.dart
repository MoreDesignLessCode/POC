import 'package:flutter/material.dart';
import 'package:pg_poc/data/provider/qrcode_provider.dart';
import 'package:pg_poc/presentation/widgets/custom_textfield.dart';
import 'package:provider/provider.dart';

class QRcodeGeneratorDialog extends StatefulWidget {
  QRcodeGeneratorDialog({
    super.key,
    required this.screenSize,
    // required this.buttonTitle,
    // required this.dialogTitle,
  });

  // final String buttonTitle;
  // final String dialogTitle;
  final Size screenSize;

  @override
  State<QRcodeGeneratorDialog> createState() => _QRcodeGeneratorDialogState();
}

class _QRcodeGeneratorDialogState extends State<QRcodeGeneratorDialog> {
  final TextEditingController linkController = TextEditingController();

  final List<String> errorCorrectionList = ['L', 'M', 'Q', 'H'];
  String selectedErrCorrectionValue = 'M';

  final List<int> maskingList = [1, 2, 3, 4, 5, 6, 7];
  int selectedMaskingValue = 2;

  final TextEditingController quiteZoneController = TextEditingController();

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
            reverse: true,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Padding(
                      padding: EdgeInsets.all(8.0),
                      child: Text('QR-code generator',
                          style: TextStyle(fontWeight: FontWeight.bold)),
                    ),
                    IconButton(
                        onPressed: () => Navigator.pop(context),
                        icon: const Icon(Icons.close))
                  ],
                ),
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: CustomTextField(
                    hintText: 'http://example.com',
                    labelText: 'Link',
                    prefixIcon: Icons.link,
                    controller: linkController,
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Error Correction Level'),
                      DropdownButton(
                          value: selectedErrCorrectionValue,
                          items: errorCorrectionList
                              .map<DropdownMenuItem<String>>((String value) {
                            return DropdownMenuItem<String>(
                              value: value,
                              child: Text(value),
                            );
                          }).toList(),
                          onChanged: (v) {
                            setState(
                                () => selectedErrCorrectionValue = v ?? 'M');
                          }),
                    ],
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Masking'),
                      DropdownButton(
                          value: selectedMaskingValue,
                          items: maskingList
                              .map<DropdownMenuItem<int>>((int value) {
                            return DropdownMenuItem<int>(
                              value: value,
                              child: Text(value.toString()),
                            );
                          }).toList(),
                          onChanged: (v) {
                            setState(() => selectedMaskingValue = v ?? 2);
                          }),
                    ],
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Row(
                    children: [
                      const Text('QuiteZone'),
                      const SizedBox(width: 10),
                      Flexible(
                          child: TextField(
                        decoration: const InputDecoration(hintText: 'integers'),
                        controller: quiteZoneController,
                        maxLines: null,
                        keyboardType: TextInputType.number,
                      ))
                    ],
                  ),
                ),
                ElevatedButton(
                  onPressed: () async {
                    await Provider.of<QRcodeProvider>(context, listen: false)
                        .postQrCode(
                      link: linkController.text,
                      errCorrectionLevel: selectedErrCorrectionValue,
                      masking: selectedMaskingValue,
                      quiteZoneValue: quiteZoneController.text,
                    );

                    if (Provider.of<QRcodeProvider>(context, listen: false)
                        .postIsLoading) {
                      const SnackBar snackBar =
                          SnackBar(content: Text('posting'));
                      ScaffoldMessenger.of(context).showSnackBar(snackBar);
                    }
                    if (Provider.of<QRcodeProvider>(context, listen: false)
                        .postErrorMessage
                        .isEmpty) {
                      const SnackBar snackBar =
                          SnackBar(content: Text('posted successfully'));
                      ScaffoldMessenger.of(context).showSnackBar(snackBar);
                      Provider.of<QRcodeProvider>(context, listen: false)
                          .getAllQRCodes();
                    } else {
                      const SnackBar snackBar =
                          SnackBar(content: Text('failed to post'));
                      ScaffoldMessenger.of(context).showSnackBar(snackBar);
                    }
                    Navigator.pop(context);
                  },
                  child: const Text('Generate'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
