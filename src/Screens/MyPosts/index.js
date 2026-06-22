import React, { Component } from 'react';
import {
    View,
    FlatList,
    SafeAreaView,
    Text,
} from 'react-native';
import styles from './styles'
import { Header, DataManager, UserPosts, Loader } from './../../Components';
import { AppStyles, AppImages, DateFormat } from './../../Themes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { myPostAction } from "./../../Redux/actions/MyPosts";
import { likeDislikeAction, videoPlayAction } from '../../Redux/actions/TerminalDetail';
import Share from 'react-native-share';
import { deletePostInitiate, onReachEndPost } from '../../Redux/actions/MyPosts'
import I18n from 'react-native-i18n'
import { showImageUrl } from '../../Config';
class MyPosts extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            header: <Header
                headerTitle={I18n.t('My_Posts')}
                leftImageSource={AppImages.images.back} leftbackbtnPress={() => navigation.goBack()} />
        }
    };
    constructor(props) {
        super(props);
        this.state = {
            refreshControl: false,
            searchText: null,
        }
    }
    componentDidMount() {
        this.getUserDetail()
    }
    getUserDetail() {
        DataManager.getUserDetails().then((response) => {
            this.props.myPostAction(JSON.parse(response).data._id, this.props.navigation)

        })
    }
    _renderItem = ({ item, index }) => {
        return (
            <UserPosts
                Description={item.description}
                type={item.type}
                video={item.video}
                imageSource={item.thumbnail_image ? { uri: item.thumbnail_image } : AppImages.images.videoImage}
                likeSource={item.is_like !== 1 ? AppImages.images.notLike : AppImages.images.like}
                disLikeSource={item.dislike_count !== 0 ? AppImages.images.disLike : AppImages.images.notDisLike}
                shareSource={AppImages.images.share}
                playSource={AppImages.images.play}
                viewSource={AppImages.images.views}
                viewText={item.view_count ? item.view_count : "0"}
                disLikeText={item.dislike_count}
                likeText={item.like_count}
                timeText={DateFormat.toTime(item.created_at)}
                dateText={DateFormat.toDate(item.created_at)}
                viewsVisible
                videoOnPress={this.videoClicked.bind(this, item, index)}
                likeButton={this.likeButton.bind(this, item, index)}
                disLikeButton={this.disLikeButton.bind(this, item, index)}
                shareButton={this.shareButton.bind(this, item, index)}
                delete={() => { this.props.deletePostInitiate({ item, navigation: this.props.navigation }) }}
            />
        )
    };

    likeButton = (item, index) => {
        let { navigation } = this.props
        if (item.is_like == 0) {
            this.props.likeDislikeAction(item.id, 1, index, "myPost", navigation)
        }
        else if (item.is_like == 2) {
            this.props.likeDislikeAction(item.id, 1, index, "myPost", navigation)
        }
        else {
            this.props.likeDislikeAction(item.id, 2, index, "myPost", navigation)
        }
    }

    disLikeButton = (item, index) => {
        let { navigation } = this.props
        if (item.is_like == 2) {
            this.props.likeDislikeAction(item.id, 0, index, "myPost", navigation)
        }
        else if (item.is_like == 1) {
            this.props.likeDislikeAction(item.id, 0, index, "myPost", navigation)
        }
        else {
            this.props.likeDislikeAction(item.id, 2, index, "myPost", navigation)
        }
    }

    shareButton = (item, index) => {
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
        this.props.videoPlayAction(item, index, "myPost", this.props.navigation)
    }

    refreshData() {
        this.setState({ refreshControl: true }, () => {
            DataManager.getUserDetails().then((response) => {
                this.props.myPostAction(JSON.parse(response).data._id, this.props.navigation)
            })
            setTimeout(() => {
                this.setState({ refreshControl: false })
            }, 1000);
        })


    }

    onReachEndfunc() {
        if (this.props.myPostsState.collection.next_page_url) {
            DataManager.getUserDetails().then((response) => {
                this.props.onReachEndPost({ url: this.props.myPostsState.collection.next_page_url, user_id: JSON.parse(response).data.id })
            })

        }
    }
    render() {
        let { myPostsState, likeDislikeState, videoPlayState } = this.props;
        return (
            <SafeAreaView style={styles.mainContainer}>
                <Loader loading={myPostsState.onLoad || videoPlayState.onLoad} />
                <View style={[AppStyles.container, { paddingHorizontal: 20 }]}>
                    <FlatList
                        refreshing={this.state.refreshControl}
                        onRefresh={() => { this.refreshData() }}
                        bounces={true}
                        contentContainerStyle={{ paddingTop: 20 }}
                        data={myPostsState.result}
                        extraData={[this.state, this.props]}
                        renderItem={this._renderItem}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={<View style={styles.listEmptyComponentView}><Text style={styles.noValueText}>{I18n.t('postNotFound')}</Text></View>}
                        onEndReached={this.onReachEndfunc.bind(this)}
                    />
                </View>
            </SafeAreaView>
        )
    }

}

function mapStateToProps(state) {
    return {
        myPostsState: state.MyPostsState,
        likeDislikeState: state.LikeDislikeState,
        videoPlayState: state.VideoPlayState,

    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ myPostAction, likeDislikeAction, videoPlayAction, deletePostInitiate, onReachEndPost }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(MyPosts);