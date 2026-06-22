import React, { Component } from 'react';
import { View, TextInput, ScrollView, TouchableOpacity, Platform, KeyboardAvoidingView, Image, Modal, BackHandler, ActionSheetIOS } from 'react-native';
import { Header, Loader, } from './../../Components';
import { AppImages, Dimensions } from './../../Themes';
import VideoPlayer from 'react-native-video-player';
import VideoPlayerControl from 'react-native-video-controls';
import { videoUploadAction } from '../../Redux/actions/TerminalDetail';
import { connect } from 'react-redux';
import deviceInfo from 'react-native-device-info';
import { addTimeLinePost } from '../../Redux/actions/timeLineAction'
import I18n from 'react-native-i18n';
import { imageBaseUrl } from '../../Config';
import Video from 'react-native-video';
import { AFLogEvent, s3bucket, uploadImageOnS3, uuidv4_34 } from '../../Config/aws';
import moment from 'moment';
import { RNFFmpeg } from 'react-native-ffmpeg';
import RNFetchBlob from 'rn-fetch-blob';
import ActionSheet from 'react-native-actionsheet';

const RNFS = require('react-native-fs');
let _this
class VideoPreview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: false,
            message: '',
            videoLoad: false,
            modalVisible: false,
            disabled: false,
            paused: false,
            videoPlayed: false
        }
        this.back = null;
        _this = this
    }

    downloadImage = (url) => {
        console.log(url, 'sadasdsaddsadsa');
        let name = url.split('/')
        let file = {
            uri: url,
            name: name[name.length - 1],
            type: "video/mp4",
        }
        uploadImageOnS3(file, uuidv4_34(), 'post', []).then((res) => {
            console.log('file uploaded', res);
            s3bucket.upload(res, (err, data) => {
                if (err) {
                    this.setState({ loader: false })
                    console.log('error in callback', err);
                }
                console.log('success');
                console.log("Respomse URL : ", data);
                if (data.Location) {
                    console.log('url', data.Location)
                    const { fs } = RNFetchBlob;
                    const tmpFile = RNFetchBlob.fs.dirs.DocumentDir + '/' + uuidv4_34() + ".mp4"
                    RNFetchBlob.config({
                        IOSBackgroundTask: true,
                        fileCache: false,
                        timeout: 2000,
                        trusty: true,
                        path: tmpFile,
                        addAndroidDownloads: {
                            useDownloadManager: true,
                            notification: true,
                            path: fs.dirs.DownloadDir + '/' + uuidv4_34() + '.mp4',
                        }
                    }).fetch("GET", data.Location).then((res) => {
                        if (Platform.OS == 'ios') {
                            console.log('res.data', res.data);
                            this.setState({ loader: false })
                            RNFetchBlob.ios.openDocument(res.data);
                        }
                        else {
                            this.setState({ loader: false })
                        }
                    }
                    ).catch((e) => {
                        console.log(e);
                    })
                }
            });
        })

    }
    actionSheetModalPress = (item) => {
        this.setState({ selectedImage: item, isScrolling: true })
        Platform.OS == 'android' ?
            this.ActionSheet3?.show()
            :
            ActionSheetIOS.showActionSheetWithOptions({
                options: [I18n.t('Cancel'), I18n.t('saveToPhone')],
                cancelButtonIndex: 0
            }, (buttonIndex) => {
                if (buttonIndex == 1) {
                    this.mergeFrameWithVideo(this.props.route.params.response.media)
                }
            })
    }

    mergeFrameWithVideo = async (url) => {
        this.setState({ loader: true })
        console.log('mergeFrameWithVideo', url);
        let nameArr = url.split('/')
        const video = imageBaseUrl + url
        // const frame = "https://s3.us-east-2.amazonaws.com/fr8.ai-website-dev-content/panel/defaultImages/logo1.png"
        const frame = "https://www.fr8.ai/static/media/logo.06817180.png"
        const name = new Date().getTime()
        const date = moment().format('DD-MM-YY')
        const saveFilePath = RNFetchBlob.fs.dirs.DocumentDir // For Android
        const frameID = uuidv4_34() // react-native-uuid OR use any type of random_numbers
        await RNFFmpeg.executeAsync(
            '-i ' +
            video +
            ' -i ' +
            frame +
            ' -filter_complex  overlay=main_w-overlay_w-40:40 ' +
            saveFilePath + '/' + name + '-' + date + '-' + frameID + '.mp4', (execution) => {
                console.log(execution, 'ddsdsdsaadsdsadasdasdsa', saveFilePath + '/' + name + '-' + date + '-' + frameID + '.mp4');
                this.downloadImage(saveFilePath + '/' + name + '-' + date + '-' + frameID + '.mp4')
            }).catch((e) => {
                this.setState({ loader: false })
            })
    }

    hardwareBackPress = () => {
        this.back = BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.goBack()
            return true
        })
    }

    componentWillUnmount() {
        this.back.remove()
    }
    componentDidMount() {
        AFLogEvent("VideoPreview", { screen: 'VideoPreview' })
        this.hardwareBackPress()
    }
    androidActionSheetPress3 = (buttonIndex) => {
        if (buttonIndex == 1) {
            this.mergeFrameWithVideo(this.props.route.params.response.media)
        }
    }
    render() {
        const { route, navigation } = this.props
        if (Platform.OS == 'ios') {
            if (this.props.route.params.type === 'image') {
                return (
                    <KeyboardAvoidingView
                        behavior='padding'
                        style={{ flex: 1 }} >
                        {Platform.OS == 'android' ?
                            <Header
                                rightVector={route.params.screen == "timeLineDetail" && 'ellipsis-v'}
                                rightBackBtnPress={() => { route.params.screen == "timeLineDetail" && _this.actionSheetModalPress() }}
                                headerTitle={I18n.t('Preview')}
                                leftImageSource={AppImages.images.back} leftbackbtnPress={() => navigation.goBack()} />
                            :
                            <View style={{ flex: 0.13 }}>
                                <Header
                                    rightVector={route.params.screen == "timeLineDetail" && 'ellipsis-v'}
                                    rightBackBtnPress={() => { route.params.screen == "timeLineDetail" && _this.actionSheetModalPress() }}
                                    headerTitle={I18n.t('Preview')}
                                    leftImageSource={AppImages.images.back} leftbackbtnPress={() => navigation.goBack()} />
                            </View>}
                        <Loader loading={this.props.videoUploadState.onLoad || this.state.loader} />
                        <ScrollView
                            style={{ backgroundColor: 'black', height: Dimensions.deviceHeight }}>
                            <View style={{ flex: 1, }}>
                                <View style={{ width: Dimensions.deviceWidth, height: Dimensions.deviceHeight - 250, justifyContent: 'center' }}>
                                    <Image
                                        style={{ width: Dimensions.deviceWidth, height: deviceInfo.hasNotch() ? 650 : 600 }}
                                        source={this.props.route.params.response}
                                        resizeMode='contain'
                                    ></Image>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', margin: 10, marginTop: deviceInfo.hasNotch() ? 50 : 110 }}>
                                    {this.props.route.params.screen !== 'global' && <TextInput
                                        maxLength={1000}
                                        style={{ width: '80%', minHeight: 48, maxHeight: 70, padding: 10, marginTop: 5, backgroundColor: 'white', borderRadius: 10, paddingTop: 10, paddingLeft: 20 }}
                                        placeholder={this.props.route.params.screen == 'timeLineDetail' || this.props.route.params.screen == 'global' ? I18n.t('enterDescription') : I18n.t('enterMessage')}
                                        keyboardType="ascii-capable"
                                        returnKeyType={"done"}
                                        onChangeText={(message) => this.setState({ message })}
                                        multiline={true}
                                    />}
                                    <TouchableOpacity onPress={() => {
                                        if (this.props.route.params.screen == 'timeLineDetail' || this.props.route.params.screen == 'global') {
                                            if (this.state.message.length > 1000) {
                                                alert(I18n.t('descriptionMax'))
                                            }
                                            else {
                                                if (this.props.route.params.screen == 'global') {
                                                    const source = { uri: this.props.route.params.response.uri };
                                                    const { screen } = this.props.route.params
                                                    this.props.navigation.navigate('TimeLinePostCreate', {
                                                        screen: 'global',
                                                        item: { image: source }, interChange: [], equipment: [], video: [], receiptPrivate: 0, mediaImages: [
                                                            {
                                                                'media': source,
                                                                'thumbnail': '',
                                                                receipt_private: '0',
                                                            }
                                                        ]
                                                    })
                                                    this.setState({ message: '' })
                                                }
                                                else {
                                                    const timeLineId = this.props.route.params.terminalResult.id ? this.props.route.params.terminalResult.id : this.props.route.params.terminalResult._id
                                                    this.props.addTimeLinePost(timeLineId, this.state.message, this.props.navigation)
                                                    this.setState({ message: '' })
                                                }
                                            }
                                        }
                                        else {
                                            if (this.state.message.length > 1000) {
                                                alert(I18n.t('messageMax'))
                                            } else {
                                                const terminalId = this.props.route.params.terminalResult.id ? this.props.route.params.terminalResult.id : this.props.route.params.terminalResult._id
                                                const thumbNail = this.props.route.params.thumbnail
                                                const source = { uri: this.props.route.params.response.uri };
                                                const { screen } = this.props.route.params
                                                this.props.videoUploadAction(terminalId, source, '', this.state.message, this.props.navigation, screen)
                                                this.setState({ message: '' })
                                            }
                                        }
                                    }}>
                                        <View style={{ backgroundColor: '#29a2e1', width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', }}>
                                            <Image resizeMode="cover" style={{ width: 25, height: 25 }} source={require('../../Images/SendClient.png')} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                )
            } else {
                if (this.props.route.params.screen == 'timeLineDetail') {
                    return (
                        <View style={{ flex: 1 }}
                        >
                            {Platform.OS == 'android' ?
                                <Header
                                    rightVector={route.params.screen == "timeLineDetail" && 'ellipsis-v'}
                                    rightBackBtnPress={() => { route.params.screen == "timeLineDetail" && _this.actionSheetModalPress() }}


                                    headerTitle={I18n.t('Preview')}
                                    leftImageSource={AppImages.images.back} leftbackbtnPress={() => navigation.goBack()} />
                                :
                                <View style={{ flex: 0.13 }}>
                                    <Header
                                        rightVector={route.params.screen == "timeLineDetail" && 'ellipsis-v'}
                                        rightBackBtnPress={() => { route.params.screen == "timeLineDetail" && _this.actionSheetModalPress() }}
                                        headerTitle={I18n.t('Preview')}
                                        leftImageSource={AppImages.images.back} leftbackbtnPress={() => navigation.goBack()} />
                                </View>}
                            <Loader loading={this.state.videoLoad || this.state.loader} />
                            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'black', paddingVertical: 30 }}>
                                <View style={{ width: Dimensions.deviceWidth, height: Dimensions.deviceHeight - 250, justifyContent: 'center' }}>
                                    {this.props.route.params.thumbnail == "manual" ?
                                        <>
                                            {!this.state.videoPlayed ? <TouchableOpacity
                                                style={{ alignItems: "center", justifyContent: "center" }}
                                                activeOpacity={1}
                                                onPress={() => {
                                                    this.setState({ videoLoad: true, videoPlayed: true }), setTimeout(() => {
                                                        this.setState({ videoLoad: false })
                                                    }, 500)
                                                }}>
                                                <Video
                                                    style={{ width: Dimensions.deviceWidth, height: deviceInfo.hasNotch() ? 700 : 600, maxHeight: Dimensions.deviceHeight - 200, marginTop: 30, }}
                                                    onLoad={() => {
                                                        setTimeout(() => {
                                                            this.setState({ paused: true })
                                                        }, 100);
                                                    }}
                                                    paused={this.state.paused}
                                                    source={{ uri: imageBaseUrl + this.props.route.params.response.media }}
                                                />
                                                <Image source={
                                                    AppImages.images.play
                                                }
                                                    style={{ position: "absolute", height: 50, overflow: 'hidden', backgroundColor: '#fff', borderRadius: 25, width: 50, alignSelf: "center", top: "50%" }}
                                                />
                                            </TouchableOpacity> :
                                                <VideoPlayer
                                                    fullScreenOnLongPress={true}
                                                    autoplay={true}
                                                    // paused
                                                    disableSeek
                                                    onStart={() => {
                                                        this.setState({ videoLoad: true }), setTimeout(() => {
                                                            this.setState({ videoLoad: false })
                                                        }, 500)
                                                    }}
                                                    resizeMode='contain'
                                                    style={{ width: Dimensions.deviceWidth, height: deviceInfo.hasNotch() ? 700 : 600, maxHeight: Dimensions.deviceHeight - 200 }}
                                                    thumbnail={this.props.route.params.thumbnail ? { uri: this.props.route.params.thumbnail?.uri ? this.props.route.params.thumbnail.uri : imageBaseUrl + this.props.route.params.thumbnail } : AppImages.images.videoDummy}
                                                    video={{ uri: this.props.route.params.response.media?.uri ? this.props.route.params.response.media.uri : imageBaseUrl + this.props.route.params.response.media }}
                                                    pauseOnPress={true}
                                                    ref={r => this.player = r}
                                                />}
                                        </>
                                        :
                                        <VideoPlayer
                                            fullScreenOnLongPress={true}
                                            // paused
                                            disableSeek
                                            onStart={() => {
                                                this.setState({ videoLoad: true }), setTimeout(() => {
                                                    this.setState({ videoLoad: false })
                                                }, 500)
                                            }}
                                            resizeMode='contain'
                                            style={{ width: Dimensions.deviceWidth, height: deviceInfo.hasNotch() ? 700 : 600, maxHeight: Dimensions.deviceHeight - 200 }}
                                            thumbnail={this.props.route.params.thumbnail ? { uri: this.props.route.params.thumbnail?.uri ? this.props.route.params.thumbnail.uri : imageBaseUrl + this.props.route.params.thumbnail } : AppImages.images.videoDummy}
                                            video={{ uri: this.props.route.params.response.media?.uri ? this.props.route.params.response.media.uri : imageBaseUrl + this.props.route.params.response.media }}
                                            pauseOnPress={true}
                                            ref={r => this.player = r}
                                        />
                                    }
                                </View>
                            </View>
                        </View>
                    )
                }
                else {
                    return (
                        <KeyboardAvoidingView
                            behavior='padding'
                            style={{ flex: 1 }}
                        >
                            {Platform.OS == 'android' ?
                                <Header
                                    rightVector={route.params.screen == "timeLineDetail" && 'ellipsis-v'}
                                    rightBackBtnPress={() => { route.params.screen == "timeLineDetail" && _this.actionSheetModalPress() }}
                                    headerTitle={I18n.t('Preview')}
                                    leftImageSource={AppImages.images.back} leftbackbtnPress={() => navigation.goBack()} />
                                :
                                <View style={{ flex: 0.13 }}>
                                    <Header
                                        rightVector={route.params.screen == "timeLineDetail" && 'ellipsis-v'}
                                        rightBackBtnPress={() => { route.params.screen == "timeLineDetail" && _this.actionSheetModalPress() }}
                                        headerTitle={I18n.t('Preview')}
                                        leftImageSource={AppImages.images.back} leftbackbtnPress={() => navigation.goBack()} />
                                </View>}
                            <Loader loading={this.props.videoUploadState.onLoad || this.state.loader} />
                            <ScrollView
                                style={{ backgroundColor: 'black', height: Dimensions.deviceHeight }}>
                                <View style={{ flex: 1, }}>
                                    <View style={{ width: Dimensions.deviceWidth, height: Dimensions.deviceHeight - 250, justifyContent: 'center' }}>
                                        <VideoPlayer
                                            fullScreenOnLongPress={true}
                                            resizeMode='contain'
                                            style={{ width: Dimensions.deviceWidth, height: deviceInfo.hasNotch() ? 700 : 600 }}
                                            thumbnail={this.props.route.params.thumbnail ? { uri: this.props.route.params.thumbnail.uri } : AppImages.images.videoDummy}
                                            video={{ uri: this.props.route.params.response.uri }}
                                            ref={r => this.player = r}
                                        />
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', margin: 10, marginTop: deviceInfo.hasNotch() ? 50 : 110 }}>
                                        {this.props.route.params.screen !== 'global' && <TextInput
                                            maxLength={1000}
                                            style={{ width: '80%', minHeight: 48, maxHeight: 70, padding: 10, marginTop: 5, backgroundColor: 'white', borderRadius: 10, paddingTop: 10, paddingLeft: 20 }}
                                            placeholder={this.props.route.params.screen == 'global' ? I18n.t('enterDescription') : I18n.t('enterMessage')}
                                            keyboardType="ascii-capable"
                                            returnKeyType={"done"}
                                            onChangeText={(message) => this.setState({ message })}
                                            multiline={true}
                                        />}
                                        <TouchableOpacity onPress={() => {
                                            if (this.state.message.length > 1000) {
                                                this.props.route.params.screen == 'global' ?
                                                    alert(I18n.t('descriptionMax'))
                                                    :
                                                    alert(I18n.t('messageMax'))
                                            } else {
                                                if (this.props.route.params.screen == 'global') {
                                                    const thumbNail = this.props.route.params.thumbnail
                                                    const source = { uri: this.props.route.params.response.uri };
                                                    const { screen } = this.props.route.params
                                                    this.props.navigation.navigate('TimeLinePostCreate', {
                                                        screen: 'global',
                                                        item: { image: thumbNail }, interChange: [], equipment: [], video: [], receiptPrivate: 0, mediaImages: [
                                                            {
                                                                'media': source,
                                                                'thumbnail': thumbNail,
                                                                receipt_private: '0',
                                                                type: 'video'
                                                            }
                                                        ]
                                                    })
                                                    this.setState({ message: '' })
                                                }
                                                else {
                                                    const terminalId = this.props.route.params.terminalResult.id ? this.props.route.params.terminalResult.id : this.props.route.params.terminalResult._id
                                                    const thumbNail = this.props.route.params.thumbnail
                                                    const source = { uri: this.props.route.params.response.uri };
                                                    const { screen } = this.props.route.params
                                                    this.props.videoUploadAction(terminalId, source, thumbNail, this.state.message, this.props.navigation, screen)
                                                    this.setState({ message: '' })
                                                }

                                            }
                                        }}>
                                            <View style={{ backgroundColor: '#29a2e1', width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', }}>
                                                <Image style={{ width: 25, height: 25 }} source={require('../../Images/SendClient.png')} />
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </ScrollView>
                        </KeyboardAvoidingView>
                    )
                }
            }
        }
        else {
            if (this.props.route.params.type === 'image') {
                return (
                    <View style={{ flex: 1, paddingBottom: 20, backgroundColor: 'black' }}>
                        {
                            Platform.OS == 'android' ?
                                <Header
                                    rightVector={route.params.screen == "timeLineDetail" && 'ellipsis-v'}
                                    rightBackBtnPress={() => { route.params.screen == "timeLineDetail" && _this.actionSheetModalPress() }}
                                    headerTitle={I18n.t('Preview')}
                                    leftImageSource={AppImages.images.back} leftbackbtnPress={() => navigation.goBack()} />
                                :
                                <View style={{ flex: 0.13 }}>
                                    <Header
                                        rightVector={route.params.screen == "timeLineDetail" && 'ellipsis-v'}
                                        rightBackBtnPress={() => { route.params.screen == "timeLineDetail" && _this.actionSheetModalPress() }}
                                        headerTitle={I18n.t('Preview')}
                                        leftImageSource={AppImages.images.back} leftbackbtnPress={() => navigation.goBack()} />
                                </View>}
                        <ActionSheet
                            ref={o => this.ActionSheet3 = o}
                            options={[I18n.t('Cancel'), I18n.t('saveToPhone')]}
                            cancelButtonIndex={0}
                            onPress={(index) => { this.androidActionSheetPress3(index) }}
                        />
                        <Loader loading={this.props.videoUploadState.onLoad || this.state.loader} />
                        <ScrollView
                            style={{ backgroundColor: 'black', height: Dimensions.deviceHeight }}>
                            <View style={{ flex: 1 }}>
                                <View style={{ width: Dimensions.deviceWidth, height: Dimensions.deviceHeight * 0.65, justifyContent: 'center' }}>
                                    <Image
                                        style={{ width: Dimensions.deviceWidth * 1, marginTop: 50, height: Platform.OS == 'android' ? Dimensions.deviceHeight * 0.5 : deviceInfo.hasNotch() ? 650 : 600 }}
                                        source={this.props.route.params.response}
                                        resizeMode='contain'
                                    ></Image>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', margin: 10, marginTop: deviceInfo.hasNotch() ? 50 : 110 }}>
                                    {this.props.route.params.screen !== 'global' && <TextInput
                                        maxLength={1000}
                                        style={{ width: '80%', minHeight: 48, maxHeight: 70, padding: 10, marginTop: 5, backgroundColor: 'white', borderRadius: 10, paddingTop: 10, paddingLeft: 20 }}
                                        placeholder={this.props.route.params.screen == 'timeLineDetail' || this.props.route.params.screen == 'global' ? I18n.t('enterDescription') : I18n.t('enterMessage')}
                                        keyboardType="ascii-capable"
                                        returnKeyType={"done"}
                                        onChangeText={(message) => this.setState({ message })}
                                        multiline={true}
                                    />}
                                    <TouchableOpacity
                                        disabled={this.state.disabled}
                                        onPress={() => {
                                            this.setState({ disabled: true })
                                            if (this.props.route.params.screen == 'timeLineDetail' || this.props.route.params.screen == 'global') {
                                                if (this.state.message.length > 1000) {
                                                    alert(I18n.t('descriptionMax'))
                                                }
                                                else {
                                                    if (this.props.route.params.screen == 'global') {
                                                        const source = { uri: this.props.route.params.response.uri };
                                                        const { screen } = this.props.route.params
                                                        this.props.navigation.navigate('TimeLinePostCreate', {
                                                            screen: 'global',
                                                            item: { image: source }, interChange: [], equipment: [], video: [], receiptPrivate: 0, mediaImages: [
                                                                {
                                                                    'media': source,
                                                                    'thumbnail': '',
                                                                    receipt_private: '0'
                                                                }
                                                            ]
                                                        })
                                                        this.setState({ message: '' })
                                                    } else {
                                                        const timeLineId = this.props.route.params.terminalResult.id ? this.props.route.params.terminalResult.id : this.props.route.params.terminalResult._id
                                                        this.props.addTimeLinePost(timeLineId, this.state.message, this.props.navigation)
                                                        this.setState({ message: '' })
                                                    }
                                                }
                                            }
                                            else {

                                                if (this.state.message.length > 1000) {
                                                    alert(I18n.t('messageMax'))
                                                } else {
                                                    const terminalId = this.props.route.params.terminalResult.id ? this.props.route.params.terminalResult.id : this.props.route.params.terminalResult._id
                                                    const thumbNail = this.props.route.params.thumbnail
                                                    const source = { uri: this.props.route.params.response.uri };
                                                    const { screen } = this.props.route.params
                                                    this.props.videoUploadAction(terminalId, source, '', this.state.message, this.props.navigation, screen)
                                                    this.setState({ message: '' })
                                                }
                                            }
                                            setTimeout(() => {
                                                this.setState({ disabled: false })
                                            }, 500);
                                        }}>
                                        <View style={{ backgroundColor: '#29a2e1', width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', }}>
                                            <Image resizeMode="cover" style={{ width: 25, height: 25 }} source={require('../../Images/SendClient.png')} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                )
            } else {
                if (this.props.route.params.screen == 'timeLineDetail') {
                    return (
                        <View style={{ flex: 1, backgroundColor: 'black', paddingBottom: 20 }}
                        >
                            {Platform.OS == 'android' ?
                                <Header
                                    rightVector={route.params.screen == "timeLineDetail" && 'ellipsis-v'}
                                    rightBackBtnPress={() => { route.params.screen == "timeLineDetail" && _this.actionSheetModalPress() }}
                                    headerTitle={I18n.t('Preview')}
                                    leftImageSource={AppImages.images.back} leftbackbtnPress={() => navigation.goBack()} />
                                :
                                <View style={{ flex: Platform.OS == 'android' ? 0.11 : 0.13 }}>
                                    <Header
                                        rightVector={route.params.screen == "timeLineDetail" && 'ellipsis-v'}
                                        rightBackBtnPress={() => { route.params.screen == "timeLineDetail" && _this.actionSheetModalPress() }}
                                        headerTitle={I18n.t('Preview')}
                                        leftImageSource={AppImages.images.back} leftbackbtnPress={() => navigation.goBack()} />
                                </View>}
                            <ActionSheet
                                ref={o => this.ActionSheet3 = o}
                                options={[I18n.t('Cancel'), I18n.t('saveToPhone')]}
                                cancelButtonIndex={0}
                                onPress={(index) => { this.androidActionSheetPress3(index) }}
                            />
                            <Modal onRequestClose={() => { this.setState({ modalVisible: false }) }} visible={this.state.modalVisible}>
                                <View style={{ width: Dimensions.deviceWidth, height: Dimensions.deviceHeight, backgroundColor: 'black' }}>
                                    <VideoPlayerControl
                                        onBack={() => { this.setState({ modalVisible: false }) }}
                                        onPause={() => console.log('pause')}
                                        onPlay={() => { console.log('play') }}
                                        onEnd={() => this.setState({ modalVisible: false })}
                                        source={{ uri: this.props.route.params.response.media?.uri ? this.props.route.params.response.media.uri : imageBaseUrl + this.props.route.params.response.media }}
                                        seekColor={'red'}
                                        controlTimeout={150000}
                                        style={{ marginBottom: 50 }}
                                    />
                                </View>
                            </Modal>
                            <Loader loading={this.state.videoLoad || this.state.loader} />
                            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'black', paddingVertical: 30 }}>
                                <View style={{ width: Dimensions.deviceWidth, height: Dimensions.deviceHeight * 0.65, justifyContent: 'center' }}>
                                    <TouchableOpacity
                                        style={{ alignItems: "center", justifyContent: "center" }}
                                        activeOpacity={1}
                                        onPress={() => this.setState({ modalVisible: true })}>
                                        {this.props.route.params.thumbnail == "manual" ?
                                            <Video
                                                resizeMode='contain'
                                                style={{ width: Dimensions.deviceWidth, height: deviceInfo.hasNotch() ? 700 : 600, maxHeight: Dimensions.deviceHeight - 200, marginTop: 30, }}
                                                onLoad={() => {
                                                    setTimeout(() => {
                                                        this.setState({ paused: true })
                                                    }, 500);
                                                }}
                                                paused={this.state.paused}
                                                source={{ uri: imageBaseUrl + this.props.route.params.response.media }}
                                            />
                                            :
                                            <Image
                                                source={this.props.route.params.thumbnail ? { uri: this.props.route.params.thumbnail?.uri ? this.props.route.params.thumbnail.uri : imageBaseUrl + this.props.route.params.thumbnail } : AppImages.images.videoDummy}
                                                style={{ width: Dimensions.deviceWidth, height: deviceInfo.hasNotch() ? 700 : 600, maxHeight: Dimensions.deviceHeight - 200, marginTop: 30 }}
                                            />
                                        }
                                        <Image source={
                                            AppImages.images.play
                                        }
                                            style={{ position: "absolute", height: 50, overflow: 'hidden', backgroundColor: '#fff', borderRadius: 25, width: 50, alignSelf: "center", top: "50%" }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )
                }
                else {
                    return (
                        <View
                            style={{ flex: 1, backgroundColor: 'black', paddingBottom: 20 }}>
                            <View style={{ flex: Platform.OS == 'android' ? 0.11 : 0.13 }}>
                                <Header
                                    rightVector={route.params.screen == "timeLineDetail" && 'ellipsis-v'}
                                    rightBackBtnPress={() => { route.params.screen == "timeLineDetail" && _this.actionSheetModalPress() }}
                                    headerTitle={I18n.t('Preview')}
                                    leftImageSource={AppImages.images.back} leftbackbtnPress={() => navigation.goBack()} />
                            </View>
                            <ActionSheet
                                ref={o => this.ActionSheet3 = o}
                                options={[I18n.t('Cancel'), I18n.t('saveToPhone')]}
                                cancelButtonIndex={0}
                                onPress={(index) => { this.androidActionSheetPress3(index) }}
                            />
                            <Modal onRequestClose={() => { this.setState({ modalVisible: false }) }} visible={this.state.modalVisible}>
                                <View style={{ width: Dimensions.deviceWidth, height: Dimensions.deviceHeight, backgroundColor: 'black' }}>
                                    <VideoPlayerControl
                                        onBack={() => { this.setState({ modalVisible: false }) }}
                                        onPause={() => console.log('pause')}
                                        onPlay={() => { console.log('play') }}
                                        onEnd={() => this.setState({ modalVisible: false })}
                                        source={{ uri: this.props.route.params.response.uri }}
                                        seekColor={'red'}
                                        controlTimeout={150000}
                                        style={{ marginBottom: 50 }}
                                    />
                                </View>
                            </Modal>
                            <Loader loading={this.props.videoUploadState.onLoad || this.state.loader} />
                            <ScrollView
                                style={{ backgroundColor: 'black', height: Dimensions.deviceHeight }}>
                                <View style={{ flex: 1, }}>
                                    <View style={{ width: Dimensions.deviceWidth, height: Dimensions.deviceHeight * 0.65, justifyContent: 'center' }}>
                                        <VideoPlayer
                                            fullScreenOnLongPress={true}
                                            onPlayPress={() => { this.setState({ modalVisible: true }) }}
                                            onStart={() => {
                                                this.setState({ modalVisible: true })
                                            }}
                                            resizeMode='contain'
                                            style={{ width: Dimensions.deviceWidth, height: Dimensions.deviceHeight * 0.6, marginTop: 50 }}
                                            // endWithThumbnail
                                            thumbnail={this.props.route.params.thumbnail ? { uri: this.props.route.params.thumbnail.uri } : AppImages.images.videoDummy}
                                            video={{ uri: this.props.route.params.response.uri }}
                                            ref={r => this.player = r}
                                        />
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', margin: 10, marginTop: deviceInfo.hasNotch() ? 50 : 110 }}>
                                        {this.props.route.params.screen !== 'global' && <TextInput
                                            style={{ width: '80%', minHeight: 48, maxHeight: 70, padding: 10, marginTop: 5, backgroundColor: 'white', borderRadius: 10, paddingTop: 10, paddingLeft: 20 }}
                                            placeholder={this.props.route.params.screen == 'global' ? I18n.t('enterDescription') : I18n.t('enterMessage')}
                                            keyboardType="ascii-capable"
                                            returnKeyType={"done"}
                                            onChangeText={(message) => this.setState({ message })}
                                            multiline={true}
                                        />}
                                        <TouchableOpacity
                                            disabled={this.state.disabled}
                                            onPress={() => {
                                                this.setState({ disabled: true })
                                                setTimeout(() => {
                                                    this.setState({ disabled: false })
                                                }, 500);
                                                if (this.state.message.length > 1000) {
                                                    this.props.route.params.screen == 'global' ?
                                                        alert(I18n.t('descriptionMax'))
                                                        :
                                                        alert(I18n.t('messageMax'))
                                                } else {
                                                    if (this.props.route.params.screen == 'global') {
                                                        const thumbNail = this.props.route.params.thumbnail
                                                        const source = { uri: this.props.route.params.response.uri };
                                                        const { screen } = this.props.route.params
                                                        this.props.navigation.navigate('TimeLinePostCreate', {
                                                            screen: 'global',
                                                            item: { image: thumbNail }, interChange: [], equipment: [], video: [], receiptPrivate: 0, mediaImages: [
                                                                {
                                                                    'media': source,
                                                                    'thumbnail': thumbNail,
                                                                    receipt_private: '0',
                                                                    type: 'video'
                                                                }
                                                            ]
                                                        })
                                                        this.setState({ message: '' })
                                                    }
                                                    else {
                                                        const terminalId = this.props.route.params.terminalResult.id ? this.props.route.params.terminalResult.id : this.props.route.params.terminalResult._id
                                                        const thumbNail = this.props.route.params.thumbnail
                                                        const source = { uri: this.props.route.params.response.uri };
                                                        const { screen } = this.props.route.params
                                                        this.props.videoUploadAction(terminalId, source, thumbNail, this.state.message, this.props.navigation, screen)
                                                        this.setState({ message: '' })
                                                    }
                                                }
                                            }}>
                                            <View style={{ backgroundColor: '#29a2e1', width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', }}>
                                                <Image style={{ width: 25, height: 25 }} source={require('../../Images/SendClient.png')} />
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    )
                }
            }
        }
    }
}
function mapStateToProps(state) {
    return {
        videoUploadState: state.VideoUploadState,
    }
}
export default connect(mapStateToProps, { videoUploadAction, addTimeLinePost })(VideoPreview);
