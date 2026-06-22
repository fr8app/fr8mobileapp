import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    Dimensions,
    ImageBackground,
    ScrollView,
    Alert,
    Platform,
    Keyboard,
    ActionSheetIOS,
    Share,
    Animated,
    Linking,
} from 'react-native';
import KeyboardManager from 'react-native-keyboard-manager';
import styles from './styles'
import { CachedImage } from '../../Components/react-native-cached-image-master'
import Header from '../../Components/Header'
import DataManager from "../../Components/DataManager";
import I18n from 'react-native-i18n'
import Icon from 'react-native-vector-icons/FontAwesome'
import { imageBaseUrl, branchBaseUrl, version } from '../../Config';
import { AppImages } from "../../Themes";
import { timeLinePostDetail, timeLineComment, deleteComemnt, timeLinePostDetailClear, deleteTimeLinePost, timelinePostLikeAction, timeLineShare } from '../../Redux/actions/timeLineAction';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ReadMore from 'react-native-read-more-text';
import { TouchableHighlight } from 'react-native';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import { Loader } from "./../../Components";
import ActionSheet from 'react-native-actionsheet'
import NetInfo from '@react-native-community/netinfo';
import dateDifferenceInDays from '../../Components/dateDifferenceInDays';
import { clearProfileData } from '../../Redux/actions/profileAction';
import AnimationScreen from '../MyTimeLine/amination/Animation/Animation.Screen';
import ImageView from "react-native-image-viewing";
import HyperLink from 'react-native-hyperlink';
import Marker from 'react-native-image-marker';
import RNFetchBlob from 'rn-fetch-blob';
import { s3bucket, uploadImageOnS3, uuidv4_34 } from '../../Config/aws';
import { RNFFmpeg } from 'react-native-ffmpeg';
import moment from 'moment';

