import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  ImageBackground,
  Share,
  Platform,
  ScrollView,
} from "react-native";

import styles from "./styles";
import { CachedImage } from "./../../Components/react-native-cached-image-master";
import Header from "../../Components/Header";
import DataManager from "../../Components/DataManager";
import I18n from "react-native-i18n";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/dist/MaterialIcons";
import { branchBaseUrl, imageBaseUrl, version } from "../../Config";
import { AppImages } from "./../../Themes";
import moment from "moment";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ViewPager from "@react-native-community/viewpager";
import { Button } from "../../Components";
import { addTimeLinePost } from "../../Redux/actions/timeLineAction";
import Dots from "react-native-dots-pagination";
import DeviceInfo from "react-native-device-info";
import ReadMore from "react-native-read-more-text";
const width = Dimensions.get("screen").width;
let _this = null;
class PostPreview extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <Header
          headerTitle={I18n.t("Preview")}
          leftImageSource={AppImages.images.back}
          leftbackbtnPress={() => {
            _this && _this.goBAck(navigation);
          }}
        />
      ),
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      userDetail: null,
      noOfLines: [],
      tagsFriendsId: [],
      message: "",
      refreshing: false,
      pageIndShow: true,
      index: 0,
    };
    _this = this;
    this.item = this.props.route.params;
  }

  goBAck(navigation) {
    navigation.goBack();
  }
  componentDidMount() {
    let tags = [...this.state.tagsFriendsId];
    this.props.searchUserState.tags.map((x) => {
      tags.push(x._id);
    });
    this.setState({ tagsFriendsId: tags });

    DataManager.getUserDetails().then(async (response) => {
      if (response) {
        let parseData = await JSON.parse(response);
        console.log("parseDataparseData", parseData);
        this.setState({ userDetail: parseData.data });
      }
    });
  }

  getTime = (seconds) => {
    seconds = Number(seconds);
    var h = Math.floor(seconds / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    var s = Math.floor(seconds % 60);
    var hDisplay =
      h > 0
        ? h + (h == 1 ? " " + I18n.t("hrs") + " " : " " + I18n.t("hrs") + " ")
        : "";
    var mDisplay =
      m > 0
        ? [s > 29 ? m + 1 : m] +
          (m == 1 ? " " + I18n.t("mins") + " " : " " + I18n.t("mins") + " ")
        : "0 " + I18n.t("mins");
    // var sDisplay = s > 0 ? s + (s == 1 ? " " + I18n.t('secs') : " " + I18n.t('secs')) : "0 " + I18n.t('secs');
    if (h > 0) {
      return hDisplay + mDisplay;
    }
    // else if (m > 0) {
    //   // if (s == 0) {
    //   //   return mDisplay
    //   // }
    //   // else {
    //     // return mDisplay + sDisplay
    //     return mDisplay
    //   // }
    // }
    else {
      return mDisplay;
    }
  };
  renderImages = (x, index) => {
    return x.type == "video" ? (
      <View style={{ height: "100%", width: "100%" }}>
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate("VideoPreview", {
              response: { media: x.media },
              thumbnail: x.thumbnail,
              terminalResult: { id: x._id },
              screen: "timeLineDetail",
              type: "video",
            })
          }
        >
          <ImageBackground
            style={{ width: "100%", height: "100%" }}
            source={{ uri: imageBaseUrl + x.thumbnail }}
            resizeMode="cover"
          >
            <View style={{ flex: 1, justifyContent: "center" }}>
              <CachedImage
                source={AppImages.images.play}
                resizeMode="contain"
                style={{
                  width: 50,
                  height: 50,
                  overflow: "hidden",
                  backgroundColor: "#fff",
                  borderRadius: 25,
                  alignSelf: "center",
                }}
              />
            </View>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    ) : (
      <TouchableOpacity activeOpacity={1}>
        <View style={{ height: "100%", width: "100%" }}>
          <CachedImage
            resizeMode={"cover"}
            source={{
              uri:
                x.thumbnail == null || x.thumbnail == ""
                  ? imageBaseUrl + x.media
                  : imageBaseUrl + x.thumbnail,
            }}
            style={[styles.postImage]}
          />
          {index == 0 && (
            <View style={{ position: "absolute", width: "100%" }}>
              {this.item.item.start_time ? (
                <View
                  style={{
                    marginTop: 10,
                    width: "100%",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={[
                        styles.userPostsText,
                        { fontSize: 14, color: "#fff" },
                      ]}
                    >
                      {I18n.t("start_time")}:
                    </Text>
                    <Text
                      style={[
                        styles.userPostsText,
                        { fontSize: 14, marginLeft: 5, color: "#fff" },
                      ]}
                    >
                      {moment(this.item.item.start_time).format("HH:mm")}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", marginRight: 15 }}>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.userPostsText,
                        { fontSize: 14, maxWidth: "80%", color: "#fff" },
                      ]}
                    >
                      {I18n.t("endTime")}:
                    </Text>
                    <Text
                      style={[
                        styles.userPostsText,
                        { fontSize: 14, marginLeft: 5, color: "#fff" },
                      ]}
                    >
                      {moment(this.item.item.end_time).format("HH:mm")}
                    </Text>
                  </View>
                </View>
              ) : null}
              {
                <View
                  style={{
                    width: "100%",
                    marginTop: 5,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginLeft: 15,
                    }}
                  >
                    <Icon name="dashboard" size={16} color="#fff" />
                    <Text
                      style={[
                        styles.userPostsText,
                        { fontSize: 14, marginLeft: 5, color: "#fff" },
                      ]}
                    >
                      {((this.item.item.distance / 1000) * 0.621371).toFixed(2)}{" "}
                      mi
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", marginRight: 15 }}>
                    <MaterialIcons
                      name="query-builder"
                      size={20}
                      color="#fff"
                    />
                    <Text
                      style={[
                        styles.userPostsText,
                        { fontSize: 14, color: "#fff", marginLeft: 5 },
                      ]}
                    >
                      {this.getTime(this.item.item.minute)}
                    </Text>
                  </View>
                </View>
              }
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  sharePress = async () => {
    try {
      const result = await Share.share(
        {
          message:
            Platform.OS == "ios"
              ? this.state.userDetail.name + I18n.t("postShareMessage")
              : this.state.userDetail.name +
                I18n.t("postShareMessage") +
                "\n" +
                branchBaseUrl +
                this.item.item._id +
                "?type=route_post&version=" +
                version,
          title: "FR8",
          url:
            branchBaseUrl +
            this.item.item._id +
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
          console.log("done");
        }
      } else if (result.action == Share.dismissedAction) {
        console.log("dismiss");
      }
    } catch (e) {
      console.log(e);
    }
  };
  _renderTruncatedFooter = (handlePress) => {
    return (
      <Text style={{ color: "#29a2e1", marginTop: 5 }} onPress={handlePress}>
        Read more
      </Text>
    );
  };

  _renderRevealedFooter = (handlePress) => {
    return (
      <Text style={{ color: "#29a2e1", marginTop: 5 }} onPress={handlePress}>
        Read less
      </Text>
    );
  };

  render() {
    return (
      // <>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View style={{ flex: 1 }}>
          <View style={[styles.userView]}>
            <View style={{ borderRadius: 45 / 2, height: 45, width: 45 }}>
              <CachedImage
                resizeMode="cover"
                source={
                  this.state.userDetail
                    ? this.state.userDetail?.profile !== "" &&
                      this.state.userDetail?.profile !== null
                      ? { uri: imageBaseUrl + this.state.userDetail.profile }
                      : AppImages.images.user01
                    : AppImages.images.user01
                }
                style={styles.userImage}
              />
            </View>
            <View style={{ justifyContent: "center", width: "95%" }}>
              <Text
                numberOfLines={2}
                style={[
                  styles.userPostsText,
                  {
                    textAlign: "left",
                    flex: 1,
                    marginLeft: 15,
                    fontWeight: "bold",
                    lineHeight: 18,
                    width: "80%",
                  },
                ]}
              >
                {this.state.userDetail?.name}
                {this.props.searchUserState.tags.length > 0 && (
                  <Text
                    numberOfLines={3}
                    style={[
                      styles.userPostsText,
                      {
                        textAlign: "left",
                        flex: 1,
                        marginLeft: 15,
                        fontWeight: "normal",
                        // fontWeight: "bold",
                        lineHeight: 18,
                        // width: '95%'
                      },
                    ]}
                  >
                    {" - " + I18n.t("With")}{" "}
                    <Text
                      // numberOfLines={2}
                      style={[
                        styles.userPostsText,
                        {
                          textAlign: "left",
                          flex: 1,
                          marginLeft: 15,
                          fontWeight: "bold",
                          lineHeight: 18,
                          width: "80%",
                        },
                      ]}
                    >
                      {" " + this.props.searchUserState.tags[0].name}
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
                            // flex: 1,
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
                              //  alignSelf:'center',
                              textAlign: "left",
                              // flex: 1,
                              marginLeft: 15,
                              fontWeight: "bold",
                              lineHeight: 18,
                              width: "95%",
                            },
                          ]}
                        >
                          {" " + this.props.searchUserState.tags[1].name}
                        </Text>
                      </Text>
                    )}
                    .
                  </Text>
                )}
              </Text>
              <Text
                numberOfLines={2}
                style={[
                  styles.userPostsText,
                  {
                    textAlign: "left",
                    // flex: 1,
                    marginLeft: 15,
                    fontSize: 14,
                  },
                ]}
              >
                {this.item.item?.terminal?.terminal_name}
              </Text>
              <Text
                numberOfLines={2}
                style={[
                  styles.userPostsText,
                  {
                    textAlign: "left",
                    flex: 1,
                    marginLeft: 15,
                    fontSize: 12,
                    color: "gray",
                  },
                ]}
              >
                {moment(this.props.timeLine.detail?.created_at).format(
                  "MMMM DD, YYYY"
                )}
              </Text>
            </View>
          </View>
          {this.item?.description ? (
            <View style={{ marginVertical: 10, marginHorizontal: 10 }}>
              {/* <ScrollView bounces={false}> */}
              <ReadMore
                numberOfLines={5}
                renderTruncatedFooter={this._renderTruncatedFooter}
                renderRevealedFooter={this._renderRevealedFooter}
                onReady={this._handleTextReady}
              >
                <Text
                  // ellipsizeMode='tail'
                  onTextLayout={(e) => {
                    this.setState({ noOfLines: e.nativeEvent.lines }),
                      console.log(e.nativeEvent);
                  }}
                  numberOfLines={this.state.noOfLines.length}
                  style={[
                    styles.userPostsText,
                    {
                      textAlign: "left",
                      marginBottom: 20,
                      marginHorizontal: 20,
                      marginTop: "1%",
                    },
                  ]}
                >
                  {this.item?.description}
                </Text>
              </ReadMore>
            </View>
          ) : null}
          <View
            style={{ height: DeviceInfo.hasNotch() ? 190 : 205, width: "100%" }}
          >
            <ViewPager
              orientation="horizontal"
              scrollEnabled={true}
              initialPage={0}
              overScrollMode="always"
              onPageSelected={(e) => {
                this.setState({ index: e.nativeEvent.position });
              }}
              onPageScrollStateChanged={() => {
                this.player !== undefined &&
                  console.log("swipe", this.player.pause());
              }}
              showPageIndicator={
                this.item.mediaImages.length > 1
                  ? this.state.pageIndShow
                  : false
              }
              style={{ flex: 1, width: width }}
            >
              {this.item.mediaImages.map((x, index) => {
                return this.renderImages(x, index);
              })}
            </ViewPager>
          </View>
          {this.item.mediaImages &&
            Platform.OS == "android" &&
            this.item.mediaImages.length > 1 && (
              <View
                style={{
                  position: "absolute",
                  alignItems: "center",
                  alignSelf: "center",
                  bottom: 0,
                  top: "50%",
                }}
              >
                <Dots
                  length={this.item.mediaImages.length}
                  active={this.state.index}
                  passiveColor={"silver"}
                  activeColor={"#29a2e1"}
                  activeDotHeight={10}
                  activeDotWidth={10}
                  passiveDotHeight={8}
                  passiveDotWidth={8}
                />
              </View>
            )}
          <View
            style={{
              // position: "absolute",
              // bottom: Platform.OS=="android"?"15%":"20%",
              justifyContent: "space-between",
              // alignSelf: "center",
              flexDirection: "row",
              marginTop: "8%",
              paddingHorizontal: 20,
            }}
          >
            <Button
              Text={I18n.t("post")}
              onPress={() => {
                this.props.addTimeLinePost(
                  this.item.item._id,
                  this.item.description,
                  this.props.navigation,
                  this.state.tagsFriendsId
                );
              }}
              customStyles={{ container: styles.button }}
            />
            <Button
              Text={I18n.t("Share")}
              onPress={() => {
                this.sharePress();
              }}
              customStyles={{ container: styles.button }}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}
function mapStateToProps(state) {
  return {
    timeLine: state.timeLine,
    searchUserState: state.SearchUserState,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      addTimeLinePost,
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostPreview);
