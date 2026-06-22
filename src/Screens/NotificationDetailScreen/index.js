import React, { Component } from 'react';
import {
    View,
    FlatList,
    SafeAreaView,
    Image,
    Text,
    TextInput,
    ScrollView,
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
import { ImageBackground } from 'react-native';
import moment from 'moment';
import { AFLogEvent } from '../../Config/aws';

class NotificationDetailScreen extends Component {
    // static navigationOptions = ({ navigation }) => {
    //     return {
    //         header: <Header
    //             headerTitle={I18n.t('Notifications')}
    //             leftImageSource={AppImages.images.back} leftbackbtnPress={() => navigation.goBack()} />
    //     }
    // };
    constructor(props) {
        super(props);
        this.state = {
            searchText: null,

        }
        setTimeout(() => {
            this.props.pendingFriendAction(this.props.navigation)
        }, 500);
        this.title = this.props.route.params.title,
            this.date = this.props.route.params.createdAt,
            this.description = this.props.route.params.description

    }

    componentDidMount() {
        AFLogEvent("NotificationDetail", { screen: 'Notification Detail' })

    }


    render() {

        return (
            <>
                {
                    Platform.OS == 'android' ?
                        <Header
                            headerTitle={I18n.t('Notifications')}
                            leftImageSource={AppImages.images.back} leftbackbtnPress={() => this.props.navigation.goBack()} />
                        :
                        <View style={{ flex: 0.13 }}>
                            <Header
                                headerTitle={I18n.t('Notifications')}
                                leftImageSource={AppImages.images.back} leftbackbtnPress={() => this.props.navigation.goBack()} />
                        </View>}
                <View style={styles.mainContainer}>
                    <View style={styles.boxView}>
                        <ImageBackground borderRadius={15} source={require('../../Images/box_blue.png')} resizeMode='cover' style={{ width: '100%' }}>
                            <ScrollView bounces={false}>
                                <View style={[AppStyles.container, { paddingHorizontal: 15, paddingVertical: 20 }]}>
                                    <View style={styles.titleView}>

                                        <Text style={[styles.title, { width: '50%' }]}>
                                            {this.title}
                                        </Text>
                                        <Text style={[styles.date, { width: '50%', textAlign: 'right' }]}>
                                            {moment(this.date).format('DD MMM YYYY')}
                                        </Text>
                                    </View>
                                    <View >

                                        <Text style={styles.description}>
                                            {this.description}
                                        </Text>
                                    </View>
                                </View>
                            </ScrollView>
                        </ImageBackground>
                    </View>
                </View>
            </>
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

export default connect(mapStateToProps, mapDispatchToProps)(NotificationDetailScreen);