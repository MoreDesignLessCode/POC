import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:pg_poc/utils/apis.dart';

class UrlProvider extends ChangeNotifier {
  bool isLoading = false;
  String errorMessage = '';

  List<dynamic> urlsResponseList = [];

  Future<void> getAllUrls() async {
    isLoading = true;
    errorMessage = '';
    try {
      final response = await http.get(Uri.parse(ApiURL.getAllUrls));
      if (response.statusCode == 200) {
        final jsonData = await jsonDecode(response.body);
        urlsResponseList = jsonData["data"];
      } else {
        errorMessage = 'something went wrong';
      }
    } catch (e) {
      errorMessage = e.toString();
    }
    isLoading = false;
    notifyListeners();
  }
}
