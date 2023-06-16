import 'package:flutter/material.dart';
import 'package:pg_poc/styles.dart';
import 'package:pg_poc/widgets/custom_floating_btn.dart';
import 'package:pg_poc/widgets/dialogs/common_generate_dialog.dart';
import 'package:pg_poc/widgets/title_appbar.dart';

class QRcodeScreen extends StatelessWidget {
  const QRcodeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    return Scaffold(
      appBar: const CustomTitleAppBar(title: 'QRcode'),
      body: Padding(
        padding: EdgeInsets.only(
            right: screenSize.width * 0.05,
            left: screenSize.width * 0.05,
            top: screenSize.height * 0.02),
        child: ListView.separated(
          separatorBuilder: (context, index) => const SizedBox(height: 8.0),
          itemCount: 5,
          itemBuilder: (context, index) {
            return Card(
              child: Padding(
                padding: const EdgeInsets.all(12.0),
                child: SizedBox(
                  height: 200,
                  width: screenSize.width * 0.9,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      QRcodeCardContent(
                          id: '203423j4l2k3jl2jl3kj4',
                          createdBy: 'michael scott',
                          url: 'https://alksdlakd.com'),
                      //FIXME add qr
                      Container(
                          color: Colors.amber,
                          width: 120,
                          child: Image.asset('assets/blue_abstract.jpg'))
                    ],
                  ),
                ),
              ),
            );
          },
        ),
      ),
      floatingActionButton: CustomFloatingActionButton(
        icon: Icons.qr_code,
        title: 'Generate',
        onPressed: () => showDialog(
          context: context,

          //TODO change commongeneratedlog to qr code generator dialog
          builder: (context) => CommonGenerateDialog(
              screenSize: screenSize,
              buttonTitle: 'Generate',
              dialogTitle: 'QR-code generator'),
        ),
      ),
    );
  }
}

class QRcodeCardContent extends StatelessWidget {
  const QRcodeCardContent({
    required this.id,
    required this.createdBy,
    required this.url,
    super.key,
  });

  final String id, createdBy, url;
  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(left: 5.0),
      width: 240,
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
          Text(url,
              style: kQRcodeCardBodyTextStyle, overflow: TextOverflow.ellipsis),
        ],
      ),
    );
  }
}
