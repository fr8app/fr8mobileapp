import { ApiConstants } from '../../Themes';

export function searchTerminalAction(terminal_name, navigation) {
    const action = {
        type: ApiConstants.constants.API_SEARCH_TERMINAL_LOAD,
        terminal_name: terminal_name,
        navigation: navigation
    }
    return action;
}

export function searchUserAction(user_name, page, navigation) {
    const action = {
        type: ApiConstants.constants.API_SEARCH_USER_LOAD,
        user_name: user_name,
        page: page,
        navigation: navigation
    }
    return action;
}

export function nearTerminalAction(lat, long, navigation) {
    const action = {
        type: ApiConstants.constants.API_NEAR_TERMINALS_LOAD,
        lat: lat,
        long: long,
        navigation: navigation
    }
    return action;
}
export function tagFriendList(id) {
    const action = {
        type: 'API_TAG_FRIENDS_SELECTED_LOAD',
        id: id
    }
    return action;
}
export function recentLocations() {
    const action = {
        type: 'API_RECENT_LOCATIONS_LOAD',
        
    }
    return action;
}
export function userInTerminal(type='0') {
    const action = {
        type: 'API_USER_IS_IN_TERMINAL_LOAD',
        enterType:type
    }
    return action;
}
