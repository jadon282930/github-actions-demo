import {useDispatch} from "react-redux";
import React,{useState} from "react";
import {updateAuthUserStatus} from "../../../redux/Clinic/action";
import FilledButton from "../../FilledButton";
import {useForm} from "react-hook-form";

const AuthorizedUserStatusPop = ({handleOpenModal,modalAllVal})=>{
    const [loading, setLoading] = useState(false)
    const {handleSubmit} = useForm({ mode: "all" });
    const dispatch =  useDispatch(null)
    const {auth_id,status} =modalAllVal
    const updateStatusClinicAuth =()=>{
        let statusActivity = {
            id: auth_id,
            status: status ? false : true
        }
        setLoading(true)
        dispatch(updateAuthUserStatus(statusActivity)).then(res => {
                    if (res.status === 200) {
                        setLoading(false)
                        handleOpenModal('CommonPop', { header: "Success", body: res.data.message, auth: true })
                    } else {
                        setLoading(false)
                        handleOpenModal('CommonPop', { header: "Error", body: res.data.message, auth: true })
                    }
                }).catch(e => {
            setLoading(false)
            handleOpenModal('CommonPop', {header: "Error", body: e.message, auth: true})
        })
    }
    return (
        <div className='main_delete_modal'>
            <h4>Update Authorized User Status?</h4>
            <div className='delete_content'>
                <p>You are about to Update Authorized User Status. </p>
            </div>
            <form   onSubmit={handleSubmit(updateStatusClinicAuth)} className="form_group d_flex justify_content_center form_action delete_modal_btn">
                <FilledButton type="submit" loading={loading} value={'Yes'} className="btn btn_default" loader_class={'btn_loader_red'} />
                <button className="btn btn_primary" type={'reset'} onClick={()=>handleOpenModal()}>No</button>
            </form>
        </div>
    )
}
export default AuthorizedUserStatusPop