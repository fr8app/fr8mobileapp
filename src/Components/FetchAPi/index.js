import { Platform } from "react-native";
import { DataManager } from "./../../Components";
import I18n from "react-native-i18n";
import moment from "moment";
import deviceInfoModule from "react-native-device-info";

// const baseUrl = "https://dev-api.fr8.ai/api/v7/" //new 1 feb 2021 node
// const baseUrl = "http://1.6.98.139:4003/api/v8/" //client url live new  //18 Oct Harry

// public
// const baseUrl = "http://1.6.98.139:4003/api/v8/";

//Dell

const baseUrl = "http://1.6.98.141:2033/api/v8/"

//local
// const baseUrl = "http://192.168.3.174:6002/api/v8/"

// const baseUrl = "http://1.6.98.142:4002/api/v7/" //new 1 feb 2021 node

// const baseUrl = "http://18.205.207.176:3000/api/v2/" //client url live new  //24 march
// const baseUrl = "https://api.fr8.ai/api/v7/" //client url live new  //24 march
// const baseUrl = "http://192.168.3.174:6001/api/v7/" //client url live new  //18 Oct Harry
// const baseUrl = "http://backend-asg-771965392.us-east-2.elb.amazonaws.com/api/v6.1/" //client url live new  //18 Oct Harry
// const baseUrl = "http://192.168.3.173:4000/api/v6.4/" //client url live new  //18 Oct Harry
// const baseUrl = "http://192.168.3.174:6001/api/v7/" //client url live new  //18 Oct Harry
// const baseUrl = "http://192.168.3.120:7000/api/v5.4/" //client url live new  //18 Oct Harry
// const baseUrl="http://BAckend-ASG-771965392.us-east-2.elb.amazonaws.com/api/v6.2/"  //staging
// const baseUrl="http://BAckend-ASG-771965392.us-east-2.elb.amazonaws.com/api/v6.2/"  //production
// const baseUrl="https://api.fr8.ai/api/v6.3/"  //production
// const baseUrl="http://Dev-Backend-ALB-527177003.us-east-2.elb.amazonaws.com/api/v6.2/"  //dev

// Production API Url:-   BAckend-ASG-771965392.us-east-2.elb.amazonaws.com
// Production Website URL:- http://fr8.ai-website-prod.s3-website.us-east-2.amazonaws.com
// Production Admin Url :- http://fr8.ai-website-prod-admin.s3-website.us-east-2.amazonaws.com

// Development API Url:-   Dev-Backend-ALB-527177003.us-east-2.elb.amazonaws.com
// Development Website URL:- http://fr8.ai-website-dev.s3-website.us-east-2.amazonaws.com
// Development Admin Url :- http://fr8.ai-website-dev-admin.s3-website.us-east-2.amazonaws.com

let accessToken = "",
  device_token = "",
  internetStatus = null;


