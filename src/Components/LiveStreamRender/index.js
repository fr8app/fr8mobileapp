import React, { Component } from 'react';
import {
    Animated,
    Text,
    View,
    TouchableOpacity,
    Image,
    Dimensions,
    ImageBackground,
    Platform,
    ActivityIndicator,
    TouchableHighlight,
    Alert,
    Linking
} from 'react-native';
import styles from './styles'
import { CachedImage } from './../react-native-cached-image-master'
import { AppColor, AppImages, AppFontFamily } from '../../Themes'
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import Swiper from 'react-native-swiper';
import DataManager from "../DataManager";
import ViewPager from '@react-native-community/viewpager';
import Dots from 'react-native-dots-pagination';
import { getReactionType, imageBaseUrl } from '../../Config'
import I18n from 'react-native-i18n'
import FBCollage from '../../../libs/react-native-fb-collage';
import NetInfo from '@react-native-community/netinfo';
import AnimationScreen from '../../Screens/MyTimeLine/amination/Animation/Animation.Screen';
import Hyperlink from 'react-native-hyperlink'
import dateDifferenceInDays from '../dateDifferenceInDays';
import WebView from 'react-native-webview';
import ReadMore from 'react-native-read-more-text';
const width = Dimensions.get('screen').width
let interval = null
export default class LiveStreamRender extends Component {
    constructor(props) {
        super(props)
        this.state = {
            lines: 5,
            onReady: false,
            yAxis: 0,
            toolTipShow: false,
            disabled: false,
            userDetail: null,
            pageIndShow: true,
            index: 0,
            mediaLength: 0,
            imageLoad: false,
            random: new Date().getTime(),
            internetAlert: 0,
            isClicked: false,
            likeControllerOpen: false,
            likeAnimRef: null,
            animatedImage: false,
            fadeAnimation: new Animated.Value(0),
            isTerminalDetailsVisible: true

        }
        this.interval = null
        this.imageArray = []
        this.internetStatus = null
        if (this.props.timeLineScreen) {
            this.props?.cardRef(this)
        }
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

    fadeIn = () => {
        this.setState({ animatedImage: true })
        Animated.timing(this.state.fadeAnimation, {
            toValue: 10,
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

    _getMediaArray = () => {
        let arr = []
        if (this.props.mediaImages && this.props.mediaImages.length > 0 && this.props.imagesArray.length == 1) {
            let ar1 = [];
            for (let i in this.props.mediaImages) {
                Image.getSize((imageBaseUrl + this.props.mediaImages[i].media), (width, height) => {
                    let obj = {
                        media: imageBaseUrl + this.props.mediaImages[i].media,
                        height: this.props.mediaImages[i].height,
                        width: this.props.mediaImages[i].width
                    }
                    ar1.push(obj);
                    arr.push(obj)
                })
            }
        }

    }

    componentDidMount() {
        this.setState({ isClicked: false })
        this.checkInternetConnection()
        this.renderMount()
        DataManager.getUserDetails().then(async response => {
            if (response) {
                let parseData = await JSON.parse(response)
                this.setState({ userDetail: parseData?.data?._id })
            }
        });
    }


    renderMount = () => {
        clearInterval(this.interval)
        if (this.props.imagePreload) {
            this.interval = setInterval(() => {
                this.setState({ random: new Date().getTime() })
                if (this.props.postSource?.length - 1 > this.state.index) {
                    this.viewPagerRef?.setPage(this.state.index + 1)
                }
                else {
                    this.viewPagerRef?.setPage(0)
                }

            }, 10000);
        }
    }
    renderUnMount = () => {
        clearInterval(this.interval)
    }

    renderItem = (x, index) => {
        return (
            this.state.userDetail && this.state.userDetail == x.user_id ?
                x.type == 'video' ?
                    <View style={styles.backImage}>
                        <TouchableOpacity onPress={() => {
                            if (this.internetStatus === false) {
                                this.state.internetAlert == 0 && this.internetPouup()
                                this.setState({ internetAlert: 1 })
                            } else {
                                this.props.startVideo(x, x.thumbnail)
                            }
                        }}>
                            <ImageBackground style={styles.backImage} source={{ uri: imageBaseUrl + x.thumbnail }} resizeMode="cover"  >
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <CachedImage
                                        source={AppImages.images.play}
                                        resizeMode="contain"
                                        style={styles.playButton} />
                                </View>

                            </ImageBackground>
                        </TouchableOpacity>
                    </View>
                    :
                    <TouchableOpacity activeOpacity={1}>
                        <View style={styles.backImage}>
                            <CachedImage resizeMode={this.props.userPostResized ? this.props.userPostResized : "stretch"} source={{ uri: x.thumbnail == null || x.thumbnail == '' ? imageBaseUrl + x.media : imageBaseUrl + x.thumbnail }} style={[styles.postImage]} />
                        </View>
                    </TouchableOpacity>
                :
                x.receipt_private == false ?
                    x.type == 'video' ?
                        <View style={styles.backImage}>
                            <TouchableOpacity onPress={() => {
                                if (this.internetStatus === false) {
                                    this.state.internetAlert == 0 && this.internetPouup()
                                    this.setState({ internetAlert: 1 })
                                } else {
                                    this.props.startVideo(x, x.thumbnail)
                                }
                            }}>
                                <ImageBackground style={styles.backImage} source={{ uri: imageBaseUrl + x.thumbnail }} resizeMode="cover"  >
                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                        <CachedImage source={AppImages.images.play} resizeMode="contain" style={styles.playButton} />
                                    </View>
                                </ImageBackground>
                            </TouchableOpacity>

                        </View>
                        :
                        this.props.receipt == '1' ?
                            x.type == 'interchange_file' ?
                                null :
                                <TouchableOpacity activeOpacity={1}>
                                    <View style={styles.backImage}>
                                        <CachedImage resizeMode={this.props.userPostResized ? this.props.userPostResized : "stretch"} source={{ uri: x.thumbnail == null || x.thumbnail == '' ? imageBaseUrl + x.media : imageBaseUrl + x.thumbnail }} style={[styles.postImage]} />
                                    </View>
                                </TouchableOpacity>
                            :
                            <TouchableOpacity activeOpacity={1}>
                                <CachedImage resizeMode={this.props.userPostResized ? this.props.userPostResized : "stretch"} source={{ uri: x.thumbnail == null || x.thumbnail == '' ? imageBaseUrl + x.media : imageBaseUrl + x.thumbnail }} style={[styles.postImage]} />
                                {index == 0 && <View style={{ position: 'absolute', width: '100%', bottom: 10 }}>
                                    {this.props.startTime ?
                                        <View style={styles.startEndView}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={[styles.userPostsText, { marginLeft: 0, fontSize: 14, color: this.props.timeLineScreen ? "#fff" : AppColor.colors.white }]}>{I18n.t('start_time')}:</Text>
                                                <Text style={[styles.userPostsText, { fontSize: 14, marginLeft: 5, color: this.props.timeLineScreen ? "#fff" : AppColor.colors.white }]}>{this.props.startTime}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text numberOfLines={1} style={[styles.userPostsText, { fontSize: 14, color: this.props.timeLineScreen ? "#fff" : AppColor.colors.white, maxWidth: '80%' }]}>{I18n.t('endTime')}:</Text>
                                                <Text style={[styles.userPostsText, { fontSize: 14, marginLeft: 5, color: this.props.timeLineScreen ? "#fff" : AppColor.colors.white }]}>{this.props.endTime}</Text>
                                            </View>
                                        </View> : null}
                                    {this.props.minute ? <View style={styles.minuteView}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <FontAwesome name='dashboard' size={16} color={"#fff"} />
                                            <Text style={[styles.userPostsText, { fontSize: 14, marginLeft: 5, color: this.props.timeLineScreen ? "#fff" : AppColor.colors.black }]}>{this.props.dis} mi</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Icon name='query-builder' size={20} color={"#fff"}></Icon>
                                            <Text style={[styles.userPostsText, { fontSize: 14, marginLeft: 5, color: this.props.timeLineScreen ? "#fff" : AppColor.colors.black }]}>{this.props.minute}</Text>
                                        </View>
                                    </View> : null}
                                </View>}
                            </TouchableOpacity>
                    : null
        )
    }

    _renderSingleImage = (mediaData) => {

        return (
            <TouchableOpacity onPress={() => {
                if (this.internetStatus === false) {
                    this.state.internetAlert == 0 && this.internetPouup()
                    this.setState({ internetAlert: 1 })
                } else {
                    this.props.ImagePress(mediaData[0])
                }

            }}
                style={{ aspectRatio: isNaN(mediaData[0]?.width / mediaData[0]?.height) ? 1.87 : mediaData[0]?.width / mediaData[0]?.height, }}
            >

                {
                    <CachedImage
                        source={{ uri: imageBaseUrl + mediaData[0].media }}
                        style={{ height: '100%', width: '100%' }}
                    />
                }
            </TouchableOpacity>
        )



    }

    checkInternetConnection() {
        // NetInfo.isConnected.addEventListener(
        //     "connectionChange",
        //     this.handleConnectionChange
        // );
        NetInfo.addEventListener(state =>
            this.handleConnectionChange(state.isConnected)
        );
    }

    handleConnectionChange = isConnected => {
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
                        this.setState({ internetAlert: 0 })
                    }
                },
            ],
            { cancelable: false },
        )
    }
    handleLayoutChange() {
        this.feedPost.measure((fx, fy, width, height, px, py) => {

            this.setState({ yAxis: py })
        })
    }


