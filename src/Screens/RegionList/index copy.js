import React, { Component } from "react";
import { View, FlatList, SafeAreaView, Image, Text, TextInput,ImageBackground, TouchableOpacity, Keyboard, SectionList, Alert, Dimensions } from "react-native";
import styles from "./styles";
import { Header, UserRender, EmptyComponentList, Button,Loader } from "../../Components";
import { AppStyles, AppImages, DateFormat } from "../../Themes";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import I18n from "react-native-i18n";
import {
  regionListAction,regionSelect,setFavRegion,firsrtTimeSetRegions,homeDetailAction
} from "../../Redux/actions/Home";
import NetInfo from '@react-native-community/netinfo'
let _this;
class Regions extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <Header
          rightImageSource1Width={25}
          rightImageSource1Height={25}
          headerTitle={I18n.t("Region")}
          leftImageSource={AppImages.images.back}
          leftbackbtnPress={() => _this.goBack()}
          customStyles={{
            leftBtnView: { marginRight: 7 },
          }}
        />
      ),
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      message: null,
      refreshing: false,
      searchText: "",
      showButton:true
    };
    _this = this;
  }
  componentDidMount() {
   
    // NetInfo.isConnected.addEventListener('connectionChange',(res)=>{
    //   if(res==true){
    //     // this.props.homeDetailAction(  this.props.navigation )

    //   }
    // })
    NetInfo.addEventListener(state=>
       {
          if(res==true){
        // this.props.homeDetailAction(  this.props.navigation )

      }
    }
    );
   this.props.regionListAction('',this.props.navigation)
   this.focusListener = this.props.navigation.addListener("blur", () => {
    this.props.homeState.regionSelectedList=[]
    // this.props.homeDetailAction(  this.props.navigation )
  });
  }
  goBack = () => {
    Keyboard.dismiss()

    this.props.navigation.goBack()
  }

  componentDidUpdate(prevProps){
    if(prevProps!==this.props){
      if(prevProps.homeState!==this.props.homeState){
        if(this.props.homeState.detailCalled==true){
          this.props.homeState.detailCalled=false
          this.props.regionListAction('',this.props.navigation)
        }
      }
    }
  }
  internetPouup = () => {
    Alert.alert(
        I18n.t('Alert'),
        I18n.t('please_check_your_internet_connection'),
        [
            {
                text: I18n.t('Ok'),
                onPress: () => {
                }
            },
        ],
        { cancelable: false },
    )
}
  _renderItem = ({ item, index, section }) => {

    return (
      item?.is_selected?
<ImageBackground borderRadius={10} resizeMode="cover" source={require('../../Images/Button.png')} style={{margin:10}}>
        <TouchableOpacity
onPress={()=>{
  NetInfo.fetch().then((res)=>{
    if(res.isConnected==true){
      this.props.regionSelect(item._id)
    }else{
      this.internetPouup()
    }
  })
  // this.props.searchTermialState.result[1].data[index].selected=!this.props.searchTermialState.result[1].data[index].selected
}}
          style={{
            // margin:10,
            // shadowOffset: {
            //   height: 0.5, width: 0.5
            // },
            // elevation:5,
            // shadowOpacity: 0.5,
            // backgroundColor:item?.is_selected?'#29a2e1': 'white',
            // shadowColor: 'gray',
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 15,
            // paddingHorizontal: 10,
            // borderRadius:10,
            // borderWidth:2,
            borderColor:'#29a2e1'

          }}>


          <View
            style={[
              { flex: 1 }
            ]}
          >
            <Text numberOfLines={1} style={[styles.tittleText,{alignSelf:'center',color:!item?.is_selected?'#29a2e1': 'white',textAlign:'center'}]}>
              {item.region_name}
            </Text>
            <View >
            </View>

          </View>
        </TouchableOpacity>
      
      
        </ImageBackground>
        :
        <TouchableOpacity
        onPress={()=>{
          NetInfo.fetch().then((res)=>{
            if(res.isConnected==true){
              this.props.regionSelect(item._id)
            }else{
              this.internetPouup()
            }
          })
          // this.props.searchTermialState.result[1].data[index].selected=!this.props.searchTermialState.result[1].data[index].selected
        }}
                  style={{
                    margin:10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 13,
                    // paddingHorizontal: 10,
                    borderRadius:10,
                    borderWidth:2,
                    borderColor:'#29a2e1'
        
                  }}>
        
        
                  <View
                    style={[
                      { flex: 1 }
                    ]}
                  >
                    <Text numberOfLines={1} style={[styles.tittleText,{alignSelf:'center',color:!item?.is_selected?'#29a2e1': 'white',textAlign:'center'}]}>
                      {item.region_name}
                    </Text>
                    <View >
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
          style={styles.searchText}
          placeholder={"Search Region"}
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
    this.props.regionListAction(text,this.props.navigation)
    this.setState({ searchText: text });
  };

  render() {
    let { chatHistoryState } = this.props;

    return (
      <View style={styles.mainContainer}>
                <Loader loading={this.props.homeState.onLoad} />

        <View style={[AppStyles.container, { paddingHorizontal: 10, marginBottom: 40 }]}>
          {/* {this.searchView()} */}
          {/* {this.props.homeState.regionList.length > 0 ? ( */}
            <FlatList
              data={this.props.homeState.regionList}
              onScroll={() => Keyboard.dismiss()}
              keyExtractor={(item, index) => index.toString()}
              bounces={true}
              refreshing={this.state.refreshing}
              onRefresh={() => {
                
                this.setState({ refreshing: true }, () => {
                  this.props.regionListAction(this.state.searchText,this.props.navigation)

                  setTimeout(() => {
                    this.setState({ refreshing: false });
                  }, 2000);
                });
              }}
              contentContainerStyle={{ paddingVertical: 10, paddingBottom: 50 }}
              renderItem={this._renderItem}
              showsVerticalScrollIndicator={false}
              extraData={this.props}
              ListEmptyComponent={
                <View style={{height:Dimensions.get('screen').height*0.7,alignItems:'center',justifyContent:'center'}}>
                   <EmptyComponentList height="80%" title={I18n.t("regionlNotFound")} />
                  </View>
              }
            />
          {/* ) 
          // : (
          //   <EmptyComponentList height="80%" title={I18n.t("regionlNotFound")} />
          // )} */}
          {this.props.homeState.regionList.length>0 &&
          <View style={{alignSelf:'center',width:'50%',justifyContent:'center'}}>
            <Button
            onPress={() => {
              this.props.setFavRegion(this.props.homeState.regionSelectedList,this.props.navigation)
            }}
            Text={I18n.t('Update')}
            customStyles={{ container: [styles.button,{borderRadius:10}] }}
          />
          </View>
          }
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
    searchTermialState: state.NearTerminalsState,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ regionListAction,regionSelect,setFavRegion,firsrtTimeSetRegions,homeDetailAction }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Regions);
