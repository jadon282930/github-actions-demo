import React, {useState} from 'react'
import {deleteAuthorizedUser, deleteClinic} from "../../../redux/Clinic/action";
import {useDispatch} from "react-redux";
import {deletePhysician,deletePhysicianList} from "../../../redux/physician/action";

import {useForm} from "react-hook-form";
import FilledButton from "../../FilledButton";

const DeleteAuthorizedPop = ({modalAllVal,handleOpenModal}) =>{
    const [loading, setLoading] = useState(false)
    const {handleSubmit} = useForm({ mode: "all" });
    const dispatch =  useDispatch()
    const deletePhysicianListData =()=>{
            let payload = {
                id: modalAllVal.id
            }
        setLoading(true)
            dispatch(deletePhysicianList(payload,modalAllVal.type)).then(res => {
                if (res.status === 201) {
                    setLoading(false)
                    handleOpenModal('CommonPop', { header: "Success", body: res.data.message, auth: true })
                }
                else {
                    setLoading(false)
                    handleOpenModal('CommonPop', { header: "Error", body: res.data.message, auth: true })
                }
            }).catch(e => {
                setLoading(false)
                handleOpenModal('CommonPop', { header: "Error", body: e.message, auth: true })
            })
    }
    return (
        <div className='main_delete_modal'>
            <h4>Delete a Physician?</h4>
            <div className='delete_content'>
                {/*<p>You are about to delete a physician. This will*/}
                {/*    remove all his/her assigned patients*/}
                {/*    from the database. You may transfer the patients*/}
                {/*    to another physician before this action. </p>*/}
                {
                    modalAllVal.status ?
                        <p>You are about to delete a physician. This will
                            remove all his/her assigned patients
                            from the database. You may transfer the patients
                            to another physician before this action. </p>
                        :
                        <p>You are about to delete a physician whose account
                            activation is still pending. Once deleted, this
                            physician will not be able to activate his/her account. </p>
                }
            </div>
            <span className='reversed'>Deleting a physician can’t be reversed!</span>
            <span className='proceed'>Do you want to proceed?</span>

            <form onSubmit={handleSubmit(deletePhysicianListData)} className="form_group d_flex justify_content_center form_action delete_modal_btn">
                {/*<button className="btn btn_default" onClick={()=>deleteAuthorizedList()}>Yes</button>*/}
                <FilledButton type="submit" loading={loading} value={'Yes'} className="btn btn_default" loader_class={'btn_loader_red'} />
                <button className="btn btn_primary" type={'reset'} onClick={()=>handleOpenModal()}>No</button>
            </form>
        </div>
    )
}
export default DeleteAuthorizedPop
