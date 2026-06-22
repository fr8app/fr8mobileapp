
import { terminalName } from './terminalNameWithDefaultTime'
import moment from 'moment';
import I18n from 'react-native-i18n';

const getTimeFromStaticArray = (terminalData) => {
    var waitingTime = parseInt(terminalData?.avg_total_stopage_time_in_minutes)
    for (let i in terminalName) {
        if (terminalName[i].category === terminalData?.terminal_category) {
            waitingTime = terminalName[i]?.waitTime
        }
    }
    return waitingTime
}

export function getTerminalWaitingTime(terminalData) {

    return Math.ceil(terminalData?.avg_total_stopage_time_in_minutes).toString()
}


const createData = (key, data) => {

    let filteredKey = key ? key.split('m').join('') : '9p'
    console.log("::::::::::::data?.avg_graph[8]", data?.avg_graph[8], data?.avg_graph[7])
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

const getActualCurrentHour = (data) => {
    let startTime = moment().add(1, "hour").utc().format("H")
    let manual_graph = false
    return manual_graph = data?.manual_graph[startTime].isManual
}

export function getTerminalWaitingTimeShowWithFormat(terminalData, screen) {
    console.log(terminalData, "terminalData");
    if (terminalData.updateManually && getActualCurrentHour(terminalData)) {
        let courntHour = moment().utc().format("ha")

        let filteredKey = createData(courntHour, terminalData)
        console.log("this is time = ", filteredKey)

        return (Math.ceil(filteredKey.uv) > 60
            ? parseInt(filteredKey.uv / 60) +
            " " +
            [parseInt(filteredKey.uv / 60) > 1 ? 'h ' : 'h' +
                " "] +
            [Math.ceil(filteredKey.uv % 60) > 0 ? Math.ceil(filteredKey.uv % 60) +
                " " +
                [parseInt(filteredKey.uv / 60) > 1 ? 'm' : 'm' +
                    " "] : '']
            : Math.ceil(filteredKey.uv) +
            " " +
            [Math.ceil(filteredKey.uv) > 1 ? I18n.t("mins") : "min"]
        )
    }
    else {
        console.log('else');
        return (Math.ceil(terminalData?.avg_total_stopage_time_in_minutes) > 60
            ? parseInt(terminalData?.avg_total_stopage_time_in_minutes / 60) +
            " " +
            [parseInt(terminalData?.avg_total_stopage_time_in_minutes / 60) > 1 ? 'h ' : 'h' +
                " "] +
            [Math.ceil(terminalData?.avg_total_stopage_time_in_minutes % 60) > 0 ? Math.ceil(terminalData?.avg_total_stopage_time_in_minutes % 60) +
                " " +
                [parseInt(terminalData?.avg_total_stopage_time_in_minutes / 60) > 1 ? 'm' : 'm' +
                    " "] : '']
            : Math.ceil(terminalData?.avg_total_stopage_time_in_minutes) +
            " " +
            [Math.ceil(terminalData?.avg_total_stopage_time_in_minutes) > 1 ? I18n.t("mins") : "min"]
        )
    }


}
export function getTerminalWaitingTimeNew(terminalData) {
    return Math.ceil(terminalData?.default_avg_wait_time).toString()
}
export function getTerminalWaitingTimeShowWithFormatNew(terminalData) {

    return (Math.ceil(terminalData?.default_avg_wait_time) > 60
        ? parseInt(terminalData?.default_avg_wait_time / 60) +
        " " +
        [parseInt(terminalData?.default_avg_wait_time / 60) > 1 ? 'h ' : 'h' +
            " "] +
        [Math.ceil(terminalData?.default_avg_wait_time % 60) > 0 ? Math.ceil(terminalData?.default_avg_wait_time % 60) +
            " " +
            [parseInt(terminalData?.default_avg_wait_time / 60) > 1 ? 'm' : 'm' +
                " "] : '']
        : Math.ceil(terminalData?.default_avg_wait_time) +
        " " +
        [Math.ceil(terminalData?.default_avg_wait_time) > 1 ? I18n.t("mins").toUpperCase() : I18n.t("MIN")]
    )
}
export function getTerminalWaitingTimeShowWithFormatGraph(terminalData) {

    return (Math.ceil(terminalData?.default_avg_wait_time) > 60
        ? parseInt(terminalData?.default_avg_wait_time / 60) +
        " " +
        [parseInt(terminalData?.default_avg_wait_time / 60) > 1 ? 'h ' : 'h' +
            " "] +
        [Math.ceil(terminalData?.default_avg_wait_time % 60) > 0 ? Math.ceil(terminalData?.default_avg_wait_time % 60) +
            " " +
            [parseInt(terminalData?.default_avg_wait_time / 60) > 1 ? 'm' : 'm' +
                " "] : '']
        : Math.ceil(terminalData?.default_avg_wait_time) +
        " " +
        [Math.ceil(terminalData?.default_avg_wait_time) > 1 ? 'm' : "m"]
    )
}
export function getCurrentUser(terminalData, totalUser) {
    if (totalUser > 0) {
        for (let i in terminalName) {
            if (terminalName[i].category === terminalData?.terminal_category) {
                return Number(totalUser) + terminalName[i].defaultUsers
            }
        }
        // return Number(totalUser)+100
    }
    else {
        if (terminalData?.open_time == null && terminalData?.close_time == null) {
            for (let i in terminalName) {
                if (terminalName[i].category === terminalData?.terminal_category) {
                    return Number(totalUser) + terminalName[i].defaultUsers
                }
            }
            // return Number(totalUser)+100
        } else {


            let openTime = moment(
                moment(new Date()).format("YYYY-MM-DDT") +
                terminalData?.open_time?.split("T")[1]
            ).format("HH:mm")
            let closeTime = moment(
                moment(new Date()).format("YYYY-MM-DDT") +
                terminalData?.close_time?.split("T")[1]
            ).format("HH:mm")
            let currentTime = moment().format('HH:mm')
            let isTimeExist = moment(currentTime, 'HH:mm').isBetween(moment(openTime, 'HH:mm'), moment(closeTime, 'HH:mm'))
            if (isTimeExist) {
                for (let i in terminalName) {
                    if (terminalName[i].category === terminalData?.terminal_category) {
                        return Number(totalUser) + terminalName[i].defaultUsers
                    }
                }
                // return  Number(totalUser)+100
            }
            else {
                return '0'
            }

        }
    }
}