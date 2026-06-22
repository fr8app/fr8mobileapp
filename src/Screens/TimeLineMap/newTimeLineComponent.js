import React, { Component } from "react";
import { View, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Header,
} from "./../../Components";
import { AppImages } from "./../../Themes";
import moment from "moment";
import Timer from "../../Components/Timer";
import MapComponentCopy from "./mapComponentCopy";
import I18n from "react-native-i18n";

class NewTimelineComponent extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <Header
          headerTitle={I18n.t("Timeline")}
          leftImageSource={AppImages.images.back}
          leftbackbtnPress={() => navigation.goBack()}
        />
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      startTime: "",
      avgStartTime: "",
      makeRoute: false,
    };
    this.timerRef = null;
    this.mapRef = null;
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  _handleAppStateChange = (nextAppState) => {
    if (nextAppState === "active") {
      this.forceUpdate();
    }
  };

  //set timer interval
  callInterval = () => {
    this.timerInterval = null;
    this.timerInterval = setInterval(async () => {
      if (this.timerRef) {
        this.timerRef.add();
      }
    }, 1000);
  };

  startTrack = async (terminalId, latitude, longitude) => {
    var avaliableArray = [];
    await AsyncStorage.getItem("oneMinCordArray")
      .then((res) => {
        console.log('oneMinCordArray', res);
        avaliableArray = res ? JSON.parse(res) : [];
      })
      .catch((error) => console.log("error in sort function ---->", error));
    console.log("start track called");
    this.callInterval();
    this.setState({ startTime: moment().utc(), avgStartTime: moment().utc() });
    let time = this.timerRef.getTotalTime();
    var a = time.split(":"); // split it at the colons
    var seconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
    let endTime = moment().utc().toISOString();
    let distance = parseInt(this.mapRef.state.distance);
    var latestCord = [
      {
        latitude: latitude,
        longitude: longitude,
        timeStamp: Platform.OS == 'ios' ? moment().unix() : moment.utc().toISOString()
      },
    ];
    console.log('avaliableArray', avaliableArray, 'latestCord', ...latestCord)

    let dataObject = {
      cordinates: [...avaliableArray, ...latestCord],
      seconds: seconds,
      startTime: this.state.startTime,
      endTime: endTime,
      distance: distance,
      terminalId: terminalId,
      avgStartTime: this.state.avgStartTime,
    };
    AsyncStorage.getItem("timeLineArray").then((res) => {
      let parseData = JSON.parse(res);
      console.log("parse data", parseData);
      if (parseData == null || parseData.length == 0) {
        AsyncStorage.setItem("timeLineArray", JSON.stringify([dataObject]));
      } else {
        console.log("parse data else", parseData);
        parseData.map((x) => {
          if (x.terminalId !== terminalId) {
            let arrayData = [...parseData];
            arrayData.push(dataObject);
            AsyncStorage.removeItem("timeLineArray").then(() => {
              AsyncStorage.setItem(
                "timeLineArray",
                JSON.stringify(arrayData)
              ).then(() => {
                AsyncStorage.getItem("timeLineArray").then((res) => {
                });
              });
            });
          }
          this.mapRef.setState({ start: true });
          this.setState({ makeRoute: true });
        });
      }
    });
    this.mapRef.setState({ start: true });
    this.setState({ makeRoute: true });
  };

  pauseTrack() {
    clearInterval(this.timerInterval);
    this.timerInterval = null;
  }

  stopTrack(terminalId, averageWaitTime, latitude, longitude) {
    let checkDiff = moment.duration(
      moment(new Date()).diff(this.state.avgStartTime)
    );

    let time = this.timerRef.getTotalTime();
    var a = time.split(":"); // split it at the colons
    var differenceinas;
    let allObject = AsyncStorage.getItem("timeLineArray").then((res) => {
      let JsonArrayRes = JSON.parse(res);
      let obj = JsonArrayRes.map((ttt, index) => {
        if (terminalId == ttt.terminalId) {
          let cordinates = ttt.cordinates;

          differenceinas = moment.duration(moment().utc().diff(ttt.startTime));
          let seconds = Math.floor(differenceinas.asSeconds());
          let endTime = moment().utc();
          let distance = parseInt(this.mapRef.state.distance);
          let dataObject = {
            cordinates: cordinates,
            seconds: seconds,
            startTime: ttt.startTime,
            endTime: endTime,
            distance: distance,
            terminalId: terminalId,
            avgStartTime: this.state.avgStartTime,
          };
          this.mapRef.setState({
            start: false,
            distance: Number(0),
            coordinates: [],
          });
          this.timerRef.setState({ timer: "00:00:00" });
          let arrayAvaliable = [...JsonArrayRes];
          arrayAvaliable.splice(index, 1);
          AsyncStorage.removeItem("timeLineArray");
          AsyncStorage.setItem("timeLineArray", JSON.stringify(arrayAvaliable));
          this.timerRef.seconds = 0;
          this.setState({ makeRoute: false });
          return dataObject;
        }
      });
      this.setState({ makeRoute: false });
      return obj;
    });
    return allObject;
  }

  render() {
    return (
      <>
        <MapComponentCopy
          ref={(refs) => (this.mapRef = refs)}
          makeRoute={this.state.makeRoute}
        />
        <View
          style={{
            position: "absolute",
            top: 10,
            alignSelf: "center",
            display: "none",
          }}
        >
          <Timer
            costumStyle={{ display: "none" }}
            ref={(refs) => (this.timerRef = refs)}
          />
        </View>

        {/* Btns Component  */}
        <View
          style={{
            position: "absolute",
            bottom: 30,
            alignSelf: "center",
            display: "none",
          }}
        ></View>
      </>
    );
  }
}

export default NewTimelineComponent;


