import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:intl/intl.dart';
import 'package:http/http.dart' as http;
import 'package:pg_poc/utils/apis.dart';

class RatingsProvider extends ChangeNotifier {
  // RatingsModel? _ratings;
  // RatingsModel? get ratings => _ratings;

  bool getIsLoading = false;
  String getErrorMessage = '';

  bool postIsLoading = false;
  String postErrorMessage = '';

  //Data for UI
  int? ratingsCount = 0;
  double overallRating = 0.0;

  List ratingResponseList = [];
  List dateList = [];

  //GET
  Future<void> getAllRatings() async {
    getIsLoading = true;
    getErrorMessage = '';
    notifyListeners();

    try {
      final response = await http.get(Uri.parse(ApiURL.getAllRatingsURL));
      if (response.statusCode == 200) {
        final jsonData = await jsonDecode(response.body);
        ratingResponseList = jsonData["data"];
        overallRating = calculateOverallRating(ratingResponseList);
        createDateList(ratingResponseList);

        // _ratings = RatingsModel.fromJson(jsonData);
        // ratingsCount = _ratings?.data?.length;
      } else {
        getErrorMessage = 'Something went wrong, try again later';
      }
    } catch (e) {
      getErrorMessage = e.toString();
      print(e);
    }
    getIsLoading = false;
    notifyListeners();
  }

  void createDateList(List<dynamic> objectList) {
    if (objectList.isEmpty) {
      return;
    }
    for (Map obj in objectList) {
      if (obj["createdAt"] == null) {
        dateList.add("null");
      } else {
        DateTime dateTime = DateTime.parse(obj["createdAt"].toString());
        String formattedDate = DateFormat('yyyy-MM-dd').format(dateTime);
        dateList.add(formattedDate);
      }
    }
  }

  double calculateOverallRating(List<dynamic> objectList) {
    if (objectList.isEmpty) {
      return 0.0;
    }
    double totalRating = 0.0;
    for (Map obj in objectList) {
      if (obj["rating"] != null) {
        totalRating += obj["rating"].toDouble();
      }
    }
    double value = totalRating / objectList.length;
    return double.parse(value.toStringAsFixed(1));
  }

  //POST
  // Future<void> postRatings() async {}
  Future<void> postRatings({
    double rating = 0,
    String? summary,
    String? description,
  }) async {
    Uri url = Uri.parse(ApiURL.PostRatingURL);

    var headers = {
      'Content-Type': 'application/json',
    };

    var body = jsonEncode({
      "rating": rating,
      "reference":
          "urn:com:pg:api:developer:feedback:v1:rating:388fa1cb-773e-472d-8916-efa5f792ecbb",
      "participants": [
        {
          "profileId": "6083789e-c965-11ed-afa1-0242ac120002",
          "addedBy": "6573fca6-a913-11ed-afa1-0242ac120007",
          "status": "RESPONSIBLE"
        }
      ],
      "messages": {
        "summary": summary,
        "description": description,
        "status": "NEW",
        "createdBy": "6573fca6-a913-11ed-afa1-0242ac120007",
        "attachments": [
          "3a87f3fc-c1a6-11ed-afa1-0242ac120002",
          "f93f0070-c1a5-11ed-afa1-0242ac120002"
        ]
      },
      "tags": [
        {"name": "URN:TICKET:CATEGORY:REGISTRATION"}
      ]
    });

    postErrorMessage = '';
    postIsLoading = true;

    try {
      final response = await http.post(url, headers: headers, body: body);

      if (response.statusCode == 201) {
        postIsLoading = false;
        print('POST request successful');
      } else {
        postErrorMessage = response.statusCode.toString();
        print('Error: ${response.statusCode}');
      }
    } catch (e) {
      postErrorMessage = e.toString();
      print('Exception: $e');
    }
    postErrorMessage = '';
    postIsLoading = true;
  }
}
