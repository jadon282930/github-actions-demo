import { LOGIN_SUCCESS } from '../../actionTypes';
import Cookies from 'js-cookie'
import {Encryption} from "../../../utils";

export const updateUserDetails = (payload) =>async (dispatch, getState, api) => {
    dispatch({
    type: LOGIN_SUCCESS,
    currentUser: payload,
})}
export const userLogin = (payload) => async (dispatch, getState, api) => {
    return await api
        .post("/admin/login", payload)
        .then((res) => {
            if (res.status === 200) {
                localStorage.setItem("_Haploscope_ad_token", res.data.data.token)
                localStorage.setItem("userDetail", Encryption(JSON.stringify(res.data.data)))
                Cookies.set("x-access-token", res.data.data.token, { path: "/" ,expires: 1 / 2});
            }
            return res;
        })
        .catch((err) => {
            return err.response;
        });
};

