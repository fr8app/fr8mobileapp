import React from 'react';
import { View, Text, ImageBackground, Image, TouchableOpacity, FlatList, Platform, Dimensions, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import {
  logOutAction,
} from "./../../Redux/actions/Authentication";
import {
  uploadUserImageInitate
} from '../../Redux/actions/uploadUserImage'
import {
  Header,
  Loader,
} from "./../../Components";
import styles from './style'
import { AppImages, AppFontFamily } from './../../Themes';
import { connect } from 'react-redux';
import { ProfileDataInitate } from '../../Redux/actions/profileAction';
import DeviceInfo from 'react-native-device-info';
import { PERMISSIONS, request, openSettings } from 'react-native-permissions';
import { imageBaseUrl, getUSerDetail, getPopRef } from '../../Config';
import I18n from 'react-native-i18n';
import NetInfo from '@react-native-community/netinfo';
import { timeLinePostDetailClear } from '../../Redux/actions/timeLineAction'
import { clearProfileData } from '../../Redux/actions/profileAction';
import { AFLogEvent, s3bucket, uploadImageOnS3, uuidv4_34 } from '../../Config/aws'
import { Linking } from 'react-native';
let height = Dimensions.get('window').height
var _this;
var internetStatus = null
class UserDetailss extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        null
      )
    };
  };
  constructor(props) {
    console.log('propssss', props);
    super(props);
    this.state = {
      isLoggedIn: props?.navigation?.state?.params?.isLogin,
      loading: false,
      refresh: false,
      internetAlert: 0
    }
    this.renderData = this.renderData.bind(this)
    this.focusListener = this.props.navigation.addListener("focus", async () => {
      let isLogin = await this.isLogin()
      if (isLogin == true) {
        this.props.clearProfileData()
        setTimeout(() => { this.props.ProfileDataInitate({ navigation: this.props.navigation }) }, 500)
      }
    })
    _this = this
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      if (this.props.LoginState !== prevProps.LoginState) {
        if (this.props.LoginState.loggedIn == true) {
          this.props.ProfileDataInitate({ navigation: this.props.navigation })
          this.isLogin()
        }
      }
    }
  }
  onNavigationBack = async () => {
    let isLogin = await this.isLogin()
    if (isLogin == true) {
      this.props.ProfileDataInitate({ navigation: this.props.navigation })
    }
  }
  componentDidMount() {
    this.setState({ isLoggedIn: this.props.route?.params.isLogin })
    console.log('this.props.route?.params.isLogin', this.props.route?.params.isLogin);
    AFLogEvent("Profile", { screen: 'Profile' })
    this.props.clearProfileData()
    this.checkInternetConnection()
  }

  isLogin = async () => {
    let data = await getUSerDetail()
    console.log('data', data);
    if (data) {
      this.setState({ isLoggedIn: true })
      return true
    }
    else {
      this.setState({ isLoggedIn: false })
      return false
    }
  }

  checkInternetConnection() {
    NetInfo.addEventListener(state =>
      this.handleConnectionChange(state.isConnected)
    );
  }

  handleConnectionChange = isConnected => {
    internetStatus = isConnected
  };



  internetPouup = () => {
    Alert.alert(
      I18n.t('Alert'),
      I18n.t('please_check_your_internet_connection'),
      [
        {
          text: I18n.t('Ok'),
          onPress: () => {
            this.setState({ internetAlert: 0 })
          }
        },
      ],
      { cancelable: false },
    )
  }

  renderData() {
    if (this.props.Profile.result) {
      return (
        <View style={{ height: DeviceInfo.hasNotch() ? height * 0.77 : height * 0.90 }}>
          <View style={styles.headUser}>
            <TouchableOpacity onPress={async () => {
              let isLoggedIn = await this.isLogin()
              if (isLoggedIn == true) {
                if (internetStatus === false) {
                  this.state.internetAlert == 0 && this.internetPouup()
                  this.setState({ internetAlert: 1 })
                } else {
                  const options = {
                    presentationStyle: 'overFullScreen',
                    title: 'Select Avatar',
                    customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
                    storageOptions: {
                      skipBackup: true,
                      path: 'images',
                    },
                    mediaType: "photo",
                    permissionDenied: {
                      title: "Please allow permission to access photo library.",
                      text: "You have to allow permission"
                    },
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
                              onPress: () => { },
                              style: "cancel"
                            },
                            { text: "OK", onPress: () => openSettings() }
                          ],
                          { cancelable: false }
                        )

                      }
                      if (result === "granted" || result === "limited") {
                        launchImageLibrary(options, (res) => {
                          if (res.didCancel) {
                          } else if (res.error) {
                          } else if (res.customButton) {
                          } else {
                            let response = res.assets[0]
                            this.setState({ loading: true })
                            const file = {
                              uri: response.uri,
                              name: response.fileName,
                              type: response.type,
                            };
                            uploadImageOnS3(file, uuidv4_34(), 'user', [this.props.Profile.result?.data?.profile]).then((res) => {
                              console.log('file uploaded', res);
                              s3bucket.upload(res, (err, data) => {
                                if (err) {
                                  this.setState({ loading: false })
                                  console.log('error in callback', err);
                                }
                                console.log('success');
                                console.log("Respomse URL : ", data);
                                if (data.Location) {
                                  this.setState({ loading: false })
                                  this.props.uploadUserImageInitate(data.key, res.oldFilesArray)
                                }
                              });
                            })
                          }
                        })
                      }
                      if (result === "denied") {
                      }
                      if (result === "unavailable") {
                      }
                    }) :
                    request(PERMISSIONS.ANDROID.CAMERA).then((res) => {
                      if (res === "blocked") {
                        Alert.alert(
                          I18n.t('permissionTitle'),
                          I18n.t('permissionBody'),
                          [
                            {
                              text: I18n.t("Cancel"),
                              onPress: () => { },
                              style: "cancel"
                            },
                            { text: "OK", onPress: () => openSettings() }
                          ],
                          { cancelable: false }
                        )

                      }
                      else if (res == 'granted') {
                        launchImageLibrary(options, (res) => {
                          if (res.didCancel) {
                          } else if (res.error) {
                          } else if (res.customButton) {
                          } else {
                            let response = res.assets[0]
                            this.setState({ loading: true })
                            const file = {
                              uri: response.uri,
                              name: response.fileName,
                              type: response.type,
                            };
                            uploadImageOnS3(file, uuidv4_34(), 'user', [this?.props?.Profile?.result?.data?.profile]).then((res) => {
                              console.log('file uploaded', res);
                              s3bucket.upload(res, (err, data) => {
                                if (err) {
                                  this.setState({ loading: false })
                                  console.log('error in callback', err);
                                }
                                console.log('success');
                                console.log("Respomse URL : ", data);
                                if (data.Location) {
                                  this.setState({ loading: false })
                                  this.props.uploadUserImageInitate(data.key, res.oldFilesArray)
                                }
                              });
                            })
                          }
                        })
                      }
                    })
                }
              }
              else {
                getPopRef().modalOpen()
              }

            }}>
              <Image source={this.props.UserProfileImage.image ? { uri: imageBaseUrl + this.props.UserProfileImage.imageUrl } : this?.props?.Profile?.result?.data ? this?.props?.Profile?.result?.data?.profile ? { uri: imageBaseUrl + this?.props?.Profile?.result?.data?.profile } : AppImages.images.user01 : AppImages.images.user01} resizeMode="cover" style={styles.userImage} />
            </TouchableOpacity>
            {this.state.isLoggedIn ? <Text style={{
              fontSize: 20, marginTop: 15,
              textAlign: 'center',
              color: 'white',
              fontFamily: AppFontFamily.fontFamily.regular,
            }}>{this.state.isLoggedIn ? this.props.Profile.result ? this?.props?.Profile?.result?.data ? this?.props?.Profile?.result?.data?.userName : '' : '' : ''}</Text>
              : null
            }
            <Text
              onPress={async () => {
                let isLoggedIn = await this.isLogin()
                if (isLoggedIn == true) {
                  if (this.props?.Profile?.result?.data) {
                    this.props.navigation.navigate("SelfUserProfileDetail", {
                      key: null,
                      userDetail: this.props?.Profile?.result?.data,
                    })
                  }
                }
                else {
                  this.props.navigation.navigate("EditProfile", { onNavigationBack: () => _this.onNavigationBack(), addProfile: true })
                }
              }}
              style={{
                marginTop: 5,
                fontSize: 16,
                textAlign: 'center',
                color: '#29a2e1',
                fontFamily: AppFontFamily.fontFamily.bold,
              }}>{this.state.isLoggedIn ? I18n.t('viewProfile') : 'Add Profile'}</Text>
          </View>
          <View style={{ paddingHorizontal: 10 }}>
            <ImageBackground resizeMode="contain" source={require('../../Images/post-bg.png')} style={styles.box}>
              <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center', }}>
                <View style={{ marginRight: 20 }}>
                  <Text style={{
                    fontSize: 20, paddingLeft: 10,
                    color: 'white',
                    fontFamily: AppFontFamily.fontFamily.regular,
                  }}>{this.props.Profile.result ? this?.props?.Profile?.result?.data ? '  ' + this?.props?.Profile?.result?.data?.postCount : '  ' + '0' : '  ' + '0'}</Text>
                  <Text style={{
                    fontSize: 20,
                    color: 'white',
                    fontFamily: AppFontFamily.fontFamily.regular,
                    fontWeight: 'bold'
                  }}> {this?.props?.Profile?.result ? this?.props.Profile?.result?.data ? this.props?.Profile?.result?.data?.postCount == 1 ? I18n.t('post') : I18n.t('posts') : I18n.t('posts') : I18n.t('posts')}</Text>
                </View>
              </View>
              <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity activeOpacity={0.7} onPress={async () => {
                  let isLoggedIn = await this.isLogin()
                  if (isLoggedIn == true) {
                    this.props.navigation.navigate("MyFreightingNetwork", { notify: 'friendList' })
                  }
                  else {
                    getPopRef().modalOpen()
                  }
                }} style={{ marginRight: 20 }}>
                  <Text style={{
                    fontSize: 20, alignSelf: 'center',
                    color: 'white',
                    fontFamily: AppFontFamily.fontFamily.regular,
                  }}>{this.props.Profile.result ? this?.props?.Profile?.result?.data ? '   ' + this?.props?.Profile?.result?.data?.friendsCount : '   ' + '0' : '   ' + '0'}</Text>
                  <Text style={{
                    fontSize: 20, alignSelf: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontFamily: AppFontFamily.fontFamily.regular,
                  }}>{this.props.Profile.result ? this.props.Profile?.result?.data ? this.props.Profile?.result?.data?.friendsCount == 1 ? I18n.t('Friend') : I18n.t('Friends') : I18n.t('Friends') : I18n.t('Friends')}</Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
            <TouchableOpacity onPress={() => { this.props.navigation.navigate("MyFreightingNetwork") }} style={[styles.line, { flexDirection: 'row', paddingLeft: -30, marginLeft: -25 }]} >
              <Image style={{ with: 25, height: 25, }} resizeMode={DeviceInfo.hasNotch() ? 'contain' : 'contain'} source={require('../../Images/my-network.png')} />
              <Text style={{
                fontSize: 20,
                color: 'white',
                marginLeft: -5,
                fontFamily: AppFontFamily.fontFamily.regular,
              }}>{I18n.t('My_Network')}</Text>
              <View style={{ flex: 1, alignItems: 'flex-end', marginRight: -19 }}>
                <Image style={{ with: 15, height: 15, }} resizeMode='contain' source={require('../../Images/arrowClient.png')} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={async () => {
              let isLoggedIn = await _this.isLogin()
              if (isLoggedIn == true) {
                this.props.navigation.navigate("FriendRequests")
              }
              else {
                getPopRef().modalOpen()
              }
            }} style={[styles.line, { flexDirection: 'row', marginLeft: -16, paddingLeft: -30 }]} >
              <Image style={{ with: 25, height: 25 }} resizeMode={DeviceInfo.hasNotch() ? 'contain' : 'contain'} source={require('../../Images/friend-requestClient.png')} />
              <Text style={{
                fontSize: 20,
                color: 'white',
                fontFamily: AppFontFamily.fontFamily.regular,
              }}>{I18n.t('Friend_Requests')}</Text>
              <View style={{ flex: 1, alignItems: 'flex-end', marginRight: -10 }}>
                <Image style={{ with: 15, height: 15, }} resizeMode='contain' source={require('../../Images/arrowClient.png')} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={async () => {
              let login = await this.isLogin()
              this.props.navigation.navigate("Settings", { isLogin: login })
            }} style={[styles.line, { flexDirection: 'row', marginLeft: -16 }]} >
              <Image style={{ with: 25, height: 25 }} resizeMode={DeviceInfo.hasNotch() ? 'contain' : 'contain'} source={require('../../Images/app-settingClient.png')} />
              <Text style={{
                fontSize: 20,
                color: 'white',
                fontFamily: AppFontFamily.fontFamily.regular,
              }}>{I18n.t('App_Settings')}</Text>
              <View style={{ flex: 1, alignItems: 'flex-end', marginRight: -10 }}>
                <Image style={{ with: 15, height: 15, }} resizeMode='contain' source={require('../../Images/arrowClient.png')} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={async () => {
              let isLoggedIn = await this.isLogin()
              if (isLoggedIn == true) {
                Alert.alert(
                  I18n.t("Alert"),
                  I18n.t('logOutAlert'),
                  [
                    {
                      text: I18n.t("Cancel")
                    },
                    {
                      text: I18n.t("Yes"),
                      onPress: async () => {
                        let isLoggedIn = await this.isLogin()
                        if (isLoggedIn == true) {
                          this.props.logOutAction(this.props.navigation);
                        }
                        else {
                          getPopRef().modalOpen()
                        }
                      }
                    }
                  ],
                  { cancelable: false }
                );
              }
              else {
                getPopRef().modalOpen()
              }
            }} style={[styles.line, { flexDirection: 'row', paddingLeft: 3, marginLeft: -16 }]}>
              <Image style={{ with: 25, height: 25 }} resizeMode={DeviceInfo.hasNotch() ? 'contain' : 'contain'} source={require('../../Images/log-out.png')} />
              <Text style={{
                fontSize: 20,
                marginLeft: 5,
                color: 'white',
                fontFamily: AppFontFamily.fontFamily.regular,
              }}>{this.state.isLoggedIn ? I18n.t('Log_out') : I18n.t('Login')}</Text>
              <View style={{ flex: 1, alignItems: 'flex-end', marginRight: -10 }}>
                <Image style={{ with: 15, height: 15, }} resizeMode='contain' source={require('../../Images/arrowClient.png')} />
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ borderTopWidth: 0.25, borderTopColor: 'rgba(255,255,200,0.3)', marginVertical: DeviceInfo.hasNotch() ? 50 : 40 }}>
          </View>
          <View style={{ flex: 1, justifyContent: "flex-end", marginBottom: 20 }}>
            <View style={styles.social}>
              <TouchableOpacity
                onPress={() => Linking.openURL('https://www.facebook.com/FR8Co')}
                style={{ width: 50, height: 50, alignItems: 'center', justifyContent: 'center' }}>
                <Image resizeMode={DeviceInfo.hasNotch() ? 'contain' : 'contain'} style={{ width: 25, height: 25 }} source={require('../../Images/facebook.png')} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => Linking.openURL('https://www.youtube.com/channel/UCRfH0IMt38Fr2cn3evHdxug')}
                style={{ width: 50, height: 50, justifyContent: 'center' }}>
                <Image style={{ width: 25, height: 25, }} source={require('../../Images/bi_youtube.png')} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Linking.openURL('https://www.linkedin.com/company/fr8-app')}>
                <Image style={{ width: 25, height: 25, }} source={require('../../Images/cib_linkedin-in.png')} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
    } else {
      <View></View>
    }
  }
  render() {
    let { navigation, route } = this.props
    return (
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        <View style={{ height: Platform.OS == 'android' ? DeviceInfo.hasNotch() ? height * 0.11 : height * 0.09 : DeviceInfo.hasNotch() ? height * 0.11 : height * 0.11 }}>
          <Header
            headerTitle={I18n.t('Profile')}
            profileTed={true}
            leftImageSource={AppImages.images.back} leftbackbtnPress={() => {
              route.params.onNavigationBack()
              navigation.goBack()
            }}
            rightImageSource={this.state.isLoggedIn ? AppImages.images.editPen : null}
            rightBackBtnPress={async () => {
              if (this.state.isLoggedIn) {
                if (internetStatus === false) {
                  _this.state.internetAlert == 0 && _this.internetPouup()
                  _this.setState({ internetAlert: 1 })
                } else {
                  navigation.navigate("EditProfile", { onNavigationBack: () => _this.onNavigationBack() })
                }
              }
            }}
          />
        </View>
        <Loader loading={this.props.Profile.onLoad || this.props.UserProfileImage.onLoad || this.state.loading} />
        <FlatList
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshing={this.state.refresh}
          onRefresh={() => {
            this.setState({ refresh: true }, async () => {
              let isLogin = await this.isLogin()
              if (isLogin) {
                this.props.ProfileDataInitate({ navigation: this.props.navigation })
              }
              setTimeout(() => {
                this.setState({ refresh: false })
              }, 2000)
            })
          }}
          data={[1]}
          renderItem={this.renderData}
        />
      </View>
    )
  }
}

function mapStateToProps(state) {
  return {
    Profile: state.Profile,
    LoginState: state.LoginState,
    UserProfileImage: state.UserProfileImage
  }
}
export default connect(mapStateToProps, { logOutAction, ProfileDataInitate, clearProfileData, timeLinePostDetailClear, uploadUserImageInitate })(UserDetailss)