import React, { Component } from "react";
import {
  View,
  SafeAreaView,
  Image,
  Text,
  TextInput,
  SectionList,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Keyboard,
  Platform
} from "react-native";
import styles from "./styles";
import { Header, UserRender, Loader, Button } from "../../Components";
import { AppStyles, AppImages } from "../../Themes";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { myFriendAction } from "../../Redux/actions/Friends";
import { tagFriendList } from "../../Redux/actions/MyFrightingNetwork";
import I18n from "react-native-i18n";
import {
  searchUserAction,
} from "../../Redux/actions/MyFrightingNetwork";
import Entypo from 'react-native-vector-icons/Entypo'
import { imageBaseUrl } from "../../Config";
let _this
class TagFriends extends Component {
  // static navigationOptions = ({ navigation }) => {
  //   return {
  //     header: (
  //       <Header
  //         headerTitle={route.params?I18n.t("tagUsers"): I18n.t("Friends")}
  //         leftImageSource={AppImages.images.back}
  //         leftbackbtnPress={() => _this.onNavigationBack()}
  //       />
  //     ),
  //   };
  // };
  constructor(props) {
    super(props);
    this.state = {
      KeyboardShow:false,
      refresh: false,
      message: null,
      searchText: '',
      alreadySelectedFriends: []
    };
    _this = this
    // this.props.myFriendAction([], this.props.navigation);
  }

  componentDidMount() {
    if(Platform.OS=='android'){
    Keyboard.addListener('keyboardDidShow',()=>{
      this.setState({KeyboardShow:true})
    })
    Keyboard.addListener('keyboardDidHide',()=>{
      this.setState({KeyboardShow:false})
    })
  }

    this.setState({ alreadySelectedFriends: this.props.searchUserState.tags })
  }
  _renderItem = ({ item, index }) => {
    return this.props.route.params ?
      <UserRender
        activeOpacity={1}
        userImageSource={item.profile !== '' && item.profile !== null ? { uri: imageBaseUrl + item.profile } : AppImages.images.user01}
        tittleText={item.userName}

      />
      :
      item.isFriend == 1 ? (
        <UserRender
          crossPress={() => this.props.tagFriendList(item._id)}
          isTag={item.isSelected && item.isSelected == true ? true : null}
          userImageSource={item.profile !== '' && item.profile !== null ? { uri: imageBaseUrl + item.profile } : AppImages.images.user01}
          tittleText={item.userName}
          onPress={() => {
            this.props.tagFriendList(item._id)
          }}
        />
      ) : null;
  };
  onNavigationBack = () => {

    this.props.searchUserState.tags = [...this.state.alreadySelectedFriends]
    this.props.searchUserAction('', 0, this.props.navigation);
    this.props.navigation.goBack()
  };

  searchText = (text) => {
    this.setState({ searchText: text })
    this.props.searchUserAction(text, 0, this.props.navigation);
  }

  tagRender = ({ item, index }) => {
    return (

      <View style={styles.tagRenderContainer}>
        <Text
          numberOfLines={2}
          style={[
            styles.userPostsText,
            {
              textAlign: "center",
              flex: 1,
              marginLeft: 0,
              paddingHorizontal: 10,
              fontWeight: "bold",
              lineHeight: 18,
              width: '100%',
              color: '#fff'
            },
          ]}
        >
          {item.userName}
        </Text>
        <TouchableOpacity
          onPress={() => this.props.tagFriendList(item._id)}
          activeOpacity={0.7} style={styles.crossButton}>
          <Entypo
            color={'#fff'} name="cross" size={20} />
        </TouchableOpacity>
      </View>
    )
  }


  searchView = () => {
    return (
      <View style={[styles.mainSearchView, { marginTop: this.props.searchUserState.tags.length == 0 ? 0 : 0 }]}>

        {this.props.searchUserState.tags.length == 0 && <Image
          resizeMode="contain"
          style={styles.searchImage}
          source={AppImages.images.search}
        />}
        <View style={styles.searchText}>
          {this.props.searchUserState.tags.length > 0 &&
            <FlatList
              horizontal={false}
              keyExtractor={(item, index) => index.toString()}
              columnWrapperStyle={{ flexWrap: 'wrap', flex: 1, marginTop: 5 }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingTop: 10 }}
              style={{ maxHeight: Dimensions.get('screen').height * 0.15,marginBottom:12}}
              data={this.props.searchUserState.tags}
              extraData={this.props}
              renderItem={this.tagRender}
              numColumns={3}
            />
          }
          {<TextInput
            style={[styles.searchText,{marginLeft:15}]}
            autoCorrect={false}
            value={this.state.searchText}
            placeholder={this.props.searchUserState.tags.length > 0 ? I18n.t("friendSearch") : I18n.t("friendSearch")}
            keyboardType={"ascii-capable"}
            returnKeyType={"done"}
            multiline={false}
            onChangeText={(searchText) => this.searchText(searchText)}
          />}
        </View>
      </View>
    );
  };
  refresh = () => {
    this.setState({ refreshing: true, searchText: '' })
    this.props.searchUserAction('', 0, this.props.navigation);

    setTimeout(() => {
      this.setState({ refreshing: true })
    }, 500);

  }

  render() {
    let { myFriendsState, searchUserState } = this.props;
    return (
      <>
     {Platform.OS=='android'?
     <Header
          headerTitle={this.props.route.params?I18n.t("tagUsers"): I18n.t("Friends")}
          leftImageSource={AppImages.images.back}
          leftbackbtnPress={() => this.onNavigationBack()}
        />
     :
      <View style={{flex:0.13}}>
          <Header
          headerTitle={this.props.route.params?I18n.t("tagUsers"): I18n.t("Friends")}
          leftImageSource={AppImages.images.back}
          leftbackbtnPress={() => this.onNavigationBack()}
        />
          </View>}
 {     this.props.route.params ?
        <View style={{ flex: 1 }}>
          
          <FlatList
          showsVerticalScrollIndicator={false}
            data={this.props.route.params.item}
            renderItem={this._renderItem}
            extraData={this.props}
            contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 20 }}
            bounces={false}
          />
        </View>
        :
        <View style={styles.mainContainer}>
          <Loader whiteColor loading={myFriendsState.onLoad} />
          <View style={[AppStyles.container, { paddingHorizontal: 20 }]}>
            {this.searchView()}
            {
              this.props.searchUserState.resultUTag[0].data.length == 0 ?
                <View style={[styles.listEmptyComponentView, {
                  height:Dimensions.get('screen').height *0.6
                }]}>
                  <Text style={styles.noValueText}>{I18n.t("noUser")}</Text>
                </View>
                :
                <SectionList
                  refreshing={this.state.refresh}
                  onRefresh={() => this.refresh()}
                  bounces={true}
                  contentContainerStyle={{ paddingTop: 30 }}
                  sections={this.props.searchUserState.result}
                  extraData={this.props}
                  renderItem={this._renderItem}
                  showsVerticalScrollIndicator={false}
                />

            }

          </View>
          {this.state.KeyboardShow==false&&<View style={styles.buttonView}>
            <Button
              Text={I18n.t('done')}
              onPress={() => {
                this.props.searchUserAction('', 0, this.props.navigation);
                this.props.navigation.goBack()
              }}
              customStyles={{ container: styles.button }}
            />
          </View>}
        </View>
 }</>
    );
  }
}
function mapStateToProps(state) {
  return {
    myFriendsState: state.MyFriendsState,
    searchUserState: state.SearchUserState,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ myFriendAction, searchUserAction, tagFriendList }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TagFriends);

