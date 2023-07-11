import FilledButton from "../../FilledButton";
import React, {useEffect, useState} from "react";
import { useForm } from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {getMinutes, updateMinutesDetails} from "../../../redux/Clinic/action";
import Validation from "../../formValidation";


const ChangeMinutesPlanBtn = ({handleOpenModal,modalAllVal}) => {
    const dispatch = useDispatch(null);
    const [loading, setLoading] = useState(false)
    const { handleSubmit, register,errors ,watch,setValue,reset,setError} = useForm({ mode: "all" });
    let getMinutesData = useSelector(state => state?.clinicReducer?.getMinute)

    useEffect(() => {
        dispatch(getMinutes())
    }, [])

    const minuteHandle = (state)=>{
        setLoading(true)
        Object.assign(state,{clinic_id:modalAllVal.id})
        dispatch(updateMinutesDetails(state,{minute:modalAllVal?.minute})).then(res=>{
            if(res.status === 200){
                setLoading(false)
                handleOpenModal('CommonPop', { header: "Success", body: res?.data?.message, auth: true })
            }else{
                setLoading(false)
                handleOpenModal('CommonPop', { header: "Info", body: res?.data?.message, auth: true })
            }
        })
    }

    const handleOpenModalData = ()=>{
        handleOpenModal()
        setError('minute','')
        setValue('minute','300')
    }

    return (
        <div className='main_delete_modal change-min_modal'>
            <h5>Change Minutes Plan</h5>
            <form onSubmit={handleSubmit(minuteHandle)}>
                <div className="form_group">
                    <label htmlFor="">Billing Period Meeting Minutes (per physician)</label>
                    <select name="minute" id=""
                            className="form_control col-5 montserrat_semibold"
                            ref={register({
                                required: "Billing period meeting minutes is Required",
                            })}
                    >
                        <option value="">Select</option>
                        {
                            getMinutesData?.length > 0 &&
                            getMinutesData?.map((item)=>{
                                return  <option value={item?.minutes} selected={Number(item?.minutes) === Number(300)} key={item?._id}>{item?.minutes}</option>
                            })
                        }
                    </select>
                    <Validation errors={errors.minute} message={errors?.minute?.message} watch={watch("minute")} />
                </div>
                <div className='delete_content'>
                    <p>You are about to change the monthly meeting minutes available to every physician. This change will be effective from the beginning of the next billing cycle.</p>
                </div>
                <span className='proceed'>Do you want to proceed?</span>
                <div className="form_group d_flex justify_content_center form_action delete_modal_btn">
                    <button className="btn btn_primary mr_05" type={'button'} onClick={()=>handleOpenModalData()}>No</button>
                    <FilledButton type="submit" loading={loading} value={'Yes'} className="btn btn_default"  loader_class={'btn_loader_red'} />
                </div>
            </form>
        </div>
    )
}
export default ChangeMinutesPlanBtn
