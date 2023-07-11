import React, {useState} from 'react'
import {deleteClinic} from "../../../redux/Clinic/action";
import {useDispatch} from "react-redux";
import FilledButton from "../../FilledButton";
import {useForm} from "react-hook-form";

export default function DeletePop({modalAllVal,handleOpenModal}) {
  const dispatch =  useDispatch()
    const [loading, setLoading] = useState(false)
    const {handleSubmit} = useForm({ mode: "all" });
    const deleteClinicList =()=>{
        setLoading(true)    
        dispatch(deleteClinic({id:modalAllVal})).then(res=>{
            if(res.status === 201) {
                setLoading(false)
                handleOpenModal('CommonPop'  , { header: "success", body: res.data.message, auth: true })
            }
        })
    }
        return (
                <div className='main_delete_modal'>
                        <h4>Delete a Clinic?</h4>
                        <div className='delete_content'>
                                <p>You are about to delete a clinic. This will
                                    remove all its physicians and their assigned patients
                                    from the database. </p>
                        </div>
                        <span className='reversed'>This action can’t be reversed!</span>
                        <span className='proceed'>Do you want to proceed?</span>

                        <form  onSubmit={handleSubmit(deleteClinicList)}  className="form_group d_flex justify_content_center form_action delete_modal_btn">
                            <FilledButton type="submit" loading={loading} value={'Yes'} className="btn btn_default" loader_class={'btn_loader_red'} />
                            <button className="btn btn_primary" type="reset" onClick={() => handleOpenModal()}>No</button>
                        </form>
                </div>
        )
}
