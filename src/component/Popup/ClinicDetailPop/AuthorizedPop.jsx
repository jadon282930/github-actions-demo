import avatar from '../../../assets/images/avatar.png'
import icon_plus from '../../../assets/images/icon_plus.svg'
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import Validation from "../../formValidation";
import { formatPhoneNumber, numberValidate } from "../../../utils";
import { useDispatch } from "react-redux";
import {
    addAuthorizedPerson
} from "../../../redux/Clinic/action";
import PopComponent from "../../../hoc/PopContent";
import CustomModal from "../../../hoc/CustomModal";
import FilledButton from "../../FilledButton";

export const AuthorizedPop = ({ clinicId, handleOpenModal, modalAllVal, openModal }) => {
    const [loading, setLoading] = useState(false)
    const [modalName, setModalName] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [modalVal, setModalVal] = useState('')
    let ModalData = PopComponent[modalName]
    const { register, watch, errors, formState, handleSubmit, setValue, reset } = useForm({ mode: "all" });
    const [profile, setProfile] = useState('')
    const dispatch = useDispatch()

    //Add Auth user Data
    const addAuthorizedHandler = (state) => {
        let payload = {
            contact: {
                ...state,
                first_name:state?.first_name?.trimEnd(),
                phone:state?.phone?.replace(/[ ()-]/g,""),
            },
            clinic_id: modalAllVal._id ? modalAllVal._id : clinicId
        }
        if (profile) { Object.assign(payload, { image: profile }) }
        setLoading(true)
        dispatch(addAuthorizedPerson(payload)).then(res => {
            if (res.status === 201) {
                setLoading(false)
                handleOpenModal('CommonPop', { header: "Success", body: res.data.message, auth: true })
            } else {
                setLoading(false)
                handleOpenModalError('CommonPop', { header: "Info", body: res.data.message, auth: true })
            }
        }).catch(e => {
            handleOpenModalError('CommonPop', { header: "Error", body: e.message, auth: true })
            setLoading(false)
        })
    }
    useEffect(() => {
        reset()
        setProfile('')
    }, [handleOpenModal])
const clearDataHandler = ()=>{
    setProfile('')
    reset()
}

    const profileHandler = (e) => {          
        setProfile(e.target.files[0])
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
    return (
        <>
            <div className="custom_modal">

                <form onSubmit={handleSubmit(addAuthorizedHandler)}>
                    <h3 className="form_heading text_center"> {"Add a authorized User"}</h3>
                    <div className="form authorized_form">
                        <div className="form_group authorized_profile">
                            <div className="user_profile">
                                <div className="user_profile_pic">
                                    <img src={profile ? URL.createObjectURL(profile) : avatar} alt="" />
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
                                    <span className={`fill ${!errors?.first_name?.message ? (watch("first_name")) ? 'valid' : "" : errors?.first_name?.message ? 'invalid' : ""}`}>
                                        <input type="text" name="first_name" id="" className="form_control"
                                            onChange={(e) => {
                                                setValue('first_name', e.target.value.trimStart())
                                            }}
                                            ref={register({
                                                required: "First Name is Required",
                                                pattern: {
                                                    value: /^[A-Za-z ]+$/,
                                                    message:
                                                        "Should allow only alphabet characters"

                                                }
                                            })}
                                        />
                                    </span>
                                    <Validation errors={errors.first_name} message={errors?.first_name?.message} watch={watch("first_name")} />
                                </div>
                                <div className="form_group col-6">
                                    <label htmlFor="">Last Name</label>
                                    <span className={`fill ${!errors?.last_name?.message ? (watch("last_name")) ? 'valid' : "" : errors?.last_name?.message ? 'invalid' : ""}`}>
                                        <input type="text" className="form_control" name="last_name"
                                            onChange={(e) => {
                                                setValue('last_name', e.target.value.trimStart())
                                            }}
                                            id="" ref={register({
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
                                <span className={`fill ${!errors?.email?.message ? (watch("email")) ? 'valid' : "" : errors?.email?.message ? 'invalid' : ""}`}>
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
                                    <select name="phone_type" id="" className={`${watch("phone_type")} form_control`}  ref={register({required: watch("phone") ? 'Phone Type is Required' :  false})}>
                                        <option value={''}  >Select Phone Type</option>
                                        <option value={'Mobile'}  >Mobile</option>
                                        <option value={'Work'}  >Work</option>
                                    </select>
                                    <Validation errors={errors.phone_type} message={errors?.phone_type?.message} watch={watch("phone")} />
                                </div>
                            </div>
                            <div className="form_group d_flex justify_content_center form_action mt_5">
                                <button type={'reset'} className='btn btn_default' onClick={() => clearDataHandler()} >Clear</button>
                                <FilledButton type="submit" loading={loading} value={'Submit'} className="btn_primary ml_2"  />
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

export default AuthorizedPop