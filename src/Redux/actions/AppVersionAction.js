import { ApiConstants } from "../../Themes";

export function appversionAction(navigation) {
  const action = {
    type: ApiConstants.constants.API_APPVERSION_LOAD
  };

  return action;
}
