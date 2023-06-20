import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:intl/intl.dart';
import 'package:pg_poc/data/models/ratings_model.dart';
import 'package:http/http.dart' as http;
import 'package:pg_poc/utils/apis.dart';

class RatingsProvider extends ChangeNotifier {
  // RatingsModel? _ratings;
  // RatingsModel? get ratings => _ratings;

  bool isLoading = false;
  String _errorMessage = '';

  String get errorMessage => _errorMessage;

  //Data for UI
  int? ratingsCount = 0;
  double overallRating = 0.0;

  List ratingResponseList = [];
  List dateList = [];

  Future<void> getAllRatings() async {
    isLoading = true;
    _errorMessage = '';
    notifyListeners();

    try {
      final response = await http.get(Uri.parse(ApiURL.getAllRatingsURL));
      if (response.statusCode == 200) {
        final jsonData = jsonDecode(response.body);
        ratingResponseList = jsonData["data"];
        print(ratingResponseList);
        overallRating = calculateOverallRating(ratingResponseList);
        createDateList(ratingResponseList);

        // _ratings = RatingsModel.fromJson(jsonData);
        // ratingsCount = _ratings?.data?.length;
      } else {
        _errorMessage = 'Something went wrong, try again later';
      }
    } catch (e) {
      _errorMessage = e.toString();
      print(e);
    }
    isLoading = false;
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
}
