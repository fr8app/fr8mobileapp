
import React, { Component } from "react";
import {
    View,
    FlatList,
    Platform,
    Image,
    Text,
    TouchableOpacity,
    Dimensions,
    ScrollView,
} from "react-native";
import {
    selectedTerminalAction,

} from "../../Redux/actions/Home";
import styles from './styles'
import { Header, UserPosts, Loader, DataManager } from './../../Components';
import { AppStyles, AppImages, DateFormat, AppColor } from './../../Themes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    ratingLIstByTerminal,
    routePostLIstByTerminal,
    terminalDetailsAction,
    terminalDetailsActionend,
    videoUploadAction,
    likeDislikeAction,
    followUnfollowTerminalAction,
    videoPlayAction,
    clearTerminalDetail,
    terminalPostReportAction,
    setUserNumber,
    addRating,
    deleteTerminalVideo,
    checkinPostLIstByTerminal
} from '../../Redux/actions/TerminalDetail';
import Share from 'react-native-share';
import { PushNotification } from '../../PushManager/index';
import I18n from 'react-native-i18n';
import ReportPost from '../../Components/ReportPost'
import geolocation from '@react-native-community/geolocation'
import MapComponent from './MapComponent';
import { imageBaseUrl, showImageUrl, getUSerDetail, getPopRef } from '../../Config';
import _BackgroundTimer from "react-native-background-timer";
import { fontFamily } from "../../Themes/AppFontFamily";
import { AFLogEvent } from "../../Config/aws";
import TabBar from "./TabBar";

var thisParam = null;
var interval;

class TerminalDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemPress: null,
            selectedStar: 5,
            ratingReview: false,
            selectedIndex: 1,
            onlineUsers: 0,
            userDetail: "",
            searchText: null,
            thumbnailPath: null,
            region: {
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0,
                longitudeDelta: 0
            },
            latitude: null,
            longitude: null,
            loading: false,
            refreshControl: false,
            userId: null,
            sideMenu: false,
            textReportUser: null,
            postId: null,
            item: null,
            visiblity: null,
            phoneNumbers: []

        }
        thisParam = this
        this.push = PushNotification
        this.loading = false
    }

    backBtn() {
        this.props.route.params.onNavigationBack()
        this.props.navigation.goBack()
        this.props.clearTerminalDetail()
    }

    componentDidMount() {
        console.log('this.props.', this.props);
        AFLogEvent("TerminalDetail", { screen: 'TerminalDetail' })
        this.props.navigation.addListener("blur", () => {
            this.liveStreamRef?.renderUnMount()
            _BackgroundTimer.clearInterval(interval)
        });
        this.props.navigation.addListener("focus", () => {
            this.liveStreamRef?.renderMount()

        });

        if (interval !== null && interval !== undefined) {
            _BackgroundTimer.clearInterval(interval);
        }


        DataManager.getUserDetails().then((response) => {
            this.setState({ userId: JSON.parse(response).data._id })
        })
        this.getUserDetail()
        let { navigation } = this.props;
        if (this.props.route.params) {
            if (this.props.route.params.terminaldata) {
                this.props.terminalDetailsAction(this.props.route.params.terminaldata.id ? this.props.route.params.terminaldata.id : this.props.route.params.terminaldata._id, 1, navigation)
            }
        }
        this.props.terminalDetailsAction(
            this.props.route.params.terminaldata.id
                ? this.props.route.params.terminaldata.id
                : this.props.route.params.terminaldata._id,
            1,
            navigation
        );
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            if (prevProps.terminalDetailState !== this.props.terminalDetailState) {

                if (prevProps.terminalDetailState?.totalUser !== this.props.terminalDetailState?.totalUser) {
                    this.setState({ onlineUsers: this.props.terminalDetailState?.totalUser })
                    this?.mapRef?.setonLineUSers(this.props.terminalDetailState?.totalUser)
                }

                if (prevProps.terminalDetailState?.apiSuccess !== this.props.terminalDetailState?.apiSuccess) {
                    if (this.props.terminalDetailState?.apiSuccess == true) {
                        this.props.terminalDetailState.apiSuccess = false
                        this.props.terminalDetailsAction(
                            this.props.route.params.terminaldata.id
                                ? this.props.route.params.terminaldata.id
                                : this.props.route.params.terminaldata._id,
                            1,
                            this.props.navigation
                        );
                        this.props.ratingLIstByTerminal(JSON.stringify({ "terminal_id": this.props.terminalDetailState.result._id, "search": '', "offset": 0, "limit": 10 }), this.props.navigation)
                    }
                }
            }
        }
    }

    getUserDetail() {
        DataManager.getUserDetails().then((response) => {
            if (response) {
                this.setState({ userDetail: JSON.parse(response).data });
            }
        });
    }

    onChatPress = async () => {
        let login = await this.isLogin(`It's time to Track current Wait Times!\nSetting up your profile allows you to post, see current wait times, share your detention time, and unlock other features that work for you`)
        if (login) {
            this.props.navigation.navigate("TerminalChat", {
                item: this.props.terminalDetailState.result,
            });
        }
    }

    fetchData() {
        if (this.props.route.params) {
            if (this.props.route.params.terminaldata) {
                this.props.terminalDetailsAction(
                    this.props.route.params.terminaldata.id
                        ? this.props.route.params.terminaldata.id
                        : this.props.route.params.terminaldata._id,
                    1,
                    this.props.navigation
                );
            }
        }
    }



    _renderItem = ({ item, index }) => {
        const userId = this.state.userId;
        return (
            <View style={
                { paddingHorizontal: 20 }} >
                <UserPosts
                    Description={item.description}
                    stateId={userId}
                    itemId={item.user_id}
                    terminalReport={
                        () => {
                            this.setState({ sideMenu: true, postId: item._id ? item._id : item.id })
                        }
                    }
                    type={item.type}
                    video={item.video}
                    imageSource={item.thumbnail_image ? { uri: imageBaseUrl + item.thumbnail_image } : AppImages.images.videoDummy}
                    likeSource={item.like_status !== 1 && item.like_status !== '1' ? AppImages.images.notLike : AppImages.images.like}
                    disLikeSource={item.like_status !== 0 && item.like_status !== '0' ? AppImages.images.notDisLike : AppImages.images.disLike}
                    shareSource={AppImages.images.share}
                    playSource={AppImages.images.play}
                    viewSource={AppImages.images.views}
                    disLikeText={item.dislike_count}
                    likeText={item.like_count}
                    timeText={DateFormat.toTime(item.created_at)}
                    dateText={DateFormat.toDate(item.created_at)}
                    fullName={item.created_by}
                    userSource={item.profile ? { uri: imageBaseUrl + item.profile } : AppImages.images.user01}
                    videoOnPress={this.videoClicked.bind(this, item, index)}
                    likeButton={this.likeButton.bind(this, item, index)}
                    disLikeButton={this.disLikeButton.bind(this, item, index)}
                    shareButton={this.shareButton.bind(this, item, index)}
                    delete={
                        () => {
                            DataManager.getUserDetails().then((response) => {
                                this.props.deleteTerminalVideo({ item, })
                            })
                        }
                    }
                />
            </View>)
    };

    likeButton = (item, index) => {
        let { navigation } = this.props
        if (item.like_status == 0 && item.like_status == '0') {
            this.props.likeDislikeAction(item._id ? item._id : item.id, 1, index, "terminal", navigation)
        } else if (item.like_status == 2 && item.like_status == '2') {
            this.props.likeDislikeAction(item._id ? item._id : item.id, 1, index, "terminal", navigation)
        } else {
            this.props.likeDislikeAction(item._id ? item._id : item.id, 2, index, "terminal", navigation)
        }
    }

    disLikeButton = (item, index) => {
        let { navigation } = this.props
        if (item.like_status == 2 && item.like_status == '2') {
            this.props.likeDislikeAction(item._id ? item._id : item.id, 0, index, "terminal", navigation)
        } else if (item.like_status == 1 && item.like_status == '1') {
            this.props.likeDislikeAction(item._id ? item._id : item.id, 0, index, "terminal", navigation)
        } else {
            this.props.likeDislikeAction(item._id ? item._id : item.id, 2, index, "terminal", navigation)
        }
    }

    shareButton = (item, index) => {
        console.log('terminal_name', item);

        const shareOptions = {
            title: 'FR8',
            subject: "FR8",
            message: 'My terminal post:- ',
            url: showImageUrl + item.video,
            social: Share.Social.WHATSAPP
        };
        Share.open(shareOptions);
    }

    videoClicked = (item, index) => {
        this.props.videoPlayAction(item, index, "terminal", this.props.navigation)
    }




    isLogin = async (text) => {
        let data = await getUSerDetail()
        console.log('data', data);
        if (data) {
            return true
        }
        else {
            console.log('kkkkkkk', getPopRef());
            getPopRef().modalOpen(text)
            return false
        }
    }

    followButtonClicked = async (result) => {
        let login = await this.isLogin('Would you like to follow this terminal?\nSetting up your profile allows you to follow a terminal, and unlocks other FR8 app features that work for you')
        if (login) {
            if (result.is_follow == false) {
                this.props.followUnfollowTerminalAction(result._id, 1, 0, this.props.navigation)
            } else {
                this.props.followUnfollowTerminalAction(result._id, 0, 0, this.props.navigation)
            }
        }
    }

    checkLoactionValid = async () => {
        let result = this.props.terminalDetailState.result,
            latitude = result.latitude ? result.latitude : 0,
            longitude = result.longitude ? result.longitude : 0,
            distance = null,
            latLong = null
        await geolocation.getCurrentPosition(
            function (position) {
                latLong = geolib.getDistance(position.coords, {
                    latitude: latitude,
                    longitude: longitude
                })
                if (latLong !== null) {
                    distance = geolib.convertUnit('km', latLong, 2)
                }
                return distance
            },
            function () {
            }, {
            enableHighAccuracy: true
        }
        );
        this.loading = false
        return distance
    }


    mapComponent = (terminalRegion, origin, destination, result) => {
        return (
            <MapComponent
                terminalRegion={terminalRegion}
                origin={origin}
                destination={destination}
                result={result}
                ref={refs => this.mapRef = refs}
                totalUsers={this.props.terminalDetailState?.totalUser > 0 ? this.props.terminalDetailState?.totalUser : '0'}
            />
        )
    }

    renderIcons = (index, icon, name) => {
        return (<TouchableOpacity
            onPress={() => {
                if (index == 3) {
                    this.followButtonClicked(this.props.terminalDetailState.result)
                }
                else if (index == 1) {
                    this.setState({ itemPress: 1, phoneNumbers: this.props.terminalDetailState.result.phone })
                }
                else if (index == 2) {
                    this.setState({ itemPress: 2 })
                }
            }}
            style={{ width: '24%', alignItems: 'center' }}>
            <Image
                resizeMode='contain'
                style={{ height: 40, width: 40 }}
                source={icon} />
            <Text numberOfLines={1} style={{ marginTop: 5, textAlign: 'center', color: '#29a2e1', fontFamily: fontFamily.semiBold }}>{name}</Text>
        </TouchableOpacity>)
    }

    renderHeader() {
        let result = this.props.terminalDetailState.result
        const terminalRegion = {
            latitude: result !== null && result !== undefined ? result.latitude !== null && result.latitude !== undefined ? result.latitude : 0 : 0,
            longitude: result !== null && result !== undefined ? result.longitude !== null && result.longitude !== undefined ? result.longitude : 0 : 0,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        }

        const origin = this.state.region;
        const destination = terminalRegion

        return (
            <View style={
                { top: -10 }} >
                <View style={
                    {
                        width: "100%",
                    }}>
                </View>

                {this.mapComponent(terminalRegion, origin, destination, result)}
                <TabBar
                    iconPress={(index) => {
                        if (index == 1) {
                            if (this.props.terminalDetailState?.result?.phone) {
                                if (this.props.terminalDetailState?.result?.phone?.length == 0) {
                                    alert('Phone number is not added.')
                                }
                                else {
                                    this.props.navigation.navigate('PhoneCall', { "phoneNumbers": this.props?.terminalDetailState?.result?.phone })
                                }
                            }
                            else {
                                alert('Phone number is not added.')
                            }
                        }
                        else if (index == 2) {
                            this.setState({ itemPress: 2 })
                        }
                    }}
                    followButtonClicked={() => this.followButtonClicked(this.props.terminalDetailState.result)
                    }
                    ref={(ref) => this.tabRef = ref}
                    {...this.props}
                />
            </View>
        )
    }
    refreshData = () => {
        this.tabRef.refreshData()
        this.setState({ refreshControl: true }, () => {
            this.fetchData()
            setTimeout(() => {
                this.setState({ refreshControl: false })
            }, 1000);
        })
    }
    submitButtonReportUser = () => {
        if (!this.state.textReportUser || this.state.textReportUser.length < 2) {
            alert(I18n.t('PleaseEnterReportResion'))
        } else {
            this.props.terminalPostReportAction({ post_id: this.state.postId, description: this.state.textReportUser })
            this.setState({ sideMenu: false, textReportUser: null })
        }
    }

    render() {
        const { navigation, route } = this.props
        return (
            <View style={styles.mainContainer} >
                {
                    Platform.OS == 'android' ?
                        <Header
                            headerTitle={I18n.t("TerminalDetails")}
                            maxWidth={Dimensions.get('screen').width * 0.48}
                            leftImageSource={AppImages.images.back}
                            leftbackbtnPress={
                                () => thisParam.backBtn()}
                            rightImageSource={AppImages.images.chat}
                            rightBackBtnPress={
                                () => thisParam.onChatPress()}
                        /> :
                        <View style={{ flex: 0.13 }}>
                            <Header
                                headerTitle={I18n.t("TerminalDetails")}
                                maxWidth={Dimensions.get('screen').width * 0.48}
                                leftImageSource={AppImages.images.back}
                                leftbackbtnPress={
                                    () => thisParam.backBtn()}
                                rightImageSource={AppImages.images.chat}
                                rightBackBtnPress={
                                    () => thisParam.onChatPress()}
                            />
                        </View>}
                <Loader
                    loading=
                    {
                        this.props.terminalDetailState.onLoad || this.props.videoUploadState.onLoad || this.props.likeDislikeState.onLoad ||
                        this.props.followUnfollowTerminalState.onLoad || this.props.videoPlayState.onLoad || this.state.loading
                    }
                />
                <View style={styles.mainContainer}>
                    <ReportPost
                        loading={this.state.sideMenu}
                        anyTap={
                            () => this.setState({ sideMenu: false, textReportUser: null })}
                        caneclButton={
                            () => this.setState({ sideMenu: false, textReportUser: null })}
                        submitButton={this.submitButtonReportUser}
                        onChangeText={textReportUser => this.setState({ textReportUser })}
                    />
                    <View style={
                        [AppStyles.container, { paddingHorizontal: 0 }]} >
                        {
                            this.props.terminalDetailState.result !== null ?
                                <FlatList
                                    refreshing={this.state.refreshControl}
                                    onRefresh={
                                        () => { this.refreshData() }}
                                    ListHeaderComponent={this.renderHeader()
                                    }
                                    contentContainerStyle={
                                        { paddingTop: '2.4%' }}
                                    data={[]}
                                    extraData={
                                        [this.state, this.props, this.props.terminalDetailState.post]}
                                    renderItem={this._renderItem}
                                    showsVerticalScrollIndicator={false}
                                    onEndReachedThreshold={10}
                                    onEndReached={
                                        () => {
                                            console.log('end rr');
                                            this.tabRef.paginationCall(this.props.terminalDetailState)
                                        }
                                    }
                                />
                                :
                                null
                        }
                    </View>
                </View>
                {this.state.itemPress ? <View pointerEvents="box-none" style={[styles.background, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
                    <View style={[styles.background, {
                    }]}>
                        <View style={[styles.wrap, { justifyContent: 'center', height: Dimensions.get('screen').height * 0.3, width: Dimensions.get('screen').width * 0.7 }]}>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => {
                                    this.setState({ itemPress: null })
                                }}
                                style={{ position: 'absolute', top: '-10%', right: '-11%' }}>
                                <Image resizeMode='contain' style={{ height: 50, width: 50 }} source={require('../../Images/cross.png')} />
                            </TouchableOpacity>
                            {
                                this.state.itemPress == 1 ?
                                    <FlatList
                                        showsVerticalScrollIndicator={false}
                                        contentContainerStyle={{}}
                                        data={this.state.phoneNumbers}
                                        renderItem={({ item, index }) => {
                                            return (
                                                <View style={{ borderWidth: 1, borderRadius: 5, borderColor: '#29a2e1', width: '100%', marginTop: index == 0 ? 0 : 5 }}>
                                                    <Text style={{ color: '#29a2e1', textAlign: 'center', width: '100%', alignSelf: 'center', paddingVertical: 10, fontSize: 16, fontFamily: fontFamily.regular }}>
                                                        {item}
                                                    </Text>
                                                </View>
                                            )
                                        }}
                                    /> :
                                    this.state.itemPress == 2 ?
                                        <ScrollView showsVerticalScrollIndicator={false}>
                                            <View style={
                                                { marginRight: 10, marginTop: 0, marginBottom: 20 }} >

                                                <Image
                                                    resizeMode='contain'
                                                    style={{ alignSelf: 'center', height: 50, width: 50, marginBottom: 10 }}
                                                    source={require('../../Images/mapPinIcon.png')} />
                                                <Text style={[styles.locationText, { marginLeft: 0, color: '#29a2e1', textAlign: 'center' }]} >
                                                    {this.props.terminalDetailState.result.terminal_location}
                                                </Text>
                                                {
                                                    this.props.terminalDetailState.result.city ?
                                                        <>
                                                            <Text style={[styles.locationText, { textAlign: 'center', marginLeft: 0, color: '#29a2e1' }]} >{this.props.terminalDetailState.result.city}, {this.props.terminalDetailState.result.state_province} </Text>
                                                            <Text style={[styles.locationText, { textAlign: 'center', marginLeft: 0, color: '#29a2e1' }]} >{this.props.terminalDetailState.result.country}, {this.props.terminalDetailState.result.zipcode} </Text>
                                                        </> : null
                                                }
                                            </View>
                                        </ScrollView>
                                        : null
                            }

                        </View>
                    </View>
                </View> : null
                }
            </View>
        )
    }
}

function mapStateToProps(state) {
    return {
        homeState: state.HomeState,
        terminalDetailState: state.TerminalDetailState,
        videoUploadState: state.VideoUploadState,
        likeDislikeState: state.LikeDislikeState,
        followUnfollowTerminalState: state.FollowUnfollowTerminalState,
        videoPlayState: state.VideoPlayState
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        checkinPostLIstByTerminal,
        ratingLIstByTerminal,
        routePostLIstByTerminal,
        terminalDetailsAction,
        terminalDetailsActionend,
        clearTerminalDetail,
        videoPlayAction,
        videoUploadAction,
        likeDislikeAction,
        followUnfollowTerminalAction,
        terminalPostReportAction,
        deleteTerminalVideo,
        setUserNumber,
        selectedTerminalAction,
        addRating
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TerminalDetails);
