import { jsonToFormData } from "../../../utils";
import {
    ADD_PHYSICIAN_LIST,GET_PHYSICIAN_LIST,EDIT_PHYSICIAN_LIST, UPDATE_STATUS_PHYSICIAN_LIST, SEARCH_PHYSICIAN_LIST,
    ADD_MINUTE_PHYSICIAN_LIST,DELETE_PHYSICIAN_LIST,GET_PHYSICIAN_DETAILS,SEARCH_PHAYSICIAN_PATIENTS,UPDATE_PHYSICIAN_LIST ,
    GET_PHYSICIAN_PATIENTS,UPDATE_CLINIC_PHYSICIAN,DELETE_PHYSICIAN,UPDATE_STATUS_PHYSICIAN,ADD_PHYSICIAN
} from "../../actionTypes";


export const addPhysician = (payload,type) => async (dispatch, getState, api) => {
    return await api
        .post("admin/add-physician", jsonToFormData(payload))
        .then((res) => {
            if (res.status === 201) {
                if(type === 'clinic'){
                    dispatch({
                        type: ADD_PHYSICIAN,
                        payload: res.data.data,
                    })
                }else{
                    dispatch({
                        type: ADD_PHYSICIAN_LIST,
                        payload: res.data.data,
                    })
                }
            }
            return res;
        })
        .catch((err) => {

            return err.response;
        });

};

export const getPhysicians = () => async (dispatch, getState, api) => {
    return await api
        .get("admin/get-physicians")
        .then((res) => {
            if (res.status === 200) {
                dispatch({
                    type: GET_PHYSICIAN_LIST,
                    payload: res.data.data
                })
            }
            return res;
        })
        .catch((err) => {
            return err.response;
        });

};

export const editPhysician = (payload) => async (dispatch, getState, api) => {
    return await api
        .post("admin/edit-physician", payload)
        .then((res) => {
            if (res.status === 200) {
                dispatch({
                    type: EDIT_PHYSICIAN_LIST,
                    payload: res.data.data,
                })
            }
            return res;
        })
        .catch((err) => {
            return err.response;
        });

};

export const updatePhysicianStatusList = (payload,type) => async (dispatch, getState, api) => {
    return await api
        .post("admin/update-physician-status",payload)
        .then((res) => {
            if(res.status === 200){
                if(type === 'clinic'){
                    dispatch({
                        type: UPDATE_STATUS_PHYSICIAN,
                        payload: payload,
                    })
                }else{
                    dispatch({
                        type: UPDATE_STATUS_PHYSICIAN_LIST,
                        payload: payload,
                    })
                }
            }
            return res;
        })
        .catch((err) => {
            return err.response;
        });
};

export const searchPhysicianList = (payload) => async (dispatch, getState, api) => {
    return await api
        .post("admin/search-physicians", payload)
        .then((res) => {
            dispatch({
                type: SEARCH_PHYSICIAN_LIST,
                payload: res.data.data,

            })
            return res;
        })
        .catch((err) => {
            return err.response;
        });

};
export const addMinutePhysician = (payload) => async (dispatch, getState, api) => {

    return await api
        .post("admin/add-minutes-physician", payload)
        .then((res) => {
            dispatch({
                type: ADD_MINUTE_PHYSICIAN_LIST,
                payload: payload,

            })
            return res;
        })
        .catch((err) => {
            return err.response;
        });

};

export const deletePhysicianList = (payload,type) => async (dispatch, getState, api) => {
    return await api
        .post("admin/delete-physician",payload)
        .then((res) => {
            if(res.status === 201){
                if(type === 'clinic'){
                    dispatch({
                        type:DELETE_PHYSICIAN,
                        payload: payload,
                    })
                }else{
                    dispatch({
                        type: DELETE_PHYSICIAN_LIST,
                        payload: payload,
                    })
                }
               
            }
            return res;
        })
        .catch((err) => {
            return err.response;
        });
};

export const getPhysicianDetails = (payload) => async (dispatch, getState, api) => {
    return await api
        .post("admin/get-physician-details", payload)
        .then((res) => {
            dispatch({
                type: GET_PHYSICIAN_DETAILS,
                payload: res.data.data,
            })
            return res;
        })
        .catch((err) => {
            return err.response;
        });
};

export const resendInvitationPhysician = (payload) => async (dispatch, getState, api) => {
    return await api
        .post("admin/resend-invitation-physician", payload)
        .then((res) => {
            return res;
        })
        .catch((err) => {
            return err.response;
        });

};

export const filterSearch = (payload) => async (dispatch, getState, api) => {
    return await api
        .post("/admin/searchPatients",payload)
        .then((res) => {
            if(res.status === 200){
                dispatch({
                    type: SEARCH_PHAYSICIAN_PATIENTS,
                    payload: res.data.data.patients,
                })
            }
            return res;
        })
        .catch((err) => {
            return err.response;
        });
};

export const updatePhysicianList = ({payload,type}) => async (dispatch, getState, api) => {
    return await api
        .post("admin/update-physician", jsonToFormData(payload))
        .then((res) => {    
            if(res.status === 201){ 
                if(type === 'clinic'){
                    dispatch({
                        type: UPDATE_CLINIC_PHYSICIAN,
                        payload: payload,
                    })
                }else{
                    dispatch({
                        type: UPDATE_PHYSICIAN_LIST,
                        payload: res.data.data,
                    })
                }
            }
            return res;
        })
        .catch((err) => {
            return err.response;
        });
}

export const assignPatientsData = (payload) => async (dispatch, getState, api) => {
    return await api
        .post("/admin/assignPatients", payload)
        .then((res) => {
         if(res.status === 201){
             dispatch({
                 type: GET_PHYSICIAN_PATIENTS,
                 payload: res.data.data,
             })
         }
            return res;
        })
        .catch((err) => {
            return err.response;
        });

};

export const getPhysicianPatients = (payload) => async (dispatch, getState, api) => {
    return await api
        .post("admin/getPhysicianPatients", payload)
        .then((res) => {
            dispatch({
                type: GET_PHYSICIAN_PATIENTS,
                payload: res.data.data,
            })
            return res;
        })
        .catch((err) => {
            return err.response;
        });

};
