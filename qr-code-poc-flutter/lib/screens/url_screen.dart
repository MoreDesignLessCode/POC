import 'package:flutter/material.dart';
import 'package:pg_poc/styles.dart';
import 'package:pg_poc/widgets/dialogs/url_detail_dialog.dart';
import 'package:pg_poc/widgets/title_appbar.dart';

class URLScreen extends StatelessWidget {
  const URLScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    return Scaffold(
      appBar: const CustomTitleAppBar(title: 'URL'),
      body: Padding(
        padding: EdgeInsets.only(
            right: screenSize.width * 0.05,
            left: screenSize.width * 0.05,
            top: screenSize.height * 0.02),
        child: ListView.separated(
          itemCount: 10,
          separatorBuilder: (context, index) => const SizedBox(height: 8.0),
          itemBuilder: (context, index) {
            return GestureDetector(
              onTap: () {
                showDialog(
                    context: context,
                    builder: (context) {
                      return URLdetailDialog(
                        screenSize: screenSize,
                        compactURL: 'asd',
                        compressedURL:
                            'aalskdjlaksd lask djla ks jldkajsld alsk dlajskd lak jsldjalskd lask dlkaslkd jalksjdlaksj ldkajsl dka jlsjdasda sdasd asd asdasd asd asd asd as dasd asd adsa da dsdaaqaqaqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqddddddddddddddddddddddddddddddddddddddd',
                        createdBy: 'asda',
                        id: 'adasd',
                        originalURL: 'asd',
                      );
                    });
              },
              child: Card(
                child: Container(
                  width: 300,
                  padding: EdgeInsets.all(10),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'ID: ',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                      SizedBox(height: 5),
                      Text(
                        'kiy87kjhuhjhiuhuhu99y',
                        style: TextStyle(fontSize: 14),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      SizedBox(height: 20),
                      Text(
                        'URL: ',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                      SizedBox(height: 5),
                      Text(
                        'https://alskdjisdjqkw0qwujdqjd0qw/e2/3.r.comjhljhljhohouhy9otuahdkfjalsjfhahflasflak;als;dasjd;ajsd;asdj;asdjj',
                        style: TextStyle(fontSize: 14),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
        ),
      ),
      floatingActionButton:
          Column(mainAxisAlignment: MainAxisAlignment.end, children: [
        FloatingActionButton(onPressed: () {}),
        const SizedBox(height: 12.0),
        FloatingActionButton(onPressed: () {}),
      ]),
    );
  }
}


// import 'package:flutter/material.dart';

// class CardWithHeadings extends StatelessWidget {
//   @override
//   Widget build(BuildContext context) {
//     return 
//   }
