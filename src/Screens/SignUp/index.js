import React, { Component } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    Image,
    Keyboard,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import styles from './styles'
import { Inputs, Button, PickerInput, Header, Loader, Validations, CountriesData } from './../../Components';
import { AppStyles, AppConstants, AppImages, AppColor } from './../../Themes';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import ImagePicker from 'react-native-image-picker';
import Picker from 'react-native-picker';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { checkUserAction } from '../../Redux/actions/Authentication';
import I18n from 'react-native-i18n';


class SignUp extends Component {
    static navigationOptions = ({ navigation }) => {
        navigation.state.key = "Register"
        return {
            header: <Header
                headerTitle={I18n.t("Register")}
                leftImageSource={AppImages.images.back} leftbackbtnPress={() => navigation.goBack()} />
        }
    };
    constructor(porps) {
        super(porps);

        this.state = {
            avatarImage: "",
            fullName: "",
            userName: "",
            email: "",
            phoneNo: "",
            password: "",
            confirmPassword: "",
            userType: "",
            driverType: "",
            dob: "",
            isDateTimePickerVisible: false,
            checked: false,
            userTypeSelectedIndex: "",
            userTypeArray: ["Driver", "Owner Operator", "Company", "Air Cargo Carrier", "Exporter", "Freight Broker", "Importer", "Shipper", "Trucking", "Warehouse"],
            driverTypeArray: ["Owner Operator", "Company Driver"],
            driverTypeSelectedIndex: "",
            countryCode: ["+1"]
        }
        this.countryDialCodeArray = []
        for (let i in CountriesData.codes) {
            this.countryDialCodeArray.push(CountriesData.codes[i].dial_code)
        }
      
        this.inputs = {}
    }

    updateRefs(id, input) {
        this.inputs[id] = input;
        // string.replace(/^\s+/g, "")
    }

    focusNextField(id) {
        if (id == "done") {
            Keyboard.dismiss()
        }
        else {
            this.inputs[id].focus();
        }
    }

    userTypeButton = () => {
        Keyboard.dismiss()
        Picker.init({
            pickerData: this.state.userTypeArray,
            pickerConfirmBtnText:I18n.t("Confirm"),
            pickerCancelBtnText: I18n.t("Cancel"),
            pickerTitleText: I18n.t("Please_Select"),
            pickerTextEllipsisLen:100,
            onPickerConfirm: (data, index) => {
                let selectIndex = Number(index) + Number(1)
                this.setState({ userType: data, userTypeSelectedIndex: selectIndex })
            },
            onPickerCancel: data => {
                // console.log(data);
                Picker.hide()
            },
            onPickerSelect: data => {
                // console.log(data);
            }
        });
        Picker.show();
    }


    driverTypeButton = () => {
        Picker.init({
            pickerData: this.state.driverTypeArray,
            pickerConfirmBtnText:I18n.t("Confirm"),
            pickerCancelBtnText: I18n.t("Cancel"),
            pickerTitleText: I18n.t("Please_Select"),
            pickerTextEllipsisLen:100,
            onPickerConfirm: (data, index) => {
                let selectIndex = Number(index) + Number(1)
                this.setState({ driverType: data, driverTypeSelectedIndex: selectIndex })
            },
            onPickerCancel: data => {
                // console.log(data);
                Picker.hide()
            },
            onPickerSelect: data => {
                // console.log(data);
            }
        });
        Picker.show();
    }

    coutrySelection = () => {
        Picker.init({
            pickerData: this.countryDialCodeArray,
            pickerConfirmBtnText:I18n.t("Confirm"),
            pickerCancelBtnText: I18n.t("Cancel"),
            pickerTitleText: I18n.t("Please_Select"),
            pickerTextEllipsisLen:100,
            onPickerConfirm: (data, index) => {
                this.setState({ countryCode: data })
            },
            onPickerCancel: data => {
                // console.log(data);
                Picker.hide()
            },
            onPickerSelect: data => {
                // console.log(data);
            }
        });
        Picker.show();
    }

