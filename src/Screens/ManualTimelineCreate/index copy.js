import React, { Component } from 'react';
import { View, Text, Platform, Image, Dimensions, BackHandler, ActionSheetIOS } from 'react-native';
import MakeRoute from '../FR8/MakeRoute';
import { Header, Loader, PickerInput, Button, Validations, DataManager } from "./../../Components";
import { AppImages, AppFontFamily } from "./../../Themes";
import I18n from 'react-native-i18n';
import AnimatedTextInput from '../../Components/AnimatedTextInput';
import { TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native';
import styles from './styles';
import Picker from "react-native-picker";
import { Keyboard } from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { FlatList } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Alert } from 'react-native';
import RNThumbnail from 'react-native-thumbnail';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ManualTimelineCreate } from '../../Redux/actions/RoutePostAction'
import { openSettings, PERMISSIONS, request } from 'react-native-permissions';
import NetInfo from '@react-native-community/netinfo';
import { socket } from '../../Config/socket';
import moment from 'moment';
import { AFLogEvent, s3bucket, uploadImageOnS3, uuidv4_34 } from '../../Config/aws';
import ImageResizer from 'react-native-image-resizer';
import ActionSheet from 'react-native-actionsheet';
import ImageCropPicker from 'react-native-image-crop-picker';
const LN2 = 0.6931471805599453;

