import 'package:flutter/material.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:pg_poc/colors.dart';
import 'package:pg_poc/extensions.dart';
import 'package:pg_poc/widgets/custom_floating_btn.dart';
import 'package:pg_poc/widgets/title_appbar.dart';

class RatingScreen extends StatelessWidget {
  const RatingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    return Scaffold(
      appBar: const CustomTitleAppBar(title: 'Feedback'),
      body: Padding(
        padding: EdgeInsets.only(
            right: screenSize.width * 0.05,
            left: screenSize.width * 0.05,
            top: screenSize.height * 0.02),
        child: Column(
          children: [
            NeomorphicRatingCard(
              screenSize: screenSize,
              title: 'overall rating',
              minRating: 4,
              maxRating: 5,
            ),
            SizedBox(
              height: screenSize.height * 0.015,
            ),
            Flexible(
              child: ListView.builder(
                shrinkWrap: true,
                itemCount: 5,
                itemBuilder: (context, index) {
                  return Card(
                    child: Padding(
                      padding: EdgeInsets.only(
                        top: screenSize.width * 0.07,
                        right: screenSize.width * 0.07,
                        left: screenSize.width * 0.04,
                        bottom: screenSize.width * 0.05,
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              CircleAvatar(child: Icon(Icons.person_outline)),
                              SizedBox(
                                width: screenSize.width * 0.015,
                              ),
                              Text(
                                'Test',
                                style: TextStyle(
                                    fontSize: 16, fontWeight: FontWeight.bold),
                              ),
                              Spacer(),
                              RatingBarIndicator(
                                rating: 3,
                                itemSize: 20,
                                itemBuilder: (context, index) {
                                  return Icon(
                                    Icons.star,
                                    color: kStarIconColor,
                                  );
                                },
                              ),
                              SizedBox(
                                width: screenSize.width * 0.03,
                              )
                            ],
                          ),
                          Padding(
                            padding: EdgeInsets.symmetric(
                              horizontal: screenSize.width * 0.02,
                              vertical: screenSize.height * 0.01,
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('Posted by on 2023-06-09'),
                                SizedBox(height: 5),
                                Text('new Test'),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: CustomFloatingActionButton(
        icon: Icons.edit,
        title: 'Leave Review',
        onPressed: () {},
      ),
    );
  }
}

// the neomorphic card that stands on top
class NeomorphicRatingCard extends StatelessWidget {
  const NeomorphicRatingCard({
    super.key,
    required this.screenSize,
    required this.title,
    required this.minRating,
    required this.maxRating,
  });

  final Size screenSize;
  final String title;
  final double minRating;
  final double maxRating;
  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12.0),
          color: Theme.of(context).cardColor,
          boxShadow: [
            BoxShadow(
              offset: const Offset(3, 3),
              blurRadius: 2,
              spreadRadius: 1,
              color: context.isDarkMode
                  ? const Color.fromARGB(141, 6, 3, 12)
                  : const Color.fromARGB(255, 223, 223, 223),
            ),
            BoxShadow(
              offset: const Offset(-3, -3),
              blurRadius: 8,
              spreadRadius: 3,
              color: context.isDarkMode
                  ? const Color.fromARGB(38, 12, 6, 20)
                  : const Color.fromARGB(29, 223, 223, 223),
            ),
          ]),
      height: screenSize.height * 0.10,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                title,
                style:
                    const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
              const SizedBox(height: 5),
              Text('$minRating out of $maxRating'),
            ],
          ),
          RatingBarIndicator(
            rating: minRating,
            itemSize: 28,
            itemBuilder: (context, index) {
              return const Icon(
                Icons.star,
                color: kStarIconColor,
              );
            },
          )
        ],
      ),
    );
  }
}
