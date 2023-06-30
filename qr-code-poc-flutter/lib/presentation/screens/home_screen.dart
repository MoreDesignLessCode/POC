import 'package:flutter/material.dart';
import 'package:pg_poc/data/provider/screen_provider.dart';
import 'package:pg_poc/presentation/screens/ad_butlar.dart';
import 'package:pg_poc/presentation/screens/ad_screen.dart';
import 'package:pg_poc/presentation/screens/intro_screen.dart';
import 'package:pg_poc/presentation/widgets/custom_navigation.dart';
import 'package:provider/provider.dart';

import 'qrcode_screen.dart';
import 'rating_screen.dart';
import 'url_screen.dart';

class HomeScreen extends StatelessWidget {
  HomeScreen({Key? key}) : super(key: key);

  final List<Widget> screens = [
    RatingScreen(),
    QRcodeScreen(),
    URLScreen(),
    AdScreen(),
    AdButlar(),
  ];

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      bottomNavigationBar: const CustomNavigationBar(),
      body: screens[Provider.of<ScreenProvider>(context).getScreenIndex],
    );
  }
}
