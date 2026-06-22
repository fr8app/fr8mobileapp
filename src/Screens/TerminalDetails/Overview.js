import React, { Component } from 'react';
import { View, Text, Image, Dimensions, TouchableOpacity, Platform, ImageBackground } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    BarChart,
} from "react-native-chart-kit";
import I18n from 'react-native-i18n'
import moment from 'moment';
import { getTerminalWaitingTimeShowWithFormatGraph } from '../../Components/getTerminalWaitingTime';
const stackData = {
    labels: ["Test1", "Test2"],
    legend: ["L1", "L2", "L3"],
    data: [
        [60, 60, 60],
        [30, 30, 60]
    ],
    barColors: ["#dfe4ea", "#ced6e0", "#a4b0be"]
};
class Overview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            x: 0,
            y: 0,
            value: '',
            i: 0,
            arrowClick: false,
            data: {
                labels: ["10a", "11a", "12p", "1p", "2p", "3p", "4p", "5p", "6p"],
                datasets: [
                    {
                        data: [80, 60, 100, 90, 60, 75, 100, 78, 60],
                    }
                ]
            }
        };
    }

    createData = (key, data) => {

        let filteredKey = key ? key.split('m').join('') : '9p'

        let dataArr = [
            {
                name: '12a',
                uv: data?.avg_graph ? data?.avg_graph[1] : 0
            },
            {
                name: '1a',
                uv: data?.avg_graph ? data?.avg_graph[2] : 0
            },
            {
                name: '2a',
                uv: data?.avg_graph ? data?.avg_graph[3] : 0
            },
            {
                name: '3a',
                uv: data?.avg_graph ? data?.avg_graph[4] : 0
            },
            {
                name: '4a',
                uv: data?.avg_graph ? data?.avg_graph[5] : 0
            },
            {
                name: '5a',
                uv: data?.avg_graph ? data?.avg_graph[6] : 0
            },
            {
                name: '6a',
                uv: data?.avg_graph ? data?.avg_graph[7] : 0
            },
            {
                name: '7a',
                uv: data?.avg_graph ? data?.avg_graph[8] : 0
            },
            {
                name: '8a',
                uv: data?.avg_graph ? data?.avg_graph[9] : 0
            },
            {
                name: '9a',
                uv: data?.avg_graph ? data?.avg_graph[10] : 0
            },
            {
                name: '10a',
                uv: data?.avg_graph ? data?.avg_graph[11] : 0
            },
            {
                name: '11a',
                uv: data?.avg_graph ? data?.avg_graph[12] : 0
            },
            {
                name: '12p',
                uv: data?.avg_graph ? data?.avg_graph[13] : 0
            },
            {
                name: '1p',
                uv: data?.avg_graph ? data?.avg_graph[14] : 0
            },
            {
                name: '2p',
                uv: data?.avg_graph ? data?.avg_graph[15] : 0
            },
            {
                name: '3p',
                uv: data?.avg_graph ? data?.avg_graph[16] : 0
            },
            {
                name: '4p',
                uv: data?.avg_graph ? data?.avg_graph[17] : 0
            },
            {
                name: '5p',
                uv: data?.avg_graph ? data?.avg_graph[18] : 0
            },
            {
                name: '6p',
                uv: data?.avg_graph ? data?.avg_graph[19] : 0
            },
            {
                name: '7p',
                uv: data?.avg_graph ? data?.avg_graph[20] : 0
            },
            {
                name: '8p',
                uv: data?.avg_graph ? data?.avg_graph[21] : 0
            },
            {
                name: '9p',
                uv: data?.avg_graph ? data?.avg_graph[22] : 0
            },
            {
                name: '10p',
                uv: data?.avg_graph ? data?.avg_graph[23] : 0
            },
            {
                name: '11p',
                uv: data?.avg_graph ? data?.avg_graph[24] : 0
            }
        ]
        let result = dataArr.find(element => element.name === filteredKey);

        return result

    }

    chartContainer = (data) => {
        let { x, y } = this.state
        let dataArray = {
            labels: [],
            datasets: [
                {
                    data: [],
                    colors: [],
                    strokeWidth: 2 // optional

                }
            ]

        }
        let startTime = moment().utc()?.subtract(1, 'hour').format("ha")
        let replaceKey = moment().utc().subtract(data?.timezone?.offset, 'minutes')?.format('ha')
        console.log('replaceKeyreplaceKey', replaceKey, 'ss', startTime);
        if (startTime) {
            for (let i = 0; i < 8; i++) {
                if (i == 0) {
                    let tempData = this.createData(startTime, data)

                    replaceKey = replaceKey ? replaceKey.split('m').join('') : '9p'
                    tempData['name'] = replaceKey
                    dataArray.labels.push(tempData.name)
                    dataArray.datasets[0].data.push(Math.round(tempData.uv))

                    dataArray.datasets[0].colors.push((opacity = 1) => "#c5c5c5")
                } else {
                    startTime = moment(startTime, 'hh:mm A').add(1, 'hour').format("ha")
                    replaceKey = moment(replaceKey, 'hh:mm A').add(1, 'hour').format('ha')
                    let tempData = this.createData(startTime, data)
                    replaceKey = replaceKey ? replaceKey.split('m').join('') : '9p'
                    tempData['name'] = replaceKey
                    dataArray.labels.push(tempData.name)
                    dataArray.datasets[0].data.push(Math.round(tempData.uv))
                    dataArray.datasets[0].colors.push((opacity = 1) => "#1971a3")
                }
            }
        }

        return (

            <View style={{}}>
                <View style={{ borderWidth: 0.7, borderColor: 'silver', position: 'absolute', top: '91.1%', zIndex: 999999999, width: '100%' }} />
                <BarChart
                    fromZero
                    withHorizontalLabels={false}
                    showBarTops={false}
                    style={{
                        paddingHorizontal: 0,
                        paddingTop: 30
                    }}
                    data={dataArray}
                    width={Dimensions.get('screen').width * 0.98}
                    height={200}
                    withInnerLines={false}
                    flatColor={true}
                    withCustomBarColorFromData={true}
                    xLabelsOffset={-6}
                    segments={1}
                    barPress={(e, data, i, x, y) => {
                        console.log(e.nativeEvent, data, i);
                        this.setState({ value: data, x: x, y: y, i: i })
                        clearTimeout(this.timeOut)
                        this.timeOut = setTimeout(() => {
                            this.setState({ value: '' })
                        }, 5000);
                    }}

                    chartConfig={{
                        formatTopBarValue: (e) => {
                            return getTerminalWaitingTimeShowWithFormatGraph({ default_avg_wait_time: e })
                        },
                        decimalPlaces: 10,
                        barRadius: 5,
                        barPercentage: 0.8,
                        fillShadowGradientToOpacity: 1,
                        fillShadowGradient: `#29a2e1`,
                        fillShadowGradientOpacity: 2,
                        paddingRight: 0,
                        linejoinType: 'miter',
                        backgroundColor: "#fff",
                        backgroundGradientFrom: "#fff",
                        backgroundGradientTo: "#fff",
                        color: (opacity = 1000, index) => `#29a2e1`,
                        labelColor: (opacity = 10) => `#000`,
                        style: {
                            borderRadius: 16,
                        },
                    }}
                />
                {this.state.value ? <View style={{ position: 'absolute', top: y, height: '100%', left: this.state.i == 7 ? x - 13 : this.state.i == 0 ? x - 13 : x - 13, width: 33 }}>
                    <ImageBackground
                        borderRadius={10}
                        resizeMode='cover' style={{ width: 70, height: 50, borderRadius: 5, alignItems: 'center', justifyContent: 'center' }} source={require('../../Images/box2.png')}>

                        <Text style={{ width: 90, textAlign: 'center' }}>
                            {getTerminalWaitingTimeShowWithFormatGraph({ default_avg_wait_time: this.state.value })}
                        </Text>
                    </ImageBackground>
                </View> : null}
            </View>
        )
    }

    renderItem = ({ item, index }) => {
        return (
            <View style={{ flex: 1 }}>
            </View>
        )
    }
    render() {
        let { x, y } = this.state
        return (
            <View style={{ flex: 1 }}>
                {this.props?.data?.open_time ?
                    <>
                        <View style={{ borderBottomWidth: 1, borderColor: 'silver', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10, flexDirection: 'row' }}>
                            <Image
                                resizeMode='contain'
                                style={{ height: 20, width: 20 }}
                                source={require('../../Images/circleImages/time.png')} />
                            <Text style={{ marginLeft: 8, color: 'gray' }}>Open time:</Text>
                            <Text> {" " +
                                moment(moment(new Date()).format('YYYY-MM-DDT') + this.props?.data?.open_time?.split('T')[1]).format("hh:mma")
                            }</Text>
                            <Text>{" | "}</Text>
                            <Text style={{ color: 'gray' }}>close time:</Text>
                            <Text> {" " + moment(moment(new Date()).format('YYYY-MM-DDT') + this.props?.data?.close_time?.split('T')[1]).format("hh:mma")}</Text>
                            {this.props?.data?.extraTime?.length > 0 && <TouchableOpacity style={{ paddingVertical: 4 }} activeOpacity={1} onPress={() => this.setState({ arrowClick: !this.state.arrowClick })}>
                                <Image
                                    resizeMode='contain'
                                    style={{ height: 10, width: 10, marginTop: Platform.OS == 'ios' ? 5 : 6, marginLeft: 8, transform: [{ rotate: this.state.arrowClick ? '180deg' : '0deg' }] }}
                                    source={require('../../Images/circleImages/downArrow.png')} />
                            </TouchableOpacity>}
                        </View>
                        {this.state.arrowClick &&
                            this.props?.data?.extraTime?.map((x) => {
                                return (
                                    <>
                                        <View style={{ borderBottomWidth: 1, borderColor: 'silver', paddingHorizontal: 15, paddingVertical: 10 }}>
                                            <Text style={{}}>{x.reason}</Text>
                                            <View style={{ alignItems: 'center', marginTop: 5, flexDirection: 'row' }}>
                                                <Image
                                                    resizeMode='contain'
                                                    style={{ height: 20, width: 20 }}
                                                    source={require('../../Images/circleImages/time.png')} />
                                                <Text style={{ marginLeft: 8, color: 'gray' }}>Open time:</Text>
                                                <Text> {" " +
                                                    moment(moment(new Date()).format('YYYY-MM-DDT') + x.openTime.split('T')[1]).format("hh:mma")
                                                }</Text>
                                                <Text>{" | "}</Text>
                                                <Text style={{ color: 'gray' }}>close time:</Text>
                                                <Text> {" " + moment(moment(new Date()).format('YYYY-MM-DDT') + x.closeTime.split('T')[1]).format("hh:mma")}</Text>
                                            </View>
                                        </View>
                                    </>
                                )
                            })
                        }
                    </>
                    :
                    <View style={{ borderBottomWidth: 1, borderColor: 'silver', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10, flexDirection: 'row' }}>
                        <Image
                            resizeMode='contain'
                            style={{ height: 20, width: 20 }}
                            source={require('../../Images/circleImages/time.png')} />
                        <Text style={{ marginLeft: 8, color: 'gray' }}>{I18n.t('avaliable24Hours')}</Text>

                    </View>
                }
                {
                    this.chartContainer(this.props.data)
                }
            </View>
        );
    }
}
function mapStateToProps(state) {
    return {
        homeState: state.HomeState,
        terminalDetailState: state.TerminalDetailState,
        videoUploadState: state.VideoUploadState,
        likeDislikeState: state.LikeDislikeState,
        followUnfollowTerminalState: state.FollowUnfollowTerminalState,
        videoPlayState: state.VideoPlayState
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Overview);
