import React, { Component } from "react";
import { View, FlatList, SafeAreaView, Image, TextInput,Dimensions, Platform } from "react-native";
import styles from "./styles";
import { Header, UserRender, EmptyComponentList } from "../../Components";
import { AppStyles, AppImages, DateFormat } from "../../Themes";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { sharedUserList } from "../../Redux/actions/timeLineAction";
import I18n from "react-native-i18n";
import { imageBaseUrl } from "../../Config";

const {height,width}=Dimensions.get('screen')
let _this;
class ShareUsers extends Component {
  // static navigationOptions = ({ navigation }) => {
  //   return {
  //     header: (
  //       <Header
  //       headerTitleStyle={true}
  //         rightImageSource1Width={25}
  //         rightImageSource1Height={25}
  //         headerTitle={I18n.t('shareListHeading')}
  //         leftImageSource={AppImages.images.back}
  //         leftbackbtnPress={() => navigation.goBack()}
          
  //         customStyles={{
  //           leftBtnView: { marginRight: 7 },
  //         }}
          
  //       />
  //     ),
  //   };
  // };
  constructor(props) {
    super(props);
    this.state = {
      message: null,
      refreshing: false,
      searchText: "",
    };
    _this = this;
    this.item = this.props.route.params.item;
    this.props.timeline.sharedUserList=[]
  }
  componentDidMount() {
    this.focusListener = this.props.navigation.addListener("focus", () => {
      this.props.sharedUserList(this.item,this.props.navigation);
    });
  }
  navBack = () => {

    this.props.navigation.goBack();
  };
  _renderItem = ({ item, index }) => {
    return (
      <UserRender
      activeOpacity={1}
        chat={true}
        userImageSource={
          item.share_creator.profile
            ? { uri: imageBaseUrl + item.share_creator.profile }
            : AppImages.images.user01
        }
        tittleText={item.share_creator.userName}
    
        timeText={""}
        dateText={""}
     
      />
    );
  };

  onNavigationBack = () => {
    this.props.sharedUserList(this.item,this.props.navigation);
  };

 

  render() {
    let { timeline } = this.props;

    return (
      <>
      {Platform.OS=='android'?
      <Header
      headerTitleStyle={true}
        rightImageSource1Width={25}
        rightImageSource1Height={25}
        headerTitle={I18n.t('shareListHeading')}
        leftImageSource={AppImages.images.back}
        leftbackbtnPress={() => this.props.navigation.goBack()}
        
        customStyles={{
          leftBtnView: { marginRight: 7 },
        }}
        
      />:
      <View style={{flex:0.13}}>
      <Header
        headerTitleStyle={true}
          rightImageSource1Width={25}
          rightImageSource1Height={25}
          headerTitle={I18n.t('shareListHeading')}
          leftImageSource={AppImages.images.back}
          leftbackbtnPress={() => this.props.navigation.goBack()}
          
          customStyles={{
            leftBtnView: { marginRight: 7 },
          }}
          
        />
      </View>}
      <SafeAreaView style={styles.mainContainer}>
        <View style={[AppStyles.container, { paddingHorizontal: 20 }]}>

          {
            <FlatList
            ListEmptyComponent={()=>{
              return(
                <View style={{height:height*0.75,alignItems: 'center',justifyContent: 'center',}}>
            <EmptyComponentList height="80%" title={I18n.t("noUser")} />
            </View>)}}
              keyExtractor={(item, index) => index.toString()}
              bounces={true}
              refreshing={this.state.refreshing}
              onRefresh={() => {
                this.props.sharedUserList(this.item,this.props.navigation);
                this.setState({ refreshing: true }, () => {
                  setTimeout(() => {
                    this.setState({ refreshing: false });
                  }, 2000);
                });
              }}
              contentContainerStyle={{ paddingVertical: 10 }}
              data={timeline.sharedUserList}
              extraData={this.props}
              renderItem={this._renderItem}
              showsVerticalScrollIndicator={false}
            />
          }
        </View>
      </SafeAreaView>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    timeline:state.timeLine
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ sharedUserList }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ShareUsers);