const width = Dimensions.get('screen').width
let mediaImages2 = []
let mediaImages3 = [];
class PostFullView extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            header: (
                null
            )
        };
    };
    constructor(props) {
        super(props)
        this.state = {
            height: 0,
            width: 0,
            selectedImage: '',
            disabled: false,
            dataSource: [],
            imagePressIndex: 0,
            imagePressIndex1: 0,
            userDetail: null,
            message: '',
            refreshing: false,
            pageIndShow: true,
            index: 0,
            selectedItem: {},
            name: '',
            internetAlert: 0,
            readMoreAndLessText: false,
            delay: 500,
            fadeAnimation: new Animated.Value(0),
            yAxis: 0,
            isScrolling: false,
            visible: false,
            loading:false,
            animatedImage: false
        }
        _this = this
        this.item = this.props.route.params.item
        this.userImages = this.props.route.params.userImages
        this.index = this.props.route.params.index
        this.internetStatus = null
        this.delayTime = 500;
        // bool to check whether user tapped once
        this.firstPress = true;
        // the last time user tapped
        this.lastTime = new Date();
        // a timer is used to run the single tap event
        this.timer = false;

        console.log('this.props.route.params.item', this.props.route.params.item);
    }

    deletePost = () => {
        Alert.alert(
            I18n.t("Alert"),
            I18n.t('deletePostAlert'),
            [
                {
                    text: I18n.t('Yes'),
                    onPress: () => { this.props.deleteTimeLinePost(this.item?._id, this.props.navigation) }
                },
                {
                    text: I18n.t('No'),
                    onPress: () => { }
                },

            ],
            { cancelable: false },
        )
    }

    goBAck(navigation) {
        this.setState({ isScrolling: true })
        navigation.goBack()
    }

    componentDidMount() {
        mediaImages2 = []
        console.log('width,height',  this.userImages);
        this.checkInternetConnection()
        this.userImages.map((x, index) => {
            Image?.getSize((x?.imageThumbnail?imageBaseUrl + x?.imageThumbnail: imageBaseUrl+ x?.media), (width, height) => {
                console.log('width,height', width, height, this.userImages);
                this.userImages[index].height = height
                this.userImages[index].width = width
            })
        })

        this.focusListener = this?.props?.navigation?.addListener('focus', () => {
            this.setState({ isScrolling: true })
            this.props.timeLinePostDetail(this.item?._id, this.props.navigation)

        })
        DataManager.getUserDetails().then(async response => {
            if (response) {
                let parseData = await JSON.parse(response)
                this.setState({ userDetail: parseData.data._id ? parseData?.data?._id : parseData?.data?.id, name: parseData.data.userName })
            }
        });
        if (Platform.OS == "ios") {
            KeyboardManager.setKeyboardDistanceFromTextField(5);

        }

    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            if (this.props.timeLine !== prevProps.timeLine) {
                if (this.props.timeLine?.detail !== prevProps.timeLine?.detail) {
                    let type;
                    let item;
                    mediaImages3 = [];
                    !this.props.timeLine?.detail?.route_id ? this.props.timeLine.detail?.media_type !== 'text' &&
                        this.props.timeLine.detail?.images?.length > 0 ?
                        [item = this.props.timeLine?.detail,
                        type = 'images']
                        :
                        this.props.timeLine?.detail?.route_id ?
                            [item = this.props.timeLine?.detail?.route_id,
                            type = 'routes']
                            :
                            [item = this.props.timeLine.detail,
                            type = 'images']
                        :
                        [item = this.props.timeLine?.detail?.route_id,
                        type = 'routes']
                    if (type == 'routes') {
                        console.log('fdsfdfdfdsfdsfds', item);
                        mediaImages3.push({ height: 256, width: 512, 'media': item?.image, uri: imageBaseUrl + item?.image, 'thumbnail': null, receipt_private: '0' })
                        if (item?.route_medias) {
                            if (item?.route_medias.length > 0) {
                                if (item?.receipt_private == true) {
                                    item?.route_medias.map((x) => {
                                        x.uri = imageBaseUrl + x.media
                                        if (x?.type !== 'interchange_file') {
                                            mediaImages3.push(x)
                                        }
                                    })
                                }
                                else {
                                    item?.route_medias?.map((x) => {
                                        x.uri = imageBaseUrl + x.media
                                        mediaImages3?.push(x)

                                    })
                                }


                            }
                        }
                        if (item?.medias) {
                            item?.medias?.length > 0 && item?.medias.map((mm) => {
                                if (mm?.is_video) {

                                    mediaImages3?.push({ height: mm.height, width: mm.width, 'media': mm.url, uri: imageBaseUrl + mm.thumbnail, 'thumbnail': mm.thumbnail, receipt_private: '0', type: 'video' })

                                }
                                else {
                                    mediaImages3?.push({ height: mm.height, width: mm.width, 'media': mm.url, uri: imageBaseUrl + mm.url, 'thumbnail': null, receipt_private: '0', type: 'image' })
                                }
                            })
                        }
                    }
                    else {
                        if (item?.images?.length == 0 && item?.video == null) {

                        }
                        else {
                            if (item?.images) {
                                if (item?.images?.length > 0) {
                                    item?.images?.map((x) => {

                                        mediaImages3.push({ height: x.height, width: x.width, 'media': x.url, uri: imageBaseUrl + x.url, 'thumbnail': null, receipt_private: '0' })

                                    })
                                    if (item?.video) {
                                        mediaImages3.push({ height: item?.thumbnail_height, width: item?.thumbnail_width,'media': item?.video, uri: imageBaseUrl + item?.thumbnail_image, 'thumbnail': item?.thumbnail_image ? item?.thumbnail_image : null, receipt_private: '0', type: 'video' })

                                    }
                                }
                                else {
                                    mediaImages3?.push({height: item?.thumbnail_height, width: item?.thumbnail_width, 'media': item?.video, uri: imageBaseUrl + item?.thumbnail_image, 'thumbnail': item?.thumbnail_image ? item?.thumbnail_image : null, receipt_private: '0', type: 'video' })


                                }
                            }
                            else {
                                mediaImages3.push({height: item?.thumbnail_height, width: item?.thumbnail_width, 'media': item?.video, uri: imageBaseUrl + item?.thumbnail_image, 'thumbnail': item?.thumbnail_image ? item?.thumbnail_image : null, receipt_private: '0', type: item?.media_type ? item?.media_type : 'video' })
                            }
                        }
                    }
                }
            }
        }
    }

    componentWillUnmount() {
        this.setState({ isScrolling: true })
        if (Platform.OS == "ios") {
            KeyboardManager.setKeyboardDistanceFromTextField(10);
        }
    }


    deletePress = (item, i) => {
        this.setState({ isScrolling: true })
        Alert.alert(
            I18n.t("Alert"),
            I18n.t('deleteCommentAlert'),
            [
                {
                    text: I18n.t('Yes'),
                    onPress: () => {

                        this.props.deleteComemnt(item?._id, i, this.props.navigation, this.item?._id)
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
    onRefresh = () => {
        this.setState({ refreshing: true, isScrolling: true })
        this.props.timeLinePostDetail(this.item?._id, this.props.navigation)
        setTimeout(() => {
            this.setState({ refreshing: false })
        }, 200);
    }

    //read more
    _renderTruncatedFooter = (handlePress) => {

        return (
            <Text
                style={styles.readMore}
                onPress={handlePress}
            >
                Read more
            </Text>
        );
    }
    //read less
    _renderRevealedFooter = (handlePress) => {
        return (
            <Text
                style={styles.readMore}
                onPress={handlePress}
            >
                Read less
            </Text>
        );
    }

    header = () => {
        return (
            <>
                <View style={styles.userView}>
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({ isScrolling: true })
                            if (this.props.timeLine?.detail?.shared_by) {
                                if (this.state.userDetail !== this.props.timeLine.detail?.shared_by?._id) {
                                    this.props.clearProfileData()
                                    this.props.navigation.navigate("NameOfTheUser", {
                                        key: null,
                                        userDetail: this.props.timeLine.detail?.shared_by,
                                    })
                                }
                                else {
                                    this.props.clearProfileData()

                                    this.props.navigation.navigate("SelfUserProfileDetail", {
                                        key: null,
                                        userDetail: this.props.timeLine.detail?.shared_by,
                                    })
                                    // this.props.navigation.navigate("UserNamess", {
                                    //     onNavigationBack: () => null,
                                    // })
                                }
                            }
                            else {
                                if (this.state.userDetail !== this.props.timeLine.detail?.user?._id) {
                                    this.props.navigation.navigate("NameOfTheUser", {
                                        key: null,
                                        userDetail: this.props.timeLine.detail.user,
                                    });
                                }
                                else {
                                    this.props.clearProfileData()

                                    this.props.navigation.navigate("SelfUserProfileDetail", {
                                        key: null,
                                        userDetail: this.props.timeLine.detail.user,
                                    })
                                    // this.props.navigation.navigate("UserNamess", {
                                    //     onNavigationBack: () => null,
                                    // })
                                }
                            }
                        }}
                        style={styles.userImage}>
                        <CachedImage
                            resizeMode='cover'
                            source={
                                this.props?.timeLine?.detail?.shared_by
                                    ?
                                    this?.props?.timeLine?.detail?.shared_by?.profile !== '' &&
                                        this?.props?.timeLine?.detail?.shared_by?.profile !== null
                                        ?
                                        { uri: imageBaseUrl + this?.props?.timeLine?.detail?.shared_by?.profile }
                                        :
                                        AppImages.images.user01
                                    :
                                    this.props.timeLine.detail?.user?.profile !== '' &&
                                        this.props.timeLine.detail?.user?.profile !== null
                                        ?
                                        { uri: imageBaseUrl + this.props.timeLine.detail?.user?.profile }
                                        :
                                        AppImages.images.user01
                            }
                            style={styles.userImage}
                        />
                    </TouchableOpacity>
                    <View
                        style={styles.nameView}
                    >
                        <Text
                            numberOfLines={5}
                            style={[styles.userPostsText, styles.userName]}>
                            <Text
                                onPress={() => {
                                    this.setState({ isScrolling: true })
                                    if (this.props.timeLine?.detail?.shared_by) {
                                        if (this.state.userDetail !== this.props.timeLine.detail?.shared_by?._id) {
                                            this.props.clearProfileData()

                                            this.props.navigation.navigate("NameOfTheUser", {
                                                key: null,
                                                userDetail: this.props.timeLine.detail?.shared_by,
                                            })
                                        }
                                        else {
                                            this.props.clearProfileData()

                                            this.props.navigation.navigate("SelfUserProfileDetail", {
                                                key: null,
                                                userDetail: this.props.timeLine.detail?.shared_by,
                                            })
                                            // this.props.navigation.navigate("UserNamess", {
                                            //     onNavigationBack: () => null,
                                            // })
                                        }
                                    }
                                    else {
                                        if (this.state.userDetail !== this.props.timeLine.detail?.user?._id) {
                                            this.props.navigation.navigate("NameOfTheUser", {
                                                key: null,
                                                userDetail: this.props.timeLine.detail.user,
                                            });
                                        }
                                        else {
                                            this.props.clearProfileData()
                                            this.props.myPostsState.result = []
                                            this.props.navigation.navigate("SelfUserProfileDetail", {
                                                key: null,
                                                userDetail: this.props.timeLine.detail?.user,
                                            })
                                            // this.props.navigation.navigate("UserNamess", {
                                            //     onNavigationBack: () => null,
                                            // })
                                        }
                                    }
                                }}
                            >
                                {
                                    this.props.timeLine.detail?.shared_by ?
                                        this.props.timeLine.detail?.shared_by.userName
                                        :
                                        this.props.timeLine.detail?.user?.userName
                                }
                            </Text>
                            {this.props.timeLine?.detail?.tag_friends?.length > 0 &&
                                <Text
                                    onPress={() => {
                                        this.setState({ isScrolling: true })
                                        this.props.navigation.navigate('TagFriends', { item: this.props.timeLine.detail?.tag_friends })
                                    }}
                                    numberOfLines={3}
                                    style={[
                                        styles.userPostsText, styles.with
                                    ]}
                                >{' - ' + I18n.t('With')} <Text
                                    style={[
                                        styles.userPostsText,
                                        styles.with,
                                        {
                                            fontWeight: "bold",
                                            width: '80%'
                                        },
                                    ]}>
                                        {this.props.timeLine.detail?.tag_friends[0].userName}
                                    </Text>
                                    {this.props.timeLine?.detail?.tag_friends.length > 2 && ' ' + [I18n.t('And').toLowerCase()] + ' ' + (this.props.timeLine.detail?.tag_friends.length - 1) + ' ' + I18n.t('others')}
                                    {this.props.timeLine.detail?.tag_friends.length == 2 &&
                                        <Text style={[styles.userPostsText, styles.with,
                                        {
                                            width: '95%'
                                        },
                                        ]}
                                        >{' ' + I18n.t('And').toLowerCase() + ' '}
                                            <Text
                                                style={[
                                                    styles.userPostsText, styles.with,
                                                    {
                                                        fontWeight: "bold",
                                                        width: '95%'
                                                    },
                                                ]}>
                                                {' ' + this.props.timeLine.detail?.tag_friends[1].name}
                                            </Text>
                                        </Text>
                                    }
                                </Text>}
                            {
                                this.props.timeLine.detail?.post_location &&
                                <Text
                                    style={[
                                        styles.userPostsText, styles.with,
                                        {
                                            width: '95%'
                                        },
                                    ]}>
                                    {` ${I18n.t("in")} `}
                                </Text>
                            }
                            {this.props.timeLine.detail?.post_location &&
                                <Text
                                    numberOfLines={3}
                                    style={[
                                        styles.userPostsText, styles.with,
                                        {
                                            fontWeight: "700",
                                            width: '95%'
                                        },
                                    ]}>
                                    {this.props.timeLine.detail.post_location}
                                </Text>}

                        </Text>
                        {this.props.timeLine.detail?.route_id?.terminal?.terminal_name &&
                            <Text
                                numberOfLines={2}
                                style={[
                                    styles.userPostsText,
                                    {
                                        textAlign: "left",
                                        fontSize: 14
                                    }
                                ]}>
                                {this.props.timeLine.detail?.route_id?.terminal?.terminal_name}
                            </Text>
                        }
                        <Text
                            numberOfLines={2}
                            style={[styles.dateTimeText]}>
                            {this.props?.timeLine?.detail && dateDifferenceInDays(this.props.timeLine?.detail?.created_at)}
                        </Text>
                    </View>
                </View>
                {this.props.timeLine.detail ?
                    <>
                        {/* {this.props.timeLine.detail?.shared_by ?
                            <Text
                                numberOfLines={3}
                                style={[
                                    styles.sharedByText
                                ]}>
                                {this.props.timeLine.detail.shared_by.userName + ' ' + I18n.t('hasShared') + ' ' + this.props.timeLine.detail?.user?.userName + "'s" + ' ' + I18n.t('post') + '.'}
                            </Text>
                            : null
                        } */}
                        {this.props.timeLine.detail?.description ?
                            <View
                                style={[
                                    styles.descriptionText
                                ]}>
                                <HyperLink
                                    onPress={(url, text) => Linking.openURL(url)}

                                    linkStyle={{ color: '#2980b9', fontSize: 20 }}>
                                    <ReadMore
                                        numberOfLines={5}
                                        renderTruncatedFooter={this._renderTruncatedFooter}
                                        renderRevealedFooter={this._renderRevealedFooter}
                                        onReady={this._handleTextReady}>
                                        <Text
                                            style={[
                                                styles.descriptionText
                                            ]}>
                                            {this.props.timeLine.detail?.description}
                                        </Text>
                                    </ReadMore>
                                </HyperLink>
                            </View>
                            :
                            null
                        }
                    </>
                    :

                    <View style={[styles.postImageView]}>
                        {/* {this.props.timeLine.detail?.shared_by ?
                            <Text numberOfLines={3}
                                style={[styles.userPostsText, styles.sharedByText,
                                { paddingBottom: this.props.timeLine.detail.description ? 0 : 20 }]}
                            >
                                {this.props.timeLine.detail.shared_by.name + ' ' + I18n.t('hasShared') + ' ' + this.props.timeLine.detail?.user?.name + "'s" + ' ' + I18n.t('post') + '.'}</Text>
                            : null
                        } */}
                        {this.props.timeLine.detail?.description ?
                            <View style={[styles.userPostsText, styles.descriptionText]}>
                                <Hyperlink
                                    onPress={(url, text) => Linking.openURL(url)}

                                    linkStyle={{ color: '#2980b9', fontSize: 18 }}>
                                    <ReadMore
                                        numberOfLines={5}
                                        renderTruncatedFooter={this._renderTruncatedFooter}
                                        renderRevealedFooter={this._renderRevealedFooter}
                                        onReady={this._handleTextReady}>
                                        <Text style={[styles.userPostsText, styles.descriptionText]}>{this.props.timeLine.detail?.description}</Text>
                                    </ReadMore>
                                </Hyperlink>

                            </View> : null}
                        {this.props.timeLine.detail?.thumbnail_image ?
                            <View style={{ height: width * 0.5, width: '100%' }}>

                                <TouchableOpacity

                                    onPress={() => {
                                        this.setState({ isScrolling: true })
                                        this.props.navigation.navigate('VideoPreview', {
                                            response: { 'media': this.props.timeLine.detail.video }, thumbnail: this.props.timeLine.detail.thumbnail_image, terminalResult: { id: this.item?._id },
                                            screen: 'timeLineDetail',
                                            type: 'video'
                                        })
                                    }}
                                >
                                    <ImageBackground
                                        style={[styles.container]}
                                        source={{ uri: imageBaseUrl + this.props.timeLine.detail?.thumbnail_image }}
                                        resizeMode="cover"  >

                                        <View style={styles.imageContainer}>
                                            <CachedImage source={AppImages.images.play} resizeMode="contain" style={styles.cacheImage} />
                                        </View>
                                    </ImageBackground>
                                </TouchableOpacity>
                            </View> :
                            <Image
                                resizeMode={"cover"}
                                source={{ uri: imageBaseUrl + this.props.timeLine.detail?.video }}
                                style={[styles.postImage]} />

                        }
                    </View>
                }
            </>


        )
    }
    likePress = (item, val) => {
        this.setState({ isScrolling: true })
        console.log('likePress', item, val)
        if (item?.is_like == true && val == 0) {
            this.props.timelinePostLikeAction(item?._id, '2', this.props.navigation, item?.is_like, null)
        }
        else {
            switch (val) {
                case 1:
                    this.props.timelinePostLikeAction(item?._id, '1', this.props.navigation, item?.is_like, 'like')
                    break;
                case 2:
                    this.props.timelinePostLikeAction(item?._id, '1', this.props.navigation, item?.is_like, 'dislike')
                    break;
                case 3:
                    this.props.timelinePostLikeAction(item?._id, '1', this.props.navigation, item?.is_like, 'grinningSmile')
                    break;
                case 4:
                    this.props.timelinePostLikeAction(item?._id, '1', this.props.navigation, item?.is_like, 'angry')
                    break;
                case 5:
                    this.props.timelinePostLikeAction(item?._id, '1', this.props.navigation, item?.is_like, 'confuse')
                    break;
                case 6:
                    this.props.timelinePostLikeAction(item?._id, '1', this.props.navigation, item?.is_like, 'thinking')
                    break;
                default:
                    this.props.timelinePostLikeAction(item?._id, '1', this.props.navigation, item?.is_like, 'like')
                    break;
            }
        }

    }
    androidActionSheetPress = (buttonIndex) => {
        this.setState({ isScrolling: true })
        if (buttonIndex == 1) {
            this.share(this.state.selectedItem)
        }
        else if (buttonIndex == 2) {
            this.deepShare(this.state.selectedItem)
        }
    }
    androidActionSheetPress2 = (buttonIndex) => {
        this.setState({ isScrolling: true })
        if (buttonIndex == 1) {

            this.setState({ isScrolling: true })
            let images = []
            let videos = []
            if (!this.props.timeLine?.detail?.route_id && !this.props.timeLine?.detail?.shared_by) {
                mediaImages2.map((x) => {
                    if (x?.type == 'image') {
                        images.push(x)
                    }
                    else {
                        videos.push(x)
                    }
                })
                this.props.navigation.navigate('EditPost', { description: this.props.timeLine.detail?.description, mediaImages: mediaImages2, screen: 'global', images, videos, id: this.item?._id, detail: this.props.timeLine?.detail })
            }
            else {
                this.props.timeLine?.detail?.shared_by ? this.props.timeLine.detail.shared_by._id == this.state.userDetail ?
                    this.deletePost()
                    : null
                    :
                    this.state.userDetail == this.props.timeLine?.detail?.user?._id ?
                        this.deletePost()
                        : null
            }


        }
        else if (buttonIndex == 2) {
            this.props.timeLine?.detail?.shared_by ? this.props.timeLine.detail.shared_by._id == this.state.userDetail ?
                this.deletePost()
                : null
                :
                this.state.userDetail == this.props.timeLine?.detail?.user?._id ?
                    this.deletePost()
                    : null
        }
    }
    androidActionSheetPress3 = (buttonIndex) => {
        this.setState({ isScrolling: true })
        if (buttonIndex == 1) {
            this.addTradeMark(this.state.selectedImage)

        }

    }
    actionSheet = (item) => {
        this.setState({ selectedItem: item, isScrolling: true })
        Platform.OS == 'android' ?
            this.ActionSheet.show()
            :
            ActionSheetIOS.showActionSheetWithOptions({
                options: [I18n.t('Cancel'), I18n.t('shareasPost'), I18n.t('DeeplinkShare')],

                cancelButtonIndex: 0
            }, (buttonIndex) => {
                if (buttonIndex == 1) {
                    this.share(item)
                }
                else if (buttonIndex == 2) {
                    this.deepShare(item)
                }
            })
    }


    actionSheetModalPress = (item, height, width) => {
        this.setState({ selectedImage: item, isScrolling: true, height, width })
        Platform.OS == 'android' ?
            this.ActionSheet3.show()
            :
            ActionSheetIOS.showActionSheetWithOptions({
                options: [I18n.t('Cancel'), I18n.t('saveToPhone')],

                cancelButtonIndex: 0
            }, (buttonIndex) => {
                if (buttonIndex == 1) {
                    this.addTradeMark(item)
                }

            })
    }

    share = (item) => {
        this.setState({ isScrolling: true })
        // this.props.timeLineShare(item?._id, this.props.navigation)
        this.props.navigation.navigate('SharePost', { id: item.shared_post ? item.shared_post._id : item._id, item: item, userImages: mediaImages3 })

    }

    deepShare = async (item) => {
        this.setState({ isScrolling: true })
        try {
            const result = await Share.share({

                message: Platform.OS == 'ios' ? this.state.name + I18n.t('postShareMessage') :
                    item?.route_post ?
                        this.state.name + I18n.t('postShareMessage') + '\n' + branchBaseUrl + item?._id + '?type=global_post&version=' + version
                        :
                        this.state.name + I18n.t('postShareMessage') + '\n' + branchBaseUrl + item?._id + '?type=global_post&version=' + version,
                title: 'FR8',
                url: item?.route_post ?
                    branchBaseUrl + item?._id + '?type=global_post&version=' + version
                    :
                    branchBaseUrl + item?._id + '?type=global_post&version=' + version
            }, {
                subject: I18n.t('shareSubject')
            })
            if (result.action == Share.sharedAction) {

                if (result.activityType) {

                }
                else {
                    console.log('done')
                }
            }
            else if (result.action == Share.dismissedAction) {
                console.log('dismiss')
            }
        }

        catch (e) {
            console.log(e)
        }

    }

    scrollToRow(itemIndex, x, layout) {
        if (this._scrollView) {
            let imageIndex = this.props.route.params.index
            if (imageIndex == itemIndex) {

                this._scrollView.scrollTo({ x: layout.x, y: layout.y, animated: true });
                setTimeout(() => {
                    this.setState({ readMoreAndLessText: true })
                }, 500);
            }
        }
    }

    checkInternetConnection() {
        // NetInfo.isConnected.addEventListener(
        //     "connectionChange",
        //     this.handleConnectionChange
        // );
        NetInfo.addEventListener(state=>
            this.handleConnectionChange(state.isConnected)
          );
    }

    handleConnectionChange = isConnected => {
        this.setState({ isScrolling: true })
        console.log('isConnected_1', isConnected)
        this.internetStatus = isConnected
    };

    internetPouup = () => {
        Alert.alert(
            I18n.t('Alert'),
            I18n.t('please_check_your_internet_connection'),
            [
                {
                    text: I18n.t('Ok'),
                    onPress: () => {
                        this.setState({ internetAlert: 0, isScrolling: true })
                    }
                },
            ],
            { cancelable: false },
        )
    }

    actionSheet2 = (navigation) => {
        this.setState({ isScrolling: true })
        Platform.OS == 'android' ?
            this.ActionSheet2.show()
            :
            ActionSheetIOS.showActionSheetWithOptions({
                options: !this.props.timeLine?.detail?.route_id && !this.props.timeLine?.detail?.shared_by ? [I18n.t('Cancel'), I18n.t('Edit'), I18n.t('Delete')] : [I18n.t('Cancel'), I18n.t('Delete')],
                destructiveButtonIndex: 2,
                cancelButtonIndex: 0
            }, (buttonIndex) => {
                if (buttonIndex == 1) {

                    this.setState({ isScrolling: true })
                    let images = []
                    let videos = []
                    if (!this.props.timeLine?.detail?.route_id && !this.props.timeLine?.detail?.shared_by) {
                        mediaImages2.map((x) => {
                            if (x?.type == 'image') {
                                images.push(x)
                            }
                            else {
                                videos.push(x)
                            }
                        })
                        this.props.navigation.navigate('EditPost', { description: this.props.timeLine.detail?.description, mediaImages: mediaImages2, screen: 'global', images, videos, id: this.item?._id, detail: this.props.timeLine?.detail })
                    }
                    else {
                        this.props.timeLine?.detail?.shared_by ? this.props.timeLine.detail.shared_by._id == this.state.userDetail ?
                            this.deletePost()
                            : null
                            :
                            this.state.userDetail == this.props.timeLine?.detail?.user?._id ?
                                this.deletePost()
                                : null
                    }


                }
                else if (buttonIndex == 2) {
                    this.props.timeLine?.detail?.shared_by ? this.props.timeLine.detail.shared_by._id == this.state.userDetail ?
                        this.deletePost()
                        : null
                        :
                        this.state.userDetail == this.props.timeLine?.detail?.user?._id ?
                            this.deletePost()
                            : null
                }
            })
    }


    onProductImageDoubleTap = () => {
        this.fadeIn()
        this.props.timelinePostLikeAction(this.item?._id, '1', this.props.navigation, this.item?.is_like, 'like')
    }


    downloadImage = (url) => {
        console.log(url, 'sadasdsaddsadsa');
        let name = url.split('/')
        let file = {
            uri: url,
            name: name[name.length - 1],
            type: "image/jpg",
        }
        uploadImageOnS3(file, uuidv4_34(), 'post', []).then((res) => {
            console.log('file uploaded', res);
            // this.props.uploadUserImageInitate(userProfile)
            s3bucket.upload(res, (err, data) => {
                if (err) {
                    this.setState({ loading: false })

                    console.log('error in callback', err);
                }
                console.log('success');
                console.log("Respomse URL : ", data);
                if (data.Location) {

                    console.log('url', data.Location)
                    const { fs } = RNFetchBlob;
                    const tmpFile = RNFetchBlob.fs.dirs.DocumentDir + '/FR8/' + new Date().getTime() + ".jpg"
                    RNFetchBlob.config({
                        IOSBackgroundTask: true,
                        fileCache: false,
                        timeout: 2000,
                        trusty: true,
                        path: tmpFile,
                        addAndroidDownloads: {
                            useDownloadManager: true,
                            notification: true,
                            path: fs.dirs.DownloadDir + '/' + new Date().getTime() + '.png',
                        }

                    }).fetch("GET", data.Location).then((res) => {
                        if (Platform.OS == 'ios') {
                            console.log('res.data', res.data);
                            this.setState({ visible: false,loading:false }, () => {
                                setTimeout(() => {
                                    RNFetchBlob.ios.previewDocument(res.data);

                                }, 1000);
                            })
                            // RNFetchBlob.fs.writeFile(tmpFile, res.data, 'base64');
                            // RNFetchBlob.ios.previewDocument(tmpFile);

                        }
                        else {
                            this.setState({ visible: false,loading:false })
                        }
                    }
                    ).catch((e) => {
                        console.log(e);
                        this.setState({ visible: false,loading:false })
                    })
                }
            });
        })


    }

    addTradeMark = (url) => {
        let height=this.state.height
        let width=this.state.width

        console.log(height/width,height,width);
        if (this.internetStatus === false) {
            this.state.internetAlert == 0 && this.internetPouup()
            this.setState({ internetAlert: 1 })
        }
        else {
            this.setState({loading:true,visible:false})
            // const image = url
            // const frame = "https://s3.us-east-2.amazonaws.com/fr8.ai-website-dev-content/panel/defaultImages/logo.png"
            // const name = new Date().getTime()
            // const date = moment().format('DD-MM-YY')
            // const saveFilePath = RNFetchBlob.fs.dirs.DocumentDir // For Android
            // const frameID = uuidv4_34()
            // RNFFmpeg.executeAsync(
            //     '-i ' +
            //     image +
            //     ' -i ' +
            //     frame +
            //     ' -filter_complex  overlay=main_w-overlay_w-10:overlay_h+10' +
            //     // ' -filter_complex  overlay=x=10:y=0' +
            //     saveFilePath + '/' + name + '-' + date + '-' + frameID + '.jpg', (execution) => {
            //         this.downloadImage(saveFilePath + '/' + name + '-' + date + '-' + frameID + '.jpg')
            //     }).catch((e) => {
                    
    
            //     })

            Marker.markImage({
                // Y:100,
                // X:0,
                src: imageBaseUrl+url,
                // markerSrc: "https://s3.us-east-2.amazonaws.com/fr8.ai-website-dev-content/panel/defaultImages/logo1.png",
                markerSrc:Platform.OS=='ios'? "https://www.fr8.ai/static/media/logo.06817180.png":require('../../Images/logoImg.png'),
                position: 'topRight',  // topLeft, topCenter,topRight, bottomLeft, bottomCenter , bottomRight, center
                scale: 1,
                markerScale: Platform.OS=='ios'? (width / 100 + height / 100) / 20:0.2,
                quality: 100
            }).then((path) => {
                console.log('pathhhhh', path);
                this.downloadImage(path)
                // this.setState({
                //     uri: Platform.OS === 'android' ? 'file://' + path : path,
                //     loading: false
                // })
            }).catch((err) => {
                console.log(err, 'err')
                this.setState({
                    loading: false,
                    err
                })
            })
        }
    }

    //doubleTab
    _onTap = (index, x, layout) => {
        console.log('djdkljdakljdklsjdlsa', x);
        this.setState({ isScrolling: true })
        this.setState({ imagePressIndex: index, imagePressIndex1: index })
        let now = new Date().getTime();
        if (this.firstPress) {
            this.firstPress = false;

            this.timer = setTimeout(() => {
                if (this.internetStatus === false) {
                    this.state.internetAlert == 0 && this.internetPouup()
                    this.setState({ internetAlert: 1 })
                } else {

                    this.setState({ disabled: true })
                    this.setState({ visible: true, disabled: false })
                }
                this.firstPress = true;
                this.timer = false;
            }, this.delayTime);

            // mark the last time of the press
            this.lastTime = now;
        } else {
            if (now - this.lastTime < this.delayTime) {

                this.timer && clearTimeout(this.timer);

                if (this.internetStatus === false) {
                    this.state.internetAlert == 0 && this.internetPouup()
                    this.setState({ internetAlert: 1 })
                }
                else {
                    this.setState({ disabled: true })
                    this.onProductImageDoubleTap()
                }
                this.firstPress = true;
            }
        }
    }

    fadeIn = () => {
        this.setState({ animatedImage: true })
        Animated.timing(this.state.fadeAnimation, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
        }).start();

        setTimeout(() => {
            this.fadeOut()
        }, 1800)
    };

    fadeOut = () => {
        Animated.timing(this.state.fadeAnimation, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
        }).start();
        setTimeout(() => {
            this.setState({ animatedImage: false, disabled: false })
        }, 1000);
    };


    postsView = () => {
        console.log('this.userImagesthis.userImages',this.userImages);
        return this.userImages && this.userImages.length > 0 ?
            this.userImages.map((x, index) => {
                let ratio = (x.width && x.height) ? x.width / x.height : 1.67
                let _height = x.height ? x.height : "100%"
                let _width = x.width ? x.width : "100%"
                return (
                    <View
                        onLayout={event => {
                            const { layout } = event.nativeEvent;
                            setTimeout(() => {

                                (this?.state?.readMoreAndLessText == false && !this?.props?.timeLine?.onLoad) && this.scrollToRow(index, x, layout)
                            }, 100);
                        }}>
                        {this.state.imagePressIndex == index &&
                            <View style={{ display: this.state.animatedImage == false ? 'none' : 'flex', position: 'absolute', zIndex: 9999999, alignSelf: 'center', height: '100%', justifyContent: 'center' }}>
                                <Animated.Image
                                    source={require('../MyTimeLine/Images/thumbs_up.gif')}
                                    style={{
                                        display: this.state.animatedImage == false ? 'none' : 'flex',
                                        height: 100, width: 100,
                                        opacity: this.state.fadeAnimation,
                                    }}
                                    resizeMode="cover"
                                />
                            </View>}

                        <View style={{
                            backgroundColor: 'rgb(240,240,240)',
                            padding: 8
                        }}>
                            {
                                x.type == 'video' ?
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({ isScrolling: true })
                                            if (this.internetStatus === false) {
                                                this.state.internetAlert == 0 && this.internetPouup()
                                                this.setState({ internetAlert: 1 })
                                            } else {
                                                this.props.navigation.navigate("VideoPreview", {
                                                    response: { media: x.media },
                                                    thumbnail: x.thumbnail,
                                                    terminalResult: { id: x?._id },
                                                    screen: "timeLineDetail",
                                                    type: "video",
                                                    ratio: ratio,
                                                    _height: _height,
                                                    _width: _width,
                                                })
                                            }
                                        }}
                                    >
                                        <ImageBackground
                                            source={{ uri: imageBaseUrl + x.thumbnail }}
                                            style={[{ alignItems: 'center', aspectRatio: ratio, justifyContent: "center", }]}
                                        >
                                            <CachedImage
                                                source={AppImages.images.play}
                                                style={{ height: 40, width: 40, }}
                                                resizeMode='contain'
                                            />
                                        </ImageBackground>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity
                                        // style={{zIndex:999999999}}
                                        disabled={this.state.disabled}
                                        activeOpacity={1} onPress={(e) => this._onTap(index, x, e.nativeEvent)}>

                                        <Image
                                            style={{ aspectRatio: ratio }}
                                            source={{ uri: imageBaseUrl + x.media }}
                                        />
                                    </TouchableOpacity>
                            }
                        </View>
                        <View style={{ backgroundColor: '#fff', height: 5, }} />
                    </View>
                )

            })
            :
            mediaImages3.map((x, index) => {
                let ratio = (x.width && x.height) ? x.width / x.height : 1.67
                let _height = x.height ? x.height : "100%"
                let _width = x.width ? x.width : "100%"
                return (
                    <View
                        onLayout={event => {
                            const { layout } = event.nativeEvent;
                            setTimeout(() => {

                                (this?.state?.readMoreAndLessText == false && !this?.props?.timeLine?.onLoad) && this.scrollToRow(index, x, layout)
                            }, 100);
                        }}>
                        {this.state.imagePressIndex == index &&
                            <View style={{ display: this.state.animatedImage == false ? 'none' : 'flex', position: 'absolute', zIndex: 9999999, alignSelf: 'center', height: '100%', justifyContent: 'center' }}>
                                <Animated.Image
                                    source={require('../MyTimeLine/Images/thumbs_up.gif')}
                                    style={{ height: 100, width: 100, opacity: this.state.fadeAnimation, }}
                                    resizeMode="cover"
                                />
                            </View>
                        }

                        <View style={{
                            backgroundColor: 'rgb(240,240,240)',
                            padding: 8
                        }}>
                            {
                                x.type == 'video' ?
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({ isScrolling: true })
                                            if (this.internetStatus === false) {
                                                this.state.internetAlert == 0 && this.internetPouup()
                                                this.setState({ internetAlert: 1 })
                                            } else {
                                                this.props.navigation.navigate("VideoPreview", {
                                                    response: { media: x.media },
                                                    thumbnail: x.thumbnail,
                                                    terminalResult: { id: x?._id },
                                                    screen: "timeLineDetail",
                                                    type: "video",
                                                    ratio: ratio,
                                                    _height: _height,
                                                    _width: _width,
                                                })
                                            }
                                        }}
                                    >
                                        <ImageBackground
                                            source={{ uri: imageBaseUrl + x.thumbnail }}
                                            style={[{ alignItems: 'center', aspectRatio: ratio, justifyContent: "center", }]}
                                        >
                                            <CachedImage
                                                source={AppImages.images.play}
                                                style={{ height: 40, width: 40, }}
                                                resizeMode='contain'
                                            />
                                        </ImageBackground>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity
                                        // style={{zIndex:999999999}}
                                        disabled={this.state.disabled}
                                        activeOpacity={1} onPress={(e) => this._onTap(index, x, e.nativeEvent)}>

                                        <Image
                                            style={{ aspectRatio: ratio }}
                                            source={{ uri: imageBaseUrl + x.media }}
                                        />
                                    </TouchableOpacity>
                            }
                        </View>
                        <View style={{ backgroundColor: '#fff', height: 5, }} />
                    </View>
                )

            })
    }


    handleLayoutChange() {
        this.feedPost.measure((fx, fy, width, height, px, py) => {

            this.setState({ yAxis: py })
        })
    }


    //bottom view
    bottomView = () => {
        return (
            <>
                <View
                    onLayout={(event) => { this.handleLayoutChange(event) }}
                    ref={view => { this.feedPost = view; }}
                    style={[styles.likeShareView, { paddingVertical: 20 }]}>
                    <View >
                        <AnimationScreen
                            isScrolling={this.state.isScrolling}
                            isDetail={true}
                            ref={(ref) => this.animationRef = ref}
                            quickTouch={(val) => { this.likePress(this.props.timeLine?.detail, val) }}
                            emojiSelected={(val) => { this.likePress(this.props.timeLine?.detail, val) }}
                            isTouchStart={() => this.setState({ scrollEnable: false, isScrolling: false })}
                            isTouchEnd={() => { this.setState({ scrollEnable: true }) }}
                            yAxis={this.state.yAxis}
                            reactionType={this.props.timeLine?.detail?.reactionType?.type}
                            isLike={this.props.timeLine.detail.is_like}

                            ref={(ref) => this.likeRef = ref}
                        />
                    </View>
                    <TouchableHighlight
                        underlayColor='rgba(0,0,0,0.3)'
                        onPress={() => {
                            this.setState({ isScrolling: true })
                            this.props.navigation.navigate('comments', { item: this.props.route.params.item, imagesArray: this.props.route.params.imagesArray })
                        }}
                        style={styles.touchableHighlightView}>
                        <>
                            <FontAwesome name='comment-o' size={20} color={"gray"} />
                            <Text style={[styles.userPostsText, { fontSize: 14, marginLeft: 5, color: 'gray' }]}>{I18n.t('Comment')}</Text>
                        </>
                    </TouchableHighlight>
                    <TouchableHighlight
                        underlayColor='rgba(0,0,0,0.3)'
                        onPress={() => this.actionSheet(this.props.route.params.item)}
                        style={[styles.touchableHighlightView, { marginRight: 4 }]}>
                        <>
                            <Image source={require('../../Images/sharePost.png')} style={{ height: 20, width: 20, tintColor: 'gray' }} />
                            <Text style={[styles.userPostsText, { fontSize: 14, marginLeft: 5, color: 'gray' }]}>{I18n.t('Share')}</Text>
                        </>
                    </TouchableHighlight>

                </View>

            </>
        )
    }

    _renderItem = (item, type) => {
        let mediaImages = []
        mediaImages2 = []
        if (type == 'routes') {
            mediaImages.push({ 'media': item?.image, 'thumbnail': null, receipt_private: '0' })
            if (item?.route_medias) {
                if (item?.route_medias.length > 0) {
                    if (item?.receipt_private == true) {
                        item?.route_medias.map((x) => {
                            if (x.type !== 'interchange_file') {
                                mediaImages.push(x)
                            }
                        })
                    }
                    else {
                        item?.route_medias.map((x) => {

                            mediaImages.push(x)

                        })
                    }


                }
            }
            if (item?.medias) {
                item?.medias?.length > 0 && item?.medias.map((mm) => {
                    if (mm.is_video) {

                        mediaImages.push({ 'media': mm.url, 'thumbnail': mm.thumbnail, receipt_private: '0', type: 'video' })
                    }
                    else {
                        mediaImages.push({ 'media': mm.url, 'thumbnail': null, receipt_private: '0', type: 'image' })
                    }
                })
            }
        }
        else {
            if (item?.images?.length == 0 && item?.video == null) {
            }
            else {
                if (item?.images) {
                    if (item?.images.length > 0) {
                        item?.images.map((x) => {

                            mediaImages.push({ 'media': x.url, 'thumbnail': null, receipt_private: '0' })
                            mediaImages2.push({ 'media': { uri: imageBaseUrl + x.url }, 'thumbnail': null, receipt_private: '0', type: 'image', _id: x._id })

                        })
                        if (item?.video) {
                            mediaImages.push({ 'media': item?.video, 'thumbnail': item?.thumbnail_image ? item?.thumbnail_image : null, receipt_private: '0', type: 'video' })
                            mediaImages2.push({ 'media': { uri: imageBaseUrl + item?.video }, 'thumbnail': item?.thumbnail_image ? { uri: imageBaseUrl + item?.thumbnail_image } : null, receipt_private: '0', type: 'video' })
                        }
                    }
                    else {
                        mediaImages.push({ 'media': item?.video, 'thumbnail': item?.thumbnail_image ? item?.thumbnail_image : null, receipt_private: '0', type: 'video' })
                        mediaImages2.push({ 'media': { uri: imageBaseUrl + item?.video }, 'thumbnail': item?.thumbnail_image ? { uri: imageBaseUrl + item?.thumbnail_image } : null, receipt_private: '0', type: 'video' })

                    }
                }
                else {
                    mediaImages.push({ 'media': item?.video, 'thumbnail': item?.thumbnail_image ? item?.thumbnail_image : null, receipt_private: '0', type: item?.media_type ? item?.media_type : 'video' })
                    mediaImages2.push({ 'media': imageBaseUrl + item?.video, 'thumbnail': item?.thumbnail_image ? imageBaseUrl + item?.thumbnail_image : null, receipt_private: '0', type: item?.media_type ? item?.media_type : 'video' })

                }
            }
        }



    };

    render() {
        let headerTitle = this.props.timeLine.detail?.shared_by ?
            this.props.timeLine.detail?.shared_by.userName
            :
            this.props.timeLine.detail?.user?.userName
        return (
            <View style={styles.container}>
                <Loader loading={this.props.timeLine.onLoad||this.state.loading} />
                <ImageView
                    onImageIndexChange={(index) => this.setState({ imagePressIndex1: index })}
                    openActionSheet={() => {
                        console.log('mediaImages3mediaImages3', mediaImages3);
                        this.actionSheetModalPress(mediaImages3[this.state.imagePressIndex1].media, mediaImages3[this.state.imagePressIndex1]?.height, mediaImages3[this.state.imagePressIndex1]?.width)
                    }
                    }
                    swipeToCloseEnabled={false}
                    images={mediaImages3}
                    imageIndex={this.state.imagePressIndex}
                    visible={this.state.visible}
                    onRequestClose={() => this.setState({ visible: false })}
                />

                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    options={[I18n.t('Cancel'), I18n.t('shareasPost'), I18n.t('DeeplinkShare')]}
                    cancelButtonIndex={0}
                    onPress={(index) => { this.androidActionSheetPress(index) }}
                />

                <ActionSheet
                    ref={o => this.ActionSheet2 = o}
                    options={!this.props.timeLine?.detail?.route_id && !this.props.timeLine?.detail?.shared_by ? [I18n.t('Cancel'), I18n.t('Edit'), I18n.t('Delete')] : [I18n.t('Cancel'), I18n.t('Delete')]}
                    destructiveButtonIndex={2}
                    cancelButtonIndex={0}
                    onPress={(index) => { this.androidActionSheetPress2(index) }}
                />
                <ActionSheet
                    ref={o => this.ActionSheet3 = o}
                    options={[I18n.t('Cancel'), I18n.t('saveToPhone')]}
                    cancelButtonIndex={0}
                    onPress={(index) => { this.androidActionSheetPress3(index) }}
                />
                {Platform.OS == 'ios' ?
                    <View style={{ height: '11%' }}>
                        <Header
                            multiButton
                            rightVector={this.props.timeLine?.detail?.shared_by ? this.props.timeLine.detail.shared_by._id == this.state.userDetail ? 'ellipsis-v' : null : this.state.userDetail == this.props.timeLine?.detail?.user?._id ? 'ellipsis-v' : null}
                            headerTitle={
                                headerTitle ? headerTitle + "'s" + ' ' + I18n.t('post') : ''
                            }
                            leftImageSource={AppImages.images.back}
                            leftbackbtnPress={() => { this.goBAck(this.props.navigation) }}
                            rightBackBtnPress={() => {
                                this.props.timeLine?.detail?.shared_by ? this.props.timeLine.detail.shared_by._id == this.state.userDetail ?
                                    this.actionSheet2(this.props.navigation)
                                    : null : this.state.userDetail == this.props.timeLine?.detail?.user?._id ?
                                    this.actionSheet2(this.props.navigation)
                                    : null
                            }}

                        />
                    </View> :
                    <Header
                        multiButton
                        rightVector={this.props.timeLine?.detail?.shared_by ? this.props.timeLine.detail.shared_by._id == this.state.userDetail ? 'ellipsis-v' : null : this.state.userDetail == this.props.timeLine?.detail?.user?._id ? 'ellipsis-v' : null}
                        headerTitle={
                            headerTitle ? headerTitle + "'s" + ' ' + I18n.t('post') : ''
                        }
                        leftImageSource={AppImages.images.back}
                        leftbackbtnPress={() => { this.goBAck(this.props.navigation) }}
                        rightBackBtnPress={() => {
                            this.props.timeLine?.detail?.shared_by ? this.props.timeLine.detail.shared_by._id == this.state.userDetail ?
                                this.actionSheet2(this.props.navigation)
                                : null : this.state.userDetail == this.props.timeLine?.detail?.user?._id ?
                                this.actionSheet2(this.props.navigation)
                                : null
                        }}
                    />
                }

                {this.props.timeLine.detail ?
                    <ScrollView
                        onScroll={() => this.setState({ isScrolling: true })}
                        keyboardShouldPersistTaps='always'
                        style={{ flexGrow: 1, flex: 1 }}
                        showsVerticalScrollIndicator={false}
                        ref={view => this._scrollView = view}
                        keyboardDismissMode={'on-drag'}
                    >
                        {this.header()}

                        {this.postsView()}
                        {!this.props.timeLine?.detail?.route_id ? this.props.timeLine?.detail?.media_type !== 'text' &&


                            this.props.timeLine.detail?.images?.length > 0 ?
                            this._renderItem(this.props.timeLine.detail, 'images')
                            :
                            this.props.timeLine.detail?.route_id ?
                                this._renderItem(this.props.timeLine.detail?.route_id, 'routes')
                                :
                                this._renderItem(this.props.timeLine.detail, 'images')


                            :

                            this._renderItem(this.props.timeLine.detail?.route_id, 'routes')



                        }
                    </ScrollView>
                    :

                    <Loader loading={this.props.timeLine.onLoad||this.state.loading} />
                }
                {this.props?.timeLine?.detail && this.bottomView()}
            </View>


        )
    }
}
function mapStateToProps(state) {
    return {
        timeLine: state.timeLine,
        Profile: state.Profile,

        myPostsState: state.MyPostsState,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        timeLineComment,
        timeLinePostDetail,
        timeLinePostDetailClear,
        deleteComemnt,
        deleteTimeLinePost,
        timelinePostLikeAction,
        timeLineShare,
        clearProfileData
    }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PostFullView);