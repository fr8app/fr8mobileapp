import React, { Component } from "react";
import { View, FlatList, SafeAreaView, Image, Text, TextInput, ImageBackground, TouchableOpacity, Keyboard, SectionList, Alert, Dimensions, StatusBar, Platform } from "react-native";
import styles from "./styles";
import { Header, UserRender, EmptyComponentList, Button, Loader, DataManager } from "../../Components";
import { AppStyles, AppImages, DateFormat } from "../../Themes";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import I18n from "react-native-i18n";
import {
  regionListAction, regionSelect, setFavRegion, firsrtTimeSetRegions, homeDetailAction
} from "../../Redux/actions/Home";
import NetInfo from '@react-native-community/netinfo'
import { AFLogEvent } from "../../Config/aws";
import { getUSerDetail } from "../../Config";
let _this;
class Regions extends Component {

  constructor(props) {

    super(props);
    this.state = {
      regionList: [],
      message: null,
      refreshing: false,
      searchText: "",
      showButton: true,
      update: false,
    };
    _this = this;
  }
  componentDidMount() {

    this.props.navigation.addListener('blur', () => {
      this.props.homeState.regionList = []
    })
    AFLogEvent("Region", { screen: 'Region' })

    NetInfo.addEventListener((res) => {
      if (res.isConnected == true) {
      }
    })
    let list = DataManager.getFavList()
    list.then((res) => {
      let listParse = JSON.parse(res)
      this.setState({ regionList: listParse })
      this.props.regionListAction(listParse, this.props.navigation, this.props.route?.params?.id)
    })
  }
  goBack = () => {
    this.props.navigation.goBack()
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      if (prevProps.homeState !== this.props.homeState) {
        if (this.props.homeState.detailCalled == true) {
          this.props.homeState.detailCalled = false
          this.props.regionListAction(this.state.regionList, this.props.navigation, this.props.route?.params?.id)
        }
      }
      if (this.props.homeState.regionList !== prevProps.homeState.regionList) {
        this.setState({ update: !this.state.update })
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
      item?.is_selected ?
        <ImageBackground borderRadius={10} resizeMode="cover" source={require('../../Images/Button.png')} style={{ margin: 10 }}>
          <TouchableOpacity
            onPress={() => {
              NetInfo.fetch().then((res) => {
                if (res.isConnected == true) {
                  this.props.regionSelect(item._id)
                } else {
                  this.internetPouup()
                }
              })
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 15,
              borderColor: '#29a2e1'

            }}>
            <View
              style={[
                { flex: 1 }
              ]}
            >
              <Text numberOfLines={1} style={[styles.tittleText, { alignSelf: 'center', color: !item?.is_selected ? '#29a2e1' : 'white', textAlign: 'center' }]}>
                {item.region_name}
              </Text>
              <View >
              </View>

            </View>
          </TouchableOpacity>


        </ImageBackground>
        :
        <TouchableOpacity
          onPress={() => {
            NetInfo.fetch().then((res) => {
              if (res.isConnected == true) {
                this.props.regionSelect(item._id)
              } else {
                this.internetPouup()
              }
            })
          }}
          style={{
            margin: 10,
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 13,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: '#29a2e1'

          }}>
          <View
            style={[
              { flex: 1 }
            ]}
          >
            <Text numberOfLines={1} style={[styles.tittleText, { alignSelf: 'center', color: !item?.is_selected ? '#29a2e1' : 'white', textAlign: 'center' }]}>
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
    this.props.regionListAction(this.state.regionList, this.props.navigation, this.props.route?.params?.id)
    this.setState({ searchText: text });
  };

  navigationOption = () => {
    return (
      Platform.OS == 'android' ?
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
        :
        <View style={{ flex: 0.13 }}>

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
        </View>
    )
  }

  
  render() {
    let { chatHistoryState } = this.props;

    return (
      <View style={styles.mainContainer}>
        {Platform.OS == 'android' && <StatusBar
          translucent={false}
        />}
        {this.navigationOption()}

        <Loader loading={this.props.homeState.onLoad} />

        <View style={[AppStyles.container, { paddingHorizontal: 10, marginBottom: 40 }]}>
          <FlatList
            data={this.props.homeState.regionList}
            onScroll={() => Keyboard.dismiss()}
            keyExtractor={(item, index) => index.toString()}
            bounces={true}
            refreshing={this.state.refreshing}
            onRefresh={() => {

              this.setState({ refreshing: true }, () => {
                this.props.regionListAction(this.state.regionList, this.props.navigation, this.props.route?.params?.id)

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
              <View style={{ height: Dimensions.get('screen').height * 0.7, alignItems: 'center', justifyContent: 'center' }}>
                <EmptyComponentList height="80%" title={I18n.t("regionlNotFound")} />
              </View>
            }
          />
          {console.log(":::::::::this.props.route?.params?.id,",this.props.route?.params?.id,)}
          {this.props.homeState.regionList.length > 0 &&
            <View style={{ alignSelf: 'center', width: '50%', justifyContent: 'center' }}>
              <Button
                onPress={async () => {
                  this.props.setFavRegion(this.props.homeState.regionSelectedList,
                    this.props.navigation,
                    this.props.route?.params?.FromOnBoarding,
                    this.props.route?.params?.id,
                  )
                }}
                Text={I18n.t('Update')}
                customStyles={{ container: [styles.button, { borderRadius: 10 }] }}
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
  return bindActionCreators({ regionListAction, regionSelect, setFavRegion, firsrtTimeSetRegions, homeDetailAction }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Regions);
