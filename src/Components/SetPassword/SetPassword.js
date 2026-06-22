import I18n from 'i18n-js';
import React, { Component } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, Image, Platform, Keyboard } from 'react-native';
import { connect } from 'react-redux';

import NavigationService from '../../Route/NavigationService';
import { fontFamily } from '../../Themes/AppFontFamily';
import Button from '../Button'
import OTPInputView from '@twotalltotems/react-native-otp-input';
import SmsRetriever from 'react-native-sms-retriever';
import moment from 'moment';
import DataManager from '../DataManager'
let interval
export default class SetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId:'',
      visible: false,
      userName: '',
      password: '',
      cpassword: '',
      data: null,
      code: '',
      otpVerified: false,
      screen:'',
      text:'',
      navigation:null
    };
    this.seconds = 59;
    this.interval=null
  }
  

  getDetail = async () => {
    let userData = await DataManager.getUserDetails();
    let jsonData = await JSON.parse(userData);
    this.setState({ userId: jsonData?.data?._id });

    if (!jsonData) {
      let dummyData = await DataManager.getDummyUserDetails()
      console.log('dummyData', dummyData);
      if (dummyData) {
        this.setState({ userId: dummyData.data.userId })
      }
    }
  };


  modalOpen = (name = '',navigation=null) => {
    this.getDetail()
    
    console.log('data on modal open');
    this.setState({navigation:navigation, visible: true, userName: name })
  }
  modalClose = () => {
    if(this.state.screen=='addProfile'&&this.state.otpVerified){
      this.state.navigation.goBack()
    }
    this.setState({ visible: false, otpVerified: false })
    this.setState({ userName: '', password: '',text:'',cpassword:'' })
  }
 
  validUserName(userName) {
    // var userReg=/^[a-zA-Z0-9._]+$/
    var userReg = /^(?![.])(?!.*[.]{2})[a-zA-Z0-9._]+(?![.])$/
    return userReg.test(userName)
  }

  containonlyDigit(userName) {
    var regex = /(?!^\d+$)^.+$/
    return regex.test(userName)
  }


  notDotTogeather(userName) {
    var regex = /\.{2,}/
    return regex.test(userName)
  }
  removeEmojis(string, spaceRemove) {
    // emoji regex from the emoji-regex library
    const regex = /\uD83C\uDFF4(?:\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74)\uDB40\uDC7F|\u200D\u2620\uFE0F)|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC68(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3]))|\uD83D\uDC69\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\uD83D\uDC68(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|(?:(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)\uFE0F|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDD6-\uDDDD])(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\u200D[\u2640\u2642])|\uD83D\uDC69\u200D[\u2695\u2696\u2708])\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC68(?:\u200D(?:(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D[\uDC66\uDC67])|\uD83C[\uDFFB-\uDFFF])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83C\uDDF6\uD83C\uDDE6|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF4\uD83C\uDDF2|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDB5\uDDB6\uDDD1-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDEEB\uDEEC\uDEF4-\uDEF9]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD70\uDD73-\uDD76\uDD7A\uDD7C-\uDDA2\uDDB0-\uDDB9\uDDC0-\uDDC2\uDDD0-\uDDFF])|(?:[#*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEF9]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD70\uDD73-\uDD76\uDD7A\uDD7C-\uDDA2\uDDB0-\uDDB9\uDDC0-\uDDC2\uDDD0-\uDDFF])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC69\uDC6E\uDC70-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD26\uDD30-\uDD39\uDD3D\uDD3E\uDDB5\uDDB6\uDDB8\uDDB9\uDDD1-\uDDDD])/g
    // if (string) {

      if (spaceRemove) {
        let removeEmoji = string.replace(regex, "")
        return removeEmoji.replace(/\s/g, '')
      }
      else {
        return string.replace(regex, '')
      }
    // }

  }
  loginPress = () => {
    if (this.state.userName == "" || this.state.userName?.trim().length == 0) {
      alert(I18n.t('enter_user_name_alert'));
    }
    else if (this.state.userName?.trim().charAt(0) == '.') {
      alert(I18n.t('user_name_start'))
    }
    else if (this.state.userName?.trim().length < 3) {
      alert(I18n.t('enter_user_name_length_alert'))
    }
    else if (this.state.userName?.trim().charAt(this.state.userName?.trim().length - 1) == '.') {
      alert(I18n.t('user_name_end'))
    }
    else if (this.notDotTogeather(this.state.userName)) {
      alert(I18n.t('twoDots'))
    }

    else if (!this.containonlyDigit(this.state.userName)) {
      alert(I18n.t('onlyNumberAlert'))
    }
    else if (!this.validUserName(this.state.userName?.trim())) {
      alert(I18n.t('validUserName'));
    }
    else if (this.state.password?.trim().length == 0) {
      alert(I18n.t("enter_password_alert"))
    }
    else {
      DataManager.getFavList().then((res) => {
        let listParse = JSON.parse(res)
      this.props.loginActionWithUserName(this.state.userName, this.state.password, NavigationService.getFullRoute()?._navigation,listParse,this.state.userId)
      // console.log('this.props',NavigationService.getFullRoute()?._navigation);
      })
    }
  }
  registerPress = () => {
    if (this.state.userName == "" || this.state.userName?.trim().length == 0) {
      alert(I18n.t('enter_user_name_alert'));
    }
    else if (this.state.userName?.trim().charAt(0) == '.') {
      alert(I18n.t('user_name_start'))
    }
    else if (this.state.userName?.trim().length < 3) {
      alert(I18n.t('enter_user_name_length_alert'))
    }
    else if (this.state.userName?.trim().charAt(this.state.userName?.trim().length - 1) == '.') {
      alert(I18n.t('user_name_end'))
    }
    else if (this.notDotTogeather(this.state.userName)) {
      alert(I18n.t('twoDots'))
    }

    else if (!this.containonlyDigit(this.state.userName)) {
      alert(I18n.t('onlyNumberAlert'))
    }
    else if (!this.validUserName(this.state.userName?.trim())) {
      alert(I18n.t('validUserName'));
    }
    else if (this.state.password?.trim().length == 0) {
      alert(I18n.t("enter_password_alert"))
    }
    else if (this.state.password?.trim().length < 6) {
      alert(I18n.t("enter_password_length_alert"))
    }
    else if (this.state.cpassword?.trim().length == 0) {
      alert(I18n.t("enter_confirm_password_alert"))
    }
    else if (this.state.cpassword != this.state.password) {
      alert(I18n.t("enter_password_not_match_alert"))
    }
    else {
      DataManager.getFavList().then((res) => {
        let listParse = JSON.parse(res)
      this.props.loginActionWithUserName(this.state.userName, this.state.password, NavigationService.getFullRoute()?._navigation,listParse,this.state.userId)
      // console.log('this.props',NavigationService.getFullRoute()?._navigation);
      })
    }
  }
  setPassword = () => {
    if (this.state.userName == "" || this.state.userName?.trim().length == 0) {
      alert(I18n.t('enter_user_name_alert'));
    }
    else if (this.state.userName?.trim().charAt(0) == '.') {
      alert(I18n.t('user_name_start'))
    }
    else if (this.state.userName?.trim().length < 3) {
      alert(I18n.t('enter_user_name_length_alert'))
    }
    else if (this.state.userName?.trim().charAt(this.state.userName?.trim().length - 1) == '.') {
      alert(I18n.t('user_name_end'))
    }
    else if (this.notDotTogeather(this.state.userName)) {
      alert(I18n.t('twoDots'))
    }

    else if (!this.containonlyDigit(this.state.userName)) {
      alert(I18n.t('onlyNumberAlert'))
    }
    else if (!this.validUserName(this.state.userName?.trim())) {
      alert(I18n.t('validUserName'));
    }
    else if (this.state.password?.trim().length == 0) {
      alert(I18n.t("enter_password_alert"))
    }
    else if (this.state.password?.trim().length < 6) {
      alert(I18n.t("enter_password_length_alert"))
    }
    else if (this.state.cpassword?.trim().length == 0) {
      alert(I18n.t("enter_confirm_password_alert"))
    }
    else if (this.state.cpassword != this.state.password) {
      alert(I18n.t("enter_password_not_match_alert"))
    }
    else {
      DataManager.getFavList().then((res) => {
        let listParse = JSON.parse(res)
      this.props.setPassword(this.state.userName, this.state.password,this.state.navigation?this.state.navigation: NavigationService.getFullRoute()?._navigation,this.state.userId,this.state.screen,listParse)
      console.log('this.props NavigationService',NavigationService);
      })
    }
  }


  updateRefs(id, input) {
    this.inputs[id] = input;
  }

  focusNextField(id) {
    if (id == "done") {
      Keyboard.dismiss();
    } else {
      this.inputs[id].focus();
    }
  }

  
  render() {
    return (
      //   <View style={{flex:1}} >
      <Modal onRequestClose={() => this.modalClose()} transparent={true} ref={this.props.ref} visible={this.state.visible}>
        <View style={{ backgroundColor: 'rgba(0,0,0,0.6)', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ shadowColor: 'gray', shadowOpacity: 1, shadowRadius: 8, alignItems: 'center', justifyContent: 'center', paddingVertical: 40, shadowOffset: { width: 1, height: 1 }, backgroundColor: '#E3F5FF', width: '90%', borderRadius: 50 }}>
            <TouchableOpacity onPress={() => this.modalClose()} style={{ position: 'absolute', right: -10, top: -10, alignItems: 'center', justifyContent: 'center', height: 50, width: 50, borderRadius: 25 }}>
              <Image style={{ height: 45, width: 45, borderRadius: 22.5 }} resizeMode='contain' source={require('../../Images/crossWithborder.png')}></Image>
            </TouchableOpacity>
            <Text style={{ textAlign: 'center', width: '85%', paddingHorizontal: 10, color: '#585353', fontFamily: fontFamily.bold,fontSize:20 }}>
              {'Set Password'}
              {/* It's time to Track current Wait Times!
              Setting up your profile allows you to post, see current wait times, share your detention time, and unlock other features that work for you */}
            </Text>
            {
              <>
               {/* <TextInput
                editable={false}
                onSubmitEditing={() => this.inputs2.focus()}
                ref={input => this.inputs1 = input}
                value={this.state.userName}
                returnKeyType={"next"}
                maxLength={20}
                autoCapitalize={"none"}
                keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'}
                onChangeText={(t) => {
                  var temp = t.toLowerCase()
                  let name = this.removeEmojis(temp, true)
                  console.log('namememememe', name);
                  this.setState({ userName: name ? name : '' })
                }}
                placeholder={'Username'} style={{color:'lightgray', marginTop: 30, paddingVertical: 15, paddingHorizontal: 10, backgroundColor: '#FFFFFF', borderRadius: 30, width: '85%' }} /> */}
            
                  <TextInput
                  value={this.state.password}
                    returnKeyType='next'
                    onSubmitEditing={() => this.inputs3.focus()}
                    ref={input => this.inputs2 = input}
                    secureTextEntry
                    onChangeText={(t) => {
                      let p=this.removeEmojis(t, true)
                      this.setState({ password: p })
                    }}
                    placeholder={'Password'} style={{ marginTop: 15, paddingVertical: 15, paddingHorizontal: 10, backgroundColor: '#FFFFFF', borderRadius: 30, width: '85%' }} />
                   <TextInput
                  value={this.state.cpassword}
                    returnKeyType='done'
                    onSubmitEditing={() => Keyboard.dismiss()}
                    ref={input => this.inputs3 = input}
                    secureTextEntry
                    onChangeText={(t) => {
                      let p=this.removeEmojis(t, true)
                      this.setState({ cpassword: p })}}
                    placeholder={'Confirm Password'} 
                    style={{ marginTop: 15, paddingVertical: 15, paddingHorizontal: 10, backgroundColor: '#FFFFFF', borderRadius: 30, width: '85%' }} 
                    />
              

                <TouchableOpacity
                  onPress={() => { this.setPassword() }}
                  style={{ alignSelf: 'center', alignItems: 'center', justifyContent: 'center',marginBottom:4, width: '85%', paddingVertical: 15, marginTop: 30, borderRadius: 30, justifyContent: 'center', backgroundColor: '#28A2E1' }}>
                  <Text
                    style={{ fontSize: 16, fontFamily: fontFamily.bold, color: 'white' }}
                  >{I18n.t('Submit')}</Text>

                </TouchableOpacity>
               
                </>
              
 }
          </View>
        </View>

      </Modal>
      //   </View>
    );
  }
}

