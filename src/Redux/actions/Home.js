import { ApiConstants } from '../../Themes';

export function homeAction(lat, long, loader = true, navigation) {
    const action = {
        type: ApiConstants.constants.API_HOME_LOAD,
        lat: lat,
        long: long,
        loader: loader,
        navigation: navigation
    }
    return action;
}
export function homeDetailAction(navigation) {
    const action = {
        type: "API_HOME_DETAIL_LOAD",

        navigation: navigation
    }
    return action;
}
export function createDummyUSer() {
    const action = {
        type: "API_DUMMY_USER_CREATE_LOAD",
    }
    return action;
}
export function favouriteTerminalAction(list, navigation, id) {
    const action = {
        type: "API_FAV_TERMINAL_LOAD",
        list: list,
        navigation: navigation,
        id
    }
    return action;
}
export function setFavRegion(list, navigation, FromOnBoarding = false, id) {
    const action = {
        type: "API_SET_FAV_REGION_LOAD",
        list: list,
        navigation: navigation,
        FromOnBoarding: FromOnBoarding,
        id
    }
    return action;
}
export function firsrtTimeSetRegions() {
    const action = {
        type: "API_SET_FIRST_TIME_FAV_REGION_LOAD",

    }
    return action;
}
export function regionListAction(list, navigation, id) {
    const action = {
        type: "API_REGION_LIST_LOAD",
        list: list,
        navigation: navigation,
        id
    }
    return action;
}
export function regionSelect(id) {
    const action = {
        type: "API_REGION_SELECT_LOAD",
        id: id
    }
    return action;
}
export function clearSearch() {
    const action = {
        type: "SEARCH_DATA_CLEAR_LOAD",
    }
    return action;
}
export function getGeoFences(latitude, longitude) {
    const action = {
        type: "API_GET_GEOFENCES_LOAD",
        latitude: latitude,
        longitude: longitude
    }
    return action;
}

export function selectedTerminalAction(item, navigation) {
    const action = {
        type: ApiConstants.constants.SELECTED_TERMINAL_ITEM,
        item: item,
        navigation: navigation
    }
    return action;
}

export const onReachEndTerminal = (data) => {
    return {
        type: ApiConstants.constants.API_ON_REACH_END_TERMINAL,
        payload: data
    }
}
export const onReachEndterminalSucess = (data) => {
    const action = {
        type: ApiConstants.constants.API_ON_REACH_END_TERMINAL_SUCCESS,
        payload: data
    }
    return action;
}
export const onReachEndTerminalError = (error) => {
    const action = {
        type: ApiConstants.constants.API_ON_REACH_END_TERMINAL_ERROR,
        payload: error
    }
    return action

}
export const nearTerminalNotifcationInitiate = (data, extra) => {
    const action = {
        type: ApiConstants.constants.API_NEAR_TERMINAL_NOTIFICATION_INITIATE,
        payload: data,
        extra
    }
    return action
}
export const nearTerminalNotifcationSuccess = (data) => {
    const action = {
        type: ApiConstants.constants.API_NEAR_TERMINAL_NOTIFICATION_SUCCESS,
        payload: data
    }
    return action
}
export const nearTerminalNotifcationError = (data) => {
    const action = {
        type: ApiConstants.constants.API_NEAR_TERMINAL_NOTIFICATION_ERROR,
        payload: data
    }
    return action
}

export const searchTerminalInitiate = (data, navigation, showError = false) => {
    return {
        type: ApiConstants.constants.SEARCH_TERMINAL_INITIATE,
        payload: data,
        showError: showError,
        navigation: navigation
    }
}
export const notifyBadgeIncrerase = () => {
    return {
        type: "BADGE_INCREASE",

    };

}
export const friendRequest = (data) => {
    return {
        type: "NOTIFICATION_ON_FRIEND",
        data: data
    };

}

export const DeleteFavTerminal = (terminalId, userId, navigation) => {
    return {
        type: "DELETE_FAV_TERMINAL_LOAD",
        terminalId,
        userId,
        navigation: navigation
    };

}