    render() {
        return (
            <TouchableOpacity
                onLayout={(event) => { this.handleLayoutChange(event) }}
                ref={view => { this.feedPost = view; }}
                activeOpacity={1}
                onPress={() => {
                    if (this.internetStatus === false) {
                        this.state.internetAlert == 0 && this.internetPouup()
                        this.setState({ internetAlert: 1 })
                    } else {
                        !this.state.isClicked &&
                            this.props.shared_by ?
                            this.props.onCommentPress()
                            :
                            this?.props?.onPress()
                    }
                }} style={[{
                    flex: 1, marginBottom: this.props.marginBottom ? this.props.marginBottom : 20,
                }, this.props.timeLineScreen ? {
                    shadowColor: 'black',
                    shadowOffset: {
                        width: 0.5,
                        height: 0.5,
                    },
                    elevation: 5,
                    shadowRadius: 3,
                    shadowOpacity: 0.4,
                    backgroundColor: '#fff',
                    borderRadius: 5
                } : this.props.routeList ?
                    {
                        shadowColor: 'black',
                        shadowOffset: {
                            width: 0.5,
                            height: 0.5,
                        },
                        elevation: 5,
                        shadowRadius: 3,
                        shadowOpacity: 0.4,
                        backgroundColor: '#fff',
                        borderRadius: 5
                    }


                    : null]}>
                {this.props.timeLineScreen ?
                    <View style={[{
                        paddingTop: 15, paddingHorizontal: 10, borderTopRightRadius: 10, borderTopLeftRadius: 10
                    }]}>

                        <View style={{ flexDirection: 'row', width: '100%' }}>
                            <TouchableOpacity
                                onPress={() => this.props.onUserPress()}
                                style={{ borderRadius: 45 / 2, height: 45, width: 45, }}>
                                <CachedImage resizeMode='cover' source={this.props.shared_by ? this.props.sharedUserImage : this.props.userImage} style={styles.userImage} />
                            </TouchableOpacity>
                            {this.props.shared_by ?
                                <View style={{ justifyContent: 'center', width: '85%' }}>

                                    <Text
                                        //  onPress={() => this.props.onUserPress()}
                                        numberOfLines={5}
                                        style={[styles.userPostsText,
                                        { textAlign: "left", flex: 1, marginLeft: 15, fontWeight: '800', width: '95%', fontFamily: AppFontFamily.fontFamily.bold }]}>
                                        <Text
                                            onPress={() => this.props.onUserPress()}
                                            numberOfLines={5}
                                            style={[styles.userPostsText,
                                            { textAlign: "left", flex: 1, marginLeft: 15, fontWeight: '800', width: '95%', fontFamily: AppFontFamily.fontFamily.bold }]}>
                                            {this.props.shared_by}
                                        </Text>
                                        <Text numberOfLines={2} style={[styles.userPostsText, { fontWeight: '100', fontSize: 16 }]}>

                                            {' ' + I18n.t('hasShared') + ''}
                                        </Text>
                                        <Text onPress={() => {
                                            this.props.onSharedUserPress(this.props.sharedUSerDetail)
                                        }}>

                                            {' ' + this.props.mainUser + "'s"}
                                        </Text>
                                        <Text numberOfLines={2} style={[styles.userPostsText, { fontWeight: '100', fontSize: 16 }]}>

                                            {' ' + I18n.t('post') + '.'}
                                        </Text>
                                    </Text>
                                    <Text numberOfLines={2} style={[styles.userPostsText, { textAlign: "left", color: 'gray', flex: 1, fontSize: 12, marginLeft: 15, }]}>{this.props.createdDate}</Text>
                                </View>
                                :
                                <View style={{ justifyContent: 'center', width: '85%' }}>
                                    <Text
                                        numberOfLines={5}
                                        style={[styles.userPostsText, { textAlign: "left", flex: 1, marginLeft: 15, fontWeight: '800', width: '95%' }]}>
                                        <Text
                                            style={{ fontFamily: AppFontFamily.fontFamily.bold }}
                                            onPress={() => this.props.onUserPress()}
                                        >{this.props.userName}</Text>
                                        {this.props?.tags?.length > 0 && <Text
                                            numberOfLines={3}
                                            onPress={() => {
                                                if (this.internetStatus === false) {
                                                    this.state.internetAlert == 0 && this.internetPouup()
                                                    this.setState({ internetAlert: 1 })
                                                } else {
                                                    this.props.onOtherPress()
                                                }
                                            }}
                                            style={[
                                                styles.userPostsText,
                                                {
                                                    textAlign: "left",
                                                    flex: 1,
                                                    marginLeft: 15,
                                                    fontWeight: 'normal',
                                                    lineHeight: 18,
                                                },
                                            ]}
                                        >{' - ' + I18n.t('With')} <Text
                                            style={[
                                                styles.userPostsText,
                                                {
                                                    textAlign: "left",
                                                    flex: 1,
                                                    marginLeft: 15,
                                                    fontWeight: "bold",
                                                    lineHeight: 18,
                                                    width: '80%'
                                                },
                                            ]}>
                                                {this.props.tags[0].userName}
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.userPostsText,
                                                    {
                                                        textAlign: "left",
                                                        flex: 1,
                                                        marginLeft: 15,
                                                        fontWeight: 'normal',
                                                        lineHeight: 18,
                                                    },
                                                ]}>
                                                {this.props.tags.length > 2 && ' ' + [I18n.t('And').toLowerCase()] + ' ' + (this.props.tags.length - 1) + ' ' + I18n.t('others')}
                                            </Text>

                                            {this.props.tags.length == 2 &&
                                                <Text style={[styles.userPostsText,
                                                {
                                                    textAlign: "left",
                                                    marginLeft: 15,
                                                    fontWeight: "normal",
                                                    lineHeight: 18,
                                                    width: '95%'
                                                },
                                                ]}
                                                >{' ' + I18n.t('And').toLowerCase() + ' '}
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
                                                                width: '95%'
                                                            },
                                                        ]}>
                                                        {' ' + this.props.tags[1].userName}
                                                    </Text>
                                                </Text>
                                            }

