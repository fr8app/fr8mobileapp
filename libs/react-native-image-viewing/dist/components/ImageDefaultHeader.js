/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React from "react";
import { SafeAreaView, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/dist/FontAwesome";

const HIT_SLOP = { top: 16, left: 16, bottom: 16, right: 16 };
const ImageDefaultHeader = ({ onRequestClose,openActionSheet }) => (<SafeAreaView style={[{flexDirection:'row',justifyContent:'space-between'}]}>
    <TouchableOpacity style={styles.closeButton} onPress={onRequestClose} hitSlop={HIT_SLOP}>
      <Text style={styles.closeText}>✕</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.closeButton2}  onPress={openActionSheet} hitSlop={HIT_SLOP}>
    <Icon name={"ellipsis-v"} size={20} color="#ffff" />

    </TouchableOpacity>
  </SafeAreaView>);
const styles = StyleSheet.create({
    root: {
        alignItems: "flex-end",
    },
    closeButton: {
        marginLeft:4,
        marginRight: 8,
        marginTop: 8,
        width: 45,
        height: 45,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 22.5,
        backgroundColor: "#00000077",
    },
    closeButton2: {
        marginRight: 1,
        marginTop: 8,
        width: 45,
        height: 45,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 22.5,
    },
    closeText: {
        lineHeight: 25,
        fontSize: 25,
        paddingTop: 2,
        textAlign: "center",
        color: "#FFF",
        includeFontPadding: false,
    },
});
export default ImageDefaultHeader;
