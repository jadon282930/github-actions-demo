import React, {useState} from 'react'
import {deleteAuthorizedUser} from "../../../redux/Clinic/action";
import {useDispatch} from "react-redux";
import FilledButton from "../../FilledButton";
import {useForm} from "react-hook-form";

const DeleteAuthorizedPop = ({modalAllVal,handleOpenModal}) =>{
    const [loading, setLoading] = useState(false)
    const {handleSubmit} = useForm({ mode: "all" });
    const dispatch =  useDispatch()
    const deleteAuthorizedList =()=>{
        let payload = {
            id: modalAllVal
        }
        setLoading(true)
        dispatch(deleteAuthorizedUser(payload))
            .then(res => {
                if (res.status === 201) {
                    setLoading(false)
                    handleOpenModal('CommonPop', { header: "Success", body: res.data.message, auth: true })
                } else {
                    setLoading(false)
                    handleOpenModal('CommonPop', { header: "Error", body: res.data.message, auth: true })
                }
            }).catch(err => {
            setLoading(false)
            handleOpenModal('CommonPop', { header: "Error", body: err.message })
        })

    }

    return (
        <div className='main_delete_modal'>
            <h4>Delete an authorized User?</h4>
            <div className='delete_content'>
                <p>You are about to delete a clinic. This will
                    remove all its physicians and their assigned patients
                    from the database.  </p>
            </div>
            <span className='reversed'>This action can’t be reversed!</span>
                <span className='proceed'>Do you want to proceed?</span>

            <form onSubmit={handleSubmit(deleteAuthorizedList)} className="form_group d_flex justify_content_center form_action delete_modal_btn">
                <FilledButton type="submit" loading={loading} value={'Yes'} className="btn btn_default" loader_class={'btn_loader_red'} />
                <button className="btn btn_primary" type={'reset'} onClick={()=>handleOpenModal()}>No</button>
            </form>
        </div>
    )
}
export default DeleteAuthorizedPop
