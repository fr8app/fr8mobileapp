import React, { Component } from "react";
import {
  Dimensions,
  PermissionsAndroid,
  Image,
  Platform,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  PanResponder,
  Animated,
  BackHandler,
  Keyboard,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import styles from "./styles";
import Sound from "react-native-sound";
import { AudioRecorder, AudioUtils } from "react-native-audio";
import LinearGradient from "react-native-linear-gradient";
//images
import Send from "mainscreen_images/send.png";
import MicBtn from "mainscreen_images/Mic3x.png";
import MicPressedBtn from "mainscreen_images/MicPresed3x.png";
import CancelRecord from "mainscreen_images/XDefault3x.png";
import ConfirmCancel from "mainscreen_images/XFocused3x.png";
import Send_Msg from "mainscreen_images/SendBtnDisable3x.png";
import Active_send_Msg from "mainscreen_images/Group3x.png";
//services
import GigService from "service/GigService";
import ChatService from "service/ChatService";
import AwsService from "service/AwsService";
import DataManager from "component/DataManager";
import PulseAnimation from "./Pulse";
import NonActivePulseAnimation from "./NonActivePulse";
import withPreventDoubleClick from "../../components/withPreventDoubleClick";
import { EventRegister } from "react-native-event-listeners";
import KeyboardManager from "react-native-keyboard-manager";
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
var initialX = 0;
var initialY = 0;
var updatedX = 0;
var updatedY = 0;
var cancelTrue = false;
var top = null;
var bottom = null;
var fixed = null;
var variable = null;
var opacitive = null;
var topX = Dimensions.get("window").width / 2;
const OpacityButton = withPreventDoubleClick(TouchableOpacity);
export default class MainScreen extends Component {
  constructor() {
    super();
    this.state = {
      pan: new Animated.ValueXY(),
      dropAreaValues: null,
      opacity: new Animated.Value(1),
      showDraggable: true,
      recordingStart: false,
      currentTime: 0.0,
      recording: false,
      paused: false,
      stoppedRecording: true,
      recordCanceled: false,
      finished: false,
      audioPath: AudioUtils.DocumentDirectoryPath + "/test.aac",
      hasPermission: undefined,
      cancelButton: false,
      titletext: "Tell us what you need",
      ListeningText: "We hear you...",
      recordingbackgroundC: "transparent",
      normalBackground: "#f1f8fe",
      cancelConfirm: false,
      maxValue: null,
      opacityValue: 0,
      message: "",
      user1: "",
      user2: "Admin",
      loadingVisible: false,
      sendbtn: false,
      textMessageHeight: 0,
      totalUnreadMessages: 0,
      bottomValue: 0,
      isWriting: false,
    };

    this.navigateToChat = this.navigateToChat.bind(this);
    this.createNewConversationOnFB = this.createNewConversationOnFB.bind(this);
  }
  prepareRecordingPath(audioPath) {
    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: "Low",
      AudioEncoding: "aac",
      AudioEncodingBitRate: 32000,
    });
  }

  componentWillMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this._stopHardwareBackhandler.bind(this)
    );
    const touchThreshold = 20;
    this._val = { x: 0, y: 0 };
    this.state.pan.addListener((value) => (this._val = value));
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gesture) => {
        return true;
      },
      onPanResponderGrant: (evt, gestureState) => {
        this._record();
        isRecord = true;
      },
      onPanResponderRelease: this.handledraggerOut.bind(this),
    });
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow.bind(this)
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide.bind(this)
    );

    DataManager.hasRecordingPermission().then((perm) => {
      let hasPermission = perm === "granted";
      this.setState({ hasPermission });
    });

    this.listener = EventRegister.addEventListener(
      "getTotalUnreadMessages",
      (data) => {
        this.getTotalUnreadMessages();
      }
    );
  }
  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow(e) {
    var kheight = e.endCoordinates.height;
    this.setState({
      titletext: "We stand ready",
      bottomValue: kheight,
      isWriting: true,
    });
  }

  _keyboardDidHide() {
    this.setState({
      titletext: "Tell us what you need",
      bottomValue: 0,
      isWriting: false,
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this._stopHardwareBackhandler.bind(this)
    );
  }
  _stopHardwareBackhandler() {
    console.log("_stopHardwareBackhandler");
    return true;
  }
  componentDidMount() {
    DataManager.getUserId().then((data) => {
      this.setState({ user1: JSON.parse(data) }, () => {
        this.getTotalUnreadMessages();
      });
    });
  }

  getTotalUnreadMessages() {
    GigService.getTotalUnreadMessages(this.state.user1).then((resp) => {
      this.setState({
        totalUnreadMessages: resp.result.data.totalUnread,
      });
    });
  }
  _checkPermission() {
    if (Platform.OS !== "android") {
      return Promise.resolve(true);
    }

    const rationale = {
      title: "Delegate requests permission to access your microphone",
      message:
        "This way you'll be able to send us your requests as voice messages",
    };

    return PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      rationale
    ).then((result) => {
      return result === true || result === PermissionsAndroid.RESULTS.GRANTED;
    });
  }
  async _stop() {
    if (!this.state.recording) {
      console.warn("Can't stop, not recording!");
      return;
    }
    this.setState({ stoppedRecording: true, recording: false, paused: false });
    try {
      const filePath = await AudioRecorder.stopRecording();

      if (Platform.OS === "android") {
        this._finishRecording(true, filePath);
      }
      return filePath;
    } catch (error) {
      // console.error(error)
    }
  }

  async _play() {
    if (this.state.recording) {
      await this._stop();
    }
    setTimeout(() => {
      var sound = new Sound(this.state.audioPath, "", (error) => {
        if (error) {
          console.log("failed to load the sound", error);
        }
      });

      setTimeout(() => {
        sound.play((success) => {
          if (success) {
            console.log("successfully finished playing");
          } else {
            console.log("playback failed due to audio decoding errors");
          }
        });
      }, 100);
    }, 100);
  }

  async _record() {
    if (!this.state.hasPermission) {
      this._checkPermission().then((hasPermission) => {
        this.setState({ hasPermission }, () => {
          let perm = hasPermission ? "granted" : "denied";
          DataManager.setRecordingPermission(perm);
        });

        if (!hasPermission) return;

        AudioRecorder.onProgress = (data) => {
          this.setState({ currentTime: Math.floor(data.currentTime) });
        };

        AudioRecorder.onFinished = (data) => {
          if (Platform.OS === "ios") {
            this._finishRecording(data.status === "OK", data.audioFileURL);
          }
        };
      });
    } else {
      AudioRecorder.onProgress = (data) => {
        this.setState({ currentTime: Math.floor(data.currentTime) });
      };

      AudioRecorder.onFinished = (data) => {
        if (Platform.OS === "ios") {
          this._finishRecording(data.status === "OK", data.audioFileURL);
        }
      };
      this.setState(
        { recordingStart: true, cancelButton: false, cancelConfirm: true },
        () => {
          this.props.onStartRecording();
        }
      );
      if (this.state.recording) {
        console.warn("Already recording!");
        return;
      }

      if (!this.state.hasPermission) {
        console.warn("Can't record, no permission granted!");
        return;
      }

      if (this.state.stoppedRecording) {
        this.prepareRecordingPath(this.state.audioPath);
      }

      this.setState({ recording: true, paused: false });

      try {
        const filePath = await AudioRecorder.startRecording();
      } catch (error) {
        // console.error(error)
      }
    }
  }

  _finishRecording(didSucceed, filePath) {
    this.setState({ finished: didSucceed });
    if (didSucceed) {
      if (this.state.recordCanceled) console.log("cancel record");
      else {
        this.setState({ loadingVisible: true }, () => {
          const recordTime = this.state.currentTime;
          AwsService.saveAudio(
            filePath,
            recordTime,
            (audio_path, recordTime) => {
              let fbMessage = {
                type: "audio",
                body: audio_path,
                recordTime: recordTime,
                from: this.state.user1,
                to: "Admin",
              };
              GigService.createNewGig(fbMessage, (response) => {
                // alert('Message Sent1' + response._id)
                this.createNewConversationOnFB(response._id, fbMessage);
              });
            }
          );
        });
      }
    }

    console.log(
      `Finished recording of duration ${
        this.state.currentTime
      } seconds at path: ${filePath}`
    );
  }
  handleLongPress() {
    this.setState(
      { recordingStart: true, cancelButton: false, cancelConfirm: true },
      () => {
        this.props.onStartRecording();
      }
    );
    //this._record()
    isRecord = true;
  }

  recordCancel() {
    this.setState(
      { recordingStart: false, cancelConfirm: false, opacityValue: 0 },
      () => {
        this.props.onStopRecording();
      }
    );
    this._stop();
  }

  onMove(evt) {
    const touchThreshold = 20;
    const { dx, dy } = evt;

    fixed = bottom - top;
    if (this.state.recordingStart == true) {
      variable = evt.nativeEvent.pageY - top;
      var result = variable / fixed + 0.2;

      if (
        evt.nativeEvent.pageX > parseFloat(topX) - 30 &&
        evt.nativeEvent.pageX < parseFloat(topX) + 30 &&
        evt.nativeEvent.pageY < parseFloat(top) + 10 &&
        evt.nativeEvent.pageY > parseFloat(top) - 60
      ) {
        opacitive = 1;
      } else if (
        evt.nativeEvent.pageX < parseFloat(topX) - 30 &&
        evt.nativeEvent.pageY < parseFloat(top) + 10 &&
        evt.nativeEvent.pageY > parseFloat(top) - 60
      ) {
        opacitive = 1 - result - 0.25;
        if (opacitive > 0.6) {
          opacitive = 0.4;
        }
      } else if (
        evt.nativeEvent.pageX > parseFloat(topX) + 30 &&
        evt.nativeEvent.pageY < parseFloat(top) + 10 &&
        evt.nativeEvent.pageY > parseFloat(top) - 60
      ) {
        opacitive = 1 - result - 0.3;
        if (opacitive > 0.6) {
          opacitive = 0.4;
        }
      } else if (evt.nativeEvent.pageY < parseFloat(top) - 120) {
        opacitive = 1 + result + 0.1;
        if (opacitive > 0.6) {
          opacitive = 0.4;
        }
        opacitive = 0.4;
      } else {
        opacitive = 1 - result;
        if (opacitive > 0.6) {
          opacitive = 0.4;
        }
      }

      this.setState({ opacityValue: opacitive });
    }
    return Math.abs(dx) > touchThreshold || Math.abs(dy) > touchThreshold;
  }

  handledraggerOut(evt) {
    if (
      this.state.recordingStart == true &&
      evt.nativeEvent.pageX > parseFloat(topX) - 30 &&
      evt.nativeEvent.pageX < parseFloat(topX) + 30 &&
      evt.nativeEvent.pageY < parseFloat(top) + 10 &&
      evt.nativeEvent.pageY > parseFloat(top) - 70
    ) {
      var rightX = parseFloat(topX + 10);
      if (
        this.state.recordingStart == true &&
        evt.nativeEvent.pageY < top + 10
      ) {
        this.setState(
          {
            cancelConfirm: false,
            recordingStart: false,
            opacityValue: 0,
            recordCanceled: true,
          },
          () => {
            this.props.onStopRecording();
            this._stop();
            // alert('Cancel')
          }
        );
      }
    } else {
      if (this.state.recordingStart == true) {
        this.setState(
          {
            cancelConfirm: false,
            recordingStart: false,
            opacityValue: 0,
            recordCanceled: false,
          },
          () => {
            this.props.onStopRecording();
            this._stop();
          }
        );
      }
    }
  }

  navigateToChat(conversationId, fbMessage) {
    const navigate = this.props.navigate;
    this.setState({ loadingVisible: false }, () => {
      navigate("Chat", {
        conversationId: conversationId,
        initialMsg: fbMessage,
      });
      EventRegister.emit("loadGigsEvent", "it works!!!");
    });
  }

  createNewConversationOnFB(conversationId, fbMessage) {
    const _self = this;
    const { user1, user2 } = this.state;
    ChatService.createNewChat(conversationId, user1, user2, fbMessage, () => {
      _self.navigateToChat(conversationId, fbMessage);
    });
  }

  sendTextMessage() {
    if (this.state.message && this.state.message.length) {
      this.setState(
        {
          loadingVisible: true,
          titletext: "Tell us what you need",
          sendbtn: false,
        },
        () => {
          const message = this.state.message;
          let fbMessage = {
            body: message,
            type: "text",
            from: this.state.user1,
            to: "Admin",
          };
          GigService.createNewGig(fbMessage, (response) => {
            this.setState({ message: "" }, () => {
              this.createNewConversationOnFB(response._id, fbMessage);
            });
            EventRegister.emit("loadGigsEvent", "it works!!!");
          });
        }
      );
    }
  }
  textChnage(txt) {
    this.setState({ message: txt });
    if (txt.length) {
      this.setState({ sendbtn: true });
    } else {
      this.setState({ sendbtn: false });
    }
  }
  render() {
    const navigate = this.props.navigate;
    const panStyle = {
      transform: this.state.pan.getTranslateTransform(),
    };

    let totalUnreadMessages = this.state.totalUnreadMessages;
    onMoveShouldSetResponder = (evt) => true;
    return (
      <LinearGradient
        colors={["#7fc2f2", "#1e87e5"]}
        style={{ flex: 1, zIndex: 0 }}
      >
        {this.state.cancelConfirm == true || cancelTrue == true ? (
          <LinearGradient
            colors={[
              "rgba(255,255,255,0.7)",
              "rgba(255,255,255,0.5)",
              "rgba(255,255,255,0.7)",
            ]}
            opacity={this.state.opacityValue}
            style={styles.cancel}
          >
            <TouchableOpacity
              style={styles.cancelBlackBtn}
              onPress={() => this.recordCancel()}
            >
              <Image style={styles.cancelImage} source={ConfirmCancel} />
            </TouchableOpacity>
          </LinearGradient>
        ) : null}
        <View
          backgroundColor={
            this.state.recordingStart == true
              ? this.state.recordingbackgroundC
              : this.state.normalBackground
          }
          style={styles.slide1}
          onStartShouldSetResponder={(evt) => true}
          onMoveShouldSetResponder={(evt) => true}
          onResponderMove={this.onMove.bind(this)}
          onResponderRelease={this.handledraggerOut.bind(this)}
        >
          <View style={styles.view}>
            <TouchableOpacity onPress={this.props.leftCLick}>
              <View>
                <Text
                  style={
                    this.state.recordingStart == false
                      ? styles.textbutton
                      : styles.recordActive
                  }
                >
                  My Gigs
                </Text>
              </View>
            </TouchableOpacity>
            {totalUnreadMessages > 0 ? (
              <View style={styles.notifyView}>
                <Text style={styles.notifyTxt}>
                  {totalUnreadMessages >= 10 ? "9+" : totalUnreadMessages}{" "}
                </Text>
              </View>
            ) : null}

            <TouchableOpacity onPress={this.props.rightClick}>
              <Text
                style={
                  this.state.recordingStart == false
                    ? styles.textbutton
                    : styles.recordActive
                }
              >
                Explore
              </Text>
            </TouchableOpacity>
          </View>
          <Text
            style={
              this.state.recordingStart == false
                ? styles.text
                : styles.RecordTruetext
            }
          >
            {this.state.recordingStart == true
              ? this.state.ListeningText
              : this.state.titletext}
          </Text>

          {this.state.recordingStart == true ? (
            <Text style={styles.slideuptext}>Slide up to cancel recording</Text>
          ) : null}

          {!this.state.isWriting ? (
            <View style={{ flex: 1, alignItems: "center", width: deviceWidth }}>
              {this.state.recordingStart == true ? (
                <Image
                  style={{
                    height: 50,
                    width: 50,
                    zIndex: 0,
                    top: Platform.OS == "ios" ? 44 : 23,
                    position: "absolute",
                  }}
                  ref="topmark"
                  onLayout={({ nativeEvent }) => {
                    this.refs.topmark.measure(
                      (x, y, width, height, pageX, pageY) => {
                        top = pageY + 50;
                      }
                    );
                  }}
                  source={CancelRecord}
                />
              ) : null}

              <View
                {...this.panResponder.panHandlers}
                onStartShouldSetPanResponder={(evt) => true}
                onMoveShouldSetPanResponder={(evt) => true}
                ref="Marker"
                onLayout={({ nativeEvent }) => {
                  this.refs.Marker.measure(
                    (x, y, width, height, pageX, pageY) => {
                      bottom = pageY;
                    }
                  );
                }}
                activeOpacity={1}
                style={
                  this.state.recordingStart == false
                    ? styles.nonActivecircle
                    : styles.activecircle
                }
              >
                <Image
                  resizeMode="contain"
                  style={{ height: 40, width: 40, zIndex: 0 }}
                  source={
                    this.state.recordingStart == false ? MicBtn : MicPressedBtn
                  }
                />
              </View>

              {this.state.recordingStart == true ? (
                <PulseAnimation
                  interval={2000}
                  circle2={350}
                  circle3={250}
                  borderColor="transparent"
                  backgroundColor="#80bff0"
                  pulseMaxSize={450}
                  size={50}
                />
              ) : (
                <NonActivePulseAnimation
                  interval={3000}
                  circle2={160}
                  circle3={250}
                  borderColor="transparent"
                  backgroundColor="#cce3fa"
                  pulseMaxSize={250}
                  size={20}
                />
              )}
              {this.state.recordingStart == false ? (
                <Text style={styles.holdtext}>
                  Hold to record, release to send
                </Text>
              ) : null}
            </View>
          ) : null}
        </View>
        {this.state.recordingStart == true ? null : (
          <View
            style={[
              styles.bottomBar,
              {
                height: Math.max(70, this.state.textMessageHeight + 30),
                bottom: Platform.OS == "ios" ? this.state.bottomValue : 0,
              },
            ]}
          >
            <View style={[styles.SectionStyle]}>
              <TextInput
                underlineColorAndroid="transparent"
                placeholder="What can we do for you?"
                multiline={true}
                style={[
                  styles.inputtext,
                  { height: Math.max(35, this.state.textMessageHeight) },
                ]}
                onContentSizeChange={(event) => {
                  this.setState({
                    textMessageHeight: event.nativeEvent.contentSize.height,
                  });
                }}
                autoCapitalize="none"
                editable={true}
                selectTextOnFocus
                onChangeText={(txt) => this.textChnage(txt)}
                value={this.state.message}
                onSubmitEditing={() =>
                  this.setState({ titletext: "Tell us what you need" })
                }
              />
              <TouchableOpacity onPress={() => this.sendTextMessage()}>
                <Image
                  source={
                    this.state.sendbtn == false ? Send_Msg : Active_send_Msg
                  }
                  style={styles.ImageStyle}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
        <Spinner
          visible={this.state.loadingVisible}
          textContent={"Loading..."}
          textStyle={{ color: "#FFF" }}
        />
      </LinearGradient>
    );
  }
}
