import React, { Component } from 'react';
import {
    SafeAreaView,
    View,
} from 'react-native';
import styles from './styles'
import { Inputs, Button, Header, Loader } from './../../Components';
import { AppStyles, AppConstants, AppImages } from './../../Themes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { resetPasswordAction } from './../../Redux/actions/Authentication';

class ResetPassword extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            header: <Header
                headerTitle={AppConstants.constants.Reset_Password}
                leftImageSource={AppImages.images.back} leftbackbtnPress={() => navigation.goBack()} />
        }
    };
    constructor(porps) {
        super(porps);
        this.state = {
            otp: "",
            password: "",
            confirmPassword: ""
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
        // this.props.navigation.goBack("ForgotPassword")
        let { navigation, OTPState } = this.props;
        // console.error(OTPState.result.data.OTP)
        if (this.state.otp == "" || this.state.otp.trim().length == 0) {
            alert("Please enter OTP.")
        }
        else if (Number(OTPState.result.data.OTP )!== Number(this.state.otp.trim())) {
            alert("Please enter valid OTP.")
        }
        // else if (this.state.otp.trim().length < 5) {
        //     alert("Please enter 4 digit otp.")
        // }
        else if (this.state.password == "" || this.state.password.trim().length == 0) {
            alert("Please enter password.")
        }
        else if (this.state.password.length < 6) {
            alert("Password must be at least 6 characters.")
        }
        else if (this.state.confirmPassword == null || this.state.confirmPassword.trim().length == 0) {
            alert("Please enter confirm password.")
        }
        else if ((this.state.password) !== (this.state.confirmPassword)) {
            alert("Password and Confirm Password must be same.")
        }
       
        else {
            this.props.resetPasswordAction(OTPState.userData.phoneNo,this.state.password, navigation)
        }
    }


    //Method for input view
    inputView = () => {
        let constants = AppConstants.constants
        return (
            <View style={{ paddingTop: 15 }}>
                <Inputs
                    Text={constants.OTP}
                    source={AppImages.images.otp}
                    onRef={(input) => this.updateRefs('otp', input)}
                    placeholder={constants.Enter_OTP}
                    onChangeText={(otp) => this.setState({ otp })}
                    secureTextEntry={true}
                    autoCapitalize={false}
                    maxLength={5}
                    keyboardType={'numeric'}
                    returnKeyType={'next'} />

                <Inputs
                    Text={"New " + constants.Password}
                    source={AppImages.images.key}
                    onRef={(input) => this.updateRefs('password', input)}
                    placeholder={constants.Enter_New_Password}
                    secureTextEntry={true}
                    autoCapitalize={false}
                    keyboardType={'ascii-capable'}
                    returnKeyType={'next'}
                    onChangeText={(password) => this.setState({ password })}
                    onSubmitEditing={() => this.focusNextField('confirmPassword')} />

                <Inputs
                    Text={constants.Confirm_Password}
                    source={AppImages.images.key}
                    onRef={(input) => this.updateRefs('confirmPassword', input)}
                    placeholder={constants.Enter_Confirm_Password}
                    secureTextEntry={true}
                    autoCapitalize={false}
                    keyboardType={'ascii-capable'}
                    returnKeyType={'done'}
                    onChangeText={(confirmPassword) => this.setState({ confirmPassword })} />

            </View>
        )
    }

    submitButtonView = () => {
        let constants = AppConstants.constants
        return (
            <View style={styles.bottomView}>
                <Button Text={constants.Submit} onPress={this.registerButton.bind(this)} />
            </View>
        )
    }


    render() {
        return (
            <SafeAreaView style={styles.mainContainer}>
                <Loader loading={this.props.resetPasswordState.onLoad} />
                <View style={[AppStyles.container, { marginTop: 50 }]} >

                    {this.inputView()}
                    {this.submitButtonView()}

                </View>
            </SafeAreaView>
        )
    }
}
function mapStateToProps(state) {
    return {
        OTPState: state.OTPState,
        resetPasswordState: state.ResetPasswordState
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ resetPasswordAction }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);

