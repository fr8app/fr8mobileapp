import React, { Component } from 'react';
import {
    View,
    FlatList,
    Image,
    Text,
    TextInput,
    Platform
} from 'react-native';
import styles from './styles'
import { Header, WarnFriendRender, Loader } from './../../Components';
import { AppStyles, AppImages } from './../../Themes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { pendingFriendAction, friendRequestAction } from './../../Redux/actions/Friends';
import { imageBaseUrl } from './../../Config';
import I18n from 'react-native-i18n'
import { AFLogEvent } from '../../Config/aws';

class FriendRequests extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchText: null,
            refreshing: false
        }
        setTimeout(() => {
            this.props.pendingFriendAction(this.props.navigation)
        }, 500);
        AFLogEvent("FriendRequests", { screen: 'FriendRequests' })

    }

    _renderItem = ({ item, index }) => {
        return (
            <WarnFriendRender
                userImageSource={item.sender_id ? item.sender_id.profile ? { uri: imageBaseUrl + item.sender_id.profile } : AppImages.images.userIcon : AppImages.images.userIcon}
                tittleText={item.sender_id ? item.sender_id.userName ? item.sender_id.userName : "" : ""}
                acceptText={I18n.t('Accept')}
                acceptOnPress={this.acceptButtonClicked.bind(this, item, index)}
                rejectText={I18n.t('Reject')}
                rejectOnPress={this.rejectButtonClicked.bind(this, item, index)}
            />
        )
    };

    acceptButtonClicked = (item, index) => {
        let { navigation } = this.props;
        this.props.friendRequestAction(item.sender_id._id, "Accept", index, navigation)
    }

    rejectButtonClicked = (item, index) => {
        let { navigation } = this.props;
        this.props.friendRequestAction(item.sender_id._id, "Reject", index, navigation)
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
                    onChangeText={(searchText) => this.setState({ searchText })} />
            </View>
        )
    }

    onRefresh = () => {
        this.setState({ refreshing: true })
        this.props.pendingFriendAction(this.props.navigation)
        setTimeout(() => {
            this.setState({ refreshing: false })
        }, 500);
    }

    render() {
        let { pendingFriendRequestState, friendRequestState, navigation } = this.props;
        return (
            <View style={styles.mainContainer}>
                {
                    Platform.OS == 'android' ?
                        <Header
                            headerTitle={I18n.t('Friend_Requests')}
                            leftImageSource={AppImages.images.back} leftbackbtnPress={() => navigation.goBack()} />
                        :
                        <View style={{ flex: 0.13 }}>
                            <Header
                                headerTitle={I18n.t('Friend_Requests')}
                                leftImageSource={AppImages.images.back} leftbackbtnPress={() => navigation.goBack()} />
                        </View>}
                <Loader loading={pendingFriendRequestState.onLoad || friendRequestState.onLoad} />
                <View style={[AppStyles.container, { paddingHorizontal: 20 }]}>
                    <FlatList
                        refreshing={this.state.refreshing}
                        onRefresh={() => this.onRefresh()}
                        bounces={true}
                        contentContainerStyle={{ paddingTop: 30, paddingBottom: 15 }}
                        data={pendingFriendRequestState.result}
                        extraData={[this.state, this.props, pendingFriendRequestState.result]}
                        renderItem={this._renderItem}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={<View style={styles.listEmptyComponentView}><Text style={styles.noValueText}>{I18n.t('Friend_request_not_found')}</Text></View>}
                    />
                </View>
            </View>
        )
    }
}

function mapStateToProps(state) {
    return {
        pendingFriendRequestState: state.PendingFriendRequestState,
        friendRequestState: state.FriendRequestState
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ pendingFriendAction, friendRequestAction }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(FriendRequests);