class QRCodeModel {
  String? id;
  String? location;
  String? createdBy;
  String? url;

  QRCodeModel({this.id, this.location, this.createdBy, this.url});

  QRCodeModel.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    location = json['location'];
    createdBy = json['createdBy'];
    url = json['url'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    data['location'] = this.location;
    data['createdBy'] = this.createdBy;
    data['url'] = this.url;
    return data;
  }
}
