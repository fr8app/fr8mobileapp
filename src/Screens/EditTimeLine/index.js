import React, { Component } from "react";
import { Platform, ScrollView, View } from "react-native";
import styles from "./style";
import { Button, Header, Inputs, Loader, PickerInput, Validations } from "./../../Components";
import { AppColor, AppImages } from "./../../Themes";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import DateTimePicker from 'react-native-modal-datetime-picker'
import moment from 'moment'
import I18n from 'react-native-i18n'
import { EditTimeLineAction, deleteTimeLineAction, EditManualTimeLineAction } from '../../Redux/actions/RoutePostAction'
import { imageBaseUrl } from "../../Config";
import AnimatedTextInput from "../../Components/AnimatedTextInput";
import { TouchableOpacity } from "react-native";
import Picker from "react-native-picker";
import { Keyboard } from 'react-native';
import { AFLogEvent } from "../../Config/aws";
class EditTimeLine extends Component {
  // static navigationOptions = ({ navigation }) => {
  //   return {
  //     header: (
  //       <Header
  //         headerTitle={I18n.t('Edit_Timeline')}
  //         leftImageSource={AppImages.images.back}
  //         leftbackbtnPress={() => navigation.goBack()}
  //       />
  //     )
  //   };
  // };
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      name: this.props.route.params.item?.name ? this.props.route.params.item?.name : '',
      location: this.props.route.params.item?.address ? this.props.route.params.item?.address : '',
      phoneNumber: this.props.route.params.item?.phone_number ?
        this.formatMobileNumber(this.props.route.params.item?.phone_number)
        : null,
      userType: this.props.route.params.item?.category ? this.props.route.params.item?.category : '',
      userTypeSelectedIndex: "",
      terminalType: [

        I18n.t("Warehouse"),
        I18n.t('Truck Stop'),
        I18n.t('Gas Station'),
        I18n.t('Weight Station')
      ],

