import 'dart:convert';
import 'dart:math';

import 'package:flutter/foundation.dart';

import 'package:http/http.dart' as http;
// import 'package:pg_poc/data/models/qrcodes_model.dart';
import 'package:pg_poc/utils/apis.dart';

class QRcodeProvider extends ChangeNotifier {
  bool getIsLoading = false;
  String getErrorMessage = '';
  // QRCodeModel? qrcodeDetails;
  bool postIsLoading = false;
  String postErrorMessage = '';

  List<dynamic> qrCodeResponseList = [];

  Future<void> getAllQRCodes() async {
    getIsLoading = true;
    getErrorMessage = '';

    try {
      final response = await http.get(Uri.parse(ApiURL.getAllQrURL));
      if (response.statusCode == 200) {
        final jsonData = await jsonDecode(response.body);
        qrCodeResponseList = jsonData;
        // qrcodeDetails = QRCodeModel.fromJson(jsonData);
        // print(qrCodeResponseList);
      } else {
        getErrorMessage = 'something went wrong, try again later';
      }
    } catch (e) {
      getErrorMessage = e.toString();
      print(e);
    }
    getIsLoading = false;
    notifyListeners();
  }

  // decode base64 img func
  // use this func on the ui with corresponding index
  Uint8List generateImageData({int index = 0}) {
    String base64Image = qrCodeResponseList[index]["location"];
    String encodedImage = base64Image.split(",").last;
    Uint8List imageBytes = base64Decode(encodedImage);
    return imageBytes;
  }

  Future<void> postQrCode({
    required String errCorrectionLevel,
    required int masking,
    required String quiteZoneValue,
    required String link,
  }) async {
    var body = {
      'location': link,
    };

    var queryParameters = {
      'errorCorrectionLevel': errCorrectionLevel.toString(),
      'maskPattern': masking.toString(),
      'quiteZone': quiteZoneValue.toString(),
    };

    var url = Uri.parse(ApiURL.postQRcodeURL)
        .replace(queryParameters: queryParameters);

    var jsonBody = json.encode(body);
    var headers = {
      'Content-Type': 'application/json',
    };

    postIsLoading = true;
    postErrorMessage = '';
    try {
      var response = await http.post(url, body: jsonBody, headers: headers);

      if (response.statusCode == 201) {
        print('POST request sent successfully');
      } else {
        postErrorMessage = response.statusCode.toString();
        print(
            'Failed to send POST request. Status code: ${response.statusCode}');
      }
    } catch (error) {
      postErrorMessage = error.toString();
      print('Error sending POST request: $error');
    }

    postIsLoading = false;
    notifyListeners();
  }
}
