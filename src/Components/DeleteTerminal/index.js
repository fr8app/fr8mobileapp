import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Modal,
    Text,
    TouchableOpacity,
    Image,
} from 'react-native';
import { Dimensions, AppColor, AppFontFamily } from './../../Themes';
import I18n from 'react-native-i18n'
const DeleteTerminal = props => {
    const {
        visible,
        cancelButton,
        DeleteButton,
    } = props;

    return (
        <Modal
            transparent={true}
            animationType={'none'}
            visible={visible}
            onRequestClose={() => { console.log('close modal') }}>
            <View style={styles.modalBackground}>
                <View style={styles.container}>
                    <View style={{ height: 30, width: 30, marginTop: 25 }}>
                        <Image source={require("../../Images/Danger.png")} resizeMode={"contain"} style={{ height: "100%", width: "100%" }}></Image>
                    </View>
                    <View style={{ minHeight: 8 }} />
                    <View>
                        <Text style={styles.text}>Are you sure you want to delete ?</Text>
                    </View>
                    <View style={{ minHeight: 15 }} />
                    <View style={styles.lineView2} />
                    <View style={styles.bottomButtonView}>
                        <TouchableOpacity style={styles.cancelButton} onPress={DeleteButton}>
                            <Text style={[styles.languageSeleceted, { color: "rgba(0, 91, 131, 1)" }]}>{I18n.t('Delete')}</Text>
                        </TouchableOpacity>
                        <View style={styles.lineView2} />
                        <TouchableOpacity style={styles.cancelButton} onPress={cancelButton}>
                            <Text style={styles.languageSeleceted}>{I18n.t('Cancel')}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ minHeight: 7 }} />
                </View>
            </View>
        </Modal>
    )
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
        backgroundColor: "#fff",
        alignItems: 'center',
        borderRadius: 26
    },
    text: {
        color: "#000",
        fontWeight: "600",
        fontSize: 15,
        lineHeight: 23
    },
    lineView: {
        backgroundColor: "rgba(225, 225, 225, 1)",
        height: 1,
        width: Dimensions.deviceWidth - 60,
    },
    lineView2: {
        backgroundColor: "rgba(225, 225, 225, 1)",
        width: Dimensions.deviceWidth - 60,
        height: 1
    },
    languageText: {
        // marginTop: 35,
        color: AppColor.colors.white,
        fontSize: 18,
        fontFamily: AppFontFamily.fontFamily.semiBold,
        // fontWeight:"400"
    },
    languageButton: {
        marginTop: 20,
        flexDirection: 'row',
        alignSelf: "center",
        alignItems: 'center',
    },
    radioIcon: {
        width: 30,
        height: 30,
        marginRight: 10
    },
    languageSeleceted: {
        color: "#000",
        fontSize: 16,
        fontFamily: AppFontFamily.fontFamily.regular,
        fontWeight: "600"
    },
    bottomButtonView: {
        justifyContent: 'center',
        // marginVertical: 30,
        alignItems: "center"
    },
    cancelButton: {
        borderRadius: 2,
        borderWidth: 1,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 5,
        paddingBottom: 5,
        borderColor: AppColor.colors.white,
        marginVertical: 5
    },
    textInputContainer: {
        marginTop: 40,
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 14,
        paddingBottom: 14,
        height: 120,
        fontFamily: AppFontFamily.fontFamily.regular,
        color: AppColor.colors.white,
        fontSize: 16,
        width: Dimensions.deviceWidth - 100,
        borderColor: AppColor.colors.white,
        borderRadius: 5,
        borderWidth: 1,
        textAlignVertical: "top"

    }
});

module.exports = DeleteTerminal