import React, { Component } from 'react';
import {
    View,
    FlatList,
    SafeAreaView,
    Image,
    Platform,
    PermissionsAndroid,
    Text,
    TextInput,
    Alert
} from 'react-native';
import styles from './styles'
import { Header, WarnFriendRender, ContactsModal, Loader } from './../../Components';
import { AppStyles, AppConstants, AppImages } from './../../Themes';
import Contacts from 'react-native-contacts';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { warnContactsAction } from "./../../Redux/actions/WarnContacts";
import { openSettings } from 'react-native-permissions';
import I18n from 'react-native-i18n';
class WarnContacts extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            header: <Header
                headerTitle={I18n.t('Warn_Contacts')}
                leftImageSource={AppImages.images.back} leftbackbtnPress={() => navigation.goBack()} />
        }
    };
    constructor(props) {
        super(props);
        this.state = {
            searchText: "",
            contacts: [],
            allContacts: [],

            loading: false
        }
        this.fetchConacts()
    }


    fetchConacts() {
        if (Platform.OS == "android") {
            setTimeout(() => {
                PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_CONTACTS
                ).then((res) => {
                    if (res === "never_ask_again") {
                        Alert.alert(
                            'FR8',
                            I18n.t('Contact_Permission')
                            [
                            {
                                text: I18n.t("Cancel"),
                                onPress: () => { console.log('cancel') },
                                style: "cancel"
                            },
                            { text: "OK", onPress: () => openSettings() }
                            ],
                            { cancelable: false }
                        )

                    }

                    if (res == 'granted') {
                        Contacts.getAll((err, contacts) => {
                            if (err === 'denied') {
                            } else {
                                let contactsArrray = ContactsModal.getContactsData(contacts)
                                this.setState({ allContacts: contactsArrray, contacts: contactsArrray })
                            }
                        })
                    }
                    else {
                    }
                }).catch((e) => {
                })
            }, 200);
        }
        else {
            Contacts.getAll((err, contacts) => {
                if (err === 'denied') {
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
                    let contactsArrray = ContactsModal.getContactsData(contacts)
                    this.setState({ allContacts: contactsArrray, contacts: contactsArrray })

                }
            })
        }

    }


    renderItem = ({ item, index }) => {
        return (
            item.phoneNumbers.length == 1 ?
                <WarnFriendRender
                    userImageSource={AppImages.images.userIcon}
                    tittleText={item.givenName}
                    descText={item.phoneNumbers.length == 1 ? item.phoneNumbers[0].number : ""}
                    acceptText={item.phoneNumbers[0].isSelectedPhoneNumber == true ? I18n.t("warned") : I18n.t('Warn')}
                    acceptOnPress={item.phoneNumbers[0].isSelectedPhoneNumber == true ? null : this.WarnButtonClicked.bind(this, item, index, 0)}
                    selected={item.phoneNumbers[0].isSelectedPhoneNumber == true ? false : true}
                />
                :
                item.phoneNumbers.length == 2 ?
                    <View>
                        <WarnFriendRender
                            userImageSource={AppImages.images.userIcon}
                            tittleText={item.givenName}
                            descText={item.phoneNumbers[0].number !== undefined || item.phoneNumbers.length < 1 ? item.phoneNumbers[0].number : ""}
                            acceptText={item.phoneNumbers[0].isSelectedPhoneNumber == true ? I18n.t("warned") : I18n.t("Warn")}
                            acceptOnPress={item.phoneNumbers[0].isSelectedPhoneNumber == true ? null : this.WarnButtonClicked.bind(this, item, index, 0)}
                            selected={item.phoneNumbers[0].isSelectedPhoneNumber == true ? false : true}
                        />
                        <WarnFriendRender
                            userImageSource={AppImages.images.userIcon}
                            tittleText={item.givenName}
                            descText={item.phoneNumbers[1].number !== undefined ? item.phoneNumbers[1].number : ""}
                            acceptText={item.phoneNumbers[1].isSelectedPhoneNumber == true ? I18n.t("warned") : I18n.t("Warn")}
                            acceptOnPress={item.phoneNumbers[1].isSelectedPhoneNumber == true ? null : this.WarnButtonClicked.bind(this, item, index, 1)}
                            selected={item.phoneNumbers[1].isSelectedPhoneNumber == true ? false : true}
                        />
                    </View>
                    : null
        )
    };

    WarnButtonClicked = (item, index, phoneNumberIndex) => {
        let terminalId = this.props.route.params.id
        let contacts = this.state.contacts
        if (item.phoneNumbers.length == 1) {
            if (item.phoneNumbers[0].isSelectedPhoneNumber == true) {
            }
            else {
                contacts[index].phoneNumbers[0].isSelectedPhoneNumber = true
            }

            if (contacts[index]?.phoneNumbers[0]?.number) {
                var str = contacts[index]?.phoneNumbers[0]?.number;
                const newStr = str.replace(/[- )(,;*#><./N]/g, '');
                if (newStr?.startsWith('+')) {
                    const finalNumber = newStr.replace(/[- )(,;*#+><./N]/g, '');
                    this.props.warnContactsAction(finalNumber, terminalId, this.props.navigation)
                } else {
                    const finalNumber = newStr.replace(/[- )(,;*#+><./N]/g, '');
                    this.props.warnContactsAction(finalNumber, terminalId, this.props.navigation)
                }
            }
        }
        else if (item.phoneNumbers.length == 2) {
            if (phoneNumberIndex == 0) {
                if (item.phoneNumbers[0].isSelectedPhoneNumber == true) {
                }
                else {
                    contacts[index].phoneNumbers[0].isSelectedPhoneNumber = true
                }
                if (contacts[index]?.phoneNumbers[0]?.number) {
                    var str = contacts[index]?.phoneNumbers[0]?.number;
                    const newStr = str.replace(/[- )(,;*#><./N]/g, '');
                    if (newStr?.startsWith('+')) {
                        const finalNumber = newStr.replace(/[- )(,;*#+><./N]/g, '');
                        this.props.warnContactsAction(finalNumber, terminalId, this.props.navigation)
                    } else {
                        const finalNumber = newStr.replace(/[- )(,;*#+><./N]/g, '');
                        this.props.warnContactsAction(finalNumber, terminalId, this.props.navigation)
                    }
                }
            }
            else {
                if (item.phoneNumbers[1].isSelectedPhoneNumber == true) {
                }
                else {
                    contacts[index].phoneNumbers[1].isSelectedPhoneNumber = true
                }
                if (contacts[index]?.phoneNumbers[1]?.number) {
                    var str = contacts[index]?.phoneNumbers[1]?.number;
                    const newStr = str.replace(/[- )(,;*#><./N]/g, '');
                    if (newStr?.startsWith('+')) {
                        const finalNumber = newStr.replace(/[- )(,;*#+><./N]/g, '');
                        this.props.warnContactsAction(finalNumber, terminalId, this.props.navigation)
                    } else {
                        const finalNumber = newStr.replace(/[- )(,;*#+><./N]/g, '');
                        this.props.warnContactsAction(finalNumber, terminalId, this.props.navigation)
                    }
                }
            }
        }
        this.setState({ loading: true })
        setTimeout(() => {
            this.setState({ contacts, loading: false })
        }, 1200)
    }

    searchView = () => {
        return (
            <View style={styles.mainSearchView}>
                <Image resizeMode="contain" style={styles.searchImage} source={AppImages.images.search} />
                <TextInput
                    style={styles.searchText}
                    placeholder={I18n.t('Search_contacts')}
                    keyboardType={"ascii-capable"}
                    returnKeyType={"done"}
                    multiline={false}
                    onChangeText={(searchText) => this.searchContact(searchText)}
                />
            </View>
        )
    }

    searchContact(searchText) {
        var contacts = this.state.allContacts.filter((item) => {
            let result = item.givenName.toLowerCase().match(searchText.toLowerCase())
            return result
        });
        this.setState({ contacts })
    }
    render() {
        let { warnContactsState } = this.props;
        return (
            <SafeAreaView style={styles.mainContainer}>
                <Loader loading={warnContactsState.onLoad} />
                <View style={[AppStyles.container, { paddingHorizontal: 20 }]}>
                    {this.searchView()}
                    <FlatList
                        bounces={false}
                        contentContainerStyle={{ paddingTop: 30, paddingBottom: 10 }}
                        data={this.state.contacts}
                        extraData={this.state}
                        renderItem={this.renderItem}
                        showsVerticalScrollIndicator={false}
                        disableVirtualization={true}
                    />
                </View>
            </SafeAreaView>
        )
    }

}
function mapStateToProps(state) {
    return {
        warnContactsState: state.WarnContactsState,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ warnContactsAction }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(WarnContacts);