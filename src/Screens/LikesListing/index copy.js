import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Image, FlatList, Platform } from 'react-native';
import { Header, UserRender, EmptyComponentList } from "../../Components";
import { AppStyles, AppImages, } from "../../Themes";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { likedUserList } from "../../Redux/actions/timeLineAction";
import I18n from "react-native-i18n";
import { imageBaseUrl } from "../../Config";
import images from '../MyTimeLine/amination/Themes/Images';
import Loader from "../../Components/Loader";
import { AFLogEvent } from '../../Config/aws';

const { width, height } = Dimensions.get('screen')

class LikeListing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      refreshing: false,
    };
    this.category = this.props.route.params?.type
    this.selectedIndex = 0;
    this.item = this.props.route.params.item;
  }

  componentDidMount() {
    AFLogEvent("LikeListing", { screen: 'LikeListing' })
    this.props.likedUserList(this.item, this.props.navigation, null, this.category);
  }


  getIconBtn(index) {
    switch (index) {
      case 1:
        return images.like_static_fill;
      case 2:
        return images.love_static;
      case 3:
        return images.wow_static;
      case 4:
        return images.sad_static;
      case 5:
        return images.angry_static;
      case 6:
        return images.thinking;
      default:
        return images.like_static_fill;
    }

  }
  getType(index) {
    switch (index) {
      case 0:
        return null;
      case 1:
        return "like";
      case 2:
        return 'dislike';
      case 3:
        return "grinningSmile";
      case 4:
        return "angry";
      case 5:
        return "confuse";
      case 6:
        return "thinking";
      default:
        return null;
    }
  }

  topBarIcon = (index) => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          if (index !== this.state.selectedIndex) {
            this.props.timeline.likedUserList = []
            this.setState({ selectedIndex: index })
            this.props.likedUserList(this.item, this.props.navigation, this.getType(index), this.category);
          }
        }}
        style={{
          width: width * 0.9 / 7, justifyContent: 'center', paddingVertical: 5,
          flexDirection: "row", borderBottomWidth: this.state.selectedIndex == index ? 2 : 0, borderColor: '#29a2e1'
        }}
      >
        {index !== 0 ? <Image
          resizeMode='contain'
          style={{ height: 40, width: 40, alignSelf: 'center' }}
          source={this.getIconBtn(index)}
        />
          :
          <View style={{ height: 40, width: 40, alignSelf: 'center', justifyContent: 'center', }}>
            <Text style={{ alignSelf: 'center', fontSize: 20, color: '#29a2e1' }}>
              {I18n.t('All')}
            </Text>
          </View>
        }
        <Text style={{ alignSelf: 'center' }}>
          { }
        </Text>
      </TouchableOpacity>
    )
  }

  _renderItem = ({ item, index }) => {
    return (
      <UserRender
        activeOpacity={1}
        chat={true}
        userImageSource={
          this.category == 'comment' ?
            item?.user_id?.profile
              ? { uri: imageBaseUrl + item?.user_id?.profile }
              : AppImages.images.user01
            :
            item?.post_user_id?.profile
              ? { uri: imageBaseUrl + item?.post_user_id?.profile }
              : AppImages.images.user01
        }
        tittleText={
          this.category == 'comment' ?
            item?.user_id?.userName
            :
            item?.post_user_id?.userName}
        timeText={""}
        dateText={""}
      />
    );
  };

  render() {
    let { timeline } = this.props;
    return (
      <View style={{ flex: 1 }}>
        {
          Platform.OS == 'android' ?
            <Header
              rightImageSource1Width={25}
              rightImageSource1Height={25}
              headerTitle={this.props.route.params?.type == 'comment' ? I18n.t('commentLikeHeading') : I18n.t('postlikeHeading')}
              leftImageSource={AppImages.images.back}
              leftbackbtnPress={() => this.props.navigation.goBack()}
              customStyles={{
                leftBtnView: { marginRight: 7 },
              }}
            />
            :
            <View style={{ flex: 0.13 }}>
              <Header
                rightImageSource1Width={25}
                rightImageSource1Height={25}
                headerTitle={this.props.route.params?.type == 'comment' ? I18n.t('commentLikeHeading') : I18n.t('postlikeHeading')}
                leftImageSource={AppImages.images.back}
                leftbackbtnPress={() => this.props.navigation.goBack()}
                customStyles={{
                  leftBtnView: { marginRight: 7 },
                }}
              />
            </View>}
        <Loader loading={this.props.timeline.onLoad} />
        <View style={{
          flexDirection: 'row',
          width: width,
          alignItems: 'center',
          borderWidth: 1,
          borderColor: 'silver',
          marginTop: 10,
          paddingHorizontal: 20,
        }}>
          {this.topBarIcon(0, timeline?.reactionCount?.like)}
          {timeline?.reactionCount?.like ? this.topBarIcon(1, timeline?.reactionCount?.like) : null}
          {timeline?.reactionCount?.dislike ? this.topBarIcon(2, timeline?.reactionCount?.dislike) : null}
          {timeline?.reactionCount?.grinningSmile ? this.topBarIcon(3, timeline?.reactionCount?.grinningSmile) : null}
          {timeline?.reactionCount?.angry ? this.topBarIcon(4, timeline?.reactionCount?.angry) : null}
          {timeline?.reactionCount?.confuse ? this.topBarIcon(5, timeline?.reactionCount?.confuse) : null}
          {timeline?.reactionCount?.thinking ? this.topBarIcon(6, timeline?.reactionCount?.thinking) : null}
        </View>
        <View style={[AppStyles.container, { paddingHorizontal: 20 }]}>
          {
            <FlatList
              ListEmptyComponent={() => {
                return (
                  <View style={{ height: height * 0.7, alignItems: 'center', justifyContent: 'center', }}>
                    <EmptyComponentList height="100%" title={I18n.t("noUser")} />
                  </View>)
              }}
              keyExtractor={(item, index) => index.toString()}
              bounces={true}
              refreshing={this.state.refreshing}
              onRefresh={() => {
                this.props.likedUserList(this.item, this.props.navigation, this.getType(this.state.selectedIndex), this.category);
                this.setState({ refreshing: true }, () => {
                  setTimeout(() => {
                    this.setState({ refreshing: false });
                  }, 2000);
                });
              }}
              contentContainerStyle={{ paddingVertical: 10 }}
              data={timeline.likedUserList}
              extraData={this.props}
              renderItem={this._renderItem}
              showsVerticalScrollIndicator={false}
            />
          }
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    timeline: state.timeLine
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ likedUserList }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LikeListing);
