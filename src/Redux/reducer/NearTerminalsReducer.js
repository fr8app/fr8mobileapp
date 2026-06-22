import { ApiConstants, AppConstants } from './../../Themes';
import { TerminalModal } from './../../Components';
// import { StackActions, NavigationActions } from 'react-navigation';
import I18n from 'react-native-i18n';
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

function nearTerminals(state = initialState, action) {
    switch (action.type) {
        case ApiConstants.constants.API_NEAR_TERMINALS_LOAD:
            return { ...state, onLoad: true, index: action.index };

        case ApiConstants.constants.API_NEAR_TERMINALS_SUCCESS:
            console.log('action.result.result.data',action.result.result.data);
            let terminals = TerminalModal.TerminalModal.getTerminalData(action.result.result.data.terminal)
            
            let listPlaces = [
                {
                    title: I18n.t('Nearby_Terminals'), data: terminals
                },
                { title: I18n.t('Explore'), data: action.result.result.data.regionWiseTerminal },
            ]
            console.log('near by terminal',listPlaces);
            return { ...state, onLoad: false, result: listPlaces, status: action.status, index: state.index, navigation: null };

        case ApiConstants.constants.API_NEAR_TERMINALS_FAIL:

            return { ...state, onLoad: false, result: [], status: action.status, navigation: null };

        case ApiConstants.constants.API_NEAR_TERMINALS_UNAUTHENTICATED:
            // const resetAction = StackActions.reset({
            //     index: 0,
            //     actions: [NavigationActions.navigate({ routeName: 'OnBoarding' })],
            // });
            const resetAction= StackActions.replace('FavouriteTerminal2')

            DataManager.clearData()
            return { ...state, onLoad: false, result: [], 
                navigation: action.navigation.dispatch(resetAction) 
            };

        case ApiConstants.constants.API_NEAR_TERMINALS_ERROR:
            return { ...state, onLoad: false, error: action.error, status: action.status, navigation: null };

        case ApiConstants.constants.API_FOLLOW_UNFOLLOW_TERMINAL_SUCCESS:
            
            let getArray = state.result
            if (state.result.length > 0) {
                let indexValue = getArray[0].data[action.index]
                if (indexValue.is_follow == 0) {
                    indexValue.is_follow = 1
                    indexValue.followers_count = Number(JSON.parse(indexValue.followers_count)) + Number(1)
                }
                else {
                    indexValue.is_follow = 0
                    indexValue.followers_count = Number(JSON.parse(indexValue.followers_count)) - Number(1)
                }
            }
            state.result = getArray
            return { ...state, onLoad: false, };
        default:
            return state;
    }
}
export default nearTerminals;