import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:pg_poc/utils/apis.dart';

class UrlProvider extends ChangeNotifier {
  bool getIsLoading = false;
  String getErrorMessage = '';

  bool postCompactIsLoading = false;
  String postCompactErrorMessage = '';
  bool postCompressIsLoading = false;
  String postCompressErrorMessage = '';

  List<dynamic> urlsResponseList = [];

  //GET
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

  //POST
  Future<void> postCompactURL({
    required String link,
  }) async {
    postCompactIsLoading = true;
    postCompactErrorMessage = '';

    try {
      var headers = {
        'Content-Type': 'application/json',
      };
      var body = jsonEncode({"name": link});
      Uri url = Uri.parse(ApiURL.postCompactURL);

      final response = await http.post(url, headers: headers, body: body);
      if (response.statusCode == 201) {
        print('POST request sent successfully');
      } else {
        postCompactErrorMessage = response.statusCode.toString();
      }
    } catch (e) {
      postCompactErrorMessage = e.toString();
      print(e);
    }
    postCompactIsLoading = false;
    notifyListeners();
  }

  Future<void> postCompressURL({
    required String link,
  }) async {
    postCompressIsLoading = true;
    postCompressErrorMessage = '';

    try {
      var headers = {
        'Content-Type': 'application/json',
      };
      var body = jsonEncode({"name": link});
      Uri url = Uri.parse(ApiURL.postCompressURL);

      final response = await http.post(url, headers: headers, body: body);
      if (response.statusCode == 201) {
        print('POST request sent successfully');
      } else {
        postCompressErrorMessage = response.statusCode.toString();
      }
    } catch (e) {
      postCompressErrorMessage = e.toString();
      print(e);
    }
    postCompressIsLoading = false;
    notifyListeners();
  }
}
