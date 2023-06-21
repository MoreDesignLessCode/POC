import 'package:flutter/material.dart';
import 'package:pg_poc/data/provider/qrcode_provider.dart';
import 'package:pg_poc/presentation/styles.dart';
import 'package:pg_poc/presentation/widgets/custom_floating_btn.dart';
import 'package:pg_poc/presentation/widgets/dialogs/common_generate_dialog.dart';
import 'package:pg_poc/presentation/widgets/title_appbar.dart';
import 'package:provider/provider.dart';

class QRcodeScreen extends StatelessWidget {
  const QRcodeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    final qrCodeProvider = Provider.of<QRcodeProvider>(context);
    return Scaffold(
      appBar: const CustomTitleAppBar(title: 'QRcode'),
      body: Padding(
        padding: EdgeInsets.only(
            right: screenSize.width * 0.05,
            left: screenSize.width * 0.05,
            top: screenSize.height * 0.02),
        child: Column(
          children: [
            if (qrCodeProvider.getIsLoading)
              const Center(child: CircularProgressIndicator())
            else if (qrCodeProvider.getErrorMessage.isNotEmpty)
              Center(child: Text(qrCodeProvider.getErrorMessage))
            else
              Flexible(
                child: RefreshIndicator(
                  onRefresh: () => qrCodeProvider.getAllQRCodes(),
                  child: ListView.separated(
                    separatorBuilder: (context, index) =>
                        const SizedBox(height: 8.0),
                    itemCount: qrCodeProvider.qrCodeResponseList.length,
                    itemBuilder: (context, index) {
                      return Card(
                        child: Padding(
                          padding: const EdgeInsets.all(12.0),
                          child: SizedBox(
                            // height: 200,
                            width: screenSize.width * 0.9,
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                QRcodeCardContent(
                                    id: qrCodeProvider.qrCodeResponseList[index]
                                        ["id"],
                                    createdBy: qrCodeProvider
                                        .qrCodeResponseList[index]["createdBy"],
                                    url: qrCodeProvider
                                        .qrCodeResponseList[index]['url'],
                                    screenSize: screenSize),
                                Container(
                                    color: Colors.amber,
                                    width: 120,
                                    child: Image.memory(qrCodeProvider
                                        .generateImageData(index: index)))
                              ],
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ),
          ],
        ),
      ),
      floatingActionButton: CustomFloatingActionButton(
          icon: Icons.qr_code,
          title: 'Generate',
          onPressed: () {
            showDialog(
              context: context,

              //TODO change commongeneratedlog to qr code generator dialog
              builder: (context) => CommonGenerateDialog(
                  screenSize: screenSize,
                  buttonTitle: 'Generate',
                  dialogTitle: 'QR-code generator'),
            );
          }),
    );
  }
}

class QRcodeCardContent extends StatelessWidget {
  const QRcodeCardContent({
    required this.id,
    required this.createdBy,
    required this.url,
    super.key,
    required this.screenSize,
  });

  final String id, createdBy, url;
  final Size screenSize;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(left: 5.0),
      width: screenSize.width * 0.46,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('ID :', style: kQRcodeCardTitleStyle),
          Text(id,
              style: kQRcodeCardBodyTextStyle, overflow: TextOverflow.ellipsis),
          Divider(color: Theme.of(context).dividerColor),
          const Text('Created By :', style: kQRcodeCardTitleStyle),
          Text(createdBy,
              style: kQRcodeCardBodyTextStyle, overflow: TextOverflow.ellipsis),
          Divider(color: Theme.of(context).dividerColor),
          const Text('URL :', style: kQRcodeCardTitleStyle),
          Text(
            url,
            style: kQRcodeCardBodyTextStyle,
            maxLines: 14,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }
}