      visible: false,
      startTime: moment(this.props.route.params.item.start_time).format('YYYY-MM-DDTHH:mm'),
      endTime: moment(this.props.route.params.item.end_time).format('YYYY-MM-DDTHH:mm'),
      startTimeShow: moment(this.props.route.params.item.start_time).format('HH:mm'),
      endTimeShow: moment(this.props.route.params.item.end_time).format('HH:mm'),
      type: '',
      distance: this.props.route.params.item.distance,
      totalTime: this.props.route.params.item.minute,
      createdAt: moment(this.props.route.params.item.created_at).format('YYYY-MM-DD'),
      startUnix: null,
      enndUnix: null
    };
    this.inputs = {};
    this.item = this.props.route.params.item
  }
  componentDidMount() {
    AFLogEvent("EditTimeLine", { screen: 'EditTimeLine'})

    this.locRef?.setState({ value: this.state.location })
    Keyboard.addListener('keyboardDidShow', () => {
      Picker.hide()
    })

    this.focusListener = this.props.navigation.addListener('blur', () => {
      Picker.hide()
    })

    let startDate = this.state.startTime
    let endDate = this.state.endTime
    let startDateUnix = moment(startDate).format('x')
    let endDateUnix = moment(endDate).format('x')
    this.setState({ startUnix: startDateUnix, enndUnix: endDateUnix })
  }

  _onChangeText = (text) => {
    let formatedNo = this.formatMobileNumber(text);
    // this.setState({ phone: formatedNo });
    this.setState({ phoneNumber: formatedNo })
  };

  // formatMobileNumber=(text)=> {
  //   var cleaned = ("" + text).replace(/\D/g, "");
  //   var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  //   if (match) {
  //     var intlCode = match[1] ? "+1 " : "",
  //       number = [intlCode, "(", match[2], ") ", match[3], "-", match[4]].join(
  //         ""
  //       );
  //     return number;
  //   }
  //   return text;
  // }

  formatMobileNumber = (value) => {
    // if input value is falsy eg if the user deletes the input, then just return
    if (!value) return value;

    // clean the input for any non-digit values.
    const phoneNumber = value.replace(/[^\d]/g, "");

    // phoneNumberLength is used to know when to apply our formatting for the phone number
    const phoneNumberLength = phoneNumber.length;

    // we need to return the value with no formatting if its less then four digits
    // this is to avoid weird behavior that occurs if you  format the area code to early
    if (phoneNumberLength < 4) return phoneNumber;

    // if phoneNumberLength is greater than 4 and less the 7 we start to return
    // the formatted number
    // if (phoneNumberLength < 7) {
    //   return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    // }

    // // finally, if the phoneNumberLength is greater then seven, we add the last
    // // bit of formatting and return it.
    // return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
      // return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    }

    // finally, if the phoneNumberLength is greater then seven, we add the last
    // bit of formatting and return it.
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
      // return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(

      3,
      6
    )}-${phoneNumber.slice(6, 15)}`;
  }

  userTypeButton = () => {
    Picker.init({
      selectedValue: [this.state.userType],
      pickerData: this.state.terminalType,
      pickerConfirmBtnText: I18n.t("Confirm"),
      pickerCancelBtnText: I18n.t("Cancel"),
      pickerTitleText: I18n.t("Please_Select"),
      pickerTextEllipsisLen: 100,
      onPickerConfirm: (data, index) => {
        let selectIndex = Number(index) + Number(1);
        this.setState({ userType: data.toString(), userTypeSelectedIndex: selectIndex });
      },
      onPickerCancel: data => {
        Picker.hide();
      },
      onPickerSelect: data => {
        console.log(data);
      }
    });
    Picker.show();
  };


  deleteTimeLine = () => {
    this.props.deleteTimeLineAction(this.item.id, this.props.navigation)
  }
  pickerOpen = (type) => {
    Keyboard.dismiss()
    Picker.hide()
    this.setState({ visible: true, type })
  }
  updatePress = () => {
    Keyboard.dismiss()
    this.props.EditTimeLineAction(this.state.startTime, this.state.endTime, imageBaseUrl + this.item.image, this.item._id, this.state.distance, this.state.totalTime, this.item.terminal_id, this.props.navigation)
  }
  updatePressManual = () => {
    this.setState({ disabled: true })
    setTimeout(() => {
      this.setState({ disabled: false })
    }, 500);
    Keyboard.dismiss()
    if (!this.nameRef.state.value) {
      // alert('Please enter timeline name.')
      alert(I18n.t('location_name_enter'))

    }
    if (this.nameRef.state?.value?.trim().length == 0) {
      // alert('Please enter timeline name.')
      alert(I18n.t('location_name_enter'))
    }
    else if (this.nameRef.state.value?.trim().length < 2) {
      // alert('Timeline name should be at least 2 characters long.')
      // alert('Timeline name should be at least 2 characters long.')
      alert(I18n.t('locationNameLong'))

    }
    else if (!this.locRef.state.value) {
      alert(I18n.t('locationAddress'))

      // alert(I18n.t('location_name_enter'))
      // alert('Please enter timeline location address.')
    }
    else if (this.locRef.state?.value?.trim().length == 0) {
      alert(I18n.t('locationAddress'))

      // alert('Please enter timeline location address.')
    }
    else if (this.locRef.state.value.trim().length < 2) {
      alert(I18n.t('locationAddressLong'))

    }
    else if (this?.phoneRef?.state.value?.length < 12 && this?.phoneRef?.state.value?.length > 0) {
      alert(I18n.t("enter_phone_number_length_alert"));
    }
    // else if (this?.phoneRef?.state.value?.length > 0 && !Validations.validatePhoneNumber(this?.phoneRef?.state.value)) {
    //     alert(I18n.t("enter_Numbers_allowed__phone_alert"));
    // }

    else {

      this.props.EditManualTimeLineAction(this.state.name.trim(), this.locRef.state.value, this.state.userType, this.state.phoneNumber?.trim(), this.item._id, this.state.startTime, this.state.endTime, this.state.distance, this.state.totalTime, this.props.navigation)
    }
  }
  totalTimeGet = (seconds) => {
    seconds = Number(seconds);
    var h = Math.floor(seconds / (3600));
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);
    var hDisplay = h > 0 ? h + (h == 1 ? " " + I18n.t('hrs') + " " : " " + I18n.t('hrs') + ' ') : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " " + I18n.t('mins') + ' ' + ' ' : " " + I18n.t('mins') + ' ') : [s > 29 ? "1 " : "0 "] + I18n.t('mins');
    if (h > 0) {
      return hDisplay + mDisplay
    }
    else {
      return mDisplay
    }
  }
  feildsView = () => {
    return (
      <View style={styles.phoneNumberView}>
        <View style={styles.phoneNumberInputView}>
          <View>

            <AnimatedTextInput
              ref={(nameRef) => this.categoryRef = nameRef}
              value={this.state.startTimeShow}
              editable={false}
              containerStyle={{ marginTop: '2%' }}
              label={I18n.t('start_time')}
              borderColor={'transparent'}
              sourceRight={AppImages.images.dropdownArrow}
            />
            <TouchableOpacity activeOpacity={1} style={{ position: 'absolute', height: '75%', bottom: 0, width: '100%', }} onPress={() => this.pickerOpen('start')}>
            </TouchableOpacity>
          </View>
          <View>
            <AnimatedTextInput
              ref={(nameRef) => this.categoryRef = nameRef}
              value={this.state.endTimeShow}
              editable={false}
              containerStyle={{ marginTop: '2%' }}
              label={I18n.t('endTime')}
              borderColor={'transparent'}
              sourceRight={AppImages.images.dropdownArrow}
            />
            <TouchableOpacity activeOpacity={1} style={{ position: 'absolute', height: '75%', bottom: 0, width: '100%', }} onPress={() => this.pickerOpen('end')}>
            </TouchableOpacity>
          </View>

          <AnimatedTextInput
            ref={(nameRef) => this.categoryRef = nameRef}
            value={this.totalTimeGet(this.state.totalTime)}
            editable={false}
            containerStyle={{ marginTop: '2%' }}
            label={I18n.t('Total_time')}
            borderColor={'transparent'}
          //  sourceRight={AppImages.images.dropdownArrow}
          />
          <AnimatedTextInput
            ref={(nameRef) => this.categoryRef = nameRef}
            value={this.state.distance == 0 ? '0' + ' mi' : ((this.state.distance / 1000) * 0.621371).toFixed(2) + ' mi'}
            editable={false}
            containerStyle={{ marginTop: '2%' }}
            label={I18n.t('distance')}
            borderColor={'transparent'}
          //  sourceRight={AppImages.images.dropdownArrow}
          />

          <View style={[styles.updateButton, { marginTop: '20%' }]}>
            <Button Text={I18n.t('Update')} onPress={() => { this.updatePress() }} />
          </View>

        </View>

      </View>
    );
  };
  _hideDateTimePicker = () => this.setState({ visible: false });

  _handleDatePicked = (date) => {
    if (this.state.type == 'start') {
      if (this.state.enndUnix - moment(date).format('x') >= 0) {
        let startTime = moment(date).format('YYYY-MM-DDTHH:mm');
        let utcStart = moment(startTime).local().format('YYYY-MM-DDTHH:mm')
        this.setState({ startTime: utcStart, startTimeShow: moment(date).format('HH:mm') }, () => {
          let startUnix = moment(date).format('x')
          this.setState({ startUnix })
        })
      }
      else {
        setTimeout(() => {
          alert(I18n.t('startEndAlert'))
        }, 500);
      }

    }
    else {
      if (moment(date).format('x') - this.state.startUnix >= 0) {
        let endTime = moment(date).format('YYYY-MM-DDTHH:mm');
        let utcEnd = moment(endTime).local().format('YYYY-MM-DDTHH:mm')
        this.setState({ endTime: utcEnd, endTimeShow: moment(date).format('HH:mm') }, () => {
          let enndUnix = moment(date).format('x')
          this.setState({ enndUnix })
        })
      }
      else {
        setTimeout(() => {
          alert(I18n.t('startEndAlert'))
        }, 500);
      }

    }
    setTimeout(() => {
      let diff = this.state.enndUnix - this.state.startUnix
      let sec = Math.floor((diff / 1000));
      this.setState({ totalTime: sec })
    }, 200);
    this._hideDateTimePicker();
  };
  render() {
    return (
      <>
      {Platform.OS=='android'?
      <Header
      headerTitle={I18n.t('Edit_Timeline')}
      leftImageSource={AppImages.images.back}
      leftbackbtnPress={() => this.props.navigation.goBack()}
    />
      :
        <View style={{flex:0.13}}>
       <Header
          headerTitle={I18n.t('Edit_Timeline')}
          leftImageSource={AppImages.images.back}
          leftbackbtnPress={() => this.props.navigation.goBack()}
        />
       </View>}
      <View style={[styles.mainContainer, { justifyContent: this.props.route.params?.item?.type == 'manual' ? 'flex-start' : 'center' }]}>
       
        <Loader loading={this.props.timeLineState.onLoad} />
        {this.props.route.params?.item?.type == 'manual' ?
          <ScrollView
            keyboardShouldPersistTaps='always'
            keyboardDismissMode='on-drag'
            onScroll={() => {
              // Keyboard.dismiss(),
              Picker.hide()
            }}
            showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }} style={{ marginHorizontal: '5%', flex: 1 }}>
            <AnimatedTextInput
              ref={(nameRef) => this.nameRef = nameRef}
              value={this.state.name}
              label={I18n.t('Name')}
              borderColor={'transparent'}
              maxLength={50}
              onChangeText={(text) => this.setState({ name: text })}

            />
            <AnimatedTextInput
              focusCall={true}
              isLocation={true}
              ref={(nameRef) => this.locRef = nameRef}
              containerStyle={{ marginTop: '2%' }}
              label={I18n.t('Location Address')}
              borderColor={'transparent'}
              maxLength={255}
            // value={this.state.location}
            // onChangeText={(text)=>this.setState({location:text})}
            />



            {this.state.userType ?
              <View>
                <AnimatedTextInput
                  ref={(nameRef) => this.categoryRef = nameRef}
                  value={this.state.userType}
                  editable={false}
                  containerStyle={{ marginTop: '2%' }}
                  label={I18n.t('Category')}
                  borderColor={'transparent'}
                  sourceRight={AppImages.images.dropdownArrow}
                />
                <TouchableOpacity activeOpacity={1} style={{ position: 'absolute', height: '75%', bottom: 0, width: '100%', }} onPress={this.userTypeButton}>
                </TouchableOpacity>



              </View> : null}


            {this.state.phoneNumber !== null ? <AnimatedTextInput
              isPhoneNumber={true}
              ref={(nameRef) => this.phoneRef = nameRef}
              containerStyle={{ marginTop: '2%' }}
              keyboardType={'numeric'}
              label={I18n.t('Phone Number')}
              borderColor={'transparent'}
              maxLength={19}
              value={this.state.phoneNumber}

              onChangeText={(text) => {
                // this.setState({ phoneNumber: text })
                this._onChangeText(text);
              }}
            /> : null}
            <View>
              <AnimatedTextInput
                ref={(nameRef) => this.categoryRef = nameRef}
                value={this.state.startTimeShow}
                editable={false}
                containerStyle={{ marginTop: '2%' }}
                label={I18n.t('start_time')}
                borderColor={'transparent'}
                sourceRight={AppImages.images.dropdownArrow}
              />
              <TouchableOpacity activeOpacity={1} style={{ position: 'absolute', height: '75%', bottom: 0, width: '100%', }} onPress={() => this.pickerOpen('start')}>
              </TouchableOpacity>
            </View>
            <View>
              <AnimatedTextInput
                ref={(nameRef) => this.categoryRef = nameRef}
                value={this.state.endTimeShow}
                editable={false}
                containerStyle={{ marginTop: '2%' }}
                label={I18n.t('endTime')}
                borderColor={'transparent'}
                sourceRight={AppImages.images.dropdownArrow}
              />
              <TouchableOpacity activeOpacity={1} style={{ position: 'absolute', height: '75%', bottom: 0, width: '100%', }} onPress={() => this.pickerOpen('end')}>
              </TouchableOpacity>
            </View>

            <AnimatedTextInput
              ref={(nameRef) => this.categoryRef = nameRef}
              value={this.totalTimeGet(this.state.totalTime)}
              editable={false}
              containerStyle={{ marginTop: '2%' }}
              label={I18n.t('Total_time')}
              borderColor={'transparent'}
            //  sourceRight={AppImages.images.dropdownArrow}
            />
            <AnimatedTextInput
              ref={(nameRef) => this.categoryRef = nameRef}
              value={this.state.distance == 0 ? '0' + ' mi' : ((this.state.distance / 1000) * 0.621371).toFixed(2) + ' mi'}
              editable={false}
              containerStyle={{ marginTop: '2%' }}
              label={I18n.t('distance')}
              borderColor={'transparent'}
            //  sourceRight={AppImages.images.dropdownArrow}
            />
            <DateTimePicker
              date={this.state.type == 'end' ? moment(this.props.route.params.item.end_time).toDate() : moment(this.props.route.params.item.start_time).toDate()}
              mode='time'
              isVisible={this.state.visible}
              onConfirm={this._handleDatePicked}
              onCancel={this._hideDateTimePicker}
              titleIOS={'Select time'}
            />

            <View style={[styles.updateButton, { marginTop: '20%' }]}>
              <Button
                disabled={this.state.disabled}
                Text={I18n.t('Update')} onPress={() => { this.updatePressManual() }} />
            </View>


          </ScrollView>
          :
          <>

            {this.feildsView()}
            <DateTimePicker
              date={this.state.type == 'end' ? moment(this.props.route.params.item.end_time).toDate() : moment(this.props.route.params.item.start_time).toDate()}
              mode='time'
              isVisible={this.state.visible}
              onConfirm={this._handleDatePicked}
              onCancel={this._hideDateTimePicker}
              titleIOS={'Select time'}
            />
          </>
        }
      </View>
    </>
    );
  }
}
function mapStateToProps(state) {
  return {
    timeLineState: state.RoutePostData,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      deleteTimeLineAction,
      EditTimeLineAction,
      EditManualTimeLineAction
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditTimeLine);
