import { ApiConstants } from '../../Themes';

export const ProfileDataInitate= (data,userId=null) => {
    return {
        type: ApiConstants.constants.PROFILE_DATA_INITATE,
        payload: data,
        userId:userId,
    }
}
export const clearProfileData =()=>{
    return{
        type:"CLEAR_PROFILE_DATA"
    }
}

// PROFILE_DATA_INITATE:'PROFILE_DATA_INITATE',
//   PROFILE_DATA_SUCCESS:'PROFILE_DATA_SUCCESS',
//   PROFILE_DATA_ERROR:'PROFILE_DATA_ERROR',