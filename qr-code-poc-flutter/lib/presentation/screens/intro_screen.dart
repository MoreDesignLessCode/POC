import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:pg_poc/data/provider/qrcode_provider.dart';
import 'package:pg_poc/data/provider/ratings_provider.dart';
import 'package:pg_poc/data/provider/url_provider.dart';
import 'package:pg_poc/presentation/colors.dart';
import 'package:provider/provider.dart';

class IntroScreen extends StatelessWidget {
  const IntroScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final Size screenSize = MediaQuery.of(context).size;
    return Scaffold(
      backgroundColor: Colors.black,
      body: Container(
        decoration: const BoxDecoration(
            image: DecorationImage(
                image: AssetImage('assets/blue_abstract.jpg'),
                fit: BoxFit.cover)),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            SvgPicture.asset(
              'assets/P_G_Logo.svg',
              width: 130,
            ),
            const Text(
              'Welcome to the \nDemo App',
              textAlign: TextAlign.center,
              style: TextStyle(
                color: kHomeScreenHeadingColor,
                fontWeight: FontWeight.bold,
                fontSize: 24,
              ),
            ),
            Padding(
              padding:
                  EdgeInsets.symmetric(horizontal: screenSize.width * 0.05),
              child: const Text(
                'You can find QR code generator \nwhich generates QR code for given GS1 and normal URLs. Rating which helps to submit feedbacks and ratings for a given product',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w500,
                  color: kHomeScreenDescriptionColor,
                ),
              ),
            ),
            const Text(
              'Overview',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                color: kHomeScreenHeadingColor,
                fontSize: 20,
              ),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                  backgroundColor: kDefaultDarkBlueColor,
                  shadowColor: Colors.black,
                  shape: const CircleBorder(),
                  fixedSize: const Size(80, 80)),
              child: const Icon(Icons.keyboard_arrow_right),
              onPressed: () async {
                Navigator.pushNamed(context, 'home_screen');
                // To avoid async gaps, qrProvider is defined before a async op, (await)
                final qrProvider =
                    Provider.of<QRcodeProvider>(context, listen: false);
                final urlsProvider =
                    Provider.of<UrlProvider>(context, listen: false);
                await Provider.of<RatingsProvider>(context, listen: false)
                    .getAllRatings();
                await qrProvider.getAllQRCodes();
                await urlsProvider.getAllUrls();
              },
            ),
          ],
        ),
      ),
    );
  }
}
