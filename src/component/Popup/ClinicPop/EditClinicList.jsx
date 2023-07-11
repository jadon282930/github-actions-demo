import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import {
    addStoreClinic,
    clearClinic,
    getclinic, getCountryData,
    getStateData,
    updateclinicList
} from "../../../redux/Clinic/action";
import { useDispatch, useSelector } from "react-redux";
import history from "../../../history";
import { useParams } from 'react-router-dom';
import CustomModal from "../../../hoc/CustomModal";
import PopComponent from "../../../hoc/PopContent";
import { formatPhoneNumber, numberValidate } from "../../../utils";
import Validation from "../../../component/formValidation"
import CommonPop from "../../../component/Popup/CommonPop";
import FilledButton from '../../FilledButton';



const ClinicInfo = () => {
    const { id: clinicId } = useParams();
    const dispatch = useDispatch()
    const country = useSelector(state => state?.clinicReducer?.countryData)
    const stateData = useSelector(state => state?.clinicReducer?.stateData)
    const [modalAllVal, setModalAllVal] = useState({})
    const [modalName, setModalName] = useState()
    let ModalData = PopComponent[modalName]
    const [openModal, setModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false)
    const edit_clinic_item = useSelector(state => state.clinicReducer.getClinicData)
    const { register, watch, errors, formState, handleSubmit, setValue, reset } = useForm({ mode: "all" });
    const watchFields = watch(["business_street", "business_city", "clinic_name", "business_zipCode", "billing_street", "billing_city",
        "billing_zipCode", "business_country", "business_state", "billing_state", "billing_country"]);
    const [sameBiling, setSameBilling] = useState(false)
    const [billingMinuteVal,setBillingMinuteVal] = useState()
    const [checkValue, setCheckValue] = useState(false)
    const [countryId, setCountryId] = useState()
    const [bussines, setBussines] = useState([])
    const [billing, setBilling] = useState([])


    useEffect(() => {
        dispatch(getCountryData())
    }, [dispatch])
    useEffect(() => {
        if (clinicId) {
            setIsEdit(true)
            dispatch(getclinic({ id: clinicId }))
        }
    }, [clinicId])
    useEffect(() => {
        if (isEdit) {
            dispatch(clearClinic())
        }
    }, [])


    useEffect(() => {
        if (edit_clinic_item._id === clinicId) {
            setValue('clinic_name', edit_clinic_item?.clinic_name)
            setValue('business_street', edit_clinic_item?.business_address?.[0]?.street)
            setValue('business_city', edit_clinic_item?.business_address?.[0]?.city)
            setValue('business_zipCode', edit_clinic_item?.business_address?.[0]?.zipcode)
            setValue('billing_street', edit_clinic_item?.billing_address?.[0]?.street)
            setValue('billing_city', edit_clinic_item?.billing_address?.[0]?.city)
            setValue('billing_zipCode', edit_clinic_item?.billing_address?.[0]?.zipcode)
        }
    }, [edit_clinic_item])

    useEffect(() => {
        if ((Object.keys(edit_clinic_item || {}).length > 0 && edit_clinic_item._id === clinicId)) {
            const { billing_address, business_address } = edit_clinic_item;
            delete billing_address[0]._id;
            delete business_address[0]._id;
            if (Object.entries(business_address[0]).flat().join() === Object.entries(billing_address[0]).flat().join()) {
                setCheckValue(true)
            } else {
                setCheckValue(false)
            }
        }
    }, [edit_clinic_item, isEdit, clinicId])

    useEffect(() => {

        if (isEdit && country.length > 0 && edit_clinic_item) {
            setValue('business_country', edit_clinic_item?.business_address?.[0]?.country)
            setValue('billing_country', edit_clinic_item?.billing_address?.[0]?.country)
            setValue('billing_period_meeting_minutes',edit_clinic_item?.billing_period_meeting_minutes === "unlimited" ? "Unlimited" : edit_clinic_item?.billing_period_meeting_minutes)
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


    }, [country.length, isEdit, edit_clinic_item?.business_address])

    const editClinicHandler = (state) => {
        Object.assign(state,{phone:state?.phone?.replace(/[ ()-]/g,"")})
        let payload = {
            id: clinicId,
            clinic_name: state.clinic_name,
            business_address: { street: state.business_street, city: state.business_city, state: state.business_state, zipcode: state.business_zipCode, country: state.business_country },
            billing_address: { street: state.billing_street, city: state.billing_city, state: state.billing_state, zipcode: state.billing_zipCode, country: state.billing_country },
            billing_period_meeting_minutes: state.billing_period_meeting_minutes
        }

        dispatch(updateclinicList(payload))
            .then(res => {
                if (res.status === 201) {
                    handleOpenModal('CommonPop', { header: "Success", body: res.data.message, path: "/clinics" })

                } else {
                    handleOpenModal('CommonPop', { header: "Info", body: res.data.message, auth: true })
                }
            }).catch(e => {
                handleOpenModal('CommonPop', { header: "Info", body: e.message, auth: true })
            })
    }

    const billingAddHandler = (e) => {

        let target = e.target;
        if (target.checked) {
            if (isEdit) {
                dispatch(getStateData({ country_id: edit_clinic_item?.business_address?.[0]?.country })).then((res) => {
                    if (res.status === 200) {
                        setBilling(res.data.data.states)
                        setValue('billing_state', watchFields.business_state)``
                    }
                })
            }
            setSameBilling(true)
            setValue('billing_street', watchFields.business_street)
            setValue('billing_city', watchFields.business_city)
            setValue('billing_state', watchFields.business_state)
            setValue('billing_zipCode', watchFields.business_zipCode)
            setValue('billing_country', watchFields.business_country)
            isEdit && setCheckValue(!checkValue);

        } else {
            setSameBilling(false)
            setValue('billing_street', "")
            setValue('billing_city', "")
            setValue('billing_state', "")
            setValue('billing_zipCode', "")
            setValue('billing_country', "")
            isEdit && setCheckValue(!checkValue);
        }
    }

    const handleOpenModal = (type, data) => {
        switch (type) {
            case "CommonPop": {
                setModalAllVal(data)
                setModalName(type)
                setModalOpen(true)
            }
            break
            case 'ChangeMinutes':{
                setModalAllVal(data)
                setModalName(type)
                setModalOpen(true)
            }
                break
            default: {
                setModalOpen(!openModal);
            }
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
        handleOpenModal('ChangeMinutes')
    }
    const cancelMinuteData = () => {
        handleOpenModal();
        setValue('billing_period_meeting_minutes',edit_clinic_item?.billing_period_meeting_minutes === "unlimited" ? "Unlimited" : edit_clinic_item?.billing_period_meeting_minutes)
    }
    const changeMinuteData = ()=>{
        setValue('billing_period_meeting_minutes',billingMinuteVal)
        handleOpenModal('CommonPop', { header: "Success", body: 'add Minute Successfully', auth:true })
    }



    return (
        <>
        
            <div className='content_wrapper edit-clinic-modal'>
                {
                    <div className="edit_clinic_block">
                        <h3 className="form_heading text_center">Update Clinic</h3>
                        <div className="edit_clinic hs_comman_modal_block">
                            <form onSubmit={handleSubmit(editClinicHandler)}>
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
                                                name="clinic_name" />
                                        </span>
                                        <Validation errors={errors.clinic_name} message={errors?.clinic_name?.message} watch={watch("clinic_name")} />
                                    </div>
                                                <div className='main_form_group'>
                                                    <div className="form_row contact_user_name">
                                                        <div className="form_group col-6">
                                                            <label htmlFor="">Contact First Name</label>
                                                            <span className={`fill ${!errors?.first_name?.message ? (isEdit ? '' : watch("first_name")) ? 'valid' : "" : errors?.first_name?.message ? 'invalid' : ""}`}>
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
                                                            <label htmlFor="">Contact Last Name</label>
                                                            <span className={`fill ${!errors?.last_name?.message ? (isEdit ? '' : watch("last_name")) ? 'valid' : "" : errors?.last_name?.message ? 'invalid' : ""}`}>
                                                                <input type="text" name="last_name" id="" className="form_control"
                                                                    onChange={(e) => {
                                                                        setValue('last_name', e.target.value.trimStart())
                                                                    }}
                                                                    ref={register({
                                                                        required: "Last Name is Required",
                                                                        pattern: {
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
                                                        <label htmlFor="">Contact Email</label>
                                                        <span className={`fill ${!errors?.email?.message ? (isEdit ? '' : watch("email")) ? 'valid' : "" : errors?.email?.message ? 'invalid' : ""}`}>
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
                                                    <div className="form_row contact_user_name">
                                                        <div className="form_group col-6">
                                                            <label htmlFor="">Contact Phone</label>
                                                            <span className={`fill ${!errors?.conatct_number?.message ? (isEdit ? '' : watch("conatct_number")) ? 'valid' : "" : errors?.conatct_number?.message ? 'invalid' : ""}`}>

                                                                <input
                                                                    type="tel"
                                                                    inputMode="numeric"
                                                                    maxLength={10}
                                                                    className={`form_control`}
                                                                    placeholder='(222) 222-2222'
                                                                    name="conatct_number"
                                                                    autoComplete="conatct_number"
                                                                    onChange={(e) => {
                                                                        const { value } = e.target
                                                                        e.target.value = formatPhoneNumber(value)
                                                                    }}
                                                                    ref={register({
                                                                        required: "Contact Number is Required",
                                                                        pattern: {
                                                                            value: /^[0-9 !-@#$%^&*)(]{1,14}$/,
                                                                            message:
                                                                                "Should allow only Numeric Value"
                                                                        },
                                                                        validate: numberValidate
                                                                    })}
                                                                />
                                                            </span>
                                                            <Validation errors={errors.conatct_number} message={errors?.conatct_number?.message} watch={watch("conatct_number")} />
                                                        </div>

                                                        <div className="form_group col-6">
                                                            <label htmlFor="">Phone Type</label>
                                                            <select name="phone_type" id="" className={`${watch("phone_type")}`} className="form_control" ref={register({   required: watch("conatct_number") ? 'Phone Type is Required' :  false})} >
                                                                <option value={''}  >Select Phone Type</option>
                                                                <option value={'Mobile'}  >Mobile</option>
                                                                <option value={'Work'}  >Work</option>
                                                            </select>
                                                            <Validation errors={errors.phone_type} message={errors?.phone_type?.message} watch={watch("phone")} />
                                                        </div>


                                                    </div>
                                                    {/* <div className="skip_for_now_btn">
                                                        <span>(Primary Contact)</span>
                                                    </div> */}
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
                                            <input type="text"  name="business_street" id=""
                                                className={`form_control`}
                                                onChange={(e) => {
                                                    setValue('business_street', e.target.value.trimStart())
                                                }}
                                                ref={register({
                                                    required: "Street is Required", maxLength: {
                                                        value: 200,
                                                        message: "street should allow only 200 characters.",
                                                    }
                                                })} />
                                        </div>
                                        <div className="form_row">
                                            <div className="form_group col-6">
                                                <label className="pl_1">City</label>

                                                <input type="text"name="business_city"
                                                    onChange={(e) => {
                                                        setValue('business_city', e.target.value.trimStart())
                                                    }}
                                                    id="" className="form_control" ref={register({
                                                        required: "City is Required", maxLength: {
                                                            value: 15,
                                                            message: "city should allow only 15 characters.",
                                                        }
                                                    })} />
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

                                                            })} />
                                                        :
                                                        <input type="text" name="business_zipCode" id="" className="form_control" ref={register({ required: "ZipCode is Required" })} />
                                                }
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
                                                                <option value={item.id}  key={item.id}>{item.name}</option>
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
                                    <div className="form_group checkbox">
                                        <input type="checkbox" id='checkbox_above' checked={isEdit && checkValue ? true : ''} onChange={billingAddHandler} />
                                        <span className='checkbox_clone'/>
                                        <label htmlFor="checkbox_above">Same As Above</label>
                                    </div>
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
                                                id="" className={sameBiling ? "form_control disabled" : checkValue ? "form_control disabled" : "form_control"} ref={register()} />
                                        </div>
                                        <div className="form_row">
                                            <div className="form_group col-6">
                                                <label className="pl_1">City</label>  
                                                <input type="text" name="billing_city"
                                                    onChange={(e) => {
                                                        setValue('billing_city', e.target.value.trimStart())
                                                    }}
                                                    id="" className={sameBiling ? "form_control disabled" : checkValue ? "form_control disabled" : "form_control"} ref={register({
                                                        pattern: {
                                                            value: /^[A-Za-z ]+$/,
                                                            message:
                                                                "Should allow only alphabet characters"
                                                        },
                                                        maxLength: {
                                                            value: 15,
                                                            message: "City should allow only 15 characters.",
                                                        },
                                                    })} />
                                            </div>
                                            <div className="form_group col-6 ml_3">
                                                <label className="pl_1">Zip Code </label>
                                          
                                                <input type="text" name="billing_zipCode"
                                                    onChange={(e) => {
                                                        setValue('billing_zipCode', e.target.value.trimStart())
                                                    }} maxLength={6} id=""
                                                    className={sameBiling ? "form_control disabled" : checkValue ? "form_control disabled" : "form_control"} ref={register({
                                                        pattern: {
                                                            value: /^[0-9 !-@#$%^&*)(]{1,14}$/,
                                                            message:
                                                                "Should allow only Numeric Value"
                                                        },

                                                    })} />
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
                                                className={sameBiling ? "form_control disabled" : checkValue ? "form_control disabled" : "form_control"}
                                                ref={register()}
                                            >

                                                <option value="">Select</option>
                                                {
                                                    country?.map((item, i) => {
                                                        return (
                                                            <option value={item.id} key={item.id} >{item.name}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </div>
                                        <div className="form_group col-6">
                                            <label className="pl_1">State</label>
                                            <select name="billing_state"
                                                defaultValue={edit_clinic_item?.billing_address?.[0]?.state}
                                                className={sameBiling ? "form_control disabled" : checkValue ? "form_control disabled" : "form_control"}
                                                ref={register()}
                                            >
                                                <option value="">Select</option>
                                                {
                                                    billing?.map((item, i) => {
                                                        return (
                                                            <option value={item.id}  key={item.id}>{item.name}</option>
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
                                        <select name="billing_period_meeting_minutes" defaultValue={edit_clinic_item?.billing_period_meeting_minutes === "unlimited" ? "Unlimited" : edit_clinic_item?.billing_period_meeting_minutes} id="" className={`${watch('billing_period_meeting_minutes')} form_control col-5 montserrat_semibold`} ref={register()} onChange={(e)=>meetingMinutesChangeHandler(e)}>
                                            <option value="">Select</option>
                                            <option value="300">300</option>
                                            <option value="600">600</option>
                                            <option value="Unlimited">Unlimited</option>
                                        </select>
                                    </div>
                                    <div className="form_group d_flex justify_content_center form_action">
                                        <button className='btn btn_default' type={'reset'} >Clear</button>
                                        <FilledButton type={'submit'}  value={'Submit'} className="btn btn_primary ml_2" />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                }
            </div>

            <CustomModal className={modalName === 'ChangeMinutes'?'modal deletePop' : "modal  errorPop"} modalName={'DeleteAlert'} modalIsOpen={openModal} handleOpenModal={handleOpenModal}>
                <ModalData handleOpenModal={handleOpenModal} modalAllVal={modalAllVal} changeMinuteData={changeMinuteData} cancelMinuteData={cancelMinuteData} />
            </CustomModal>

        </>
    )
}

export default ClinicInfo

