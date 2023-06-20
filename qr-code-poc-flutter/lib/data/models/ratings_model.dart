class RatingsModel {
  List<Data>? data;
  Includes? includes;

  RatingsModel({this.data, this.includes});

  RatingsModel.fromJson(Map<String, dynamic> json) {
    if (json["data"] is List) {
      data = json["data"] == null
          ? null
          : (json["data"] as List).map((e) => Data.fromJson(e)).toList();
    }
    if (json["includes"] is Map) {
      includes =
          json["includes"] == null ? null : Includes.fromJson(json["includes"]);
    }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> _data = <String, dynamic>{};
    if (data != null) {
      _data["data"] = data?.map((e) => e.toJson()).toList();
    }
    if (includes != null) {
      _data["includes"] = includes?.toJson();
    }
    return _data;
  }
}

class Includes {
  List<Messages>? messages;
  List<Participants>? participants;
  List<dynamic>? attachments;

  Includes({this.messages, this.participants, this.attachments});

  Includes.fromJson(Map<String, dynamic> json) {
    if (json["messages"] is List) {
      messages = json["messages"] == null
          ? null
          : (json["messages"] as List)
              .map((e) => Messages.fromJson(e))
              .toList();
    }
    if (json["participants"] is List) {
      participants = json["participants"] == null
          ? null
          : (json["participants"] as List)
              .map((e) => Participants.fromJson(e))
              .toList();
    }
    if (json["attachments"] is List) {
      attachments = json["attachments"] ?? [];
    }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> _data = <String, dynamic>{};
    if (messages != null) {
      _data["messages"] = messages?.map((e) => e.toJson()).toList();
    }
    if (participants != null) {
      _data["participants"] = participants?.map((e) => e.toJson()).toList();
    }
    if (attachments != null) {
      _data["attachments"] = attachments;
    }
    return _data;
  }
}

class Participants {
  String? id;
  String? profileId;
  String? addedBy;
  String? status;

  Participants({this.id, this.profileId, this.addedBy, this.status});

  Participants.fromJson(Map<String, dynamic> json) {
    if (json["id"] is String) {
      id = json["id"];
    }
    if (json["profileId"] is String) {
      profileId = json["profileId"];
    }
    if (json["addedBy"] is String) {
      addedBy = json["addedBy"];
    }
    if (json["status"] is String) {
      status = json["status"];
    }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> _data = <String, dynamic>{};
    _data["id"] = id;
    _data["profileId"] = profileId;
    _data["addedBy"] = addedBy;
    _data["status"] = status;
    return _data;
  }
}

class Messages {
  String? summary;
  int? status;
  String? description;
  String? id;

  Messages({this.summary, this.status, this.description, this.id});

  Messages.fromJson(Map<String, dynamic> json) {
    if (json["summary"] is String) {
      summary = json["summary"];
    }
    if (json["status"] is int) {
      status = json["status"];
    }
    if (json["description"] is String) {
      description = json["description"];
    }
    if (json["id"] is String) {
      id = json["id"];
    }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> _data = <String, dynamic>{};
    _data["summary"] = summary;
    _data["status"] = status;
    _data["description"] = description;
    _data["id"] = id;
    return _data;
  }
}

class Data {
  dynamic id;
  dynamic rating;
  String? createdBy;
  dynamic status;
  dynamic summary;
  dynamic description;
  dynamic messageIds;
  String? createdAt;

  Data(
      {this.id,
      this.rating,
      this.createdBy,
      this.status,
      this.summary,
      this.description,
      this.messageIds,
      this.createdAt});

  Data.fromJson(Map<String, dynamic> json) {
    id = json["id"];
    rating = json["rating"];
    if (json["createdBy"] is String) {
      createdBy = json["createdBy"];
    }
    status = json["status"];
    summary = json["summary"];
    description = json["description"];
    messageIds = json["messageIds"];
    if (json["createdAt"] is String) {
      createdAt = json["createdAt"];
    }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> _data = <String, dynamic>{};
    _data["id"] = id;
    _data["rating"] = rating;
    _data["createdBy"] = createdBy;
    _data["status"] = status;
    _data["summary"] = summary;
    _data["description"] = description;
    _data["messageIds"] = messageIds;
    _data["createdAt"] = createdAt;
    return _data;
  }
}
