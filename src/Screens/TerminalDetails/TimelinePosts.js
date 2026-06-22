import React, { Component } from 'react';
import { View, Text, FlatList, Image, Dimensions, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { imageBaseUrl, getPopRef, getUSerDetail } from '../../Config';
import { fontFamily } from '../../Themes/AppFontFamily';
import I18n from 'react-native-i18n'
import moment from 'moment';
import NetInfo from '@react-native-community/netinfo';
let dataPost = [
    {
        img: 'panel/defaultImages/depot.png',
        title: 'May 23, 2022',
        mi: '19 mi',
        mins: '131 mins'
    },
    {
        img: 'panel/defaultImages/depot.png',
        title: 'May 23, 2022',
        mi: '19 mi',
        mins: '131 mins'
    },
    {
        img: 'panel/defaultImages/depot.png',
        title: 'May 23, 2022',
        mi: '19 mi',
        mins: '131 mins'
    },
    {
        img: 'panel/defaultImages/depot.png',
        title: 'May 23, 2022',
        mi: '19 mi',
        mins: '131 mins'
    },
    {
        img: 'panel/defaultImages/depot.png',
        title: 'May 23, 2022',
        mi: '19 mi',
        mins: '131 mins'
    },
    {
        img: 'panel/defaultImages/depot.png',
        title: 'May 23, 2022',
        mi: '19 mi',
        mins: '131 mins'
    },
]
class TimelinePosts extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    getTime = (seconds) => {
        seconds = Number(seconds);
        var h = Math.floor(seconds / (3600));
        var m = Math.floor(seconds % 3600 / 60);
        var s = Math.floor(seconds % 60);
        var hDisplay = h > 0 ? h + (h == 1 ? " " + I18n.t('hrs') + ' ' : " " + I18n.t('hrs') + ' ') : "";
        var mDisplay = m > 0 ? m + (m == 1 ? " " + I18n.t('mins') + ' ' : " " + I18n.t('mins') + ' ') : [s > 29 ? "1 " : "0 "] + I18n.t('mins');
        // var sDisplay = s > 0 ? s + (s == 1 ? " " + I18n.t('secs') : " " + I18n.t('secs')) : "0 " + I18n.t('secs');
        if (h > 0) {
            return hDisplay + mDisplay
        }

        else {
            return mDisplay
        }
    }

    isLogin = async (text) => {
        let data = await getUSerDetail()
        console.log('data', data);
        if (data) {
            return true
        }
        else {
            console.log('kkkkkkk', getPopRef());
            // getPopRef().modalOpen(text)
            return false
        }
    }

    renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={async () => {
                    let login = await this.isLogin()
                    if (login == true) {
                        NetInfo.fetch().then((res) => {
                            if (res.isConnected) {
                                this.props.navigation.navigate('TimeLineDetail', { item: item })
                            }
                            else {
                                alert(I18n.t('please_check_your_internet_connection'))

                            }
                        })
                    }
                    else {
                        this.props.navigation.navigate('TimeLine')
                    }
                }}
                style={{
                    flexDirection: 'row', padding: 3, justifyContent: 'space-between', backgroundColor: 'rgba(256,256,256,1)', borderWidth: 10, borderColor: 'rgba(242,242,242,0.7)', borderRadius: 20,
                    shadowColor: 'rgba(0, 0, 0, 0.09)',
                    shadowOffset: {
                        height: 1, width: 1
                    },
                    shadowOpacity: 1,
                    marginHorizontal: 10, marginVertical: 10,
                }}>
                <View style={{ justifyContent: 'center', marginLeft: 5 }}>
                    <Text
                        style={{ fontSize: 16, fontFamily: fontFamily.semiBold }}
                    >{moment(item.created_at).format('MMMM DD, YYYY')}</Text>
                    <View style={{ flexDirection: 'row', marginVertical: 8, alignItems: 'center' }}>
                        <Image
                            resizeMode='cover'
                            style={{ height: 25, width: 25 }}
                            source={require('../../Images/circleImages/meter.png')} />
                        <Text style={{ marginLeft: 6, fontSize: 13, fontFamily: fontFamily.semiBold }}>
                            {item.distance == 0 ? '0 mi' : ((item.distance / 1000) * 0.621371).toFixed(2) + ' mi'}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image
                            resizeMode='cover'
                            style={{ height: 25, width: 25 }}
                            source={require('../../Images/circleImages/time.png')} />
                        <Text style={{ marginLeft: 6, fontSize: 13, fontFamily: fontFamily.semiBold }}>
                            {this.getTime(item.minute)}
                        </Text>
                    </View>
                </View>
                <Image
                    resizeMode='cover'
                    style={{ margin: 10, height: 100, width: 100, borderRadius: 20 }}
                    source={{ uri: imageBaseUrl + item.image }} />
            </TouchableOpacity>
        )
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    onEndReached={() => this.props.onEndReached()}
                    renderItem={this.renderItem}
                    data={this.props.data}
                    extraData={this.props}
                    ListEmptyComponent={() => {
                        return (<View style={{ alignItems: 'center', justifyContent: 'center', height: Dimensions.get('screen').height * 0.2 }}>
                            <Text>{I18n.t('Journey')}</Text>
                        </View>)
                    }}
                />
            </View>
        );
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
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TimelinePosts);
