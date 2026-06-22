import { ApiConstants } from '../../Themes';

export function warnContactsAction(phoneNo,terminlId, navigation) {
    const action = {
        type: ApiConstants.constants.API_WARN_CONTACTS_LOAD,
        phoneNo: phoneNo,
        terminlId:terminlId,
        navigation: navigation
    }
    return action;
}
