///admin/get-clinics
import {jsonToFormData} from "../../../utils";
import {
    ADD_AUTHORIZED,
    ADD_CLINIC,
    ADD_CLINIC_LIST,
    CANCEL_CLINIC_MINUTE_PLAN,
    CHANGE_PRIMARY_AUTH_USER,
    CLEAR_CLINIC,
    DELETE_AUTH_USER,
    DELETE_CLINICE,
    EDIT_AUTH_USER,
    GET_CLINIC,
    GET_CLINIC_DETAILS,
    GET_CLINIC_LIST,
    GET_COUNTRY_DATA,
    GET_MINUTE_DATA,
    GET_STATE_DATA,
    RESEND_INVITATION_AUTH_USER,
    SEARCH_CLINIC_LIST,
    UPDATE_AUTH_USER,
    UPDATE_AUTH_USER_STATUS,
    UPDATE_CLINIC,
    UPDATE_CLINIC_MINUTE_PLAN,
    UPDATE_CLINIC_STATUS
} from "../../actionTypes";

export const getClinicList = () => async (dispatch, getState, api) => {
    return await api
        .get("admin/get-clinics")
        .then((res) => {
            if (res.status === 200) {
                dispatch({
                    type: GET_CLINIC_LIST,
                    payload: res.data.data,
                })
            }
            return res;
        })
        .catch((err) => {
            return err.response;
        });

};

///admin/add-clinic
export const addClinicList = (payload) => async (dispatch, getState, api) => {
    return await api
        .post("/admin/add-clinic", jsonToFormData(payload))
        .then((res) => {
            if (res.status === 200) {
                dispatch({
                    type: ADD_CLINIC_LIST,
                    payload: res.data.data,
                })
            }
            return res;
        })
        .catch((err) => {
            return err.response;
        });
};

export const addStoreClinic = (data) => ({
    type: ADD_CLINIC,
    payload: data,
})

export  const getclinic = (payload) => async (dispatch, getState, api) => {
    return await api
        .post("/admin/edit-clinic", payload)
        .then((res) => {
            if (res.status === 200) {
                dispatch({
                    type: GET_CLINIC,
                    payload: res.data.data,
                })
            }
            return res;
        })
        .catch((err) => {
            return err.response;
        });
};

export const updateclinicList = (payload) => async (dispatch, getState, api) => {
    return await api
        .post("/admin/update-clinic", jsonToFormData(payload))
        .then((res) => {
            if (res.status === 201) {
                dispatch({
                    type: UPDATE_CLINIC,
                    payload: payload,
                })
            }
            return res;
        })
        .catch((err) => {
            return err.response;
        });
};

export const updateclinicStatus = (payload) => async (dispatch, getState, api) => {
    return await api
        .post("/admin/update-clinic-status", payload)
        .then((res) => {
            if (res.status === 200) {
                dispatch({
                    type: UPDATE_CLINIC_STATUS,
                    payload: payload,
                })
            }
            return res;
        })
        .catch((err) => {
            return err.response;
        })
};

export const addAuthorizedPerson = (payload) => async (dispatch, getState, api) => {
    return await api
        .post("/admin/add-authorized-user",jsonToFormData(payload))
        .then((res) => {
                if(res.status === 201){
                    dispatch({
                        type: ADD_AUTHORIZED,
                        payload: res.data.data,
                        clinicList:payload
                    })
                }

            return res
        })
        .catch((err) => {
            return err.response;
        });
};
///admin/get-clinic-details

export const getAllClinicDetails = (payload) => async (dispatch, getState, api) => {
    return await api
        .post("/admin/get-clinic-details",payload)
        .then((res) => {
                if (res.status === 200) {
                dispatch({
                    type: GET_CLINIC_DETAILS,
                    payload: res.data.data,
                })
            }
            return res;
        })
        .catch((err) => {
            return err.response;
        });
};
export const deleteAuthorizedUser = (payload) => async (dispatch, getState, api) => {
    return await api
        .post("/admin/delete-authorized-user",payload)
        .then((res) => {
        if(res.status === 201){
            dispatch({
                type: DELETE_AUTH_USER,
                payload: payload,
            })
        }
            return res;
        })
        .catch((err) => {
            return err.response;
        });
};

//editAuthUser
export const editAuthUser = (payload) => async (dispatch, getState, api) => {
    return await api
        .post("/admin/edit-authorized-user",payload)
        .then((res) => {
            dispatch({
                type: EDIT_AUTH_USER,
                payload: res.data.data,
            })
            return res;
        })
        .catch((err) => {
            return err.response;
        });
};

