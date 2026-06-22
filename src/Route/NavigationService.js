
'use strict';

import { StackActions } from '@react-navigation/native';

let _navigator;
let mainNavigation;

function setTopLevelNavigator(navigatorRef) {
    _navigator = navigatorRef;
}

function getFullRoute() {
    return _navigator
}

function setMainNavigation(navigatorRef) {
    mainNavigation = navigatorRef;
}

function navigate(routeName, params) {
}

function logout() {

    _navigator._navigation.goBack()
    const resetAction = StackActions.replace('FavouriteTerminal2')
    _navigator._navigation.dispatch(resetAction);
}

export default {
    navigate,
    setTopLevelNavigator,
    logout,
    setMainNavigation,
    getFullRoute

};
