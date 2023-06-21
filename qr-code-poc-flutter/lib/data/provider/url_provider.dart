import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:pg_poc/utils/apis.dart';

class UrlProvider extends ChangeNotifier {
  bool getIsLoading = false;
  String getErrorMessage = '';

  List<dynamic> urlsResponseList = [];

  Future<void> getAllUrls() async {
    getIsLoading = true;
    getErrorMessage = '';
    try {
      final response = await http.get(Uri.parse(ApiURL.getAllUrls));
      if (response.statusCode == 200) {
        final jsonData = await jsonDecode(response.body);
        urlsResponseList = jsonData["data"];
      } else {
        getErrorMessage = 'something went wrong';
      }
    } catch (e) {
      getErrorMessage = e.toString();
    }
    getIsLoading = false;
    notifyListeners();
  }
}
