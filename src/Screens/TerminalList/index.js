import React, { Component } from "react";
import {
  SafeAreaView,
  View,
  FlatList
} from "react-native";
import styles from "./style";
import { Header, LiveStreamRender, Loader } from "./../../Components";
import { AppImages } from "./../../Themes";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { homeAction, onReachEndTerminal } from '../../Redux/actions/Home'
import geolocation from '@react-native-community/geolocation';
import { imageBaseUrl } from '../../Config'
import I18n from 'react-native-i18n'
class TerminalList extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <Header
          headerTitle={I18n.t('Terminal')}
          leftImageSource={AppImages.images.back}
          leftbackbtnPress={() => navigation.goBack()}
        />
      )
    };
  };
  constructor(porps) {
    super(porps);
    this.state = {
      indexing: 1,
      back: false,
      data: [],
      latitude: 0,
      longitude: 0
    };
  }
  componentDidMount() {
    this.getLatLong()
  }

  getLatLong() {
    geolocation.watchPosition((position) => {
    });
    geolocation.getCurrentPosition(
      position => {
        let region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.012,
          longitudeDelta: 0.012
        };

        if (this.mapRef) {
          this.mapRef.animateToRegion(region, 2000);
        }
        this.setState({ latitude: region.latitude, longitude: region.longitude })
        this.props.homeAction(
          region.latitude,
          region.longitude,
          this.props.navigation
        );
      },
      error => {
        let region = {
          latitude: 40.741231,
          longitude: -74.101984,
          latitudeDelta: 28.857763630813984,
          longitudeDelta: 109.58674516528845
        };
        this.setState({ latitude: region.latitude, longitude: region.longitude })
        this.props.homeAction(
          region.latitude,
          region.longitude,
          this.props.navigation
        );
        if (this.mapRef) {
          this.mapRef.animateToRegion(region, 2000);
        }
      }
    );
  }

  getTime = (n) => {
    var num = n;
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return rhours == 0 ? rminutes + I18n.t('mins') : rminutes == 0 ? rhours + " hrs " : rhours + " hrs " + rminutes + I18n.t('mins');
  }

  _renderItem = ({ item, index }) => {
    if (index < 5) {
      return (
        <LiveStreamRender
          terminal={item.terminal_name}
          EstimatedTime={Math.floor(item.avg_total_stopage_time_in_minutes) > 60 ? Math.floor(item.avg_total_stopage_time_in_minutes / 60) + ' ' + I18n.t('hrs') + ' ' + Math.floor(item.avg_total_stopage_time_in_minutes % 60) + ' ' + I18n.t('mins') : Math.floor(item.avg_total_stopage_time_in_minutes) + ' ' + I18n.t('mins')}
          onPress={() => this.props.navigation.navigate('TimeLineMap', { terminalId: item.id })}
          postSource={
            { uri: item.terminal_logo ? imageBaseUrl + item.terminal_logo : '' }
          }
          dis={Math.floor(item.distance)}
          minute={Math.floor(item.avg_total_stopage_time_in_minutes) > 60 ? Math.floor(item.avg_total_stopage_time_in_minutes / 60) + ' hrs ' + Math.floor(item.avg_total_stopage_time_in_minutes % 60) + I18n.t('mins') : Math.floor(item.avg_total_stopage_time_in_minutes) + I18n.t('mins')}
        />
      )
    }
  };

  onReachEndfunc = () => {
    if (this.props.homeState.paginationData.nextPageurl) {
      this.props.onReachEndTerminal({ lat: this.state.latitude, long: this.state.longitude, url: this.props.homeState.paginationData.nextPageurl })
    } else {
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <Loader loading={this.props.homeState.onLoad} />
        <View style={{ flex: 1, backgroundColor: this.state.back == true ? 'black' : 'transparent' }}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            scrollToOverflowEnabled={true}
            bounces={false}
            contentContainerStyle={{
              marginHorizontal: 10,
            }}
            data={this.props.homeState.result}
            extraData={this.props}
            renderItem={this._renderItem}
            keyExtractor={(item, index) => index.toString()}
          >
          </FlatList>
        </View>
      </SafeAreaView>
    );
  }
}
function mapStateToProps(state) {
  return {
    homeState: state.HomeState,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    homeAction,
    onReachEndTerminal
  }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TerminalList);

