import React, { Component } from 'react';
import { View, Text, Modal, Dimensions, TouchableOpacity } from 'react-native';
import WebView from 'react-native-webview';
import { CachedImage } from '../../Components/react-native-cached-image-master'

const HIT_SLOP = { top: 16, left: 16, bottom: 16, right: 16 };

export default class fullWeb extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <Modal
        transparent={true}
        visible={this.props.visible}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity style={{
            position: 'absolute', top: '10%', right: 10,
            marginRight: 8,
            marginTop: 8,
            width: 45,
            height: 45,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 22.5,
            backgroundColor: "gray",
          }} onPress={() => this.props.close()} hitSlop={HIT_SLOP}>
            <Text style={{
              lineHeight: 25,
              fontSize: 25,
              paddingTop: 2,
              textAlign: "center",
              color: "#FFF",
              includeFontPadding: false,
            }}>✕</Text>
          </TouchableOpacity>
          <View style={{ height: Dimensions.get('screen').height * 0.25, width: '100%', backgroundColor: 'rgba(0,0,0,0.7)', }}>
            {this.props.isImage ?
              <CachedImage
                source={{ uri: this.props.uri }}
                style={{ height: '100%', width: '100%' }}
              />
              :
              <WebView
                style={{ aspectRatio: 1.87 }}
                onLoadStart={() => { this.setState({ load: true }) }}
                onLoad={() => this.setState({ load: false })}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                containerStyle={{ height: "100%", width: '100%', }}
                source={{ uri: this.props.uri, }}
              />}
          </View>
        </View>
      </Modal>
    );
  }
}