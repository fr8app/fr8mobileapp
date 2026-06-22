import { ApiConstants } from '../../Themes';

export const feedInitateAction = (data) => {
    return {
        type: ApiConstants.constants.FEED_POST_INITIATE,
        payload: data
    }
}

export const AddpostBottomTerminalInitate = (data) => {
    return {
        type: ApiConstants.constants.ADD_POST_BOTTOM_TERMINAL_INITIATE,
        payload: data
    }
}
