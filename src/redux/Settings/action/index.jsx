import {CHANGE_PASSWORD,GET_SETTING_DATA,UPDATE_MAINTENANCE_MODE,UPDATE_APP_VERSION} from "../../actionTypes";

export const changePassword = (payload) => async (dispatch, getState, api) => {
    return await api
        .post("/admin/change-password",payload)
        .then((res) => {
            if (res.status === 200) {
                dispatch({
                    type: CHANGE_PASSWORD,
                    payload: res.data.data,
                })
            }
            return res;
        })
        .catch((err) => {
            return err.response;
        });

};

///admin/getSettingsData

export const getSettingsData = () => async (dispatch, getState, api) => {
    return await api
        .get("/admin/getSettingsData")
        .then((res) => {
            if (res.status === 200) {
                dispatch({
                    type: GET_SETTING_DATA,
                    payload: res.data.data,
                })
            }
            return res;
        })
        .catch((err) => {
            return err.response;
        });
};

///admin/updateMaintenanceMode

export const updateMaintenanceMode = (payload) => async (dispatch, getState, api) => {
    
    return await api
        .post("/admin/updateMaintenanceMode",payload)
        .then((res) => {
            return res;
        })
        .catch((err) => {
            return err.response;
        });
};
///admin/updateAppVersion
export const updateAppVersion = (payload) => async (dispatch, getState, api) => {
    
    return await api
        .post("/admin/updateAppVersion",payload)
        .then((res) => {
            if (res.status === 200) {
                dispatch({
                    type: UPDATE_APP_VERSION,
                    payload: payload,
                })
            }
            return res;
        })
        .catch((err) => {
            return err.response;
        });
};