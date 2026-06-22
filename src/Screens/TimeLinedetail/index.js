import React, { Component } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  Alert,
  ActionSheetIOS,
  Platform,
  PermissionsAndroid,
} from "react-native";
import { AppImages } from "./../../Themes";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Header, Button, Loader, DataManager } from "../../Components";
import styles from "./style";
import { AppFontFamily } from "../../Themes";
import { addTimeLinePost } from "../../Redux/actions/timeLineAction";
import {
  deleteTimeLineAction,
  routeDetailGet,
  InterChangeAdd,
  equipmentAdd,
  videoAdd,
  deleteInterchange,
  deleteEquipment,
  deleteVideo,
  InterChangeEdit,
  equipmentEdit,
  videoEdit,
  privateReceipt,
  EditTimeLineAction,
} from "../../Redux/actions/RoutePostAction";
import PushNotification from "../../PushManager";
import Branch, { BranchEvent } from "react-native-branch";
import { ScrollView } from "react-native";
import { PERMISSIONS, openSettings, request } from "react-native-permissions";
import ImagePicker from "react-native-image-picker";
import Entypo from "react-native-vector-icons/Entypo";
import RNThumbnail from "react-native-thumbnail";
import I18n from "react-native-i18n";
import ActionSheet from "react-native-actionsheet";
import MakeRoute from "../FR8/MakeRoute";
import Switch from "./switch";
import { imageBaseUrl, socketBaseUrl, version } from "../../Config";
import { getTerminalWaitingTime } from "../../Components/getTerminalWaitingTime";
import ManualHorizontalList from "./ManualHorizontalList";
import NetInfo from "@react-native-community/netinfo";
import RNFetchBlob from "rn-fetch-blob";
import moment from "moment";
import { s3bucket, uploadImageOnS3, uuidv4_34 } from "../../Config/aws";
import ImageResizer from "react-native-image-resizer";
import ImageCropPicker from "react-native-image-crop-picker";

