import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    Dimensions,
    ImageBackground,
    TextInput,
    ScrollView,
    FlatList,
    Alert,
    Platform,
    RefreshControl,
    Keyboard,
    TouchableHighlight,
    Animated,
    ActionSheetIOS
} from 'react-native';
import KeyboardManager from 'react-native-keyboard-manager';
import styles from './styles'
import { CachedImage } from './../../Components/react-native-cached-image-master'
import Header from '../../Components/Header'
import DataManager from "../../Components/DataManager";
import Loader from "../../Components/Loader";
import I18n from 'react-native-i18n'
import Icon from 'react-native-vector-icons/FontAwesome'
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import { getReactionType, imageBaseUrl } from '../../Config';
import { AppImages, AppFontFamily, AppColor } from "./../../Themes";
import moment from 'moment';
import { timeLinePostDetail, timeLineComment, deleteComemnt, timeLinePostDetailClear, deleteTimeLinePost, commentLikeAction } from '../../Redux/actions/timeLineAction';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ViewPager from '@react-native-community/viewpager';
import Dots from 'react-native-dots-pagination';
import ReadMore from 'react-native-read-more-text';
import dateDifferenceInDays from '../../Components/dateDifferenceInDays';
import FBCollage from '../../../libs/react-native-fb-collage';
import { clearProfileData } from '../../Redux/actions/profileAction';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo'
import AnimationScreen from '../MyTimeLine/amination/Animation/Animation.Screen';
import ActionSheet from 'react-native-actionsheet'
import { AFLogEvent } from '../../Config/aws';

