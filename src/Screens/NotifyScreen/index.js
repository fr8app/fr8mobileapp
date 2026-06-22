
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Dimensions, Platform, AppState, ActionSheetIOS, Alert, Image } from 'react-native';
import { notificationGetInitiate, notificationRead, notificationDelete } from '../../Redux/actions/Notification';
import { connect } from 'react-redux';
import { AppColor, AppFontFamily, AppImages } from './../../Themes';
import { CachedImage } from '../../Components/react-native-cached-image-master'
import {
    Header,
    Loader,
    DataManager
} from "./../../Components";
import moment from 'moment'
import { getReactionType, imageBaseUrl, getUSerDetail } from '../../Config';
import I18n from 'react-native-i18n';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import ActionSheet from 'react-native-actionsheet'
import { timeLinePostDetailClear } from '../../Redux/actions/timeLineAction'
import { AFLogEvent } from '../../Config/aws';
const Notification = []
const { width, height } = Dimensions.get('screen')
class NotifyScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            refresh: false,
            index: 0,
            id: ''
        }
    }
    componentDidMount() {
        AFLogEvent("Notification", { screen: 'Notification' })

        AppState.addEventListener('change', (state) => {
            if (state == 'active') {
                setTimeout(async () => {

                    DataManager.getAccessToken().then(async token => {

                        let accessToken = JSON.parse(token)
                        console.log('accessTokenLogout', accessToken)
                        let data = await getUSerDetail()
                        console.log('data', data);
                        if (data) {
                            this.props.notificationGetInitiate('abc', this.props.navigation, 1)
                        }
                    })
                }, 1000);
            }
        })
        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.props.timeLinePostDetailClear()
            setTimeout(async () => {
                let data = await getUSerDetail()
                console.log('data', data);
                if (data) {
                    this.props.notificationGetInitiate('abc', this.props.navigation, 1, true)
                }

            }, 100);

        })

    }

    deleteNotification = (id, index) => {
        Platform.OS == 'android' ?
            this.props.notificationDelete(this.state.id, this.state.index, this.props.navigation)
            :
            this.props.notificationDelete(id, index, this.props.navigation)
    }

    androidActionSheetPress = (buttonIndex) => {
        if (buttonIndex == 1) {

            this.deleteNotification()
        }
        else if (buttonIndex == 2) {
        }
    }
    actionSheet = (index, item) => {
        Platform.OS == 'android' ?
            this.ActionSheet.show()
            :
            ActionSheetIOS.showActionSheetWithOptions({
                options: [I18n.t('Cancel'), I18n.t('Delete')],
                destructiveButtonIndex: 1,
                cancelButtonIndex: 0
            }, (buttonIndex) => {
                if (buttonIndex == 1) {
                    this.deleteNotification(item._id, index)
                }
            })

        this.setState({ id: item._id, index: index })

    }

    renderData = ({ item, index }) => {
        return (

            <TouchableOpacity onPress={() => {
                if (item.notification_type === 'friends') {
                    this.props.navigation.navigate('MyFreightingNetwork', { notify: 'friendList' })
                }
                if (item.notification_type === 'friendRequest') {

                    this.props.navigation.navigate('FriendRequests')
                }
                if (item.notification_type === 'follow_post') {
                    this.props.navigation.navigate('PostDetails', {
                        item: item.post,
                        likeDislikeype: 'Notification',
                        index: index

                    })
                }
                if (item.notification_type === 'like') {
                    this.props.navigation.navigate('PostDetails', {
                        item: item.post,
                        likeDislikeype: 'Notification',
                        index: index

                    })

                }
                if (item.notification_type == 'global_post_like') {
                    // this.props.navigation.navigate('Feed')
                    this.props.navigation.navigate('PostFullView', { index: null, item: { '_id': item.post_id }, userImages: [], imagesArray: [] })
                }
                if (item.notification_type == 'tagged_post_like') {
                    // this.props.navigation.navigate('comments', {
                    //     item: { '_id': item.post_id }
                    // })
                    this.props.navigation.navigate('PostFullView', { index: null, item: { '_id': item.post_id }, userImages: [], imagesArray: [] })

                }
                if (item.notification_type == 'comment_post') {
                    this.props.navigation.navigate('comments', {
                        item: { '_id': item.post_id },
                        comment_id: item.parent_id ? item.parent_id : item?.comment_id, subCommentId: item.parent_id ? item?.comment_id : item.parent_id
                    })
                }
                if (item.notification_type == 'shared_post') {
                    this.props.navigation.navigate('PostFullView', { index: null, item: { '_id': item.post_id }, userImages: [], imagesArray: [] })

                    // this.props.navigation.navigate('comments', {
                    //     item: { '_id': item.post_id },
                    //     comment_id:item.parent_id?item.parent_id:item?.comment_id,subCommentId:item.parent_id?item?.comment_id:item.parent_id
                    // })
                }
                if (item.notification_type == "comment_like") {
                    this.props.navigation.navigate('comments', {
                        item: { '_id': item.post_id },
                        comment_id: item.parent_id ? item.parent_id : item?.comment_id, subCommentId: item.parent_id ? item?.comment_id : item.parent_id
                    })
                }
                if (item.notification_type == "replyComment") {
                    this.props.navigation.navigate('comments', {
                        item: { '_id': item.post_id },
                        comment_id: item.parent_id ? item.parent_id : item?.comment_id, subCommentId: item.parent_id ? item?.comment_id : item.parent_id
                    })
                }
                if (item.notification_type == 'tagged_post_comment') {
                    this.props.navigation.navigate('comments', {
                        item: { '_id': item.post_id }
                    })
                }
                if (item.notification_type == 'tag_friends') {
                    // this.props.navigation.navigate('comments', {
                    //     item: { '_id': item.post_id }
                    // })
                    this.props.navigation.navigate('PostFullView', { index: null, item: { '_id': item.post_id }, userImages: [], imagesArray: [] })

                }
                if (item.notification_type === 'admin') {
                    this.props.navigation.navigate('NotificationDetailScreen', {
                        title: item?.message,
                        description: item?.messsageDescription,
                        createdAt: item?.created_at
                    })

                }

                setTimeout(() => {
                    this.props.notificationRead(item._id, index, this.props.navigation)
                }, 200);

            }}
                activeOpacity={0.7}
                style={{ flex: 1, backgroundColor: item.status == null ? 'rgba(0,153,218,0.3)' : 'white', justifyContent: 'center', paddingHorizontal: 5, paddingVertical: 4 }}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                    <View style={{ flex: 0.15, alignItems: 'center' }}>
                        <CachedImage source={
                            // item.notification_type === 'admin'?require('../../Images/Login_logo.png'):
                            item.notification_type == 'follow_post' ?
                                item?.post?.profile ? { uri: imageBaseUrl + item.post.profile } :
                                    AppImages.images.user01 : item.other_user_id.profile ?
                                    { uri: imageBaseUrl + item.other_user_id.profile } :
                                    AppImages.images.user01}
                            resizeMode={item.notification_type === 'admin' ? 'cover' : Platform.OS == 'ios' ? 'cover' : 'cover'} style={{ width: 40, height: 40, borderRadius: 40 / 2 }} />
                        {item.reaction_type && <Image
                            style={{ position: 'absolute', height: 35, width: 35, bottom: Platform.OS == 'android' ? -9 : -10, right: 0, }}
                            source={getReactionType(item.reaction_type)}
                        />}
                    </View>
                    <View style={{ flex: Platform.OS == 'ios' ? 0.63 : 0.6 }}>
                        <Text numberOfLines={4} style={{
                            flex: 1,
                            color: AppColor.colors.twoTwo,
                            fontFamily: AppFontFamily.fontFamily.regular,
                            marginLeft: 5,
                            fontSize: 16,
                        }}>
                            {item.message}
                        </Text>

                        <View style={{ flex: 0.22, marginLeft: 5 }}>
                            <Text style={
                                {
                                    color: AppColor.colors.twoTwo,
                                    fontFamily: AppFontFamily.fontFamily.regular,
                                    fontSize: 12,
                                }
                            }>
                                {moment(item.created_at).format('LLL')}
                            </Text>
                        </View>
                    </View>

                </View>
                <TouchableOpacity onPress={() => { this.setState({ index: index, id: item._id }), this.actionSheet(index, item) }} style={{ flex: 0.22, top: 10, position: 'absolute', right: 10, paddingRight: 10 }}>
                    <Icon name={'dots-horizontal'} size={25} />
                </TouchableOpacity>
            </TouchableOpacity>
        )
    }


    setPagination = async () => {
        let { notificationAlert, navigation } = this.props;
        let noti = this.props.notificationAlert.result.result ? this.props.notificationAlert.result.result.data.result.length : Notification.length
        console.log('notinotinoti', noti, notificationAlert.total);
        if (notificationAlert.total > noti) {
            let data = await getUSerDetail()
            console.log('data', data);
            if (data) {
                this.props.notificationGetInitiate('abc', this.props.navigation, noti, true)
            }
        }
    };
    render() {
        return (
            <View style={{ backgroundColor: 'white', flex: 1 }}>
                <Loader loading={this.props.notificationAlert.onLoad} />
                {
                    Platform.OS == 'android' ?
                        <Header
                            headerTitle={I18n.t('Notifications')}

                        />
                        :
                        <View style={{ flex: 0.13 }}>
                            <Header
                                headerTitle={I18n.t('Notifications')}

                            />
                        </View>}
                <View style={{ flex: Platform.OS == 'android' ? 1 : 0.87 }}>
                    <FlatList
                        onEndReachedThreshold={0.5}
                        onEndReached={() => {
                            if (!this.onEndReachedCalledDuringMomentum) {
                                this.setPagination();
                                this.onEndReachedCalledDuringMomentum = true;
                            }
                        }}
                        onMomentumScrollBegin={() => {
                            this.onEndReachedCalledDuringMomentum = false;
                        }}

                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View style={{
                                height: height / 1.4,
                                justifyContent: 'center',
                                alignItems: "center"
                            }}>
                                <Text style={{
                                    color: AppColor.colors.twoTwo,
                                    fontFamily: AppFontFamily.fontFamily.regular,
                                    fontSize: 16,

                                }}>{I18n.t('No_notifications')}</Text>
                            </View>
                        }
                        contentContainerStyle={{}}
                        data={this.props.notificationAlert.result.result ? this.props.notificationAlert.result.result.data.result : Notification}
                        refreshing={this.state.refresh}
                        onRefresh={() => {
                            this.setState({ refresh: true }, async () => {
                                let data = await getUSerDetail()
                                console.log('data', data);
                                if (data) {
                                    this.props.notificationGetInitiate('abc', this.props.navigation, 1)
                                }
                                setTimeout(() => { this.setState({ refresh: false }) }, 2000)
                            })
                        }}
                        renderItem={this.renderData}
                    />

                    <ActionSheet
                        ref={o => this.ActionSheet = o}
                        options={[I18n.t('Cancel'), I18n.t('Delete')]}
                        cancelButtonIndex={0}
                        destructiveButtonIndex={1}
                        onPress={(index) => { this.androidActionSheetPress(index) }}
                    />
                </View>
            </View>
        )
    }

}
function mapStateToProps(state) {
    return {
        notificationAlert: state.Notify
    }
}
export default connect(mapStateToProps, { timeLinePostDetailClear, notificationGetInitiate, notificationDelete, notificationRead })(NotifyScreen)