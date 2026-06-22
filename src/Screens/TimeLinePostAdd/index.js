import React, { Component } from "react";
import {
  View,
  Text,
  Alert,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Platform,
  Dimensions,
  Image,
  Share,
  Modal,
  Keyboard,
  ActionSheetIOS,
} from "react-native";
import { Header, Loader, DataManager } from "./../../Components";
import { AppImages } from "./../../Themes";
import { connect } from "react-redux";
import styles from "./style";
import {
  addTimeLinePost,
  updateImageVideoCount,
} from "../../Redux/actions/timeLineAction";
import I18n from "react-native-i18n";
import { CachedImage } from "../../Components/react-native-cached-image-master";
import {
  branchBaseUrl,
  imageBaseUrl,
  version,
  getEmailpopUpRef,
  getUSerDetail,
} from "../../Config";
import DeviceInfo from "react-native-device-info";
import moment from "moment";
import { myFriendAction } from "../../Redux/actions/Friends";
import {
  searchUserAction,
  userInTerminal,
  recentLocations,
} from "../../Redux/actions/MyFrightingNetwork";
import GooglePlacesInput from "../GooglePLaces";
import CameraModal from "../../Components/CameraComponent";
import CropImagePicker from "react-native-image-crop-picker";
import { launchCamera } from "react-native-image-picker";
import RNThumbnail from "react-native-thumbnail";
import Entypo from "react-native-vector-icons/Entypo";
import { videoUploadAction } from "../../Redux/actions/TerminalDetail";
import { SwipeablePanel } from "rn-swipeable-panel";
import { PERMISSIONS, request, openSettings } from "react-native-permissions";
import ActionSheet from "react-native-actionsheet";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import NetInfo from "@react-native-community/netinfo";
import {
  AFLogEvent,
  s3bucket,
  uploadImageOnS3,
  uuidv4_34,
} from "../../Config/aws";
import ImageResizer from "react-native-image-resizer";

