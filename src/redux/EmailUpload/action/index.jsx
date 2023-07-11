//admin/uploadLogo
import {UPLOAD_EMAIL_IMG} from "../../actionTypes";
import {jsonToFormData} from "../../../utils";

export const uploademailTemImg = (payload) => async (dispatch, getState, api) => {
    return await api
        .post("/admin/uploadLogo", jsonToFormData(payload))
        .then((res) => {
            if (res.status === 200) {
                dispatch({
                    type: UPLOAD_EMAIL_IMG,
                    payload: res.data.data,
                })
            }
            return res;
        })
        .catch((err) => {
            return err.response;
        });

};