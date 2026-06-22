import { ApiConstants } from '../../Themes';

export function supportAction(tittle, descrption, navigation) {
    const action = {
        type: ApiConstants.constants.API_SUPPORT_LOAD,
        tittle: tittle,
        descrption: descrption,
        navigation: navigation
    }
    return action;
}

export function reportUserAction(id,message, navigation) {
    const action = {
        type: ApiConstants.constants.API_REPORT_USER_LOAD,
        id: id,
        message: message,
        navigation: navigation
    }
    return action;
}