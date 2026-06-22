import React, { Component } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    Image,
    TouchableOpacity,
    Platform
} from 'react-native';
import styles from './styles'
import { Inputs, Button, Header, Loader } from './../../Components';
import { AppStyles, AppConstants, AppImages } from './../../Themes';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { supportAction } from './../../Redux/actions/Support';
import { constants } from '../../Themes/AppConstants';
import I18n from "react-native-i18n";
class Support extends Component {
    // static navigationOptions = ({ navigation }) => {
    //     return {
    //         header: <Header
    //             headerTitle={I18n.t('Support')}
    //             leftImageSource={AppImages.images.back} leftbackbtnPress={() => navigation.goBack()} />
    //     }
    // };
    constructor(porps) {
        super(porps);
        this.state = {
            tittle: "",
            message: ""
        }
        this.inputs = {}
    }

    updateRefs(id, input) {
        this.inputs[id] = input;
    }

    focusNextField(id) {
        if (id == "done") {
            Keyboard.dismiss()
        } else {
            this.inputs[id].focus();
        }
    }

    registerButton = () => {
        let { navigation } = this.props;

        if (this.state.tittle == "" || this.state.tittle.trim().length == 0) {
            alert(I18n.t('enterTitle'))
        }
        else if (this.state.message == "" || this.state.message.trim().length == 0) {
            alert(I18n.t('pleaseEnterMessage'))
        }
        else {
            this.props.supportAction(this.state.tittle, this.state.message, navigation)
        }
    }


    //Method for input view
    inputView = () => {
        let constants = AppConstants.constants
        return (
            <View style={{ paddingTop: 25 }}>

                <Inputs
                customInput={{paddingTop:8}}
                    Text={I18n.t('Tittle')}
                    source={AppImages.images.pencil}
                    onRef={(input) => this.updateRefs('otp', input)}
                    placeholder={I18n.t('Enter_Title')}
                    onChangeText={(tittle) => this.setState({ tittle })}
                    secureTextEntry={false}
                    autoCapitalize={false}
                    keyboardType={'ascii-capable'}
                    returnKeyType={'next'}
                    onSubmitEditing={() => this.focusNextField('message')} />


                <TextInput
                    ref={(input) => this.updateRefs('message', input)}
                    style={styles.textInputContainer}
                    placeholder={I18n.t('Type_Message_Here')}
                    multiline={true}
                    onChangeText={(message) => this.setState({ message })} />

            </View>
        )
    }

    submitButtonView = () => {
        let constants = AppConstants.constants
        return (
            Platform.OS=='ios'?
            <View style={styles.bottomView}>
                <Button Text={I18n.t('Submit')} onPress={this.registerButton.bind(this)} />
            </View>
            :
            <View style={styles.androidBottomView}>
                <Button Text={I18n.t('Submit')} onPress={this.registerButton.bind(this)} />
            </View>
        )
    }


    render() {
        let constants = AppConstants.constants
        return (
            <>
            {
                Platform.OS=='android'?
                <Header
                headerTitle={I18n.t('Support')}
                leftImageSource={AppImages.images.back} leftbackbtnPress={() => this.props.navigation.goBack()} />
                :
                <View style={{flex:0.13}}>
            <Header
                headerTitle={I18n.t('Support')}
                leftImageSource={AppImages.images.back} leftbackbtnPress={() => this.props.navigation.goBack()} />
            </View>}
                <Loader loading={this.props.supportState.onLoad} />
           {Platform.OS=='ios'?
            <SafeAreaView style={styles.mainContainer}>
                <View style={[AppStyles.container, { paddinTop: 20 }]} >

                    {this.inputView()}
                    {this.submitButtonView()}



                </View>
            </SafeAreaView>
            :
            <ScrollView style={styles.mainContainer}>
                {/* <Loader loading={this.props.supportState.onLoad} /> */}
                <View style={[AppStyles.container, { paddinTop: 20 }]} >

                    {this.inputView()}
                    {this.submitButtonView()}



                </View>
                </ScrollView>}
                </>
        )
    }
}

function mapStateToProps(state) {
    return {
        supportState: state.SupportState,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ supportAction }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Support);

