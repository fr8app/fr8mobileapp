import React, { Component } from 'react';
import { View, Text, FlatList, Image, Dimensions, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { imageBaseUrl } from '../../Config';
import { fontFamily } from '../../Themes/AppFontFamily';
import I18n from 'react-native-i18n'
import { AppImages } from '../../Themes';
import { CachedImage } from '../../Components/react-native-cached-image-master'
import moment from 'moment';
import ReadMore from 'react-native-read-more-text';
import { getUSerDetail, getPopRef } from '../../Config';

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
class CheckinPosts extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    isLogin = async (text) => {
        let data = await getUSerDetail()
        console.log('data', data);
        if (data) {
            return true
        }
        else {
            console.log('kkkkkkk', getPopRef());
            getPopRef().modalOpen()
            return false
        }
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
        // var sDisplay = s > 0 ? s + (s == 1 ? " " + I18n.t('secs') : " " + I18n.t('secs')) : "0 " + I18n.t('secs');
        if (h > 0) {
            return hDisplay + mDisplay
        }
        else {
            return mDisplay
        }
    }

    renderItem = ({ item, index }) => {


        let imagesArray = []
        let userImages = []
        if (item?.route_post) {
            if (userImages?.length == 0) {
                imagesArray.push(imageBaseUrl + item?.route_post?.image + 'type=image')
                userImages.push({ 'media': item?.route_post?.image, 'thumbnail': '', receipt_private: '0', type: 'timeLine', height: 256, width: 512 })
            }
            if (userImages.length > 0) {
                item.route_post.route_media.map((x, v) => {
                    if (this.state.userDetail && this.state.userDetail == x.user_id) {
                        imagesArray.push(imageBaseUrl + x.media + 'type=image')
                        if (v == 0) {
                            userImages.push(x)
                        } else {
                            userImages.push(x)
                        }
                    }
                    else {
                        if (item?.route_post?.receipt_private == '1') {
                            if (x.type == 'interchange_file') {
                                return true
                            }
                            else {
                                imagesArray.push(imageBaseUrl + x.media + 'type=image')
                                userImages.push(x)
                            }
                        }
                        else {
                            imagesArray.push(imageBaseUrl + x.media + 'type=image')
                            userImages.push(x)
                        }
                    }
                })
                item?.route_post?.medias?.length > 0 && item?.route_post?.medias.map((mm, vv) => {
                    if (mm?.is_video) {
                        imagesArray.push(imageBaseUrl + mm.thumbnail + 'type=video')
                        userImages.push({ 'media': mm.url, 'thumbnail': mm.thumbnail, receipt_private: '0', type: 'video', height: mm.thumbnail_height ? mm.thumbnail_height : 16, width: mm.thumbnail_width ? mm.thumbnail_width : 8, itemLength: 10 })
                    }
                    else {
                        imagesArray.push(imageBaseUrl + mm?.url + 'type=image')
                        userImages.push({ 'media': mm.url, 'thumbnail': null, receipt_private: '0', type: 'image', height: mm?.height ? mm?.height : 16, width: mm.width ? mm.width : 8, itemLength: 10 })
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
                        item?.images?.map((x, i) => {
                            imagesArray.push(imageBaseUrl + x.url + 'type=image')

                            userImages.push({ 'media': x?.url, 'thumbnail': null, receipt_private: '0', type: 'timeLine', height: x?.height ? x?.height : 16, width: x?.width ? x?.width : 8, itemLength: item?.images?.length })

                        })
                        if (item?.video) {
                            imagesArray.push(item?.thumbnail_image ? imageBaseUrl + item?.thumbnail_image + 'type=video' : imageBaseUrl + item?.video + 'type=image')
                            userImages.push({ 'media': item?.video, 'thumbnail': item?.thumbnail_image ? item?.thumbnail_image : null, receipt_private: '0', type: 'video', height: item?.thumbnail_height, width: item?.thumbnail_width, itemLength: item?.images?.length })
                        }
                    }
                    else {
                        imagesArray.push(item?.thumbnail_image ? imageBaseUrl + item?.thumbnail_image + 'type=video' : imageBaseUrl + item?.video + 'type=image')
                        userImages.push({ 'media': item?.video, 'thumbnail': item?.thumbnail_image ? item?.thumbnail_image : null, receipt_private: '0', type: item?.thumbnail_image ? 'video' : 'timeLine', height: item?.thumbnail_height, width: item?.thumbnail_width })
                    }
                }
                else {
                    imagesArray.push(item?.thumbnail_image ? imageBaseUrl + item?.thumbnail_image + 'type=video' : imageBaseUrl + item?.video + 'type=image')
                    userImages.push({ 'media': item?.video, 'thumbnail': item?.thumbnail_image ? item?.thumbnail_image : null, receipt_private: '0', type: 'timeLine', height: item?.thumbnail_height, width: item?.thumbnail_width })
                }
            }

        }



        return (
            // <View style={{ backgroundColor:'rgb(242,242,242)',borderRadius:30,margin:10,   shadowColor: 'gray' }}>
            <TouchableOpacity
                onPress={async () => {
                    let login = await this.isLogin()
                    if (login) {
                        this.props.navigation.navigate('PostFullView', { index: 0, item: item, userImages: userImages, imagesArray: imagesArray })
                    }
                }}
                style={{
                    padding: 3,
                    backgroundColor: 'rgba(256,256,256,1)',
                    borderWidth: 10, borderColor: 'rgba(242,242,242,0.7)',
                    borderRadius: 20,
                    shadowColor: 'rgba(0, 0, 0, 0.09)',
                    shadowOffset: {
                        height: 1, width: 1
                    },
                    shadowOpacity: 1,
                    marginHorizontal: 10,
                    marginVertical: 10,
                }}>
                <View style={{ justifyContent: 'center', marginLeft: 5, marginRight: 5, marginTop: 5 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <CachedImage style={{ height: 50, width: 50, borderRadius: 25 }} resizeMode='cover'
                            source={item.user.profile ? { uri: imageBaseUrl + item.user.profile } : AppImages.images.user01}
                        />
                        <View style={{ marginLeft: 5, width: '80%' }}>
                            <Text style={{ fontFamily: fontFamily.semiBold, fontSize: 16 }} >{item.user.userName}</Text>
                            <Text style={{ fontFamily: fontFamily.regular, fontSize: 14, }} >{item.post_location}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <View
                                    style={{ flexDirection: 'row', alignItems: 'center' }}>
                                </View>
                            </View>
                        </View>
                    </View>
                    {userImages.length > 0 ? <TouchableOpacity
                        activeOpacity={1}
                        onPress={async () => {
                            let login = await this.isLogin()
                            if (login) {
                                this.props.navigation.navigate('PostFullView', { index: 0, item: item, userImages: userImages, imagesArray: imagesArray })
                            }
                        }
                        }
                        style={{ width: '100%', justifyContent: 'center', aspectRatio: 1.87, borderRadius: 10, marginVertical: 5 }}>
                        {
                            <CachedImage
                                source={{ uri: userImages[0].type == 'video' ? imageBaseUrl + userImages[0].thumbnail : imageBaseUrl + userImages[0].media }}
                                style={{ height: '100%', width: '100%', borderRadius: 10, }}
                            />
                        }
                        {
                            userImages[0].type == 'video' ?
                                <CachedImage
                                    resizeMode="contain"
                                    source={AppImages.images.play}
                                    style={{
                                        position: 'absolute',
                                        width: 40,
                                        height: 40,
                                        overflow: 'hidden',
                                        borderRadius: 25,
                                        alignSelf: 'center'
                                    }}
                                />
                                : null
                        }
                    </TouchableOpacity> : null}
                    {item.description ?
                        <ReadMore
                            numberOfLines={5}
                            renderTruncatedFooter={this._renderTruncatedFooter}
                            renderRevealedFooter={this._renderRevealedFooter}>
                            <Text
                                numberOfLines={5}
                                style={{ fontFamily: fontFamily.regular, marginVertical: 5 }}>{item.description}</Text>
                        </ReadMore>
                        : null}
                </View>
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
                            <Text>{I18n.t('TimeLine_post_not_found')}</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(CheckinPosts);
