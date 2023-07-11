import { message } from 'antd';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux'
import {  addMinutePhysician, editPhysician, getPhysicians } from '../../../redux/physician/action';
import FilledButton from "../../FilledButton";

function AddMinutePop({ id,modalAllVal, handleOpenModal }) {
    const { register, watch, errors, handleSubmit, reset } = useForm({ mode: "all" });
    const [loading, setLoading] = useState(false)
    const [minuteError, setMinuteError] = useState("")
    const [minute, setMinute] = useState()
    let dispatch = useDispatch()


    const minuteHandler = (data) => {
        let intMinutes = parseInt(data?.minutes)
        Object.assign(data, { pysician_id: modalAllVal.id })
        Object.assign(data, { minutes: intMinutes })
        setLoading(true)
        dispatch(addMinutePhysician(data)).then(res => {
            if (res.status === 201) {
                setLoading(false)
                handleOpenModal('CommonPop', { header: "Success", body: res.data.message, auth: true })
            } else {
                setLoading(false)
                handleOpenModal('CommonPop', { header: "error", body: res.data.message, auth: true })
            }
        }).catch(error => {
            setLoading(false)
            handleOpenModal('CommonPop', { header: "error", body: error.message, auth: true })
        })
        // if (data?.minutes < 0) {
        //     setMinuteError("minute should not be negative")
        // }
        // else {
        //     dispatch(addMinute(data)).then(res => {
        //         if (res.status === 201) {
        //
        //             handleOpenModal('CommonPop', { header: "Success", body: res.data.message, auth: true })
        //         } else {
        //             handleOpenModal('CommonPop', { header: "error", body: res.data.message, auth: true })
        //         }
        //     }).catch(error => {
        //         handleOpenModal('CommonPop', { header: "error", body: error.message, auth: true })
        //     })
        // }
    }

    // const handleChangeMinute = (e) => {
    //     let value = e.target.value;
    //     if (value < 0) {
    //         setMinuteError("minute should not be negative")
    //     }
    //     setMinute(value)
    // }

    useEffect(()=>{
        reset()
    },[handleOpenModal])
    return (

        <div className="custom_modal">
            <h3 className="form_heading text_center">Add Minutes</h3>
            <div className="form">
                <form onSubmit={handleSubmit(minuteHandler)}>
                    <div className="form_group">
                        <div className="form_group">
                            <label htmlFor=""><h5>Minute</h5></label>
                            {/*<span className={`fill ${!errors?.minutes?.message ? (watch("minutes")) ? 'valid' : "" : errors?.minutes?.message ? 'invalid' : ""}`}>*/}
                            <span className={`fill valid`}>
                                <input type="text" className="form_control disabled" name="minutes"  id="" value={modalAllVal?.minute}
                                    // onChange={handleChangeMinute}
                                    ref={
                                        register({
                                            required: 'Fill the minute field',
                                        })} />
                                {/*{errors.minutes && (*/}
                                {/*    <p className="errorMsg">{errors?.minutes?.message}</p>*/}
                                {/*)}*/}
                                {/*{*/}
                                {/*    minute < 0 ? <p className="errorMsg">{minuteError}</p> : null*/}
                                {/*}*/}
                            </span>
                        </div>
                        <div className="form_group  form_action mt_5">
                            <button className='btn btn_default' type='reset' onClick={() => handleOpenModal()} >Cancel</button>
                            <FilledButton type="submit" loading={loading} value={'Submit'} className="btn btn_primary ml_2"  />
                            {/*<button className='btn btn_primary ml_2' type='submit'>Submit</button>*/}
                        </div>
                    </div>
                </form>
            </div>
        </div>

    )
}

export default AddMinutePop
