import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import {
    clearClinic,
    getclinic, getCountryData,
    getStateData,
    updateclinicList
} from "../../../redux/Clinic/action";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import CustomModal from "../../../hoc/CustomModal";
import PopComponent from "../../../hoc/PopContent";
import Validation from "../../../component/formValidation"
import CommonPop from "../../../component/Popup/CommonPop";
import Loader from "../../../component/Loader";
import FilledButton from '../../../component/FilledButton';
import Clinic_logo from "../../../assets/images/clinic-logo.png";
import icon_plus from "../../../assets/images/icon_plus.svg";



const ClinicInfo = () => {
    const { id: clinicId } = useParams();
    const dispatch = useDispatch()
    const country = useSelector(state => state?.clinicReducer?.countryData)
    const [modalAllVal, setModalAllVal] = useState({})
    const [modalName, setModalName] = useState()
    const [loading, setLoading] = useState(false)
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
    const [validationImg, setValidationImg] = useState(null)
    const [profile, setProfile] = useState(null)

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
            setValue('billing_period_meeting_minutes', edit_clinic_item?.billing_period_meeting_minutes === "unlimited" ? "Unlimited" : edit_clinic_item?.billing_period_meeting_minutes)
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

        if (isEdit && country.length > 0 && edit_clinic_item && edit_clinic_item._id === clinicId   ) {
            setValue('business_country', edit_clinic_item?.business_address?.[0]?.country)
            setValue('billing_country', edit_clinic_item?.billing_address?.[0]?.country)
            setValue('billing_period_meeting_minutes', edit_clinic_item?.billing_period_meeting_minutes === "unlimited" ? "Unlimited" : edit_clinic_item?.billing_period_meeting_minutes)
            if(edit_clinic_item?.billing_address?.[0]?.country?.length > 0  && edit_clinic_item?.business_address?.[0]?.country?.length > 0 ){
                if(edit_clinic_item?.billing_address?.[0]?.country === edit_clinic_item?.business_address?.[0]?.country){
                    console.log('one')
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
            // dispatch(getStateData({ country_id: edit_clinic_item?.business_address?.[0]?.country })).then((res) => {
            //     if (res.status === 200) {
            //         setBussines(res.data.data.states)
            //         setValue('business_state', edit_clinic_item?.business_address?.[0]?.state)
            //     }
            // })
            // dispatch(getStateData({ country_id: edit_clinic_item?.billing_address?.[0]?.country })).then((res) => {
            //     if (res.status === 200) {
            //         setBilling(res.data.data.states)
            //         setValue('billing_state', edit_clinic_item?.billing_address?.[0]?.state)
            //     }
            // })
        }


    }, [country.length, isEdit, edit_clinic_item?.business_address])

    const editClinicHandler = (state) => {
        setLoading(true)
        Object.assign(state, { phone: state?.phone?.replace(/[ ()-]/g, "") })
        let payload = {
            id: clinicId,
            clinic_name: state.clinic_name,
            business_address: { street: state.business_street, city: state.business_city, state: state.business_state, zipcode: state.business_zipCode, country: state.business_country },
            billing_address: { street: state.billing_street, city: state.billing_city, state: state.billing_state, zipcode: state.billing_zipCode, country: state.billing_country },
            billing_period_meeting_minutes: state.billing_period_meeting_minutes
        }
        if (profile) Object.assign(payload, { image: profile })
        dispatch(updateclinicList(payload))
            .then(res => {
                if (res.status === 201) {
                    setLoading(false)
                    handleOpenModal('CommonPop', { header: "Success", body: res.data.message, path: "/clinics" })

                } else {
                    setLoading(false)
                    handleOpenModal('CommonPop', { header: "Info", body: res.data.message, auth: true })
                }
            }).catch(e => {
                setLoading(false)
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
    const Filevalidation = (fi) => {
        if (fi.length > 0) {
            for (const i = 0; i <= fi.length - 1; i++) {
                const fsize = fi.item(i).size;
                const file = Math.round((fsize / 1024));
                if (file >= 2048) {
                    setValidationImg("File too Big, please select a file less than 2mb")
                    setProfile(null)
                } else {
                    setValidationImg(null)
                }
            }
        }
    }
    const profileClinicHandler = (e) => {
        setProfile(e.target.files[0])
        Filevalidation(e.target.files)
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
        setValue('billing_period_meeting_minutes', edit_clinic_item?.billing_period_meeting_minutes === "unlimited" ? "Unlimited" : edit_clinic_item?.billing_period_meeting_minutes)
    }
    const changeMinuteData = () => {
        setValue('billing_period_meeting_minutes', billingMinuteVal)
        handleOpenModal('CommonPop', { header: "Success", body: 'add Minute Successfully', auth: true })
    }

const clearHandler = ()=>{
    reset();
    setProfile(null)
}
    return (
        <>
            <div className='content_wrapper'>
                <div className={'main_clinic_header_block edit_main_header'}>
                    <div className="inner_header clinic_header">
                        <span className='breadcrumb text_uppercase montserrat_bold'> {"Edit Clinic"}</span>

                    </div>
                </div>
                {
                    (isEdit && (edit_clinic_item._id !== clinicId)) ? <Loader />
                        : <div className="clinic add-clinic_block">
                            <div className="clinic-addText edit-clinic_block">
                                <form onSubmit={handleSubmit(editClinicHandler)} autoComplete={'off'}>
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
                                                        name="clinic_name" autoComplete={'off'}  />
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
                                                                       autoSave={false}
                                                                       autoComplete="off"
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
                                                                    })}
                                                                       autoComplete="off"
                                                                       autoSave={false}
                                                                />
                                                            </span>
                                                            <Validation errors={errors.last_name} message={errors?.last_name?.message} watch={watch("last_name")} />

                                                        </div>
                                                    </div>
                                                    <div className="skip_for_now_btn">
                                                        <span>(Primary Contact)</span>
                                                    </div>
                                                </div>
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
                                                <label className="pl_1">Street</label>{
                                                    isEdit && edit_clinic_item ?
                                                        <input type="text" maxLength={200} name="business_street" id="" className={`form_control`} ref={register({
                                                            required: "Street is Required", maxLength: {
                                                                value: 200,
                                                                message: "Street should allow only 200 characters.",
                                                            },
                                                        })} />
                                                        :
                                                        <input type="text" name="business_street" id="" maxLength={200} className={`form_control`} ref={register({
                                                            required: "Street is Required",
                                                            maxLength: {
                                                                value: 200,
                                                                message: "Street should allow only 200 characters.",
                                                            }
                                                        })} />
                                                }
                                            </div>
                                            <div className="form_row">
                                                <div className="form_group col-6">
                                                    <label className="pl_1">City</label>

                                                    <input type="text" name="business_city" id="" className="form_control" ref={register({

                                                        required: "City is Required",
                                                        maxLength: {
                                                            value: 15,
                                                            message: "City should allow only 15 characters.",
                                                        },
                                                    })}     autoComplete="off" />

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

                                            <span className='checkbox_clone'/>
                                            <label htmlFor="checkbox_above">Same As Above</label>
                                        </div>
                                    </div>

                                    <div className="card card_bg_gray">
                                        <div className="sub_card_block">
                                            <div className="form_group">
                                                <label className="pl_1">Street</label>
                                                <input
                                                    type="text" name="billing_street"
                                                    id="" className={sameBiling ? "form_control disabled" : "form_control"} ref={register({
                                                        maxLength: {
                                                            value: 200,
                                                            message: "street should allow only 200 characters.",
                                                        },
                                                    })} />


                                            </div>
                                            <div className="form_row">
                                                <div className="form_group col-6">
                                                    <label className="pl_1">City</label>
                                                    <input type="text" name="billing_city" id="" className={sameBiling ? "form_control disabled" : "form_control"} ref={register({
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
                                                    <input type="text" name="billing_zipCode" maxLength={5} id="" className={sameBiling ? "form_control disabled" : "form_control"}
                                                        ref={register({
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
                                                <select
                                                    name="billing_country"
                                                    onChange={(e) => selectCountry(e)}
                                                    className={sameBiling ? "form_control disabled" : checkValue ? "form_control disabled" : `${watch('billing_country')} form_control`}
                                                    ref={register()}
                                                    defaultValue={edit_clinic_item?.billing_address?.[0]?.country}
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
                                                <select name="billing_state"
                                                    defaultValue={edit_clinic_item?.business_address?.[0]?.state}
                                                    id="" className={sameBiling ? "form_control disabled" : checkValue ? "form_control disabled" : "form_control"} ref={register()}>
                                                    <option value="">Select</option>{
                                                        billing.length > 0 &&
                                                        billing.map((item, i) => {
                                                            return (
                                                                <option value={item.id} key={item.id} >{item.name}</option>
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
                                            <select name="billing_period_meeting_minutes" defaultValue={edit_clinic_item?.billing_period_meeting_minutes === "unlimited" ? "Unlimited" : edit_clinic_item?.billing_period_meeting_minutes} id="" className="form_control col-5 montserrat_semibold" ref={register()} onChange={(e) => { meetingMinutesChangeHandler(e) }}>
                                                <option value="">Select</option>
                                                <option value="300" selected>300</option>
                                                <option value="600">600</option>
                                                <option value="Unlimited">Unlimited</option>
                                            </select>


                                        </div>
                                        {
                                            edit_clinic_item?.upcoming_clinic_billing_minute &&
                                            <h5 className={'errorMsg'}>This plan will change to {edit_clinic_item?.upcoming_clinic_billing_minute} min
                                                / physician from next billing cycle</h5>
                                        }
                                        <div className="form_group d_flex justify_content_center form_action">
                                            <button className='btn btn_default' type={'reset'} onClick={() => clearHandler()}>Clear</button>
                                            <FilledButton type="submit" loading={loading} value={'Submit'} className="btn btn_primary ml_2" />
                                        </div>
                                    </div>

                                </form>

                            </div>
                            <div className='form_group profile_main'>
                                <div className='user_profile'>
                                    <div className='user_profile_pic'>
                                        <img className='clinic-logo_img'
                                            src={(!validationImg && profile) ? URL.createObjectURL(profile) : edit_clinic_item?.clinic_logo ? edit_clinic_item?.clinic_logo : Clinic_logo}
                                            alt='' />
                                        <span className="addnew">
                                            <img src={icon_plus} alt="" />
                                            <input type="file" name="profile"
                                                onChange={(e) => profileClinicHandler(e)} />
                                        </span>
                                    </div>
                                    <label htmlFor="" className="profile_label">Clinic Logo</label>
                                    <span className='logo-notice'>(Maximum image size is 2MB)</span>
                                    <Validation errors={validationImg} message={validationImg} />
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

