import { ApiConstants } from './../../Themes'

const initialState = {
    onLoad: false,
    error: null,
    result: null,
    status: 0,
    navigation: null,
};

function resetPasswword(state = initialState, action) {
    switch (action.type) {
        case ApiConstants.constants.API_RESET_PASSWORD_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.constants.API_RESET_PASSWORD_SUCCESS:
            return { ...state, onLoad: false, result: action.result.result, status: action.status, navigation: action.navigation.goBack("ForgotPassword") };

        case ApiConstants.constants.API_RESET_PASSWORD_FAIL:
            return { ...state, onLoad: false, error: action.error, status: action.status, navigation: null };

        case ApiConstants.constants.API_RESET_PASSWORD_ERROR:
            return { ...state, onLoad: false, error: action.error, status: action.status, navigation: null };

        default:
            return state;
    }
}

export default resetPasswword;