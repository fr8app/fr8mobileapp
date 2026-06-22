import React, { Component } from "react";
import { View, FlatList, SafeAreaView, Image,Text, TextInput, TouchableOpacity, Keyboard, Platform } from "react-native";
import styles from "./styles";
import { Header, UserRender, EmptyComponentList } from "../../Components";
import { AppStyles, AppImages, DateFormat } from "../../Themes";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import I18n from "react-native-i18n";
import {
  searchTerminalInitiate,clearSearch
} from "../../Redux/actions/Home";
import { imageBaseUrl } from "../../Config";
import NetInfo from '@react-native-community/netinfo'
import {CachedImage}from '../../Components/react-native-cached-image-master'
let _this;
class SearchTerminal extends Component {
  // static navigationOptions = ({ navigation }) => {
  //   return {
  //     header: (
  //       <Header
  //         rightImageSource1Width={25}
  //         rightImageSource1Height={25}
  //         headerTitle={I18n.t("Search_Terminal")}
  //         leftImageSource={AppImages.images.back}
  //         leftbackbtnPress={() =>_this.goBack()}
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
  }
  componentDidMount() {
    // this.focusListener = this.props.navigation.addListener("focus", () => {
    // });
    this.setState({ searchText: this.props.route.params.search });

  }
  goBack=()=>{
    Keyboard.dismiss()
    this.props.clearSearch()

    this.props.navigation.goBack()
    this.props.route.params.onSearchBack(null)
  }
 
  _renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
      onPress={()=>
        {
       NetInfo.fetch().then(state=>{
         if(state.isConnected){
          this.props.navigation.goBack()
          this.props.route.params.onSearchBack(item)
         }
         else{
           alert(I18n.t('please_check_your_internet_connection'))
         }
       })
          Keyboard.dismiss()

        }
      
      }
      style={{borderBottomWidth:1,borderBottomColor:'#e8e8e8',flexDirection:'row',alignItems:'center',padding:10}}>
        
        <View style={{height:40,width:40,borderRadius:20,alignItems:'center',justifyContent:'center',backgroundColor:'#e8e8e8'}}>

        <CachedImage resizeMode='contain' source={
          
          item.map_logo == "" ||
                                    item.map_logo == null
                                    ? item.terminal_category ==
                                      "Port Terminal"
                                      ? AppImages.images.port1
                                      : item.terminal_category ==
                                        "Empty Depot"
                                        ? AppImages.images.Empty1
                                        : item.terminal_category ==
                                          "Warehouse"
                                          ? AppImages.images.warehouse1
                                          : item.terminal_category ==
                                            "Rail Terminal"
                                            ? AppImages.images.rail1
                                            : AppImages.images.chassis:
          {uri:imageBaseUrl+item.map_logo}} style={{height:25,width:25,backgroundColor:'#e8e8e8'}}/>
        </View>
        <View
          style={[
            {flex:1}
          ]}
        >
          <Text numberOfLines={1} style={[styles.tittleText]}>
            {item.terminal_name}
          </Text>
              <View >
                <Text numberOfLines={2} style={[styles.descText]}>
                  {item.terminal_location}
                </Text>
             
            </View>
          
        </View>
      </TouchableOpacity>
    );
  };

  onNavigationBack = () => {
  };

  searchView = () => {
    return (
      <View style={styles.mainSearchView}>
        <Image
          resizeMode="contain"
          style={styles.searchImage}
          source={AppImages.images.search}
        />
        <TextInput
        autoFocus={true}
          style={styles.searchText}
          placeholder={I18n.t("Search_Terminal")}
          keyboardType={"ascii-capable"}
          returnKeyType={"done"}
          multiline={false}
          value={this.state.searchText}
          onChangeText={(searchText) => this.searchUser(searchText)}
        />
      </View>
    );
  };

  searchUser = (text) => {
    this.props.searchTerminalInitiate(
                text,
                this.props.navigation
              );
    this.setState({ searchText: text });
  };

  render() {
    let { chatHistoryState } = this.props;

    return (
      <View style={styles.mainContainer}>
       {Platform.OS=='android'?
       <Header
       rightImageSource1Width={25}
       rightImageSource1Height={25}
       headerTitle={I18n.t("Search_Terminal")}
       leftImageSource={AppImages.images.back}
       leftbackbtnPress={() =>this.goBack()}
       customStyles={{
         leftBtnView: { marginRight: 7 },
       }}
     />
       :
        <View style={{flex:0.13}}>
          <Header
          rightImageSource1Width={25}
          rightImageSource1Height={25}
          headerTitle={I18n.t("Search_Terminal")}
          leftImageSource={AppImages.images.back}
          leftbackbtnPress={() =>this.goBack()}
          customStyles={{
            leftBtnView: { marginRight: 7 },
          }}
        />
        </View>}
        <View style={[AppStyles.container, { paddingHorizontal: 20 }]}>
          {this.searchView()}
          {this.props.homeState.result.length > 0 ? (
            <FlatList
            onScroll={()=>Keyboard.dismiss()}
              keyExtractor={(item, index) => index.toString()}
              bounces={true}
              // refreshing={this.state.refreshing}
              // onRefresh={() => {
              //   this.setState({ refreshing: true }, () => {
              //     setTimeout(() => {
              //       this.setState({ refreshing: false });
              //     }, 2000);
              //   });
              // }}
              contentContainerStyle={{ paddingVertical: 10,paddingBottom:50 }}
              data={this.props.homeState.result}
              extraData={[this.state, this.props, chatHistoryState.result]}
              renderItem={this._renderItem}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <EmptyComponentList height="80%" title={I18n.t("terminalNotFound")} />
          )}
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    chatHistoryState: state.ChatHistoryState,
    chatUserHistoryState: state.ChatUserHistoryState,
    homeState: state.HomeState,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({  searchTerminalInitiate,clearSearch }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchTerminal);
