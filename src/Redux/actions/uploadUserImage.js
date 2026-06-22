import { ApiConstants } from '../../Themes';
export const uploadUserImageInitate= (data,oldImageArray) => {
    console.log('oldImageArray',oldImageArray);
    return {
        type: ApiConstants.constants.Add_USER_IMAGE_INITATE,
        payload: data,
        oldImageArray:oldImageArray
    }
}