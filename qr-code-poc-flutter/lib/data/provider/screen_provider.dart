import 'package:flutter/material.dart';

class ScreenProvider extends ChangeNotifier {
  int _setScreenIndex = 0;

  int get getScreenIndex => _setScreenIndex;

  void setScreenIndex(int index) {
    _setScreenIndex = index;
    notifyListeners();
  }
}
