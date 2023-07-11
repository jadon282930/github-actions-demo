import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import {
    clearClinic,
    getclinic,
    getCountryData,
    getStateData,
    updateclinicList
} from "../../../redux/Clinic/action";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import CustomModal from "../../../hoc/CustomModal";
import PopComponent from "../../../hoc/PopContent";
import Validation from "../../formValidation"
import FilledButton from "../../FilledButton";
import Loader from '../../Loader';
import Clinic_logo from "../../../assets/images/clinic-logo.png";
import icon_plus from "../../../assets/images/icon_plus.svg";

const EditClinicDetailPop = ({ handleOpenModal }) => {
    const { id: clinicId } = useParams();
    const dispatch = useDispatch()
    const country = useSelector(state => state?.clinicReducer?.countryData)
    const getMinutesData = useSelector(state => state?.clinicReducer?.getMinute)
    const [isEdit, setIsEdit] = useState(false)
    const edit_clinic_item = useSelector(state => state.clinicReducer.getClinicData)
    const { register, watch, errors, formState, handleSubmit, setValue, reset, setError } = useForm({ mode: "all" });
    const [sameBiling, setSameBilling] = useState(false)
    const [checkValue, setCheckValue] = useState(false)
    const [bussines, setBussines] = useState([])
    const [billing, setBilling] = useState([])
    const [loading, setLoading] = useState(false)
    const [modalName, setModalName] = useState('')
    const [loader, setLoader] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [modalVal, setModalVal] = useState('')
    const watchAllFields = watch();
    const [billingMinuteVal, setBillingMinuteVal] = useState()
    const [validationImg,setValidationImg]=useState(null)
    const [profile, setProfile] = useState(null)
    const [minuteDataShow, setMinuteDataShow] = useState(false)
    let ModalData = PopComponent[modalName]

    useEffect(() => {
        dispatch(getCountryData())
    }, [dispatch])
    useEffect(() => {
        if (clinicId) {
            setIsEdit(true)
            setLoader(true)
            dispatch(getclinic({ id: clinicId })).then(res => {
                if (res.data === 200) {
                    setLoader(false)
                } else {
                    setLoader(false)
                }
            })
        }
    }, [clinicId])
    useEffect(() => {
        if (!isEdit) {
            dispatch(clearClinic())
        }
    }, [])

    useEffect(() => {
        if ((Object.keys(edit_clinic_item || {}).length > 0 && edit_clinic_item._id === clinicId)) {
            const { billing_address, business_address } = edit_clinic_item;
            delete billing_address?.[0]?._id;
            delete business_address?.[0]?._id;
            if (Object.entries(business_address[0]).flat().join() === Object.entries(billing_address[0]).flat().join()) {
                setCheckValue(true)
            } else {
                setCheckValue(false)
            }
        }
    }, [edit_clinic_item, isEdit, clinicId])

    useEffect(() => {
        if (isEdit && country.length > 0 && edit_clinic_item) {
            setValue('billing_street', edit_clinic_item?.billing_address?.[0]?.street)
            setValue('billing_city', edit_clinic_item?.billing_address?.[0]?.city)
            setValue('billing_zipCode', edit_clinic_item?.billing_address?.[0]?.zipcode)
            setValue('clinic_name', edit_clinic_item?.clinic_name)
            setValue('business_street', edit_clinic_item?.business_address?.[0]?.street)
            setValue('business_city', edit_clinic_item?.business_address?.[0]?.city)
            setValue('business_zipCode', edit_clinic_item?.business_address?.[0]?.zipcode)
            setValue('billing_period_meeting_minutes', edit_clinic_item?.billing_period_meeting_minutes === "unlimited" ? "Unlimited" : edit_clinic_item?.billing_period_meeting_minutes)
            setValue('business_country', edit_clinic_item?.business_address?.[0]?.country)
            setValue('billing_country', edit_clinic_item?.billing_address?.[0]?.country)
            if(edit_clinic_item?.billing_address?.[0]?.country?.length > 0  && edit_clinic_item?.business_address?.[0]?.country?.length > 0 ){
                    if(edit_clinic_item?.billing_address?.[0]?.country === edit_clinic_item?.business_address?.[0]?.country){
                        dispatch(getStateData({ country_id: edit_clinic_item?.business_address?.[0]?.country })).then((res) => {
                            if (res.status === 200) {
                                setBussines(res.data.data.states)
                                setValue('business_state', edit_clinic_item?.business_address?.[0]?.state)
                                setBilling(res.data.data.states)
                                setValue('billing_state', edit_clinic_item?.billing_address?.[0]?.state)
                            }
                        })
                    }else{
                        console.log('two')
                        dispatch(getStateData({ country_id: edit_clinic_item?.business_address?.[0]?.country })).then((res) => {
                            if (res.status === 200) {
                                setBussines(res.data.data.states)
                                setValue('business_state', edit_clinic_item?.business_address?.[0]?.state)
                            }
                        })
                        dispatch(getStateData({ country_id: edit_clinic_item?.billing_address?.[0]?.country })).then((res) => {
                            if (res.status === 200) {
                                setBilling(res.data.data.states)
                                setValue('billing_state', edit_clinic_item?.billing_address?.[0]?.state)
                            }
                        })
                    }
            }

        }


    }, [country.length, isEdit, edit_clinic_item?.business_address,handleOpenModal])

    useEffect(() => {
        reset()
    }, [handleOpenModal])
    const editClinicHandler = (state) => {

        let payload = {
            id: clinicId,
            clinic_name: state.clinic_name,
            business_address: { street: state.business_street, city: state.business_city, state: state.business_state, zipcode: state.business_zipCode, country: state.business_country },
            billing_address: { street: state.billing_street, city: state.billing_city, state: state.billing_state, zipcode: state.billing_zipCode, country: state.billing_country },
            billing_period_meeting_minutes: state.billing_period_meeting_minutes
        }
        setLoading(true)
        if(profile) {Object.assign(payload,{image:profile})}
        dispatch(updateclinicList(payload))
            .then(res => {
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
    const handleOpenModalError = (type, data) => {
        switch (type) {
            case "CommonPop": {
                setModalVal(data)
                setModalName(type);
                setModalOpen(true)
            }
                break;
            case 'ChangeMinutes': {
                setModalVal(data)
                setModalName(type)
                setModalOpen(true)
            }
                break
            default: {
                setModalOpen(!modalOpen);
            }
        }
    }
    const billingAddHandler = (e) => {
        let target = e.target;
        if (target.checked) {
            dispatch(getStateData({ country_id: edit_clinic_item?.business_address?.[0]?.country })).then((res) => {
                if (res.status === 200) {
                    setBilling(res.data.data.states)
                    setValue('billing_state', watchAllFields.business_state)
                }
            })
            setSameBilling(true)
            setValue('billing_street', watchAllFields.business_street)
            setValue('billing_city', watchAllFields.business_city)
            setValue('billing_state', watchAllFields.business_state)
            setValue('billing_zipCode', watchAllFields.business_zipCode)
            setValue('billing_country', watchAllFields.business_country)
            isEdit && setCheckValue(!checkValue);
        } else {
            setSameBilling(false)
            let data = ['billing_street', 'billing_city', 'billing_state', 'billing_zipCode', 'billing_country']
            data.forEach(ele => {
                setValue(ele, "")
            })
            isEdit && setCheckValue(!checkValue);
        }
    }

    const selectCountry = (e) => {
        e.preventDefault();
        if (e.target.name === 'business_country') {
            setValue('business_state', '')
            dispatch(getStateData({ country_id: e.target.value })).then((res) => {
                if (res.status === 200) {
                    setBussines(res.data.data.states)
                }
            })
        }
        if (e.target.name === 'billing_country') {
            setValue('billing_state', '')
            dispatch(getStateData({ country_id: e.target.value })).then((res) => {
                if (res.status === 200) {
                    setBilling(res.data.data.states)
                }
            })
        }
    }

    const meetingMinutesChangeHandler = (e) => {
        setBillingMinuteVal(e.target.value)
        handleOpenModalError('ChangeMinutes')
    }
    const cancelMinuteData = () => {
        handleOpenModalError();
        setValue('billing_period_meeting_minutes', edit_clinic_item?.billing_period_meeting_minutes === "unlimited" ? "Unlimited" : edit_clinic_item?.billing_period_meeting_minutes)
    }
    const changeMinuteData = () => {
        setValue('billing_period_meeting_minutes', billingMinuteVal)
        handleOpenModalError('CommonPop', { header: "Success", body: 'add Minute Successfully', auth: true })
        setMinuteDataShow(true)
    }

    const clearHandler = () =>{
        for (const [key, value] of Object.entries(watchAllFields)) {
            setValue(key,"")
        }
        setProfile(null)
        setCheckValue(false)
    }
    const Filevalidation = (fi) => {
        if (fi.length > 0) {
            for (const i = 0; i <= fi.length - 1; i++) {
                const fsize = fi.item(i).size;
                const file = Math.round((fsize / 1024));
                if (file >= 2048) {
                    setProfile(null)
                    setValidationImg("File too Big, please select a file less than 2mb")
                }else{
                    setValidationImg(null)
                }
            }
        }
    }
    const profileClinicHandler = (e)=>{
        setProfile(e.target.files[0])
        Filevalidation(e.target.files)
    }
    return (
        <>
            <div className='content_wrapper edit-clinic-modal'>
                {
                    <div className="edit_clinic_block">
                        <h3 className="form_heading text_center">Update Clinic</h3>
                        <div className={loader ? "hs_comman_modal_block clinic_detail_loader_data update-clinic_main" : "hs_comman_modal_block update-clinic_main"}>
                            {
                                loader ?
                                    <Loader className={'content-loader'} />
                                    :
                                    <>
                                        <form className='update-clinic_form' onSubmit={handleSubmit(editClinicHandler)}>
                                            <div className="card">
                                                <div className="form_group">
                                                    <label htmlFor="">Clinic Name</label>
                                                    <span className={`fill ${!errors?.clinic_name?.message ? (watch("clinic_name")) ? 'valid' : "" : errors?.clinic_name?.message ? 'invalid' : ""}`}>
                                                        <input type="text"
                                                            onChange={(e) => {
                                                                setValue('clinic_name', e.target.value.trimStart())
                                                            }}
                                                            ref={register({
                                                                required: "Clinic Name is Required", pattern: {
                                                                    value: /^[A-Za-z ]+$/,
                                                                    message:
                                                                        "Should allow only alphabet characters"
                                                                }
                                                            })} id=""
                                                            className={"form_control"}
                                                               defaultValue={edit_clinic_item?.clinic_name}
                                                            name="clinic_name" />
                                                    </span>
                                                    <Validation errors={errors.clinic_name} message={errors?.clinic_name?.message} watch={watch("clinic_name")} />
                                                </div>
                                            </div>

                                            <div className="fullWidth mb_2">
                                                <span className={`pl_3 fill ${(!errors?.business_street?.message && !errors?.business_city?.message && !errors?.business_zipCode?.message && !errors?.business_country?.message && !errors?.business_state?.message) ? ((watch("business_street") && watch("business_city") && watch("business_zipCode") && watch("business_country") && watch("business_state"))) ? 'valid' : "" :
                                                    (errors?.business_street?.message && errors?.business_city?.message && errors?.business_zipCode?.message && errors?.business_country?.message && errors?.business_state?.message) ? 'invalid' : ""}`}>Business Address</span>
                                            </div>
                                            <div className="card card_bg_gray" >
                                                <div className="col-9 sub_comman_card">
                                                    <div className="form_group">
                                                        <label className="pl_1">Street</label>
                                                        <input type="text" name="business_street" id=""
                                                            className={`form_control`}
                                                            onChange={(e) => {
                                                                setValue('business_street', e.target.value.trimStart())
                                                            }}
                                                            ref={register({
                                                                required: "Street is Required", maxLength: {
                                                                    value: 200,
                                                                    message: "street should allow only 200 characters.",
                                                                }
                                                            })} defaultValue={edit_clinic_item?.business_address?.[0]?.street} />
                                                    </div>
                                                    <div className="form_row">
                                                        <div className="form_group col-6">
                                                            <label className="pl_1">City</label>

                                                            <input type="text" name="business_city"
                                                                onChange={(e) => {
                                                                    setValue('business_city', e.target.value.trimStart())
                                                                }}
                                                                id="" className="form_control" ref={register({
                                                                    required: "City is Required", maxLength: {
                                                                        value: 15,
                                                                        message: "city should allow only 15 characters.",
                                                                    }
                                                                })} defaultValue={edit_clinic_item?.business_address?.[0]?.city}/>
                                                        </div>
                                                        <div className="form_group col-6 ml_3">
                                                            <label className="pl_1">Zip Code</label>

                                                            {
                                                                isEdit && edit_clinic_item ?
                                                                    <input type="text" name="business_zipCode"
                                                                        onChange={(e) => {
                                                                            setValue('business_zipCode', e.target.value.trimStart())
                                                                        }}
                                                                        id="" className="form_control" ref={register({
                                                                            required: "ZipCode  is Required",
                                                                            pattern: {
                                                                                value: /^[0-9 !-@#$%^&*)(]{1,14}$/,
                                                                                message:
                                                                                    "Should allow only Numeric Value"
                                                                            },

                                                                        })}  defaultValue={edit_clinic_item?.business_address?.[0]?.zipcode} />
                                                                    :
                                                                    <input type="text" name="business_zipCode" id="" className="form_control" ref={register({ required: "ZipCode is Required" })} />
                                                            }
                                                            {/*<input type="text" name="business_zipCode" defaultValue={edit_clinic_item?.business_address?.[0]?.zipcode} id="" className="form_control" ref={register({required:"ZipCode is Required"})}/>*/}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form_row">
                                                    <div className="form_group col-6">
                                                        <label className="pl_1">Country</label>
                                                        <select
                                                            name="business_country"
                                                            onChange={(e) => selectCountry(e)}
                                                            className={`${watch('business_country')} form_control`}
                                                            ref={register({ required: "Country is Required" })}
                                                            defaultValue={edit_clinic_item?.business_address?.[0]?.country}
                                                        >
                                                            <option value="">Select</option>
                                                            {
                                                                country.length > 0 && country?.map((item, i) => {
                                                                    return (
                                                                        <option value={item.id} key={item.id}>{item.name}</option>
                                                                    )
                                                                })
                                                            }

                                                        </select>
                                                    </div>
                                                    <div className="form_group col-6">
                                                        <label className="pl_1">State</label>
                                                        <select name="business_state"

                                                            defaultValue={edit_clinic_item?.business_address?.[0]?.state}
                                                            id="" className="form_control" ref={register({ required: "State is Required" })}>
                                                            <option value="">Select</option>{
                                                                bussines.length > 0 ?
                                                                    bussines.map((item, i) => {
                                                                        return (
                                                                            <option value={item.id} key={item.id} >{item.name}</option>
                                                                        )
                                                                    }) : " "

                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <Validation errors={errors.business_street || errors.business_city || errors.business_zipCode || errors.business_country || errors.business_state} message={errors?.business_street?.message || errors?.business_city?.message || errors?.business_zipCode?.message || errors?.business_country?.message || errors?.business_state?.message} watch={(watch("business_street") || watch("business_city") || watch("business_zipCode") || watch("business_country") || watch("business_state"))} />
                                            <div className="card d_flex justify_content_between billing_card">
                                                <label htmlFor="" className='billing_label'>Billing Address</label>
                                                {/*<div className="form_group checkbox">*/}
                                                {/*    <input type="checkbox" id='checkbox_above' checked={isEdit && checkValue ? true : ''} onChange={billingAddHandler} />*/}
                                                {/*    <span className='checkbox_clone'/>*/}
                                                {/*    <label htmlFor="checkbox_above">Same As Above</label>*/}
                                                {/*</div>*/}
                                            </div>

                                            <div className="card card_bg_gray">
                                                <div className="col-9 sub_comman_card">
                                                    <div className="form_group">
                                                        <label className="pl_1">Street</label>
                                                        <input
                                                            type="text" name="billing_street"
                                                            onChange={(e) => {
                                                                setValue('billing_street', e.target.value.trimStart())
                                                            }}
                                                            defaultValue={edit_clinic_item?.billing_address?.[0]?.street}
                                                            id="" className={"form_control"} ref={register()} />
                                                    </div>
                                                    <div className="form_row">
                                                        <div className="form_group col-6">
                                                            <label className="pl_1">City</label>
                                                            <input type="text" name="billing_city"
                                                                onChange={(e) => {
                                                                    setValue('billing_city', e.target.value.trimStart())
                                                                }}
                                                                id="" className={"form_control"} ref={register({
                                                                    pattern: {
                                                                        value: /^[A-Za-z ]+$/,
                                                                        message:
                                                                            "Should allow only alphabet characters"
                                                                    },
                                                                    maxLength: {
                                                                        value: 15,
                                                                        message: "City should allow only 15 characters.",
                                                                    },
                                                                })} defaultValue={edit_clinic_item?.billing_address?.[0]?.city} />
                                                        </div>
                                                        <div className="form_group col-6 ml_3">
                                                            <label className="pl_1">Zip Code </label>

                                                            <input type="text" name="billing_zipCode"
                                                                onChange={(e) => {
                                                                    setValue('billing_zipCode', e.target.value.trimStart())
                                                                }} maxLength={6} id=""
                                                                className={"form_control"} ref={register({
                                                                    pattern: {
                                                                        value: /^[0-9 !-@#$%^&*)(]{1,14}$/,
                                                                        message:
                                                                            "Should allow only Numeric Value"
                                                                    },
                                                                })} defaultValue={edit_clinic_item?.billing_address?.[0]?.zipcode}/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form_row">
                                                    <div className="form_group col-6">
                                                        <label className="pl_1">Country</label>
                                                        <select name="billing_country"
                                                            id=""
                                                            defaultValue={edit_clinic_item?.billing_address?.[0]?.country}
                                                            onChange={(e) => selectCountry(e)}
                                                            className={"form_control"}
                                                            ref={register()}
                                                        >

                                                            <option value="">Select</option>
                                                            {
                                                                country?.map((item, i) => {
                                                                    return (
                                                                        <option value={item.id} key={item.id}>{item.name}</option>
                                                                    )
                                                                })
                                                            }
                                                        </select>
                                                    </div>
                                                    <div className="form_group col-6">
                                                        <label className="pl_1">State</label>
                                                        <select name="billing_state"
                                                            defaultValue={edit_clinic_item?.billing_address?.[0]?.state}
                                                            className={"form_control"}
                                                            ref={register()}
                                                        >
                                                            <option value="">Select</option>
                                                            {
                                                                billing?.map((item, i) => {
                                                                    return (
                                                                        <option value={item.id} key={item.id} >{item.name}</option>
                                                                    )
                                                                })
                                                            }
                                                            {/* } */}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="card">
                                                <div className="form_group">
                                                    <label htmlFor="">Billing Period Meeting Minutes (per physician)</label>
                                                    <select name="billing_period_meeting_minutes" defaultValue={edit_clinic_item?.billing_period_meeting_minutes === "unlimited" ? "Unlimited" : edit_clinic_item?.billing_period_meeting_minutes} id="" className={`${watch('billing_period_meeting_minutes')} form_control col-5 montserrat_semibold`} ref={register()} onChange={(e) => meetingMinutesChangeHandler(e)}>
                                                        <option value="">Select</option>
                                                        {
                                                            getMinutesData?.length > 0 &&
                                                            getMinutesData?.map((item) => {
                                                                return <option value={item?.minutes === 'unlimited' ? 'Unlimited' : item?.minutes} selected={item?.minutes === '300' ? true : false} key={item.minutes}>{item?.minutes}</option>
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                                {
                                                    edit_clinic_item?.upcoming_clinic_billing_minute &&
                                                    <h5 className={'errorMsg'}>This plan will change to {edit_clinic_item?.upcoming_clinic_billing_minute} min
                                                        / physician from next billing cycle</h5>
                                                }

                                                <div className="form_group d_flex justify_content_center form_action">
                                                    <button className='btn btn_default' type={'button'} onClick={() => clearHandler()}>Clear</button>
                                                    <FilledButton type={'submit'} loading={loading} value={'Submit'} className="btn btn_primary ml_2" />
                                                </div>
                                            </div>
                                        </form>
                                        <div className='form_group profile_main'>
                                            <div className='user_profile'>
                                                <div className='user_profile_pic'>
                                                    <img className='clinic-logo_img'
                                                        src={(!validationImg && profile)? URL.createObjectURL(profile) :edit_clinic_item?.clinic_logo?edit_clinic_item?.clinic_logo :  Clinic_logo}
                                                        alt='' />
                                                    <span className="addnew">
                                                        <img src={icon_plus} alt="" />
                                                        <input type="file" name="profile" onChange={(e)=>profileClinicHandler(e)} />
                                                    </span>
                                                </div>
                                                <label htmlFor="" className="profile_label">Clinic Logo</label>
                                                <span className='logo-notice'>(Maximum image size is 2MB)</span>
                                                <Validation errors={validationImg} message={validationImg}  />
                                            </div>
                                        </div>
                                    </>
                            }
                            
                        </div>
                    </div>
                }
            </div>

            <CustomModal className={`${modalName === 'CommonPop' ? "modal errorPop" :modalName === 'ChangeMinutes'? 'modal deletePop' : "modal addPhy"}`} modalName={modalName} modalIsOpen={modalOpen} handleOpenModal={handleOpenModalError}>
                <ModalData  handleOpenModal={handleOpenModalError} modalAllVal={modalVal}  loading={loading} cancelMinuteData={cancelMinuteData} changeMinuteData={changeMinuteData} />
            </CustomModal>

        </>
    )
}

export default EditClinicDetailPop

