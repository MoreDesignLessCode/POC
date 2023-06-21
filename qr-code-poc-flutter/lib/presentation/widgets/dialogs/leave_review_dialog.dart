import 'package:flutter/material.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:pg_poc/data/provider/ratings_provider.dart';
import 'package:pg_poc/presentation/styles.dart';
import 'package:pg_poc/presentation/widgets/custom_textfield.dart';
import 'package:provider/provider.dart';

class LeaveReviewDialog extends StatelessWidget {
  LeaveReviewDialog({
    super.key,
    required this.screenSize,
  });
  TextEditingController summaryController = TextEditingController();
  TextEditingController descriptionController = TextEditingController();
  double rating = 0;
  final Size screenSize;

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
                  children: const [
                    Text(
                      'Leave a Review',
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ),
                    CloseButton(),
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
                        labelText: 'Title',
                        prefixIcon: Icons.add,
                        controller: summaryController,
                      ),
                      SizedBox(height: screenSize.height * 0.025),
                      CustomTextField(
                        labelText: 'Description',
                        prefixIcon: Icons.add,
                        controller: descriptionController,
                      ),
                      SizedBox(height: screenSize.height * 0.025),
                      RatingBar.builder(
                          maxRating: 5,
                          initialRating: 0,
                          // allowHalfRating: true,
                          itemBuilder: (context, index) => const Icon(
                                Icons.star,
                                color: Colors.amber,
                              ),
                          onRatingUpdate: (v) => rating = v),
                      SizedBox(height: screenSize.height * 0.025),
                      ElevatedButton(
                          onPressed: () async {
                            await Provider.of<RatingsProvider>(context,
                                    listen: false)
                                .postRatings(
                              summary: summaryController.text,
                              description: descriptionController.text,
                              rating: rating,
                            );
                            if (Provider.of<RatingsProvider>(context,
                                    listen: false)
                                .postIsLoading) {
                              const SnackBar snackBar =
                                  SnackBar(content: Text('posting'));
                              ScaffoldMessenger.of(context)
                                  .showSnackBar(snackBar);
                            }
                            if (Provider.of<RatingsProvider>(context,
                                    listen: false)
                                .postErrorMessage
                                .isEmpty) {
                              const SnackBar snackBar = SnackBar(
                                  content: Text('posted successfully'));
                              ScaffoldMessenger.of(context)
                                  .showSnackBar(snackBar);
                              Provider.of<RatingsProvider>(context,
                                      listen: false)
                                  .getAllRatings();
                            } else {
                              const SnackBar snackBar =
                                  SnackBar(content: Text('failed to post'));
                              ScaffoldMessenger.of(context)
                                  .showSnackBar(snackBar);
                            }
                            Navigator.pop(context);
                          },
                          child: const Text('Submit'))
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
