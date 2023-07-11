import React, { useEffect, useState } from "react";
import icon_plus from "../../../assets/images/icon_plus.svg";
import Validation from "../../formValidation";
import {formatPhoneNumber, numberValidate} from "../../../utils";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {  updateAuthUser } from "../../../redux/Clinic/action";
import PopComponent from "../../../hoc/PopContent";
import CustomModal from "../../../hoc/CustomModal";
import FilledButton from "../../FilledButton";
import user from '../../../assets/images/avatar.png'


const EditAuthorizedPop = ({ clinicId, editAuthId, handleOpenModal }) => {
    const editAuth = useSelector(state => state?.clinicReducer?.authUser)
    const { register, watch, errors, handleSubmit, setValue, reset } = useForm({ mode: "all" });
    const [profile, setProfile] = useState('')
    const dispatch = useDispatch(null);
    const [loading, setLoading] = useState(false)
    const [modalName, setModalName] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [modalVal, setModalVal] = useState('')
    let ModalData = PopComponent[modalName]

    useEffect(() => {
        reset();
        setProfile('')
    }, [handleOpenModal])
    useEffect(() => {
        setValue('phone_type', editAuth?.phone_type)
        setValue("first_name", editAuth?.first_name)
        setValue("last_name", editAuth?.last_name)
        setValue("email", editAuth?.email)
        setValue('phone', formatPhoneNumber(editAuth?.phone))
    }, [editAuth])

    const profileHandler = (e) => {
        setProfile(e.target.files[0])
    }
    const editAuthUserHandler = (state) => {
        Object.assign(state, { user_id: editAuthId })
        let payload = {
            contact: {
                ...state,
                first_name:state?.first_name?.trimEnd(),
                phone:state?.phone?.replace(/[ ()-]/g,"")
            }
        }
        setLoading(true)
        if (profile) Object.assign(payload, { image: profile })
        dispatch(updateAuthUser(payload)).then(res => {
            if (res.status === 201) {
                setLoading(false)
                handleOpenModal('CommonPop', { header: "Success", body: res.data.message, auth: true })
            } else {
                setLoading(false)
                handleOpenModalError('CommonPop', { header: "Error", body: 'Duplicate email id', auth: true })
            }
        }).catch(e => {
            handleOpenModalError('CommonPop', { header: "Error", body: 'Duplicate email id', auth: true })
            setLoading(false)
        })
    }

    const handleOpenModalError = (type, data) => {
        switch (type) {
            case "CommonPop": {
                setModalVal(data)
                setModalName(type);
                setModalOpen(true)
            }
                break;
            default: {
                setModalOpen(!modalOpen);
            }
        }
    }

    const clearDataHandler = ()=>{
        setProfile('')
        reset()
    }
    
    return (
        <>
            <div className="custom_modal">
                <form onSubmit={handleSubmit(editAuthUserHandler)}>
                    <h3 className="form_heading text_center"> {"Edit authorized User"}</h3>
                    <div className="form authorized_form">
                        <div className="form_group authorized_profile">
                            <div className="user_profile">
                                <div className="user_profile_pic">
                                    <img src={profile ? URL.createObjectURL(profile) : editAuth?.profile? editAuth?.profile : user} alt="" />
                                    <span className='addnew'><img src={icon_plus} alt="" /> <input type="file" name="" id="" onChange={(e) => profileHandler(e)} /> </span>
                                </div>
                                <label htmlFor="">Profile Photo</label>
                                <p className="errorMsg"/>
                            </div>
                        </div>
                        <div className='authorized_form_model'>
                            <div className="form_row">
                                <div className="form_group col-6">
                                    <label htmlFor="">First Name</label>
                                    <span className={`fill ${!errors?.first_name?.message ? watch("first_name") ? 'valid' : "" : errors?.first_name?.message ? 'invalid' : ""}`}>
                                        <input type="text" name="first_name" id=""
                                            onChange={(e) => {
                                                setValue('first_name', e.target.value.trimStart())
                                            }}
                                            className={`${watch("first_name")} form_control`} ref={register({
                                                required: "First Name is Required",
                                                pattern: {
                                                    value: /^[A-Za-z ]+$/,
                                                    message:
                                                        "Should allow only alphabet characters"
                                                }
                                            })} />
                                    </span>


                                    <Validation errors={errors.first_name} message={errors?.first_name?.message} watch={watch("first_name")} />
                                </div>
                                <div className="form_group col-6">
                                    <label htmlFor="">Last Name</label>
                                    <span className={`fill ${!errors?.last_name?.message ? watch("last_name") ? 'valid' : "" : errors?.last_name?.message ? 'invalid' : ""}`}>
                                        <input type="text" name="last_name" id=""
                                            onChange={(e) => {
                                                setValue('last_name', e.target.value.trimStart())
                                            }}
                                            className="form_control" ref={register({
                                                required: "Last Name is Required", pattern: {
                                                    value: /^[A-Za-z ]+$/,
                                                    message:
                                                        "Should allow only alphabet characters"
                                                }
                                            })} />
                                    </span>
                                    <Validation errors={errors.last_name} message={errors?.last_name?.message} watch={watch("last_name")} />
                                </div>
                            </div>
                            <div className="form_group">
                                <label htmlFor="">Email</label>
                                <span className={`fill ${!errors?.email?.message ? watch("email") ? 'valid' : "" : errors?.email?.message ? 'invalid' : ""}`}>
                                    <input type="text"
                                        name="email" id=""
                                        className="form_control"
                                        onChange={(e) => {
                                            setValue('email', e.target.value.trim())
                                        }}
                                        ref={register({
                                            required: "Email is Required",
                                            pattern: {
                                                value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                                                message: "Please enter a valid email",
                                            },
                                        })} /></span>
                                <Validation errors={errors.email} message={errors?.email?.message} watch={watch("email")} />
                            </div>
                            <div className="form_row">
                                <div className="form_group col-6">
                                    <label htmlFor="">Contact Phone</label>
                                    <input
                                        type="tel"
                                        inputMode="numeric"
                                        maxLength={10}
                                        className={`form_control`}
                                        placeholder='(222) 222-2222'
                                        name="phone"
                                        onChange={(e) => {
                                            const { value } = e.target
                                            e.target.value = formatPhoneNumber(value)
                                        }}
                                        ref={register({
                                            pattern: {
                                                value: /^[0-9 !-@#$%^&*)(]{1,14}$/,
                                                message:
                                                    "Should allow only Numeric Value"
                                            },
                                            validate: numberValidate
                                        })}
                                    />
                                    <Validation errors={errors.phone} message={errors?.phone?.message} watch={watch("phone")} />
                                </div>
                                <div className="form_group col-6">
                                    <label htmlFor="">Phone Type</label>
                                    <select name="phone_type" id="" defaultValue={editAuth?.phone_type} className={`${watch("phone_type")} form_control`} ref={register({   required: watch("phone") ? 'Phone Type is Required' :  false})} >
                                        <option value={''}  >Select Phone Type</option>
                                        <option value={'Mobile'}  >Mobile</option>
                                        <option value={'Work'}  >Work</option>
                                    </select>
                                    <Validation errors={errors.phone_type} message={errors?.phone_type?.message} watch={watch("phone")} />
                                </div>
                            </div>
                            <div className="form_group d_flex justify_content_center form_action mt_5">
                                <button type={'reset'} className='btn btn_default' onClick={() => clearDataHandler()}>Clear</button>
                                <FilledButton type={'submit'} loading={loading} value={'Submit'} className="btn btn_primary ml_2"  />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <CustomModal className={`${modalName === 'CommonPop' ? "modal errorPop" : "modal addPhy"}`} modalName={modalName} modalIsOpen={modalOpen} handleOpenModal={handleOpenModalError}>
                <ModalData handleOpenModal={handleOpenModalError} modalAllVal={modalVal} loading={loading} />
            </CustomModal>
        </>
    )
}
export default EditAuthorizedPop