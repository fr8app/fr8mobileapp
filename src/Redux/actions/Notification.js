import { ApiConstants } from '../../Themes';

export  const notificationGetInitiate = (data,navigation,page,loader=true)=> {
     const action={
        type: ApiConstants.constants.NOTIFY_NOTIFICATION_INITATE,
        payload: data,
         navigation: navigation,
         page: page,
        loader:loader
    }
    return action
}
export  const notificationRead = (id,index,navigation)=> {
     const action={
        type: ApiConstants.constants.API_NOTIFICATION_READ_LOAD,
        id: id,
        index:index,
        navigation:navigation
    }
    return action
}
export  const notificationDelete = (id,index,navigation)=> {
     const action={
        type: ApiConstants.constants.API_NOTIFICATION_DELETE_LOAD,
        id: id,
        index:index,
        navigation:navigation
    }
    return action
}

// NOTIFY_NOTIFICATION_INITATE: 'NOTIFY_NOTIFICATION_INITATE',
//   NOTIFY_NOTIFICATION_SUCCESS: 'NOTIFY_NOTIFICATION_SUCCESS',
//   NOTIFY_NOTIFICATION_ERROR: 'NOTIFY_NOTIFICATION_ERROR',