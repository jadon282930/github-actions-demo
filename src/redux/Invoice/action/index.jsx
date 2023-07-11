import {GET_INVOICE_DATA} from "../../actionTypes";

export const getInvoiceData = (payload) => async (dispatch, getState, api) => {
    return await api
        .post("/admin/getInvoiceData", payload)
        .then((res) => {
            if (res.status === 200) {
                dispatch({
                    type: GET_INVOICE_DATA,
                    payload: res.data.data,
                })
            }
            return res;
        })
        .catch((err) => {
            return err.response;
        });
};