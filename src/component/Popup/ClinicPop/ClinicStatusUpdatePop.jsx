import React, {useState} from 'react'
import {useDispatch} from "react-redux";
import FilledButton from "../../FilledButton";
import {useForm} from "react-hook-form";
import Cookies from 'js-cookie';
import {updateclinicStatus} from '../../../redux/Clinic/action';

export default function ClinicStatusUpdatePop({modalAllVal,handleOpenModal}) {
    const [loading, setLoading] = useState(false)
    const {handleSubmit} = useForm({ mode: "all" });
    const dispatch = useDispatch()
    
    const updateStatusClinicList = async () => {
        let payload = {
            id: modalAllVal?._id,
            status: !modalAllVal?.isActive
        }
        setLoading(true)
            dispatch(updateclinicStatus(payload)).then(res => {
                if (res.status === 200) {
                    setLoading(false)
                    handleOpenModal('CommonPop', { header: "Success", body: res.data.message, auth: true })
                }else {
                    setLoading(false)
                    handleOpenModal('CommonPop', { header: "Info", body: res.data.message, auth: true })
                }
            }).cache(err=>{
                setLoading(false)
                handleOpenModal('CommonPop', { header: "Info", body: err.message, auth: true })
            })
    }


    return (
        <div className='main_delete_modal'>
            <h4>Update A Clinic Status?</h4>
            <div className='delete_content'>
                <p>You are about to Update A Clinic Status. </p>
            </div>
            <form onSubmit={handleSubmit(updateStatusClinicList)} className="form_group d_flex justify_content_center form_action delete_modal_btn">
                <FilledButton type="submit" loading={loading} value={'Yes'} className="btn btn_default" loader_class={'btn_loader_red'} />
                <button className="btn btn_primary" type="reset" onClick={()=>handleOpenModal()}>No</button>
            </form>
        </div>
    )
}