const width = Dimensions.get("screen").width;
let _this;
class TimeLineDetail extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: null,
    };
  };
  constructor(porps) {
    super(porps);
    this.state = {
      type: "",
      oldFileArray: [],
      disabled: false,
      loading: false,
      userName: "",
      userDetail: null,
      sTitle: "",
      sUrl: "",
      sImage: "",
      switchValue: false,
      isScreenShot: false,
      corrdinates: null,
      item: this.props.route.params.item,
      interChangeShow: false,
      equipmentShow: false,
      videoShow: false,
      internetAlert: 0,
    };
    this.internetStatus = null;

    _this = this;
    this.getUserDetails();
  }

  checkInternetConnection() {
    NetInfo.addEventListener((state) =>
      this.handleConnectionChange(state.isConnected)
    );
  }

  handleConnectionChange = (isConnected) => {
    this.internetStatus = isConnected;
  };

  headerTitleGet = () => {
    if (this.state.item) {
      if (this.state.item.terminal) {
        return this.state.item.terminal.terminal_name;
      }
    }
  };
  share = async () => {
    let mediaImages = [];
    mediaImages.push({
      media: this.state.item.image,
      thumbnail: null,
      receipt_private: "0",
    });
    if (this.props.timeLineState.receiptPrivate == false) {
      if (this.props.timeLineState.interChange.length > 0) {
        this.props.timeLineState.interChange.map((x) => {
          mediaImages.push(x);
        });
      }
    }
    if (this.props.timeLineState.equipment.length > 0) {
      this.props.timeLineState.equipment.map((x) => {
        mediaImages.push(x);
      });
    }
    if (this.props.timeLineState.video.length > 0) {
      this.props.timeLineState.video.map((x) => {
        mediaImages.push(x);
      });
    }

    if (this.props?.timeLineState?.manualMedia) {
      if (this.props.timeLineState.manualMedia.length > 0) {
        this.props.timeLineState.manualMedia?.map((x) => {
          if (x.is_video) {
            mediaImages.push({
              type: "video",
              media: x.url,
              thumbnail: x.thumbnail,
              receipt_private: "0",
            });
          } else {
            mediaImages.push({
              media: x.url,
              thumbnail: null,
              receipt_private: "0",
            });
          }
        });
      }
    }

    this.props.navigation.navigate("TimeLinePostCreate", {
      item: this.state.item,
      interChange: this.props.timeLineState.interChange,
      equipment: this.props.timeLineState.equipment,
      video: this.props.timeLineState.video,
      receiptPrivate: this.props.timeLineState.receiptPrivate,
      mediaImages,
    });
    this.props.timeLineState.linkingData = null;
  };
  _unsubscribeFromBranchData = () => {
    this._unsubscribeFromBranch = Branch.subscribe(({ error, params, uri }) => {
      if (error) {
        return;
      }
      if (!params["+clicked_branch_link"]) return;
      let title = params.$og_title;
      let urll = params.$canonical_url;
      let image = params.$og_image_url;
      this.setState({ sTitle: title, sUrl: urll, sImage: image });
    });
  };
  handleConnectivityChange(isConnected) {
    if (isConnected) {
      if (this.props?.routeDetailGet) {
        this.props?.routeDetailGet(
          this.props.route?.params.item?._id,
          this.props.navigation
        );
      }
    }
  }

  async componentDidMount() {
    this.checkInternetConnection();
    NetInfo.addEventListener((state) =>
      this.handleConnectionChange(state.isConnected)
    );
    this.props.routeDetailGet(
      this.props.route.params.item._id,
      this.props.navigation
    );
    if (this.state.item) {
      if (
        this.state.item.coordinates !== null &&
        this.state.item.coordinates !== undefined
      ) {
        let parseData = JSON.parse(this.state.item.coordinates);
        this.setState({ corrdinates: parseData });
        if (
          this.routeRef !== null &&
          this.routeRef !== undefined &&
          this.state.item.image == null
        ) {
          this.routeRef.state.mapReady &&
            this.routeRef?.mapSnapRef?.fitToCoordinates(parseData, {
              edgePadding: { top: 10, bottom: 10, right: 10, left: 10 },
              animated: true,
            });
          setTimeout(() => {
            this.routeRef?.mapSnapRef
              ?.takeSnapshot({
                format: "png", // image formats: 'png', 'jpg' (default: 'png')
                quality: 1, // image quality: 0.1 (only relevant for jpg, default: 1)
                result: "file", // result types: 'file', 'base64' (default: 'file')
              })
              .then((uri) => {
                console.log("uri", uri);
                this.setState({ makeRoute: false });
                this.routeRef.setState({ minZoomLevel: 10 });
                this.props.EditTimeLineAction(
                  this.state.item.start_time,
                  this.state.item.end_time,
                  uri,
                  this.state.item._id,
                  this.state.item.distance,
                  this.state.item.minute,
                  this.state.item.terminal_id,
                  null
                );
              });
          }, 2000);
        } else {
          if (this.routeRef !== null && this.routeRef !== undefined) {
            this.routeRef.setState({ minZoomLevel: 10 });
          }
        }
      }
    }
    this.getUserDetails();
    this.buo = await Branch.createBranchUniversalObject("canonicalIdentifier", {
      locallyIndex: true,
      canonicalUrl: this.state.sUrl,
      title: "cool content",
      contentImageUrl: this.state.sImage,
    });
    this.buo.logEvent(BranchEvent.ViewItem);
  }
  getUserDetails = async () => {
    await DataManager.getUserDetails().then((response) => {
      if (response !== null) {
        let result = JSON.parse(response);
        this.setState({ userName: result.data.name, userDetail: result.data });
      } else {
      }
    });
  };
  androidActionSheetPress = (buttonIndex) => {
    if (buttonIndex == 1) {
      this.props.navigation.navigate("EditTimeLine", { item: this.state.item });
      this.props.timeLineState.linkingData = null;
    } else if (buttonIndex == 2) {
      this.deleteTimeLine();
      this.props.timeLineState.linkingData = null;
    }
  };
  actionSheet = (navigation) => {
    Platform.OS == "android"
      ? this.ActionSheet.show()
      : ActionSheetIOS.showActionSheetWithOptions(
          {
            options: [I18n.t("Cancel"), I18n.t("Edit"), I18n.t("Delete")],
            destructiveButtonIndex: 2,
            cancelButtonIndex: 0,
          },
          (buttonIndex) => {
            if (buttonIndex == 1) {
              navigation.navigate("EditTimeLine", { item: this.state.item });
              this.props.timeLineState.linkingData = null;
            } else if (buttonIndex == 2) {
              this.deleteTimeLine();
              this.props.timeLineState.linkingData = null;
            }
          }
        );
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

  downloadFile(id) {
    const pdfDate = moment(this.state.item.created_at).format("DD MMM YYYY");
    const pdfTime = moment(this.state.item.created_at).format("hh-mm-ss");
    const pdfFileName =
      this.state.userDetail.userName +
      "_TimelineReport_" +
      pdfDate +
      "_" +
      pdfTime;
    const { fs } = RNFetchBlob;
    const downloads = fs.dirs.DocumentDir;
    const tmpFile =
      RNFetchBlob.fs.dirs.DocumentDir + "/" + pdfFileName + ".pdf";

    if (Platform.OS == "android") {
      fetch(
        socketBaseUrl + `/api/${version}/timeline/pdf/${id}?type=route_post`
      )
        .then((ress) => {
          ress.json().then((parseRes) => {
            console.log("ressaddsa", parseRes);
            console.log("ressaddsa", parseRes.data.url);
            RNFetchBlob.config({
              IOSBackgroundTask: true,
              fileCache: false,
              timeout: 2000,
              trusty: true,
              path: tmpFile,
              addAndroidDownloads: {
                useDownloadManager: true,
                notification: true,
                path: fs.dirs.DownloadDir + "/" + pdfFileName + ".pdf",
              },
            })
              .fetch("GET", imageBaseUrl + parseRes.data.url)
              .then((res) => {
                if (Platform.OS == "ios") {
                  RNFetchBlob.ios.openDocument(res.data);
                } else {
                }
              })
              .catch((e) => {});
          });
        })
        .catch((e) => {
          console.log(e);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      fetch(
        socketBaseUrl + `/api/${version}/timeline/pdf/${id}?type=route_post`
      )
        .then((ress) => {
          ress.json().then((res) => {
            console.log("ressaddsa", res);

            RNFetchBlob.config({
              IOSBackgroundTask: true,
              fileCache: false,
              timeout: 600000,
              trusty: true,
              path: tmpFile,
              addAndroidDownloads: {
                useDownloadManager: true,
                notification: true,
                path: fs.dirs.DownloadDir + "/" + new Date().getTime() + ".pdf",
              },
            })
              .fetch("GET", imageBaseUrl + res.data.url)
              .then((res) => {
                if (Platform.OS == "ios") {
                  RNFetchBlob.ios.openDocument(res.data);
                } else {
                }
              })
              .catch((e) => {});
          });
        })
        .catch((error) => {
          console.log(error);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  pdfDownLoadClick = async () => {
    if (Platform.OS == "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          if (this.internetStatus === false) {
            this.state.internetAlert == 0 && this.internetPouup();
            this.setState({ internetAlert: 1 });
          } else {
            this.downloadFile(this.state.item._id);
          }
        } else {
          Alert.alert(
            "Permission Denied!",
            "You need to give storage permission to download the file"
          );
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      if (this.internetStatus === false) {
        this.state.internetAlert == 0 && this.internetPouup();
        this.setState({ internetAlert: 1 });
      } else {
        this.downloadFile(this.state.item._id);
      }
    }
  };

  //share and download pdf
  androidActionSheetPress2 = (buttonIndex) => {
    if (buttonIndex == 1) {
      this.pdfDownLoadClick();
    } else if (buttonIndex == 2) {
      this.share();
    }
  };
  androidActionSheetPressPicker = (buttonIndex) => {
    let type = this.state.type;
    let oldFileArray = this.state.oldFileArray;
    if (buttonIndex == 1) {
      ImageCropPicker.openCamera({
        cropperToolbarTitle: "Select Image",
        mediaType: "photo",
        compressImageQuality: 0.5,
      }).then((response) => {
        let splitPath = response.path.split("/");
        console.log("splitPath", splitPath[splitPath.length - 1]);
        response.filename = splitPath[splitPath.length - 1];
        response.uri = response.path;
        response.fileName = splitPath[splitPath.length - 1];
        response.type = response.mime;
        const source = {
          uri: response.uri,
          type: response.type,
          name: response.filename,
        };

        uploadImageOnS3(source, uuidv4_34(), "route_post", oldFileArray).then(
          (res) => {
            this.setState({ loading: true });
            console.log("file uploaded", res);
            s3bucket.upload(res, (err, data) => {
              if (err) {
                this.setState({ loading: false });
                console.log("error in callback", err);
              }
              console.log("Respomse URL : ", data.key);
              if (data.Location) {
                ImageResizer.createResizedImage(
                  response.uri,
                  100,
                  100,
                  "JPEG",
                  0.2,
                  0,
                  null
                )
                  .then((thumbnailData) => {
                    console.log("thumbnailDatathumbnailData", thumbnailData);
                    let f = {
                      uri: thumbnailData.path,
                      name: thumbnailData.name,
                      type: "image.jpg",
                    };
                    uploadImageOnS3(f, uuidv4_34(), "route_post", []).then(
                      (res) => {
                        s3bucket.upload(res, (err, data2) => {
                          if (err) {
                            this.setState({ loading: false });
                            console.log("error in callback", err);
                          }
                          if (data2.Location) {
                            this.setState({
                              visiblity: false,
                              loading: false,
                            });
                            if (type == "interchange") {
                              this.props.InterChangeAdd(
                                this.state.item._id,
                                0,
                                [
                                  {
                                    url: data.key,
                                    height: response.height,
                                    width: response.width,
                                    thumbnail: data2.key,
                                  },
                                ],
                                this.props.navigation
                              );
                            } else if (type == "equipment") {
                              this.props.equipmentAdd(
                                this.state.item._id,
                                0,
                                [
                                  {
                                    url: data.key,
                                    height: response.height,
                                    width: response.width,
                                    thumbnail: data2.key,
                                  },
                                ],
                                this.props.navigation
                              );
                            } else if (type.includes("interChangeEdit")) {
                              let splitData = type.split(" ");
                              this.props.InterChangeEdit(
                                this.state.item._id,
                                splitData[1],
                                0,
                                [
                                  {
                                    url: data.key,
                                    height: response.height,
                                    width: response.width,
                                    thumbnail: data2.key,
                                  },
                                ],
                                this.props.navigation
                              );
                            } else if (type.includes("equipmentEdit")) {
                              let splitData = type.split(" ");
                              this.props.equipmentEdit(
                                this.state.item._id,
                                splitData[1],
                                0,
                                [
                                  {
                                    url: data.key,
                                    height: response.height,
                                    width: response.width,
                                    thumbnail: data2.key,
                                  },
                                ],
                                this.props.navigation
                              );
                            }
                          }
                        });
                      }
                    );
                  })
                  .catch((e) => {});
              }
            });
          }
        );
      });
    } else if (buttonIndex == 2) {
      ImageCropPicker.openPicker({
        cropperToolbarTitle: "Select Image",
        mediaType: "photo",
        compressImageQuality: 0.5,
      }).then((response) => {
        let splitPath = response.path.split("/");
        console.log("splitPath", splitPath[splitPath.length - 1]);
        response.filename = splitPath[splitPath.length - 1];
        response.uri = response.path;
        response.fileName = splitPath[splitPath.length - 1];
        response.type = response.mime;
        const source = {
          uri: response.uri,
          type: response.type,
          name: response.filename,
        };

        uploadImageOnS3(source, uuidv4_34(), "route_post", oldFileArray).then(
          (res) => {
            this.setState({ loading: true });
            console.log("file uploaded", res);
            s3bucket.upload(res, (err, data) => {
              if (err) {
                this.setState({ loading: false });
                console.log("error in callback", err);
              }
              console.log("Respomse URL : ", data.key);
              if (data.Location) {
                ImageResizer.createResizedImage(
                  response.uri,
                  100,
                  100,
                  "JPEG",
                  0.2,
                  0,
                  null
                )
                  .then((thumbnailData) => {
                    console.log("thumbnailDatathumbnailData", thumbnailData);
                    let f = {
                      uri: thumbnailData.path,
                      name: thumbnailData.name,
                      type: "image.jpg",
                    };
                    uploadImageOnS3(f, uuidv4_34(), "route_post", []).then(
                      (res) => {
                        s3bucket.upload(res, (err, data2) => {
                          if (err) {
                            this.setState({ loading: false });
                            console.log("error in callback", err);
                          }
                          if (data2.Location) {
                            this.setState({
                              visiblity: false,
                              loading: false,
                            });
                            if (type == "interchange") {
                              this.props.InterChangeAdd(
                                this.state.item._id,
                                0,
                                [
                                  {
                                    url: data.key,
                                    height: response.height,
                                    width: response.width,
                                    thumbnail: data2.key,
                                  },
                                ],
                                this.props.navigation
                              );
                            } else if (type == "equipment") {
                              this.props.equipmentAdd(
                                this.state.item._id,
                                0,
                                [
                                  {
                                    url: data.key,
                                    height: response.height,
                                    width: response.width,
                                    thumbnail: data2.key,
                                  },
                                ],
                                this.props.navigation
                              );
                            } else if (type.includes("interChangeEdit")) {
                              let splitData = type.split(" ");
                              this.props.InterChangeEdit(
                                this.state.item._id,
                                splitData[1],
                                0,
                                [
                                  {
                                    url: data.key,
                                    height: response.height,
                                    width: response.width,
                                    thumbnail: data2.key,
                                  },
                                ],
                                this.props.navigation
                              );
                            } else if (type.includes("equipmentEdit")) {
                              let splitData = type.split(" ");
                              this.props.equipmentEdit(
                                this.state.item._id,
                                splitData[1],
                                0,
                                [
                                  {
                                    url: data.key,
                                    height: response.height,
                                    width: response.width,
                                    thumbnail: data2.key,
                                  },
                                ],
                                this.props.navigation
                              );
                            }
                          }
                        });
                      }
                    );
                  })
                  .catch((e) => {});
              }
            });
          }
        );
      });
    }
  };
  actionSheet2 = (navigation) => {
    Platform.OS == "android"
      ? this.ActionSheet2.show()
      : ActionSheetIOS.showActionSheetWithOptions(
          {
            options: [
              I18n.t("Cancel"),
              I18n.t("pdfDownload"),
              I18n.t("CreatePost"),
            ],
            cancelButtonIndex: 0,
          },
          (buttonIndex) => {
            if (buttonIndex == 1) {
              this.pdfDownLoadClick();
            } else if (buttonIndex == 2) {
              this.share();
            }
          }
        );
  };

  deleteTimeLine = () => {
    Platform.OS == "android"
      ? Alert.alert(
          I18n.t("Alert"),
          I18n.t("deletePostAlert"),
          [
            {
              text: I18n.t("Yes"),
              onPress: () =>
                this.props.deleteTimeLineAction(
                  this.state.item._id,
                  this.props.navigation
                ),
            },
            {
              text: I18n.t("No"),
              onPress: () => {},
            },
          ],
          { cancelable: false }
        )
      : Alert.alert(
          I18n.t("deletePostAlert"),
          "",
          [
            {
              text: I18n.t("Yes"),
              onPress: () =>
                this.props.deleteTimeLineAction(
                  this.state.item._id,
                  this.props.navigation
                ),
            },
            {
              text: I18n.t("No"),
              onPress: () => {},
            },
          ],
          { cancelable: false }
        );
  };
  getTime = (seconds) => {
    seconds = Number(seconds);
    var h = Math.floor(seconds / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    var s = Math.floor(seconds % 60);
    if (h > 0) {
      return (
        <Text style={styles.dataTextStyle}>
          {h}
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              fontSize: 16,
              fontFamily: AppFontFamily.fontFamily.regular,
            }}
          >
            {" "}
            h{" "}
          </Text>
          {m}
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              fontSize: 16,
              fontFamily: AppFontFamily.fontFamily.regular,
            }}
          >
            {" "}
            m{" "}
          </Text>
        </Text>
      );
    } else {
      return (
        <Text style={styles.dataTextStyle}>
          {s > 29 ? m + 1 : m}
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              fontSize: 16,
              fontFamily: AppFontFamily.fontFamily.regular,
            }}
          >
            {" "}
            m{" "}
          </Text>
        </Text>
      );
    }
  };
  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      if (prevProps.timeLineState !== this.props.timeLineState) {
        if (this.props.timeLineState.status == 1) {
          if (this.props.timeLineState.timeLineDetail) {
            if (this.props.timeLineState.timeLineDetail.coordinates !== null) {
              let parseData = JSON.parse(
                this.props.timeLineState.timeLineDetail.coordinates
              );
              this.setState({ corrdinates: parseData });
            }
          }
          this.props.timeLineState.status = 0;
          if (
            this.props.timeLineState.receiptPrivate == "1" ||
            this.props.timeLineState.receiptPrivate == true
          ) {
            this.setState({
              item: this.props.timeLineState.timeLineDetail,
              switchValue: true,
            });
          } else if (
            this.props.timeLineState.receiptPrivate == "0" ||
            this.props.timeLineState.receiptPrivate == false
          ) {
            this.setState({
              item: this.props.timeLineState.timeLineDetail,
              switchValue: false,
            });
          }
        }
        if (this.props.timeLineState.imageUpdate == true) {
          this.props.timeLineState.imageUpdate = false;
          this.props.routeDetailGet(
            this.props.route.params.item._id,
            this.props.navigation
          );
        }
        if (this.props.timeLineState.delete == true) {
          this.props.timeLineState.delete = false;
          if (this.props.timeLineState.interChange.length == 0) {
            if (this.state.interChangeShow == true) {
              this.setState({ interChangeShow: false });
            }
          }
          if (this.props.timeLineState.equipment.length == 0) {
            if (this.state.equipmentShow == true) {
              this.setState({ equipmentShow: false });
            }
          }
          if (this.props.timeLineState.video.length == 0) {
            if (this.state.videoShow == true) {
              this.setState({ videoShow: false });
            }
          }
        }
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    PushNotification.updateProps(this.props);
  }
  avgTime() {
    if (Math.floor(getTerminalWaitingTime(this.state.item.terminal)) > 60) {
      return (
        <Text style={styles.dataTextStyle}>
          {Math.floor(getTerminalWaitingTime(this.state.item.terminal) / 60)}
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              fontSize: 16,
              fontFamily: AppFontFamily.fontFamily.regular,
            }}
          >
            {" "}
            h{" "}
          </Text>
          {Math.floor(getTerminalWaitingTime(this.state.item.terminal) % 60)}
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              fontSize: 16,
              fontFamily: AppFontFamily.fontFamily.regular,
            }}
          >
            {" "}
            m{" "}
          </Text>
        </Text>
      );
    } else {
      return (
        <Text style={styles.dataTextStyle}>
          {getTerminalWaitingTime(this.state.item.terminal)
            ? getTerminalWaitingTime(this.state.item.terminal)
            : "0"}
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              fontSize: 16,
              fontFamily: AppFontFamily.fontFamily.regular,
            }}
          >
            {" "}
            m
          </Text>
        </Text>
      );
    }
  }
  onVideoCall = (type) => {
    const options = {
      presentationStyle: "overFullScreen",
      title: "Select Video",
      takePhotoButtonTitle: "Take Video...",
      storageOptions: {
        skipBackup: true,
        path: "video",
      },
      mediaType: "video",
      durationLimit: 16,
      quality: 0.5,
      allowsEditing: true,
    };
    Platform.OS == "android"
      ? request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then((result) => {
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
            ImagePicker.showImagePicker(options, (response) => {
              const source = { uri: response.uri };
              if (response.didCancel) {
              } else if (response.error) {
              } else if (response.customButton) {
              } else {
                console.log("innnn", response);
                RNThumbnail.get(response.path).then((result) => {
                  let thumbnail = {
                    uri: result.path,
                    type: "image/jpeg",
                    name: "photo.jpg",
                  };

                  let privates = 0;
                  if (type.includes("editVideo")) {
                    let splitData = type.split(" ");
                    this.props.videoEdit(
                      this.state.item._id,
                      thumbnail,
                      splitData[1],
                      privates,
                      source,
                      this.props.navigation
                    );
                  } else {
                    this.props.videoAdd(
                      this.state.item._id,
                      thumbnail,
                      privates,
                      source,
                      this.props.navigation
                    );
                  }
                });
              }
            }).catch((errr) => {
              console.log("video  errrr", errr);
            });
          }
        })
      : request(PERMISSIONS.IOS.CAMERA).then((result) => {
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
            ImagePicker.showImagePicker(options, (response) => {
              const source = { uri: response.uri };
              if (response.didCancel) {
              } else if (response.error) {
              } else if (response.customButton) {
              } else {
                RNThumbnail.get(response.uri).then((result) => {
                  let thumbnail = {
                    uri: result.path,
                    type: "image/jpeg",
                    name: "photo.jpg",
                  };
                  let privates = 0;
                  if (type.includes("editVideo")) {
                    let splitData = type.split(" ");
                    this.props.videoEdit(
                      this.state.item._id,
                      thumbnail,
                      splitData[1],
                      privates,
                      source,
                      this.props.navigation
                    );
                  } else {
                    this.props.videoAdd(
                      this.state.item._id,
                      thumbnail,
                      privates,
                      source,
                      this.props.navigation
                    );
                  }
                });
              }
            });
          }
        });
  };
  onImageCall = (type, oldFileArray = []) => {
    this.setState({ type, oldFileArray });
    const options = {
      title: "Select Image",
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
      mediaType: "images",
      quality: 0.5,
      allowsEditing: true,
    };
    Platform.OS == "android"
      ? request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE)
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
              this.ActionSheetPicker.show();
            }
            if (result === "denied") {
            }
            if (result === "unavailable") {
            }
          })
          .catch((e) => {
            console.log("e", e);
          })
      : request(PERMISSIONS.IOS.CAMERA)
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
              ActionSheetIOS.showActionSheetWithOptions(
                {
                  options: [
                    I18n.t("Cancel"),
                    I18n.t("Camera"),
                    I18n.t("Image Gallery"),
                  ],
                  cancelButtonIndex: 0,
                },
                (buttonIndex) => {
                  if (buttonIndex == 1) {
                    ImageCropPicker.openCamera({
                      cropperToolbarTitle: "Select Image",
                      mediaType: "photo",
                      compressImageQuality: 0.5,
                    }).then((response) => {
                      let splitPath = response.path.split("/");
                      console.log("splitPath", splitPath[splitPath.length - 1]);
                      response.filename = splitPath[splitPath.length - 1];
                      response.uri = response.path;
                      response.type = response.mime;
                      const source = {
                        uri: response.uri,
                        type: response.type,
                        name: response.filename,
                      };
                      uploadImageOnS3(
                        source,
                        uuidv4_34(),
                        "route_post",
                        oldFileArray
                      ).then((res) => {
                        this.setState({ loading: true });
                        console.log("file uploaded", res);
                        s3bucket.upload(res, (err, data) => {
                          if (err) {
                            this.setState({ loading: false });
                            console.log("error in callback", err);
                          }
                          console.log("Respomse URL : ", data.Location);
                          if (data.Location) {
                            ImageResizer.createResizedImage(
                              response.uri,
                              100,
                              100,
                              "JPEG",
                              0.2,
                              0,
                              null
                            )
                              .then((thumbnailData) => {
                                console.log(
                                  "thumbnailDatathumbnailData",
                                  thumbnailData
                                );
                                let f = {
                                  uri: thumbnailData.path,
                                  name: thumbnailData.name,
                                  type: "image.jpg",
                                };
                                uploadImageOnS3(
                                  f,
                                  uuidv4_34(),
                                  "route_post",
                                  []
                                ).then((res) => {
                                  s3bucket.upload(res, (err, data2) => {
                                    if (err) {
                                      this.setState({ loading: false });
                                      console.log("error in callback", err);
                                    }
                                    if (data2.Location) {
                                      this.setState({
                                        visiblity: false,
                                        loading: false,
                                      });
                                      if (type == "interchange") {
                                        this.props.InterChangeAdd(
                                          this.state.item._id,
                                          0,
                                          [
                                            {
                                              url: data.key,
                                              height: response.height,
                                              width: response.width,
                                              thumbnail: data2.key,
                                            },
                                          ],
                                          this.props.navigation
                                        );
                                      } else if (type == "equipment") {
                                        this.props.equipmentAdd(
                                          this.state.item._id,
                                          0,
                                          [
                                            {
                                              url: data.key,
                                              height: response.height,
                                              width: response.width,
                                              thumbnail: data2.key,
                                            },
                                          ],
                                          this.props.navigation
                                        );
                                      } else if (
                                        type.includes("interChangeEdit")
                                      ) {
                                        let splitData = type.split(" ");
                                        this.props.InterChangeEdit(
                                          this.state.item._id,
                                          splitData[1],
                                          0,
                                          [
                                            {
                                              url: data.key,
                                              height: response.height,
                                              width: response.width,
                                              thumbnail: data2.key,
                                            },
                                          ],
                                          this.props.navigation
                                        );
                                      } else if (
                                        type.includes("equipmentEdit")
                                      ) {
                                        let splitData = type.split(" ");
                                        this.props.equipmentEdit(
                                          this.state.item._id,
                                          splitData[1],
                                          0,
                                          [
                                            {
                                              url: data.key,
                                              height: response.height,
                                              width: response.width,
                                              thumbnail: data2.key,
                                            },
                                          ],
                                          this.props.navigation
                                        );
                                      }
                                    }
                                  });
                                });
                              })
                              .catch((e) => {});
                          }
                        });
                      });
                    });
                  } else if (buttonIndex == 2) {
                    ImageCropPicker.openPicker({
                      cropperToolbarTitle: "Select Image",
                      mediaType: "photo",
                      compressImageQuality: 0.5,
                    }).then((response) => {
                      let splitPath = response.path.split("/");
                      console.log("splitPath", splitPath[splitPath.length - 1]);
                      response.filename = splitPath[splitPath.length - 1];
                      response.uri = response.path;
                      response.type = response.mime;
                      const source = {
                        uri: response.uri,
                        type: response.type,
                        name: response.filename,
                      };
                      uploadImageOnS3(
                        source,
                        uuidv4_34(),
                        "route_post",
                        oldFileArray
                      ).then((res) => {
                        this.setState({ loading: true });
                        console.log("file uploaded", res);
                        s3bucket.upload(res, (err, data) => {
                          if (err) {
                            this.setState({ loading: false });
                            console.log("error in callback", err);
                          }
                          console.log("Respomse URL : ", data.Location);
                          if (data.Location) {
                            ImageResizer.createResizedImage(
                              response.uri,
                              100,
                              100,
                              "JPEG",
                              0.2,
                              0,
                              null
                            )
                              .then((thumbnailData) => {
                                console.log(
                                  "thumbnailDatathumbnailData",
                                  thumbnailData
                                );
                                let f = {
                                  uri: thumbnailData.path,
                                  name: thumbnailData.name,
                                  type: "image.jpg",
                                };
                                uploadImageOnS3(
                                  f,
                                  uuidv4_34(),
                                  "route_post",
                                  []
                                ).then((res) => {
                                  s3bucket.upload(res, (err, data2) => {
                                    if (err) {
                                      this.setState({ loading: false });
                                      console.log("error in callback", err);
                                    }
                                    if (data2.Location) {
                                      this.setState({
                                        visiblity: false,
                                        loading: false,
                                      });
                                      if (type == "interchange") {
                                        this.props.InterChangeAdd(
                                          this.state.item._id,
                                          0,
                                          [
                                            {
                                              url: data.key,
                                              height: response.height,
                                              width: response.width,
                                              thumbnail: data2.key,
                                            },
                                          ],
                                          this.props.navigation
                                        );
                                      } else if (type == "equipment") {
                                        this.props.equipmentAdd(
                                          this.state.item._id,
                                          0,
                                          [
                                            {
                                              url: data.key,
                                              height: response.height,
                                              width: response.width,
                                              thumbnail: data2.key,
                                            },
                                          ],
                                          this.props.navigation
                                        );
                                      } else if (
                                        type.includes("interChangeEdit")
                                      ) {
                                        let splitData = type.split(" ");
                                        this.props.InterChangeEdit(
                                          this.state.item._id,
                                          splitData[1],
                                          0,
                                          [
                                            {
                                              url: data.key,
                                              height: response.height,
                                              width: response.width,
                                              thumbnail: data2.key,
                                            },
                                          ],
                                          this.props.navigation
                                        );
                                      } else if (
                                        type.includes("equipmentEdit")
                                      ) {
                                        let splitData = type.split(" ");
                                        this.props.equipmentEdit(
                                          this.state.item._id,
                                          splitData[1],
                                          0,
                                          [
                                            {
                                              url: data.key,
                                              height: response.height,
                                              width: response.width,
                                              thumbnail: data2.key,
                                            },
                                          ],
                                          this.props.navigation
                                        );
                                      }
                                    }
                                  });
                                });
                              })
                              .catch((e) => {});
                          }
                        });
                      });
                    });
                  }
                }
              );
            }
            if (result === "denied") {
            }
            if (result === "unavailable") {
            }
          })
          .catch((e) => {
            console.log("e", e);
          });
  };
  deleteVideoImage = (type, item, index = 0) => {
    if (type == "interchange") {
      Platform.OS == "android"
        ? Alert.alert(
            I18n.t("Alert"),
            I18n.t("interChangeDelete"),
            [
              {
                text: I18n.t("Yes"),
                onPress: () =>
                  this.props.deleteInterchange(
                    item.route_post_id,
                    item._id,
                    item.receipt_private,
                    this.props.navigation
                  ),
              },
              {
                text: I18n.t("No"),
                onPress: () => {},
              },
            ],
            { cancelable: false }
          )
        : Alert.alert(
            I18n.t("interChangeDelete"),
            "",
            [
              {
                text: I18n.t("Yes"),
                onPress: () =>
                  this.props.deleteInterchange(
                    item.route_post_id,
                    item._id,
                    item.receipt_private,
                    this.props.navigation
                  ),
              },
              {
                text: I18n.t("No"),
                onPress: () => {},
              },
            ],
            { cancelable: false }
          );
    } else if (type == "equipment") {
      Platform.OS == "android"
        ? Alert.alert(
            I18n.t("Alert"),
            I18n.t("equipmentDelete"),
            [
              {
                text: I18n.t("Yes"),
                onPress: () =>
                  this.props.deleteEquipment(
                    item.route_post_id,
                    item._id,
                    item.receipt_private,
                    this.props.navigation
                  ),
              },
              {
                text: I18n.t("No"),
                onPress: () => {},
              },
            ],
            { cancelable: false }
          )
        : Alert.alert(
            I18n.t("equipmentDelete"),
            "",
            [
              {
                text: I18n.t("Yes"),
                onPress: () =>
                  this.props.deleteEquipment(
                    item.route_post_id,
                    item._id,
                    item.receipt_private,
                    this.props.navigation
                  ),
              },
              {
                text: I18n.t("No"),
                onPress: () => {},
              },
            ],
            { cancelable: false }
          );
    } else if (type == "manual") {
      Platform.OS == "android"
        ? Alert.alert(
            I18n.t("Alert"),
            I18n.t("deleteMedia"),
            [
              {
                text: I18n.t("Yes"),
                onPress: () =>
                  this.props.deleteEquipment(
                    this?.props?.timeLineState?.timeLineDetail?._id,
                    item?._id,
                    false,
                    index,
                    "manual",
                    this?.props?.navigation
                  ),
              },
              {
                text: I18n.t("No"),
                onPress: () => {},
              },
            ],
            { cancelable: false }
          )
        : Alert.alert(
            I18n.t("deleteMedia"),
            "",
            [
              {
                text: I18n.t("Yes"),
                onPress: () =>
                  this.props.deleteEquipment(
                    this?.props?.timeLineState?.timeLineDetail?._id,
                    item?._id,
                    false,
                    index,
                    "manual",
                    this?.props?.navigation
                  ),
              },
              {
                text: I18n.t("No"),
                onPress: () => {},
              },
            ],
            { cancelable: false }
          );
    } else {
      Platform.OS == "ios"
        ? Alert.alert(
            I18n.t("deleteVideo"),
            "",
            [
              {
                text: I18n.t("Yes"),
                onPress: () =>
                  this.props.deleteVideo(
                    item.route_post_id,
                    item._id,
                    item.receipt_private,
                    this.props.navigation
                  ),
              },
              {
                text: I18n.t("No"),
                onPress: () => {},
              },
            ],
            { cancelable: false }
          )
        : Alert.alert(
            I18n.t("Alert"),
            I18n.t("deleteVideo"),
            [
              {
                text: I18n.t("Yes"),
                onPress: () =>
                  this.props.deleteVideo(
                    item.route_post_id,
                    item._id,
                    item.receipt_private,
                    this.props.navigation
                  ),
              },
              {
                text: I18n.t("No"),
                onPress: () => {},
              },
            ],
            { cancelable: false }
          );
    }
  };
  interChangeRender = ({ item }) => {
    return Platform.OS == "ios" ? (
      <TouchableOpacity
        activeOpacity={
          this.state.userDetail &&
          this.state.userDetail._id == this.state.item?.user_id
            ? 0.7
            : 1
        }
        onPress={() => {
          this.state.userDetail &&
            this.state.userDetail._id == this.state.item?.user_id &&
            this.onImageCall("interChangeEdit " + item._id, [item.media]);
        }}
        style={styles.imagesTouchable}
      >
        <Image
          resizeMode={"cover"}
          style={styles.imagesStyle}
          source={{ uri: imageBaseUrl + item.media }}
        />
        {this.state.userDetail &&
          this.state.userDetail._id == this.state.item?.user_id && (
            <TouchableOpacity
              onPress={() => this.deleteVideoImage("interchange", item)}
              activeOpacity={0.7}
              style={styles.crossButton}
            >
              <Entypo color={"#fff"} name="cross" size={20} />
            </TouchableOpacity>
          )}
      </TouchableOpacity>
    ) : (
      <View style={{ padding: 10 }}>
        <TouchableOpacity
          activeOpacity={
            this.state.userDetail &&
            this.state.userDetail._id == this.state.item?.user_id
              ? 0.7
              : 1
          }
          onPress={() => {
            this.state.userDetail &&
              this.state.userDetail._id == this.state.item?.user_id &&
              this.onImageCall("interChangeEdit " + item._id, [item.media]);
          }}
          style={styles.imagesTouchable}
        >
          <Image
            resizeMode={"cover"}
            style={styles.imagesStyle}
            source={{ uri: imageBaseUrl + item.media }}
          />
          {this.state.userDetail &&
            this.state.userDetail._id == this.state.item?.user_id && (
              <TouchableOpacity
                onPress={() => this.deleteVideoImage("interchange", item)}
                activeOpacity={0.7}
                style={styles.crossButton}
              >
                <Entypo color={"#fff"} name="cross" size={20} />
              </TouchableOpacity>
            )}
        </TouchableOpacity>
      </View>
    );
  };
  equipmentRender = ({ item }) => {
    return Platform.OS == "ios" ? (
      <TouchableOpacity
        activeOpacity={
          this.state.userDetail &&
          this.state.userDetail._id == this.state.item?.user_id
            ? 0.7
            : 1
        }
        onPress={() => {
          this.state.userDetail &&
            this.state.userDetail._id == this.state.item?.user_id &&
            this.onImageCall("equipmentEdit " + item._id, [item.media]);
        }}
        style={styles.imagesTouchable}
      >
        <Image
          resizeMode={"cover"}
          style={styles.imagesStyle}
          source={{ uri: imageBaseUrl + item.media }}
        />
        {this.state.userDetail &&
          this.state.userDetail._id == this.state.item?.user_id && (
            <TouchableOpacity
              onPress={() => this.deleteVideoImage("equipment", item)}
              activeOpacity={0.7}
              style={styles.crossButton}
            >
              <Entypo color={"#fff"} name="cross" size={20} />
            </TouchableOpacity>
          )}
      </TouchableOpacity>
    ) : (
      <View style={{ padding: 10 }}>
        <TouchableOpacity
          activeOpacity={
            this.state.userDetail &&
            this.state.userDetail._id == this.state.item?.user_id
              ? 0.7
              : 1
          }
          onPress={() => {
            this.state.userDetail &&
              this.state.userDetail._id == this.state.item?.user_id &&
              this.onImageCall("equipmentEdit " + item._id, [item.media]);
          }}
          style={styles.imagesTouchable}
        >
          <Image
            resizeMode={"cover"}
            style={styles.imagesStyle}
            source={{ uri: imageBaseUrl + item.media }}
          />
          {this.state.userDetail &&
            this.state.userDetail._id == this.state.item?.user_id && (
              <TouchableOpacity
                onPress={() => this.deleteVideoImage("equipment", item)}
                activeOpacity={0.7}
                style={styles.crossButton}
              >
                <Entypo color={"#fff"} name="cross" size={20} />
              </TouchableOpacity>
            )}
        </TouchableOpacity>
      </View>
    );
  };
  videoRender = ({ item }) => {
    return Platform.OS == "ios" ? (
      <TouchableOpacity
        activeOpacity={
          this.state.userDetail &&
          this.state.userDetail._id == this.state.item?.user_id
            ? 0.7
            : 1
        }
        onPress={() => {
          this.state.userDetail &&
            this.state.userDetail._id == this.state.item?.user_id &&
            this.onVideoCall("editVideo " + item._id);
        }}
        style={styles.imagesTouchable}
      >
        <Image
          resizeMode={"cover"}
          style={styles.imagesStyle}
          source={{ uri: imageBaseUrl + item.thumbnail }}
        />
        {this.state.userDetail &&
          this.state.userDetail._id == this.state.item?.user_id && (
            <TouchableOpacity
              onPress={() => this.deleteVideoImage("video", item)}
              activeOpacity={0.7}
              style={styles.crossButton}
            >
              <Entypo color={"#fff"} name="cross" size={20} />
            </TouchableOpacity>
          )}
      </TouchableOpacity>
    ) : (
      <View style={{ padding: 10 }}>
        <TouchableOpacity
          activeOpacity={
            this.state.userDetail &&
            this.state.userDetail._id == this.state.item?.user_id
              ? 0.7
              : 1
          }
          onPress={() => {
            this.state.userDetail &&
              this.state.userDetail._id == this.state.item?.user_id &&
              this.onVideoCall("editVideo " + item._id);
          }}
          style={styles.imagesTouchable}
        >
          <Image
            resizeMode={"cover"}
            style={styles.imagesStyle}
            source={{ uri: imageBaseUrl + item.thumbnail }}
          />
          {this.state.userDetail &&
            this.state.userDetail._id == this.state.item?.user_id && (
              <TouchableOpacity
                onPress={() => this.deleteVideoImage("video", item)}
                activeOpacity={0.7}
                style={styles.crossButton}
              >
                <Entypo color={"#fff"} name="cross" size={20} />
              </TouchableOpacity>
            )}
        </TouchableOpacity>
      </View>
    );
  };
  footerComponent = (type) => {
    return (
      <View style={{ padding: 10 }}>
        <TouchableOpacity
          onPress={() => {
            type == "video"
              ? this.onVideoCall("addVideo")
              : this.onImageCall(type);
          }}
          style={[
            styles.cammeraStyle,
            { height: width * 0.33, width: width * 0.33 },
          ]}
        >
          <Image
            style={{ width: 50, height: 50 }}
            resizeMode="contain"
            source={AppImages.images.addClient}
          />
        </TouchableOpacity>
      </View>
    );
  };
  playButton = () => {
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate("VideoPreview", {
            response: this.props.timeLineState.video[0],
            thumbnail: this.props.timeLineState.video[0].thumbnail,
            terminalResult: { id: this.state.item._id },
            screen: "timeLineDetail",
            type: "video",
          })
        }
        style={[
          styles.cammeraStyle,
          { height: width * 0.33, width: width * 0.33 },
        ]}
      >
        <Image
          style={{
            width: 50,
            height: 50,
            backgroundColor: "#fff",
            borderRadius: 25,
          }}
          resizeMode="cover"
          source={AppImages.images.play}
        />
      </TouchableOpacity>
    );
  };
  playButton2 = (item) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate("VideoPreview", {
            response: { media: item.url },
            thumbnail: item?.thumbnail,
            terminalResult: { id: item._id },
            screen: "timeLineDetail",
            type: "video",
          });
        }}
        style={{
          position: "absolute",
          alignItems: "center",
          alignSelf: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <Image
          style={{
            width: 40,
            height: 40,
            backgroundColor: "#fff",
            borderRadius: 20,
          }}
          resizeMode="cover"
          source={AppImages.images.play}
        />
      </TouchableOpacity>
    );
  };
  render() {
    
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <Loader
          loading={this.props.timeLineState.onLoad || this.state.loading}
        />
        <View style={{ flex: Platform.OS == "ios" ? 0.13 : 0.109 }}>
          <Header
            textAlign="center"
            headerTitle={
              this.state.item
                ? this.state.item.terminal
                  ? this.state.item.terminal.terminal_name
                  : this.state.item.type == "manual"
                  ? this.state.item.name
                  : ""
                : ""
            }
            textWidth={
              this.state.userDetail &&
              this.state.userDetail._id == this.state.item?.user_id &&
              true
            }
            leftImageSource={AppImages.images.back}
            leftbackbtnPress={() => {
              this.props.navigation.goBack(),
                (this.props.timeLineState.linkingData = null);
            }}
            rightVector={
              this.state.userDetail &&
              this.state.userDetail._id == this.state.item?.user_id &&
              "share-square-o"
            }
            rightBackBtnPress={() => {
              this.state.userDetail &&
                this.state.userDetail._id == this.state.item?.user_id &&
                this.actionSheet2();
            }}
            rightVector2={
              this.state.userDetail &&
              this.state.userDetail._id == this.state.item?.user_id &&
              "ellipsis-v"
            }
            rightBackBtnPress3={() => {
              this.state.userDetail &&
                this.state.userDetail._id == this.state.item?.user_id &&
                this.actionSheet(this.props.navigation);
            }}
          />
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          style={{ flex: 1, paddingBottom: 50 }}
        >
          <SafeAreaView style={styles.mainContainer}>
            <View style={{ flex: 0.25 }} />
            <View style={{}}>
              {!this.props.route.params.item.fromBranch ? (
                <MakeRoute
                  created={this.state?.item?.created_at}
                  isDetail={true}
                  avgTime={this.state.item?.minute}
                  startTime={this.state.item?.start_time}
                  endTime={this.state.item?.end_time}
                  distance={
                    this?.state?.item?.distance == 0
                      ? "0"
                      : (
                          (this?.state?.item?.distance / 1000) *
                          0.621371
                        ).toFixed(2)
                  }
                  titleName={
                    this.state?.item
                      ? this.state.item?.terminal
                        ? this.state.item?.terminal?.terminal_name
                        : this.state.item.type == "manual"
                        ? this.state.item.name
                        : ""
                      : ""
                  }
                  maxZoomLevel={22}
                  minZoomLevel={5}
                  ref={(routeRef) => (this.routeRef = routeRef)}
                  initialRoute={{
                    latitude:
                      this.state.corrdinates !== null &&
                      this.state.corrdinates.length > 0
                        ? this.state.corrdinates[0].latitude
                        : Platform.OS == "ios"
                        ? 0
                        : null,
                    longitude:
                      this.state.corrdinates !== null &&
                      this.state.corrdinates.length > 0
                        ? this.state.corrdinates[0].longitude
                        : Platform.OS == "ios"
                        ? 0
                        : null,
                  }}
                  coordinate={
                    this.state.corrdinates ? this.state.corrdinates : null
                  }
                />
              ) : (
                this.state.corrdinates && (
                  <MakeRoute
                    created={this.state?.item?.created_at}
                    isDetail={true}
                    avgTime={this.state.item?.minute}
                    startTime={this.state.item?.start_time}
                    endTime={this.state.item?.end_time}
                    distance={
                      this?.state?.item?.distance == 0
                        ? "0"
                        : (
                            (this?.state?.item?.distance / 1000) *
                            0.621371
                          ).toFixed(2)
                    }
                    titleName={
                      this.state?.item
                        ? this.state.item?.terminal
                          ? this.state.item?.terminal?.terminal_name
                          : this.state.item.type == "manual"
                          ? this.state.item.name
                          : ""
                        : ""
                    }
                    maxZoomLevel={22}
                    minZoomLevel={5}
                    ref={(routeRef) => (this.routeRef = routeRef)}
                    initialRoute={{
                      latitude:
                        this.state.corrdinates !== null
                          ? this.state.corrdinates[0].latitude
                          : Platform.OS == "ios"
                          ? 0
                          : null,
                      longitude:
                        this.state.corrdinates !== null
                          ? this.state.corrdinates[0].longitude
                          : Platform.OS == "ios"
                          ? 0
                          : null,
                    }}
                    coordinate={
                      this.state.corrdinates ? this.state.corrdinates : null
                    }
                  />
                )
              )}
            </View>
            <View style={{ flex: 0.2, marginTop: 10 }}>
              {this?.props?.timeLineState?.manualMedia &&
                this?.props?.timeLineState?.manualMedia.length > 0 && (
                  <ManualHorizontalList
                    deletePostCall={(index, item) =>
                      this.deleteVideoImage("manual", item, index)
                    }
                    play={(item) => this.playButton2(item)}
                    media={this?.props?.timeLineState?.manualMedia}
                  />
                )}
              {this.state.userDetail &&
              this.state.userDetail._id == this.state.item?.user_id ? (
                <View
                  style={{ flex: 1, marginTop: "1%", marginHorizontal: 10 }}
                >
                  <View
                    style={{
                      height: 60,
                      width: width * 0.5,
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexDirection: "row",
                      marginTop: Platform.OS == "android" ? 0 : 0,
                    }}
                  >
                    <View>
                      <Text style={[styles.text, { marginLeft: 10 }]}>
                        {I18n.t("Receipt_Private")}
                      </Text>
                    </View>
                    <View>
                      <Switch
                        value={this.state.switchValue}
                        onValueChange={() => {
                          this.setState(
                            { switchValue: !this.state.switchValue },
                            () => {
                              this.props.privateReceipt(
                                this.state.item._id,
                                this.props.timeLineState.receiptPrivate == "1"
                                  ? false
                                  : true
                              );
                            }
                          );
                        }}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-around",
                      paddingHorizontal: 20,
                      width: "100%",
                    }}
                  >
                    <View style={{ width: "33%", alignItems: "center" }}>
                      <View style={{ width: "70%" }}>
                        {this.props.timeLineState.interChange.length !== 0 && (
                          <Text
                            numberOfLines={2}
                            style={[
                              styles.text,
                              { width: "100%", fontSize: 12 },
                            ]}
                          >
                            {I18n.t("Interchange_Receipt")}
                          </Text>
                        )}
                        <TouchableOpacity
                          disabled={this.state.disabled}
                          style={[
                            styles.buttonInterEquep,
                            {
                              paddingBottom:
                                this.props.timeLineState.interChange.length == 0
                                  ? 10
                                  : 0,
                            },
                          ]}
                          onPress={() => {
                            this.setState({ disabled: true });
                            setTimeout(() => {
                              this.setState({ disabled: false });
                            }, 500);
                            this.props.timeLineState.interChange.length == 0
                              ? [
                                  this.setState({
                                    equipmentShow: false,
                                    interChangeShow: false,
                                    videoShow: false,
                                  }),
                                  this.onImageCall("interchange"),
                                ]
                              : this.setState({
                                  interChangeShow: !this.state.interChangeShow,
                                  equipmentShow: false,
                                  videoShow: false,
                                });
                          }}
                          activeOpacity={0.7}
                        >
                          <View
                            style={{
                              paddingBottom:
                                this.props.timeLineState.interChange.length == 0
                                  ? 25
                                  : 0,
                            }}
                          >
                            {this.props.timeLineState.interChange.length ==
                            0 ? (
                              <Image
                                source={require("../../Images/interchange.jpeg")}
                                style={{
                                  backgroundColor: "#29a2e1",
                                  height: 90,
                                  borderTopLeftRadius: 10,
                                  borderTopRightRadius: 10,
                                  width: 100,
                                }}
                                resizeMode="cover"
                              />
                            ) : (
                              <View style={{ height: 80, width: 80 }}>
                                {this.props.timeLineState.interChange.map(
                                  (x, index) => {
                                    return (
                                      <Image
                                        source={{ uri: imageBaseUrl + x.media }}
                                        style={[
                                          styles.interEqueImages,
                                          { top: index * 3, right: index * 3 },
                                        ]}
                                        resizeMode="cover"
                                      />
                                    );
                                  }
                                )}
                              </View>
                            )}
                            {this.props.timeLineState.interChange.length ==
                              0 && (
                              <View
                                style={{
                                  height: 50,
                                  bottom: -5,
                                  position: "absolute",
                                  alignSelf: "center",
                                  width: 50,
                                  borderRadius: 25,
                                  justifyContent: "center",
                                  backgroundColor: "#fff",
                                }}
                              >
                                <Image
                                  source={AppImages.images.addClient}
                                  style={{
                                    height: 45,
                                    width: 45,
                                    alignSelf: "center",
                                  }}
                                  resizeMode="cover"
                                />
                              </View>
                            )}
                          </View>
                          {this.props.timeLineState.interChange.length == 0 && (
                            <Text
                              numberOfLines={2}
                              style={[
                                styles.text,
                                {
                                  marginTop: 5,
                                  fontSize: 12,
                                  alignSelf: "center",
                                },
                              ]}
                            >
                              {I18n.t("Interchange_Receipt")}
                            </Text>
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={{ width: "33%", alignItems: "center" }}>
                      <View style={{ width: "70%" }}>
                        {this.props.timeLineState.equipment.length !== 0 && (
                          <Text
                            numberOfLines={2}
                            style={[
                              styles.text,
                              { width: "100%", fontSize: 12 },
                            ]}
                          >
                            {I18n.t("Equiment_Photo")}
                          </Text>
                        )}
                        <TouchableOpacity
                          disabled={this.state.disabled}
                          style={[
                            styles.buttonInterEquep,
                            {
                              paddingBottom:
                                this.props.timeLineState.equipment.length == 0
                                  ? 10
                                  : 0,
                            },
                          ]}
                          onPress={() => {
                            this.setState({ disabled: true });
                            setTimeout(() => {
                              this.setState({ disabled: false });
                            }, 500);
                            this.props.timeLineState.equipment.length == 0
                              ? [
                                  this.setState({
                                    equipmentShow: false,
                                    interChangeShow: false,
                                    videoShow: false,
                                  }),
                                  this.onImageCall("equipment"),
                                ]
                              : this.setState({
                                  interChangeShow: false,
                                  equipmentShow: !this.state.equipmentShow,
                                  videoShow: false,
                                });
                          }}
                          activeOpacity={0.7}
                        >
                          <View
                            style={{
                              paddingBottom:
                                this.props.timeLineState.equipment.length == 0
                                  ? 25
                                  : 0,
                            }}
                          >
                            {this.props.timeLineState.equipment.length == 0 ? (
                              <Image
                                source={require("../../Images/equipment.jpeg")}
                                style={{
                                  height: 90,
                                  borderTopLeftRadius: 10,
                                  borderTopRightRadius: 10,
                                  width: 100,
                                }}
                                resizeMode="cover"
                              />
                            ) : (
                              <View style={{ height: 80, width: 80 }}>
                                {this.props.timeLineState.equipment.map(
                                  (x, index) => {
                                    return (
                                      <Image
                                        source={{ uri: imageBaseUrl + x.media }}
                                        style={[
                                          styles.interEqueImages,
                                          { top: index * 3, right: index * 3 },
                                        ]}
                                        resizeMode="cover"
                                      />
                                    );
                                  }
                                )}
                              </View>
                            )}
                            {this.props.timeLineState.equipment.length == 0 && (
                              <View
                                style={{
                                  height: 50,
                                  bottom: -5,
                                  position: "absolute",
                                  alignSelf: "center",
                                  width: 50,
                                  borderRadius: 25,
                                  justifyContent: "center",
                                  backgroundColor: "#fff",
                                }}
                              >
                                <Image
                                  source={AppImages.images.addClient}
                                  style={{
                                    height: 45,
                                    width: 45,
                                    alignSelf: "center",
                                  }}
                                  resizeMode="cover"
                                />
                              </View>
                            )}
                          </View>
                          {this.props.timeLineState.equipment.length == 0 && (
                            <Text
                              numberOfLines={2}
                              style={[
                                styles.text,
                                {
                                  fontSize: 12,
                                  marginTop: 5,
                                  alignSelf: "center",
                                },
                              ]}
                            >
                              {I18n.t("Equiment_Photo")}
                            </Text>
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  {this.state.interChangeShow == true ? (
                    <>
                      <FlatList
                        bounces={false}
                        data={this.props.timeLineState.interChange}
                        contentContainerStyle={{
                          paddingRight: 30,
                          paddingTop: 30,
                        }}
                        horizontal={true}
                        renderItem={this.interChangeRender}
                        ListFooterComponent={
                          this.props.timeLineState.interChange.length < 4 &&
                          this.footerComponent("interchange")
                        }
                        showsHorizontalScrollIndicator={false}
                      />
                    </>
                  ) : null}
                  {this.state.videoShow && (
                    <FlatList
                      bounces={false}
                      contentContainerStyle={{
                        paddingRight: 20,
                        paddingBottom: 20,
                        paddingTop: 30,
                      }}
                      data={this.props.timeLineState.video}
                      horizontal={true}
                      renderItem={this.videoRender}
                      ListFooterComponent={
                        this.props.timeLineState.video.length < 1
                          ? this.footerComponent("video")
                          : this.playButton()
                      }
                      showsHorizontalScrollIndicator={false}
                    />
                  )}
                  {this.state.equipmentShow && (
                    <FlatList
                      bounces={false}
                      contentContainerStyle={{
                        paddingRight: 20,
                        paddingTop: 30,
                      }}
                      data={this.props.timeLineState.equipment}
                      horizontal={true}
                      renderItem={this.equipmentRender}
                      ListFooterComponent={
                        this.props.timeLineState.equipment.length < 4 &&
                        this.footerComponent("equipment")
                      }
                      showsHorizontalScrollIndicator={false}
                    />
                  )}
                  <View style={styles.buttonContainer}>
                    {this.state.userDetail &&
                      this.state.userDetail._id == this.state.item?.user_id && (
                        <Button
                          onPress={() => {
                            this.actionSheet2();
                          }}
                          Text={I18n.t("Share")}
                          customStyles={{ container: styles.button }}
                        />
                      )}
                  </View>
                </View>
              ) : (
                <View style={{ flex: 1 }}>
                  {this.props.timeLineState.receiptPrivate == "0"
                    ? this.props.timeLineState.interChange.length > 0 && (
                        <View>
                          <View
                            style={{ alignItems: "flex-start", marginTop: 20 }}
                          >
                            <Text style={[styles.text, { marginLeft: 10 }]}>
                              {I18n.t("Interchange_Receipt")}
                            </Text>
                          </View>
                          <FlatList
                            bounces={false}
                            data={this.props.timeLineState.interChange}
                            contentContainerStyle={{
                              paddingRight: 20,
                              paddingTop: 10,
                            }}
                            horizontal={true}
                            renderItem={this.interChangeRender}
                            showsHorizontalScrollIndicator={false}
                          />
                        </View>
                      )
                    : null}
                  {this.props.timeLineState.equipment.length > 0 && (
                    <View>
                      <View
                        style={{ alignItems: "flex-start", paddingTop: 15 }}
                      >
                        <Text style={[styles.text, { marginLeft: 10 }]}>
                          {I18n.t("Equiment_Photo")}
                        </Text>
                      </View>
                      <FlatList
                        bounces={false}
                        contentContainerStyle={{
                          paddingRight: 20,
                          paddingBottom: 20,
                          paddingTop: 10,
                        }}
                        data={this.props.timeLineState.equipment}
                        horizontal={true}
                        renderItem={this.equipmentRender}
                        showsHorizontalScrollIndicator={false}
                      />
                    </View>
                  )}
                  {this.props.timeLineState.video.length > 0 && (
                    <View>
                      <View style={{ alignItems: "flex-start" }}>
                        <Text style={[styles.text, { marginLeft: 10 }]}>
                          {I18n.t("video")}{" "}
                        </Text>
                      </View>
                      <FlatList
                        bounces={false}
                        contentContainerStyle={{
                          paddingRight: 20,
                          paddingBottom: 20,
                          paddingTop: 10,
                        }}
                        data={this.props.timeLineState.video}
                        horizontal={true}
                        renderItem={this.videoRender}
                        ListFooterComponent={this.playButton()}
                        showsHorizontalScrollIndicator={false}
                      />
                    </View>
                  )}
                </View>
              )}
            </View>
          </SafeAreaView>
        </ScrollView>
        <ActionSheet
          ref={(o) => (this.ActionSheet = o)}
          options={[I18n.t("Cancel"), I18n.t("Edit"), I18n.t("Delete")]}
          cancelButtonIndex={0}
          destructiveButtonIndex={2}
          onPress={(index) => {
            this.androidActionSheetPress(index);
          }}
        />
        <ActionSheet
          ref={(o) => (this.ActionSheet2 = o)}
          options={[
            I18n.t("Cancel"),
            I18n.t("pdfDownload"),
            I18n.t("CreatePost"),
          ]}
          cancelButtonIndex={0}
          onPress={(index) => {
            this.androidActionSheetPress2(index);
          }}
        />
        <ActionSheet
          options={[
            I18n.t("Cancel"),
            I18n.t("Camera"),
            I18n.t("Image Gallery"),
          ]}
          ref={(o) => (this.ActionSheetPicker = o)}
          cancelButtonIndex={0}
          onPress={(index) => {
            this.androidActionSheetPressPicker(index);
          }}
        />
      </View>
    );
  }
}
function mapStateToProps(state) {
  return {
    timeLineState: state.RoutePostData,
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      addTimeLinePost,
      EditTimeLineAction,
      deleteTimeLineAction,
      routeDetailGet,
      InterChangeAdd,
      equipmentAdd,
      videoAdd,
      deleteInterchange,
      deleteEquipment,
      deleteVideo,
      InterChangeEdit,
      equipmentEdit,
      videoEdit,
      privateReceipt,
    },
    dispatch
  );
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimeLineDetail);
