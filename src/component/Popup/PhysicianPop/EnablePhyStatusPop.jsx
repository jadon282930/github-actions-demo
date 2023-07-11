import React, { useState } from 'react'
import { useDispatch } from "react-redux";
import { updatePhysicianStatus, updatePhysicianStatusList } from "../../../redux/physician/action";
import { useForm } from "react-hook-form";
import FilledButton from "../../FilledButton";


export default function EnablePhyStatusPop({ modalAllVal, handleOpenModal }) {
    const [loading, setLoading] = useState(false)
    const { handleSubmit } = useForm({ mode: "all" });
    const dispatch = useDispatch()
    const { physician_id, status } = modalAllVal
    const phyStatusUpdate = () => {

        let statusActivity = {
            id: physician_id,
            status: status ? false : true
        }
        setLoading(true)
        dispatch(updatePhysicianStatusList(statusActivity, modalAllVal.type)).then(res => {
            if (res.status === 200) {
                setLoading(false)
                handleOpenModal('CommonPop', { header: "Success", body: res?.data?.message, auth: true })
            } else {
                setLoading(false)
                handleOpenModal('CommonPop', { header: "Info", body: res?.data?.message, auth: true })
            }
        }).catch(err => {
            setLoading(false)
            handleOpenModal('CommonPop', { header: "Error", body: err.message, auth: true })
        })
    }
    return (
        <div className='main_delete_modal enable_physician_modal'>
            <h4>Enable a Physician and restart Subscription?</h4>
            <div className='delete_content'>
                <p>You are about to enable a physician and start his/her license subscription in current billing cycle.</p>
            </div>
            <span className='reversed'> This will update your number of licenses and change subscription in the current billing cycle</span>
            <span className='proceed'>Do you want to proceed?</span>
            <form onSubmit={handleSubmit(phyStatusUpdate)} className="form_group d_flex justify_content_center form_action delete_modal_btn">
                {/*<button className="btn btn_default" onClick={()=>deleteClinicList()}>Yes</button>*/}
                <FilledButton type="submit" loading={loading} value={'Yes'} className="btn btn_default" loader_class={'btn_loader_red'} />
                <button className="btn btn_primary" type="reset" onClick={() => handleOpenModal()}>No</button>
            </form>
        </div>
    )
}
