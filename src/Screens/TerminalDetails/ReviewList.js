import React, { Component } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { imageBaseUrl } from '../../Config';
import { fontFamily } from '../../Themes/AppFontFamily';
import { AppImages } from '../../Themes';
import I18n from 'react-native-i18n'
import dateDifferenceInDays from '../../Components/dateDifferenceInDays';
import styles from './styles';
import ReadMore from 'react-native-read-more-text';
import { CachedImage } from '../../Components/react-native-cached-image-master'
import { getUSerDetail, getPopRef } from '../../Config';

const starts = [1, 2, 3, 4, 5]
class ReviewList extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    //read more
    _renderTruncatedFooter = (handlePress) => {
        return (
            <Text
                style={{
                    color: '#29a2e1',
                    marginTop: 5
                }}
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
                style={{
                    color: '#29a2e1',
                    marginTop: 5
                }}
                onPress={handlePress}
            >
                Read less
            </Text>
        );
    }
    getTime = (seconds) => {
        seconds = Number(seconds);
        var h = Math.floor(seconds / (3600));
        var m = Math.floor(seconds % 3600 / 60);
        var s = Math.floor(seconds % 60);
        var hDisplay = h > 0 ? h + (h == 1 ? " " + I18n.t('hrs') + ' ' : " " + I18n.t('hrs') + ' ') : "";
        var mDisplay = m > 0 ? m + (m == 1 ? " " + I18n.t('mins') + ' ' : " " + I18n.t('mins') + ' ') : [s > 29 ? "1 " : "0 "] + I18n.t('mins');
        if (h > 0) {
            return hDisplay + mDisplay
        }
        else {
            return mDisplay
        }
    }

    renderItem = ({ item, index }) => {
        return (
            <View style={{
                backgroundColor: 'white',
                padding: 10,
                shadowColor: 'rgba(0, 0, 0, 0.09)',
                shadowOffset: {
                    height: 1, width: 1
                },
                elevation: 5,
                shadowOpacity: 1,
                marginHorizontal: 15, marginVertical: 5,
            }}>
                <View style={{ justifyContent: 'center', marginLeft: 5 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <CachedImage style={{ height: 50, width: 50, borderRadius: 25 }} resizeMode='cover'
                            source={item.user.profile ? { uri: imageBaseUrl + item.user.profile } : AppImages.images.user01}
                        />
                        <View style={{ marginLeft: 6 }}>
                            <Text style={{ fontFamily: fontFamily.bold, fontSize: 16 }} >{item.user.userName}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <View
                                    style={{ flexDirection: 'row', alignItems: 'center' }}
                                >
                                    {
                                        item?.rating ?
                                            starts.map((x, index) => {
                                                return (
                                                    <Image resizeMode='contain' source={item?.rating >= x ? require('../../Images/circleImages/star.png') : require('../../Images/circleImages/emptyStar.png')} style={{ marginHorizontal: 1, height: 10, width: 10 }} />
                                                )
                                            })
                                            :
                                            null
                                    }
                                    <Text style={{ fontFamily: fontFamily.light, paddingLeft: 5 }}>{dateDifferenceInDays(item.updated_at)}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    {item.review ?
                        <ReadMore
                            numberOfLines={5}
                            renderTruncatedFooter={this._renderTruncatedFooter}
                            renderRevealedFooter={this._renderRevealedFooter}>
                            <Text style={{ fontFamily: fontFamily.regular, }}>{item.review}</Text>
                        </ReadMore>
                        : null}
                </View>
            </View>
        )
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
    render() {
        return (
            <View style={{ flex: 1 }}>
                <View>
                    <TouchableOpacity style={[styles.tabs, { flexDirection: 'row', justifyContent: 'flex-start', marginHorizontal: 30, paddingTop: 10 }]}
                        onPress={
                            async () => {
                                let login = await this.isLogin()
                                if (login) {
                                    this.props.openRating()
                                }
                            }
                        }
                    >
                        <View style={{ backgroundColor: "rgb(227,232,234)", padding: 10, borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                            <Image resizeMode='contain'
                                style={styles.hintImages}
                                source={AppImages.images.ratings}
                            />
                        </View>
                        <View style={{ alignSelf: 'center' }}>
                            <Text style={{ marginLeft: 5 }}>
                                <Image resizeMode='contain' source={require('../../Images/circleImages/star.png')} style={{ marginHorizontal: 1, height: 10, width: 10 }} />
                                <Image resizeMode='contain' source={require('../../Images/circleImages/star.png')} style={{ marginHorizontal: 1, height: 10, width: 10 }} />
                                <Image resizeMode='contain' source={require('../../Images/circleImages/star.png')} style={{ marginHorizontal: 1, height: 10, width: 10 }} />
                                <Image resizeMode='contain' source={require('../../Images/circleImages/star.png')} style={{ marginHorizontal: 1, height: 10, width: 10 }} />
                                <Image resizeMode='contain' source={require('../../Images/circleImages/star.png')} style={{ marginHorizontal: 1, height: 10, width: 10 }} />
                            </Text>
                            <Text style={[styles.hintHeading, { marginLeft: 5 }]} >
                                {I18n.t("ratings")}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <FlatList
                    onEndReached={() => this.props.onEndReached()}
                    scrollEventThrottle={16}
                    style={{ paddingBottom: 30 }}
                    renderItem={this.renderItem}
                    data={this.props.data}
                    extraData={this.props}
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

export default connect(mapStateToProps, mapDispatchToProps)(ReviewList);