                                        </Text>
                                        }

                                        {
                                            this.props.postLocation &&
                                            <Text
                                                style={[
                                                    styles.userPostsText,
                                                    {
                                                        textAlign: "left",
                                                        // flex: 1,
                                                        marginLeft: 15,
                                                        fontWeight: "normal",
                                                        lineHeight: 18,
                                                        width: '95%'
                                                    },
                                                ]}>
                                                {` ${I18n.t("in")} `}
                                            </Text>
                                        }
                                        {this.props.postLocation &&
                                            <Text
                                                numberOfLines={3}
                                                style={[
                                                    styles.userPostsText,
                                                    {
                                                        textAlign: "left",
                                                        // flex: 1,
                                                        marginLeft: 15,
                                                        fontWeight: "700",
                                                        lineHeight: 18,
                                                        width: '95%'
                                                    },
                                                ]}>
                                                {this.props.postLocation}
                                            </Text>}
                                    </Text>
                                    {this.props.terminalName && <Text numberOfLines={2} style={[styles.userPostsText, { textAlign: "left", flex: 1, marginLeft: 15, fontSize: 14 }]}>{this.props.terminalName}</Text>}
                                    <Text numberOfLines={2} style={[styles.userPostsText, { textAlign: "left", color: 'gray', flex: 1, fontSize: 12, marginLeft: 15, }]}>{this.props.createdDate}</Text>
                                </View>
                            }
                            {this.props.isSelf && <TouchableOpacity style={{ marginRight: 10, paddingHorizontal: 5, width: 40 }} onPress={() => this.props.openActionSheet()} >
                                <FontAwesome name={"ellipsis-v"} size={20} color="gray" />
                            </TouchableOpacity>}
                        </View>
                        {this.props.shared_by &&
                            <Hyperlink
                                onPress={(url, text) => Linking.openURL(url)}
                                linkStyle={{ color: '#2980b9', fontSize: 15 }}>
                                {this.props?.sharePostDetail?.description && <ReadMore
                                    numberOfLines={this.state.lines}
                                    renderTruncatedFooter={this._renderTruncatedFooter}
                                    renderRevealedFooter={this._renderRevealedFooter}
                                    onReady={() => this.setState({ lines: 6 })}
                                >
                                    {<Text
                                        numberOfLines={5}
                                        style={[styles.userPostsText, { marginTop: 5, fontSize: 14, textAlign: "left", flex: 1, marginLeft: 0, }]}>
                                        {this.props?.sharePostDetail?.description}
                                    </Text>}
                                </ReadMore>}
                            </Hyperlink>
                        }
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => this.props.onSharedPostPress()}
                            style={{ marginTop: 10, backgroundColor: this.props.shared_by ? 'rgb(240,240,240)' : 'white', paddingVertical: 0 }}>
                            {this.props.shared_by ?
                                <View style={{ flexDirection: 'row', width: '100%', paddingHorizontal: '3%', paddingVertical: 10, alignSelf: 'center', backgroundColor: 'rgb(240,240,240)' }}>
                                    <TouchableOpacity
                                        onPress={() => this.props.onSharedUserPress(this.props.sharedUSerDetail)}
                                        style={{ borderRadius: 40 / 2, height: 40, width: 40 }}>
                                        <CachedImage resizeMode='cover' source={this.props.userImage} style={[styles.userImage, { height: 40, width: 40, borderRadius: 20 }]} />
                                    </TouchableOpacity>
                                    <View style={{ justifyContent: 'center', width: '90%' }}>
                                        <Text
                                            numberOfLines={5}
                                            style={[styles.userPostsText, { fontFamily: AppFontFamily.fontFamily.bold, fontSize: 14, textAlign: "left", flex: 1, marginLeft: 10, fontWeight: '800', width: '95%' }]}>
                                            <Text
                                                onPress={() => this.props.onSharedUserPress(this.props.sharedUSerDetail)}
                                            >{this.props.userName}</Text>
                                            {this.props?.tags?.length > 0 && <Text
                                                numberOfLines={3}
                                                onPress={() => {
                                                    if (this.internetStatus === false) {
                                                        this.state.internetAlert == 0 && this.internetPouup()
                                                        this.setState({ internetAlert: 1 })
                                                    } else {
                                                        this.props.onOtherPress()
                                                    }
                                                }}
                                                style={[
                                                    styles.userPostsText,
                                                    {
                                                        textAlign: "left",
                                                        flex: 1,
                                                        marginLeft: 10,
                                                        fontWeight: 'normal',
                                                        lineHeight: 18,
                                                    },
                                                ]}
                                            >{' - ' + I18n.t('With')} <Text
                                                style={[
                                                    styles.userPostsText,
                                                    {
                                                        textAlign: "left",
                                                        flex: 1,
                                                        marginLeft: 10,
                                                        fontWeight: "bold",
                                                        lineHeight: 18,
                                                        width: '80%'
                                                    },
                                                ]}>
                                                    {this.props.tags[0].userName}
                                                </Text>
                                                <Text
                                                    style={[
                                                        styles.userPostsText,
                                                        {
                                                            textAlign: "left",
                                                            flex: 1,
                                                            marginLeft: 10,
                                                            fontWeight: 'normal',
                                                            lineHeight: 18,
                                                        },
                                                    ]}>
                                                    {this.props.tags.length > 2 && ' ' + [I18n.t('And').toLowerCase()] + ' ' + (this.props.tags.length - 1) + ' ' + I18n.t('others')}
                                                </Text>
                                                {this.props.tags.length == 2 &&
                                                    <Text style={[styles.userPostsText,
                                                    {
                                                        textAlign: "left",
                                                        marginLeft: 10,
                                                        fontWeight: "normal",
                                                        lineHeight: 18,
                                                        width: '95%'
                                                    },
                                                    ]}
                                                    >{' ' + I18n.t('And').toLowerCase() + ' '}
                                                        <Text
                                                            style={[
                                                                styles.userPostsText,
                                                                {
                                                                    textAlign: "left",
                                                                    marginLeft: 10,
                                                                    fontWeight: "bold",
                                                                    lineHeight: 18,
                                                                    width: '95%'
                                                                },
                                                            ]}>
                                                            {' ' + this.props.tags[1].userName}
                                                        </Text>
                                                    </Text>
                                                }

                                            </Text>
                                            }
                                            {
                                                this.props.postLocation &&
                                                <Text
                                                    style={[
                                                        styles.userPostsText,
                                                        {
                                                            textAlign: "left",
                                                            // flex: 1,
                                                            marginLeft: 10,
                                                            fontWeight: "normal",
                                                            lineHeight: 18,
                                                            width: '95%'
                                                        },
                                                    ]}>
                                                    {` ${I18n.t("in")} `}
                                                </Text>
                                            }
                                            {this.props.postLocation &&
                                                <Text
                                                    numberOfLines={3}
                                                    style={[
                                                        styles.userPostsText,
                                                        {
                                                            textAlign: "left",
                                                            // flex: 1,
                                                            marginLeft: 15,
                                                            fontWeight: "700",
                                                            lineHeight: 18,
                                                            width: '95%'
                                                        },
                                                    ]}>
                                                    {this.props.postLocation}
                                                </Text>}
                                        </Text>
                                        {this.props.terminalName && <Text numberOfLines={2} style={[styles.userPostsText, { textAlign: "left", flex: 1, marginLeft: 10, fontSize: 14 }]}>{this.props.terminalName}</Text>}
                                        <Text numberOfLines={2} style={[styles.userPostsText, { textAlign: "left", color: 'gray', flex: 1, fontSize: 12, marginLeft: 10, }]}>{dateDifferenceInDays(this.props?.shared_post?.created_at)}</Text>
                                    </View>
                                </View>
                                : null

                            }

                            {
                                this.props.shared_by ?
                                    this.props.discription ?
                                        <View style={{ width: '100%', alignSelf: 'center', backgroundColor: 'rgb(240,240,240)', paddingHorizontal: '3%', paddingBottom: 10 }}>
                                            <Hyperlink
                                                onPress={(url, text) => Linking.openURL(url)}

                                                linkStyle={{ color: '#2980b9', fontSize: 15 }}>
                                                <Text
                                                    numberOfLines={4} style={[styles.userPostsText, { fontSize: 14, textAlign: "left", flex: 1, marginLeft: 0, }]}>
                                                    {this.props.discription}
                                                </Text>
                                            </Hyperlink>
                                        </View>
                                        : null
                                    :
                                    this.props.discription ?
                                        <View style={{}}>
                                            <Hyperlink
                                                onPress={(url, text) => Linking.openURL(url)} linkStyle={{ color: '#2980b9', fontSize: 15 }}>
                                                <Text numberOfLines={4} style={[styles.userPostsText, { fontSize: 14, textAlign: "left", flex: 1, marginLeft: 0, }]}>
                                                    {this.props.discription}
                                                </Text>
                                            </Hyperlink>
                                        </View>
                                        : null
                            }
                        </TouchableOpacity>
                    </View> : null}
                {this.props.shared_by ?
                    <TouchableOpacity activeOpacity={1} style={[styles.mainContainer, this.props.timeLineScreen ? {
                        backgroundColor: 'rgb(240,240,240)',
                        width: '95%',
                        alignSelf: 'center',
                    } :
                        this.props.routeList ? {
                            backgroundColor: 'rgb(240,240,240)',
                            width: '95%'
                        } :
                            {
                                borderTopColor: this.props.timeLineScreen ? 'transparent' : '#3b3b3c',
                                borderLeftColor: this.props.timeLineScreen ? 'transparent' : '#3b3b3c',
                                borderRightColor: this.props.timeLineScreen ? 'transparent' : '#3b3b3c',
                                borderTopRightRadius: this.props.timeLineScreen ? null : this.props.terminalDetailRadius ? 0 : 10,
                                borderTopLeftRadius: this.props.timeLineScreen ? null : this.props.terminalDetailRadius ? 0 : 10, borderWidth: this.props.terminalDetailRadius ? 0 : 1,
                                paddingHorizontal: this.props.timeLineScreen ? 0 : this.props.terminalDetailRadius ? null : 25,
                                paddingVertical: this.props.timeLineScreen ? 0 : this.props.terminalDetailRadius ? null : 15,
                                backgroundColor: this.props.timeLineScreen ? '#fff' : this.props.terminalDetailRadius ? null : '#0d131c'
                            }]}
                        onPress={() => this?.props?.onPress()}
                    >
                        <View style={{ backgroundColor: 'rgb(240,240,240)', overflow: 'hidden' }}>
                            {this.props.fullName && this.props.userSource ?
                                <View style={styles.userView}>
                                    {this.props.userSource ? <CachedImage source={this.props.userSource} resizeMode='contain' style={styles.userImage} />
                                        :
                                        null}
                                    {this.props.fullName ? <Text numberOfLines={2} style={[styles.userPostsText, { textAlign: "left", flex: 1, marginLeft: this.props.userSource ? 15 : 0 }]}>{this.props.fullName}</Text>
                                        : null}
                                </View>
                                : null}
                            {this.props.postSource ?
                                this.props.type == 'timeLinePosts' && this.props.mediaImages && this.props.mediaImages.length == 0 ?
                                    null :
                                    <View style={[styles.postImageView, {
                                        marginTop: this.props.fullName && this.props.userSource ? 20 : 0,
                                        aspectRatio: this?.props?.mediaImages?.length == 1 ? this.props.ratio !== null && this.props.ratio !== undefined && !isNaN(this.props.ratio) ? this.props.ratio : 1.87 : this.props.type == 'timeLinePosts' ? 1 : this.props.ratio !== null && this.props.ratio !== undefined && !isNaN(this.props.ratio) ? this.props.ratio : 1.87
                                    }]}
                                    >
                                        {this.props?.imagePressIndex && <View style={{ display: this.props.isAnimated == false ? 'none' : 'flex', position: 'absolute', zIndex: 9999999, alignSelf: 'center', height: '100%', justifyContent: 'center' }}>
                                            <Animated.Image
                                                source={require('../../Screens/MyTimeLine/Images/thumbs_up.gif')}
                                                style={{
                                                    display: this.props.isAnimated == false ? 'none' : 'flex',
                                                    height: 100, width: 100,
                                                    opacity: this.props.opacityOFImage,
                                                }}
                                                resizeMode="cover"
                                            />
                                        </View>}
                                        {this.props.mediaImages ? this.props.mediaImages.length > 0 ?
                                            this.props.mediaImages.length > 0 ?
                                                <FBCollage
                                                    doublePress={() => this.props.doubleTab()}
                                                    spacing={4}
                                                    arrayLength={this?.props?.mediaImages?.length}
                                                    style={{ width: '100%', height: '100%' }}
                                                    images={this?.props?.mediaImages}
                                                    imageOnPress={(item) => {
                                                        if (this.internetStatus === false) {
                                                            this.state.internetAlert == 0 && this.internetPouup()
                                                            this.setState({ internetAlert: 1 })
                                                        } else {
                                                            this.props.ImagePress(item)
                                                        }
                                                    }}
                                                />
                                                :
                                                this.props.mediaImages[0].thumbnail ?
                                                    <View style={styles.backImage}>
                                                        <TouchableOpacity onPress={() => {
                                                            if (this.internetStatus === false) {
                                                                this.state.internetAlert == 0 && this.internetPouup()
                                                                this.setState({ internetAlert: 1 })
                                                            } else {
                                                                this.props.startVideo(this.props.mediaImages[0], this.props.mediaImages[0].thumbnail)
                                                            }

                                                        }}>
                                                            <ImageBackground style={styles.backImage} source={{ uri: imageBaseUrl + this.props.mediaImages[0].thumbnail }} resizeMode="cover"  >
                                                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                                                    <CachedImage source={AppImages.images.play} resizeMode="contain" style={styles.playButton} />
                                                                </View>
                                                            </ImageBackground>
                                                        </TouchableOpacity>
                                                    </View> :
                                                    <>
                                                        <CachedImage resizeMode={this.props.userPostResized ? this.props.userPostResized : "stretch"} source={{ uri: imageBaseUrl + this.props.mediaImages[0].media }} style={[styles.postImage]} />
                                                        <View style={{ position: 'absolute', width: '100%', bottom: 10 }}>
                                                            {this.props.startTime ?
                                                                <View style={styles.startEndView}>
                                                                    <View style={{ flexDirection: 'row' }}>
                                                                        <Text style={[styles.userPostsText, { marginLeft: 0, fontSize: 14, color: this.props.timeLineScreen ? "#fff" : AppColor.colors.white }]}>{I18n.t('start_time')}:</Text>
                                                                        <Text style={[styles.userPostsText, { fontSize: 14, marginLeft: 5, color: this.props.timeLineScreen ? "#fff" : AppColor.colors.white }]}>{this.props.startTime}</Text>
                                                                    </View>
                                                                    <View style={{ flexDirection: 'row' }}>
                                                                        <Text numberOfLines={1} style={[styles.userPostsText, { fontSize: 14, color: this.props.timeLineScreen ? "#fff" : AppColor.colors.white, maxWidth: '80%' }]}>{I18n.t('endTime')}:</Text>
                                                                        <Text style={[styles.userPostsText, { fontSize: 14, marginLeft: 5, color: this.props.timeLineScreen ? "#fff" : AppColor.colors.white }]}>{this.props.endTime}</Text>
                                                                    </View>
                                                                </View> : null}
                                                            {this.props.minute ? <View style={styles.minuteView}>
                                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                    <FontAwesome name='dashboard' size={16} color={"#fff"} />
                                                                    <Text style={[styles.userPostsText, { fontSize: 14, marginLeft: 5, color: this.props.timeLineScreen ? "#fff" : AppColor.colors.black }]}>{this.props.dis} mi</Text>
                                                                </View>
                                                                <View style={{ flexDirection: 'row' }}>
                                                                    <Icon name='query-builder' size={20} color={"#fff"}></Icon>
                                                                    <Text style={[styles.userPostsText, { fontSize: 14, marginLeft: 5, color: this.props.timeLineScreen ? "#fff" : AppColor.colors.black }]}>{this.props.minute}</Text>
                                                                </View>
                                                            </View> : null}
                                                        </View>
                                                    </>
                                            :
                                            <CachedImage resizeMode={this.props.userPostResized ? this.props.userPostResized : "stretch"} source={this.props.postSource} style={[styles.postImage, this.props.routeList ? {
                                            } : null]} />
                                            :
                                            this.props.imagePreload ?
                                                <>
                                                    <ViewPager
                                                        orientation='horizontal'
                                                        scrollEnabled={this?.props?.postSource?.length > 1 ? true : false}
                                                        initialPage={0}
                                                        ref={(res) => this.viewPagerRef = res}
                                                        overScrollMode='auto'
                                                        onPageSelected={(e) => { this.setState({ index: e.nativeEvent.position }) }}
                                                        showPageIndicator={false}

                                                        style={styles.viewPager}>
                                                        {this.props.postSource.map((x, index) => {
                                                            return (
                                                                <TouchableOpacity activeOpacity={1}>
                                                                    {this.props.terminalImageType == 'url' ?
                                                                        <WebView
                                                                            scrollEnabled={false}

                                                                            source={{ uri: this.props.terminalImageType == 'url' ? x.includes('?') ? x + "&" + this.state.random : x + "?=" + this.state.random : x, cache: 'reload' }}
                                                                        />
                                                                        :

                                                                        <ImageBackground
                                                                            onLoadStart={() => this.setState({ imageLoad: true })}
                                                                            onLoadEnd={() => this.setState({ imageLoad: false })}
                                                                            onLoad={() => this.setState({ imageLoad: false })}
                                                                            resizeMode={this.props.userPostResized ? this.props.userPostResized : "cover"}
                                                                            source={{ uri: this.props.terminalImageType == 'url' ? x + "?=" + this.state.random : x, cache: 'reload' }}
                                                                            onError={e => this.setState({ imageLoad: false })}
                                                                            style={[styles.postImage, { height: '100%', justifyContent: 'center', alignItems: 'center' }, this.props.routeList ? {

                                                                            } : null]} >
                                                                            {this.state.imageLoad && <View style={{ alignSelf: 'center' }}>
                                                                                <ActivityIndicator size={25} />
                                                                            </View>}
                                                                        </ImageBackground>
                                                                    }
                                                                </TouchableOpacity>
                                                            )
                                                        })}
                                                    </ViewPager>
                                                    {(this.props.postSource && this.props.postSource.length > 0 && this.props.postSource.length > 1) &&
                                                        <View style={styles.dotView} >
                                                            <Dots
                                                                length={this.props.postSource.length}
                                                                active={this.state.index}
                                                                passiveColor={'silver'}
                                                                activeColor={'#29a2e1'}
                                                                activeDotHeight={10}
                                                                activeDotWidth={10}
                                                                passiveDotHeight={8}
                                                                passiveDotWidth={8}
                                                            />
                                                        </View>
                                                    }
                                                </>
                                                :
                                                <View style={{ flex: 1 }}>
                                                    {

                                                        this.props.cacheLess ?
                                                            <Image resizeMode={this.props.userPostResized ? this.props.userPostResized : "stretch"} source={this.props.postSource} style={[styles.postImage, this.props.routeList ? {

                                                            } : null]} />
                                                            :
                                                            <CachedImage resizeMode={this.props.userPostResized ? this.props.userPostResized : "stretch"} source={this.props.postSource} style={[styles.postImage, this.props.routeList ? {

                                                            } : null]} />
                                                    }
                                                </View>
                                        }
                                    </View>
                                :
                                null
                            }
                            {
                                this.props.EstimatedTime ? <View style={styles.avgWaitTime}>
                                    <Text numberOfLines={1} style={[styles.userPostsText, { color: 'black', fontWeight: Platform.OS == 'android' ? '700' : '600', width: '84%' }]}> {this.props.EstimatedTime} </Text>
                                </View> : null
                            }
                        </View>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity
                        activeOpacity={1} style={[styles.mainContainer, this.props.timeLineScreen ? {
                            backgroundColor: '#fff',
                        } :
                            this.props.routeList ? {
                                backgroundColor: '#fff',

                            } :

                                {
                                    borderTopColor: this.props.timeLineScreen ? 'transparent' : '#3b3b3c',
                                    borderLeftColor: this.props.timeLineScreen ? 'transparent' : '#3b3b3c',
                                    borderRightColor: this.props.timeLineScreen ? 'transparent' : '#3b3b3c',
                                    borderTopRightRadius: this.props.timeLineScreen ? null : this.props.terminalDetailRadius ? 0 : 10,
                                    borderTopLeftRadius: this.props.timeLineScreen ? null : this.props.terminalDetailRadius ? 0 : 10, borderWidth: this.props.terminalDetailRadius ? 0 : 1,
                                    paddingHorizontal: this.props.timeLineScreen ? 0 : this.props.terminalDetailRadius ? null : 25,
                                    paddingVertical: this.props.timeLineScreen ? 0 : this.props.terminalDetailRadius ? null : 15,
                                    backgroundColor: this.props.timeLineScreen ? '#fff' : this.props.terminalDetailRadius ? null : '#0d131c'
                                }]}
                        onPress={() => this?.props?.onPress()}
                    >
                        {this.props.isTerminalDetail && <ImageBackground source={AppImages.images.fr8Background} style={{ height: 50, width: '100%' }}>
                            <View style={{ height: 50, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 25 }}>
                                <Text

                                    style={[styles.userPostsText, { fontWeight: 'bold', color: AppColor.colors.white, marginLeft: 0 }]}
                                >{'No. of trips to the terminal'}</Text>
                                <Text style={[styles.userPostsText, { fontWeight: 'bold', color: AppColor.colors.white, marginLeft: 0 }]}>{this.props.numberOfTrips}</Text>
                            </View>
                        </ImageBackground>}
                        <View style={{ backgroundColor: 'white', overflow: 'hidden' }}>


                            {this.props.fullName && this.props.userSource ?
                                <View style={styles.userView}>
                                    {this.props.userSource ? <CachedImage source={this.props.userSource} resizeMode='contain' style={styles.userImage} />
                                        :
                                        null}
                                    {this.props.fullName ? <Text numberOfLines={2} style={[styles.userPostsText, { textAlign: "left", flex: 1, marginLeft: this.props.userSource ? 15 : 0 }]}>{this.props.fullName}</Text>
                                        : null}
                                </View>
                                : null}
                            {this.props.postSource ?
                                this.props.type == 'timeLinePosts' && this.props.mediaImages && this.props.mediaImages.length == 0 ?
                                    null :
                                    <View style={[styles.postImageView, {
                                        marginTop: this.props.fullName && this.props.userSource ? 20 : 0,
                                        aspectRatio: this?.props?.mediaImages?.length == 1 ? this.props.ratio !== null && this.props.ratio !== undefined && !isNaN(this.props.ratio) ? this.props.ratio : 1.87 : this.props.type == 'timeLinePosts' ? 1 : this.props.ratio !== null && this.props.ratio !== undefined && !isNaN(this.props.ratio) ? this.props.ratio : 1.87
                                    }]}
                                    >

                                        {this.props?.imagePressIndex && <View style={{ display: this.props.isAnimated == false ? 'none' : 'flex', position: 'absolute', zIndex: 9999999, alignSelf: 'center', height: '100%', justifyContent: 'center' }}>

                                            <Animated.Image
                                                source={require('../../Screens/MyTimeLine/Images/thumbs_up.gif')}
                                                style={{
                                                    display: this.props.isAnimated == false ? 'none' : 'flex',
                                                    height: 100, width: 100,
                                                    opacity: this.props.opacityOFImage,
                                                }}
                                                resizeMode="cover"
                                            />
                                        </View>}
                                        {this.props.mediaImages ? this.props.mediaImages.length > 0 ?
                                            this.props.mediaImages.length > 0 ?
                                                Platform.OS == 'ios' || Platform.OS == 'android' ?


                                                    <FBCollage
                                                        itemIndex={this.props.itemIndex}
                                                        doublePress={() => this.props.doubleTab()}
                                                        spacing={4}
                                                        arrayLength={this?.props?.mediaImages?.length}
                                                        style={{ width: '100%', height: '100%' }}
                                                        images={
                                                            this?.props?.mediaImages

                                                        }
                                                        imageOnPress={(item) => {
                                                            if (this.internetStatus === false) {
                                                                this.state.internetAlert == 0 && this.internetPouup()
                                                                this.setState({ internetAlert: 1 })
                                                            } else {
                                                                this.props.ImagePress(item)
                                                            }
                                                        }}
                                                    />


                                                    :
                                                    <Swiper
                                                        onIndexChanged={(e) => { this.setState({ index: e }) }}
                                                        showsPagination={false} loop={false}>
                                                        {this.props.mediaImages.map(x => {

                                                            return this.renderItem(x)
                                                        })}
                                                    </Swiper>
                                                :
                                                this.props.mediaImages[0].thumbnail ?
                                                    <View style={styles.backImage}>
                                                        <TouchableOpacity onPress={() => {
                                                            if (this.internetStatus === false) {
                                                                this.state.internetAlert == 0 && this.internetPouup()
                                                                this.setState({ internetAlert: 1 })
                                                            } else {
                                                                this.props.startVideo(this.props.mediaImages[0], this.props.mediaImages[0].thumbnail)
                                                            }

                                                        }}>
                                                            <ImageBackground style={styles.backImage} source={{ uri: imageBaseUrl + this.props.mediaImages[0].thumbnail }} resizeMode="cover"  >
                                                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                                                    <CachedImage source={AppImages.images.play} resizeMode="contain" style={styles.playButton} />
                                                                </View>
                                                            </ImageBackground>
                                                        </TouchableOpacity>
                                                    </View> :
                                                    <>
                                                        <CachedImage resizeMode={this.props.userPostResized ? this.props.userPostResized : "stretch"} source={{ uri: imageBaseUrl + this.props.mediaImages[0].media }} style={[styles.postImage]} />
                                                        <View style={{ position: 'absolute', width: '100%', bottom: 10 }}>
                                                            {this.props.startTime ?
                                                                <View style={styles.startEndView}>
                                                                    <View style={{ flexDirection: 'row' }}>
                                                                        <Text style={[styles.userPostsText, { marginLeft: 0, fontSize: 14, color: this.props.timeLineScreen ? "#fff" : AppColor.colors.white }]}>{I18n.t('start_time')}:</Text>
                                                                        <Text style={[styles.userPostsText, { fontSize: 14, marginLeft: 5, color: this.props.timeLineScreen ? "#fff" : AppColor.colors.white }]}>{this.props.startTime}</Text>
                                                                    </View>
                                                                    <View style={{ flexDirection: 'row' }}>
                                                                        <Text numberOfLines={1} style={[styles.userPostsText, { fontSize: 14, color: this.props.timeLineScreen ? "#fff" : AppColor.colors.white, maxWidth: '80%' }]}>{I18n.t('endTime')}:</Text>
                                                                        <Text style={[styles.userPostsText, { fontSize: 14, marginLeft: 5, color: this.props.timeLineScreen ? "#fff" : AppColor.colors.white }]}>{this.props.endTime}</Text>
                                                                    </View>
                                                                </View> : null}
                                                            {this.props.minute ? <View style={styles.minuteView}>
                                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                    <FontAwesome name='dashboard' size={16} color={"#fff"} />
                                                                    <Text style={[styles.userPostsText, { fontSize: 14, marginLeft: 5, color: this.props.timeLineScreen ? "#fff" : AppColor.colors.black }]}>{this.props.dis} mi</Text>
                                                                </View>
                                                                <View style={{ flexDirection: 'row' }}>
                                                                    <Icon name='query-builder' size={20} color={"#fff"}></Icon>
                                                                    <Text style={[styles.userPostsText, { fontSize: 14, marginLeft: 5, color: this.props.timeLineScreen ? "#fff" : AppColor.colors.black }]}>{this.props.minute}</Text>
                                                                </View>
                                                            </View> : null}
                                                        </View>
                                                    </>
                                            :

                                            <CachedImage resizeMode={this.props.userPostResized ? this.props.userPostResized : "stretch"} source={this.props.postSource} style={[styles.postImage, this.props.routeList ? {

                                            } : null]} />


                                            :
                                            this.props.imagePreload ?

                                                <>
                                                    <ViewPager
                                                        orientation='horizontal'
                                                        scrollEnabled={this?.props?.postSource?.length > 1 ? true : false}
                                                        initialPage={0}
                                                        ref={(res) => this.viewPagerRef = res}
                                                        overScrollMode='auto'
                                                        onPageSelected={(e) => { this.setState({ index: e.nativeEvent.position }) }}
                                                        showPageIndicator={false}

                                                        style={styles.viewPager}>
                                                        {this.props.postSource.map((x, index) => {

                                                            return (
                                                                <TouchableOpacity activeOpacity={1}>
                                                                    {this.props.terminalImageType == 'url' ? <WebView
                                                                        scrollEnabled={false}
                                                                        source={{ uri: this.props.terminalImageType == 'url' ? x.includes('?') ? x + "&" + this.state.random : x + "?=" + this.state.random : x, cache: 'reload' }}
                                                                    />
                                                                        :
                                                                        <ImageBackground
                                                                            onLoadStart={() => this.setState({ imageLoad: true })}
                                                                            onLoadEnd={() => this.setState({ imageLoad: false })}
                                                                            onLoad={() => this.setState({ imageLoad: false })}
                                                                            resizeMode={this.props.userPostResized ? this.props.userPostResized : "cover"}
                                                                            source={{ uri: this.props.terminalImageType == 'url' ? x + "?=" + this.state.random : x, cache: 'reload' }}
                                                                            onError={e => this.setState({ imageLoad: false })}
                                                                            style={[styles.postImage, { height: '100%', justifyContent: 'center', alignItems: 'center' }, this.props.routeList ? {

                                                                            } : null]} >
                                                                            {this.state.imageLoad && <View style={{ alignSelf: 'center' }}>
                                                                                <ActivityIndicator size={25} />
                                                                            </View>}
                                                                        </ImageBackground>}
                                                                </TouchableOpacity>
                                                            )
                                                        })}
                                                    </ViewPager>
                                                    {(this.props.postSource && this.props.postSource.length > 0 && this.props.postSource.length > 1) &&
                                                        <View style={styles.dotView} >
                                                            <Dots
                                                                length={this.props.postSource.length}
                                                                active={this.state.index}
                                                                passiveColor={'silver'}
                                                                activeColor={'#29a2e1'}
                                                                activeDotHeight={10}
                                                                activeDotWidth={10}
                                                                passiveDotHeight={8}
                                                                passiveDotWidth={8}
                                                            />
                                                        </View>
                                                    }
                                                </>
                                                :
                                                <View style={{ flex: 1 }}>
                                                    {

                                                        this.props.cacheLess ?
                                                            <Image resizeMode={this.props.userPostResized ? this.props.userPostResized : "stretch"} source={this.props.postSource} style={[styles.postImage, this.props.routeList ? {

                                                            } : null]} />
                                                            :
                                                            <CachedImage resizeMode={this.props.userPostResized ? this.props.userPostResized : "stretch"} source={this.props.postSource} style={[styles.postImage, this.props.routeList ? {

                                                            } : null]} />
                                                    }
                                                    {this.props.cacheLess ?
                                                        <TouchableOpacity style={{ position: 'absolute', bottom: 25, right: 10, }} onPress={() => this.props.onTimelineSharePress()}>
                                                            <Image resizeMode='contain' style={{ height: 50, width: 50 }} source={require('../../Images/new2.gif')} />
                                                        </TouchableOpacity>
                                                        : null
                                                    }
                                                </View>
                                        }

                                    </View>

                                :
                                null
                            }
                            {
                                this.props.EstimatedTime ? <View style={styles.avgWaitTime}>
                                    <Text numberOfLines={1} style={[styles.userPostsText, { color: 'black', fontWeight: Platform.OS == 'android' ? '700' : '600', width: '84%' }]}> {this.props.EstimatedTime} </Text>
                                </View> : null
                            }
                        </View>
                    </TouchableOpacity>
                }{
                    this.props.isTerminalDetail ?
                        <ImageBackground source={AppImages.images.fr8Background}
                            style={
                                [this.props.timeLineScreen ?
                                    styles.timeLineScreen :
                                    styles.userView,
                                {
                                    paddingVertical: 5,
                                    paddingHorizontal: this.props.timeLineScreen ? 0 : 25, flexDirection: 'column', alignItems: 'flex-start', borderBottomLeftRadius: this.props.routeList ? 0 : this.props.terminalDetailLeftRadius ? 0 : 10, borderBottomRightRadius: this.props.routeList ? 0 : this.props.terminalDetailRightRadius ? 0 : 10, borderWidth: this.props.timeLineScreen || this.props.routeList ? 0 : this.props.terminalDetailRadius ? 0 : 1, borderTopColor: 'transparent',
                                }]}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between', }}>
                                {this.props.terminal ? <Text style={[styles.userPostsText, { fontWeight: 'bold', marginLeft: this.props.userSource ? 15 : 0, color: AppColor.colors.white, textAlign: 'left', marginTop: this.props.terminalDetailRadius ? 2 : null }]}>{this.props.terminal}</Text> : null}
                                {this.props.startTime && <TouchableOpacity style={{ padding: 5 }} onPress={() => this.setState({ isTerminalDetailsVisible: !this.state.isTerminalDetailsVisible })}>
                                    <Image resizeMode='contain'
                                        style={{ height: 15, width: 15 }}
                                        source={this.state.isTerminalDetailsVisible ? AppImages.images.downArrow : AppImages.images.upArrow}
                                    />
                                </TouchableOpacity>}
                            </View>
                            {this.props.locationName ? <View style={{ marginTop: 5, flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                <Image resizeMode='contain'
                                    style={{ height: 15, width: 15 }}
                                    source={AppImages.images.LocationNav}
                                />
                                <Text style={[styles.userPostsText, { textAlign: 'left', fontSize: 15, marginLeft: 5, color: AppColor.colors.black }]}>{this.props.locationName}</Text>
                            </View> :
                                this.props.createdTime ?
                                    <View style={{ marginTop: 5, flex: 1, flexDirection: 'row' }}>
                                        <Text style={[styles.userPostsText, { textAlign: 'left', fontSize: 15, marginLeft: 0, color: AppColor.colors.black }]}>{this.props.createdTime}</Text>
                                    </View>
                                    : null}
                            {this.props.dis || this.props.minute ?
                                this.props.type == 'timeLinePosts' ?
                                    <>

                                    </>
                                    :
                                    <View style={{ marginTop: 5, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <FontAwesome name='dashboard' size={16} color={this.props.timeLineScreen ? "#000" : "#fff"} />
                                            <Text style={[styles.userPostsText, { fontSize: 14, marginLeft: 5, color: AppColor.colors.black }]}>{this.props.dis} mi</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Icon name='query-builder' size={20} color={this.props.timeLineScreen ? "#000" : "#fff"}></Icon>
                                            <Text style={[styles.userPostsText, { fontSize: 14, marginLeft: 5, color: AppColor.colors.black }]}>{this.props.minute}</Text>
                                        </View>
                                    </View>
                                :
                                null}
                            {
                                this.props.type == 'timeLinePosts' ?
                                    <>

                                        <View style={{
                                            paddingVertical: 7, paddingHorizontal: 10,
                                            borderBottomWidth: 1, borderColor: '#ccc', width: '98%', flexDirection: 'row',
                                            alignItems: 'center', justifyContent: 'space-between', alignSelf: 'center'
                                        }}>
                                            <TouchableOpacity
                                                activeOpacity={1}
                                                onPress={() => this.props.onLikeCountPress()}
                                                style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5, paddingHorizontal: 5 }}>
                                                <CachedImage source={AppImages.images.like} style={{ height: 20, width: 20 }} />
                                                {this.props.reactionType && this.props.reactionType !== 'like' && <CachedImage source={getReactionType(this.props.reactionType)} style={{ height: 20, width: 20 }} />}
                                                <Text onPress={() => this.props.onLikeCountPress()} style={[styles.userPostsText, { fontSize: 12, marginLeft: 5, color: 'gray' }]}>{this.props.totalLike}</Text>
                                            </TouchableOpacity>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text
                                                    onPress={() => this.props.onCommentPress()}
                                                    style={[styles.userPostsText, { fontSize: 12, color: 'gray', paddingVertical: 5 }]}>{this.props.totalComment} {this.props.totalComment == '1' ? I18n.t('Comment') : I18n.t('Comments')} </Text>
                                                <Text onPress={() => this.props.shareCountPress()} style={[styles.userPostsText, { paddingVertical: 5, fontSize: 12, color: 'gray' }]}>{this.props.totalShare} {this.props.totalShare == '1' ? I18n.t('Share') : I18n.t('Shares')}</Text>
                                            </View>
                                        </View>

                                        <View style={styles.likeShareView}>

                                            {Platform.OS == 'ios' ?
                                                <TouchableHighlight>
                                                    <AnimationScreen
                                                        isListing={true}
                                                        isDoubleTabLiked={this.props.isDoubleTabLiked}
                                                        isScrolling={this.props.isScrolling}
                                                        yAxis={null}
                                                        reactionType={this.props.reactionType}
                                                        isLike={this.props.isLike}
                                                        quickTouch={(isLiked) => this.props.isLikedQuick(isLiked)}
                                                        emojiSelected={(dd) => this.props.selectedEmoji(dd)}
                                                        isTouchStart={() => this.props.likeButtonPressIn()}
                                                        isTouchEnd={(icon) => this.props.likeButtonPressOut(icon)}
                                                    />
                                                </TouchableHighlight>
                                                :
                                                <View
                                                    style={{ marginLeft: '4%' }}
                                                >
                                                    <AnimationScreen
                                                        delay={2000}
                                                        isScrolling={this.props.isScrolling}
                                                        isDoubleTabLiked={this.props.isDoubleTabLiked}
                                                        yAxis={null}
                                                        reactionType={this.props.reactionType}
                                                        isLike={this.props.isLike}
                                                        quickTouch={(isLiked) => this.props.isLikedQuick(isLiked)}
                                                        emojiSelected={(dd) => this.props.selectedEmoji(dd)}
                                                        isTouchStart={() => this.props.likeButtonPressIn()}
                                                        isTouchEnd={(icon) => this.props.likeButtonPressOut(icon)}

                                                    />
                                                </View>
                                            }

                                            <TouchableHighlight underlayColor='rgba(0,0,0,0.3)' onPress={() => {
                                                if (this.internetStatus === false) {
                                                    this.state.internetAlert == 0 && this.internetPouup()
                                                    this.setState({ internetAlert: 1 })
                                                } else {
                                                    !this.state.isClicked && this.props.onCommentPress()
                                                }
                                            }} style={styles.touchableHighlightView}>
                                                <>
                                                    <FontAwesome name='comment-o' size={20} color={this.props.timeLineScreen ? "gray" : "#ffff"} />
                                                    <Text style={[styles.userPostsText, { fontSize: 14, marginLeft: 5, color: 'gray' }]}>{I18n.t('Comment')}</Text>
                                                </>
                                            </TouchableHighlight>
                                            <TouchableHighlight underlayColor='rgba(0,0,0,0.3)' onPress={() => {
                                                if (this.internetStatus === false) {
                                                    this.state.internetAlert == 0 && this.internetPouup()
                                                    this.setState({ internetAlert: 1 })
                                                } else {
                                                    this.props.onSharePress()
                                                }
                                            }} style={[styles.touchableHighlightView, { marginRight: 4 }]}>
                                                {/* <FontAwesome name='share-square' size={20}  color={this.props.timeLineScreen ? "#000" : "#ffff"} /> */}
                                                <>
                                                    <Image source={require('../../Images/sharePost.png')} style={{ height: 20, width: 20, tintColor: 'gray' }} />
                                                    <Text style={[styles.userPostsText, { fontSize: 14, marginLeft: 5, color: 'gray' }]}>{I18n.t('Share')}</Text>
                                                </>
                                            </TouchableHighlight>

                                        </View>

                                    </>
                                    :
                                    this.props.startTime ?

                                        this.state.isTerminalDetailsVisible ?
                                            <View style={styles.openCloseView}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={[styles.userPostsText, { marginLeft: 0, fontSize: 14, color: this.props.routeList ? '#000' : AppColor.colors.white }]}>{this.props.routeList ? I18n.t('inGate') : I18n.t('openTime')}:</Text>
                                                    <Text style={[styles.userPostsText, { fontSize: 14, marginLeft: 5, color: this.props.routeList ? '#000' : AppColor.colors.white }]}>{this.props.startTime}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text numberOfLines={1} style={[styles.userPostsText, { fontSize: 14, color: this.props.routeList ? '#000' : AppColor.colors.white, marginLeft: 2, maxWidth: '80%' }]}>{this.props.routeList ? I18n.t('outGate') : I18n.t('closeTime')}:</Text>
                                                    <Text style={[styles.userPostsText, { fontSize: 14, marginLeft: 5, color: this.props.routeList ? '#000' : AppColor.colors.white }]}>{this.props.endTime}</Text>
                                                </View>
                                            </View>
                                            :
                                            <>
                                                <View style={styles.openCloseView}>
                                                    <View style={{ flexDirection: 'row', width: '30%' }}>
                                                        <Text style={[styles.userPostsText, { marginLeft: 0, fontSize: 14, color: this.props.routeList ? '#000' : AppColor.colors.white }]}>{this.props.routeList ? I18n.t('inGate') : "Single Move"}</Text>

                                                    </View>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text style={[styles.userPostsText, { marginLeft: 0, fontSize: 14, color: this.props.routeList ? '#000' : AppColor.colors.white }]}>{this.props.routeList ? I18n.t('inGate') : I18n.t('openTime')}:</Text>
                                                        <Text style={[styles.userPostsText, { fontSize: 14, marginLeft: 5, color: this.props.routeList ? '#000' : AppColor.colors.white }]}>{this.props.startTime}</Text>

                                                    </View>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text numberOfLines={1} style={[styles.userPostsText, { fontSize: 14, color: this.props.routeList ? '#000' : AppColor.colors.white, marginLeft: 2, maxWidth: '80%' }]}>{this.props.routeList ? I18n.t('outGate') : I18n.t('closeTime')}:</Text>
                                                        <Text style={[styles.userPostsText, { fontSize: 14, marginLeft: 5, color: this.props.routeList ? '#000' : AppColor.colors.white }]}>{this.props.endTime}</Text>
                                                    </View>
                                                </View>
                                                <View style={styles.openCloseView}>
                                                    <View style={{ flexDirection: 'row', width: '30%' }}>
                                                        <Text style={[styles.userPostsText, { marginLeft: 0, fontSize: 14, color: this.props.routeList ? '#000' : AppColor.colors.white }]}>{this.props.routeList ? I18n.t('inGate') : "Double Move"}</Text>

                                                    </View>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text style={[styles.userPostsText, { marginLeft: 0, fontSize: 14, color: this.props.routeList ? '#000' : AppColor.colors.white }]}>{this.props.routeList ? I18n.t('inGate') : I18n.t('openTime')}:</Text>
                                                        <Text style={[styles.userPostsText, { fontSize: 14, marginLeft: 5, color: this.props.routeList ? '#000' : AppColor.colors.white }]}>{this.props.startTime}</Text>

                                                    </View>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text numberOfLines={1} style={[styles.userPostsText, { fontSize: 14, color: this.props.routeList ? '#000' : AppColor.colors.white, marginLeft: 2, maxWidth: '80%' }]}>{this.props.routeList ? I18n.t('outGate') : I18n.t('closeTime')}:</Text>
                                                        <Text style={[styles.userPostsText, { fontSize: 14, marginLeft: 5, color: this.props.routeList ? '#000' : AppColor.colors.white }]}>{this.props.endTime}</Text>
                                                    </View>
                                                </View>
                                            </>

                                        :
                                        (this.props.avaliable && this.state.isTerminalDetailsVisible) ?
                                            <View style={styles.avaliableView}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={[styles.userPostsText, { marginLeft: 0, fontSize: 14, color: AppColor.colors.white }]}>{this.props.avaliable}</Text>
                                                </View>
                                            </View>
                                            :
                                            null}
                            {
                                this.props.totalUsers ?
                                    <View style={styles.avaliableView}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={[styles.userPostsText, { marginLeft: 0, fontSize: 14, color: AppColor.colors.white }]}>{I18n.t('ttlUserInterminal') + this.props.totalUsers}</Text>
                                        </View>
                                    </View>
                                    : null
                            }
                            {/* </View> */}
                        </ImageBackground>
                        :
                        <View
                            style={
                                [this.props.timeLineScreen ?
                                    styles.timeLineScreen :
                                    styles.userView,
                                {
                                    paddingVertical: 5,
                                    paddingHorizontal: this.props.timeLineScreen ? 0 : 25, flexDirection: 'column', alignItems: 'flex-start', borderBottomLeftRadius: this.props.routeList ? 0 : this.props.terminalDetailLeftRadius ? 0 : 10, borderBottomRightRadius: this.props.routeList ? 0 : this.props.terminalDetailRightRadius ? 0 : 10, borderWidth: this.props.timeLineScreen || this.props.routeList ? 0 : this.props.terminalDetailRadius ? 0 : 1, borderTopColor: 'transparent'
                                }]}>
                            {this.props.terminal ? <Text style={[styles.userPostsText, { fontWeight: 'bold', marginLeft: this.props.userSource ? 15 : 0, color: AppColor.colors.white, textAlign: 'left', marginTop: this.props.terminalDetailRadius ? 2 : null }]}>{this.props.terminal}</Text> : null}
                            {this.props.locationName ? <View style={{ marginTop: 5, flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                <Image resizeMode='contain'
                                    style={{ height: 15, width: 15 }}
                                    source={AppImages.images.LocationNav}
                                />
                                <Text style={[styles.userPostsText, { textAlign: 'left', fontSize: 15, marginLeft: 5, color: AppColor.colors.black }]}>{this.props.locationName}</Text>
                            </View> :
                                this.props.createdTime ?
                                    <View style={{ marginTop: 5, flex: 1, flexDirection: 'row' }}>
                                        <Text style={[styles.userPostsText, { textAlign: 'left', fontSize: 15, marginLeft: 0, color: AppColor.colors.black }]}>{this.props.createdTime}</Text>
                                    </View>
                                    : null}
                            {this.props.dis || this.props.minute ?
                                this.props.type == 'timeLinePosts' ?
                                    <>

                                    </>
                                    :
                                    <View style={{ marginTop: 5, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <FontAwesome name='dashboard' size={16} color={this.props.timeLineScreen ? "#000" : "#fff"} />
                                            <Text style={[styles.userPostsText, { fontSize: 14, marginLeft: 5, color: AppColor.colors.black }]}>{this.props.dis} mi</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Icon name='query-builder' size={20} color={this.props.timeLineScreen ? "#000" : "#fff"}></Icon>
                                            <Text style={[styles.userPostsText, { fontSize: 14, marginLeft: 5, color: AppColor.colors.black }]}>{this.props.minute}</Text>
                                        </View>
                                    </View>
                                :
                                null}
                            {
                                this.props.type == 'timeLinePosts' ?
                                    <>

                                        <View style={{
                                            paddingVertical: 7, paddingHorizontal: 10,
                                            borderBottomWidth: 1, borderColor: '#ccc', width: '98%', flexDirection: 'row',
                                            alignItems: 'center', justifyContent: 'space-between', alignSelf: 'center'
                                        }}>
                                            <TouchableOpacity
                                                activeOpacity={1}
                                                onPress={() => this.props.onLikeCountPress()}
                                                style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5, paddingHorizontal: 5 }}>
                                                <CachedImage source={AppImages.images.like} style={{ height: 20, width: 20 }} />
                                                {this.props.reactionType && this.props.reactionType !== 'like' && <CachedImage source={getReactionType(this.props.reactionType)} style={{ height: 20, width: 20 }} />}
                                                <Text onPress={() => this.props.onLikeCountPress()} style={[styles.userPostsText, { fontSize: 12, marginLeft: 5, color: 'gray' }]}>{this.props.totalLike}</Text>
                                            </TouchableOpacity>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text
                                                    onPress={() => this.props.onCommentPress()}
                                                    style={[styles.userPostsText, { fontSize: 12, color: 'gray', paddingVertical: 5 }]}>{this.props.totalComment} {this.props.totalComment == '1' ? I18n.t('Comment') : I18n.t('Comments')} </Text>
                                                <Text onPress={() => this.props.shareCountPress()} style={[styles.userPostsText, { paddingVertical: 5, fontSize: 12, color: 'gray' }]}>{this.props.totalShare} {this.props.totalShare == '1' ? I18n.t('Share') : I18n.t('Shares')}</Text>
                                            </View>
                                        </View>

                                        <View style={styles.likeShareView}>

                                            {Platform.OS == 'ios' ?
                                                <TouchableHighlight>
                                                    <AnimationScreen
                                                        isListing={true}
                                                        isDoubleTabLiked={this.props.isDoubleTabLiked}
                                                        isScrolling={this.props.isScrolling}
                                                        yAxis={null}
                                                        reactionType={this.props.reactionType}
                                                        isLike={this.props.isLike}
                                                        quickTouch={(isLiked) => this.props.isLikedQuick(isLiked)}
                                                        emojiSelected={(dd) => this.props.selectedEmoji(dd)}
                                                        isTouchStart={() => this.props.likeButtonPressIn()}
                                                        isTouchEnd={(icon) => this.props.likeButtonPressOut(icon)}
                                                    />
                                                </TouchableHighlight>
                                                :
                                                <View
                                                    style={{ marginLeft: '4%' }}
                                                >
                                                    <AnimationScreen
                                                        delay={2000}
                                                        isScrolling={this.props.isScrolling}
                                                        isDoubleTabLiked={this.props.isDoubleTabLiked}
                                                        yAxis={null}
                                                        reactionType={this.props.reactionType}
                                                        isLike={this.props.isLike}
                                                        quickTouch={(isLiked) => this.props.isLikedQuick(isLiked)}
                                                        emojiSelected={(dd) => this.props.selectedEmoji(dd)}
                                                        isTouchStart={() => this.props.likeButtonPressIn()}
                                                        isTouchEnd={(icon) => this.props.likeButtonPressOut(icon)}

                                                    />
                                                </View>
                                            }

                                            <TouchableHighlight underlayColor='rgba(0,0,0,0.3)' onPress={() => {
                                                if (this.internetStatus === false) {
                                                    this.state.internetAlert == 0 && this.internetPouup()
                                                    this.setState({ internetAlert: 1 })
                                                } else {
                                                    !this.state.isClicked && this.props.onCommentPress()
                                                }
                                            }} style={styles.touchableHighlightView}>
                                                <>
                                                    <FontAwesome name='comment-o' size={20} color={this.props.timeLineScreen ? "gray" : "#ffff"} />
                                                    <Text style={[styles.userPostsText, { fontSize: 14, marginLeft: 5, color: 'gray' }]}>{I18n.t('Comment')}</Text>
                                                </>
                                            </TouchableHighlight>
                                            <TouchableHighlight underlayColor='rgba(0,0,0,0.3)' onPress={() => {
                                                if (this.internetStatus === false) {
                                                    this.state.internetAlert == 0 && this.internetPouup()
                                                    this.setState({ internetAlert: 1 })
                                                } else {
                                                    this.props.onSharePress()
                                                }
                                            }} style={[styles.touchableHighlightView, { marginRight: 4 }]}>
                                                {/* <FontAwesome name='share-square' size={20}  color={this.props.timeLineScreen ? "#000" : "#ffff"} /> */}
                                                <>
                                                    <Image source={require('../../Images/sharePost.png')} style={{ height: 20, width: 20, tintColor: 'gray' }} />
                                                    <Text style={[styles.userPostsText, { fontSize: 14, marginLeft: 5, color: 'gray' }]}>{I18n.t('Share')}</Text>
                                                </>
                                            </TouchableHighlight>

                                        </View>

                                    </>
                                    :
                                    this.props.startTime ?
                                        <View style={styles.openCloseView}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={[styles.userPostsText, { marginLeft: 0, fontSize: 14, color: this.props.routeList ? '#000' : AppColor.colors.white }]}>{this.props.routeList ? I18n.t('inGate') : I18n.t('openTime')}:</Text>
                                                <Text style={[styles.userPostsText, { fontSize: 14, marginLeft: 5, color: this.props.routeList ? '#000' : AppColor.colors.white }]}>{this.props.startTime}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text numberOfLines={1} style={[styles.userPostsText, { fontSize: 14, color: this.props.routeList ? '#000' : AppColor.colors.white, marginLeft: 2, maxWidth: '80%' }]}>{this.props.routeList ? I18n.t('outGate') : I18n.t('closeTime')}:</Text>
                                                <Text style={[styles.userPostsText, { fontSize: 14, marginLeft: 5, color: this.props.routeList ? '#000' : AppColor.colors.white }]}>{this.props.endTime}</Text>
                                            </View>
                                        </View> :
                                        this.props.avaliable ?
                                            <View style={styles.avaliableView}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={[styles.userPostsText, { marginLeft: 0, fontSize: 14, color: AppColor.colors.white }]}>{this.props.avaliable}</Text>
                                                </View>
                                            </View>
                                            :
                                            null}
                            {
                                this.props.totalUsers ?
                                    <View style={styles.avaliableView}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={[styles.userPostsText, { marginLeft: 0, fontSize: 14, color: AppColor.colors.white }]}>{I18n.t('ttlUserInterminal') + this.props.totalUsers}</Text>
                                        </View>
                                    </View>
                                    : null
                            }
                        </View>
                }

                {this.props.routeList &&
                    <TouchableOpacity
                        activeOpacity={1}
                        onPressIn={() => this.setState({ toolTipShow: true })}
                        onPressOut={() => this.setState({ toolTipShow: false })}
                        style={{ position: 'absolute', top: '-2.6%', left: '2%', flexDirection: 'row' }}>
                        <Image
                            resizeMode='contain'
                            source={this.props.timeLineType == 'manual' ? require('../../Images/M.png') : require('../../Images/a.png')}
                            style={{ height: 60, width: 60, }}
                        />
                        {this.state.toolTipShow &&
                            <Image
                                style={{ height: 60, width: 120 }}
                                resizeMode='contain'
                                source={
                                    this.props.timeLineType == 'manual' ?
                                        require('../../Images/manual.png') :
                                        require('../../Images/auto.png')
                                }
                            />
                        }

                    </TouchableOpacity>
                }
            </TouchableOpacity>
        )
    }
}