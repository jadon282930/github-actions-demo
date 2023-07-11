import FilledButton from "../../FilledButton";
import React, {useEffect, useState} from "react";
import { useForm } from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {cancelMinutesPlan} from "../../../redux/Clinic/action";

const ChangeMinutesPlanBtn = ({handleOpenModal,modalAllVal}) => {
    const dispatch = useDispatch(null);
    const [loading, setLoading] = useState(false)
    const { handleSubmit } = useForm({ mode: "all" });


    const cancelMinuteHandle = ()=>{
        setLoading(true)
        dispatch(cancelMinutesPlan({clinic_id:modalAllVal.id})).then(res=>{
            if(res.status === 200){
                setLoading(false)
                handleOpenModal('CommonPop', { header: "Success", body: res?.data?.message, auth: true })
            }else{
                setLoading(false)
                handleOpenModal('CommonPop', { header: "Info", body: res?.data?.message, auth: true })
            }
        })
    }
    return (
        <div className='main_delete_modal change-min_modal'>
            <h5>Cancel Minutes Plan</h5>
            <form onSubmit={handleSubmit(cancelMinuteHandle)}>
                <div className="form_group">
                    <label htmlFor="">Cancel Billing Period Meeting Minutes (per physician)</label>
                </div>
                <span className='proceed'>Do you want to proceed?</span>
                <div className="form_group d_flex justify_content_center form_action delete_modal_btn">
                    <button className="btn btn_primary mr_05" type={'button'} onClick={()=>handleOpenModal()}>No</button>
                    <FilledButton type="submit" loading={loading} value={'Yes'} className="btn btn_default" loader_class={'btn_loader_red'} />
                </div>
            </form>
        </div>
    )
}
export default ChangeMinutesPlanBtn