class ManualTimeline extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: '',
            loading: false,
            name: '',
            location: '',
            phoneNumber: '',
            images: [],
            video: [],
            addedPress: 0,
            userType: '',
            userTypeSelectedIndex: "",
            terminalType: [
                I18n.t("Warehouse"),
                I18n.t('Truck Stop'),
                I18n.t('Gas Station'),
                I18n.t('Weight Station')
            ],
        };
        this.params = this.props.route.params;
        this.zoomLevel = null;
        this.back == null
    }
    latRad = (lat) => {
        var sin = Math.sin(lat * Math.PI / 180);
        var radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
        return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
    }

    hardwareBackPress = () => {
        this.back = BackHandler.addEventListener('hardwareBackPress', () => {
            Alert.alert(
                "Alert",
                I18n.t('timelineCancel'),
                [
                    {
                        text: I18n.t('Yes'), onPress: () => {
                            this.props.navigation.pop(2)
                        }
                    },
                    {
                        text: I18n.t('No')
                    },
                ]
            )
            Picker.hide()
            return true

        })
    }

    componentWillUnmount() {
        this.back?.remove()
    }

    zoom = (mapPx, worldPx, fraction) => {
        return Math.floor(Math.log(mapPx / worldPx / fraction) / LN2);
    }

    socketCall = async () => {
        let userData = await DataManager.getUserDetails();
        let jsonData = await JSON.parse(userData);
        this.setState({ userId: jsonData.data._id })
        if (jsonData?.data?._id) {
            socket.emit('manual_socket',
                {
                    start: false,
                    time: moment().utc(),
                    user_id: jsonData?.data?._id
                }
            )
        }
    }

    getZoomLevel = (bounds, mapWidthPx, mapHeightPx) => {
        var ne = bounds.northEast;
        var sw = bounds.southWest;
        var latFraction = (this.latRad(ne.latitude) - this.latRad(sw.latitude)) / Math.PI;
        var lngDiff = ne.longitude - sw.longitude;
        var lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;
        var latZoom = this.zoom(mapHeightPx, 256, latFraction);
        var lngZoom = this.zoom(mapWidthPx, 256, lngFraction);
        var result = Math.min(latZoom, lngZoom);
        return Math.min(result, 21);
    }

    componentDidMount() {
        AFLogEvent("ManualTimeLineScreenStart", { screen: 'ManualTimeLineScreenStart' })
        this.focusListener = this.props.navigation.addListener("focus", () => {
            this.hardwareBackPress()
        });
        this.focusListener = this.props.navigation.addListener("blur", () => {
            this.back.remove()
        });

        if (this.routeRef.state.mapReady) {
            this?.routeRef?.mapSnapRef?.fitToCoordinates(this.params?.coordinates, { edgePadding: { top: 10, bottom: 10, right: 10, left: 10 }, animated: true })
        }
        setTimeout(() => {
            this?.routeRef?.mapSnapRef?.getMapBoundaries().
                then((res) => {
                    let zoom = this.getZoomLevel(res, 512, 256)
                    this.zoomLevel = zoom
                })
        }, 2000);

        console.log('coordinates', this.params);
        Keyboard.addListener('keyboardDidShow', () => {
            Picker.hide()
        })
        this.focusListener = this.props.navigation.addListener('blur', () => {
            Picker.hide()
        })
    }
    mediaView = () => {
        return (
            <View>
                <View>
                    {this.state.images.length < 3 && <View style={[styles.checkIn,]}>
                        <TouchableOpacity activeOpacity={0.7} onPress={() => this.onImageCall('photo')}>
                            <Image style={styles.icon} resizeMode='contain' source={require('../../Images/Photo2.png')} />
                        </TouchableOpacity>
                        <Text
                            onPress={() => this.onImageCall('photo')}
                            style={[styles.iconText]}>{I18n.t('photoL')}
                        </Text>
                    </View>

                    }
                    {this.state.images.length > 0 && <FlatList
                        bounces={false}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingRight: 30, paddingTop: 10 }}
                        data={this.state.images}
                        horizontal
                        renderItem={this.renderMedia}
                    />}
                </View>
                <View>
                    {this.state.video.length < 2 && <View style={[styles.checkIn]}>
                        <TouchableOpacity activeOpacity={0.7} onPress={() => this.onImageCall('video')}>
                            <Image style={styles.icon} resizeMode='contain' source={require('../../Images/Video2.png')} />
                        </TouchableOpacity>
                        <Text
                            onPress={() => this.onImageCall('video')}
                            style={[styles.iconText]}>
                            {I18n.t('video')}
                        </Text>
                    </View>}
                    {this.state.video.length > 0 && <FlatList
                        bounces={false}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingRight: 30, paddingTop: 10 }}
                        data={this.state.video}
                        horizontal
                        renderItem={this.renderMedia}
                    />}
                </View>
            </View>
        )
    }

    deletePostCall = (index, type) => {
        Picker.hide()
        Platform.OS == 'android' ?
            Alert.alert(
                I18n.t('Alert'),
                I18n.t('deleteMedia'),
                [
                    {
                        text: I18n.t('Yes'),
                        onPress: () => {
                            if (type == 'video') {
                                let video = [...this.state.video]
                                video.splice(index, 1)
                                this.setState({ video })
                            }
                            else {
                                let images = [...this.state.images]
                                images.splice(index, 1)
                                this.setState({ images })
                            }

                        }
                    },
                    {
                        text: I18n.t('No'),
                        onPress: () => { }
                    },
                ],
                { cancelable: false },
            )
            :
            Alert.alert(
                I18n.t('deleteMedia'),
                '',
                [
                    {
                        text: I18n.t('Yes'),
                        onPress: () => {
                            {
                                if (type == 'video') {
                                    let video = [...this.state.video]
                                    video.splice(index, 1)
                                    this.setState({ video })
                                }
                                else {
                                    let images = [...this.state.images]
                                    images.splice(index, 1)
                                    this.setState({ images })
                                }
                            }
                        }
                    },
                    {
                        text: I18n.t('No'),
                        onPress: () => { }
                    },
                ],
                { cancelable: false },
            )
    }

    playButton2 = (item) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    this.props.navigation.navigate('VideoPreview', { response: { media: item }, thumbnail: { uri: item.thumbNailUri.uri }, terminalResult: { id: '1' }, screen: 'timeLineDetail', type: 'video' })
                }
                }
                style={{ position: 'absolute', alignItems: 'center', alignSelf: 'center', justifyContent: 'center', marginTop: 10, height: '100%' }}>
                <Image style={{ width: 40, height: 40, backgroundColor: '#fff', borderRadius: 20, }} resizeMode='cover' source={AppImages.images.play} />
            </TouchableOpacity>
        )
    }

    renderMedia = ({ item, index }) => {
        return (
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                }}
                style={styles.imagesTouchable}
            >
                <Image
                    resizeMode={'cover'}
                    style={styles.imagesStyle}
                    source={{ uri: item.thumbNailUri ? item.thumbNailUri.uri : item.uri }}
                />
                {<TouchableOpacity onPress={() => this.deletePostCall(index, item.mediaType)} activeOpacity={0.7} style={styles.crossButton}>
                    <Entypo color={'#fff'} name="cross" size={24} />
                </TouchableOpacity>}
                {item.thumbNailUri &&
                    this.playButton2(item)
                }

            </TouchableOpacity>
        )
    }

    //submit press
    submitPress = () => {
        Keyboard.dismiss()
        if (!this.nameRef.state.value) {
            alert(I18n.t('location_name_enter'))
        }
        else if (this.nameRef.state.value?.trim().length == 0) {
            alert(I18n.t('location_name_enter'))
        }
        else if (this.nameRef.state.value?.trim().length < 2) {
            alert(I18n.t('locationNameLong'))
        }
        else if (!this.locRef?.state?.value) {
            alert(I18n.t('locationAddress'))
        }
        else if (this.locRef.state?.value?.trim().length == 0) {
            alert(I18n.t('locationAddress'))
        }
        else if (this.locRef.state.value.trim().length < 2) {
            alert(I18n.t('locationAddressLong'))
        }
        else if (this?.phoneRef?.state.value?.length < 12 && this?.phoneRef?.state.value?.length > 0) {
            alert(I18n.t("enter_phone_number_length_alert"));
        }
        else {
            NetInfo.fetch().then(res => {
                if (res.isConnected) {
                    this.socketCall()
                    let imagesKey = []
                    let videoKey = []
                    console.log('this.state.images.concat(this.state.video)', this.state.images.concat(this.state.video));
                    if (this.state.images.concat(this.state.video).length > 0) {
                        this.setState({ loading: true })
                        this.state.images.concat(this.state.video).map((x) => {
                            uploadImageOnS3(x, uuidv4_34(), 'route_post', []).then((res) => {
                                console.log('file uploaded', res);
                                s3bucket.upload(res, (err, data) => {
                                    if (err) {
                                        this.setState({ loading: false })
                                        console.log('error in callback', err);
                                    }
                                    console.log("Respomse URL : ", data.Location);
                                    if (data.Location) {
                                        if (x.type == 'video/mp4') {
                                            uploadImageOnS3(x.thumbNailUri, uuidv4_34(), 'route_post', []).then((res) => {
                                                console.log('file uploaded thumb', res);
                                                s3bucket.upload(res, (err, data2) => {
                                                    if (err) {
                                                        this.setState({ loading: false })
                                                        console.log('error in callback', err);
                                                    }
                                                    console.log('success');
                                                    console.log("Response URL thumbnail : ", data2);
                                                    if (data2.Location) {
                                                        console.log('gdrjkghdhfjkg', data, data2.Location);
                                                        videoKey.push({ url: data.key ? data.key : data.Key, height: x.thumbNailUri.height, width: x.thumbNailUri.width, thumbnail: data2.key ? data2.key : data2.Key })
                                                        if (videoKey.length + imagesKey.length == this.state.images.length + this.state.video.length) {
                                                            this.setState({ loading: false })
                                                            this.props.ManualTimelineCreate(this.nameRef.state.value?.trim(), this.locRef.state.value?.trim(), this.state.userType, this?.phoneRef?.state.value ? this?.phoneRef?.state.value.trim() : '', imagesKey, videoKey, this.zoomLevel, this.props.navigation)
                                                        }
                                                        else {
                                                            console.log('videoKey.length+imagesKey.length==images.length+video.length', videoKey.length + imagesKey.length, this.state.images.length + this.state.video.length);
                                                        }
                                                    }
                                                })
                                            })
                                        }
                                        else {
                                            uploadImageOnS3(x.thumbnail, uuidv4_34(), 'route_post', []).then((res) => {
                                                console.log('file uploaded thumb', res);
                                                s3bucket.upload(res, (err, data2) => {
                                                    if (err) {
                                                        this.setState({ loading: false })
                                                        console.log('error in callback', err);
                                                    }
                                                    console.log("Response URL thumbnail : ", data2);
                                                    if (data2.Location) {
                                                        imagesKey.push({ url: data ? data.key : data.Key, height: x.height, width: x.width, thumbnail: data2.key ? data2.key : data2.Key })
                                                        if (videoKey.length + imagesKey.length == this.state.images.length + this.state.video.length) {
                                                            this.setState({ loading: false })
                                                            this.props.ManualTimelineCreate(this.nameRef.state.value?.trim(), this.locRef.state.value?.trim(), this.state.userType, this?.phoneRef?.state.value ? this?.phoneRef?.state.value.trim() : '', imagesKey, videoKey, this.zoomLevel, this.props.navigation)
                                                        }
                                                        else {
                                                            console.log('videoKey.length+imagesKey.length==images.length+video.length', videoKey.length + imagesKey.length, this.state.images.length + this.state.video.length);
                                                        }
                                                    }
                                                })
                                            })
                                        }
                                        if (videoKey.length + imagesKey.length == this.state.images.length + this.state.video.length) {
                                            this.setState({ loading: false })
                                            this.props.ManualTimelineCreate(this.nameRef.state.value?.trim(), this.locRef.state.value?.trim(), this.state.userType, this?.phoneRef?.state.value ? this?.phoneRef?.state.value.trim() : '', imagesKey, videoKey, this.zoomLevel, this.props.navigation)
                                        }
                                    }
                                });
                            })
                        })
                    }
                    else {
                        this.setState({ loading: false })
                        this.props.ManualTimelineCreate(this.nameRef.state.value?.trim(), this.locRef.state.value?.trim(), this.state.userType, this?.phoneRef?.state.value ? this?.phoneRef?.state.value.trim() : '', this.state.images, this.state.video, this.zoomLevel, this.props.navigation)
                    }

                }
                else {
                    alert(I18n.t('please_check_your_internet_connection'))
                }
            }).catch((e) => {

            })
        }
    }

    onImageCall = (type) => {
        this.setState({ type })
        Picker.hide();
        let options;
        type == 'video' ?
            options = {
                title: 'Select Video',
                takePhotoButtonTitle: 'Take Video...',
                storageOptions: {
                    skipBackup: true,
                    path: 'video',
                },
                mediaType: "video",
                durationLimit: 15,
                quality: 0.5,
                allowsEditing: true
            }
            :
            options = {
                title: 'Select Image',
                storageOptions: {
                    skipBackup: true,
                    path: 'images',
                },
                mediaType: "photo",

                quality: 0.5,
                allowsEditing: true
            }

        if (Platform.OS == 'ios') {
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
                if (result == 'granted') {

                    request(PERMISSIONS.IOS.PHOTO_LIBRARY).then((result) => {
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
                        if (result == 'granted' || result == 'limited') {
                            ActionSheetIOS.showActionSheetWithOptions({
                                options: [I18n.t('Cancel'), I18n.t("Camera"), I18n.t('Image Gallery')],
                                cancelButtonIndex: 0
                            }, (buttonIndex) => {
                                if (buttonIndex == 1) {
                                    launchCamera(options, (res) => {
                                        if (res.didCancel) {
                                        } else if (res.errorCode) {
                                        } else if (res.errorMessage) {
                                        }
                                        else {
                                            let response = res.assets[0]
                                            response.path = response.uri
                                            console.log('rerfdsdfdffd', response);
                                            let images = [...this.state.images]
                                            let videos = [...this.state.video]
                                            if (type == 'video') {
                                                if (Platform.OS == 'android') {
                                                    let splitPath = response.uri.split('/')
                                                    console.log('splitPath', splitPath[splitPath.length - 1]);
                                                    response.filename = splitPath[splitPath.length - 1]
                                                    RNThumbnail.get(response.uri).then((result) => {
                                                        let thumbnail = { uri: result.path, type: 'image/jpeg', name: 'photo.jpg', height: result.height, width: result.width };
                                                        videos.push({ thumbNailUri: thumbnail, uri: response.uri, mediaType: type, type: 'video/mp4', name: response.filename })
                                                        this.setState({ video: videos })
                                                    }).catch((e) => {
                                                    })
                                                }
                                                else {
                                                    RNThumbnail.get(response.uri).then((result) => {
                                                        let thumbnail = { uri: result.path, type: 'image/jpeg', name: 'photo.jpg', height: result.height, width: result.width };
                                                        videos.push({ thumbNailUri: thumbnail, uri: response.uri, mediaType: type, type: 'video/mp4', name: response.fileName, height: response.height, width: response.width })
                                                        this.setState({ video: videos })
                                                    })
                                                }
                                            }
                                            else {
                                                if (Platform.OS == 'android') {
                                                    let splitPath = response.uri.split('/')
                                                    console.log('splitPath', splitPath[splitPath.length - 1]);
                                                    response.filename = splitPath[splitPath.length - 1]
                                                }

                                                ImageResizer.createResizedImage(response.uri, 100, 100, "JPEG", 0.2, 0, null).then((thumbnailData) => {
                                                    console.log('thumbnailDatathumbnailData', thumbnailData);
                                                    let f = {
                                                        uri: thumbnailData.path,
                                                        name: thumbnailData.name,
                                                        type: 'image.jpg'
                                                    }

                                                    images.push({ thumbnail: f, uri: response.uri, mediaType: type, type: 'image/png', name: Platform.OS == 'android' ? response.filename : response.fileName, height: response.height, width: response.width })
                                                    this.setState({ images: images })
                                                }).catch((e) => {
                                                })
                                            }
                                        }
                                    })
                                }
                                else if (buttonIndex == 2) {
                                    launchImageLibrary(options, (res) => {
                                        if (res.didCancel) {
                                        } else if (res.errorMessage) {
                                        } else if (res.errorCode) {
                                        }
                                        else {
                                            let response = res.assets[0]
                                            response.path = response.uri
                                            console.log('rerfdsdfdffd', response);
                                            let images = [...this.state.images]
                                            let videos = [...this.state.video]
                                            if (type == 'video') {
                                                if (Platform.OS == 'android') {
                                                    let splitPath = response.uri.split('/')
                                                    console.log('splitPath', splitPath[splitPath.length - 1]);
                                                    response.filename = splitPath[splitPath.length - 1]
                                                    RNThumbnail.get(response.uri).then((result) => {
                                                        let thumbnail = { uri: result.path, type: 'image/jpeg', name: 'photo.jpg', height: result.height, width: result.width };

                                                        videos.push({ thumbNailUri: thumbnail, uri: response.uri, mediaType: type, type: 'video/mp4', name: response.filename })
                                                        this.setState({ video: videos })
                                                    }).catch((e) => {
                                                    })
                                                }
                                                else {
                                                    RNThumbnail.get(response.uri).then((result) => {
                                                        let thumbnail = { uri: result.path, type: 'image/jpeg', name: 'photo.jpg', height: result.height, width: result.width };

                                                        videos.push({ thumbNailUri: thumbnail, uri: response.uri, mediaType: type, type: 'video/mp4', name: response.fileName, height: response.height, width: response.width })
                                                        this.setState({ video: videos })
                                                    })
                                                }
                                            }
                                            else {
                                                if (Platform.OS == 'android') {
                                                    let splitPath = response.uri.split('/')
                                                    console.log('splitPath', splitPath[splitPath.length - 1]);
                                                    response.filename = splitPath[splitPath.length - 1]
                                                }
                                                ImageResizer.createResizedImage(response.uri, 100, 100, "JPEG", 0.2, 0, null).then((thumbnailData) => {
                                                    console.log('thumbnailDatathumbnailData', thumbnailData);
                                                    let f = {
                                                        uri: thumbnailData.path,
                                                        name: thumbnailData.name,
                                                        type: 'image.jpg'
                                                    }
                                                    images.push({ thumbnail: f, uri: response.uri, mediaType: type, type: 'image/png', name: Platform.OS == 'android' ? response.filename : response.fileName, height: response.height, width: response.width })
                                                    this.setState({ images: images })
                                                }).catch((e) => {
                                                })
                                            }
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
        else {
            request(PERMISSIONS.ANDROID.CAMERA).then((result) => {
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
                if (result == 'granted') {
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
                        if (result == 'granted') {
                            this.ActionSheetPicker.show()
                        }
                    })
                }
            })
        }
    }

    androidActionSheetPressPicker = (buttonIndex) => {
        let type = this.state.type
        Picker.hide();
        let options;
        type == 'video' ?
            options = {
                title: 'Select Image',
                multiple: false,
                maxFiles: 1,
                durationLimit: 15,
                storageOptions: {
                    skipBackup: true,
                    path: 'images',
                },
                mediaType: "video",
                // mediaType: 'any',

                compressImageQuality: 0.7,
                allowsEditing: false
            }
            :
            options = {
                title: 'Select Image',
                storageOptions: {
                    skipBackup: true,
                    path: 'images',
                },
                mediaType: "photo",

                quality: 0.5,
                allowsEditing: true
            }
        if (buttonIndex == 1) {
            launchCamera(options, (res) => {

                if (res.didCancel) {
                } else if (res.errorCode) {
                } else if (res.errorMessage) {
                }
                else {
                    let response = res.assets[0]
                    response.path = response.uri
                    console.log('rerfdsdfdffd', response);
                    let images = [...this.state.images]
                    let videos = [...this.state.video]
                    if (type == 'video') {
                        if (Platform.OS == 'android') {
                            let splitPath = response.uri.split('/')
                            console.log('splitPath', splitPath[splitPath.length - 1]);
                            response.filename = splitPath[splitPath.length - 1]
                            RNThumbnail.get(response.uri).then((result) => {
                                let thumbnail = { uri: result.path, type: 'image/jpeg', name: 'photo.jpg', height: result.height, width: result.width };

                                videos.push({ thumbNailUri: thumbnail, uri: response.uri, mediaType: type, type: 'video/mp4', name: response.filename })
                                this.setState({ video: videos })
                            }).catch((e) => {

                            })
                        }
                        else {
                            RNThumbnail.get(response.uri).then((result) => {
                                let thumbnail = { uri: result.path, type: 'image/jpeg', name: 'photo.jpg', height: result.height, width: result.width };

                                videos.push({ thumbNailUri: thumbnail, uri: response.uri, mediaType: type, type: 'video/mp4', name: response.fileName, height: response.height, width: response.width })
                                this.setState({ video: videos })
                            })
                        }

                    }
                    else {
                        if (Platform.OS == 'android') {
                            let splitPath = response.uri.split('/')
                            console.log('splitPath', splitPath[splitPath.length - 1]);
                            response.filename = splitPath[splitPath.length - 1]
                        }

                        ImageResizer.createResizedImage(response.uri, 100, 100, "JPEG", 0.2, 0, null).then((thumbnailData) => {
                            console.log('thumbnailDatathumbnailData', thumbnailData);
                            let f = {
                                uri: thumbnailData.path,
                                name: thumbnailData.name,
                                type: 'image.jpg'
                            }

                            images.push({ thumbnail: f, uri: response.uri, mediaType: type, type: 'image/png', name: Platform.OS == 'android' ? response.filename : response.fileName, height: response.height, width: response.width })
                            this.setState({ images: images })
                        }).catch((e) => {

                        })
                    }
                }
            })
        }
        else if (buttonIndex == 2) {

            type == 'video' ?
                ImageCropPicker.openPicker(options).then((res) => {

                    let response = res
                    response.path = res.path
                    response.uri = res.path
                    console.log('rerfdsdfdffd', response);
                    let images = [...this.state.images]
                    let videos = [...this.state.video]
                    console.log('djkajhdjdsjdsds', type);
                    if (type == 'video') {
                        if (Platform.OS == 'android') {
                            let splitPath = response.uri.split('/')
                            console.log('splitPath', splitPath[splitPath.length - 1]);
                            response.filename = splitPath[splitPath.length - 1]
                            RNThumbnail?.get(response.uri).then((result) => {
                                console.log('resultresultresult', result);
                                let thumbnail = { uri: result.path, type: 'image/jpeg', name: 'photo.jpg', height: result.height, width: result.width };

                                videos.push({ thumbNailUri: thumbnail, uri: response.uri, mediaType: type, type: 'video/mp4', name: response.filename })
                                this.setState({ video: videos })
                            }).catch((e) => {
                                console.log('eeee', e);
                            })
                        }
                        else {
                            RNThumbnail.get(response.uri).then((result) => {
                                let thumbnail = { uri: result.path, type: 'image/jpeg', name: 'photo.jpg', height: result.height, width: result.width };

                                videos.push({ thumbNailUri: thumbnail, uri: response.uri, mediaType: type, type: 'video/mp4', name: response.fileName, height: response.height, width: response.width })
                                this.setState({ video: videos })
                            })
                        }

                    }
                    else {
                        if (Platform.OS == 'android') {
                            let splitPath = response.uri.split('/')
                            console.log('splitPath', splitPath[splitPath.length - 1]);
                            response.filename = splitPath[splitPath.length - 1]
                        }

                        ImageResizer.createResizedImage(response.uri, 100, 100, "JPEG", 0.2, 0, null).then((thumbnailData) => {
                            console.log('thumbnailDatathumbnailData', thumbnailData);
                            let f = {
                                uri: thumbnailData.path,
                                name: thumbnailData.name,
                                type: 'image.jpg'
                            }

                            images.push({ thumbnail: f, uri: response.uri, mediaType: type, type: 'image/png', name: Platform.OS == 'android' ? response.filename : response.fileName, height: response.height, width: response.width })
                            this.setState({ images: images })
                        }).catch((e) => {

                        })
                    }
                })

                :
                launchImageLibrary(options, (res) => {

                    if (res.didCancel) {
                    } else if (res.errorCode) {
                    } else if (res.errorMessage) {
                    }
                    else {
                        let response = res.assets[0]
                        response.path = response.uri
                        console.log('rerfdsdfdffd', response);
                        let images = [...this.state.images]
                        let videos = [...this.state.video]
                        console.log('djkajhdjdsjdsds', type);
                        if (type == 'video') {
                            if (Platform.OS == 'android') {
                                let splitPath = response.uri.split('/')
                                console.log('splitPath', splitPath[splitPath.length - 1]);
                                response.filename = splitPath[splitPath.length - 1]
                                RNThumbnail?.get(response.uri).then((result) => {
                                    console.log('resultresultresult', result);
                                    let thumbnail = { uri: result.path, type: 'image/jpeg', name: 'photo.jpg', height: result.height, width: result.width };

                                    videos.push({ thumbNailUri: thumbnail, uri: response.uri, mediaType: type, type: 'video/mp4', name: response.filename })
                                    this.setState({ video: videos })
                                }).catch((e) => {
                                    console.log('eeee', e);
                                })
                            }
                            else {
                                RNThumbnail.get(response.uri).then((result) => {
                                    let thumbnail = { uri: result.path, type: 'image/jpeg', name: 'photo.jpg', height: result.height, width: result.width };

                                    videos.push({ thumbNailUri: thumbnail, uri: response.uri, mediaType: type, type: 'video/mp4', name: response.fileName, height: response.height, width: response.width })
                                    this.setState({ video: videos })
                                })
                            }

                        }
                        else {
                            if (Platform.OS == 'android') {
                                let splitPath = response.uri.split('/')
                                console.log('splitPath', splitPath[splitPath.length - 1]);
                                response.filename = splitPath[splitPath.length - 1]
                            }

                            ImageResizer.createResizedImage(response.uri, 100, 100, "JPEG", 0.2, 0, null).then((thumbnailData) => {
                                console.log('thumbnailDatathumbnailData', thumbnailData);
                                let f = {
                                    uri: thumbnailData.path,
                                    name: thumbnailData.name,
                                    type: 'image.jpg'
                                }

                                images.push({ thumbnail: f, uri: response.uri, mediaType: type, type: 'image/png', name: Platform.OS == 'android' ? response.filename : response.fileName, height: response.height, width: response.width })
                                this.setState({ images: images })
                            }).catch((e) => {

                            })
                        }
                    }
                }, (err) => {
                    console.log('err', err);
                })
        }

    }


    userTypeButton = () => {
        Picker.init({
            selectedValue: [this.state.userType],
            pickerData: this.state.terminalType,
            pickerConfirmBtnText: I18n.t("Confirm"),
            pickerCancelBtnText: I18n.t("Cancel"),
            pickerTitleText: I18n.t("Please_Select"),
            pickerTextEllipsisLen: 100,
            onPickerConfirm: (data, index) => {
                let selectIndex = Number(index) + Number(1);
                this.setState({ userType: data.toString(), userTypeSelectedIndex: selectIndex });
            },
            onPickerCancel: data => {
                Picker.hide();
            },
            onPickerSelect: data => {
                console.log(data);
            }
        });
        Keyboard.dismiss()
        setTimeout(() => {
            Picker.show();
        }, 500);
    };

    render() {
        return (
            <>
                {
                    Platform.OS == 'android' ?
                        <Header
                            headerTitle={I18n.t('Timeline')}
                            leftImageSource={AppImages.images.back}
                            leftbackbtnPress={() => {
                                Alert.alert(
                                    "Alert",
                                    I18n.t('timelineCancel'),

                                    [
                                        {
                                            text: I18n.t('Yes'), onPress: () => {
                                                this.props.navigation.pop(2)
                                            }
                                        },
                                        {
                                            text: I18n.t('No')
                                        },
                                    ]
                                )
                                Picker.hide()
                            }}

                        />
                        :
                        <View style={{ flex: 0.13 }}>
                            <Header
                                headerTitle={I18n.t('Timeline')}
                                leftImageSource={AppImages.images.back}
                                leftbackbtnPress={() => {
                                    Alert.alert(
                                        "Alert",
                                        I18n.t('timelineCancel'),

                                        [
                                            {
                                                text: I18n.t('Yes'), onPress: () => {
                                                    this.props.navigation.pop(2)
                                                }
                                            },
                                            {
                                                text: I18n.t('No')
                                            },
                                        ]
                                    )
                                    Picker.hide()
                                }}

                            />
                        </View>}
                <Loader loading={this.props.homeState.onLoad || this.state.loading} />
                <ScrollView
                    style={{ flex: 0.87 }}
                    keyboardShouldPersistTaps='handled'
                    onScroll={() => {
                        Picker.hide()
                        // Keyboard.dismiss()
                    }} keyboardDismissMode='on-drag'>


                    {/* {alert(this.state.zoom)} */}
                    <MakeRoute
                        ManualScreen
                        isDetail={false}
                        maxZoomLevel={22}
                        minZoomLevel={5}
                        ref={routeRef => this.routeRef = routeRef}
                        initialRoute={{
                            latitude: this.params?.coordinates !== null ?
                                this.params?.coordinates[0].latitude : Platform.OS == 'ios' ? 0 : null,
                            longitude: this.params?.coordinates !== null ?
                                this.params?.coordinates[0].longitude : Platform.OS == 'ios' ? 0 : null
                        }} coordinate={this.params?.coordinates ? this.params?.coordinates : null} />
                    <View style={{ marginHorizontal: '5%', marginTop: '2%', marginBottom: '2%' }}>
                        <AnimatedTextInput
                            ref={(nameRef) => this.nameRef = nameRef}
                            label={I18n.t('Name')}
                            borderColor={'transparent'}
                            maxLength={50}

                        />
                        <AnimatedTextInput
                            isLocation={true}
                            ref={(nameRef) => this.locRef = nameRef}
                            containerStyle={{ marginTop: '2%' }}
                            label={I18n.t("Location Address")}
                            borderColor={'transparent'}
                            maxLength={255}

                        />


                        {this.state.addedPress > 0 &&

                            <View>
                                <AnimatedTextInput
                                    ref={(nameRef) => this.categoryRef = nameRef}
                                    value={this.state.userType}
                                    editable={false}
                                    containerStyle={{ marginTop: '2%' }}
                                    label={I18n.t('Category')}
                                    borderColor={'transparent'}
                                    sourceRight={AppImages.images.dropdownArrow}
                                />
                                <TouchableOpacity activeOpacity={1} style={{ position: 'absolute', height: '75%', bottom: 0, width: '100%', }} onPress={this.userTypeButton}>
                                </TouchableOpacity>
                            </View>
                        }
                        {this.state.addedPress > 1 &&
                            <AnimatedTextInput
                                isPhoneNumber={true}
                                ref={(nameRef) => this.phoneRef = nameRef}
                                containerStyle={{ marginTop: '2%' }}
                                keyboardType={'numeric'}
                                label={I18n.t('Phone Number')}
                                borderColor={'transparent'}
                                maxLength={19}
                            />
                        }

                    </View>

                    {this.state.addedPress < 2 && <View style={{ alignSelf: 'flex-end', marginHorizontal: '5%' }}>
                        <TouchableOpacity onPress={() => {
                            Picker.hide();
                            this.setState({ addedPress: this.state.addedPress + 1, userType: this.state.userType ? this.state.userType : I18n.t("Warehouse") })
                        }} style={[{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end' }]}>
                            <Image style={{ width: 20, height: 20 }} resizeMode='contain' source={AppImages.images.addClient} />
                            <Text style={{
                                fontFamily: AppFontFamily.fontFamily.regular,
                                fontSize: 20,
                                color: "#29a2e1",
                                fontWeight: 'normal',
                                textAlign: 'center',
                                marginLeft: '2%'
                            }}>{I18n.t('Add')}</Text>
                        </TouchableOpacity>
                    </View>}

                    {this.mediaView()}

                    <View style={styles.buttonContainer} >
                        {<Button
                            Text={I18n.t('Submit')}
                            onPress={() => {
                                this.submitPress()
                            }}
                            customStyles={{ container: styles.button }}
                        />}
                    </View>
                </ScrollView>
                <ActionSheet
                    options={[I18n.t('Cancel'), I18n.t("Camera"), I18n.t('Image Gallery')]}
                    ref={o => this.ActionSheetPicker = o}
                    cancelButtonIndex={0}
                    // destructiveButtonIndex={2}
                    onPress={(index) => { this.androidActionSheetPressPicker(index) }}
                />
            </>
        );
    }
}
function mapStateToProps(state) {
    return {
        homeState: state.RoutePostData,

    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ ManualTimelineCreate }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ManualTimeline)