let mediaImages2 = []
const width = Dimensions.get('screen').width
class Comments extends Component {
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
            deletedItemIndex: 0,
            deletedItem: null,
            deletedItemRoot: null,
            bottom: '28%',
            indexReply: 0,
            subCommentIndex: null,
            isScrolling: false,
            display: true,
            scrollEnable: true,
            replyedUser: null,
            liked: false,
            userDetail: null,
            message: '',
            refreshing: false,
            pageIndShow: true,
            liked: false,
            index: 0,
            delay: 300,
            fadeAnimation: new Animated.Value(0),
            animationValue: new Animated.Value(1),
            objectState: 0
        }
        _this = this
        this.item = this.props.route.params.item
        this.commentId = this.props.route.params?.comment_id
        this.subCommentId = this.props.route.params?.subCommentId
        // time interval between double clicks
        this.delayTime = props.delay ? props.delay : 150;
        // bool to check whether user tapped once
        this.firstPress = true;
        // the last time user tapped
        this.lastTime = new Date();
        // a timer is used to run the single tap event
        this.timer = false;
        this.lastTap = null;



    }


    actionSheet2 = (navigation, item, index, mainItem = null) => {
        this.setState({ isScrolling: true, deletedItemIndex: index, deletedItem: item, deletedItemRoot: mainItem })
        Platform.OS == 'android' ?
            this.ActionSheet2.show()
            :
            ActionSheetIOS.showActionSheetWithOptions({
                options: [I18n.t('Cancel'), I18n.t('Edit'), I18n.t('Delete')],
                destructiveButtonIndex: 2,
                cancelButtonIndex: 0
            }, (buttonIndex) => {
                if (buttonIndex == 1) {

                    this.setState({ isScrolling: true })

                    this.props.navigation.navigate('EditComment', { item: item })

                }
                else if (buttonIndex == 2) {
                    this.deletePress(item, index, mainItem)


                }
            })
    }

    androidActionSheetPress2 = (buttonIndex) => {
        this.setState({ isScrolling: true })
        if (buttonIndex == 1) {

            this.setState({ isScrolling: true })

            this.props.navigation.navigate('EditComment', { item: this.state.deletedItem })



        }
        else if (buttonIndex == 2) {
            this.deletePress(this.state.deletedItem, this.state.deletedItemIndex, this.state.deletedItemRoot)

        }
    }

    handlePosition(id) {
        this.fadeIn()
        /* Item Size from FlatList */
        const itemSize = Dimensions.get('screen').width / 2 + 30;
        /* Id of the current month */
        const idCurrentItem = id;
        //   setTimeout(() => {
        //       this.flatRef?.scrollToIndex({
        //         animated: true,
        //         index: 9,
        //       });
        //   }, 10000);
    }

    likePress = (item, val, index, items = null) => {
        console.log('item, val, index', item, val, index);
        this.setState({ isScrolling: true })
        if (item?.is_like == true && !val) {
            this.props.commentLikeAction(this.item?._id, item?._id, index, 0, this.props.navigation, items?._id ? items._id : null, null)
        }
        else {
            switch (val) {

                case 1:
                    this.props.commentLikeAction(this.item?._id, item?._id, index, 1, this.props.navigation, items?._id ? items._id : null, 'like')
                    break;
                case 2:
                    this.props.commentLikeAction(this.item?._id, item?._id, index, 1, this.props.navigation, items?._id ? items._id : null, 'dislike')
                    break;
                // case 3:
                //   this.props.commentLikeAction(item?._id, '1', this.props.navigation, item?.is_like,'rollingEyes')
                //   break;
                case 3:
                    this.props.commentLikeAction(this.item?._id, item?._id, index, 1, this.props.navigation, items?._id ? items._id : null, 'grinningSmile')
                    break;
                case 4:
                    this.props.commentLikeAction(this.item?._id, item?._id, index, 1, this.props.navigation, items?._id ? items._id : null, 'angry')
                    break;
                case 5:
                    this.props.commentLikeAction(this.item?._id, item?._id, index, 1, this.props.navigation, items?._id ? items._id : null, 'confuse')
                    break;
                    // case 7:
                    //   this.props.commentLikeAction(item?._id, '1', this.props.navigation, item?.is_like,'beamingSmile')
                    break;
                case 6:
                    this.props.commentLikeAction(this.item?._id, item?._id, index, 1, this.props.navigation, items?._id ? items._id : null, 'thinking')
                    break;
                default:
                    this.props.commentLikeAction(this.item?._id, item?._id, index, 0, this.props.navigation, items?._id ? items._id : null, null)
                    break;
            }
        }

    }


    fadeIn = () => {
        console.log('called animate');
        Animated.timing(this.state.fadeAnimation, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
        }).start();

        setTimeout(() => {
            this.fadeOut()
        }, 800)


        Animated.spring(this.state.animationValue, {
            toValue: 1.1,
            friction: 2.4,
            tension: 50.0,
            useNativeDriver: true,
        }).start();
        this.setState({ objectState: 1 });



    };

    fadeOut = () => {
        Animated.timing(this.state.fadeAnimation, {
            toValue: 10,
            duration: 1000,
            useNativeDriver: true,
        }).start();
        Animated.spring(this.state.animationValue, {
            toValue: 1,
            friction: 2.4,
            tension: 50.0,
            useNativeDriver: true,
        }).start();

        this.subCommentId = null
        this.commentId = null
        this.setState({
            subCommentIndex: null
        })
    };



    deletePost = () => {
        this.setState({ isScrolling: true })
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
    getTime = (seconds) => {
        seconds = Number(seconds);
        var h = Math.floor(seconds / (3600));
        var m = Math.floor(seconds % 3600 / 60);
        var s = Math.floor(seconds % 60);

        var hDisplay = h > 0 ? h + (h == 1 ? " hr " : " hrs ") : "";
        var mDisplay = m > 0 ? [s > 29 ? m + 1 : m] + (m == 1 ? " " + I18n.t('mins') + ' ' : " " + I18n.t('mins') + ' ') : [s > 29 ? "1 " : "0 "] + I18n.t('mins');

        if (h > 0) {
            return hDisplay + mDisplay
        }

        else {
            return mDisplay;
        }

    }
    componentDidMount() {
        AFLogEvent("Comment", { screen: 'Comment' })


        this.setState({ isScrolling: true })
        mediaImages2 = []

        Keyboard.addListener('keyboardDidShow', () => {

            this.setState({ isScrolling: true, bottom: Platform.OS == 'ios' ? '16%' : '28%' })
            if (this.scrollRefsecond) {
                // this.flatRef?.scrollToEnd()

                // this.scrollRefsecond.scrollToEnd()
            }
        })
        Keyboard.addListener('keyboardDidHide', () => {
            this.setState({ bottom: Platform.OS == 'ios' ? '16%' : '16%' })

        })
        this.focusListener = this?.props?.navigation?.addListener('focus', () => {
            this.setState({ isScrolling: true })

            this.props.timeLinePostDetail(this.item?._id, this.props.navigation, this.commentId ? this.commentId : '')

        })
        DataManager.getUserDetails().then(async response => {
            if (response) {
                let parseData = await JSON.parse(response)
                this.setState({ userDetail: parseData.data._id ? parseData.data._id : parseData.data.id })
            }
        });
        if (Platform.OS == "ios") {
            KeyboardManager.setKeyboardDistanceFromTextField(5);

        }

    }
    componentWillUnmount() {
        this.setState({ isScrolling: true })
        if (Platform.OS == "ios") {
            KeyboardManager.setKeyboardDistanceFromTextField(10);
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            if (this.props.timeLine !== prevProps.timeLine) {
                if (this.props.timeLine.comment !== prevProps.timeLine.comment) {
                    if (this.props.timeLine.comment.length > 0) {
                        this.handlePosition()
                        if (this.subCommentId) {

                            this.setState({
                                subCommentIndex:
                                    this?.props?.timeLine?.comment[0]?.subComments?.findIndex((data) => {
                                        return data._id == this.subCommentId
                                    })
                            }, () => {
                            })




                        }
                    }
                }
            }
        }
    }

    //double tab
    _onTap = () => {
        this.setState({ isScrolling: true })
        const now = Date.now();
        if (this.lastTap && (now - this.lastTap) < this.state.delay) {
            this.fadeIn()
        } else {
            this.lastTap = now;
        }
    }


    replyedUser = (item) => {
        return (
            <View style={{
                borderRadius: 10,
                shadowColor: 'black',
                shadowOffset: {
                    width: 0.5,
                    height: 0.5,
                },
                elevation: 5,
                shadowRadius: 3,
                shadowOpacity: 0.4,
                backgroundColor: '#fff',
                zIndex: 999999999999,
                bottom: this.state.bottom,
                height: 100,
                position: 'absolute', width: '100%',
            }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, marginTop: 5 }}>
                    <Text numberOfLines={1} style={[styles.userPostsText, { padding: 5, textAlign: "left", flex: 1, fontWeight: 'bold' }]}>{I18n.t('Reply to') + " " + this.state.replyedUser.user.userName}</Text>
                    <Entypo
                        onPress={() => {
                            this.setState({ replyedUser: null })
                        }}
                        style={{ alignSelf: 'center', padding: 5, }} color={'#29a2e1'} name="cross" size={25} />
                </View>
                <View style={[{ justifyContent: 'space-between', borderRadius: 10, flexDirection: 'row', backgroundColor: "rgb(240,240,240)", padding: 20 }]}>
                    <View style={[styles.userView, { width: '100%', marginBottom: 10 }]}>
                        <View style={styles.userImage}>
                            <CachedImage resizeMode='cover' source={item?.user.profile !== '' && item?.user.profile !== null ? { uri: imageBaseUrl + item?.user.profile } : AppImages.images.user01} style={styles.userImage} />
                        </View>
                        <View style={{ justifyContent: 'center' }}>
                            <Text numberOfLines={2} style={[styles.userPostsText, { textAlign: "left", marginLeft: 15, fontWeight: 'bold' }]}>{item?.user.userName}</Text>
                            <Text numberOfLines={2} style={[styles.userPostsText, { textAlign: "left", marginLeft: 15, paddingRight: '15%' }]}>{item?.description}</Text>
                            <Text style={[styles.userPostsText, { textAlign: "left", fontSize: 12, color: 'gray' }]}>{moment(item?.created_at).local().format("hh:mm A L")}</Text>

                        </View>
                    </View>
                    {
                        item?.comment_creator == this.state.userDetail ?
                            <View style={styles.commentCreator}>
                                <Icon onPress={() => this.deletePress(item, index)} name='trash' color={'#c2c2c2'} size={20}></Icon>
                            </View>
                            :
                            null
                    }
                </View>
            </View>
        )
    }

    //comment text input
    renderToolbar = () => {
        return (
            <View style={styles.inputToolbar}>


                <TextInput
                    autoCorrect={false}
                    onFocus={() => {
                        this.setState({ isScrolling: true })
                    }}
                    ref={(InputRef) => this.InputRef = InputRef}
                    style={[styles.textInput]}
                    placeholder={I18n.t('enterYourComment')}
                    keyboardType={"ascii-capable"}
                    returnKeyType={"done"}
                    keyboardType={"default"}
                    value={this.state.message}
                    onChangeText={(message) => { this.setState({ message }) }}
                    multiline={true}
                    maxLength={3000}
                    autoFocus={false}
                />
            </View>
        );
    };
    //send button click method
    sendButtonClicked = () => {
        this.setState({ isScrolling: true })
        if (this.state.message.trim().length == 0) {
            alert(I18n.t('enterTheComment'))
        }
        else {
            Keyboard.dismiss()
            this.props.timeLineComment(this.item?._id, this.state.message.trim(), this.props.navigation, this.state.replyedUser ? this.state.replyedUser._id : null)
            this.setState({ message: '' }, () => {
                setTimeout(() => {
                    if (this.state.replyedUser == null) {
                        this.scrollRefsecond.scrollToEnd()
                        this.flatRef.scrollToEnd()
                    }
                    else {
                        this?.flatRef?.scrollToIndex({
                            animated: true,
                            index: this.state.indexReply
                        })
                    }
                    this.setState({ replyedUser: null })
                }, 800);
            })
        }
    }
    //send button
    renderSend = () => {
        return (
            <TouchableOpacity
                activeOpacity={1}
                disabled={this.state.sendDisable}
                style={styles.imageView}
                onPress={() => this.sendButtonClicked()}
            >
                <Image
                    style={styles.sendImage}
                    resizeMode="contain"
                    source={AppImages.images.send}
                />
            </TouchableOpacity>
        );
    };
    //commented user detail and message
    renderItem = ({ item, index }) => {
        let items = item;
        let indexs = index
        return (
            <View style={{ marginTop: 10 }}>
                <TouchableOpacity activeOpacity={item?.user._id == this.state.userDetail ? 1 : 1} onLongPress={() => { item?.user._id == this.state.userDetail ? this.actionSheet2(this.props.navigation, item, index) : null }}>
                    <Animated.View style={[{ justifyContent: 'space-between', borderRadius: 10, flexDirection: 'row', backgroundColor: "rgb(240,240,240)", margin: 10, marginTop: 0, paddingBottom: 10 },
                    this.commentId !== null && this.commentId !== undefined && index == 0 && {
                        transform: [{ scale: this.state.animationValue }],
                    }]}>
                        <View style={[styles.userView, { width: '70%', marginBottom: 0, marginLeft: 15 }]}>
                            <View style={[styles.userImage, { marginTop: Platform.OS == 'ios' ? '5%' : '2.5%' }]}>
                                <CachedImage resizeMode='cover' source={item?.user?.profile !== '' && item?.user?.profile !== null ? { uri: imageBaseUrl + item?.user?.profile } : AppImages.images.user01} style={styles.userImage} />
                            </View>
                            <View style={{ justifyContent: 'center' }}>
                                <Text numberOfLines={2} style={[styles.userPostsText, { textAlign: "left", flex: 1, marginLeft: 15, fontWeight: 'bold' }]}>{item?.user?.userName}</Text>
                                <Text style={[styles.userPostsText, { textAlign: "left", flex: 1, marginLeft: 15, }]}>{item?.description}</Text>
                                <Text style={[styles.userPostsText, { textAlign: "left", fontSize: 12, color: 'gray' }]}>{moment(item?.created_at).local().format("hh:mm A L")}</Text>
                            </View>
                        </View>
                    </Animated.View>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', marginLeft: 12, }}>
                    <View style={{}}>
                        <AnimationScreen
                            paddingRight={20}
                            isScrolling={this.state.isScrolling}
                            marginBottom={5}
                            ref={(ref) => this.animationRef1 = ref}
                            quickTouch={(val) => { this.likePress(item, val, index) }}
                            emojiSelected={(val) => { this.likePress(item, val, index) }}
                            isTouchStart={() => {
                                this.setState({ isScrolling: true }, () => {
                                    this.setState({ scrollEnable: false, isScrolling: false })
                                })
                            }
                            }
                            isTouchEnd={() => { this.setState({ scrollEnable: true }) }}
                            yAxis={this.state.yAxis}
                            reactionType={item?.reactionType?.type}
                            isLike={this.props.timeLine.detail.is_like}
                            ref={(ref) => this.likeRef = ref}
                        />
                    </View>
                    <TouchableOpacity onPress={() => {
                        this.setState({ isScrolling: true })
                        this.props.timeLine.likedUserList = []
                        this.props.timeLine.reactionCount = null
                        this.props.navigation.navigate('LikeListing', { item: item, type: 'comment' })
                    }} style={{ flexDirection: 'row', zIndex: 99999999, }}>
                        <CachedImage source={AppImages.images.like} style={{ height: 20, width: 20, alignSelf: 'center' }} />
                        {item?.reactionType?.type && item?.reactionType?.type !== 'like' && <CachedImage source={getReactionType(item?.reactionType?.type)} style={{ alignSelf: 'center', height: 20, width: 20 }} />}
                        <Text style={{ alignItems: 'center', alignSelf: 'center', marginLeft: 5 }}>
                            {item?.likes}
                        </Text>
                    </TouchableOpacity>
                    <View style={{ marginHorizontal: 10, borderRightWidth: 1 }} />
                    <Text
                        style={{
                            zIndex: 99999999,
                            alignSelf: 'center',
                            fontSize: 14, color: 'gray', marginLeft: 15,
                            fontFamily: AppFontFamily.fontFamily.regular,
                        }}
                        onPress={() => {
                            this.setState({ isScrolling: true })
                            this.InputRef.focus()
                            this.setState({ replyedUser: item, indexReply: index })
                        }}>{I18n.t("Reply")}</Text>
                </View>
                <FlatList
                    nestedScrollEnabled={true}
                    onScroll={() => {
                        this.setState({ isScrolling: true })
                    }}
                    key='subComment'
                    showsVerticalScrollIndicator={false}
                    ref={(ref) => this.subCommentflatRef = ref}
                    data={item?.subComments}
                    extraData={this.props}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => this.renderItemSubComment(item, index, items, indexs)}
                    style={styles.flatListComment}
                    scrollEnabled={true}
                />
            </View>
        )
    }


    scrollToRow(itemIndex, layout) {
        if (this.subCommentflatRef) {
            if (itemIndex == this.state.subCommentIndex) {
                setTimeout(() => {
                    this.subCommentflatRef.scrollToIndex({ index: this.state.subCommentIndex, animated: true });
                }, 1000);
            }
        }
    }

    renderItemSubComment = (item, index, items, commentIndex) => {
        let subItems = item;
        let subIndex = index
        return (<>
            <View style={{ marginTop: 10 }}>
                {item?.sub_child_comment?.length > 0 && <View style={{ borderLeftWidth: 1, borderBottomWidth: 0.7, borderColor: "gray", position: 'absolute', height: '99%', marginLeft: '25%', }} />}
                <View style={{ width: '82%', alignSelf: 'flex-end' }}>
                    <View>
                        <Animated.View
                            style={[{},
                            this.subCommentId !== null && this.subCommentId !== undefined && index == this.state.subCommentIndex && this.subCommentId == item._id && {
                                transform: [{ scale: this.state.animationValue }],
                            }
                            ]}>
                            <TouchableOpacity
                                activeOpacity={item?.user._id == this.state.userDetail ? 1 : 1} onLongPress={() => { item?.user._id == this.state.userDetail ? this.actionSheet2(this.props.navigation, item, index, items) : null }}
                                style={[{ justifyContent: 'space-between', borderRadius: 10, flexDirection: 'row', backgroundColor: "rgb(240,240,240)", paddingBottom: 10, marginRight: 10 }]}>
                                <View style={[styles.userView, { width: '70%', marginBottom: 0, marginLeft: 15 }]}>
                                    <View
                                        style={[styles.userImage, { marginTop: Platform.OS == 'ios' ? '5%' : '2.5%' }]}>
                                        <CachedImage resizeMode='cover' source={item?.user?.profile !== '' && item?.user?.profile !== null ? { uri: imageBaseUrl + item?.user.profile } : AppImages.images.user01} style={styles.userImage} />
                                    </View>
                                    <View style={{ justifyContent: 'center' }}>
                                        <Text numberOfLines={2} style={[styles.userPostsText, { textAlign: "left", flex: 1, marginLeft: 15, fontWeight: 'bold' }]}>{item?.user.userName}</Text>
                                        <Text style={[styles.userPostsText, { textAlign: "left", flex: 1, marginLeft: 15, }]}>{item?.description}</Text>
                                        <Text style={[styles.userPostsText, { textAlign: "left", fontSize: 12, color: 'gray' }]}>{moment(item?.created_at).local().format("hh:mm A L")}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <View style={{ flexDirection: 'row', marginLeft: 12, marginVertical: 10 }}>
                                {
                                    <ViewPager
                                        style={{}}>
                                        <AnimationScreen
                                            paddingRight={20}
                                            isScrolling={this.state.isScrolling}
                                            marginBottom={5}
                                            ref={(ref) => this.animationRef2 = ref}
                                            quickTouch={(val) => { this.likePress(item, val, index, items) }}
                                            emojiSelected={(val) => { this.likePress(item, val, index, items) }}
                                            isTouchStart={() => {
                                                this.setState({ isScrolling: true }, () => {
                                                    this.setState({ scrollEnable: false, isScrolling: false, display: true })
                                                })
                                            }
                                            }
                                            isTouchEnd={() => { this.setState({ scrollEnable: true, }) }}
                                            customDx={true}
                                            yAxis={this.state.yAxis}
                                            reactionType={item?.reactionType?.type}
                                            isLike={this.props.timeLine.detail.is_like}
                                            ref={(ref) => this.likeRef = ref}
                                        />
                                    </ViewPager>
                                }
                                <TouchableOpacity onPress={() => {
                                    this.setState({ isScrolling: true })
                                    this.props.timeLine.likedUserList = []
                                    this.props.timeLine.reactionCount = null
                                    this.props.navigation.navigate('LikeListing', { item: item, type: 'comment' })
                                }} style={{ flexDirection: 'row', zIndex: 99999999, }}>
                                    <CachedImage source={AppImages.images.like} style={{ height: 20, width: 20, alignSelf: 'center' }} />
                                    {item?.reactionType?.type && item?.reactionType?.type !== 'like' && <CachedImage source={getReactionType(item?.reactionType?.type)} style={{ alignSelf: 'center', height: 20, width: 20 }} />}
                                    <Text style={{ alignItems: 'center', alignSelf: 'center', marginLeft: 5 }}>
                                        {item?.likes}
                                    </Text>
                                </TouchableOpacity>
                                <View style={{ marginHorizontal: 10, borderRightWidth: 1 }} />
                                <Text
                                    style={{
                                        zIndex: 99999999,
                                        alignSelf: 'center',
                                        fontSize: 14, color: 'gray', marginLeft: 15,
                                        fontFamily: AppFontFamily.fontFamily.regular,
                                    }}
                                    onPress={() => {
                                        this.setState({ isScrolling: true })
                                        this.InputRef.focus()
                                        this.setState({ replyedUser: { ...item, _id: items._id }, indexReply: commentIndex })
                                    }}
                                >{I18n.t("Reply")}</Text>
                            </View>
                        </Animated.View>
                    </View>
                </View>
                <FlatList
                    nestedScrollEnabled={true}
                    onScroll={() => {
                        this.setState({ isScrolling: true })
                    }}
                    key='subCommentChild'
                    showsVerticalScrollIndicator={false}
                    ref={(ref) => this.subCommentflatRef = ref}
                    data={item?.sub_child_comment}
                    extraData={this.props}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => this.renderItemSubChildComment(item, index, subItems, subIndex)}
                    style={styles.flatListComment}
                    scrollEnabled={true}
                />
            </View>
        </>
        )
    }

    renderItemSubChildComment = (item, index, items, commentIndex) => {
        return (
            <>
                <View style={{ borderTopWidth: 1, borderColor: "gray", position: 'absolute', marginLeft: '25%', width: '0.1%', height: 0.1, marginTop: '10%' }} />
                <Animated.View
                    style={[{ width: '70%', alignSelf: 'flex-end', marginTop: 5 },
                    this.subCommentId !== null && this.subCommentId !== undefined && index == this.state.subCommentIndex && this.subCommentId == item._id && {
                        transform: [{ scale: this.state.animationValue }],
                    }
                    ]}>
                    <TouchableOpacity
                        activeOpacity={item?.user._id == this.state.userDetail ? 1 : 1} onLongPress={() => { item?.user._id == this.state.userDetail ? this.actionSheet2(this.props.navigation, item, index, items) : null }}
                        style={[{ justifyContent: 'space-between', borderRadius: 10, flexDirection: 'row', backgroundColor: "rgb(240,240,240)", paddingBottom: 10, marginRight: 10 }]}>
                        <View style={[styles.userView, { width: '50%', marginBottom: 0, marginLeft: 15 }]}>
                            <View style={styles.userImage}>
                                <CachedImage resizeMode='cover' source={item?.user?.profile !== '' && item?.user?.profile !== null ? { uri: imageBaseUrl + item?.user.profile } : AppImages.images.user01} style={styles.userImage} />
                            </View>
                            <View style={{ justifyContent: 'center' }}>
                                <Text numberOfLines={2} style={[styles.userPostsText, { textAlign: "left", flex: 1, marginLeft: 15, fontWeight: 'bold' }]}>{item?.user.userName}</Text>
                                <Text style={[styles.userPostsText, { textAlign: "left", flex: 1, marginLeft: 15, }]}>{item?.description}</Text>
                                <Text style={[styles.userPostsText, { textAlign: "left", fontSize: 12, color: 'gray' }]}>{moment(item?.created_at).local().format("hh:mm A L")}</Text>

                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', marginLeft: 12, marginVertical: 10 }}>
                        {
                            <View
                                style={{}}>
                                <AnimationScreen
                                    paddingRight={20}
                                    isScrolling={this.state.isScrolling}
                                    marginBottom={5}
                                    ref={(ref) => this.animationRef2 = ref}
                                    quickTouch={(val) => { this.likePress(item, val, index, items) }}
                                    emojiSelected={(val) => { this.likePress(item, val, index, items) }}
                                    isTouchStart={() => {
                                        this.setState({ isScrolling: true }, () => {
                                            this.setState({ scrollEnable: false, isScrolling: false, display: true })
                                        })
                                    }
                                    }
                                    isTouchEnd={() => { this.setState({ scrollEnable: true, }) }}
                                    customDx={true}
                                    yAxis={this.state.yAxis}
                                    reactionType={item?.reactionType?.type}
                                    isLike={this.props.timeLine.detail.is_like}
                                    ref={(ref) => this.likeRef = ref}
                                />
                            </View>

                        }
                        <TouchableOpacity onPress={() => {
                            this.setState({ isScrolling: true })
                            this.props.timeLine.likedUserList = []
                            this.props.timeLine.reactionCount = null
                            this.props.navigation.navigate('LikeListing', { item: item, type: 'comment' })
                        }} style={{ flexDirection: 'row', zIndex: 99999999, }}>
                            <CachedImage source={AppImages.images.like} style={{ height: 20, width: 20, alignSelf: 'center' }} />
                            {item?.reactionType?.type && item?.reactionType?.type !== 'like' && <CachedImage source={getReactionType(item?.reactionType?.type)} style={{ alignSelf: 'center', height: 20, width: 20 }} />}
                            <Text style={{ alignItems: 'center', alignSelf: 'center', marginLeft: 5 }}>
                                {item?.likes}
                            </Text>
                        </TouchableOpacity>
                        <View style={{ marginHorizontal: 10, borderRightWidth: 1 }} />
                        <Text
                            style={{
                                zIndex: 99999999,
                                alignSelf: 'center',
                                fontSize: 14, color: 'gray', marginLeft: 15,
                                fontFamily: AppFontFamily.fontFamily.regular,
                            }}
                            onPress={() => {
                                this.setState({ isScrolling: true })
                                this.InputRef.focus()
                                this.setState({ replyedUser: { ...item, _id: items._id }, indexReply: commentIndex })
                            }}
                        >
                            {I18n.t("Reply")}
                        </Text>
                    </View>
                </Animated.View>
            </>
        )
    }

    deletePress = (item, i, data = null) => {
        this.setState({ isScrolling: true, replyedUser: null, message: '' })
        Alert.alert(
            I18n.t("Alert"),
            data ? I18n.t('deleteCommentReplyAlert') : I18n.t('deleteCommentAlert'),
            [
                {
                    text: I18n.t('Yes'),
                    onPress: () => {
                        this.props.deleteComemnt(item?._id, i, this.props.navigation, this.item?._id, data?._id)
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
    //viewpagesinner images and video
    renderImages = (x, index) => {
        return (
            this.state.userDetail && this.state.userDetail == x.user_id ?
                x.type == 'video' ?
                    <View style={styles.container}>
                        <TouchableOpacity
                            onPress={() =>
                                this.props.navigation.navigate('VideoPreview', {
                                    response: { 'media': x.media },
                                    thumbnail: x.thumbnail,
                                    terminalResult: { id: x._id },
                                    screen: 'timeLineDetail',
                                    type: 'video'
                                })
                            }
                        >
                            <ImageBackground
                                style={styles.container}
                                source={{ uri: imageBaseUrl + x.thumbnail }}
                                resizeMode="cover"
                            >
                                <View style={styles.imageContainer}>
                                    <CachedImage
                                        source={AppImages.images.play}
                                        resizeMode="contain"
                                        style={styles.cacheImage}
                                    />
                                </View>
                            </ImageBackground>
                        </TouchableOpacity>
                    </View>
                    :
                    <TouchableOpacity activeOpacity={1} >
                        <View style={styles.container}>
                            <CachedImage
                                resizeMode={"cover"}
                                source={{ uri: x.thumbnail == null || x.thumbnail == '' ? imageBaseUrl + x.media : imageBaseUrl + x.thumbnail }}
                                style={[styles.postImage]}
                            />
                        </View>
                    </TouchableOpacity>
                :
                x.receipt_private == false ?
                    x.type == 'video' ?
                        <View style={styles.container}>
                            <TouchableOpacity
                                onPress={() =>
                                    this.props.navigation.navigate('VideoPreview',
                                        {
                                            response: { 'media': x.media },
                                            thumbnail: x.thumbnail,
                                            terminalResult: { id: x._id },
                                            screen: 'timeLineDetail',
                                            type: 'video',
                                            ratio: x.width / x.height
                                        })}>
                                <ImageBackground
                                    style={styles.container}
                                    source={{ uri: imageBaseUrl + x.thumbnail }}
                                    resizeMode="cover"
                                >
                                    <View style={styles.imageContainer}>
                                        <CachedImage
                                            source={AppImages.images.play}
                                            resizeMode="contain"
                                            style={styles.cacheImage} />
                                    </View>
                                </ImageBackground>
                            </TouchableOpacity>
                        </View>
                        :
                        this.props.receipt == '1' ?
                            x.type == 'interchange_file' ?
                                null :
                                <TouchableOpacity activeOpacity={1}>
                                    <View style={styles.container}>
                                        <CachedImage
                                            resizeMode={"cover"}
                                            source={{ uri: x.thumbnail == null || x.thumbnail == '' ? imageBaseUrl + x.media : imageBaseUrl + x.thumbnail }}
                                            style={[styles.postImage]} />
                                    </View>
                                </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={() => this._onTap()} activeOpacity={1}>
                                <Animated.Image
                                    source={AppImages.images.like}
                                    style={{ height: 35, width: 35, opacity: this.state.fadeAnimation, top: '40%', position: 'absolute', zIndex: 9999999, alignSelf: 'center' }}
                                    resizeMode="cover"
                                />
                                <CachedImage
                                    resizeMode={"cover"}
                                    source={{
                                        uri: x.thumbnail == null || x.thumbnail == '' ? imageBaseUrl + x.media : imageBaseUrl + x.thumbnail
                                    }}
                                    style={[styles.postImage]} />
                                {index == 0 &&
                                    <View style={[styles.imageUpperView, { bottom: 10 }]}>
                                        {this.props.timeLine.detail?.route_id?.start_time ?
                                            <View style={styles.imageUpperTimeView}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={[styles.userPostsText, { fontSize: 14, color: '#fff' }]}>{I18n.t('start_time')}:</Text>
                                                    <Text style={[styles.userPostsText, { fontSize: 14, marginLeft: 5, color: '#fff' }]}>{moment(this.props.timeLine.detail.route_id.start_time).format('HH:mm')}</Text>
                                                </View>
                                                <View style={styles.endTimeView}>
                                                    <Text numberOfLines={1} style={[styles.userPostsText, { fontSize: 14, maxWidth: '80%', color: '#fff' }]}>{I18n.t('endTime')}:</Text>
                                                    <Text style={[styles.userPostsText, { fontSize: 14, marginLeft: 5, color: '#fff' }]}>{moment(this.props.timeLine.detail.route_id.end_time).format('HH:mm')}</Text>
                                                </View>
                                            </View> : null}
                                        {this.props.timeLine.detail.route_id &&
                                            <View style={[styles.imageUpperTimeView, { marginTop: 5 }]}>
                                                <View style={[styles.endTimeView, { alignItems: 'center' }]}>
                                                    <Icon
                                                        name='dashboard'
                                                        size={16} color='#fff'
                                                    />
                                                    <Text
                                                        style={[styles.userPostsText, { fontSize: 14, marginLeft: 5, color: '#fff' }]}>{((this.props.timeLine.detail.route_id.distance / 1000) * 0.621371).toFixed(2)} mi</Text>
                                                </View>
                                                <View style={styles.endTimeView}>
                                                    <MaterialIcons
                                                        name='query-builder'
                                                        size={20}
                                                        color="#fff" />
                                                    <Text style={[styles.userPostsText, { fontSize: 14, color: '#fff', marginLeft: 5 }]}>{this.getTime(this.props.timeLine.detail.route_id.minute)}</Text>
                                                </View>
                                            </View>}
                                    </View>}
                            </TouchableOpacity>
                    : null
        )
    }

    //view pages
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

        return (
            mediaImages?.length > 0 ? <>
                <ViewPager
                    orientation='horizontal'
                    scrollEnabled={true}
                    initialPage={0}
                    overScrollMode='always'
                    onPageSelected={(e) => { this.setState({ index: e.nativeEvent.position }) }}
                    onPageScrollStateChanged={() => { this.player !== undefined && console.log('swipe', this.player.pause()); }}
                    showPageIndicator={mediaImages.length > 1 ? this.state.pageIndShow : false}
                    style={styles.viewPager}>
                    {mediaImages?.map((x, index) => {
                        return this.renderImages(x, index)
                    })}
                </ViewPager>
                {(mediaImages && Platform.OS == 'android' && mediaImages.length > 1) &&
                    <View style={styles.dotView} >
                        <Dots
                            length={mediaImages.length}
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
                : null
        )
    };

    bottomView = () => {
        return (
            <>
                <View style={{
                    paddingVertical: 7, paddingHorizontal: 10,
                    borderBottomWidth: 1, borderColor: '#ccc', width: '98%', flexDirection: 'row',
                    alignItems: 'center', justifyContent: 'space-between', alignSelf: 'center'
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <CachedImage source={AppImages.images.like} style={{ height: 20, width: 20 }} />
                        <Text style={[styles.userPostsText, { fontSize: 12, marginLeft: 5, color: 'gray' }]}>{this.props?.timeLine?.detail?.total_likes}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.userPostsText, { fontSize: 12, color: 'gray' }]}>{this.props.timeLine.detail.total_comments} {this.props.timeLine.detail.total_comments == '1' ? I18n.t('Comment') : I18n.t('Comments')} </Text>
                        <Text style={[styles.userPostsText, { fontSize: 12, color: 'gray' }]}>{this.props.timeLine.detail.total_shares} {this.props.timeLine.detail.total_shares == '1' ? I18n.t('Share') : I18n.t('Shares')}</Text>
                    </View>
                </View>
            </>
        )
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
                            if (this.props.timeLine?.detail?.shared_by) {
                                if (this.state.userDetail !== this.props.timeLine.detail?.shared_by?._id) {
                                    this.props.clearProfileData()

                                    this.props.navigation.navigate("NameOfTheUser", {
                                        key: null,
                                        userDetail: this.props.timeLine.detail?.shared_by,
                                    })
                                }
                                else {
                                    this.props.navigation.navigate("UserNamess", {
                                        onNavigationBack: () => null,
                                    })
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
                                    this.props.navigation.navigate("UserNamess", {
                                        onNavigationBack: () => null,
                                    })
                                }
                            }
                        }}
                        style={styles.userImage}>
                        <CachedImage
                            resizeMode='cover'
                            source={
                                this.props.timeLine.detail?.shared_by
                                    ?
                                    this.props.timeLine.detail.shared_by.profile !== '' &&
                                        this.props.timeLine.detail.shared_by.profile !== null
                                        ?
                                        { uri: imageBaseUrl + this.props.timeLine.detail.shared_by.profile }
                                        :
                                        AppImages.images.user01
                                    :
                                    this.props.timeLine.detail?.user?.profile !== '' &&
                                        this.props.timeLine.detail?.user?.profile !== null
                                        ?
                                        { uri: imageBaseUrl + this.props.timeLine.detail?.user.profile }
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
                                    if (this.props.timeLine?.detail?.shared_by) {
                                        if (this.state.userDetail !== this.props.timeLine.detail?.shared_by?._id) {
                                            this.props.clearProfileData()

                                            this.props.navigation.navigate("NameOfTheUser", {
                                                key: null,
                                                userDetail: this.props.timeLine.detail?.shared_by,
                                            })
                                        }
                                        else {
                                            this.props.navigation.navigate("UserNamess", {
                                                onNavigationBack: () => null,
                                            })
                                        }
                                    }
                                    else {
                                        if (this.state.userDetail !== this.props.timeLine.detail?.user?._id) {
                                            this.props.navigation.navigate("NameOfTheUser", {
                                                key: null,
                                                userDetail: this.props.timeLine?.detail?.user,
                                            });
                                        }
                                        else {
                                            this.props.clearProfileData()
                                            this.props.navigation.navigate("UserNamess", {
                                                onNavigationBack: () => null,
                                            })
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
                                    onPress={() => this.props.navigation.navigate('TagFriends', { item: this.props.timeLine.detail?.tag_friends })}
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
                                                {' ' + this.props.timeLine.detail?.tag_friends[1].userName}
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
                                    {' in '}
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
                                        flex: 1,
                                        fontSize: 14
                                    }
                                ]}>
                                {this.props.timeLine.detail?.route_id?.terminal?.terminal_name}
                            </Text>
                        }
                        <Text
                            numberOfLines={2}
                            style={[styles.dateTimeText]}>
                            {
                                this.props?.timeLine?.detail?.created_at ?
                                    dateDifferenceInDays(this.props?.timeLine?.detail?.created_at) : null}
                        </Text>
                    </View>
                </View>
                {this.props.timeLine.detail ?
                    <>
                        {this.props.timeLine.detail?.shared_by ?
                            <Text
                                numberOfLines={3}
                                style={[
                                    styles.sharedByText
                                ]}>
                                {this.props.timeLine.detail.shared_by.userName + ' ' + I18n.t('hasShared') + ' ' + this.props.timeLine.detail?.user?.userName + "'s" + ' ' + I18n.t('post') + '.'}
                            </Text>
                            : null
                        }
                        {this.props.timeLine.detail?.description ?
                            <View
                                style={[
                                    styles.descriptionText
                                ]}>
                                <ReadMore
                                    numberOfLines={5}
                                    renderTruncatedFooter={this._renderTruncatedFooter}
                                    renderRevealedFooter={this._renderRevealedFooter}
                                    onReady={this._handleTextReady}
                                >
                                    <Text
                                        style={[
                                            styles.descriptionText
                                        ]}>
                                        {this.props.timeLine.detail?.description}
                                    </Text>
                                </ReadMore>
                            </View>
                            :
                            null
                        }
                        {!this.props.timeLine.detail.route_id ? this.props.timeLine.detail.media_type !== 'text' &&
                            <View style={[styles.postImageView, { height: width * 0.5, width: '100%', }]}>
                                {
                                    this.props.timeLine.detail?.images?.length > 0 ?
                                        this._renderItem(this.props.timeLine.detail, 'images')
                                        :
                                        this.props.timeLine.detail.route_id ?
                                            this._renderItem(this.props.timeLine.detail.route_id, 'routes')
                                            :
                                            this._renderItem(this.props.timeLine.detail, 'images')
                                }
                            </View>
                            :
                            <View style={[styles.postImageView, { height: width * 0.5, width: '100%', }]}>
                                {
                                    this._renderItem(this.props.timeLine.detail.route_id, 'routes')
                                }

                            </View>
                        }
                    </>
                    :
                    <View style={[styles.postImageView]}>
                        {this.props.timeLine.detail?.shared_by ?
                            <Text numberOfLines={3}
                                style={[styles.userPostsText, styles.sharedByText,
                                { paddingBottom: this.props.timeLine.detail.description ? 0 : 20 }]}
                            >
                                {this.props.timeLine.detail.shared_by.userName + ' ' + I18n.t('hasShared') + ' ' + this.props.timeLine.detail?.user?.userName + "'s" + ' ' + I18n.t('post') + '.'}</Text>
                            : null
                        }
                        {this.props.timeLine.detail?.description ?
                            <View style={[styles.userPostsText, styles.descriptionText]}>
                                <ReadMore
                                    numberOfLines={5}
                                    renderTruncatedFooter={this._renderTruncatedFooter}
                                    renderRevealedFooter={this._renderRevealedFooter}
                                    onReady={this._handleTextReady}> <Text style={[styles.userPostsText, styles.descriptionText]}>{this.props.timeLine.detail?.description}</Text> </ReadMore></View> : null}
                        {this.props.timeLine.detail?.thumbnail_image ?
                            <View style={{ height: width * 0.5, width: '100%' }}>
                                <TouchableOpacity
                                    onPress={() =>
                                        this.props.navigation.navigate('VideoPreview', {
                                            response: { 'media': this.props.timeLine.detail.video }, thumbnail: this.props.timeLine.detail.thumbnail_image, terminalResult: { id: this.item?._id },
                                            screen: 'timeLineDetail',
                                            type: 'video'
                                        })}
                                >
                                    <ImageBackground
                                        style={styles.container}
                                        source={{ uri: imageBaseUrl + this.props.timeLine.detail?.thumbnail_image }}
                                        resizeMode="cover"  >
                                        <View style={styles.imageContainer}>
                                            <CachedImage source={AppImages.images.play} resizeMode="contain" style={styles.cacheImage} />
                                        </View>
                                    </ImageBackground>
                                </TouchableOpacity>
                            </View> :
                            <CachedImage
                                resizeMode={"cover"}
                                source={{ uri: imageBaseUrl + this.props.timeLine.detail?.video }}
                                style={[styles.postImage]} />
                        }
                    </View>
                }
            </>
        )
    }


    //comment flat list method
    CommentArray = () => {
        return (
            <FlatList
                keyboardDismissMode={'on-drag'}

                refreshControl={<RefreshControl onRefresh={() => { this.onRefresh() }} refreshing={this.state.refreshing} />}
                scrollEnabled={this.state.scrollEnable}
                onScroll={() => { this.setState({ isScrolling: true }) }}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                ref={(ref) => this.flatRef = ref}
                data={this.props.timeLine.comment}
                extraData={this.props}
                keyExtractor={(item, index) => index.toString()}
                renderItem={this.renderItem}
                ListEmptyComponent={this.emptyData}
                style={styles.flatListComment}
                nestedScrollEnabled={true}
            />
        )
    }
    emptyData = () => {
        return (
            <View style={styles.noComment}>
                <Text style={[styles.userPostsText]}>{I18n.t('noCommentYet')}</Text>
                <Text style={[styles.userPostsText]}>{I18n.t('enterFirstComment')}</Text>
            </View>
        )
    }

    render() {
        let headerTitle = this.props.timeLine.detail?.shared_by ?
            this.props.timeLine.detail?.shared_by.userName
            :
            this.props.timeLine.detail?.user?.userName
        return (
            <View style={styles.container}>
                <Loader loading={this.props.timeLine.onLoad} />
                {Platform.OS == 'ios' ?
                    <View style={{ height: '11%' }}>
                        <Header
                            headerTitle={
                                I18n.t("Comments")
                            }
                            leftImageSource={AppImages.images.back}
                            leftbackbtnPress={() => {
                                this.setState({ isScrolling: true })
                                this.goBAck(this.props.navigation)
                            }}
                        />
                    </View> :
                    <Header
                        headerTitle={
                            I18n.t("Comments")
                        }
                        leftImageSource={AppImages.images.back}
                        leftbackbtnPress={() => {
                            this.setState({ isScrolling: true })
                            this.goBAck(this.props.navigation)
                        }}
                    />
                }
                <ScrollView
                    onScroll={() => {
                        this.setState({ isScrolling: true })
                    }}
                    refreshControl={
                        Platform.OS == 'ios' ?
                            <RefreshControl onRefresh={() => { this.onRefresh() }} refreshing={this.state.refreshing} />
                            : null
                    }
                    scrollEnabled={this.state.scrollEnable}
                    keyboardShouldPersistTaps='always'
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                    ref={(ref) => this.scrollRefsecond = ref}
                    contentContainerStyle={[styles.container]}
                    keyboardDismissMode={'on-drag'}
                >
                    {this.CommentArray()}
                    <View style={styles.bottomView} >
                        {this.renderToolbar()}
                        {this.renderSend()}
                    </View>
                    {this.state.replyedUser &&
                        this.replyedUser(this.state.replyedUser)
                    }
                </ScrollView>
                {this.state.replyedUser && Platform.OS == 'android' &&
                    this.replyedUser(this.state.replyedUser)
                }
                <ActionSheet
                    ref={o => this.ActionSheet2 = o}
                    options={[I18n.t('Cancel'), I18n.t('Edit'), I18n.t('Delete')]}
                    destructiveButtonIndex={2}
                    cancelButtonIndex={0}
                    onPress={(index) => { this.androidActionSheetPress2(index) }}
                />
            </View>
        )
    }
}
function mapStateToProps(state) {
    return {
        timeLine: state.timeLine,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        commentLikeAction,
        timeLineComment,
        timeLinePostDetail,
        timeLinePostDetailClear,
        deleteComemnt,
        deleteTimeLinePost,
        clearProfileData
    }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Comments);