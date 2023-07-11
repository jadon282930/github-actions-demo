import {GET_WEBSITE_LEADS_DATA,SEARCH_WEBSITE_LEADS_DATA} from "../../actionTypes";

export  const getAllContactData = () => async (dispatch, getState, api) => {
    return await api
        .get("/admin/getAllContactData")
        .then((res) => {
            if (res.status === 200) {
                dispatch({
                    type: GET_WEBSITE_LEADS_DATA,
                    payload: res.data.data,
                })
            }
            return res;
        })
        .catch((err) => {
            return err.response;
        });
};

//

export  const searchContactData = (payload) => async (dispatch, getState, api) => {
    return await api
        .post("admin/searchContactData",payload)
        .then((res) => {
            if (res.status === 200) {
                dispatch({
                    type: SEARCH_WEBSITE_LEADS_DATA,
                    payload: res.data.data,
                })
            }
            return res;
        })
        .catch((err) => {
            return err.response;
        });
};