///admin/update-authorized-user

export const updateAuthUser = (payload) => async (dispatch, getState, api) => {
    return await api
        .post("/admin/update-authorized-user",jsonToFormData(payload))
        .then((res) => {
            dispatch({
                type: UPDATE_AUTH_USER,
                payload: payload,
            })
            return res;
        })
        .catch((err) => {
            return err.response;
        });
};
///admin/change-primary-user

export const changePrimaryAuthUser = (payload) => async (dispatch, getState, api) => {
    return await api
        .post("/admin/change-primary-user",payload)
        .then((res) => {
            dispatch({
                type: CHANGE_PRIMARY_AUTH_USER,
                payload: payload,
            })
            return res;
        })
        .catch((err) => {
            return err.response;
        });
};
///admin/update-authorized-user-status
export const updateAuthUserStatus = (payload) => async (dispatch, getState, api) => {
    return await api
        .post("/admin/update-authorized-user-status",payload)
        .then((res) => {
    if(res.status === 200){
        dispatch({
            type: UPDATE_AUTH_USER_STATUS,
            payload: payload,
        })
    }
            return res;
        })
        .catch((err) => {
            return err.response;
        });
};
///admin/search-clinic
export const searchClinicList = (payload) => async (dispatch, getState, api) => {
    return await api
        .post("/admin/search-clinic",payload)
        .then((res) => {
            if(res.status === 200){
                dispatch({
                    type: SEARCH_CLINIC_LIST,
                    payload: res.data.data,
                })
            }
            return res;
        })
        .catch((err) => {
            return err.response;
        });
};
export const getCountryData = () => async (dispatch, getState, api) => {
    return await api
        .get("/admin/getCountryData")
        .then((res) => {
            if (res.status === 200) {
                dispatch({
                    type: GET_COUNTRY_DATA,
                    payload: res.data.data.countries,
                })
            }
            return res;
    })
        .catch((err) => {
            return err.response;
        });

};

export const getStateData = (payload) => async (dispatch, getState, api) => {
    return await api
        .post("/admin/getStateData",payload)
        .then((res) => {
            if (res.status === 200) {
                dispatch({
                    type: GET_STATE_DATA,
                    payload: res.data.data.states,
                })
            }
            return res;
        })
        .catch((err) => {
            return err.response;
        });

};

//clearClinic
export const clearClinic = (data) => ({
    type: CLEAR_CLINIC,
    payload: data,
})

///admin/resend-invitation-authorized-user
export const resendinvItationAuthorized = (payload) => async (dispatch, getState, api) => {

    return await api
        .post("/admin/resend-invitation-authorized-user",payload)
        .then((res) => {
            if (res.status === 200) {
                dispatch({
                    type: RESEND_INVITATION_AUTH_USER,
                    payload: res.data.data,
                })
            }
            return res;
        })
        .catch((err) => {
            return err.response;
        });

};

export const deleteClinic = (payload) => async (dispatch, getState, api) => {
    return await api
        .post("/admin/delete-clinic",payload)
        .then((res) => {
            if (res.status === 201) {
                dispatch({
                    type: DELETE_CLINICE,
                    payload: payload,
                })
            }
            return res;
        })
        .catch((err) => {
            return err.response;
        });
};
///clinic/search-patients
export const getMinutes = () => async (dispatch, getState, api) => {
    return await api
        .get("/admin/getMinutesData")
        .then((res) => {
            if (res.status === 200) {
                dispatch({
                    type: GET_MINUTE_DATA,
                    payload: res.data.data?.meetingMinutes,
                })
            }
            return res;
        })
        .catch((err) => {
            return err.response;
        });

};

export const updateMinutesDetails = (payload) => async (dispatch, getState, api) => {
    return await api
        .post("/admin/changeMinutePlan", payload)
        .then((res) => {
            if (res.status === 200) {
                dispatch({
                    type: UPDATE_CLINIC_MINUTE_PLAN,
                    payload: res.data.data.minute,
                })
            }
            return res;
        })
        .catch((err) => {
            return err.response;
        });
};

export const cancelMinutesPlan = (payload) => async (dispatch, getState, api) => {
    return await api
        .post("/admin/cancelMinutePlan", payload)
        .then((res) => {
            if (res.status === 200) {
                dispatch({
                    type: CANCEL_CLINIC_MINUTE_PLAN,
                    payload: null,
                })
            }
            return res;
        })
        .catch((err) => {
            return err.response;
        });
};
