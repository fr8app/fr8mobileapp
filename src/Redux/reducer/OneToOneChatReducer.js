import { ApiConstants } from './../../Themes';
// import { StackActions, NavigationActions } from 'react-navigation';
import { DataManager } from "./../../Components";
import { StackActions } from '@react-navigation/native';

const initialState = {
    onLoad: false,
    error: null,
    result: [],
    status: 0,
    navigation: null,
    index: null
};

function oneToOneChat(state = initialState, action) {
    switch (action.type) {
        case ApiConstants.constants.API_ONE_TO_ONE_CHAT_LOAD:
            return { ...state, onLoad: true, index: action.index };

        case ApiConstants.constants.API_ONE_TO_ONE_CHAT_SUCCESS:
            return { ...state, onLoad: false, result: action.result, status: action.status, index: state.index, navigation: null };

        case ApiConstants.constants.API_ONE_TO_ONE_CHAT_FAIL:

            return { ...state, onLoad: false, result: [], status: action.status, navigation: null };

        case ApiConstants.constants.API_ONE_TO_ONE_CHAT_UNAUTHENTICATED:
            // const resetAction = StackActions.reset({
            //     index: 0,
            //     actions: [NavigationActions.navigate({ routeName: 'OnBoarding' })],
            // });
            const resetAction= StackActions.replace('FavouriteTerminal2')

            DataManager.clearData()
            return { ...state, onLoad: false, result: [], status: action.status,
                 navigation: action.navigation.dispatch(resetAction)
                 };

        case ApiConstants.constants.API_ONE_TO_ONE_CHAT_ERROR:
            return { ...state, onLoad: false, error: action.error, status: action.status, navigation: null };

        default:
            return state;
    }
}
export default oneToOneChat;