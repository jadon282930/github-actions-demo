import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import {
    addStoreClinic,
    clearClinic,
    getclinic, getCountryData, getMinutes,
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
import Loader from "../../../component/Loader";
import Clinic_logo from "../../../assets/images/clinic-logo.png";
import icon_plus from "../../../assets/images/icon_plus.svg";



const ClinicInfo = () => {
    const { id: clinicId } = useParams();
    const dispatch = useDispatch()
    const country = useSelector(state => state?.clinicReducer?.countryData)
    const stateData = useSelector(state => state?.clinicReducer?.stateData)
    const getMinutesData = useSelector(state => state?.clinicReducer?.getMinute)
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
    const [billingMinuteVal, setBillingMinuteVal] = useState()
    const [checkValue, setCheckValue] = useState(false)
    const [bussines, setBussines] = useState([])
    const [billing, setBilling] = useState([])
    const [validationImg,setValidationImg]=useState(null)
    const [profile, setProfile] = useState()

    useEffect(() => {
        dispatch(getCountryData())
        dispatch(getMinutes())
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

    const addClinicHandler = (state) => {
        let payload = {
            clinic_name: state.clinic_name,
            business_address: { street: state.business_street, city: state.business_city, state: state.business_state, zipcode: state.business_zipCode, country: state.business_country },
            billing_address: { street: state.billing_street, city: state.billing_city, state: state.billing_state, zipcode: state.billing_zipCode, country: state.billing_country },
            contact: {
                first_name: state.first_name?.trimEnd(),
                last_name: state.last_name?.trimEnd(),
                email: state.email?.trimEnd(),
                phone_type: state.phone_type
            },
            billing_period_meeting_minutes: state.billing_period_meeting_minutes
        }
        if(profile) {Object.assign(payload,{image:profile})}
        Object.assign(payload.contact, { phone: state?.conatct_number?.replace(/[ ()-]/g, "") })
        dispatch(addStoreClinic(payload))
        history.push("/add-physician")
    }

    const editClinicHandler = (state) => {
        Object.assign(state, { phone: state?.phone?.replace(/[ ()-]/g, "") })
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
            dispatch(getStateData({ country_id: watchFields.business_country })).then((res) => {
                if (res.status === 200) {
                    setBilling(res.data.data.states)
                    setValue('billing_state', watchFields.business_state)
                }
            })
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
            case 'ChangeMinutes': {
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
    }

    const selectBillingCountry = (e) => {
        e.preventDefault();
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
        setValue('billing_period_meeting_minutes', edit_clinic_item?.billing_period_meeting_minutes)
    }
    const changeMinuteData = () => {
        setValue('billing_period_meeting_minutes', billingMinuteVal)
        handleOpenModal('CommonPop', { header: "Success", body: 'add Minute Successfully', auth: true })
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
            <div className='content_wrapper'>
                <div className={isEdit ? 'main_clinic_header_block edit_main_header' : 'main_clinic_header_block'}>
                    <div className="inner_header clinic_header">
                        <span className='breadcrumb text_uppercase montserrat_bold'> {isEdit ? "Edit Clinic" : "add a clinic"}</span>
                        {
                            !isEdit &&
                            <ul className='clinic_steps'>
                                <li><span className='active'>1</span></li>
                                <li><span>2</span></li>
                            </ul>

                        }

                    </div>
                </div>
                {
                    (isEdit && (edit_clinic_item._id !== clinicId)) ? <Loader />
                        : <div className="clinic add-clinic_block">
                            <div className="clinic-addText">
                                <form onSubmit={isEdit ? handleSubmit(editClinicHandler) : handleSubmit(addClinicHandler)}>
                                    <div className='main_card'>
                                        <div className="card">
                                            <div className="form_group">
                                                <label htmlFor="">Clinic Name</label>
                                                <span className={`fill ${!errors?.clinic_name?.message ? (watch("clinic_name")) ? 'valid' : "" : errors?.clinic_name?.message ? 'invalid' : ""}`}>
                                                    <input type="text"
                                                        onChange={(e) => {
                                                            setValue('clinic_name', e.target.value.trimStart())
                                                        }}
                                                        ref={register({
                                                            required: "Clinic Name is Required",
                                                            pattern: {
                                                                value: /^[A-Za-z ]+$/,
                                                                message:
                                                                    "Should allow only alphabet characters"
                                                            }
                                                        })} id=""
                                                        className={"form_control"}
                                                        name="clinic_name" />
                                                </span>
                                                <Validation errors={errors.clinic_name} message={errors?.clinic_name?.message} watch={watch("clinic_name")} />
                                            </div>{
                                                !isEdit &&
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
                                                    <div className="skip_for_now_btn">
                                                        <span>(Primary Contact)</span>
                                                    </div>
                                                </div>
                                            }
                                            {!isEdit &&
                                                <>
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
                                                            <select name="phone_type" id="" className={`${watch("phone_type")}`} className="form_control" ref={register({required:'Phone type is Required'})} >
                                                                <option value={''}  >Select Phone Type</option>
                                                                <option value={'Mobile'}  >Mobile</option>
                                                                <option value={'Work'}  >Work</option>
                                                            </select>
                                                            <Validation errors={errors.phone_type} message={errors?.phone_type?.message} watch={watch("phone_type")} />
                                                        </div>

                                                    </div>

                                                </>
                                            }
                                        </div>
                                    </div>
                                    <div className="fullWidth mb_2">
                                        <span className={`title fill ${(!errors?.business_street?.message && !errors?.business_city?.message && !errors?.business_zipCode?.message && !errors?.business_country?.message && !errors?.business_state?.message) ? ((watch("business_street") && watch("business_city") && watch("business_zipCode") && watch("business_country") && watch("business_state"))) ? 'valid' : "" :
                                            (errors?.business_street?.message && errors?.business_city?.message && errors?.business_zipCode?.message && errors?.business_country?.message && errors?.business_state?.message) ? 'invalid' : ""}`}>Business Address</span>
                                    </div>
                                    <div className="card card_bg_gray" >
                                        <div className="sub_card_block">
                                            <div className="form_group">
                                                <label className="pl_1">Street</label>

                                                <input type="text" name="business_street" id="" maxLength={200} className={`form_control`} ref={register({
                                                    required: "Street is Required",
                                                    maxLength: {
                                                        value: 200,
                                                        message: "Street should allow only 200 characters.",
                                                    }
                                                })} />
                                            </div>
                                            <div className="form_row">
                                                <div className="form_group col-6">
                                                    <label className="pl_1">City</label>

                                                    <input type="text" name="business_city" id="" className="form_control" ref={register({
                                                        required: "City is Required",
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
                                                <div className="form_group col-6">
                                                    <label className="pl_1">Zip Code</label>

                                                    <input type="text" name="business_zipCode" maxLength={6} id="" className="form_control" ref={register({
                                                        required: "ZipCode  is Required",
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

                                                <select name="business_country" id="" onChange={(e) => selectCountry(e)} className="form_control" ref={register({ required: "Country is Required" })}>
                                                    <option value="">Select</option>
                                                    {
                                                        country?.map((item, i) => {
                                                            return (
                                                                <option value={item.id} >{item.name}</option>
                                                            )
                                                        })
                                                    }

                                                </select>


                                            </div>
                                            <div className="form_group col-6">
                                                <label className="pl_1">State</label>

                                                <select name="business_state" id="" className="form_control" ref={register({ required: "State is Required" })}>
                                                    <option value="">Select</option>{
                                                        bussines.length > 0 &&
                                                        bussines.map((item, i) => {
                                                            return (
                                                                <option value={item.id}>{item.name}</option>
                                                            )
                                                        })

                                                    }
                                                </select>

                                            </div>
                                        </div>
                                        <Validation errors={errors.business_street || errors.business_city || errors.business_zipCode || errors.business_country || errors.business_state} message={errors?.business_street?.message || errors?.business_city?.message || errors?.business_zipCode?.message || errors?.business_country?.message || errors?.business_state?.message} watch={(watch("business_street") || watch("business_city") || watch("business_zipCode") || watch("business_country") || watch("business_state"))} />
                                    </div>
                                    <div className="card d_flex justify_content_between billing_card">
                                        <label htmlFor="" className='billing_label'>Billing Address</label>
                                        <div className="form_group checkbox">
                                            {
                                                isEdit ? (
                                                    <input type="checkbox" id='checkbox_above' checked={checkValue} onChange={(e) => billingAddHandler(e)} />
                                                ) : (
                                                    <input type="checkbox" id='checkbox_above' onChange={(e) => billingAddHandler(e)} />
                                                )
                                            }

                                            <span className='checkbox_clone' />
                                            <label htmlFor="checkbox_above">Same As Above</label>
                                        </div>
                                    </div>

                                    <div className="card card_bg_gray">
                                        <div className="sub_card_block">
                                            <div className="form_group">
                                                <label className="pl_1">Street</label>

                                                <input
                                                    type="text" name="billing_street"
                                                    defaultValue={watchFields.billing_street}
                                                    id="" className={ "form_control"} ref={register({
                                                        maxLength: {
                                                            value: 200,
                                                            message: "street should allow only 200 characters.",
                                                        },
                                                    })} />

                                            </div>
                                            <div className="form_row">
                                                <div className="form_group col-6">
                                                    <label className="pl_1">City</label>

                                                    <input type="text" name="billing_city" defaultValue={watchFields.billing_city} id="" className={ "form_control"} ref={register({
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
                                                <div className="form_group col-6">
                                                    <label className="pl_1">Zip Code </label>

                                                    <input type="text" name="billing_zipCode" maxLength={5} defaultValue={watchFields.billing_zipCode} id="" className={ "form_control"} ref={register({
                                                        pattern: {
                                                            value: /^[0-9 !-@#$%^&*)(]{1,14}$/,
                                                            message:
                                                                "Should allow only Numeric Value"
                                                        }
                                                    })} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form_row">
                                            <div className="form_group col-6">
                                                <label className="pl_1">Country</label>

                                                <select name="billing_country" id="" onChange={(e) => selectBillingCountry(e)} className={`${watch('billing_country')} form_control`} ref={register()}>
                                                    <option value="">Select</option>
                                                    {
                                                        country?.map((item, i) => {
                                                            return (
                                                                <option value={item.id}>{item.name}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                            <div className="form_group col-6">
                                                <label className="pl_1">State</label>
                                                <select name="billing_state" id="" className={ `${watch('billing_state')} form_control`} ref={register()}>
                                                    <option value="">Select</option>{
                                                        billing.length > 0 &&
                                                        billing.map((item, i) => {
                                                            return (
                                                                <option value={item.id}  >{item.name}</option>
                                                            )
                                                        })

                                                    }
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card billing_period_card">
                                        <div className="form_group">
                                            <label htmlFor="">Billing Period Meeting Minutes (per physician)</label>
                                            {
                                                isEdit ?
                                                    <select name="billing_period_meeting_minutes" defaultValue={edit_clinic_item?.billing_period_meeting_minutes} id="" className="form_control col-5 montserrat_semibold" ref={register()} onChange={(e) => { meetingMinutesChangeHandler(e) }}>
                                                        <option value="">Select</option>
                                                        <option value="300" selected>300</option>
                                                        <option value="600">600</option>
                                                        <option value="Unlimited">Unlimited</option>
                                                    </select>
                                                    :
                                                    <>
                                                        <select name="billing_period_meeting_minutes" id="" className={`${watch('billing_period_meeting_minutes')} form_control col-5 montserrat_semibold`} ref={register({ required: 'Please Select Billing Period Meeting Minutes' })}>
                                                            <option value="">Select</option>
                                                            {
                                                                getMinutesData?.length > 0 &&
                                                                getMinutesData?.map((item) => {
                                                                    return <option value={item?.minutes} selected={item?.minutes === '300' ? true : false}>{item?.minutes}</option>
                                                                })
                                                            }
                                                        </select>
                                                        <Validation errors={errors.billing_period_meeting_minutes} message={errors?.billing_period_meeting_minutes?.message} watch={watch("billing_period_meeting_minutes")} />
                                                    </>
                                            }

                                        </div>
                                        <div className="form_group d_flex justify_content_center form_action">
                                            <button className='btn btn_default' type={'reset'} onClick={() => reset()}>Clear</button>
                                            <button className='btn btn_primary ml_2' >{isEdit ? "Submit" : "Next"}</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className='form_group profile_main'>
                                <div className='user_profile'>
                                    <div className='user_profile_pic'>
                                        <img className='clinic-logo_img' src={(!validationImg && profile)? URL.createObjectURL(profile) : Clinic_logo} alt='' />
                                        <span class="addnew">
                                            <img src={icon_plus} alt="" />
                                            <input type="file" name="profile" onChange={(e)=>profileClinicHandler(e)}/>
                                        </span>
                                    </div>
                                    <label for="" class="profile_label">Clinic Logo</label>
                                    <span className='logo-notice'>(Maximum image size is 2MB)</span>
                                    <Validation errors={validationImg} message={validationImg}  />
                                </div>
                            </div>
                        </div>
                }
            </div>

            <CustomModal className={modalName === 'ChangeMinutes' ? 'modal deletePop' : "modal  errorPop"} modalName={'DeleteAlert'} modalIsOpen={openModal} handleOpenModal={handleOpenModal}>
                <ModalData handleOpenModal={handleOpenModal} modalAllVal={modalAllVal} changeMinuteData={changeMinuteData} cancelMinuteData={cancelMinuteData} />
            </CustomModal>

        </>
    )
}

export default ClinicInfo