const Fetch = {
  checkInternetConnection(connection) {
    internetStatus = connection;
  },

  //method to set token
  setAccessToken(token) {
    console.log("token", token);
    accessToken = token;
  },
  setDeviceToken(token) {
    device_token = token;
  },
  getAccessToken() {
    DataManager.getAccessToken().then((response) => {
      if (response !== null) {
        accessToken = JSON.parse(response);
      } else {
        accessToken = null;
      }
    });
  },

  reportPost(data) {
    const url = baseUrl + "post/report";
    const body = JSON.stringify(data);
    return Method.dataPost(body, url);
  },
  searchHomeTerminal(data) {
    var url = baseUrl + "terminal/list?search=" + data.terminal_name;
    return Method.dataGet(url);
  },
  homeDetail() {
    var url = baseUrl + "user/homeDetail";
    return Method.dataPost(
      JSON.stringify({
        device_type: Platform.OS === "ios" ? "ios" : "android",
        version: deviceInfoModule.getVersion(),
      }),
      url
    );
  },
  userInTerminal() {
    var url = baseUrl + "terminal/status";
    return Method.dataGet(url);
  },
  fetchNotifictaion(page) {
    var url;
    if (page == 1) {
      url = baseUrl + "notification/list?offset=" + 0 + "&limit=" + 20;
    } else {
      url = baseUrl + "notification/list?offset=" + page + "&limit=" + 20;
    }
    return Method.dataGet(url);
  },
  readNotifictaion(id) {
    var url = baseUrl + "notification/read/" + id;
    return Method.dataGet(url);
  },
  deleteNotifictaion(id) {
    var url = baseUrl + "notification/delete/" + id;
    return Method.dataDelete(url);
  },
  userdetail(id) {
    let url;
    if (id) {
      url = baseUrl + "user/details?user_id=" + id;
    } else {
      url = baseUrl + "user/details";
    }
    return Method.dataGet(url);
  },
  geoFences(lat, long) {
    const url = baseUrl + "geofence/nearest";
    return Method.dataPost(
      JSON.stringify({ latitude: lat, longitude: long, offset: 0, limit: 20 }),
      url
    );
  },
  regionList(list, id) {
    const url = baseUrl + "region/list?" + `user_id=${id}`;
    return Method.dataGet(url);
  },
  regionListSet(list, id) {
    const url = baseUrl + "user/selectRegion?user_id=" + id;
    return Method.dataPost(JSON.stringify({ regions: list }), url);
  },
  appVersionApi() {
    var url = baseUrl + "user/version";
    console.log(url);
    // console.log(Method.dataGet(url),'appVersion response fetch')
    return Method.dataGet(url);
  },

  login(phoneNo, countryCode, locale) {
    let body = JSON.stringify({
      phone_number: phoneNo,
      country_code: "+1",
      language: I18n.currentLocale().includes("es")
        ? "es"
        : I18n.currentLocale().includes("pt")
        ? "pt"
        : I18n.currentLocale().includes("it")
        ? "it"
        : I18n.currentLocale().includes("hi")
        ? "hi"
        : I18n.currentLocale().includes("ph")
        ? "ph"
        : I18n.currentLocale().includes("fr")
        ? "fr"
        : I18n.currentLocale().includes("ko")
        ? "ko"
        : I18n.currentLocale().includes("ru")
        ? "ru"
        : I18n.currentLocale().includes("bn")
        ? "bn"
        : I18n.currentLocale().includes("de")
        ? "de"
        : I18n.currentLocale().includes("zh")
        ? "zh"
        : I18n.currentLocale().includes("vi")
        ? "vi"
        : "en",
      device_type: Platform.OS === "ios" ? "ios" : "android",
      device_token: device_token,
    });
    var url = baseUrl + "user/signIn";
    console.log(body, url);
    return Method.dataPost(body, url);
  },
  dummyUSerCreate() {
    let body = JSON.stringify({
      app_version: deviceInfoModule.getVersion(),
      version: deviceInfoModule.getVersion(),
      device_type: Platform.OS === "ios" ? "ios" : "android",
      device_token: device_token ? device_token : "token",
    });
    var url = baseUrl + "user/createDummyUser";
    console.log(body, url);
    return Method.dataPost(body, url);
  },
  loginwithUserName(
    userName,
    password,
    name,
    email,
    list,
    userId,
    phoneNumber
  ) {
    let body = JSON.stringify({
      phone_number: phoneNumber,
      username: userName,
      password: password,
      language: I18n.currentLocale().includes("es")
        ? "es"
        : I18n.currentLocale().includes("pt")
        ? "pt"
        : I18n.currentLocale().includes("it")
        ? "it"
        : I18n.currentLocale().includes("hi")
        ? "hi"
        : I18n.currentLocale().includes("ph")
        ? "ph"
        : I18n.currentLocale().includes("fr")
        ? "fr"
        : I18n.currentLocale().includes("ko")
        ? "ko"
        : I18n.currentLocale().includes("ru")
        ? "ru"
        : I18n.currentLocale().includes("bn")
        ? "bn"
        : I18n.currentLocale().includes("de")
        ? "de"
        : I18n.currentLocale().includes("zh")
        ? "zh"
        : I18n.currentLocale().includes("vi")
        ? "vi"
        : "en",
      device_type: Platform.OS === "ios" ? "ios" : "android",
      device_token: device_token ? device_token : "token",
      name: name,
      email: email,
      user_id: userId,
      selectedRegions: list,
    });
    var url = baseUrl + "user/userLogin";
    console.log(body, url);
    return Method.dataPost(body, url);
  },
  passwordSet(userName, password) {
    let body = JSON.stringify({
      userName: userName,
      password: password,
      language: I18n.currentLocale().includes("es")
        ? "es"
        : I18n.currentLocale().includes("pt")
        ? "pt"
        : I18n.currentLocale().includes("it")
        ? "it"
        : I18n.currentLocale().includes("hi")
        ? "hi"
        : I18n.currentLocale().includes("ph")
        ? "ph"
        : I18n.currentLocale().includes("fr")
        ? "fr"
        : I18n.currentLocale().includes("ko")
        ? "ko"
        : I18n.currentLocale().includes("ru")
        ? "ru"
        : I18n.currentLocale().includes("bn")
        ? "bn"
        : I18n.currentLocale().includes("de")
        ? "de"
        : I18n.currentLocale().includes("zh")
        ? "zh"
        : I18n.currentLocale().includes("vi")
        ? "vi"
        : "en",
      device_type: Platform.OS === "ios" ? "ios" : "android",
      device_token: device_token ? device_token : "token",
      // selectedRegions:list,
      // user_id:userId,
    });
    var url = baseUrl + "user/setPassword";
    console.log(body, url);
    return Method.dataPost(body, url);
  },
  userExist(userName) {
    let body = JSON.stringify({
      userName: userName,
      device_type: Platform.OS,
    });
    var url = baseUrl + "user/checkUsername";
    console.log(body, url);
    return Method.dataPost(body, url);
  },
  verify(userName, otp, list) {
    let body = JSON.stringify({
      userName: userName,
      otp: otp,
      device_type: Platform.OS,
      selectedRegions: list,
    });
    var url = baseUrl + "user/verifyOtpForPassword";
    console.log(body, url);
    return Method.dataPost(body, url);
  },
  otpVerify(phoneNo, countryCode, code, locale) {
    let body = JSON.stringify({
      phone_number: phoneNo,
      country_code: "+1",
      otp: code,
      language: I18n.currentLocale().includes("es")
        ? "es"
        : I18n.currentLocale().includes("it")
        ? "it"
        : I18n.currentLocale().includes("hi")
        ? "hi"
        : I18n.currentLocale().includes("ph")
        ? "ph"
        : I18n.currentLocale().includes("fr")
        ? "fr"
        : I18n.currentLocale().includes("ko")
        ? "ko"
        : I18n.currentLocale().includes("ru")
        ? "ru"
        : I18n.currentLocale().includes("bn")
        ? "bn"
        : I18n.currentLocale().includes("de")
        ? "de"
        : I18n.currentLocale().includes("zh")
        ? "zh"
        : I18n.currentLocale().includes("pt")
        ? "pt"
        : "en",
      device_type: Platform.OS === "ios" ? "ios" : "android",
      device_token: device_token,
    });
    var url = baseUrl + "user/verifyPhone";
    console.log(body, url);
    return Method.dataPost(body, url);
  },
  deletePostofUser(Data) {
    console.log("hello", Data);
    const url = baseUrl + `post/delete/${Data._id}`;
    return Method.dataDelete(url);
  },
  feedPost(Data) {
    const url = baseUrl + "feed-post";
    let body = new FormData();
    body.append("latitude", Data.id);
    body.append("longitude", Data.pageValue);
    body.append("device_token", device_token);
    return Method.dataPostWithImage(body, url);
  },
  feedPosts(Data) {
    return Method.dataPostWithImage("", Data);
  },
  nearTerminal(Data, extra) {
    if (extra === "direct") {
      const parsedTime = moment()
        .utc()
        .toString();
      const UTctime = moment()
        .utc()
        .toString();
      console.log("UTctimeUTctime", UTctime, parsedTime);
      if (Data.type === "BBFenceEventExitFence") {
        const body = JSON.stringify({
          latitude: Data.latitude,
          longitude: Data.longitude,
          terminal_id: Data.id,
          timestamp: UTctime,
          type: "0",
        });
        const url = baseUrl + "location/add";
        return Method.dataPost(body, url);
      } else {
        const body = JSON.stringify({
          latitude: Data.latitude,
          longitude: Data.longitude,
          terminal_id: Data.id,
          timestamp: parsedTime,
          type: "1",
        });
        const url = baseUrl + "location/add";
        return Method.dataPost(body, url);
      }
    } else {
      const url = baseUrl + "location/multiple";
      return Method.dataPost(JSON.stringify({ location_array: Data }), url);
    }
  },
  updatePhone(phoneNo) {
    let body = JSON.stringify({
      phone_number: phoneNo,
      country_code: "+1",
    });
    var url = baseUrl + "user/edit";

    return Method.dataPut(body, url);
  },

  // Method for register a new user
  register(
    userName,
    firstName,
    lastName,
    email,
    user_type,
    Driver_type,
    countryCode,
    phone_number
  ) {
    let body = JSON.stringify({
      userName: userName,
      firstName: firstName,
      lastName: lastName,
      email: email,
      user_type: user_type,
      driver_type: Driver_type,
      country_code: countryCode,
      language: I18n.currentLocale().includes("es")
        ? "es"
        : I18n.currentLocale().includes("it")
        ? "it"
        : I18n.currentLocale().includes("hi")
        ? "hi"
        : I18n.currentLocale().includes("ph")
        ? "ph"
        : I18n.currentLocale().includes("fr")
        ? "fr"
        : I18n.currentLocale().includes("ko")
        ? "ko"
        : I18n.currentLocale().includes("ru")
        ? "ru"
        : I18n.currentLocale().includes("bn")
        ? "bn"
        : I18n.currentLocale().includes("de")
        ? "de"
        : I18n.currentLocale().includes("zh")
        ? "zh"
        : I18n.currentLocale().includes("pt")
        ? "pt"
        : "en",
      phone_number: phone_number,
      device_type: Platform.OS === "ios" ? "ios" : "android",
      device_token: device_token,
    });
    var url = baseUrl + "user/register";
    return Method.dataPost(body, url);
  },

  // Method for check user exists
  checkUser(user_name, email, phone_number, country_code) {
    let body = JSON.stringify({
      user_name: user_name,
      email: email,
      phone_number: phone_number,
      country_code: country_code[0],
    });
    var url = baseUrl + "check-user";
    return Method.dataPost(body, url);
  },

  // Method for forgot password
  resetPassword(phone_number, password) {
    let body = JSON.stringify({
      phone_number: phone_number,
      password: password,
    });
    var url = baseUrl + "reset-passwords";
    return Method.dataPost(body, url);
  },

  otp(phoneNo, countryCode) {
    let body = JSON.stringify({
      device_type: Platform.OS === "ios" ? "ios" : "android",
      device_token: device_token,
      phone_number: phoneNo,
      country_code: "+1",
      language: I18n.currentLocale().includes("es")
        ? "es"
        : I18n.currentLocale().includes("it")
        ? "it"
        : I18n.currentLocale().includes("hi")
        ? "hi"
        : I18n.currentLocale().includes("ph")
        ? "ph"
        : I18n.currentLocale().includes("fr")
        ? "fr"
        : I18n.currentLocale().includes("ko")
        ? "ko"
        : I18n.currentLocale().includes("ru")
        ? "ru"
        : I18n.currentLocale().includes("bn")
        ? "bn"
        : I18n.currentLocale().includes("de")
        ? "de"
        : I18n.currentLocale().includes("zh")
        ? "zh"
        : I18n.currentLocale().includes("pt")
        ? "pt"
        : "en",
    });
    var url = baseUrl + "user/updatePhone";
    return Method.dataPost(body, url);
  },

  home(lat, long) {
    var url = baseUrl + "terminal/nearest?offset=" + 0 + "&limit=" + 15;
    return Method.dataPost(
      JSON.stringify({
        latitude: lat,
        longitude: long,

        device_type: Platform.OS === "ios" ? "ios" : "android",
        version: deviceInfoModule.getVersion(),
      }),
      url
    );
  },
  onReachEndTerminal(data) {
    var url =
      baseUrl + "terminal/nearest?offset=" + data.offset + "&limit=" + 10;
    return Method.dataPost(
      JSON.stringify({ latitude: data.lat, longitude: data.long }),
      url
    );
  },
  terminalDetail(id, pageValue) {
    var url =
      baseUrl + "terminal/details/" + id + "?offset=" + 0 + "&limit=" + 10;
    return Method.dataGet(url);
  },
  terminalDetails(id, pageValue) {
    var url =
      baseUrl +
      "terminal/details/" +
      id +
      "?offset=" +
      pageValue +
      "&limit=" +
      10;
    return Method.dataGet(url);
  },
  recentLocations() {
    var url = baseUrl + "timeline/lastLocations";
    return Method.dataGet(url);
  },
  favTerminal(list, id) {
    var url = baseUrl + `user/favTerminal?user_id=${id}`;
    return Method.dataPost(
      JSON.stringify({
        regions: list,
      }),
      url
    );
  },
  // userImage(data) {
  //   let body = new FormData();
  //   body.append("profile", {
  //     name: "profile.png",
  //     uri: data.uri,
  //     type: "image/jpeg"
  //   })
  //   const url = baseUrl + 'user/profile'
  //   return Method.dataPutWithImage(body, url);
  // },
  userImage(data) {
    // let body = new FormData();
    // body.append("profile", {
    //   name: "profile.png",
    //   uri: data.uri,
    //   type: "image/jpeg"
    // })
    console.log("data", data);
    let body = JSON.stringify({
      profile: data,
    });
    const url = baseUrl + "user/profile";
    // return Method.dataPutWithImage(body, url);
    return Method.dataPut(body, url);
  },
  videoPost(
    id,
    source,
    thumbnail,
    description,
    screen,
    video,
    location,
    tagUser,
    latitude,
    longitude,
    userId
  ) {
    let body = new FormData();
    var url = userId
      ? baseUrl + `post/create?user_id=${userId}`
      : baseUrl + `post/create`;
    if (screen == "global") {
      // console.log('data with video',id, source, thumbnail, description, screen,video);
      // if(latitude)
      // {
      body.append("latitude", latitude ? latitude : 0);
      // }
      // if(longitude)
      // {
      body.append("longitude", longitude ? longitude : 0);
      // }
      // source.map(x=>{
      body.append("image", JSON.stringify(source));
      // })
      body.append("tag_friends", JSON.stringify(tagUser));
      body.append("post_location", location);
      // body.append("post_location", {
      //   latitude: latitude,
      //   longitude: longitude,
      //   name: location
      // })

      body.append("post_type", "global_post");
      body.append("video", JSON.stringify(video)),
        // body.append("thumbnail_image", thumbnail);
        body.append("description", description);

      body.append("type", "video");
    } else {
      console.log("source", source, video);
      body.append("terminal_id", id);
      body.append("post_type", "terminal");
      body.append("video", {
        name: "video.mp4",
        uri: source.uri,
        type: "video/mp4",
      }),
        // body.append("thumbnail_image", thumbnail);
        body.append("description", description);
      body.append("type", "video");
    }
    return Method.dataPostWithImage(body, url);
  },
  videoPostEdit(
    id,
    source,
    thumbnail,
    description,
    screen,
    video,
    location,
    tagUser,
    _id,
    deletedImagesId,
    isVideoDeleted,
    latitude,
    longitude
  ) {
    let body = new FormData();
    if (screen == "global") {
      // source.map(x => {
      body.append("image", JSON.stringify(source));
      // })
      body.append("tag_friends", JSON.stringify(tagUser));
      body.append("post_location", location);
      // if(latitude)
      // {
      body.append("latitude", latitude ? latitude : 0);
      // }
      // if(longitude)
      // {
      body.append("longitude", longitude ? longitude : 0);
      // }

      // body.append("post_location", {
      //   latitude: latitude,
      //   longitude: longitude,
      //   name: location
      // })
      body.append("post_id", _id);
      body.append("deleted_images", JSON.stringify(deletedImagesId));

      body.append("is_remove_video", isVideoDeleted);
      body.append("post_type", "global_post");
      body.append("video", JSON.stringify(video)),
        // body.append("thumbnail_image", thumbnail);
        body.append("description", description);

      body.append("type", "video");
      var url = baseUrl + "post/edit";
    } else {
      console.log("source", source, video);
      body.append("terminal_id", id);
      body.append("post_type", "terminal");
      body.append("video", {
        name: "video.mp4",
        uri: source.uri,
        type: "video/mp4",
      }),
        // body.append("thumbnail_image", thumbnail);
        body.append("description", description);
      body.append("type", "video");
      var url = baseUrl + "post/edit";
    }
    return Method.dataPostWithImage(body, url);
  },
  createManualRoutePost(
    name,
    location,
    category,
    phoneNumber,
    images,
    videos,
    zoom
  ) {
    console.log("videos", videos);
    let body = new FormData();
    // images.map(x => {
    //   console.log(x, 'image');
    body.append("image", JSON.stringify(images));
    // })
    // videos.map(x => {
    //   console.log(x, 'video');
    body.append("video", JSON.stringify(videos));
    body.append("name", name);
    body.append("address", location);
    body.append("zoom", zoom);
    body.append("phone_number", phoneNumber);
    body.append("category", category);
    var url = baseUrl + "route_post/createManual";
    console.log("body", body);
    return Method.dataPostWithImage(body, url);
  },
  editManualRoutePost(
    id,
    name,
    location,
    category,
    phoneNumber,
    start,
    end,
    distance,
    totalTime,
    navigation
  ) {
    // let body = new FormData();
    let body = JSON.stringify({
      distance: distance,
      minute: totalTime ? totalTime : "0",
      start_time: navigation
        ? start
          ? moment(start)
              .utc()
              .format("YYYY-MM-DDTHH:mm")
          : moment(end)
              .utc()
              .format("YYYY-MM-DDTHH:mm")
        : start,
      end_time: navigation
        ? moment(end)
            .utc()
            .format("YYYY-MM-DDTHH:mm")
        : end,
      route_post_id: id,
      name: name,
      address: location,
      phone_number: phoneNumber,
      category: category,
    });
    // body.append("distance", distance);
    // body.append("minute", totalTime ? totalTime : "0");
    // body.append("start_time", navigation ? start ? moment(start).utc().format("YYYY-MM-DDTHH:mm") : moment(end).utc().format("YYYY-MM-DDTHH:mm") : start);
    // body.append("end_time", navigation ? moment(end).utc().format("YYYY-MM-DDTHH:mm") : end);

    //   body.append('route_post_id', id)
    //   body.append('name', name)
    //   body.append('address', location)
    //   body.append('phone_number',phoneNumber )
    //   body.append('category',category )
    var url = baseUrl + "route_post/edit";

    return Method.dataPut(body, url);
  },

  imagePost(
    id,
    source,
    thumbnail,
    description,
    screen,
    video,
    location,
    tagUser,
    latitude,
    longitude,
    userId
  ) {
    let body = new FormData();
    if (screen == "global") {
      // source.map(x=>{
      body.append("image", JSON.stringify(source));
      // })

      body.append("post_type", "global_post");
      // body.append("video", {
      //   name: "image.jpeg",
      //   uri: source.uri,
      //   type: "image/jpeg",
      // }),
      body.append("type", "image");
      body.append("tag_friends", JSON.stringify(tagUser));
      // body.append("post_location", {
      //   latitude: latitude,
      //   longitude: longitude,
      //   name: location
      // })
      body.append("post_location", location);
      // if(latitude)
      // {
      body.append("latitude", latitude ? latitude : 0);
      // }
      // if(longitude)
      // {
      body.append("longitude", longitude ? longitude : 0);
      // }

      body.append("description", description);
    } else {
      body.append("post_type", "terminal");
      body.append("terminal_id", id);
      body.append("video", {
        name: "image.jpeg",
        uri: source.uri,
        type: "image/jpeg",
      }),
        body.append("type", "image");

      body.append("description", description);
    }
    var url = baseUrl + `post/create?user_id=${userId}`;
    return Method.dataPostWithImage(body, url);
  },
  imagePostEdit(
    id,
    source,
    thumbnail,
    description,
    screen,
    video,
    location,
    tagUser,
    _id,
    deletedImagesId,
    isVideoDeleted,
    latitude,
    longitude
  ) {
    let body = new FormData();

    console.log(
      "data without video",
      id,
      source,
      thumbnail,
      description,
      screen,
      video,
      location,
      tagUser,
      _id,
      "deletedImagesId=",
      deletedImagesId,
      "isVideoDeleted=",
      isVideoDeleted
    );
    // if(latitude)
    // {
    body.append("latitude", latitude ? latitude : 0);
    // }
    // if(longitude)
    // {
    body.append("longitude", longitude ? longitude : 0);
    // }

    body.append("post_id", _id);
    body.append("image", JSON.stringify(source));
    // source.map(x => {
    //   body.append("image", {
    //     name: "image.jpeg",
    //     uri: x.uri.uri,
    //     type: "image/jpeg",
    //   })
    // })
    body.append("deleted_images", JSON.stringify(deletedImagesId));
    body.append("is_remove_video", isVideoDeleted);
    body.append("post_type", "global_post");
    body.append("type", "image");
    body.append("tag_friends", JSON.stringify(tagUser));
    // body.append("post_location", location)
    body.append("post_location", location);

    body.append("description", description);

    console.log("body", body);

    var url = baseUrl + "post/edit";
    return Method.dataPostWithImage(body, url);
  },
  editSharePost(id, description, mainDesc) {
    let body = new FormData();
    body.append("post_id", id);
    body.append("share_description", description);
    body.append("description", mainDesc);

    console.log("body", body);

    var url = baseUrl + "post/edit";
    return Method.dataPostWithImage(body, url);
  },

  likeDislike(id, is_like) {
    let body = JSON.stringify({
      post_id: id,
      is_like: is_like,
    });
    var url = baseUrl + "post/like";
    return Method.dataPost(body, url);
  },

  routeByTerminal(body, id) {
    console.log("data", body);
    // let body = JSON.stringify({
    //    'terminal_id':data.terminal_id
    // })
    var url = baseUrl + "terminal/routePostList?" + "user_id=" + id;
    console.log("body", body);
    return Method.dataPost(body, url);
  },
  checkinByTerminal(body) {
    console.log("data", body);
    // let body = JSON.stringify({
    //    'terminal_id':data.terminal_id
    // })
    var url = baseUrl + "terminal/timelineList";
    console.log("body", body);
    return Method.dataPost(body, url);
  },
  ratingList(body) {
    var url = baseUrl + "terminal/ratingList";
    console.log("body", body);
    return Method.dataPost(body, url);
  },
  terminalRate(id, message, rate) {
    console.log("id,message ,rate", id, message, rate);
    let body = JSON.stringify({
      terminal_id: id,
      rating: rate,
      review: message,
    });
    var url = baseUrl + "rating/add";
    return Method.dataPost(body, url);
  },
  timeLineLike(id, is_like, likeType) {
    let body = JSON.stringify({
      post_id: id,
      is_like: is_like,
      type: likeType,
    });
    var url = baseUrl + "timeline/like";
    console.log("body", body);
    return Method.dataPost(body, url);
  },
  timeLineComment(id, message, commentId) {
    console.log(" commentId:", commentId);
    let body;
    if (commentId) {
      body = JSON.stringify({
        post_id: id,
        description: message,
        commentId: commentId,
      });
    } else {
      body = JSON.stringify({
        post_id: id,
        description: message,
      });
    }
    var url = baseUrl + "timeline/comment";
    return Method.dataPost(body, url);
  },
  timeLineCommentLike(postId, id, isLike, type) {
    console.log(" commentId:", id, isLike, type);
    let body = JSON.stringify({
      comment_id: id,
      is_like: isLike,
      type: type,
      post_id: postId,
    });

    var url = baseUrl + "timeline/commentLike";
    return Method.dataPost(body, url);
  },
  timeLineCommentDelete(id) {
    console.log("comment delete");

    var url = baseUrl + "timeline/deleteComment/" + id;
    return Method.dataDelete(url);
  },
  timeLineCommentEdit(item, message) {
    console.log("comment delete");
    let body = JSON.stringify({
      commentId: item._id,
      description: message,
    });
    var url = baseUrl + "timeline//editComment";
    return Method.dataPut(body, url);
  },
  timeLinePostDelete(id) {
    var url = baseUrl + "timeline/delete/" + id;
    return Method.dataDelete(url);
  },
  timeLineShare(message, id) {
    let body = JSON.stringify({
      post_id: id,
      description: message,
    });
    var url = baseUrl + "timeline/share";
    return Method.dataPost(body, url);
  },

  timeLineShareList(id) {
    let body = JSON.stringify({
      // "offset":0,
      // "limit":15,
      post_id: id,

      // post_id: id,
    });
    var url = baseUrl + "timeline/shareList";
    return Method.dataPost(body, url);
  },
  timeLineLikeList(id, type, category) {
    let body = JSON.stringify({
      // "offset":0,
      // "limit":15,
      id: id,
      type: type,
      category: category,

      // post_id: id,
    });
    var url = baseUrl + "timeline/likeList";
    return Method.dataPost(body, url);
  },
  timeLinePostDetail(id, comment_id) {
    var url;
    if (comment_id !== "") {
      url =
        baseUrl + "timeline/postDetails/" + id + "?comment_id=" + comment_id;
    } else {
      url = baseUrl + "timeline/postDetails/" + id;
    }
    return Method.dataGet(url);
  },

  followUnfollowTerminal(terminal_id, is_follow) {
    console.log("terminal_id", terminal_id);
    let body = JSON.stringify({
      terminal_id: terminal_id,
    });
    var url = baseUrl + "terminal/follow";
    return Method.dataPost(body, url);
  },

  friendsList(page) {
    var url = baseUrl + "user-list?page=" + "1";
    return Method.dataGet(url);
  },

  myFriends(contact) {
    var body = JSON.stringify({ contact_list: contact });
    var url = baseUrl + "friend/list";
    return Method.dataPost(body, url);
  },
  getContact(contact) {
    var body = JSON.stringify({
      contact_list: contact,
    });

    var url = baseUrl + "user/contact";
    return Method.dataPost(body, url);
  },
  sendInvite(phoneNo, message) {
    let body = JSON.stringify({
      phone_number: phoneNo,
      message: message,
    });
    var url = baseUrl + "/user/invite";
    return Method.dataPost(body, url);
  },

  searchTerminal(terminal_name) {
    var url = baseUrl + "terminal/list?search=" + terminal_name;
    return Method.dataGet(url);
  },

  searchUser(user_name, page) {
    let body = new FormData();
    body.append("name", user_name);
    var url = baseUrl + "user/list?search=" + user_name;
    return Method.dataGet(url);
  },

  nearByTerminals(lat, long) {
    let body = JSON.stringify({
      latitude: lat,
      longitude: long,
    });

    var url = baseUrl + "terminal/listByCity";
    return Method.dataPost(body, url);
  },

  chatHistory(text) {
    var url = baseUrl + "chat/chat_history?search=" + text;
    return Method.dataGet(url);
  },

  chatUserHistory(chat_id, offset, limit, online) {
    var url = `${baseUrl}chat/chat_screen/${chat_id}?offset=${offset}&limit=${limit}&online=${online}`;
    return Method.dataGet(url);
  },

  oneToOneChat(receiver_id, message, chat_type) {
    let body = JSON.stringify({
      friend_id: receiver_id,
      message: message,
    });
    var url = baseUrl + "chat/one_to_one";
    return Method.dataPost(body, url);
  },

  warnContacts(phone_number, id) {
    let body = JSON.stringify({
      phone_number: phone_number,
      terminal_id: id,
      // "country_code":'+1'
    });
    var url = baseUrl + "warning/create";
    return Method.dataPost(body, url);
  },

  terminalChat(id, message) {
    let body = JSON.stringify({
      terminal_id: id,
      message: message,
    });
    var url = baseUrl + "chat/group_chat";
    return Method.dataPost(body, url);
  },

  terminalChatHistory(id, offset, limit) {
    let body = JSON.stringify({
      terminal_id: id,
    });
    console.log(body);
    var url = `${baseUrl}chat/group_chat_screen/?offset=${offset}&limit=${limit}`;
    return Method.dataPost(body, url);
  },

  logOut() {
    var url = baseUrl + "user/logout";
    return Method.dataGet(url);
  },
  deleteAccount() {
    var url = baseUrl + "user/deleteAccount";
    return Method.dataGet(url);
  },

  changePassword(oldPassword, newPassword) {
    // body = new FormData();
    let body = JSON.stringify({
      old_password: oldPassword,
      new_password: newPassword,
    });

    var url = baseUrl + "user/changePassword";
    return Method.dataPost(body, url);
  },

  getUserProfile() {
    var url = baseUrl + "user/details";
    return Method.dataGet(url);
  },

  updateUserProfile(
    userName,
    firstName,
    lastName,
    email,
    phone,
    userType,
    driverType
  ) {
    let body = JSON.stringify({
      name: firstName,
      phone_number: phone,
      userName: userName,
      country_code: phone ? "+1" : "",
      // user_type: Array.isArray(userType) ? userType[0] : userType,
      // driver_type: Array.isArray(driverType) ? driverType[0] : driverType,
      email: email,
    });
    var url = baseUrl + "user/edit";
    return Method.dataPut(body, url);
  },
  updateUserEmailProfile(email) {
    let body = JSON.stringify({
      email: email,
    });
    var url = baseUrl + "user/edit";
    return Method.dataPut(body, url);
  },
  support(tittle, desc) {
    let body = JSON.stringify({
      title: tittle,
      message: desc,
    });
    var url = baseUrl + "support/create";
    return Method.dataPost(body, url);
  },
  pendingFriendRequest() {
    var url = baseUrl + "friend/requestList";
    return Method.dataPost(null, url);
  },
  reportUser(id, message) {
    let body = JSON.stringify({
      user_id: id,
      message: message,
    });
    var url = baseUrl + "user/report";
    return Method.dataPost(body, url);
  },
  myPosts(id, index) {
    let body = new FormData();
    body.append("user_id", id);
    var url =
      baseUrl +
      "timeline/list?user_id=" +
      id +
      "&offset=" +
      index +
      "&limit=" +
      20;
    if (Platform.OS == "ios") {
      return Method.dataGet(url);
    } else {
      return Method.dataGet(url);
    }
  },
  friendRequest(id, status) {
    let body = JSON.stringify({
      receiver_id: id,
      request_status: status,
    });
    var url = baseUrl + "friend/acceptOrReject";

    return Method.dataPost(body, url);
  },
  addFriend(id) {
    let body = JSON.stringify({
      receiver_id: id,
    });
    var url = baseUrl + "friend/sendRequest";
    return Method.dataPost(body, url);
  },
  cancelFriend(id) {
    let body = new FormData();
    body.append("receiver_id", id);
    var url = baseUrl + "friend/cancel/" + id;
    console.log("ggfgggfgg", body);
    return Method.dataDelete(url);
  },
  removeFriend(id) {
    let body = JSON.stringify({
      receiver_id: id,
    });
    var url = baseUrl + "friend/unFriend";
    return Method.dataPost(body, url);
  },
  videoPlay(id) {
    var url = baseUrl + "post/details/" + id;
    return Method.dataGet(url);
  },
  myTimeLine(page) {
    var url =
      page == 1
        ? baseUrl + "timeline/list?&offset=" + 0 + "&limit=" + 10
        : baseUrl + "timeline/list?&offset=" + page + "&limit=" + 10;
    return Method.dataGet(url);
  },
  addTimeLine(id, message, friends, location, latitude, longitude) {
    // body.append("latitude", latitude?latitude:0)
    // // }
    // // if(longitude)
    // // {
    //   body.append("longitude", longitude?longitude:0)
    let body = JSON.stringify({
      latitude: latitude ? latitude : 0,
      longitude: longitude ? longitude : 0,
      route_id: id,
      description: message,
      tag_friends: JSON.stringify(friends),
      post_location: location,
    });
    var url = baseUrl + "timeline/create";
    return Method.dataPost(body, url);
  },
  routeDelete(id) {
    var url = baseUrl + "route_post/delete/" + id;
    return Method.dataDelete(url);
  },
  routeDetail(id) {
    var url = baseUrl + "route_post/details/" + id;
    return Method.dataGet(url);
  },
  interchangeAdd(id, privates, source) {
    console.log("source", source);
    let body = new FormData();
    body.append("route_post_id", id);
    body.append("receipt_private", privates);
    body.append("video", JSON.stringify(source));
    body.append("type", "interchange_file");
    // console.log('source',source);
    //     let body = JSON.stringify({
    //       route_post_id: id,
    //       "receipt_private": privates,
    //       "video": source,
    //       "type": "interchange_file"
    //     })

    var url = baseUrl + "route_post/addVideo";
    return Method.dataPostWithImage(body, url);
  },
  interchangeEdit(postId, privates, source, id) {
    let body = new FormData();
    body.append("route_post_id", postId);
    body.append("id", id);
    body.append("receipt_private", privates);
    body.append("video", JSON.stringify(source));
    body.append("type", "interchange_file");
    var url = baseUrl + "route_post/editVideo";
    return Method.dataPutWithImage(body, url);
  },
  interchangeDelete(id, privates, postId) {
    let body = JSON.stringify({
      id: id,
      route_post_id: postId,
      type: "interchange_file",
    });
    var url = baseUrl + "route_post/deleteVideo";
    return Method.dataDeleteWithBody(body, url);
  },
  equipmentAdd(id, privates, source) {
    let body = new FormData();
    body.append("route_post_id", id);
    body.append("receipt_private", privates);
    // body.append("video", {
    //   name: "profile.png",
    //   uri: source.uri,
    //   type: "image/jpeg",
    // });
    body.append("video", JSON.stringify(source));
    body.append("type", "equipment_photo");
    var url = baseUrl + "route_post/addVideo";
    return Method.dataPostWithImage(body, url);
  },
  equipmentEdit(postId, privates, source, id) {
    let body = new FormData();
    body.append("route_post_id", postId);
    body.append("receipt_private", privates);
    body.append("id", id);
    body.append("video", JSON.stringify(source));
    body.append("type", "equipment_photo");
    var url = baseUrl + "route_post/editVideo";
    return Method.dataPutWithImage(body, url);
  },
  equipmentDelete(id, privates, postId, type) {
    let body = JSON.stringify({
      id: id,
      route_post_id: postId,
      type: type == "manual" ? "manual" : "interchange_file",
    });
    var url = baseUrl + "route_post/deleteVideo";
    return Method.dataDeleteWithBody(body, url);
  },
  videoAdd(id, privates, source, thumbnail) {
    let body = new FormData();
    body.append("route_post_id", id);
    body.append("thumbnail", thumbnail);
    body.append("receipt_private", privates);
    body.append("id", id);
    body.append("video", {
      name: "video.mp4",
      uri: source.uri,
      type: "video/mp4",
    });
    body.append("type", "video");
    var url = baseUrl + "route_post/addVideo";
    return Method.dataPostWithImage(body, url);
  },
  videoEdit(postId, privates, source, thumbnail, id) {
    let body = new FormData();
    body.append("route_post_id", postId);
    body.append("thumbnail", thumbnail);
    body.append("receipt_private", privates);
    body.append("id", id);
    body.append("video", {
      name: "video.mp4",
      uri: source.uri,
      type: "video/mp4",
    });
    body.append("type", "video");
    var url = baseUrl + "route_post/editVideo";
    return Method.dataPutWithImage(body, url);
  },
  videoDelete(id, privates, postId) {
    let body = JSON.stringify({
      id: id,
      route_post_id: postId,
      type: "interchange_file",
    });
    var url = baseUrl + "route_post/deleteVideo";
    return Method.dataDeleteWithBody(body, url);
  },
  routeEdit(id, start, end, image, distance, time, terminalId, navigation) {
    let body = new FormData();
    body.append("terminal_id", terminalId);
    body.append("distance", distance);
    body.append("minute", time ? time : "0");
    body.append(
      "start_time",
      navigation
        ? start
          ? moment(start)
              .utc()
              .format("YYYY-MM-DDTHH:mm")
          : moment(end)
              .utc()
              .format("YYYY-MM-DDTHH:mm")
        : start
    );
    body.append(
      "end_time",
      navigation
        ? moment(end)
            .utc()
            .format("YYYY-MM-DDTHH:mm")
        : end
    );
    body.append("route_post_id", id);
    // body.append("image", {
    //   name: "profile.png",
    //   uri: image,
    //   type: "image/png",
    // });

    var url = baseUrl + "route_post/edit";
    return Method.dataPutWithImage(body, url);
  },
  receiptPrivate(id, value) {
    let body = JSON.stringify({
      route_post_id: id,
      receipt_private: value,
    });
    var url = baseUrl + "route_post/receipt_private";
    return Method.dataPut(body, url);
  },
  onReachEndPost(data) {
    const body = JSON.stringify(data);
    return Method.dataPost(body, data.url);
  },
  routePostList(page, id) {
    var url =
      page == 1
        ? baseUrl + "route_post/list?offset=0&&&limit=10" + "&user_id=" + id
        : baseUrl +
          "route_post/list?offset=" +
          page +
          "&limit=" +
          10 +
          "&user_id=" +
          id;
    return Method.dataGet(url);
  },
  createRoutePost(id, distance, minute, image, start, end, coordinate) {
    let body = new FormData();
    if (image == "") {
      let bodyWithoutFormdata = JSON.stringify({
        terminal_id: id,
        distance: distance,
        minute: minute,
        start_time: start.toString(),
        end_time: end.toString(),
        coordinates: JSON.stringify(coordinate),
      });
      var url = baseUrl + "route_post/create";

      return Method.dataPost(bodyWithoutFormdata, url);
    } else {
      body.append("coordinates", JSON.stringify(coordinate));
      body.append("terminal_id", id);
      body.append("distance", distance);
      body.append("minute", minute);
      body.append("start_time", start);
      body.append("end_time", end);
      body.append("image", {
        name: "profile.png",
        uri: image,
        type: "image/jpeg",
      });
      var url = baseUrl + "route_post/create";
      return Method.dataPostWithImage(body, url);
    }
  },
  changeLang(value) {
    let body = JSON.stringify({
      language: value,
    });
    var url = baseUrl + "/user/language";
    return Method.dataPost(body, url);
  },

  deleteFavTerminalApi(TerminalId, userId) {
    const url = baseUrl + `user/removeTerminal/${TerminalId}?user_id=${userId}`;
    return Method.dataDelete(url);
  },
};