const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;
let _this;
class TimeLinePostCreate extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: null,
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      latitude: "",
      longitude: "",
      terminal_id: "",
      loading: false,
      keyboardOpen: false,
      position: "absolute",
      panelActive: true,
      media: "",
      disabled: true,
      location: "",
      message: "",
      visible: false,
      userDetail: null,
      pageIndShow: true,
      index: 0,
      videoSelected: false,
      imageSelected: false,
      visiblity: false,
      tagsFriendsId: [],
      selectedFriends: [],
      _imageCount: 0,
      _videoCount: 0,
      videoThubnailRatio: 1,
      pickerHeight: "80%",
      crossClick: 0,
      internetAlert: 0,
      dummyUser: null,
    };
    this.itemParam = this.props.route.params.item;
    this.interChange = this.props.route.params.interChange;
    this.video = this.props.route.params.video;
    this.equipment = this.props.route.params.equipment;
    this.receiptPrivate = this.props.route.params.receiptPrivate;
    this.mediaImages = this.props.route.params.mediaImages;
    this.screen = this.props.route.params?.screen;
    _this = this;
    this.internetStatus = null;
    this.isClicked = false;
  }

  isLogin = async () => {
    let data = await getUSerDetail();
    console.log("data", data);
    let parseData = JSON.parse(data);
    console.log("parseData", parseData.data.email);
    if (parseData?.data?.email) {
      return true;
    } else {
      console.log("kkkkkkk", getEmailpopUpRef());
      getEmailpopUpRef().modalOpen();
      return false;
    }
  };

  onLibraryCall = () => {
    const options = {
      title: "Select Image",
      multiple: true,
      maxFiles: this.state.imageSelected ? 1 : this.state.videoSelected ? 4 : 5,
      durationLimit: 30,
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
      mediaType:
        this.state.videoSelected == true
          ? "photo"
          : this.state.imageSelected
          ? "video"
          : "any",
      compressImageQuality: 0.7,
      allowsEditing: false,
    };

    Platform.OS == "ios"
      ? request(PERMISSIONS.IOS.PHOTO_LIBRARY)
          .then((result) => {
            console.log("result", result);
            if (result === "blocked") {
              Alert.alert(
                I18n.t("permissionTitle"),
                I18n.t("permissionBody"),
                [
                  {
                    text: I18n.t("Cancel"),
                    onPress: () => console.log("cancel"),
                    style: "cancel",
                  },
                  { text: "OK", onPress: () => openSettings() },
                ],
                { cancelable: false }
              );
            }
            if (result === "granted" || result === "limited") {
              if (this.mediaImages.length == 0) {
                this.props.updateImageVideoCount(0, "imageCount");
                this.props.updateImageVideoCount(0, "vieoCount");
              }
              if (this.mediaImages.length > 0) {
                this.props.updateImageVideoCount(
                  this.state._imageCount,
                  "imageCount"
                );
                this.props.updateImageVideoCount(
                  this.state._videoCount,
                  "vieoCount"
                );
              }
              CropImagePicker.openPicker(options)
                .then((response) => {
                  const source = { uri: response };
                  if (Platform.OS == "ios") {
                    for (let i in response) {
                      if (
                        response[i].mime === "image/jpeg" ||
                        response[i].mime == "image/png"
                      ) {
                        let count = this.props.timeLine.imageCount + 1;
                        this.props.updateImageVideoCount(count, "imageCount");
                      }
                      if (response[i].mime === "video/mp4") {
                        let count = this.props.timeLine.vieoCount + 1;
                        this.props.updateImageVideoCount(count, "vieoCount");
                      }
                    }
                    if (
                      this.props.timeLine.imageCount > 4 ||
                      this.props.timeLine.vieoCount > 1
                    ) {
                      alert("Max 4 photos and 1 video are allowed to select.");
                    }
                    for (let i in response) {
                      if (
                        response[i].mime === "image/jpeg" ||
                        response[i].mime == "image/png"
                      ) {
                        if (
                          this.props.timeLine.imageCount < 5 &&
                          (this.props.timeLine.vieoCount == 1 ||
                            this.props.timeLine.vieoCount == 0)
                        ) {
                          let media = this.mediaImages;
                          ImageResizer.createResizedImage(
                            response[i].path,
                            100,
                            100,
                            "JPEG",
                            0.1,
                            0,
                            null
                          )
                            .then(async (thumbnailData) => {
                              console.log("thumbnailData", thumbnailData);
                              await media.push({
                                media: {
                                  imageThumbnail: {
                                    uri: thumbnailData.path,
                                    name: thumbnailData.name,
                                    type: "image.jpg",
                                  },
                                  uri: response[i].path,
                                  filename: response[i].filename,
                                  type: response[i].mime,
                                  height: response[i].height,
                                  width: response[i].width,
                                },
                                thumbnail: "",
                                receipt_private: "0",
                                type: "image",
                              });
                              this.mediaImages = media;
                              this.image = [];
                              this.mediaImages.map((x) => {
                                if (x.type == "image") {
                                  this.image.push(x);
                                }
                              });
                              this.setState(
                                {
                                  imageSelected:
                                    this.image.length < 4 ? false : true,
                                  _imageCount: this.image.length,
                                },
                                () => {
                                  if (this.state._imageCount > 0) {
                                    this.setState({ disabled: false });
                                  }
                                }
                              );
                            })
                            .catch((e) => {
                              console.log("thumbnailData", e);
                            });
                        }
                      }

                      if (response[i].mime == "video/mp4") {
                        if (response[i].duration > 30000) {
                          alert(I18n.t("vedioLimit"));
                        } else {
                          if (
                            this.props.timeLine.vieoCount == 1 &&
                            this.props.timeLine.imageCount < 5
                          ) {
                            RNThumbnail.get(response[i].path)
                              .then((result) => {
                                let thumbnail = {
                                  uri: result.path,
                                  type: "image/jpeg",
                                  filename: "photo.jpeg",
                                  height: result.height,
                                  width: result.width,
                                };
                                let media = this.mediaImages;
                                media.push({
                                  media: {
                                    uri: response[i].path,
                                    filename: response[i].filename,
                                    type: response[i].mime,
                                    height: response[i].height,
                                    width: response[i].width,
                                  },
                                  thumbnail: thumbnail,
                                  receipt_private: "0",
                                  type: "video",
                                });
                                this.mediaImages = media;
                                this.setState(
                                  {
                                    media: "",
                                    videoSelected: true,
                                    _videoCount: 1,
                                  },
                                  () => {
                                    if (this.state._videoCount > 0) {
                                      this.setState({ disabled: false });
                                    }
                                  }
                                );
                              })
                              .catch((e) => {});
                          }
                        }
                      }
                    }

                    this.setState({
                      visiblity: false,
                    });
                  } else {
                  }
                })
                .catch((er) => {
                  console.log("eeeee", er);
                });
            }
            if (result === "denied") {
            }
            if (result === "unavailable") {
            }
          })
          .catch((e) => console.log(e))
      : request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE)
          .then((result) => {
            if (result === "blocked") {
              Alert.alert(
                I18n.t("permissionTitle"),
                I18n.t("permissionBody"),
                [
                  {
                    text: I18n.t("Cancel"),
                    onPress: () => {
                      console.log("cancel");
                    },
                    style: "cancel",
                  },
                  { text: "OK", onPress: () => openSettings() },
                ],
                { cancelable: false }
              );
            }
            if (result === "granted") {
              if (this.mediaImages.length == 0) {
                this.props.updateImageVideoCount(0, "imageCount");
                this.props.updateImageVideoCount(0, "vieoCount");
              }

              if (this.mediaImages.length > 0) {
                this.props.updateImageVideoCount(
                  this.state._imageCount,
                  "imageCount"
                );
                this.props.updateImageVideoCount(
                  this.state._videoCount,
                  "vieoCount"
                );
              }

              CropImagePicker.openPicker(options)
                .then((response) => {
                  const source = { uri: response };
                  if (Platform.OS == "android") {
                    for (let i in response) {
                      if (
                        response[i].mime === "image/jpeg" ||
                        response[i].mime == "image/png"
                      ) {
                        let count = this.props.timeLine.imageCount + 1;
                        this.props.updateImageVideoCount(count, "imageCount");
                      }
                      if (response[i].mime === "video/mp4") {
                        if (response[i].duration <= 30000) {
                          let count = this.props.timeLine.vieoCount + 1;
                          this.props.updateImageVideoCount(count, "vieoCount");
                        }
                      }
                    }
                    if (
                      this.props.timeLine.imageCount > 4 ||
                      this.props.timeLine.vieoCount > 1
                    ) {
                      alert("Max 4 photos and 1 video are allowed to select.");
                    }
                    for (let i in response) {
                      console.log("response", response);
                      let splitPath = response[i].path.split("/");
                      console.log("splitPath", splitPath[splitPath.length - 1]);
                      response[i].filename = splitPath[splitPath.length - 1];
                      if (
                        response[i].mime === "image/jpeg" ||
                        response[i].mime == "image/png"
                      ) {
                        if (
                          this.props.timeLine.imageCount < 5 &&
                          (this.props.timeLine.vieoCount == 1 ||
                            this.props.timeLine.vieoCount == 0)
                        ) {
                          let media = this.mediaImages;
                          ImageResizer.createResizedImage(
                            response[i].path,
                            100,
                            100,
                            "JPEG",
                            0.1,
                            0,
                            null
                          )
                            .then((thumbnailData) => {
                              media.push({
                                media: {
                                  imageThumbnail: {
                                    uri: thumbnailData.path,
                                    name: thumbnailData.name,
                                    type: "image.jpg",
                                  },
                                  uri: response[i].path,
                                  filename: response[i].filename,
                                  type: response[i].mime,
                                  height: response[i].height,
                                  width: response[i].width,
                                },
                                thumbnail: "",
                                receipt_private: "0",
                                type: "image",
                              });
                              this.mediaImages = media;
                              this.image = [];
                              this.mediaImages.map((x) => {
                                if (x.type == "image") {
                                  this.image.push(x);
                                }
                              });
                              this.setState(
                                {
                                  imageSelected:
                                    this.image.length < 4 ? false : true,
                                  _imageCount: this.image.length,
                                },
                                () => {
                                  if (this.state._imageCount > 0) {
                                    this.setState({ disabled: false });
                                  }
                                }
                              );
                            })
                            .catch((e) => {});
                        }
                      }

                      if (response[i].mime == "video/mp4") {
                        if (response[i].duration <= 30000) {
                          if (
                            this.props.timeLine.vieoCount == 1 &&
                            this.props.timeLine.imageCount < 5
                          ) {
                            console.log("responseresponseresponse", response);
                            RNThumbnail.get(response[i].path)
                              .then((result) => {
                                console.log("thumb", result);
                                let thumbnail = {
                                  uri: result.path,
                                  type: "image/jpeg",
                                  filename: "photo.jpeg",
                                  height: result.height,
                                  width: result.width,
                                };
                                let media = this.mediaImages;
                                media.push({
                                  media: {
                                    uri: response[i].path,
                                    filename: response[i].filename,
                                    type: response[i].mime,
                                    height: response[i].height,
                                    width: response[i].width,
                                  },
                                  thumbnail: thumbnail,
                                  receipt_private: "0",
                                  type: "video",
                                });
                                this.mediaImages = media;
                                this.setState(
                                  {
                                    media: "",
                                    videoSelected: true,
                                    _videoCount: 1,
                                  },
                                  () => {
                                    if (this.state._videoCount > 0) {
                                      this.setState({ disabled: false });
                                    }
                                  }
                                );
                              })
                              .catch((e) => {
                                console.log("fdsfdsfdsdfs", e);
                              });
                          }
                        } else {
                          alert(I18n.t("vedioLimit"));
                        }
                      }
                    }

                    this.setState({
                      visiblity: false,
                    });
                  } else {
                    this.setState({ loading: true });
                    setTimeout(() => {
                      this.setState({ loading: false });
                    }, 1500);
                  }
                })
                .catch((er) => {
                  console.log("fdsdfsfdsfdsf", er);
                });
            }
            if (result === "denied") {
            }
            if (result === "unavailable") {
            }
          })
          .catch((e) => {});
  };
  onImageCall = () => {
    const options = {
      title: "Select Image",
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
      mediaType: "images",
      compressImageQuality: 0.7,
      allowsEditing: false,
    };

    Platform.OS == "ios"
      ? request(PERMISSIONS.IOS.CAMERA)
          .then((result) => {
            if (result === "blocked") {
              Alert.alert(
                I18n.t("permissionTitle"),
                I18n.t("permissionBody"),
                [
                  {
                    text: I18n.t("Cancel"),
                    onPress: () => {
                      console.log("cancel");
                    },
                    style: "cancel",
                  },
                  { text: "OK", onPress: () => openSettings() },
                ],
                { cancelable: false }
              );
            }
            if (result === "granted") {
              CropImagePicker.openCamera(options)
                .then((response) => {
                  const source = { uri: response.path };
                  if (Platform.OS == "ios") {
                    this.setState({
                      visiblity: false,
                    });
                    let media = this.mediaImages;
                    ImageResizer.createResizedImage(
                      response.path,
                      100,
                      100,
                      "JPEG",
                      0.1,
                      0,
                      null
                    )
                      .then((thumbnailData) => {
                        console.log(
                          "thumbnailDatathumbnailData",
                          thumbnailData
                        );
                        media.push({
                          media: {
                            imageThumbnail: {
                              uri: thumbnailData.path,
                              name: thumbnailData.name,
                              type: "image.jpg",
                            },
                            uri: response.path,
                            filename: response.filename,
                            type: response.mime,
                            height: response.height,
                            width: response.width,
                          },
                          thumbnail: "",
                          receipt_private: "0",
                          type: "image",
                        });
                        this.mediaImages = media;
                        this.image = [];
                        this.mediaImages.map((x) => {
                          if (x.type == "image") {
                            this.image.push(x);
                          }
                        });
                        this.setState({
                          disabled: false,
                          _imageCount: this.state._imageCount + 1,
                          imageSelected: this.image.length < 4 ? false : true,
                        });
                      })
                      .catch((e) => {});
                  }
                })
                .catch((e) => {
                  console.log("ee", e);
                });
            }
            if (result === "denied") {
            }
            if (result === "unavailable") {
            }
          })
          .catch(() => {})
      : request(PERMISSIONS.ANDROID.CAMERA).then((result) => {
          if (result == "blocked") {
            Alert.alert(
              I18n.t("permissionTitle"),
              I18n.t("permissionBody"),
              [
                {
                  text: I18n.t("Cancel"),
                  onPress: () => {
                    console.log("cancel");
                  },
                  style: "cancel",
                },
                { text: "OK", onPress: () => openSettings() },
              ],
              { cancelable: false }
            );
          } else {
            CropImagePicker.openCamera(options)
              .then((response) => {
                const source = { uri: response.path };
                let splitPath = response.path.split("/");
                console.log("splitPath", splitPath[splitPath.length - 1]);
                response.filename = splitPath[splitPath.length - 1];
                this.setState({
                  visiblity: false,
                });
                let media = this.mediaImages;
                ImageResizer.createResizedImage(
                  response.path,
                  100,
                  100,
                  "JPEG",
                  0.1,
                  0,
                  null
                )
                  .then((thumbnailData) => {
                    media.push({
                      media: {
                        imageThumbnail: {
                          uri: thumbnailData.path,
                          name: thumbnailData.name,
                          type: "image.jpg",
                        },
                        uri: response.path,
                        filename: response.filename,
                        type: response.mime,
                        height: response.height,
                        width: response.width,
                      },
                      thumbnail: "",
                      receipt_private: "0",
                      type: "image",
                    });
                    this.mediaImages = media;
                    this.image = [];
                    this.mediaImages.map((x) => {
                      if (x.type == "image") {
                        this.image.push(x);
                      }
                    });
                    this.setState({
                      disabled: false,
                      _imageCount: this.state._imageCount + 1,
                      imageSelected: this.image.length < 4 ? false : true,
                    });
                  })
                  .catch((e) => {});
              })
              .catch((e) => {
                console.log("ee", e);
              });
          }
        });
  };

  onVideoCall = () => {
    console.log("videoCall");
    const options = {
      presentationStyle: "overFullScreen",
      title: "Select Avatar",
      storageOptions: {
        skipBackup: true,
        path: "video",
      },
      mediaType: "video",
      durationLimit: 30,
      quality: 0.5,
      allowsEditing: false,
    };
    try {
      Platform.OS == "ios"
        ? request(PERMISSIONS.IOS.CAMERA).then((result) => {
            if (result == "blocked") {
              Alert.alert(
                I18n.t("videoPermissionTitle"),
                I18n.t("permissionBody"),
                [
                  {
                    text: I18n.t("Cancel"),
                    onPress: () => {
                      console.log("cancel");
                    },
                    style: "cancel",
                  },
                  { text: "OK", onPress: () => openSettings() },
                ],
                { cancelable: false }
              );
            } else {
              launchCamera(options, (res) => {
                if (res.didCancel == true) {
                } else if (res.error) {
                } else if (res.customButton) {
                } else if (res.assets) {
                  console.log("sddsdsdsds", res);
                  let response = res?.assets[0];
                  const source = { uri: res?.assets[0].uri };
                  let splitPath = response.uri.split("/");
                  console.log("splitPath", splitPath[splitPath.length - 1]);
                  response.filename = splitPath[splitPath.length - 1];
                  response.type = "video/mp4";
                  if (Platform.OS == "ios") {
                    RNThumbnail.get(response.uri)
                      .then((result) => {
                        let thumbnail = {
                          uri: result.path,
                          type: "image/jpeg",
                          filename: "photo.jpg",
                          height: result.height,
                          width: result.width,
                        };
                        this.setState({
                          visiblity: false,
                        });
                        let media = this.mediaImages;
                        media.push({
                          media: response,
                          thumbnail: thumbnail,
                          receipt_private: "0",
                          type: "video",
                        });
                        this.mediaImages = media;
                        this.setState({
                          media: "",
                          videoSelected: true,
                          _videoCount: 1,
                          disabled: false,
                        });
                      })
                      .catch((e) => {});
                  } else {
                    this.setState({ loading: true });
                    setTimeout(() => {
                      this.setState({ loading: false });
                    }, 1500);
                  }
                }
              });
            }
          })
        : request(PERMISSIONS.ANDROID.CAMERA).then((result) => {
            if (result == "blocked") {
              Alert.alert(
                I18n.t("videoPermissionTitle"),
                I18n.t("permissionBody"),
                [
                  {
                    text: I18n.t("Cancel"),
                    onPress: () => {
                      console.log("cancel");
                    },
                    style: "cancel",
                  },
                  { text: "OK", onPress: () => openSettings() },
                ],
                { cancelable: false }
              );
            } else {
              launchCamera(options, (res) => {
                if (Platform.OS == "android") {
                  if (res.didCancel) {
                  } else if (res.error) {
                  } else if (res.customButton) {
                  } else if (res?.assets) {
                    let response = res?.assets[0];
                    const source = { uri: response.uri };
                    response.path = response.uri;
                    let splitPath = response.uri.split("/");
                    console.log("splitPath", splitPath[splitPath.length - 1]);
                    response.filename = splitPath[splitPath.length - 1];
                    response.type = "video/mp4";
                    RNThumbnail.get(response.uri)
                      .then((result) => {
                        console.log("resultresultresult", result);
                        let thumbnail = {
                          uri: result.path,
                          type: "image/jpeg",
                          filename: "photo.jpg",
                          height: result.height,
                          width: result.width,
                        };
                        this.setState({
                          visiblity: false,
                        });
                        let media = this.mediaImages;
                        media.push({
                          media: response,
                          thumbnail: thumbnail,
                          receipt_private: "0",
                          type: "video",
                        });
                        this.mediaImages = media;
                        this.setState({
                          media: "",
                          videoSelected: true,
                          _videoCount: 1,
                          disabled: false,
                        });
                      })
                      .catch((e) => {});
                  }
                } else {
                  this.setState({ loading: true });
                  setTimeout(() => {
                    this.setState({ loading: false });
                  }, 1500);
                }
              });
            }
          });
    } catch (e) {
      console.log("videoCall::::::::::e", e);
    }
  };

  goBack = () => {
    this.props.searchUserState.tags = [];
    this.state.userDetail &&
      this.props.searchUserAction("", 0, this.props.navigation);
    this.props.navigation.goBack();
  };

  setData = (location, latitude, longitude) => {
    this.setState({
      location,
      visible: false,
      latitude: latitude,
      longitude: longitude,
    });
    this.ref.scrollTo({ x: 0, y: 0, animated: false });
  };

  componentDidMount() {
    AFLogEvent("CreatePostScreen", { screen: "Create Post Screen" });
    this.checkInternetConnection();

    Keyboard.addListener("keyboardWillShow", () => {
      this.setState({ position: "relative" });
    });
    Keyboard.addListener("keyboardWillHide", () => {
      this.setState({ position: "absolute" });
    });

    Keyboard.addListener("keyboardDidShow", () => {
      this.setState({ panelActive: false, keyboardOpen: true });
    });
    Keyboard.addListener("keyboardDidHide", () => {
      this.setState({ keyboardOpen: false });
    });

    this.focusListener = this.props.navigation.addListener("focus", () => {
      let tagsF = [];
      this.props.searchUserState.tags.map((x) => {
        tagsF.push(x._id);
      });
      this.setState({ tagsFriendsId: tagsF });
      let tags = [];
      this.props.searchUserState.result[0].data.map((x) => {
        if (x.isSelected) {
          if (x.isSelected == true) {
            tags.push(x);
          }
        }
      });
      this.setState({ selectedFriends: tags });
    });
    let userDetail = null;
    DataManager.getUserDetails().then((response) => {
      console.log(":::::::::::response", response);
      if (response) {
        userDetail = JSON.parse(response);
        this.setState({ userDetail: userDetail.data });
        // this.props.searchUserAction("", 0, this.props.navigation);
        // this.props.userInTerminal();
      }
    });
    if (!userDetail) {
      DataManager.getDummyUserDetails().then((res) => {
        console.log(":::::::Res", res);
        this.setState({ dummyUser: res.data });
      });
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      if (this.props.timeLine !== prevProps.timeLine) {
        if (this.props.timeLine.disable == false) {
          ``;
          this.setState({ disable: false });
        }
      }
    }
  }

  deletePostCall = (index) => {
    Platform.OS == "android"
      ? Alert.alert(
          I18n.t("Alert"),
          I18n.t("deleteMedia"),
          [
            {
              text: I18n.t("Yes"),
              onPress: () => {
                if (this.mediaImages[index].type == "video") {
                  this.setState(
                    { videoSelected: false, _videoCount: 0, crossClick: 0 },
                    () => {
                      if (
                        this.state._imageCount == 0 &&
                        this.state._videoCount == 0 &&
                        this.state.message.trim().length == 0
                      ) {
                        this.setState({ disabled: true });
                      }
                    }
                  );
                } else {
                  this.setState(
                    {
                      imageSelected: false,
                      _imageCount: this.state._imageCount - 1,
                      crossClick: 0,
                    },
                    () => {
                      if (
                        this.state._imageCount == 0 &&
                        this.state._videoCount == 0 &&
                        this.state.message.trim().length == 0
                      ) {
                        this.setState({ disabled: true });
                      }
                    }
                  );
                }
                this.mediaImages.splice(index, 1);
                this.viewRef1?.setPage(
                  this.state.index > 0 ? this.state.index - 1 : 0
                );
                this.viewRef2?.setPage(
                  this.state.index > 0 ? this.state.index - 1 : 0
                );
                this.setState({ media: "" });
              },
            },
            {
              text: I18n.t("No"),
              onPress: () => {
                this.setState({ crossClick: 0 });
              },
            },
          ],
          { cancelable: false }
        )
      : Alert.alert(
          I18n.t("Alert"),
          I18n.t("deleteMedia"),
          [
            {
              text: I18n.t("Yes"),
              onPress: () => {
                if (this.mediaImages[index].type == "video") {
                  this.setState(
                    { videoSelected: false, _videoCount: 0, crossClick: 0 },
                    () => {
                      if (
                        this.state._imageCount == 0 &&
                        this.state._videoCount == 0 &&
                        this.state.message.trim().length == 0
                      ) {
                        this.setState({ disabled: true });
                      }
                    }
                  );
                } else {
                  this.setState(
                    {
                      imageSelected: false,
                      _imageCount: this.state._imageCount - 1,
                      crossClick: 0,
                    },
                    () => {
                      if (
                        this.state._imageCount == 0 &&
                        this.state._videoCount == 0 &&
                        this.state.message.trim().length == 0
                      ) {
                        this.setState({ disabled: true });
                      }
                    }
                  );
                }
                this.mediaImages.splice(index, 1);
                this.viewRef1?.setPage(
                  this.state.index > 0 ? this.state.index - 1 : 0
                );
                this.viewRef2?.setPage(
                  this.state.index > 0 ? this.state.index - 1 : 0
                );
                this.setState({ media: "" });
              },
            },
            {
              text: I18n.t("No"),
              onPress: () => {
                this.setState({ crossClick: 0 });
              },
            },
          ],
          { cancelable: false }
        );
  };

  renderImages = (x, index) => {
    return (
      <TouchableOpacity style={{ marginBottom: 10 }} activeOpacity={1}>
        <View
          style={{
            marginTop: 20,
            width: "100%",
            justifyContent: "center",
            paddingHorizontal: 8,
          }}
        >
          {x.type == "video" ? (
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.push("VideoPreview", {
                  response: {
                    media: this.screen == "global" ? x.media : x.media,
                  },
                  thumbnail: Platform.OS == "ios" ? x.thumbnail : x.media,
                  terminalResult: { id: x?._id },
                  screen: "timeLineDetail",
                  type: "video",
                })
              }
            >
              <ImageBackground
                borderRadius={10}
                style={{
                  height: 140,
                  width: 140,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                source={{
                  uri:
                    this.screen == "global"
                      ? Platform.OS == "ios"
                        ? x.thumbnail.uri
                        : x.media.uri
                      : imageBaseUrl + x.thumbnail,
                }}
                // resizeMode="contain"
              >
                <CachedImage
                  source={AppImages.images.play}
                  style={{ height: 30, width: 30 }}
                />
              </ImageBackground>
            </TouchableOpacity>
          ) : (
            <View>
              <CachedImage
                resizeMode={"cover"}
                source={{
                  uri:
                    x.thumbnail == null || x.thumbnail == ""
                      ? this.screen == "global"
                        ? x?.media?.uri
                        : imageBaseUrl + x.media
                      : imageBaseUrl + x.media,
                }}
                style={[styles.postImage]}
              />
            </View>
          )}
        </View>
        {this.screen == "global" && (
          <TouchableOpacity
            onPress={() => {
              this.state.crossClick == 0 && this.deletePostCall(index);
              this.setState({ crossClick: 1 });
            }}
            activeOpacity={0.7}
            style={styles.crossButton}
          >
            <Entypo color={"#fff"} name="cross" size={25} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  sharePress = async () => {
    let login = await this.isLogin();
    if (login) {
      try {
        const result = await Share.share(
          {
            message:
              Platform.OS == "ios"
                ? this.state.userDetail.userName + I18n.t("postShareMessage")
                : this.state.userDetail.userName +
                  I18n.t("postShareMessage") +
                  "\n" +
                  branchBaseUrl +
                  this.itemParam._id +
                  "?type=route_post&version=" +
                  version,
            title: "FR8",
            url:
              branchBaseUrl +
              this.itemParam._id +
              "?type=route_post&version=" +
              version,
          },
          {
            subject: I18n.t("shareSubject"),
          }
        );
        if (result.action == Share.sharedAction) {
          if (result.activityType) {
          } else {
          }
        } else if (result.action == Share.dismissedAction) {
        }
      } catch (e) {}
    }
  };

  submitPress = () => {
    try {
      let mediaImages = [];
      if (this.screen !== "global") {
        mediaImages.push({
          media: this.itemParam.image,
          thumbnail: null,
          receipt_private: "0",
        });
        if (this.receiptPrivate == false) {
          if (this.interChange.length > 0) {
            this.interChange.map((x) => {
              mediaImages.push(x);
            });
          }
        }
        if (this.equipment.length > 0) {
          this.equipment.map((x) => {
            mediaImages.push(x);
          });
        }
        if (this.video.length > 0) {
          this.video.map((x) => {
            mediaImages.push(x);
          });
        }
      }
      if (this.screen == "global") {
        let images = [];
        let video = [];
        let thumbNail = "";
        this.mediaImages.map((x) => {
          if (x.type == "video") {
            video.push({
              uri: x.media,
              thumbnail: x.thumbnail,
            });
            thumbNail = x.thumbnail;
          } else {
            images.push({
              uri: x.media,
              thumbnail: x.media.imageThumbnail,
            });
          }
        });
        let imagesKey = [];
        let videoKey = [];
        if (images.concat(video).length > 0) {
          this.setState({ loading: true });
          images.concat(video).map((x) => {
            console.log("imagesssssss", x);
            const file = {
              uri: x.uri.uri,
              name: x.uri.filename,
              type: x.uri.type,
            };

            uploadImageOnS3(file, uuidv4_34(), "post", [])
              .then((res) => {
                console.log("file uploaded", res);
                s3bucket.upload(res, (err, data) => {
                  if (err) {
                    this.setState({ loading: false });
                    console.log("error in callback", err);
                  }
                  if (data.Location) {
                    if (x.uri.type == "video/mp4") {
                      const thumbFile = {
                        uri: x.thumbnail.uri,
                        name: x.thumbnail.filename,
                        type: x.thumbnail.type,
                      };
                      uploadImageOnS3(thumbFile, uuidv4_34(), "post", [])
                        .then((res) => {
                          console.log("file uploaded thumb", res);
                          s3bucket.upload(res, (err, data2) => {
                            if (err) {
                            }
                            if (data2.Location) {
                              videoKey.push({
                                url: data.key ? data.key : data.Key,
                                height: x.thumbnail.height,
                                width: x.thumbnail.width,
                                thumbnail: data2.key ? data2.key : data2.Key,
                              });
                              if (
                                videoKey.length + imagesKey.length ==
                                images.length + video.length
                              ) {
                                this.setState({ loading: false });
                                console.log("is called", this.state.dummyUser);
                                this.props.videoUploadAction(
                                  "",
                                  this.state.latitude,
                                  this.state.longitude,
                                  imagesKey,
                                  thumbNail,
                                  this.state.message.trim(),
                                  this.props.navigation,
                                  this.screen,
                                  videoKey,
                                  this.state.location,
                                  this.state.tagsFriendsId,
                                  this.state.dummyUser?.userId ?? ""
                                );
                              } else {
                                console.log(
                                  "videoKey.length+imagesKey.length==images.length+video.length",
                                  videoKey.length + imagesKey.length,
                                  images.length + video.length
                                );
                              }
                            }
                          });
                        })
                        .catch((e) => {
                          console.log("::::::::::e", e);
                        });
                    } else {
                      uploadImageOnS3(
                        x.thumbnail,
                        uuidv4_34(),
                        "post",
                        []
                      ).then((res) => {
                        console.log("file uploaded thumb", res);
                        s3bucket.upload(res, (err, data2) => {
                          if (err) {
                          }
                          if (data2.Location) {
                            imagesKey.push({
                              url: data.key ? data.key : data.Key,
                              height: x.uri.height,
                              width: x.uri.width,
                              thumbnail: data2.key ? data2.key : data2.Key,
                            });
                            if (
                              videoKey.length + imagesKey.length ==
                              images.length + video.length
                            ) {
                              this.setState({ loading: false });
                              console.log("is called");
                              this.props.videoUploadAction(
                                "",
                                this.state.latitude,
                                this.state.longitude,
                                imagesKey,
                                thumbNail,
                                this.state.message.trim(),
                                this.props.navigation,
                                this.screen,
                                videoKey,
                                this.state.location,
                                this.state.tagsFriendsId,
                                this.state.dummyUser?.userId ?? ""
                              );
                            } else {
                              console.log(
                                "videoKey.length+imagesKey.length==images.length+video.length",
                                videoKey.length + imagesKey.length,
                                images.length + video.length
                              );
                            }
                          }
                        });
                      });
                    }
                    if (
                      videoKey.length + imagesKey.length ==
                      images.length + video.length
                    ) {
                      this.setState({ loading: false });
                      console.log("is called");
                      this.props.videoUploadAction(
                        "",
                        this.state.latitude,
                        this.state.longitude,
                        imagesKey,
                        thumbNail,
                        this.state.message.trim(),
                        this.props.navigation,
                        this.screen,
                        videoKey,
                        this.state.location,
                        this.state.tagsFriendsId,
                        this.state.dummyUser.userId ?? ""
                      );
                    } else {
                      console.log(
                        "videoKey.length+imagesKey.length==images.length+video.length",
                        videoKey.length + imagesKey.length,
                        images.length + video.length
                      );
                    }
                  }
                });
              })
              .catch((e) => {
                console.log("::::::catch", e);
              });
          });
        } else {
          this.props.videoUploadAction(
            "",
            this.state.latitude,
            this.state.longitude,
            imagesKey,
            thumbNail,
            this.state.message.trim(),
            this.props.navigation,
            this.screen,
            videoKey,
            this.state.location,
            this.state.tagsFriendsId,
            this.state.dummyUser.userId
          );
        }
      } else {
        this.props.addTimeLinePost(
          this.itemParam._id,
          this.state.latitude,
          this.state.longitude,
          this.state.message,
          this.props.navigation,
          this.state.location,
          this.state.tagsFriendsId,
          this.state.dummyUser.userId
        );
      }
    } catch (e) {
      console.log("::::::catch", e);
    }
  };

  actionSheet = (navigation) => {
    this.setState({ panelActive: false });
    Platform.OS == "android"
      ? this.ActionSheet.show()
      : ActionSheetIOS.showActionSheetWithOptions(
          {
            options: [I18n.t("Cancel"), I18n.t("post"), I18n.t("Share")],
            cancelButtonIndex: 0,
          },
          (buttonIndex) => {
            if (buttonIndex == 1) {
              this.submitPress();
            } else if (buttonIndex == 2) {
              this.sharePress();
            }
          }
        );
  };

  androidActionSheetPress = async (buttonIndex) => {
    if (buttonIndex == 1) {
      this.submitPress();
    } else if (buttonIndex == 2) {
      this.sharePress();
    }
  };

  checkInternetConnection() {
    NetInfo.addEventListener((state) =>
      this.handleConnectionChange(state.isConnected)
    );
  }

  handleConnectionChange = (isConnected) => {
    this.internetStatus = isConnected;
  };

  internetPouup = () => {
    Alert.alert(
      I18n.t("Alert"),
      I18n.t("please_check_your_internet_connection"),
      [
        {
          text: I18n.t("Ok"),
          onPress: () => {
            this.setState({ internetAlert: 0 });
          },
        },
      ],
      { cancelable: false }
    );
  };

  render() {
    return (
      <>
        <Loader
          loading={
            this.props.timeLine.onLoad ||
            this.props.videoUploadState.onLoad ||
            this.state.loading
          }
        />

        {Platform.OS == "ios" ? (
          <View style={{ flex: DeviceInfo.hasNotch() ? 0.13 : 0.114 }}>
            <>
              <Header
                rightDisable={
                  this.screen == "global"
                    ? this.state.disabled
                      ? this.state.disabled
                      : this.props.videoUploadState.onLoad == true
                      ? true
                      : false
                    : null
                }
                customStyles={{
                  leftBtnView:
                    this.screen == "global"
                      ? {
                          borderWidth: 1,
                          height: 30,
                          borderColor: this.state.disabled
                            ? "rgba(256,256,256,0.5)"
                            : "#fff",
                          borderRadius: 15,
                          width: 75,
                          marginRight: 11,
                        }
                      : null,
                }}
                rightBackBtnPress={() => {
                  if (this.screen == "global") {
                    this.submitPress();
                  } else {
                    this.actionSheet(this.props.navigation);
                  }
                }}
                rightStyle={{
                  color: this.state.disabled ? "rgba(256,256,256,0.5)" : "#fff",
                }}
                rightHeaderText={
                  this.screen == "global" ? I18n.t("post") : null
                }
                rightVector={"ellipsis-v"}
                headerTitle={I18n.t("CreatePost")}
                leftImageSource={
                  this.state.visiblity == false ? AppImages.images.back : null
                }
                leftbackbtnPress={() => {
                  Keyboard.dismiss();
                  setTimeout(() => {
                    this.goBack();
                  }, 100);
                }}
              />
            </>
          </View>
        ) : (
          <>
            <Header
              rightDisable={
                this.screen == "global"
                  ? this.state.disabled
                    ? this.state.disabled
                    : this.props.videoUploadState.onLoad == true
                    ? true
                    : false
                  : null
              }
              customStyles={{
                leftBtnView:
                  this.screen == "global"
                    ? {
                        borderWidth: 1,
                        height: 30,
                        borderColor: this.state.disabled
                          ? "rgba(256,256,256,0.5)"
                          : "#fff",
                        borderRadius: 15,
                        width: 75,
                        marginRight: 11,
                      }
                    : null,
              }}
              rightBackBtnPress={() => {
                if (this.screen == "global") {
                  if (this.internetStatus === false) {
                    this.state.internetAlert == 0 && this.internetPouup();
                    this.setState({ internetAlert: 1 });
                  } else {
                    this.submitPress();
                  }
                } else {
                  this.actionSheet(this.props.navigation);
                }
              }}
              rightStyle={{
                color: this.state.disabled ? "rgba(256,256,256,0.5)" : "#fff",
              }}
              rightHeaderText={this.screen == "global" ? I18n.t("post") : null}
              rightVector={"ellipsis-v"}
              headerTitle={I18n.t("CreatePost")}
              leftImageSource={
                this.state.visiblity == false ? AppImages.images.back : null
              }
              leftbackbtnPress={() => {
                this.goBack();
              }}
            />
          </>
        )}
        <ScrollView
          onScroll={() => {
            this.setState({ panelActive: false }), Keyboard.dismiss();
          }}
          keyboardShouldPersistTaps={!this.state.visible ? "never" : "always"}
          ref={(ref) => (this.ref = ref)}
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={{ flex: 1 }}
          style={{ flex: 1, backgroundColor: "white" }}
        >
          <View style={{ flex: 1 }}>
            <View style={styles.container}>
              {Platform.OS == "ios" ? (
                <View style={{ flex: 1 }}>
                  <View style={styles.innerView}>
                    <View style={[styles.userView]}>
                      <View
                        style={{ borderRadius: 45 / 2, height: 45, width: 45 }}
                      >
                        <CachedImage
                          resizeMode="cover"
                          source={
                            this.state.userDetail
                              ? this.state.userDetail?.profile !== "" &&
                                this.state.userDetail?.profile !== null
                                ? {
                                    uri:
                                      imageBaseUrl +
                                      this.state.userDetail.profile,
                                  }
                                : AppImages.images.user01
                              : AppImages.images.user01
                          }
                          style={styles.userImage}
                        />
                      </View>
                      <View
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          width: "90%",
                          paddingTop: 2,
                        }}
                      >
                        <Text
                          numberOfLines={5}
                          style={[
                            styles.userPostsText,
                            {
                              textAlign: "left",
                              marginLeft: 15,
                              fontWeight: "bold",
                              lineHeight: 18,
                              width: "95%",
                            },
                          ]}
                        >
                          {this.state.userDetail
                            ? this.state.userDetail?.userName + " "
                            : this.state.dummyUser?.userName + " "}
                          {this.props.searchUserState.tags.length > 0 && (
                            <Text
                              numberOfLines={3}
                              style={[
                                styles.userPostsText,
                                {
                                  textAlign: "left",
                                  marginLeft: 15,
                                  fontWeight: "normal",
                                  lineHeight: 18,
                                  width: "95%",
                                },
                              ]}
                            >
                              - {I18n.t("With")}
                              <Text
                                style={[
                                  styles.userPostsText,
                                  {
                                    textAlign: "left",
                                    marginLeft: 15,
                                    fontWeight: "bold",
                                    lineHeight: 18,
                                    width: "95%",
                                  },
                                ]}
                              >
                                {" " +
                                  this.props.searchUserState.tags[0].userName}
                              </Text>
                              {this.props.searchUserState.tags.length > 2 &&
                                " " +
                                  [I18n.t("And").toLowerCase()] +
                                  " " +
                                  (this.props.searchUserState.tags.length - 1) +
                                  " " +
                                  I18n.t("others")}
                              {this.props.searchUserState.tags.length == 2 && (
                                <Text
                                  style={[
                                    styles.userPostsText,
                                    {
                                      textAlign: "left",
                                      marginLeft: 15,
                                      fontWeight: "normal",
                                      lineHeight: 18,
                                      width: "95%",
                                    },
                                  ]}
                                >
                                  {" " + I18n.t("And").toLowerCase() + " "}
                                  <Text
                                    style={[
                                      styles.userPostsText,
                                      {
                                        textAlign: "left",
                                        marginLeft: 15,
                                        fontWeight: "bold",
                                        lineHeight: 18,
                                        width: "95%",
                                      },
                                    ]}
                                  >
                                    {" " +
                                      this.props.searchUserState.tags[1]
                                        .userName}
                                  </Text>
                                </Text>
                              )}
                              {this.state.location.length > 0 && " in "}
                              {this.state.location.length > 0 && (
                                <Text
                                  numberOfLines={3}
                                  style={[
                                    styles.userPostsText,
                                    {
                                      textAlign: "left",
                                      marginLeft: 15,
                                      fontWeight: "700",
                                      lineHeight: 18,
                                      width: "95%",
                                    },
                                  ]}
                                >
                                  {this.state.location}
                                </Text>
                              )}
                            </Text>
                          )}
                          {this.state.location.length > 0 &&
                            this.props.searchUserState.tags.length == 0 && (
                              <Text
                                numberOfLines={3}
                                style={[
                                  styles.userPostsText,
                                  {
                                    textAlign: "left",
                                    marginLeft: 15,
                                    fontWeight: "700",
                                    lineHeight: 18,
                                    width: "95%",
                                  },
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.userPostsText,
                                    {
                                      textAlign: "left",
                                      marginLeft: 15,
                                      fontWeight: "normal",
                                      lineHeight: 18,
                                      width: "95%",
                                    },
                                  ]}
                                >
                                  {" in "}
                                </Text>
                                {this.state.location}
                              </Text>
                            )}
                        </Text>
                        {this.itemParam?.terminal && (
                          <Text
                            numberOfLines={2}
                            style={[
                              styles.userPostsText,
                              {
                                alignSelf: "flex-start",
                                textAlign: "left",
                                marginLeft: 15,
                                fontSize: 14,
                              },
                            ]}
                          >
                            {this.itemParam?.terminal?.terminal_name}
                          </Text>
                        )}
                        {this.screen !== "global" && (
                          <Text
                            numberOfLines={2}
                            style={[
                              styles.userPostsText,
                              {
                                textAlign: "left",
                                alignSelf: "flex-start",
                                // flex: 1,
                                marginLeft: 15,
                                fontSize: 12,
                                color: "gray",
                              },
                            ]}
                          >
                            {moment(
                              this.props.timeLine.detail?.created_at
                            ).format("MMMM DD, YYYY")}
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                  {this.mediaImages?.length > 0 && (
                    <View>
                      <ScrollView
                        contentContainerStyle={{ paddingHorizontal: 15 }}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                      >
                        {this.mediaImages.map((x, index) => {
                          return this.renderImages(x, index);
                        })}
                      </ScrollView>
                    </View>
                  )}
                  <View style={[styles.textInputView]}>
                    <TextInput
                      onScroll={() => this.setState({ panelActive: false })}
                      onFocus={() => this.setState({ panelActive: false })}
                      selectionColor="#29a2e1"
                      style={styles.input}
                      value={this.state.message}
                      placeholder={I18n.t("whatsOnMind")}
                      keyboardType="ascii-capable"
                      returnKeyType={"default"}
                      onChangeText={(message) => {
                        this.setState({ message }, () => {
                          if (this.state.message.trim().length > 0) {
                            this.setState({ disabled: false });
                          } else {
                            if (
                              this.state._imageCount == 0 &&
                              this.state._videoCount == 0
                            ) {
                              this.setState({ disabled: true });
                            }
                          }
                        });
                      }}
                      multiline={true}
                      maxLength={300}
                    />
                  </View>
                </View>
              ) : (
                <KeyboardAwareScrollView>
                  <View style={styles.innerView}>
                    <View style={[styles.userView]}>
                      <View
                        style={{ borderRadius: 45 / 2, height: 45, width: 45 }}
                      >
                        <CachedImage
                          resizeMode="cover"
                          source={
                            this.state.userDetail
                              ? this.state.userDetail?.profile !== "" &&
                                this.state.userDetail?.profile !== null
                                ? {
                                    uri:
                                      imageBaseUrl +
                                      this.state.userDetail.profile,
                                  }
                                : AppImages.images.user01
                              : AppImages.images.user01
                          }
                          style={styles.userImage}
                        />
                      </View>
                      <View
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          width: "90%",
                          paddingTop: 2,
                        }}
                      >
                        <Text
                          numberOfLines={5}
                          style={[
                            styles.userPostsText,
                            {
                              textAlign: "left",
                              marginLeft: 15,
                              fontWeight: "bold",
                              lineHeight: 18,
                              width: "95%",
                            },
                          ]}
                        >
                          {this.state.userDetail
                            ? this.state.userDetail?.userName + " "
                            : this.state.dummyUser?.userName + " "}
                          {this.props.searchUserState.tags.length > 0 && (
                            <Text
                              numberOfLines={3}
                              style={[
                                styles.userPostsText,
                                {
                                  textAlign: "left",
                                  marginLeft: 15,
                                  fontWeight: "normal",
                                  lineHeight: 18,
                                  width: "95%",
                                },
                              ]}
                            >
                              - {I18n.t("With")}
                              <Text
                                style={[
                                  styles.userPostsText,
                                  {
                                    textAlign: "left",
                                    marginLeft: 15,
                                    fontWeight: "bold",
                                    lineHeight: 18,
                                    width: "95%",
                                  },
                                ]}
                              >
                                {" " +
                                  this.props.searchUserState.tags[0].userName}
                              </Text>
                              {this.props.searchUserState.tags.length > 2 &&
                                " " +
                                  [I18n.t("And").toLowerCase()] +
                                  " " +
                                  (this.props.searchUserState.tags.length - 1) +
                                  " " +
                                  I18n.t("others")}
                              {this.props.searchUserState.tags.length == 2 && (
                                <Text
                                  style={[
                                    styles.userPostsText,
                                    {
                                      textAlign: "left",
                                      marginLeft: 15,
                                      fontWeight: "normal",
                                      lineHeight: 18,
                                      width: "95%",
                                    },
                                  ]}
                                >
                                  {" " + I18n.t("And").toLowerCase() + " "}
                                  <Text
                                    style={[
                                      styles.userPostsText,
                                      {
                                        textAlign: "left",
                                        marginLeft: 15,
                                        fontWeight: "bold",
                                        lineHeight: 18,
                                        width: "95%",
                                      },
                                    ]}
                                  >
                                    {" " +
                                      this.props.searchUserState.tags[1]
                                        .userName}
                                  </Text>
                                </Text>
                              )}
                              {this.state.location.length > 0 && " in "}
                              {this.state.location.length > 0 && (
                                <Text
                                  numberOfLines={3}
                                  style={[
                                    styles.userPostsText,
                                    {
                                      textAlign: "left",
                                      marginLeft: 15,
                                      fontWeight: "700",
                                      lineHeight: 18,
                                      width: "95%",
                                    },
                                  ]}
                                >
                                  {this.state.location}
                                </Text>
                              )}
                            </Text>
                          )}
                          {this.state.location.length > 0 &&
                            this.props.searchUserState.tags.length == 0 && (
                              <Text
                                numberOfLines={3}
                                style={[
                                  styles.userPostsText,
                                  {
                                    textAlign: "left",
                                    marginLeft: 15,
                                    fontWeight: "700",
                                    lineHeight: 18,
                                    width: "95%",
                                  },
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.userPostsText,
                                    {
                                      textAlign: "left",
                                      marginLeft: 15,
                                      fontWeight: "normal",
                                      lineHeight: 18,
                                      width: "95%",
                                    },
                                  ]}
                                >
                                  {" in "}
                                </Text>
                                {this.state.location}
                              </Text>
                            )}
                        </Text>
                        {this.itemParam?.terminal && (
                          <Text
                            numberOfLines={2}
                            style={[
                              styles.userPostsText,
                              {
                                alignSelf: "flex-start",
                                textAlign: "left",
                                marginLeft: 15,
                                fontSize: 14,
                              },
                            ]}
                          >
                            {this.itemParam?.terminal?.terminal_name}
                          </Text>
                        )}
                        {this.screen !== "global" && (
                          <Text
                            numberOfLines={2}
                            style={[
                              styles.userPostsText,
                              {
                                textAlign: "left",
                                alignSelf: "flex-start",
                                marginLeft: 15,
                                fontSize: 12,
                                color: "gray",
                              },
                            ]}
                          >
                            {moment(
                              this.props.timeLine.detail?.created_at
                            ).format("MMMM DD, YYYY")}
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                  {this.mediaImages?.length > 0 && (
                    <View
                      style={{
                        height: width * 0.45,
                        width: "100%",
                        paddingHorizontal: 15,
                        marginTop: 10,
                      }}
                    >
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                      >
                        {this.mediaImages.map((x, index) => {
                          return this.renderImages(x, index);
                        })}
                      </ScrollView>
                    </View>
                  )}
                  <View
                    style={[
                      styles.textInputView,
                      { marginTop: this.mediaImages.length > 0 ? -10 : 0 },
                    ]}
                  >
                    <TextInput
                      onScroll={() => this.setState({ panelActive: false })}
                      onFocus={() => this.setState({ panelActive: false })}
                      selectionColor="#29a2e1"
                      style={styles.input}
                      value={this.state.message}
                      placeholder={I18n.t("whatsOnMind")}
                      keyboardType="ascii-capable"
                      returnKeyType={"default"}
                      onChangeText={(message) => {
                        this.setState({ message }, () => {
                          if (this.state.message.trim().length > 0) {
                            this.setState({ disabled: false });
                          } else {
                            if (
                              this.state._imageCount == 0 &&
                              this.state._videoCount == 0
                            )
                              this.setState({ disabled: true });
                          }
                        });
                      }}
                      multiline={true}
                      maxLength={300}
                    />
                  </View>
                </KeyboardAwareScrollView>
              )}
              {
                <SwipeablePanel
                  noBackgroundOpacity={true}
                  onlyLarge={false}
                  scrollViewProps={{ scrollEnabled: false }}
                  closeOnTouchOutside
                  allowTouchOutside={Platform.OS == "ios" ? true : false}
                  style={[
                    styles.swipablePanel,
                    {
                      justifyContent: "center",
                      height:
                        this.screen == "global"
                          ? this.mediaImages.length < 5
                            ? this.state.videoSelected ||
                              this.state.imageSelected
                              ? Platform.OS == "ios"
                                ? DeviceInfo.hasNotch()
                                  ? height * 0.79
                                  : height * 0.75
                                : DeviceInfo.hasNotch()
                                ? height * 0.77
                                : height * 0.81
                              : Platform.OS == "ios"
                              ? DeviceInfo.hasNotch()
                                ? height * 0.8
                                : height * 0.8
                              : DeviceInfo.hasNotch()
                              ? height * 0.77
                              : height * 0.81
                            : Platform.OS == "ios"
                            ? DeviceInfo.hasNotch()
                              ? height * 0.8
                              : height * 0.64
                            : DeviceInfo.hasNotch()
                            ? height * 0.65
                            : height * 0.7
                          : Platform.OS == "ios"
                          ? DeviceInfo.hasNotch()
                            ? height * 0.69
                            : height * 0.64
                          : DeviceInfo.hasNotch()
                          ? height * 0.65
                          : height * 0.7,
                    },
                  ]}
                  onClose={() => this.setState({ panelActive: false })}
                  onlySmall={true}
                  openLarge={false}
                  isActive={this.state.panelActive}
                  fullWidth={true}
                >
                  <View style={styles.postView}>
                    {/* camera */}
                    {this.screen == "global" && !this.state.imageSelected && (
                      <View style={[styles.checkIn, { marginTop: 10 }]}>
                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={() => this.onImageCall()}
                        >
                          <Image
                            style={styles.icon}
                            resizeMode="contain"
                            source={require("../../Images/Photo2.png")}
                          />
                        </TouchableOpacity>
                        <Text
                          onPress={() => this.onImageCall()}
                          style={[styles.iconText]}
                        >
                          {I18n.t("photoL")}
                        </Text>
                      </View>
                    )}
                    {/* video */}
                    {this.screen == "global" && !this.state.videoSelected && (
                      <View style={[styles.checkIn]}>
                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={() => this.onVideoCall()}
                        >
                          <Image
                            style={styles.icon}
                            resizeMode="contain"
                            source={require("../../Images/Video2.png")}
                          />
                        </TouchableOpacity>
                        <Text
                          onPress={() => this.onVideoCall()}
                          style={[styles.iconText]}
                        >
                          {I18n.t("video")}
                        </Text>
                      </View>
                    )}
                    {/* photo liberary */}
                    {this.screen == "global" && this.mediaImages.length < 5 && (
                      <View style={[styles.checkIn]}>
                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={() => this.onLibraryCall()}
                        >
                          <Image
                            style={styles.icon}
                            resizeMode="contain"
                            source={require("../../Images/Photograph2.png")}
                          />
                        </TouchableOpacity>
                        <Text
                          onPress={() => {
                            this.onLibraryCall();
                          }}
                          style={[styles.iconText]}
                        >
                          {I18n.t("photoLibraryL")}
                        </Text>
                      </View>
                    )}
                    {/* new change s */}
                    {this.state.userDetail && (
                      <>
                        <View
                          style={[
                            styles.tagView,
                            {
                              marginTop:
                                this.screen == "global" &&
                                this.mediaImages.length < 5
                                  ? 5
                                  : 5,
                            },
                          ]}
                        >
                          <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() =>
                              this.props.navigation.navigate("TagFriends")
                            }
                          >
                            <Image
                              style={{ height: 30, width: 30 }}
                              resizeMode="contain"
                              source={require("../../Images/tagFriend2.jpg")}
                            />
                          </TouchableOpacity>
                          <Text
                            onPress={() =>
                              this.props.navigation.navigate("TagFriends")
                            }
                            style={[styles.iconText]}
                          >
                            {I18n.t("tagFriends")}
                          </Text>
                        </View>

                        <View style={styles.checkIn}>
                          <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => {
                              // this.props.navigation.navigate('GooglePlaces')
                              this.setState({ visible: true });
                              this.props.recentLocations();
                            }}
                          >
                            <Image
                              style={{ height: 30, width: 25 }}
                              resizeMode="cover"
                              source={require("../../Images/checkin5.png")}
                            />
                          </TouchableOpacity>
                          <Text
                            onPress={() => {
                              this.props.recentLocations();
                              this.setState({ visible: true });
                            }}
                            style={[styles.iconText, { paddingLeft: 5 }]}
                          >
                            {I18n.t("checkIN")}
                          </Text>
                        </View>
                      </>
                    )}
                  </View>
                </SwipeablePanel>
              }
            </View>
            <Modal
              style={{ flex: 1 }}
              onRequestClose={() => this.setState({ visible: false })}
              visible={this.state.visible}
            >
              <GooglePlacesInput
                selectedText={this.state.location}
                isRecentLocations={true}
                isCustomText={true}
                userInTerminal={this.props.routePostData.inTerminal}
                rightBackPress={(location, latitude, longitude) => {
                  location.length == 0
                    ? alert(I18n.t("locationSelect"))
                    : this.setData(location, latitude, longitude);
                }}
                terminalDetail={this.itemParam?.terminal}
                leftBackPress={() => this.setState({ visible: false })}
              />
            </Modal>
            <CameraModal
              onImage={
                this.state.imageSelected
                  ? null
                  : () => {
                      this.onImageCall();
                    }
              }
              onVideo={
                this.state.videoSelected
                  ? null
                  : () => {
                      this.onVideoCall();
                    }
              }
              onLibrary={() => {
                this.onLibraryCall();
              }}
              oncancel={() => {
                this.setState({ visiblity: false });
              }}
              visible={this.state.visiblity}
            />
          </View>
          {this.state.keyboardOpen == false && this.state.panelActive == false && (
            <View style={styles.bottomView}>
              {/* camera */}
              {this.screen == "global" && !this.state.imageSelected && (
                <View style={[styles.checkIn, {}]}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => this.onImageCall()}
                  >
                    <Image
                      style={styles.icon}
                      resizeMode="contain"
                      source={require("../../Images/Photo2.png")}
                    />
                  </TouchableOpacity>
                </View>
              )}
              {/* video */}
              {this.screen == "global" && !this.state.videoSelected && (
                <View style={[styles.checkIn]}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => this.onVideoCall()}
                  >
                    <Image
                      style={styles.icon}
                      resizeMode="contain"
                      source={require("../../Images/Video2.png")}
                    />
                  </TouchableOpacity>
                </View>
              )}
              {/* photo liberary */}
              {this.screen == "global" && this.mediaImages.length < 5 && (
                <View style={[styles.checkIn]}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => this.onLibraryCall()}
                  >
                    <Image
                      style={styles.icon}
                      resizeMode="contain"
                      source={require("../../Images/Photograph2.png")}
                    />
                  </TouchableOpacity>
                </View>
              )}
              {/* new change s */}
              {this.screen == "global" ? (
                this.mediaImages.length >= 5 && (
                  <View
                    style={[
                      styles.tagView,
                      {
                        marginTop:
                          this.screen == "global" && this.mediaImages.length < 5
                            ? 0
                            : 10,
                      },
                    ]}
                  >
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() =>
                        this.props.navigation.navigate("TagFriends")
                      }
                    >
                      <Image
                        style={{ height: 30, width: 30 }}
                        resizeMode="contain"
                        source={require("../../Images/tagFriend2.jpg")}
                      />
                    </TouchableOpacity>
                  </View>
                )
              ) : (
                <View
                  style={[
                    styles.tagView,
                    {
                      marginTop:
                        this.screen == "global" && this.mediaImages.length < 5
                          ? 0
                          : 10,
                    },
                  ]}
                >
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => this.props.navigation.navigate("TagFriends")}
                  >
                    <Image
                      style={{ height: 30, width: 30 }}
                      resizeMode="contain"
                      source={require("../../Images/tagFriend2.jpg")}
                    />
                  </TouchableOpacity>
                </View>
              )}

              <View style={[styles.checkIn]}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    Keyboard.dismiss();
                    this.setState({ panelActive: true });
                  }}
                >
                  <Image
                    style={styles.icon}
                    resizeMode="contain"
                    source={require("../../Images/dots.png")}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
        <ActionSheet
          ref={(o) => (this.ActionSheet = o)}
          options={[I18n.t("Cancel"), I18n.t("post"), I18n.t("Share")]}
          cancelButtonIndex={0}
          onPress={(index) => {
            this.androidActionSheetPress(index);
          }}
        />
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    timeLine: state.timeLine,
    myFriendsState: state.MyFriendsState,
    searchUserState: state.SearchUserState,
    videoUploadState: state.VideoUploadState,
    routePostData: state.RoutePostData,
  };
}
export default connect(
  mapStateToProps,
  {
    addTimeLinePost,
    recentLocations,
    userInTerminal,
    videoUploadAction,
    myFriendAction,
    searchUserAction,
    updateImageVideoCount,
  }
)(TimeLinePostCreate);
