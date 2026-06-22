import React, { Component } from 'react';
import { View, Text, FlatList, Alert, Platform } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import RNThumbnail from 'react-native-thumbnail';
import {
  Header,
  LiveStreamRender
} from "./../../Components";
import style from './style'
import CropImagePicker from 'react-native-image-crop-picker'
import { AddpostBottomTerminalInitate } from '../../Redux/actions/BottomBarAction';
import { connect } from 'react-redux';
import CameraModal from '../../Components/CameraComponent';
import { PERMISSIONS, request, openSettings } from 'react-native-permissions';
import { AppImages } from '../../Themes'
import { imageBaseUrl } from '../../Config/index'
import I18n from 'react-native-i18n';
import DeviceInfo from 'react-native-device-info'
let _this = null;
class AddPostss extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: null
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      visiblity: false,
      item: null,
      item1: null
    }
    _this = this
  }
  componentDidMount() {
    this.props.AddpostBottomTerminalInitate('data')
  }
  _renderItem = ({ item, index }) => (
    <LiveStreamRender
      terminal={item.terminal_name}
      postSource={
        item.terminal_logo !== null
          ? { uri: imageBaseUrl + item.terminal_logo }
          : AppImages.images.videoDummy
      }
      onPress={
        () => {
          this.setState({
            visiblity: true,
            item: item
          })

        }
      }
    />
  );
  onCallState() {
    this.setState({ visiblity: false })
  }

  onLibraryCall = () => {
    const options = {
      presentationStyle: 'overFullScreen',
      title: 'Select Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      mediaType: "mixed",
      quality: 0.5,
      allowsEditing: true
    };
    Platform.OS == 'ios' ?
      request(PERMISSIONS.IOS.PHOTO_LIBRARY).then((result) => {
        if (result === "blocked") {
          Alert.alert(
            I18n.t('permissionTitle'),
            I18n.t('permissionBody'),
            [
              {
                text: I18n.t("Cancel"),
                onPress: () => console.log('cancel'),
                style: "cancel"
              },
              { text: "OK", onPress: () => openSettings() }
            ],
            { cancelable: false }
          )

        }
        if (result === "granted" || result === "limited") {
          ImagePicker.launchImageLibrary(options, (response) => {
            const source = { uri: response };
            if (Platform.OS == "ios") {

              if (response.didCancel) {
              } else if (response.error) {
              } else if (response.customButton) {
              } else {
                if (response.type) {
                  if (response.type === "image/jpeg") {
                    this.props.navigation.navigate('VideoPreview', { response, thumbnail: '', terminalResult: { id: this.state.item.id }, screen: 'addPost', type: 'image' })
                  }
                } else {
                  RNThumbnail.get(response.uri).then((result) => {
                    let thumbnail = { uri: result.path, type: 'image/jpeg', name: 'photo.jpeg' };
                    this.props.navigation.navigate('VideoPreview', { response, thumbnail, terminalResult: { id: this.state.item.id }, screen: 'addPost', type: 'video' })
                  })
                }
                this.setState({
                  visiblity: false
                })
              }
            }
          })
        }
        if (result === "denied") {

        }
        if (result === "unavailable") {

        }
      })
      :
      request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then((result) => {
        if (result === "blocked") {
          Alert.alert(
            I18n.t('permissionTitle'),
            I18n.t('permissionBody'),
            [
              {
                text: I18n.t("Cancel"),
                onPress: () => { console.log('cancel') },
                style: "cancel"
              },
              { text: "OK", onPress: () => openSettings() }
            ],
            { cancelable: false }
          )
        }
        if (result === "granted") {
          CropImagePicker.openPicker({ mediaType: 'any', duration: 30000 }).then((response) => {
            if (Platform.OS == "android") {
              if (response.mime) {
                if (response.mime === "image/jpeg" || response.mime == 'image/png') {
                  this.props.navigation.navigate('VideoPreview', { response: { uri: response.path }, thumbnail: '', terminalResult: { id: this.state.item.id }, screen: 'addPost', type: 'image' })
                }
                else {
                  if (response.duration / 1000 > 30) {
                    this.setState({ visiblity: false })
                    setTimeout(() => {
                      alert(I18n.t('vedioLimit'))
                    }, 200);
                  }
                  else {
                    RNThumbnail.get(response.path).then((result) => {
                      let thumbnail = { uri: result.path, type: 'image/jpeg', name: 'photo.jpeg' };
                      this.props.navigation.navigate('VideoPreview', { response: { uri: response.path }, thumbnail, terminalResult: { id: this.state.item.id }, screen: 'addPost', type: 'video' })
                    })
                  }
                }
              }

              else {
                RNThumbnail.get(response.uri).then((result) => {
                  this.setState({
                    visiblity: false
                  })
                  let thumbnail = { uri: result.path, type: 'image/jpeg', name: 'photo.jpeg' };
                  this.props.navigation.navigate('VideoPreview', { response, thumbnail, terminalResult: { id: this.state.item.id }, screen: 'addPost', type: 'video' })
                })
              }
              this.setState({
                visiblity: false
              })
            }
          }).catch((er) => {
            console.log('Response =', er);
          })
        }
        if (result === "denied") {
          console.log('denay')
        }
        if (result === "unavailable") {
          console.log('unavailable')
        }
      }).catch(e => {
        console.log('e', e)
      })
  }
  onImageCall = () => {
    const options = {
      title: 'Select Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      mediaType: "images",

      quality: 0.5,
      allowsEditing: true
    };
    Platform.OS == 'ios' ?
      request(PERMISSIONS.IOS.CAMERA).then((result) => {
        if (result === "blocked") {
          Alert.alert(
            I18n.t('permissionTitle'),
            I18n.t('permissionBody'),
            [
              {
                text: I18n.t("Cancel"),
                onPress: () => { console.log('cancel') },
                style: "cancel"
              },
              { text: "OK", onPress: () => openSettings() }
            ],
            { cancelable: false }
          )
        }
        if (result === "granted") {
          ImagePicker.launchCamera(options, (response) => {
            if (Platform.OS == "ios") {

              if (response.didCancel) {
                console.log('User cancelled image picker');
              } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
              } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
              } else {
                const source = { uri: response.uri };
                this.setState({
                  visiblity: false
                })
                this.props.navigation.navigate('VideoPreview', { response, thumbnail: '', terminalResult: { id: this.state.item.id }, screen: 'addPost', type: 'image' })
              }
            }
          })
        }
        if (result === "denied") {

        }
        if (result === "unavailable") {

        }
      })
      :
      request(PERMISSIONS.ANDROID.CAMERA).then((result) => {
        if (result == 'blocked') {
          Alert.alert(
            I18n.t('permissionTitle'),
            I18n.t('permissionBody'),
            [
              {
                text: I18n.t("Cancel"),
                onPress: () => { console.log('cancel') },
                style: "cancel"
              },
              { text: "OK", onPress: () => openSettings() }
            ],
            { cancelable: false }
          )
        }
        else {
          ImagePicker.launchCamera(options, (response) => {
            if (Platform.OS == "android") {
              if (response.didCancel) {
              } else if (response.error) {
              } else if (response.customButton) {
              } else {
                this.setState({
                  visiblity: false
                })
                this.props.navigation.navigate('VideoPreview', { response, thumbnail: '', terminalResult: { id: this.state.item.id }, screen: 'addPost', type: 'image' })
              }
            }
          })
        }
      })
  }

  onVideoCall = () => {
    const options = {
      title: 'Select Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'video',
      },
      mediaType: "video",
      durationLimit: 30,
      quality: 0.5,
      allowsEditing: true
    };
    Platform.OS == 'ios' ?
      request(PERMISSIONS.IOS.CAMERA).then((result) => {
        if (result == 'blocked') {
          Alert.alert(
            I18n.t('videoPermissionTitle'),
            I18n.t('permissionBody'),
            [
              {
                text: I18n.t("Cancel"),
                onPress: () => { console.log('cancel') },
                style: "cancel"
              },
              { text: "OK", onPress: () => openSettings() }
            ],
            { cancelable: false }
          )
        }
        else {
          ImagePicker.launchCamera(options, (response) => {
            if (Platform.OS == "ios") {
              RNThumbnail.get(response.uri).then((result) => {
                let thumbnail = { uri: result.path, type: 'image/jpeg', name: 'photo.jpg' };
                this.setState({
                  visiblity: false
                })
                this.props.navigation.navigate('VideoPreview', { response, thumbnail, terminalResult: { id: this.state.item.id }, screen: 'addPost', type: 'video' })
              })
            }
          })
        }
      })
      :
      request(PERMISSIONS.ANDROID.CAMERA).then((result) => {
        if (result == 'blocked') {
          Alert.alert(
            I18n.t('videoPermissionTitle'),
            I18n.t('permissionBody'),
            [
              {
                text: I18n.t("Cancel"),
                onPress: () => { console.log('cancel') },
                style: "cancel"
              },
              { text: "OK", onPress: () => openSettings() }
            ],
            { cancelable: false }
          )
        }
        else {
          ImagePicker.launchCamera(options, (response) => {
            if (Platform.OS == "android") {
              if (response.didCancel) {
              } else if (response.error) {
              } else if (response.customButton) {
              }
              else {
                RNThumbnail.get(response.path).then((result) => {
                  let thumbnail = { uri: result.path, type: 'image/jpeg', name: 'photo.jpg' };
                  this.setState({
                    visiblity: false
                  })
                  this.props.navigation.navigate('VideoPreview', { response, thumbnail, terminalResult: { id: this.state.item.id }, screen: 'addPost', type: 'video' })
                }).catch(e => {
                })
              }
            }
          })
        }
      })
  }

  render() {
    return (
      <View style={style.mainWrapper}>
        <View style={{ flex: DeviceInfo.hasNotch() ? 0.14 : 0.114 }}>
          <Header
            headerTitle={I18n.t('addPost')}
            leftImageSource={this.state.visiblity !== true ? AppImages.images.back : null}
            leftbackbtnPress={() => this.props.navigation.goBack()}
          />
        </View>
        <View style={style.mainWrapper}>
          <CameraModal
            onImage={() => { this.onImageCall() }}
            onVideo={() => { this.onVideoCall() }}
            onLibrary={() => { this.onLibraryCall() }}
            oncancel={() => {
              this.onCallState()
            }}
            terminalName={this.state.item ? this.state.item.terminal_name : ''}
            visible={this.state.visiblity} />
          <FlatList
            showsHorizontalScrollIndicator={false}
            scrollToOverflowEnabled={true}
            style={{ paddingHorizontal: 10, }}
            bounces={false}
            contentContainerStyle={{ paddingBottom: 60, paddingTop: 10 }}
            data={this.props.homeState.feed ? this.props.homeState.feed.slice(0, 5) : []}
            renderItem={this._renderItem}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={
              <View style={[style.listEmptyComponentView]}>
                <Text style={[style.noValueText]}>{I18n.t('terminalNotFound')}</Text>
              </View>
            }
          >
          </FlatList>
        </View>
      </View>
    )
  }
}
function mapStateToProps(state) {
  return {
    stat: state,
    homeState: state.HomeState,
    terminalDetailState: state.TerminalDetailState,
    chatUserHistoryState: state.ChatUserHistoryState
  };
}
export default connect(mapStateToProps, { AddpostBottomTerminalInitate })(AddPostss)