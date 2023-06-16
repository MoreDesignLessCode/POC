import 'package:flutter/material.dart';
import 'package:pg_poc/provider/screen_provider.dart';
import 'package:pg_poc/widgets/custom_navigation.dart';
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
  ];

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      bottomNavigationBar: const CustomNavigatonBar(),
      body: screens[Provider.of<ScreenProvider>(context).getScreenIndex],
    );
  }
}