const Method = {
  dataPost(body, newurl) {
    console.log("new url", newurl, accessToken);
    const url = newurl;
    const data = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-access-token": accessToken ? "Bearer " + accessToken : "",
      },
      body: body,
    };
    return new Promise((resolve, reject) => {
      if (internetStatus === true) {
        fetch(url, data)
          .then((responseData) => {
            console.log("::::responseData",responseData)
            if (internetStatus === true) {
              if (responseData.status == 200) {
                return responseData.json().then((result) => {
                  console.log(result, "result");
                  if (result) {
                    return resolve({
                      status: 1,
                      result: result,
                    });
                  } else {
                    return reject({
                      status: 0,
                      result: I18n.t("something_went_wrong"),
                    });
                  }
                });
              } else if (responseData.status == 400) {
                return responseData.json().then((result) => {
                  if (result) {
                    return resolve({
                      status: 2,
                      result: result,
                    });
                  } else {
                    return reject({
                      status: 0,
                      result: I18n.t("something_went_wrong"),
                    });
                  }
                });
              } else if (responseData.status == 401) {
                return responseData.json().then((result) => {
                  if (result) {
                    return resolve({
                      status: 3,
                      result: result,
                    });
                  } else {
                    return reject({
                      status: 0,
                      result: I18n.t("something_went_wrong"),
                    });
                  }
                });
              } else if (responseData.status == 403) {
                return responseData.json().then((result) => {
                  if (result) {
                    return resolve({
                      status: 4,
                      result: result,
                    });
                  } else {
                    return reject({
                      status: 0,
                      result: I18n.t("something_went_wrong"),
                    });
                  }
                });
              } else if (
                responseData.status == 500 ||
                responseData.status === 504
              ) {
                return responseData.json().then((result) => {
                  if (result) {
                    return resolve({
                      status: 5,
                      result: result,
                    });
                  } else {
                    return reject({
                      status: 0,
                      result: I18n.t("something_went_wrong"),
                    });
                  }
                });
              } else if (responseData.status == 408) {
                return responseData.json().then((result) => {
                  if (result) {
                    return resolve({
                      status: 6,
                      result: result,
                    });
                  } else {
                    return reject({
                      status: 0,
                      result: I18n.t("something_went_wrong"),
                    });
                  }
                });
              }
            } else {
              return reject({
                result: I18n.t("please_check_your_internet_connection"),
                status: 0,
              });
            }
          })
          .catch((error) => {
            if (internetStatus == true) {
              return reject({
                result: error.TypeError
                  ? error.TypeError
                  : I18n.t("something_went_wrong"),
                status: 0,
              });
            } else {
              return reject({
                result: I18n.t("please_check_your_internet_connection"),
                status: 0,
              });
            }
          });
      } else {
        return reject({
          result: I18n.t("please_check_your_internet_connection"),
          status: 0,
        });
      }
    });
  },

  dataDeleteWithBody(body, newurl) {
    const url = newurl;
    const data = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-access-token": accessToken ? "Bearer " + accessToken : "",
      },
      body: body,
    };
    return new Promise((resolve, reject) => {
      if (internetStatus === true) {
        fetch(url, data)
          .then((responseData) => {
            if (internetStatus === true) {
              if (responseData.status == 200) {
                return responseData.json().then((result) => {
                  console.log("result", result);
                  if (result) {
                    return resolve({
                      status: 1,
                      result: result,
                    });
                  } else {
                    return reject({
                      status: 0,
                      result: I18n.t("something_went_wrong"),
                    });
                  }
                });
              } else if (responseData.status == 400) {
                return responseData.json().then((result) => {
                  if (result) {
                    return resolve({
                      status: 2,
                      result: result,
                    });
                  } else {
                    return reject({
                      status: 0,
                      result: I18n.t("something_went_wrong"),
                    });
                  }
                });
              } else if (responseData.status == 401) {
                return responseData.json().then((result) => {
                  if (result) {
                    return resolve({
                      status: 3,
                      result: result,
                    });
                  } else {
                    return reject({
                      status: 0,
                      result: I18n.t("something_went_wrong"),
                    });
                  }
                });
              } else if (responseData.status == 403) {
                return responseData.json().then((result) => {
                  if (result) {
                    return resolve({
                      status: 4,
                      result: result,
                    });
                  } else {
                    return reject({
                      status: 0,
                      result: I18n.t("something_went_wrong"),
                    });
                  }
                });
              } else if (
                responseData.status == 500 ||
                responseData.status === 504
              ) {
                return responseData.json().then((result) => {
                  if (result) {
                    return resolve({
                      status: 6,
                      result: result,
                    });
                  } else {
                    return reject({
                      status: 0,
                      result: I18n.t("something_went_wrong"),
                    });
                  }
                });
              }
            } else {
              return reject({
                result: I18n.t("please_check_your_internet_connection"),
                status: 0,
              });
            }
          })
          .catch((error) => {
            if (internetStatus == true) {
              return reject({
                result: I18n.t("something_went_wrong"),
                status: 0,
              });
            } else {
              return reject({
                result: I18n.t("please_check_your_internet_connection"),
                status: 0,
              });
            }
          });
      } else {
        return reject({
          result: I18n.t("please_check_your_internet_connection"),
          status: 0,
        });
      }
    });
  },
  dataDelete(newurl) {
    const url = newurl;
    const data = {
      method: "DELETE",
      headers: {
        "access-control-allow-origin": "*",
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-access-token": accessToken ? "Bearer " + accessToken : "",
      },
    };
    return new Promise((resolve, reject) => {
      if (internetStatus === true) {
        fetch(url, data)
          .then((responseData) => {
            if (internetStatus === true) {
              if (responseData.status == 200) {
                return responseData.json().then((result) => {
                  if (result) {
                    return resolve({
                      status: 1,
                      result: result,
                    });
                  } else {
                    return reject({
                      status: 0,
                      result: I18n.t("something_went_wrong"),
                    });
                  }
                });
              } else if (responseData.status == 400) {
                return responseData.json().then((result) => {
                  if (result) {
                    return resolve({
                      status: 2,
                      result: result,
                    });
                  } else {
                    return reject({
                      status: 0,
                      result: I18n.t("something_went_wrong"),
                    });
                  }
                });
              } else if (responseData.status == 401) {
                return responseData.json().then((result) => {
                  if (result) {
                    return resolve({
                      status: 3,
                      result: result,
                    });
                  } else {
                    return reject({
                      status: 0,
                      result: I18n.t("something_went_wrong"),
                    });
                  }
                });
              } else if (responseData.status == 403) {
                return responseData.json().then((result) => {
                  if (result) {
                    return resolve({
                      status: 4,
                      result: result,
                    });
                  } else {
                    return reject({
                      status: 0,
                      result: I18n.t("something_went_wrong"),
                    });
                  }
                });
              } else if (
                responseData.status == 500 ||
                responseData.status === 504
              ) {
                if (responseData.url.includes("chat-screen") == true) {
                  console.log("empty data");
                  return reject({
                    status: 0,
                    result: "empty Data",
                  });
                } else {
                  return responseData.json().then((result) => {
                    if (result) {
                      return resolve({
                        status: 5,
                        result: result,
                      });
                    } else {
                      return reject({
                        status: 0,
                        result: I18n.t("something_went_wrong"),
                      });
                    }
                  });
                }
              } else if (responseData.status == 408) {
                return responseData.json().then((result) => {
                  if (result) {
                    return resolve({
                      status: 6,
                      result: result,
                    });
                  } else {
                    return reject({
                      status: 0,
                      result: I18n.t("something_went_wrong"),
                    });
                  }
                });
              }
            } else {
              return reject({
                result: I18n.t("please_check_your_internet_connection"),
                status: 0,
              });
            }
          })
          .catch((error) => {
            if (internetStatus == true) {
              return reject({
                result: error.TypeError
                  ? error.TypeError
                  : I18n.t("something_went_wrong"),
                status: 0,
              });
            } else {
              return reject({
                result: I18n.t("please_check_your_internet_connection"),
                status: 0,
              });
            }
          });
      } else {
        return reject({
          result: I18n.t("please_check_your_internet_connection"),
          status: 0,
        });
      }
    });
  },

  dataPut(body, newurl) {
    const url = newurl;
    const data = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-access-token": accessToken ? "Bearer " + accessToken : "",
      },
      body: body,
    };
    return new Promise((resolve, reject) => {
      if (internetStatus === true) {
        fetch(url, data)
          .then((responseData) => {
            console.log("responseData", responseData);
            if (internetStatus === true) {
              if (responseData.status == 200) {
                return responseData.json().then((result) => {
                  console.log("result", result);
                  if (result) {
                    return resolve({
                      status: 1,
                      result: result,
                    });
                  } else {
                    return reject({
                      status: 0,
                      result: I18n.t("something_went_wrong"),
                    });
                  }
                });
              } else if (responseData.status == 400) {
                return responseData.json().then((result) => {
                  if (result) {
                    return resolve({
                      status: 2,
                      result: result,
                    });
                  } else {
                    return reject({
                      status: 0,
                      result: I18n.t("something_went_wrong"),
                    });
                  }
                });
              } else if (responseData.status == 401) {
                return responseData.json().then((result) => {
                  if (result) {
                    return resolve({
                      status: 3,
                      result: result,
                    });
                  } else {
                    return reject({
                      status: 0,
                      result: I18n.t("something_went_wrong"),
                    });
                  }
                });
              } else if (responseData.status == 403) {
                return responseData.json().then((result) => {
                  if (result) {
                    return resolve({
                      status: 4,
                      result: result,
                    });
                  } else {
                    return reject({
                      status: 0,
                      result: I18n.t("something_went_wrong"),
                    });
                  }
                });
              } else if (
                responseData.status == 500 ||
                responseData.status === 504
              ) {
                return responseData.json().then((result) => {
                  if (result) {
                    return resolve({
                      status: 5,
                      result: result,
                    });
                  } else {
                    return reject({
                      status: 0,
                      result: I18n.t("something_went_wrong"),
                    });
                  }
                });
              } else if (responseData.status == 408) {
                return responseData.json().then((result) => {
                  if (result) {
                    return resolve({
                      status: 6,
                      result: result,
                    });
                  } else {
                    return reject({
                      status: 0,
                      result: I18n.t("something_went_wrong"),
                    });
                  }
                });
              }
            } else {
              return reject({
                result: I18n.t("please_check_your_internet_connection"),
                status: 0,
              });
            }
          })
          .catch((error) => {
            if (internetStatus == true) {
              return reject({
                result: error.TypeError
                  ? error.TypeError
                  : I18n.t("something_went_wrong"),
                status: 0,
              });
            } else {
              return reject({
                result: I18n.t("please_check_your_internet_connection"),
                status: 0,
              });
            }
          });
      } else {
        return reject({
          result: I18n.t("please_check_your_internet_connection"),
          status: 0,
        });
      }
    });
  },

  dataGet(newurl) {
    console.log(newurl);
    const url = newurl;
    const data = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-access-token": accessToken ? "Bearer " + accessToken : "",
      },
    };
    return new Promise((resolve, reject) => {
      if (internetStatus === true) {
        fetch(url, data)
          .then((responseData) => {
            console.log("responseData", responseData);
            if (internetStatus === true) {
              if (responseData.status == 200) {
                return responseData.json().then((result) => {
                  if (result) {
                    return resolve({
                      status: 1,
                      result: result,
                    });
                  } else {
                    return reject({
                      status: 0,
                      result: I18n.t("something_went_wrong"),
                    });
                  }
                });
              } else if (responseData.status == 400) {
                return responseData.json().then((result) => {
                  if (result) {
                    return resolve({
                      status: 2,
                      result: result,
                    });
                  } else {
                    return reject({
                      status: 0,
                      result: I18n.t("something_went_wrong"),
                    });
                  }
                });
              } else if (responseData.status == 401) {
                return responseData.json().then((result) => {
                  if (result) {
                    return resolve({
                      status: 3,
                      result: result,
                    });
                  } else {
                    return reject({
                      status: 0,
                      result: I18n.t("something_went_wrong"),
                    });
                  }
                });
              } else if (responseData.status == 403) {
                return responseData.json().then((result) => {
                  if (result) {
                    return resolve({
                      status: 4,
                      result: result,
                    });
                  } else {
                    return reject({
                      status: 0,
                      result: I18n.t("something_went_wrong"),
                    });
                  }
                });
              } else if (
                responseData.status == 500 ||
                responseData.status === 504
              ) {
                if (responseData.url.includes("chat-screen") == true) {
                  return reject({
                    status: 0,
                    result: "empty Data",
                  });
                } else {
                  return responseData.json().then((result) => {
                    if (result) {
                      return resolve({
                        status: 5,
                        result: result,
                      });
                    } else {
                      return reject({
                        status: 0,
                        result: I18n.t("something_went_wrong"),
                      });
                    }
                  });
                }
              } else if (responseData.status == 408) {
                return responseData.json().then((result) => {
                  if (result) {
                    return resolve({
                      status: 6,
                      result: result,
                    });
                  } else {
                    return reject({
                      status: 0,
                      result: I18n.t("something_went_wrong"),
                    });
                  }
                });
              }
            } else {
              return reject({
                result: I18n.t("please_check_your_internet_connection"),
                status: 0,
              });
            }
          })
          .catch((error) => {
            if (internetStatus == true) {
              return reject({
                result: I18n.t("something_went_wrong"),
                status: 0,
              });
            } else {
              return reject({
                result: I18n.t("please_check_your_internet_connection"),
                status: 0,
              });
            }
          });
      } else {
        return reject({
          result: I18n.t("please_check_your_internet_connection"),
          status: 0,
        });
      }
    });
  },

  dataPostWithImage(body, newurl) {
    console.log("newurl", newurl);
    const url = newurl;

    const data = {
      method: "POST",
      headers: {
        // "Content-Type": "multipart/form-data",
        Accept: "application/json",
        "x-access-token": accessToken ? "Bearer " + accessToken : "",
      },
      body: body,
    };
    return new Promise((resolve, reject) => {
      if (internetStatus === true) {
        fetch(url, data)
          .then((responseData) => {
            if (internetStatus === true) {
              if (responseData.status == 200) {
                return responseData.json().then((result) => {
                  if (result) {
                    return resolve({
                      status: 1,
                      result: result,
                    });
                  } else {
                    return reject({
                      status: 0,
                      result: I18n.t("something_went_wrong"),
                    });
                  }
                });
              } else if (responseData.status == 400) {
                return responseData.json().then((result) => {
                  if (result) {
                    return resolve({
                      status: 2,
                      result: result,
                    });
                  } else {
                    return reject({
                      status: 0,
                      result: I18n.t("something_went_wrong"),
                    });
                  }
                });
              } else if (responseData.status == 401) {
                return responseData.json().then((result) => {
                  if (result) {
                    return resolve({
                      status: 3,
                      result: result,
                    });
                  } else {
                    return reject({
                      status: 0,
                      result: I18n.t("something_went_wrong"),
                    });
                  }
                });
              } else if (responseData.status == 403) {
                return responseData.json().then((result) => {
                  if (result) {
                    return resolve({
                      status: 4,
                      result: result,
                    });
                  } else {
                    return reject({
                      status: 0,
                      result: I18n.t("something_went_wrong"),
                    });
                  }
                });
              } else if (
                responseData.status == 500 ||
                responseData.status === 504
              ) {
                return responseData.json().then((result) => {
                  if (result) {
                    return resolve({
                      status: 5,
                      result: result,
                    });
                  } else {
                    return reject({
                      status: 0,
                      result: I18n.t("something_went_wrong"),
                    });
                  }
                });
              } else if (responseData.status == 408) {
                return responseData.json().then((result) => {
                  if (result) {
                    return resolve({
                      status: 6,
                      result: result,
                    });
                  } else {
                    return reject({
                      status: 0,
                      result: I18n.t("something_went_wrong"),
                    });
                  }
                });
              }
            } else {
              return reject({
                result: I18n.t("please_check_your_internet_connection"),
                status: 0,
              });
            }
          })
          .catch((error) => {
            if (internetStatus == true) {
              console.log(".catch((error) =>", error);
              return reject({
                result: error.TypeError
                  ? error.TypeError
                  : I18n.t("something_went_wrong"),
                status: 0,
              });
            } else {
              return reject({
                result: I18n.t("please_check_your_internet_connection"),
                status: 0,
              });
            }
          });
      } else {
        return reject({
          result: I18n.t("please_check_your_internet_connection"),
          status: 0,
        });
      }
    });
  },
  dataPutWithImage(body, newurl) {
    const url = newurl;
    const data = {
      method: "PUT",
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
        "x-access-token": "Bearer " + accessToken,
      },
      body: body,
    };
    return new Promise((resolve, reject) => {
      if (internetStatus === true) {
        fetch(url, data)
          .then((responseData) => {
            console.log("responseData", responseData);
            if (internetStatus === true) {
              if (responseData.status == 200) {
                return responseData.json().then((result) => {
                  if (result) {
                    return resolve({
                      status: 1,
                      result: result,
                    });
                  } else {
                    return reject({
                      status: 0,
                      result: I18n.t("something_went_wrong"),
                    });
                  }
                });
              } else if (responseData.status == 400) {
                return responseData.json().then((result) => {
                  if (result) {
                    return resolve({
                      status: 2,
                      result: result,
                    });
                  } else {
                    return reject({
                      status: 0,
                      result: I18n.t("something_went_wrong"),
                    });
                  }
                });
              } else if (responseData.status == 401) {
                return responseData.json().then((result) => {
                  if (result) {
                    return resolve({
                      status: 3,
                      result: result,
                    });
                  } else {
                    return reject({
                      status: 0,
                      result: I18n.t("something_went_wrong"),
                    });
                  }
                });
              } else if (responseData.status == 403) {
                return responseData.json().then((result) => {
                  if (result) {
                    return resolve({
                      status: 4,
                      result: result,
                    });
                  } else {
                    return reject({
                      status: 0,
                      result: I18n.t("something_went_wrong"),
                    });
                  }
                });
              } else if (
                responseData.status == 500 ||
                responseData.status === 504
              ) {
                return responseData.json().then((result) => {
                  if (result) {
                    return resolve({
                      status: 5,
                      result: result,
                    });
                  } else {
                    return reject({
                      status: 0,
                      result: I18n.t("something_went_wrong"),
                    });
                  }
                });
              } else if (responseData.status == 408) {
                return responseData.json().then((result) => {
                  if (result) {
                    return resolve({
                      status: 6,
                      result: result,
                    });
                  } else {
                    return reject({
                      status: 0,
                      result: I18n.t("something_went_wrong"),
                    });
                  }
                });
              }
            } else {
              return reject({
                result: I18n.t("please_check_your_internet_connection"),
                status: 0,
              });
            }
          })
          .catch((error) => {
            if (internetStatus == true) {
              console.log(".catch((error) =>", error);
              return reject({
                result: error.TypeError
                  ? error.TypeError
                  : I18n.t("something_went_wrong"),
                status: 0,
              });
            } else {
              return reject({
                result: I18n.t("please_check_your_internet_connection"),
                status: 0,
              });
            }
          });
      } else {
        return reject({
          result: I18n.t("please_check_your_internet_connection"),
          status: 0,
        });
      }
    });
  },
};

module.exports = Fetch;
