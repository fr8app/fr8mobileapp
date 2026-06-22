import React, { Component } from "react";
import {
  View,
  SectionList,
  SafeAreaView,
  Image,
  Text,
  Platform,
  TouchableOpacity,
  TextInput,
  FlatList,
  PermissionsAndroid,
  Keyboard,
  Alert,
} from "react-native";
import styles from "./styles";
import { Header, Fr8ers, Loader, ContactsModal } from "./../../Components";
import { AppStyles, AppImages, AppColor } from "./../../Themes";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { friendsAction } from "./../../Redux/actions/Friends";
import {
  searchTerminalAction,
  searchUserAction,
  nearTerminalAction,
} from "./../../Redux/actions/MyFrightingNetwork";
import { followUnfollowTerminalAction } from "../../Redux/actions/TerminalDetail";
import {
  myFriendAction,
  updateUserDetail,
} from "./../../Redux/actions/Friends";
import Contacts from "react-native-contacts";
import { imageBaseUrl, getUSerDetail, getPopRef } from "./../../Config";
import SendSMS from "react-native-sms";
import geolocation from "@react-native-community/geolocation";
import I18n from "react-native-i18n";
import { request, PERMISSIONS, openSettings } from "react-native-permissions";
import { clearProfileData } from '../../Redux/actions/profileAction';
import { AFLogEvent } from "../../Config/aws";

var SendIntentAndroid = require("react-native-send-intent");
class MyFreightingNetwork extends Component {
  // static navigationOptions = ({ navigation }) => {
  //   return {
  //     header: (
  //       <Header
  //         headerTitle={I18n.t("My_Freighting_Network")}
  //         leftImageSource={AppImages.images.back}
  //         leftbackbtnPress={() => navigation.goBack()}
  //       />
  //     ),
  //   };
  // };
  constructor(props) {
    super(props);
    (this.state = {
      searchText: "",
      allContacts: [],
      disabled: false,
      listPlaces: [
        {
          title: I18n.t("Nearby_Terminals"),
          data: [
            { name: "Terminal Name", user: "306", buttonText: "Follow" },
            { name: "Terminal Name", user: "306", buttonText: "Follow" },
            { name: "Terminal Name", user: "306", buttonText: "" },
          ],
        },
        {
          title: I18n.t("Explore"),
          data: [
            "Los Angles, CA",
            "San franscisco Bay Area, CA",
            "New york city, NY",
          ],
        },
      ],
      listFr8ers: [
        {
          data: [
            {
              tittle: "Name of the user",
              image: AppImages.images.user01,
              addUser: AppImages.images.addFriend,
            },
            { tittle: "Name of the user", image: AppImages.images.user01 },
          ],
        },
        {
          title: I18n.t("Contacts"),
          data: [
            {
              tittle: "Name of the user",
              desc: "1234567890",
              image: AppImages.images.user01,
            },
            {
              tittle: "Name of the user",
              desc: "1234567890",
              image: AppImages.images.user01,
            },
          ],
        },
      ],
      region: "",
      selectedButton: 0,
      loading: false,
    });
  }

