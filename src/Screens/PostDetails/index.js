import React, { Component } from 'react';
import {
    View,
    SafeAreaView,
    Image,
    Text,
    TouchableOpacity,
    Alert,
    ActivityIndicator
} from 'react-native';
import styles from './styles'
import ReportPost from '../../Components/ReportPost'
import { Header, LiveStreamRender, UserPosts, Loader, Pulse, DataManager } from './../../Components';
import { AppStyles, AppConstants, AppImages, DateFormat, Dimensions } from './../../Themes';
import VideoPlayer from 'react-native-video-player';
import Share from 'react-native-share';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { terminalDetailsAction, videoUploadAction, likeDislikeAction, followUnfollowTerminalAction, terminalPostReportAction } from '../../Redux/actions/TerminalDetail';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import { deletePostInitiate, onReachEndPost } from '../../Redux/actions/MyPosts'
import { imageBaseUrl, showImageUrl } from '../../Config';
import I18n from 'react-native-i18n'
class PostDetails extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            header: <Header
                headerTitle={I18n.t('Post_Details')}
                leftImageSource={AppImages.images.back} leftbackbtnPress={() => navigation.goBack()} />
        }
    };
    constructor(props) {
        super(props)
        this.state = {
            userId: null,
            sideMenu: false,
            textReportUser: null,
            postId: null,
            loadImages: false

        }
    }
    componentDidMount() {
        DataManager.getUserDetails().then((response) => {
            this.setState({ userId: JSON.parse(response).data._id })

        })
    }
    sharePress = (item) => {
        const shareOptions = {
            title: 'FR8',
            subject: "FR8",
            message: 'My terminal post:- ',
            url: showImageUrl + item.video,
            social: Share.Social.WHATSAPP
        };
        Share.open(shareOptions);
    }
    likeButtonNotify = (item, index) => {
        let { navigation } = this.props
        if (item.is_like !== null && item.is_like !== undefined) {
            if (item.is_like == 0) {
                this.props.likeDislikeAction(item._id, 1, index, route.params.likeDislikeype, navigation)
            }
            else if (item.is_like == 2) {
                this.props.likeDislikeAction(item._id, 1, index, route.params.likeDislikeype, navigation)
            }
            else {
                this.props.likeDislikeAction(item._id, 2, index, route.params.likeDislikeype, navigation)
            }
        }
        else {
            if (item.like_status == 0) {
                this.props.likeDislikeAction(item._id, 1, index, route.params.likeDislikeype, navigation)
            }
            else if (item.like_status == 2) {
                this.props.likeDislikeAction(item._id, 1, index, route.params.likeDislikeype, navigation)
            }
            else {
                this.props.likeDislikeAction(item._id, 2, index, route.params.likeDislikeype, navigation)
            }

        }
    }
    likeButton = (item, index) => {
        let { navigation } = this.props
        if (item.like_status == 0) {
            this.props.likeDislikeAction(item._id, 1, index, route.params.likeDislikeype, navigation)
        }
        else if (item.like_status == 2) {
            this.props.likeDislikeAction(item._id, 1, index, route.params.likeDislikeype, navigation)
        }
        else {
            this.props.likeDislikeAction(item._id, 2, index, route.params.likeDislikeype, navigation)
        }
    }

    disLikeButton = (item, index) => {
        let { navigation } = this.props
        if (item.like_status == 2) {
            this.props.likeDislikeAction(item._id, 0, index, route.params.likeDislikeype, navigation)
        }
        else if (item.like_status == 1) {
            this.props.likeDislikeAction(item._id, 0, index, route.params.likeDislikeype, navigation)
        }
        else {
            this.props.likeDislikeAction(item._id, 2, index, route.params.likeDislikeype, navigation)
        }
    }
    disLikeButtonNotification = (item, index) => {
        let { navigation } = this.props
        if (item.is_like !== undefined && item.is_like !== null) {
            if (item.is_like == 2) {
                this.props.likeDislikeAction(item._id, 0, index, route.params.likeDislikeype, navigation)
            }
            else if (item.is_like == 1) {
                this.props.likeDislikeAction(item._id, 0, index, route.params.likeDislikeype, navigation)
            }
            else {
                this.props.likeDislikeAction(item._id, 2, index, route.params.likeDislikeype, navigation)
            }
        }
        else {
            if (item.like_status == 2) {
                this.props.likeDislikeAction(item._id, 0, index, route.params.likeDislikeype, navigation)
            }
            else if (item.like_status == 1) {
                this.props.likeDislikeAction(item._id, 0, index, route.params.likeDislikeype, navigation)
            }
            else {
                this.props.likeDislikeAction(item._id, 2, index, route.params.likeDislikeype, navigation)
            }

        }
    }


    likeButtonMyPost = (item, index) => {
        let { navigation } = this.props
        if (item.is_like == 0) {
            this.props.likeDislikeAction(item._id, 1, index, "myPost", navigation)
        }
        else if (item.is_like == 2) {
            this.props.likeDislikeAction(item._id, 1, index, "myPost", navigation)
        }
        else {
            this.props.likeDislikeAction(item._id, 2, index, "myPost", navigation)
        }
    }

    disLikeButtonMyPost = (item, index) => {
        let { navigation } = this.props
        if (item.is_like == 2) {
            this.props.likeDislikeAction(item._id, 0, index, "myPost", navigation)
        }
        else if (item.is_like == 1) {
            this.props.likeDislikeAction(item._id, 0, index, "myPost", navigation)
        }
        else {
            this.props.likeDislikeAction(item._id, 2, index, "myPost", navigation)
        }
    }
    submitButtonReportUser = () => {
        if (!this.state.textReportUser || this.state.textReportUser.length < 2) {
            alert(I18n.t('PleaseEnterReportResion'))
        } else {
            this.props.terminalPostReportAction({ post_id: this.state.postId, description: this.state.textReportUser })
            this.setState({ sideMenu: false, textReportUser: null })
        }
    }
    postStatusLike = (item, index, likeDislikeype) => {
        if (likeDislikeype == "Notification") {
            return (
                <View style={[styles.rowEndView, { justifyContent: 'space-between', width: "50%" }]}>
                    <TouchableOpacity style={[styles.likeButton]} onPress={this.likeButtonNotify.bind(this, item, index)}>
                        <Image source={item.is_like ? item.is_like !== 1 ? AppImages.images.notLike : AppImages.images.like : item.like_status !== 1 ? AppImages.images.notLike : AppImages.images.like} style={{ width: 25, height: 25 }} />
                        <Text styles={styles.countText}>{item.like_count}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.likeButton} onPress={this.disLikeButtonNotification.bind(this, item, index)}>
                        <Image source={item.dislike_count !== 0 ? AppImages.images.disLike : AppImages.images.notDisLike} style={{ width: 25, height: 25 }} />
                        <Text styles={styles.countText}>{item.dislike_count}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginLeft: 8 }} onPress={this.sharePress.bind(this, item)}>
                        <Image source={AppImages.images.share} style={{ width: 25, height: 25 }} />
                    </TouchableOpacity>
                    {this.state.userId === item.user_id ? <TouchableOpacity style={{ marginLeft: 15 }} onPress={() => {

                        Alert.alert(
                            I18n.t('deletePostAlert'),
                            "",
                            [
                                {
                                    text: I18n.t('Yes'),
                                    onPress: () => { this.props.deletePostInitiate({ item, navigation: this.props.navigation, screen: 'postDetails' }) }
                                },
                                {
                                    text: I18n.t('No'),
                                    onPress: () => { }
                                },

                            ],
                            { cancelable: false },
                        )





                    }}>
                        <Icon name='trash' color={'#c2c2c2'} size={25}></Icon>
                    </TouchableOpacity> :
                        <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => {
                            Alert.alert(
                                I18n.t('reportPostAlert'),
                                "",
                                [
                                    {
                                        text: I18n.t('Yes'),
                                        onPress: () => { this.setState({ postId: item._id, sideMenu: true }) }
                                    },
                                    {
                                        text: I18n.t('No'),
                                        onPress: () => { }
                                    },

                                ],
                                { cancelable: false },
                            )
                        }}>
                            <Image resizeMode='contain' style={{ width: 25, height: 25 }} source={AppImages.images.postDark} />
                        </TouchableOpacity>}

                </View>
            )
        }
        if (likeDislikeype == "myPost") {
            return (<View style={[styles.rowEndView, { justifyContent: 'space-between', width: "50%" }]}>
                <TouchableOpacity style={[styles.likeButton]} onPress={this.likeButtonMyPost.bind(this, item, index)}>
                    <Image source={item.is_like !== 1 ? AppImages.images.notLike : AppImages.images.like} style={{ width: 25, height: 25 }} />
                    <Text styles={styles.countText}>{item.like_count}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.likeButton} onPress={this.disLikeButtonMyPost.bind(this, item, index)}>
                    <Image source={item.dislike_count !== 0 ? AppImages.images.disLike : AppImages.images.notDisLike} style={{ width: 25, height: 25 }} />
                    <Text styles={styles.countText}>{item.dislike_count}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ marginLeft: 8 }} onPress={this.sharePress.bind(this, item)}>
                    <Image source={AppImages.images.share} style={{ width: 25, height: 25 }} />
                </TouchableOpacity>
                <TouchableOpacity style={{ marginLeft: 15 }} onPress={() => {

                    Alert.alert(
                        I18n.t('deletePostAlert'),
                        "",
                        [
                            {
                                text: I18n.t('Yes'),
                                onPress: () => { this.props.deletePostInitiate({ item, navigation: this.props.navigation, screen: 'postDetails' }) }
                            },
                            {
                                text: I18n.t('No'),
                                onPress: () => { }
                            },

                        ],
                        { cancelable: false },
                    )





                }}>
                    <Icon name='trash' color={'#c2c2c2'} size={25}></Icon>
                </TouchableOpacity>
            </View>)

        }
        if (likeDislikeype == 'terminal') {
            return (
                <View style={[styles.rowEndView, { justifyContent: 'space-between', width: "50%", }]}>

                    <TouchableOpacity style={styles.likeButton} onPress={this.likeButton.bind(this, item, index)}>
                        <Image source={item.like_status !== 1 ? AppImages.images.notLike : AppImages.images.like} style={{ width: 25, height: 25 }} />
                        <Text styles={[styles.countText]}>{item.like_count}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.likeButton, { marginLeft: 10 }]} onPress={this.disLikeButton.bind(this, item, index)}>
                        <Image source={item.like_status == 0 ? AppImages.images.disLike : AppImages.images.notDisLike} style={{ width: 25, height: 25 }} />
                        <Text styles={styles.countText}>{item.dislike_count}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.likeButton, { marginLeft: 8 }]} onPress={this.sharePress.bind(this, item)}>
                        <Image source={AppImages.images.share} style={{ width: 25, height: 25 }} />
                    </TouchableOpacity>
                    {this.state.userId === item.user_id ? <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => {
                        Alert.alert(
                            I18n.t('deletePostAlert'),
                            "",
                            [
                                {
                                    text: I18n.t('Yes'),
                                    onPress: () => { this.props.deletePostInitiate({ item, navigation: this.props.navigation, screen: 'postDetails' }) }
                                },
                                {
                                    text: I18n.t('No'),
                                    onPress: () => { }
                                },

                            ],
                            { cancelable: false },
                        )




                    }}>
                        <Icon name='trash' color={'#c2c2c2'} size={25}></Icon>
                    </TouchableOpacity> : <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => {
                        Alert.alert(
                            I18n.t('reportPostAlert'),
                            "",
                            [
                                {
                                    text: I18n.t('Yes'),
                                    onPress: () => { this.setState({ postId: item._id, sideMenu: true }) }
                                },
                                {
                                    text: I18n.t('No'),
                                    onPress: () => { }
                                },

                            ],
                            { cancelable: false },
                        )
                    }}>
                            <Image resizeMode='contain' style={{ width: 25, height: 25 }} source={AppImages.images.postDark} />
                        </TouchableOpacity>}
                </View>
            )

        }
        if (likeDislikeype == 'UserProfile') {
            return (<View style={[styles.rowEndView, { justifyContent: 'space-between', width: "50%" }]}>

                <TouchableOpacity style={[styles.likeButton, { marginLeft: 10 }]} onPress={this.likeButtonMyPost.bind(this, item, index)}>
                    <Image source={item.is_like !== 1 ? AppImages.images.notLike : AppImages.images.like} style={{ width: 25, height: 25 }} />
                    <Text styles={styles.countText}>{item.like_count}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.likeButton, { marginLeft: 10 }]} onPress={this.disLikeButtonMyPost.bind(this, item, index)}>
                    <Image source={item.dislike_count !== 0 ? AppImages.images.disLike : AppImages.images.notDisLike} style={{ width: 25, height: 25 }} />
                    <Text styles={styles.countText}> {item.dislike_count}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.likeButton, { marginLeft: 8 }]} onPress={this.sharePress.bind(this, item)}>
                    <Image source={AppImages.images.share} style={{ width: 25, height: 25 }} />
                </TouchableOpacity>
                <TouchableOpacity style={{ marginLeft: 8 }} onPress={() => {
                    Alert.alert(

                        I18n.t('reportPostAlert'),
                        "",
                        [
                            {
                                text: I18n.t('Yes'),
                                onPress: () => { this.setState({ postId: item._id, sideMenu: true }) }
                            },
                            {
                                text: I18n.t('No'),
                                onPress: () => { }
                            },

                        ],
                        { cancelable: false },
                    )
                }}>
                    <Image resizeMode='contain' style={{ width: 25, height: 25 }} source={AppImages.images.postDark} />
                </TouchableOpacity>
                {/* <Loader
                    loading=
                    {
                        this.props.terminalDetailState.onLoad || this.props.videoUploadState.onLoad || this.props.likeDislikeState.onLoad

                    }
                /> */}
            </View>)
        }
    }
    render() {
        let item = this.props.route.params.item,
            index = this.props.route.params.index,
            likeDislikeype = this.props.route.params.likeDislikeype
        return (
            <SafeAreaView style={styles.mainContainer}>
                <Loader
                    loading=
                    {
                        this.props.terminalDetailState.onLoad || this.props.videoUploadState.onLoad || this.props.likeDislikeState.onLoad

                    }
                />
                <ReportPost
                    loading={this.state.sideMenu}
                    anyTap={() => this.setState({ sideMenu: false, textReportUser: null })}
                    caneclButton={() => this.setState({ sideMenu: false, textReportUser: null })}
                    submitButton={this.submitButtonReportUser}
                    onChangeText={textReportUser => this.setState({ textReportUser })}

                />
                <View style={[AppStyles.container, { paddingHorizontal: 15, paddingTop: 15 }]}>
                    <View style={styles.userView}>
                        <Image source={item.profile ? { uri: imageBaseUrl + item.profile } : AppImages.images.user01} resizeMode="cover" style={styles.userImage} />
                        <Text style={[styles.userPostsText,{textAlign:'left'}]}>{item.created_by}</Text>
                    </View>
                    <View style={[styles.rowEndView, { marginBottom: 10 }]}>
                        <Text style={styles.userPostsText}>{DateFormat.toTime(item.created_at)}</Text>
                        <Text style={styles.userPostsText}>{DateFormat.toDate(item.created_at)}</Text>
                    </View>

                    {item.type === 'image' ?
                        <Image style={{ width: Dimensions.deviceWidth, height: (Dimensions.deviceWidth) / 2, marginLeft: -15 }} source={{ uri: imageBaseUrl + item.video }} />
                        :
                        <View>
                            <VideoPlayer
                                onStart={() => this.setState({ loadImages: true })}
                                onProgress={() => this.setState({ loadImages: false })}
                                resizeMode='cover'
                                // endWithThumbnail
                                thumbnail={item.thumbnail_image ? { uri: imageBaseUrl + item.thumbnail_image } : AppImages.images.videoDummy}
                                video={{ uri: imageBaseUrl + item.video }}
                                videoWidth={Dimensions.deviceWidth}
                                videoHeight={(Dimensions.deviceWidth) / 2}
                                ref={r => this.player = r}
                            />
                            {this.state.loadImages && <View style={{
                                position: "absolute",
                                left: 0,
                                right: 0,

                                top: 0,
                                bottom: 0,
                                opacity: 0.7,
                                justifyContent: "center",
                                alignItems: "center",
                            }}>
                                <ActivityIndicator size="large" color="black" />
                            </View>}
                        </View>

                    }

                    {this.postStatusLike(item, index, likeDislikeype)}
                    <View style={{ marginTop: 15 }}>
                        <Text>
                            {this.props.route.params.item.description}
                        </Text>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}
function mapStateToProps(state) {
    return {
        homeState: state.HomeState,
        terminalDetailState: state.TerminalDetailState,
        videoUploadState: state.VideoUploadState,
        likeDislikeState: state.LikeDislikeState,
        followUnfollowTerminalState: state.FollowUnfollowTerminalState
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ terminalDetailsAction, videoUploadAction, likeDislikeAction, followUnfollowTerminalAction, deletePostInitiate, terminalPostReportAction }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(PostDetails);