    validateSpecialCharacter(passport) {
        var passportNumber = /[!"#$%&'()*+.\/:;<=>?@\[\\\]^_`{|}~-]/;
        return passportNumber.test(passport)
    }

    registerButton = () => {
        Keyboard.dismiss()
        let { navigation } = this.props;
        if (this.state.fullName == "" || this.state.fullName.trim().length == 0) {
            alert(I18n.t("enter_full_name_alert"))
        }
        else if (this.validateSpecialCharacter(this.state.fullName)) {
            alert(I18n.t("enter_full_name_aplhanumeric_alert"))
        }
        else if (this.state.userName == "" || this.state.userName.trim().length == 0) {
            alert(I18n.t("enter_user_name_alert"))
        }
        else if (this.state.email == "" || this.state.email.trim().length == 0) {
            alert(I18n.t("enter_email_alert"))
        }
        else if (!Validations.validateEmail(this.state.email.trim())) {
            alert(I18n.t("enter_valid_email_alert"))
        }
        else if (this.state.userType == "" || this.state.userType.length == 0) {
            alert(I18n.t("enter_user_type_alert"))
        }
        else if (this.state.userTypeSelectedIndex == 1 && this.state.driverType == "") {
            alert(I18n.t("enter_driver_type_alert"))
        }
        else if (this.state.phoneNo == "" || this.state.phoneNo.trim().length == 0) {
            alert(I18n.t("enter_phone_number_alert"))
        }
        else if (this.state.phoneNo.length < 8) {
            alert(I18n.t("enter_phone_number_length_alert"))
        }
        else if (!Validations.validatePhoneNumber(this.state.phoneNo)) {
            alert(I18n.t("enter_Numbers_allowed__phone_alert"))
        }
        else if (this.state.dob == "") {
            alert(I18n.t("enter_date_of_birth_alert"))
        }
        else if (this.state.password == "" || this.state.password.trim().length == 0) {
            alert(I18n.t("enter_password_alert"))
        }
        else if (this.state.password.length < 6) {
            alert(I18n.t("enter_password_length_alert"))
        }
        else if (this.state.confirmPassword == null || this.state.confirmPassword.trim().length == 0) {
            alert(I18n.t("enter_confirm_password_alert"))
        }
        else if ((this.state.password) !== (this.state.confirmPassword)) {
            alert(I18n.t("enter_password_not_match_alert"))
        }
        else if (this.state.checked == false) {
            alert(I18n.t("enter_terms_conditions_alert"))
        }
        else {
            this.props.checkUserAction(this.state.avatarImage, this.state.fullName, this.state.userName, this.state.email,
                this.state.userTypeSelectedIndex, this.state.driverTypeSelectedIndex, this.state.countryCode, this.state.phoneNo, this.state.dob, this.state.password, navigation)
        }
    }

    //Method for image picker 
    imagePicker = () => {
        const options = {
            title: 'Select Image',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
            quality: 0.5
        };

        ImagePicker.showImagePicker(options, (response) => {
            // console.log('Response = ', response);

            if (response.didCancel) {
                // console.log('User cancelled image picker');
            } else if (response.error) {
                // console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                // console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.uri, type: response.type, name: response.fileName ? response.fileName :"name.jpg"};

                this.setState({ avatarImage: source })

            }
        });
    }

    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (date) => {

        let formattedDate = moment(date).format('YYYY-MM-DD');
        this.setState({ dob: formattedDate })
        this._hideDateTimePicker();
    };

    userName = (input) => {
        this.setState({ userName: input.replace(/\s/g, '') })
    }

    //Method for input view
    inputView = () => {
        let constants = AppConstants.constants
        return (
            <View style={{ paddingTop: 15 }}>
                <Inputs
                    Text={I18n.t('Full_Name')}
                    source={AppImages.images.userGrey}
                    onRef={(input) => this.updateRefs('fullName', input)}
                    placeholder={I18n.t('Enter_Full_Name')}
                    onSubmitEditing={() => this.focusNextField('userName')}
                    onChangeText={(fullName) => this.setState({ fullName })}
                    keyboardType={'ascii-capable'}
                    returnKeyType={'next'}
                    maxLength={20}
                    autoCapitalize={"sentences"}
                // value={this.state.fullName}
                />

                <Inputs
                    Text={I18n.t("Username")}
                    source={AppImages.images.userGrey}
                    onRef={(input) => this.updateRefs('userName', input)}
                    placeholder={I18n.t("Enter_Username")}
                    autoCapitalize={"none"}
                    keyboardType={'ascii-capable'}
                    returnKeyType={'next'}
                    onChangeText={(userName) => this.userName(userName)}
                    onSubmitEditing={() => this.focusNextField('email')}
                    value={this.state.userName} />

                <Inputs
                    Text={I18n.t("Email_Address")}
                    source={AppImages.images.atTheRate}
                    onRef={(input) => this.updateRefs('email', input)}
                    placeholder={I18n.t("Enter_Email_Address")}
                    onChangeText={(email) => this.setState({ email })}
                    autoCapitalize={"none"}
                    keyboardType={'email-address'}
                    returnKeyType={'done'} />

                <PickerInput
                    Text={I18n.t("User_Type")}
                    source={AppImages.images.userGrey}
                    placeHolderText={this.state.userType == "" ? I18n.t("Select_User_Type") : this.state.userType}
                    color={this.state.userType == "" ? AppColor.colors.placeHolder : AppColor.colors.inputColor}
                    sourceRight={AppImages.images.dropdownArrow}
                    onPress={this.userTypeButton} />
                {this.state.userTypeSelectedIndex == 1 ?
                    <PickerInput
                        Text={I18n.t('Driver_Type')}
                        source={AppImages.images.userGrey}
                        placeHolderText={this.state.driverType == "" ? I18n.t("Select_Driver_Type") : this.state.driverType}
                        sourceRight={AppImages.images.dropdownArrow}
                        color={this.state.driverType == "" ? AppColor.colors.placeHolder : AppColor.colors.inputColor}
                        onPress={this.driverTypeButton} />
                    : null}
                <Inputs
                    Text={I18n.t("Phone_Number")}
                    source={AppImages.images.phone}
                    onRef={(input) => this.updateRefs('phoneNo', input)}
                    placeholder={I18n.t("Enter_Phone_Number")}
                    onChangeText={(phoneNo) => this.setState({ phoneNo })}
                    autoCapitalize={"none"}
                    keyboardType={'numeric'}
                    returnKeyType={'done'}
                    countryText={this.state.countryCode == "" ? "+1" : this.state.countryCode}
                    countryTouchableOpacity={this.coutrySelection} />

                <PickerInput
                    Text={I18n.t("Date_Of_Birth")}
                    source={AppImages.images.calender}
                    placeHolderText={this.state.dob == "" ? I18n.t("Select_Date_Of_Birth") : this.state.dob}
                    sourceRight={AppImages.images.dropdownArrow}
                    onPress={this._showDateTimePicker}
                    color={this.state.dob == "" ? AppColor.colors.placeHolder : AppColor.colors.inputColor}
                />

                <Inputs
                    Text={I18n.t('Password')}
                    source={AppImages.images.key}
                    onRef={(input) => this.updateRefs('password', input)}
                    placeholder={constants.Enter_Password}
                    secureTextEntry={true}
                    autoCapitalize={"none"}
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
                    autoCapitalize={"none"}
                    keyboardType={'ascii-capable'}
                    returnKeyType={'done'}
                    onChangeText={(confirmPassword) => this.setState({ confirmPassword })} />

            </View>
        )
    }
    termButtom = () => {
        if (this.state.checked == false) {
            this.setState({ checked: true })
        }
        else {
            this.setState({ checked: false })
        }
    }
    //Method for terms view
    termsView = () => {
        return (
            <View style={styles.termsView} >
                <TouchableOpacity activeOpacity={0.5} onPress={this.termButtom}>
                    <Image resizeMode="contain" style={styles.checkBoxImage} source={this.state.checked == false ? AppImages.images.unCheckBox : AppImages.images.checkBox} />
                </TouchableOpacity>
                <Text style={styles.termsText} numberOfLines={1}>{I18n.t("Agree_Terms_and_Condition")}</Text>
            </View>
        )
    }

    //Method for avtar image
    avtarImage = () => {
        return (
            <TouchableOpacity style={styles.avatarImageButton} onPress={this.imagePicker}>
                <Image style={this.state.avatarImage == "" ? styles.avatarImage : styles.selectedAvtarImage} source={this.state.avatarImage == "" ? AppImages.images.avtarImage : this.state.avatarImage} />
            </TouchableOpacity>
        )
    }

    render() {
        let constants = AppConstants.constants
        return (
            <SafeAreaView style={styles.mainContainer}>
                <Loader loading={this.props.checkUserState.onLoad} />
                <ScrollView style={AppStyles.container} bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 20, paddingBottom: 35 }}>

                    {this.avtarImage()}
                    {this.inputView()}
                    {this.termsView()}
                    <Button Text={I18n.t('Register')} onPress={this.registerButton} />
                    <DateTimePicker
                        isVisible={this.state.isDateTimePickerVisible}
                        onConfirm={this._handleDatePicked}
                        onCancel={this._hideDateTimePicker}
                        date={new Date(moment().subtract(18, 'years').calendar())}
                        maximumDate={new Date(moment().subtract(18, 'years').calendar())}
                    />
                </ScrollView>
            </SafeAreaView>
        )
    }
}
function mapStateToProps(state) {
    return {
        registerState: state.RegisterState,
        checkUserState: state.CheckUserState
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ checkUserAction }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);