  fetchConacts() {
    if (Platform.OS == "android") {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS)
        .then((res) => {
          if (res === "never_ask_again") {
            Alert.alert(
              "FR8",
              I18n.t("Contact_Permission"),
              [
                {
                  text: I18n.t("Cancel"),
                  onPress: () => {
                    console.log("cancel");
                  },
                  style: "cancel",
                },
                { text: "OK", onPress: () => openSettings() },
              ],
              { cancelable: false }
            );
          }

          if (res == "granted") {
            Contacts.getAll((err, contacts) => {
              if (err === "denied") {
                alert(err);
              } else {
                console.log("Contacts permission denied", contacts);
                let contactsArrray = ContactsModal.getPhonesData(contacts);
                console.log('contactsArrray', contactsArrray);
                let contactArray = []
                if (contactsArrray.includes(undefined)) {
                  contactsArrray.map((x) => {
                    if (x !== undefined && x !== null) {
                      contactArray.push(x)
                    }
                  })
                  this.setState({ allContacts: contactArray })
                }
                else {

                  this.setState({ allContacts: contactsArrray });
                }

              }
            });
          } else {
            console.log("Contacts permission denied");
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      Contacts.getAll((err, contacts) => {
        if (err === "denied") {
          Alert.alert(
            "FR8",
            I18n.t("Contact_Permission"),
            [
              {
                text: I18n.t("Cancel"),
                onPress: () => {
                  console.log("cancel");
                },
                style: "cancel",
              },
              { text: "OK", onPress: () => openSettings() },
            ],
            { cancelable: false }
          );
        } else {
          let contactsArrray = ContactsModal.getPhonesData(contacts);
          this.setState({ allContacts: contactsArrray });
        }
      });
    }
  }
  isLogin = async () => {
    let data = await getUSerDetail()
    console.log('data', data);
    if (data) {
      this.setState({ isLoggedIn: true })
      return true
    }
    else {
      this.setState({ isLoggedIn: false })
      // console.log('kkkkkkk', getPopRef());
      // getPopRef().modalOpen()
      return false
    }
  }
  getLatLong() {
    let { navigation } = this.props;
    geolocation.getCurrentPosition(
      (position) => {
        let region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.00922 * 1.5,
          longitudeDelta: 0.00421 * 1.5,
        };
        this.setState({ region });
        this.fetchTerminals();
      },
      (error) => {
        this.props.nearTerminalAction("25.761", "80.191", navigation);
      }
    );
  }
  fetchTerminals() {
    let { navigation } = this.props;
    this.props.nearTerminalAction(
      this.state.region.latitude,
      this.state.region.longitude,
      navigation
    );
  }
  componentDidMount() {
    AFLogEvent("MyFreightingNetwork", { screen: 'MyFreightingNetwork' })

    this.getLatLong();
    this.fetchConacts();
    if (this.props.route.params) {
      if (this.props.route.params.notify === "friendList") {
        this.fr8ersButtonClicked();
      }
    }
  }
  componentDidUpdate(nextProps) { }

  _renderItem = ({ item, index, section }) => {
    return section.title == I18n.t("Nearby_Terminals") ? (
      <View>
        <View style={[styles.listMainContainer]}>
          <View style={{ flex: 0.7 }}>
            <Text style={styles.nameText} numberOfLines={1}>
              {item.terminal_name}
            </Text>
            <View style={{ flexDirection: "row", marginTop: 5 }}>
              <Image
                style={styles.userImage}
                resizeMode="contain"
                source={AppImages.images.user03}
              />
              <Text style={styles.userText}>{item.followers_count}</Text>
            </View>
          </View>

          {item.is_follow == 0 ? (
            <TouchableOpacity
              disabled={this.state.disabled}
              style={[
                styles.followButton,
                { flex: 0.2, alignSelf: "flex-start" },
              ]}
              onPress={this.followButtonClicked.bind(this, item, index)}
            >
              <Text style={styles.userText}> {I18n.t("Follow")}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              disabled={this.state.disabled}
              style={[
                styles.followButton,
                { flex: 0.2, alignSelf: "flex-start" },
              ]}
              onPress={this.followButtonClicked.bind(this, item, index)}
            >
              <Text
                style={[
                  styles.userText,
                  { paddingHorizontal: 2, textAlign: "center" },
                ]}
              >
                {I18n.t("Un_Follow")}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.lineView} />
      </View>
    ) : (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={this.clickedExploreCity.bind(this, item)}
      >
        <View style={styles.listMainContainer}>
          <Text style={styles.nameText}>{item.region_name}</Text>
          <Image
            style={styles.arrowImage}
            resizeMode="contain"
            source={AppImages.images.arrow}
          />
        </View>
        <View style={styles.lineView} />
      </TouchableOpacity>
    );
  };

  _renderItemSearch = ({ item, index }) => {
    return (
      <View>
        <View style={[styles.listMainContainer]}>
          <View style={{ flex: 0.8 }}>
            <Text style={styles.nameText} numberOfLines={1}>
              {item.terminal_name}
            </Text>
            <View style={{ flexDirection: "row", marginTop: 5 }}>
              <Image
                style={styles.userImage}
                resizeMode="contain"
                source={AppImages.images.user03}
              />
              <Text style={styles.userText}>{item.followers_count}</Text>
            </View>
          </View>

          <TouchableOpacity
            disabled={this.state.disabled}
            style={[
              styles.followButton,
              { flex: 0.2, alignSelf: "flex-start" },
            ]}
            onPress={this.followButtonClicked.bind(this, item, index)}
          >
            <Text style={styles.userText}>
              {" "}
              {item.is_follow == 0 ? "Follow" : "Unfollow"}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.lineView} />
      </View>
    );
  };

  clickedExploreCity = (item) => {
    this.props.navigation.navigate("ExploreCities", { item });
  };

  followButtonClicked = async (item, index) => {
    let isLoggedIn = await this.isLogin()
    if (isLoggedIn == true) {

      this.setState({ disabled: true });
      setTimeout(() => {
        this.setState({ disabled: false });
      }, 200);
      let { navigation } = this.props;
      if (item.is_follow == 0) {
        this.props.followUnfollowTerminalAction(item.id, 1, index, navigation);
      } else {
        this.props.followUnfollowTerminalAction(item.id, 0, index, navigation);
      }
    }
    else {
      getPopRef().modalOpen('Would you like to follow this terminal?\nSetting up your profile allows you to follow a terminal, and unlocks other FR8 app features that work for you')
    }
  };
  _renderHeader = ({ section }) => {
    return (
      <View style={styles.headerListContainer}>
        <Text style={[styles.nameText, { fontSize: 17 }]}>{section.title}</Text>
      </View>
    );
  };

  _renderHeaderFr8ers = ({ section, item }) => {
    return (
      <View>
        {section.title ? (
          <View style={[styles.headerListContainer, { paddingBottom: 10 }]}>
            <Text
              style={[
                styles.nameText,
                { fontSize: 18, color: AppColor.colors.fourSeven },
              ]}
            >
              {section.title}
            </Text>
          </View>
        ) : null}
      </View>
    );
  };

  _renderItemFr8ers = ({ item, index, section }) => {
    console.log('itemmmmmmmmmm', item);
    return (
      <Fr8ers
        userImageSource={
          item.profile && item.profile !== null
            ? { uri: imageBaseUrl + item.profile }
            : AppImages.images.user01
        }
        tittleText={item.userName}
        // descText={item.desc}
        addUserImage={
          item.isFriend == 0 && item.isFriendRequestSent == 0
            ? AppImages.images.addFriend
            : null
        }
        addUserClicked={this.addUserClicked}
        listPress={this.fr8erListClicked.bind(this, item, index, section)}
      />
    );
  };

  sendSms = (item) => {
    {
      if (Platform.OS == 'ios') {
        console.log(item, "SendSMS444", SendSMS);
        SendSMS.send(
          {
            body: I18n.t("installMessage"),
            recipients: [item],
            successTypes: ["sent", "queued"],
          },
          (completed, cancelled, error) => {
            if (completed) {
              console.log("SMS Sent Completed");
            } else if (cancelled) {
              console.log("SMS Sent Cancelled");
            } else if (error) {
              console.log("Some error occured");
            }
          }
        );
      }
      else {

        SendIntentAndroid.sendSms(item, I18n.t("installMessage"));

      }
    }
  };

  fr8erListClicked = (itemSelected, index, section) => {
    this.props?.clearProfileData()
    this.props.myPostsState.result = []

    let item = {
      email: itemSelected.email,
      id: itemSelected.id ? itemSelected.id : itemSelected._id,
      image: itemSelected.profile,
      isFriend: itemSelected.isFriend,
      isFriendRequestSent: itemSelected.isFriendRequestSent,
      name: itemSelected.userName ? itemSelected.userName : itemSelected.name,
      user_type: itemSelected.user_type,
    };

    this.props.navigation.navigate("NameOfTheUser", {
      key: item.isFriend == 0 ? "add" : "added",
      item,
    });
    this.props.updateUserDetail(item);
  };

  onChangeText(searchText) {
    let { navigation } = this.props;
    if (this.state.selectedButton == 0) {
      this.props.searchTerminalAction(searchText, navigation);
      this.setState({ searchText });
    } else if (this.state.selectedButton == 1) {
      this.props.searchUserAction(searchText, 0, navigation);
      this.setState({ searchText });
    }
  }

  validate(str) {
    if (str?.startsWith("+") == true) {
      return str;
    } else {
      if (str?.length > 10) {
        return "+" + str;
      } else {
        return "+1" + str;
      }
    }
  }
  // Method for search view
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
          placeholder={I18n.t("Search_friends")}
          keyboardType={"ascii-capable"}
          returnKeyType={"done"}
          multiline={false}
          onChangeText={(searchText) => this.setState({ searchText })}
          onSubmitEditing={() => this.onChangeText(this.state.searchText)}
          value={this.state.searchText}
        />
      </View>
    );
  };

  _renderItemMyFriends = ({ item, index, section }) => {
    console.log('fdhhdf', item);
    let newnumber = item?.phoneNumber ? item?.phoneNumber : '';
    let number = this.validate(newnumber);
    return (
      <Fr8ers
        userImageSource={
          item.profile
            ? { uri: imageBaseUrl + item.profile }
            : AppImages.images.user01
        }
        tittleText={item.name}
        sendInvite={item.isFriend == 0 ? I18n.t("Invite") : null}
        sendInviteClicked={() => this.sendSms(number)}
        listPress={
          section.title == "Friends"
            ? this.fr8erListClicked.bind(this, item, index, section)
            : null
        }
      />
    );
  };

  _renderHeaderMyFriends = ({ section, item }) => {
    if (section.data.length > 0) {
      return (
        <View>
          <View style={[styles.headerListContainer, { paddingBottom: 10 }]}>
            <Text
              style={[
                styles.nameText,
                { fontSize: 18, color: AppColor.colors.fourSeven },
              ]}
            >
              {I18n.t(section.title)}
            </Text>
          </View>
        </View>
      );
    } else {
      return <View />;
    }
  };

  // Method for Top buttons
  buttonView() {
    return (
      <View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={this.placesButtonClicked}
            style={
              this.state.selectedButton == 0
                ? styles.selectedButton
                : styles.unSelectedButton
            }
          >
            <Text
              style={
                this.state.selectedButton == 0
                  ? styles.selectedButtonText
                  : styles.unSelectedButtonText
              }
            >
              {I18n.t("Places")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={this.fr8ersButtonClicked}
            style={
              this.state.selectedButton == 1
                ? styles.selectedButton
                : styles.unSelectedButton
            }
          >
            <Text
              style={
                this.state.selectedButton == 1
                  ? styles.selectedButtonText
                  : styles.unSelectedButtonText
              }
            >
              {I18n.t("Friends")}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tabArrowContainer}>
          <View style={styles.tabArrowView}>
            {this.state.selectedButton == 0 && <Image
              style={styles.tabArrow}
              source={
                this.state.selectedButton == 0
                  ? AppImages.images.selectedTab
                  : null
              }
            />}
          </View>

          <View style={styles.tabArrowView}>
            {this.state.selectedButton == 1 && <Image
              style={styles.tabArrow}
              source={
                this.state.selectedButton == 1
                  ? AppImages.images.selectedTab
                  : null
              }
            />}
          </View>
        </View>
      </View>
    );
  }

  placesButtonClicked = () => {
    if (this.state.selectedButton == 0) {
      this.setState({ selectedButton: 0 });
    } else if (this.state.selectedButton == 1) {
      this.setState({ selectedButton: 0, searchText: "" });
    }
  };

  fr8ersButtonClicked = async () => {
    let isLoggedIn = await this.isLogin()
    if (isLoggedIn == true) {
      this.props.myFriendsState.result.length == 0 ||
        this.props.myFriendsState.result.length > 0
        ? this.props.myFriendAction(this.state.allContacts, this.props.navigation)
        : null;
      if (this.state.selectedButton == 1) {
        this.setState({ selectedButton: 1 });
      } else if (this.state.selectedButton == 0) {
        this.setState({ selectedButton: 1, searchText: "" });
      }
    }
    else {
      getPopRef().modalOpen()
    }
  };

  setPagination = () => {
    let { searchUserState, navigation } = this.props;
    if (searchUserState.nextPageUrl !== null) {
      this.props.searchUserAction(
        this.state.searchText,
        Number(searchUserState.currentPage) + Number(1),
        navigation
      );
    }
  };

  render() {
    let {
      searchTermialState,
      searchUserState,
      myFriendsState,
      nearTerminalsState,
      followUnfollowTerminalState,
    } = this.props;

    let contactData =
      myFriendsState.result.length > 0 ? myFriendsState.result : [];

    return (
      <>

        <View style={styles.mainContainer}>
          {Platform.OS == 'android' ?
            <Header
              headerTitle={I18n.t("My_Freighting_Network")}
              leftImageSource={AppImages.images.back}
              leftbackbtnPress={() => this.props.navigation.goBack()}
            />
            :

            <View style={{ flex: 0.13 }}>
              <Header
                headerTitle={I18n.t("My_Freighting_Network")}
                leftImageSource={AppImages.images.back}
                leftbackbtnPress={() => this.props.navigation.goBack()}
              />
            </View>}
          <Loader
            loading={
              nearTerminalsState.onLoad ||
              followUnfollowTerminalState.onLoad ||
              myFriendsState.onLoad ||
              searchUserState.onLoad
            }
          />

          <View style={[AppStyles.container, { paddingHorizontal: 20 }]}>
            {this.searchView()}

            {this.buttonView()}

            {this.state.selectedButton == 0 ? (
              (this.state.searchText !== "" &&
                searchTermialState.result.length > 0) ||
                this.state.searchText.trim().length > 0 ? (
                <FlatList
                  onScroll={() => {
                    Keyboard.dismiss();
                  }}
                  renderItem={this._renderItemSearch}
                  data={searchTermialState.result}
                  showsVerticalScrollIndicator={false}
                  extraData={[this.props, searchTermialState.result]}
                  ListEmptyComponent={
                    <View style={styles.listEmptyComponentView}>
                      <Text style={styles.noValueText}>{I18n.t("noResult")}</Text>
                    </View>
                  }
                />
              ) : (
                <SectionList
                  onScroll={() => {
                    Keyboard.dismiss();
                  }}
                  contentContainerStyle={{ paddingBottom: 20 }}
                  renderItem={this._renderItem}
                  extraData={[this.props, this.state, nearTerminalsState.result]}
                  renderSectionHeader={this._renderHeader}
                  sections={nearTerminalsState.result}
                  stickySectionHeadersEnabled={false}
                  showsVerticalScrollIndicator={false}
                  extraData={[this.props, nearTerminalsState.result]}
                  ListEmptyComponent={
                    <View style={styles.listEmptyComponentView}>
                      <Text style={styles.noValueText}>{I18n.t("noResult")}</Text>
                    </View>
                  }
                />
              )
            ) : this.state.searchText == "" ? (
              console.log('serach text empty'),
              <SectionList
                onScroll={() => {
                  Keyboard.dismiss();
                }}
                bounces={false}
                extraData={[this.props, this.state, myFriendsState.result]}
                renderItem={this._renderItemMyFriends}
                renderSectionHeader={this._renderHeaderMyFriends}
                sections={contactData}
                stickySectionHeadersEnabled={false}
                showsVerticalScrollIndicator={false}
                onEndReachedThreshold={0.8}
                disableVirtualization={true}
                ListEmptyComponent={
                  <View style={styles.listEmptyComponentView}>
                    <Text style={styles.noValueText}>No friend found.</Text>
                  </View>
                }
                onEndReached={() => {
                  if (!this.onEndReachedCalledDuringMomentum) {
                    this.onEndReachedCalledDuringMomentum = true;
                  }
                }}
                onMomentumScrollBegin={() => {
                  this.onEndReachedCalledDuringMomentum = false;
                }}
              />
            ) : (

              <>
                {searchUserState?.result[0]?.data?.length == 0 &&
                  <View style={styles.listEmptyComponentView}>
                    <Text style={styles.noValueText}>No friend found.</Text>
                  </View>}

                <SectionList
                  bounces={false}
                  extraData={[this.props, this.state, searchUserState.result]}
                  renderItem={this._renderItemFr8ers}
                  renderSectionHeader={this._renderHeaderFr8ers}
                  sections={searchUserState.result}
                  stickySectionHeadersEnabled={false}
                  showsVerticalScrollIndicator={false}
                  onEndReachedThreshold={0.8}
                  disableVirtualization={true}
                  ListEmptyComponent={
                    <View style={styles.listEmptyComponentView}>
                      <Text style={styles.noValueText}>No friend found.</Text>
                    </View>
                  }
                  onEndReached={() => {
                    if (!this.onEndReachedCalledDuringMomentum) {
                      this.onEndReachedCalledDuringMomentum = true;
                    }
                  }}
                  onMomentumScrollBegin={() => {
                    this.onEndReachedCalledDuringMomentum = false;
                  }}
                />
              </>
            )}
          </View>
        </View>
      </>
    );
  }
}
function mapStateToProps(state) {
  return {
    friendsState: state.FriendsState,
    searchTermialState: state.SearchTermialState,
    searchUserState: state.SearchUserState,
    nearTerminalsState: state.NearTerminalsState,
    followUnfollowTerminalState: state.FollowUnfollowTerminalState,
    myFriendsState: state.MyFriendsState,
    myPostsState: state.MyPostsState,

  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      clearProfileData,
      myFriendAction,
      friendsAction,
      searchTerminalAction,
      updateUserDetail,
      searchUserAction,
      nearTerminalAction,
      followUnfollowTerminalAction,
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyFreightingNetwork);
