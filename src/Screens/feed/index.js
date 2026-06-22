import React, { Component } from 'react';
import { View, Text, FlatList, Dimensions } from 'react-native';
import style from './style'
import {
  Header,
  Loader,
  UserPosts,
  DataManager
} from "./../../Components";
import ReportPost from '../../Components/ReportPost'
import { AppImages, DateFormat, AppColor, AppFontFamily } from './../../Themes';
import { feedInitateAction } from '../../Redux/actions/BottomBarAction';
import { connect } from 'react-redux';
import geolocation from '@react-native-community/geolocation';
import {
  terminalDetailsAction,
  terminalDetailsActionend,
  videoUploadAction,
  likeDislikeAction,
  followUnfollowTerminalAction,
  videoPlayAction,
  clearTerminalDetail,
  terminalPostReportAction,
  deleteTerminalVideo
} from '../../Redux/actions/TerminalDetail';
import Share from 'react-native-share';
import I18n from 'react-native-i18n'
import { imageBaseUrl, showImageUrl } from '../../Config';
const { width, height } = Dimensions.get('screen')
var _this
class Feedss extends Component {
  static navigationOptions = ({ navigation }) => {

    return {
      header: (
        <Header
          headerTitle={I18n.t('Trending_Post')}
        />
      )
    };
  };
  constructor(props) {
    super(props)
    this.state = {

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
    }
    _this = this.props
  }
  componentDidMount() {
    DataManager.getUserDetails().then((response) => {
      this.setState({ userId: JSON.parse(response).data.id })

    })
    geolocation.getCurrentPosition(
      position => {
        let region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        };
        this.props.terminalDetailsAction(position.coords.latitude, position.coords.longitude, this.props.navigation, 'feed')
      },
      error => {
        let region = {
          latitude: 40.741231,
          longitude: -74.101984,
          latitudeDelta: 0.012,
          longitudeDelta: 0.012
        };
        this.props.terminalDetailsAction(region.latitude, region.longitude, this.props.navigation, 'feed')
      }
    );
    geolocation.watchPosition((position) => {
    });
  }
  fetchData() {
    geolocation.watchPosition((position) => {

    });
    geolocation.getCurrentPosition(
      position => {

        let region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        };
        this.props.terminalDetailsAction(position.coords.latitude, position.coords.longitude, this.props.navigation, 'feed',)
      },
      error => {
        let region = {
          latitude: 40.741231,
          longitude: -74.101984,
          latitudeDelta: 0.012,
          longitudeDelta: 0.012
        };
      }
    );
  }
  videoClicked = (item, index) => {
    this.props.videoPlayAction(item, index, "terminal", this.props.navigation)
  }
  likeButton = (item, index) => {
    let { navigation } = this.props
    if (item.like_status == 0) {
      this.props.likeDislikeAction(item.id, 1, index, "terminal", navigation)
    } else if (item.like_status == 2) {
      this.props.likeDislikeAction(item.id, 1, index, "terminal", navigation)
    } else {
      this.props.likeDislikeAction(item.id, 2, index, "terminal", navigation)
    }
  }

  disLikeButton = (item, index) => {
    let { navigation } = this.props
    if (item.like_status == 2) {
      this.props.likeDislikeAction(item.id, 0, index, "terminal", navigation)
    } else if (item.like_status == 1) {
      this.props.likeDislikeAction(item.id, 0, index, "terminal", navigation)
    } else {
      this.props.likeDislikeAction(item.id, 2, index, "terminal", navigation)
    }
  }

  shareButton = (item, index) => {
    console.log('terminal_name',item);
    const shareOptions = {
      title: 'FR8',
      subject: "FR8",
      message: 'My terminal post:- ',
      url: showImageUrl + item.video,
      social: Share.Social.WHATSAPP
    };
    Share.open(shareOptions);
  }
  _renderItem = ({ item, index }) => {
    const userId = this.state.userId
    return (
      <View style={
        { paddingHorizontal: 20 }} >
        <UserPosts Description={item.description}
          stateId={userId}
          itemId={item.user_id}
          terminalReport={
            () => {
              this.setState({ sideMenu: true, postId: item._id })
            }
          }
          type={item.type}
          video={item.video}
          terminalName={item.terminal_name}
          imageSource={item.thumbnail_image ? { uri: item.thumbnail_image } : AppImages.images.videoDummy}
          likeSource={item.like_status !== 1 ? AppImages.images.notLike : AppImages.images.like}
          disLikeSource={item.like_status !== 0 ? AppImages.images.notDisLike : AppImages.images.disLike}
          shareSource={AppImages.images.share}
          playSource={AppImages.images.play}
          viewSource={AppImages.images.views}
          disLikeText={item.dislike_count}
          likeText={item.like_count}
          timeText={DateFormat.toTime(item.created_at)}
          dateText={DateFormat.toDate(item.created_at)}
          fullName={item.created_by}
          userSource={item.profile ? { uri: item.profile } : AppImages.images.user01}
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
  refreshData = () => {
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
    return (
      <View style={style.mainWrapper}>
        <Loader
          loading=
          {
            this.props.terminalDetailState.onLoad || this.props.videoUploadState.onLoad || this.props.likeDislikeState.onLoad ||
            this.props.followUnfollowTerminalState.onLoad || this.props.videoPlayState.onLoad || this.state.loading
          }
        />

        {
          this.props.terminalDetailState.result !== null ?
            <FlatList
              refreshing={this.state.refreshControl}
              onRefresh={
                () => { this.refreshData() }}

              contentContainerStyle={
                { paddingTop: 10, paddingBottom: 80 }}
              data={this.props.terminalDetailState.post}
              ListEmptyComponent={
                <View style={{
                  height: height / 1.2,
                  justifyContent: 'center',
                  alignItems: "center"
                }}>
                  <Text style={{
                    color: AppColor.colors.twoTwo,
                    fontFamily: AppFontFamily.fontFamily.regular,
                    fontSize: 16,
                  }}>{I18n.t('trendingPostNotFound')}</Text>
                </View>
              }
              renderItem={this._renderItem}
              showsVerticalScrollIndicator={false}
              onEndReachedThreshold={0}
              onEndReached={
                () => {
                  let { navigation, terminalDetailState } = this.props;

                  if (terminalDetailState.nextPageUrl !== null) {

                    this.props.terminalDetailsActionend(this.props.homeState.selectedItem != null ? this.props.homeState.selectedItem.id : '', terminalDetailState.nextPageUrl, navigation, 'feed')
                  }
                }
              }

            />

            :
            null
        }
        <ReportPost

          loading={this.state.sideMenu}
          anyTap={
            () => this.setState({ sideMenu: false, textReportUser: null })}
          caneclButton={
            () => this.setState({ sideMenu: false, textReportUser: null })}
          submitButton={this.submitButtonReportUser}
          onChangeText={textReportUser => this.setState({ textReportUser })}

        />

      </View>
    )
  }
}

function mapStateToProps(state) {
  return {
    terminalDetailState: state.TerminalDetailState,
    videoUploadState: state.VideoUploadState,
    likeDislikeState: state.LikeDislikeState,
    homeState: state.HomeState,
    followUnfollowTerminalState: state.FollowUnfollowTerminalState,
    videoPlayState: state.VideoPlayState
  }
}
export default connect(mapStateToProps, {
  feedInitateAction,
  terminalDetailsAction,
  terminalDetailsActionend,
  clearTerminalDetail,
  videoPlayAction,
  videoUploadAction,
  likeDislikeAction,
  followUnfollowTerminalAction,
  terminalPostReportAction,
  deleteTerminalVideo
})(Feedss)