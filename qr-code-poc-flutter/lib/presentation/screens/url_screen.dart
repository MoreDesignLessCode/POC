import 'package:flutter/material.dart';
import 'package:pg_poc/data/provider/url_provider.dart';
import 'package:pg_poc/presentation/widgets/custom_floating_btn.dart';
import 'package:pg_poc/presentation/widgets/dialogs/qr_generator_dialog.dart';
import 'package:pg_poc/presentation/widgets/dialogs/url_detail_dialog.dart';
import 'package:pg_poc/presentation/widgets/title_appbar.dart';
import 'package:provider/provider.dart';

class URLScreen extends StatelessWidget {
  const URLScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    final urlsProvider = Provider.of<UrlProvider>(context);
    return Scaffold(
      appBar: const CustomTitleAppBar(title: 'URL'),
      body: Padding(
        padding: EdgeInsets.only(
            right: screenSize.width * 0.05,
            left: screenSize.width * 0.05,
            top: screenSize.height * 0.02),
        child: Column(
          children: [
            if (urlsProvider.getIsLoading)
              const Center(child: CircularProgressIndicator())
            else if (urlsProvider.getErrorMessage.isNotEmpty)
              Center(child: Text(urlsProvider.getErrorMessage))
            else
              Flexible(
                child: RefreshIndicator(
                  onRefresh: () => urlsProvider.getAllUrls(),
                  child: ListView.separated(
                    itemCount: urlsProvider.urlsResponseList.length,
                    separatorBuilder: (context, index) =>
                        const SizedBox(height: 8.0),
                    itemBuilder: (context, index) {
                      return GestureDetector(
                        onTap: () {
                          showDialog(
                              context: context,
                              builder: (context) {
                                return URLdetailDialog(
                                  screenSize: screenSize,
                                  compactURL: urlsProvider
                                      .urlsResponseList[index]["compactUrl"]
                                      .toString(),
                                  compressedURL: urlsProvider
                                      .urlsResponseList[index]["compressedUrl"]
                                      .toString(),
                                  createdBy: urlsProvider
                                      .urlsResponseList[index]["createdBy"]
                                      .toString(),
                                  id: urlsProvider.urlsResponseList[index]["id"]
                                      .toString(),
                                  originalURL: urlsProvider
                                      .urlsResponseList[index]["originalUrl"]
                                      .toString(),
                                );
                              });
                        },
                        child: Card(
                          child: Container(
                            width: 300,
                            padding: const EdgeInsets.all(10),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'ID: ',
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 16,
                                  ),
                                ),
                                const SizedBox(height: 5),
                                Text(
                                  urlsProvider.urlsResponseList[index]["id"],
                                  style: const TextStyle(fontSize: 14),
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                ),
                                const SizedBox(height: 20),
                                const Text(
                                  'URL: ',
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 16,
                                  ),
                                ),
                                const SizedBox(height: 5),
                                Text(
                                  urlsProvider.urlsResponseList[index]
                                          ["originalUrl"]
                                      .toString(),
                                  style: const TextStyle(fontSize: 14),
                                  maxLines: 10,
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
              ),
          ],
        ),
      ),
      floatingActionButton:
          Column(mainAxisAlignment: MainAxisAlignment.end, children: [
        CustomFloatingActionButton(
            title: 'Compact',
            icon: Icons.view_compact_alt,
            onPressed: () {
              //TODO add dialog
            }),
        const SizedBox(height: 12.0),
        CustomFloatingActionButton(
          title: 'Compress',
          icon: Icons.compress,
          onPressed: () {
            //TODO add dialog
          },
        )
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
