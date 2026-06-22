import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, AppState, Dimensions, Platform, Linking, Share } from 'react-native';
import I18n from 'react-native-i18n'
import { ReviewModal } from '../../Components/ReviewModal';
import { DataManager } from '../../Components';
import { fontFamily } from '../../Themes/AppFontFamily';
import CheckinPosts from './checkinPosts';
import Overview from './Overview';
import ReviewList from './ReviewList';
import TimelinePosts from './TimelinePosts';
import { getUSerDetail, getPopRef } from '../../Config';
const width = Dimensions.get('screen').width
// let toggle=false
export default class TabBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: '',
            itemPress: null,
            selectedStar: 5,
            ratingReview: false,
            selectedIndex: 1,
            phoneNumbers: null,
            textReportUser: null
        };
        this.toggle = false
    }

    refreshData = () => {
        if (this?.props?.terminalDetailState?.result?._id) {
            if (this.state.selectedIndex == 3) {
                this.props.ratingLIstByTerminal(JSON.stringify({ "terminal_id": this.props.terminalDetailState.result._id, "search": '', "offset": 0, "limit": 10 }), this.props.navigation)

            }
            else if (this.state.selectedIndex == 5) {
                this.props.routePostLIstByTerminal(JSON.stringify({ "terminal_id": this.props.terminalDetailState.result._id, "offset": 0, "limit": 10 }), this.props.navigation, this.state.userId)

            }

            else if (this.state.selectedIndex == 4) {
                this.props.checkinPostLIstByTerminal(JSON.stringify({ "terminal_id": this.props.terminalDetailState.result._id, "offset": 0, "limit": 10 }), this.props.navigation)

            }
        }
    }
    paginationCall = (data) => {
        if (this?.props?.terminalDetailState?.result?._id) {
            if (this.state.selectedIndex == 3) {
                if (data.latestArrayRating.length == 10) {
                    this.props.ratingLIstByTerminal(JSON.stringify({ "terminal_id": this.props.terminalDetailState.result._id, "search": '', "offset": this.props.terminalDetailState.terminalRating.length, "limit": 10, }), this.props.navigation, this.props.terminalDetailState.terminalRating.length)
                }

            }
            else if (this.state.selectedIndex == 5) {
                if (data.latestArrayRoute.length == 10) {

                    this.props.routePostLIstByTerminal(JSON.stringify({ "terminal_id": this.props.terminalDetailState.result._id, "offset": this.props.terminalDetailState.terminalRoutes.length, "limit": 10, }), this.props.navigation, this.state.userId, this.props.terminalDetailState.terminalRoutes.length)
                }
            }

            else if (this.state.selectedIndex == 4) {
                if (data.latestArrayCheckinPost.length == 10) {
                    this.props.checkinPostLIstByTerminal(JSON.stringify({ "terminal_id": this.props.terminalDetailState.result._id, "offset": this.props.terminalDetailState.terminalCheckinPost.length, "limit": 10, }), this.props.navigation, this.props.terminalDetailState.terminalCheckinPost.length)
                }
            }
        }
    }

    share = async () => {
        try {
            const result = await Share.share({

                message: I18n.t('installMessage'),
                title: 'FR8',

            }, {
                subject: "FR8"
            })
            console.log('result', result);
            if (result.action == Share.sharedAction) {
                console.log('result.activityType', result.activityType);
                if (result.activityType) {
                    this.toggle = false
                }
                else {
                }
            }
            else if (result.action == Share.dismissedAction) {
                this.toggle = false
            }
        }
        catch (e) {
            console.log(e)
            this.toggle = false
        }
    }


    getDetail = async () => {
        let userData = await DataManager.getUserDetails();
        let jsonData = await JSON.parse(userData);
        this.setState({ userId: jsonData?.data?._id });

        if (!jsonData) {
            let dummyData = await DataManager.getDummyUserDetails()
            console.log('dummyData', dummyData);
            if (dummyData) {
                this.setState({ userId: dummyData.data.userId })
            }
        }
    };

    componentDidMount() {
        this.getDetail()
        AppState.addEventListener('change', (state) => {
            console.log('state', state);
            if (state == 'active') {
                this.toggle = false
            }
        })
    }

    openMap = () => {
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${this.props.terminalDetailState.result.latitude},${this.props.terminalDetailState.result.longitude}`;
        const label = this.props.terminalDetailState.result.terminal_name;
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });
        Linking.openURL(url);
    }

    renderIcons = (index, icon, name) => {
        return (<TouchableOpacity
            onPress={() => {
                if (index == 3) {
                    this.props.followButtonClicked(this.props.terminalDetailState.result)
                }
                else if (index == 1) {
                    this.props.iconPress(1)
                }
                else if (index == 2) {
                    this.openMap()
                }
                else {
                    if (Platform.OS == 'android' && this.toggle == false) {
                        this.toggle = true
                        this.share()
                    }
                    else if (Platform.OS == 'ios') {
                        this.share()
                    }
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

    isLogin = async (text) => {
        let data = await getUSerDetail()
        if (data) {
            return true
        }
        else {
            getPopRef().modalOpen(text)
            return false
        }
    }

    tabRender = (index, name) => {
        return (<TouchableOpacity
            activeOpacity={0.7}
            onPress={async () => {
                this.getDetail()
                if (index == 6) {
                    let login = await this.isLogin()
                    if (login) {
                        this.setState({ selectedIndex: index })
                        setTimeout(() => {
                            if (this?.props?.terminalDetailState?.result?._id) {
                                if (index == 3) {
                                    this.props.ratingLIstByTerminal(JSON.stringify({ "terminal_id": this.props.terminalDetailState.result._id, "search": '', "offset": 0, "limit": 10 }), this.props.navigation)
                                }
                                else if (index == 5) {
                                    this.props.routePostLIstByTerminal(JSON.stringify({ "terminal_id": this.props.terminalDetailState.result._id, "offset": 0, "limit": 10 }), this.props.navigation, this.state.userId)
                                }
                            }
                        }, 200);
                    }
                }
                else {
                    this.setState({ selectedIndex: index })
                    setTimeout(() => {
                        if (this?.props?.terminalDetailState?.result?._id) {
                            if (index == 3) {
                                this.props.ratingLIstByTerminal(JSON.stringify({ "terminal_id": this.props.terminalDetailState.result._id, "search": '', "offset": 0, "limit": 10 }), this.props.navigation)
                            }
                            else if (index == 5) {
                                this.props.routePostLIstByTerminal(JSON.stringify({ "terminal_id": this.props.terminalDetailState.result._id, "offset": 0, "limit": 10 }), this.props.navigation, this.state.userId)
                            }
                            else if (index == 4) {
                                this.props.checkinPostLIstByTerminal(JSON.stringify({ "terminal_id": this.props.terminalDetailState.result._id, "offset": 0, "limit": 10 }), this.props.navigation)
                            }
                        }
                    }, 200);
                }
            }}
            style={{
                width: width * 0.9 / 5, justifyContent: 'center', paddingVertical: 15,
                flexDirection: "row", borderBottomWidth: this.state.selectedIndex == index ? 2 : 0, borderColor: '#29a2e1'
            }}>
            <Text
                style={{ color: this.state.selectedIndex == index ? "#29a2e1" : '#000' }}
            >{name}</Text>
        </TouchableOpacity>)
    }

    render() {
        return (
            <>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: 15 }}>
                    {this.renderIcons(1, require('../../Images/call.png'), I18n.t('CALL'))}
                    {this.renderIcons(2, require('../../Images/mapPinIcon.png'), I18n.t('ADDRESS'))}
                    {this.renderIcons(3, require('../../Images/follow.png'), this.props.terminalDetailState.result.is_follow == true ? I18n.t("Un_Follow").toUpperCase() : I18n.t("Follow").toUpperCase())}
                    {this.renderIcons(4, require('../../Images/shareicon.png'), I18n.t('Share').toUpperCase())}
                </View>
                <View style={{
                    borderColor: 'silver',
                    paddingHorizontal: 20,
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '100%', marginTop: 15, borderWidth: 1
                }}>
                    {this.tabRender(1, I18n.t('Overview'))}
                    {this.tabRender(2, I18n.t('About'))}
                    {this.tabRender(3, I18n.t('Review'))}
                    {this.tabRender(4, I18n.t('post'))}
                    {this.tabRender(5, I18n.t('Timelines'))}
                </View>

                {
                    this.state.selectedIndex == 1 ?
                        <Overview
                            navigation={this.props.navigation}
                            data={this.props.terminalDetailState.result}
                        />
                        :
                        this.state.selectedIndex == 2 ?
                            this.props.terminalDetailState.result?.aboutUs ? <Text style={{ fontFamily: fontFamily.regular, fontSize: 14, padding: 10 }}>
                                {this.props.terminalDetailState.result?.aboutUs} </Text>
                                :
                                <View style={{ alignItems: 'center', justifyContent: 'center', height: Dimensions.get('screen').height * 0.2 }}>
                                    <Text>No about us found</Text>
                                </View>
                            :
                            this.state.selectedIndex == 3 ?
                                <ReviewList
                                    onEndReached={() => this.paginationCall(this.props.terminalDetailState)}
                                    navigation={this.props.navigation}
                                    openRating={() => this.setState({ ratingReview: true, selectedStar: 5 })}
                                    data={this.props.terminalDetailState.terminalRating}
                                />
                                :
                                this.state.selectedIndex == 4 ?
                                    <CheckinPosts
                                        onEndReached={() => this.paginationCall(this.props.terminalDetailState)}
                                        navigation={this.props.navigation}
                                        data={this.props.terminalDetailState.terminalCheckinPost}
                                    />
                                    :
                                    this.state.selectedIndex == 5 ?
                                        <TimelinePosts
                                            onEndReached={() => this.paginationCall(this.props.terminalDetailState)}
                                            navigation={this.props.navigation}
                                            data={this.props.terminalDetailState.terminalRoutes}
                                        /> :
                                        null
                }
                <ReviewModal
                    selectedStar={this.state.selectedStar}
                    loading={this.state.ratingReview}
                    anyTap={
                        () => this.setState({ ratingReview: false, textReportUser: null })}
                    caneclButton={
                        () => this.setState({ ratingReview: false, textReportUser: null })}
                    submitButton={(selectedStars) => {
                        this.props.addRating(this.state.textReportUser?.trim(), selectedStars, this.props.terminalDetailState.result._id, this.props.navigation)
                        this.setState({ ratingReview: false, textReportUser: null })
                    }}
                    value={this.state.textReportUser}
                    onChangeText={textReportUser => this.setState({ textReportUser: textReportUser })}
                />
            </>
        );
    }
}
