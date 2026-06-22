
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { Dimensions, AppColor, AppFontFamily } from './../../Themes';
import DataManager from './../DataManager';
import I18n from 'react-native-i18n';

export default class EmptyComponentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLangugage: 'en'
    }
    this.setLangugae()
  }
  setLangugae() {
    DataManager.getAppLanguage().then((response) => {
      if (response) {
        let lang = JSON.parse(response)
        if (lang.includes('es')) {
          this.setState({ selectedLangugage: 'es' })
        }
        else if (lang.includes('pt')) {
          this.setState({ selectedLangugage: 'pt' })
        }
        else if (lang.includes('it')) {
          this.setState({ selectedLangugage: 'it' })
        }
        else if (lang.includes('zh')) {
          this.setState({ selectedLangugage: 'zh' })
        }
        else if (lang.includes('hi')) {
          this.setState({ selectedLangugage: 'hi' })
        }
        else if (lang.includes('ph')) {
          this.setState({ selectedLangugage: 'ph' })
        }
        else if (lang.includes('vi')) {
          this.setState({ selectedLangugage: 'vi' })
        }
        else if (lang.includes('fr')) {
          this.setState({ selectedLangugage: 'fr' })
        }
        else if (lang.includes('ko')) {
          this.setState({ selectedLangugage: 'ko' })
        }
        else if (lang.includes('ru')) {
          this.setState({ selectedLangugage: 'ru' })
        }
        else if (lang.includes('bn')) {
          this.setState({ selectedLangugage: 'bn' })
        }
        else if (lang.includes('de')) {
          this.setState({ selectedLangugage: 'de' })
        }
        else {
          this.setState({ selectedLangugage: 'en' })
        }
      }
      else {
        this.setState({ selectedLangugage: 'en' })
        //  I18n.currentLocale()

      }
    })
  }
  englishPress = () => {
    this.setState({ selectedLangugage: 'en' })
    this.props.englishPress(true)

  }

  spanishPress = () => {
    this.setState({ selectedLangugage: 'es' })
    this.props.spanishPress(false)
  }

  portugusePress = () => {
    this.setState({ selectedLangugage: 'pt' })
    this.props.portugusePress(false)
  }
  radioPress = (value) => {

    this.setState({ selectedLangugage: value })
    this.props.newLanguagePress(value)

  }

  render() {
    const {
      loading,
      anyTap,
      caneclButton,
      submitButton,
    } = this.props;


    return (
      <Modal
        transparent={true}
        animationType={'none'}
        visible={loading}
        onRequestClose={() => { }}>

        <TouchableOpacity disabled activeOpacity={1} style={styles.modalBackground} onPress={anyTap}>
          <TouchableOpacity disabled style={styles.container}>
            <Text style={styles.languageText}>{I18n.t("Change_Language")}</Text>

            <View style={styles.lineView} />
            <ScrollView showsVerticalScrollIndicator={false}>

              <TouchableOpacity activeOpacity={1} style={[styles.languageButton, { marginTop: 35 }]} onPress={this.englishPress}>
                <Image style={[styles.radioIcon, { marginLeft: 8 }]} resizeMode="contain" source={this.state.selectedLangugage == "en" ? require('./../../Images/radio_button.png') : require('./../../Images/radio_button1.png')} />
                <Text style={styles.languageSeleceted}>{I18n.t("English")}</Text>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={1} style={styles.languageButton} onPress={this.spanishPress}>
                <Image style={[styles.radioIcon, { marginLeft: 8 }]} resizeMode="contain" source={this.state.selectedLangugage == "es" ? require('./../../Images/radio_button.png') : require('./../../Images/radio_button1.png')} />
                <Text style={styles.languageSeleceted}>{I18n.t("Spanish")}</Text>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={1} style={[styles.languageButton, {}]} onPress={this.portugusePress}>
                <Image style={[styles.radioIcon, { marginLeft: 8 }]} resizeMode="contain" source={this.state.selectedLangugage == "pt" ? require('./../../Images/radio_button.png') : require('./../../Images/radio_button1.png')} />
                <Text style={styles.languageSeleceted}>{I18n.t("Portuguese")}</Text>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={1} style={[styles.languageButton, {}]} onPress={() => this.radioPress('it')}>
                <Image style={[styles.radioIcon, { marginLeft: 8 }]} resizeMode="contain" source={this.state.selectedLangugage == "it" ? require('./../../Images/radio_button.png') : require('./../../Images/radio_button1.png')} />
                <Text style={styles.languageSeleceted}>{I18n.t("Italian")}</Text>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={1} style={[styles.languageButton, {}]} onPress={() => this.radioPress('zh')}>
                <Image style={[styles.radioIcon, { marginLeft: 8 }]} resizeMode="contain" source={this.state.selectedLangugage == "zh" ? require('./../../Images/radio_button.png') : require('./../../Images/radio_button1.png')} />
                <Text style={styles.languageSeleceted}>{I18n.t("Chinese")}</Text>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={1} style={[styles.languageButton, {}]} onPress={() => this.radioPress('hi')}>
                <Image style={[styles.radioIcon, { marginLeft: 8 }]} resizeMode="contain" source={this.state.selectedLangugage == "hi" ? require('./../../Images/radio_button.png') : require('./../../Images/radio_button1.png')} />
                <Text style={styles.languageSeleceted}>{I18n.t("Hindi")}</Text>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={1} style={[styles.languageButton, {}]} onPress={() => this.radioPress('ph')}>
                <Image style={[styles.radioIcon, { marginLeft: 8 }]} resizeMode="contain" source={this.state.selectedLangugage == "ph" ? require('./../../Images/radio_button.png') : require('./../../Images/radio_button1.png')} />
                <Text style={styles.languageSeleceted}>{I18n.t("Filipino")}</Text>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={1} style={[styles.languageButton, {}]} onPress={() => this.radioPress('vi')}>
                <Image style={[styles.radioIcon, { marginLeft: 8 }]} resizeMode="contain" source={this.state.selectedLangugage == "vi" ? require('./../../Images/radio_button.png') : require('./../../Images/radio_button1.png')} />
                <Text style={styles.languageSeleceted}>{I18n.t("Vietnamese")}</Text>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={1} style={[styles.languageButton, {}]} onPress={() => this.radioPress('fr')}>
                <Image style={[styles.radioIcon, { marginLeft: 8 }]} resizeMode="contain" source={this.state.selectedLangugage == "fr" ? require('./../../Images/radio_button.png') : require('./../../Images/radio_button1.png')} />
                <Text style={styles.languageSeleceted}>{I18n.t("French")}</Text>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={1} style={[styles.languageButton, {}]} onPress={() => this.radioPress('ko')}>
                <Image style={[styles.radioIcon, { marginLeft: 8 }]} resizeMode="contain" source={this.state.selectedLangugage == "ko" ? require('./../../Images/radio_button.png') : require('./../../Images/radio_button1.png')} />
                <Text style={styles.languageSeleceted}>{I18n.t("Korean")}</Text>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={1} style={[styles.languageButton, {}]} onPress={() => this.radioPress('ru')}>
                <Image style={[styles.radioIcon, { marginLeft: 8 }]} resizeMode="contain" source={this.state.selectedLangugage == "ru" ? require('./../../Images/radio_button.png') : require('./../../Images/radio_button1.png')} />
                <Text style={styles.languageSeleceted}>{I18n.t("Russian")}</Text>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={1} style={[styles.languageButton, {}]} onPress={() => this.radioPress('bn')}>
                <Image style={[styles.radioIcon, { marginLeft: 8 }]} resizeMode="contain" source={this.state.selectedLangugage == "bn" ? require('./../../Images/radio_button.png') : require('./../../Images/radio_button1.png')} />
                <Text style={styles.languageSeleceted}>{I18n.t("Bengali")}</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={1} style={[styles.languageButton, {}]} onPress={() => this.radioPress('de')}>
                <Image style={[styles.radioIcon, { marginLeft: 8 }]} resizeMode="contain" source={this.state.selectedLangugage == "de" ? require('./../../Images/radio_button.png') : require('./../../Images/radio_button1.png')} />
                <Text style={styles.languageSeleceted}>{I18n.t("German")}</Text>
              </TouchableOpacity>
            </ScrollView>
            <View style={styles.bottomButtonView}>
              <TouchableOpacity style={styles.cancelButton} onPress={caneclButton}>

                <Text style={styles.languageSeleceted}>{I18n.t("Cancel")}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelButton} onPress={submitButton}>

                <Text style={styles.languageSeleceted}>{I18n.t("Submit")}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>


        </TouchableOpacity>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: "rgba(0,0,0,0.7)"
  },
  container: {
    width: Dimensions.deviceWidth - 60,
    backgroundColor: AppColor.colors.darkBlue,
    // alignItems: 'center',
    height: '50%',
    // zIndex:99999,
    borderRadius: 5
  },
  lineView: {
    backgroundColor: AppColor.colors.white,
    height: 1,
    width: Dimensions.deviceWidth - 60,
    marginTop: 30,
  },
  languageText: {
    marginTop: 35,
    color: AppColor.colors.white,
    fontSize: 18,
    fontFamily: AppFontFamily.fontFamily.semiBold,
    alignSelf: 'center'
    // fontWeight:"400"
  },
  languageButton: {
    marginTop: 20,
    flexDirection: 'row',
    marginLeft: '10%',
    alignItems: 'center',

  },
  radioIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  languageSeleceted: {
    color: AppColor.colors.white,
    fontSize: 15,
    fontFamily: AppFontFamily.fontFamily.regular
  },
  bottomButtonView: {
    flexDirection: "row",
    width: Dimensions.deviceWidth - 130,
    justifyContent: 'space-between',
    marginTop: 50,
    marginBottom: 20,
    alignSelf: 'center'
  },
  cancelButton: {
    borderRadius: 2,
    borderWidth: 1,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 5,
    borderColor: AppColor.colors.white
  }
});

