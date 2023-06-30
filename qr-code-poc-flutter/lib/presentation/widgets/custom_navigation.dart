import 'package:flutter/material.dart';
import 'package:pg_poc/data/provider/screen_provider.dart';
import 'package:provider/provider.dart';

class CustomNavigationBar extends StatelessWidget {
  const CustomNavigationBar({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    final screenProvider = Provider.of<ScreenProvider>(context);
    return NavigationBar(
      selectedIndex: screenProvider.getScreenIndex,
      onDestinationSelected: (index) {
        screenProvider.setScreenIndex(index);
      },
      // backgroundColor: Color(0xFF2D58BF),
      destinations: const [
        NavigationDestination(
          icon: Icon(Icons.star_half),
          label: 'Rating',
          tooltip: 'Rating',
        ),
        NavigationDestination(
          icon: Icon(Icons.qr_code_2),
          label: 'QRcode',
          tooltip: 'QRcode Generator',
        ),
        NavigationDestination(
          icon: Icon(Icons.link),
          label: 'Url',
          tooltip: 'Url',
        ),
      ],
    );
  }
}
