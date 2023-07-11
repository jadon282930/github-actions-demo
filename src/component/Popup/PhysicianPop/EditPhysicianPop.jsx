import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import {editPhysician, updatePhysicianList} from '../../../redux/physician/action';
import {formatPhoneNumber, generateAvatar, numberValidate} from '../../../utils';
import icon_plus from '../../../assets/images/icon_plus.svg'
import user from '../../../assets/images/avatar.png'
import Validation from "../../formValidation";
import CustomModal from "../../../hoc/CustomModal";
import PopComponent from "../../../hoc/PopContent";
import FilledButton from "../../FilledButton";
import Loader from "../../Loader";

function EditPhysicianPop({ modalAllVal, handleOpenModal }) {
    const { register, watch, errors, handleSubmit, setValue, reset } = useForm({ mode: 'all' });
    const [formValues, setFormValues] = useState([""]);
    const [affiliations, setAffiliations] = useState([""]);
    const [award, setAward] = useState([""])
    const [profile, setProfile] = useState('')
    const edit_physician_list = useSelector(state => state?.physicianReducer?.editPhysician);
    const [loading, setLoading] = useState(false)
    const [modalName, setModalName] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [modalVal, setModalVal] = useState('')
    const [loader,setLoader]=useState(false)
    let ModalData = PopComponent[modalName]
    const dispatch = useDispatch();
    const watchAllFields = watch();

    useEffect(()=>{
        setLoader(true)
        dispatch(editPhysician({ user_id: modalAllVal.id })).then(res=>{
            if(res.status === 200){
                setLoader(false)
            }else{
                setLoader(false)
            }
        })
    },[modalAllVal])

    const updatePhysicianHandle = (data) => {
        if (formValues?.filter(item => item !== '')) Object.assign(data, { education: formValues.filter(item => item !== '')})
        if (affiliations?.filter(item => item !== '')) Object.assign(data, { center_affiliations: affiliations.filter(item => item !== '') })
        if (award?.filter(item => item !== '')) Object.assign(data, { awards_activities: award?.filter(item => item !== '') })
        if (data.bio) Object.assign(data, { bio: data.bio })
        if (data.abbreviated_degrees) Object.assign(data, { abbreviated_degrees: data.abbreviated_degrees })
        if(modalAllVal?.status){Object.assign(data, { user_id:  modalAllVal.id })} else {Object.assign(data, { user_id: edit_physician_list?._id })}
        setLoading(true)
        let payload = {
            physician: {
                ...data,
                first_name:  data?.first_name?.trimEnd(),
                phone: data?.phone?.replace(/[ ()-]/g,"")
            }
        }

        if(profile) Object.assign(payload, { image: profile })
        dispatch(updatePhysicianList({payload:payload,type:modalAllVal.type})).then(res => {
            if (res.status === 201) {
                setLoading(false)
                handleOpenModal('CommonPop', { header: "Success", body: res.data.message, auth: true })
            } else {
                setLoading(false)
                handleOpenModalError('CommonPop'  , { header: "Error", body: res.data.message,auth:true })
            }
        }).catch(err => {
            setLoading(false)
            handleOpenModalError('CommonPop'  , { header: "Error", body: err.message,auth:true })
        })

    }
    useEffect(()=>{
        if(edit_physician_list){
            setValue('phone_type', edit_physician_list?.phone_type)
            setValue('first_name',edit_physician_list?.first_name)
            setValue('last_name',edit_physician_list?.last_name)
            setValue('email',edit_physician_list?.email)
            setValue('phone',formatPhoneNumber(edit_physician_list?.phone))
            setValue('bio',edit_physician_list?.bio)
            setValue('abbreviated_degrees',edit_physician_list?.abbreviated_degrees)
            setValue("years_of_experiance", edit_physician_list?.years_of_experiance)
        }

    },[modalAllVal,!loader])

    useEffect(()=>{
        reset()
        setProfile('')
    },[handleOpenModal])
    useEffect(() => {
        if (edit_physician_list?.education?.length > 0 ) {
            setFormValues([...edit_physician_list?.education])
        }
        if(edit_physician_list?.center_affiliations?.length > 0 ){
            setAffiliations([...edit_physician_list?.center_affiliations])
        }
        if( edit_physician_list?.awards_activities?.length > 0){
            setAward([...edit_physician_list?.awards_activities])
        }
    }, [edit_physician_list])

    const addFormFields = (type, index) => {
        if (type === 'add') {
            setFormValues([...formValues, ""])
        } else {
            let temp = [...formValues];
            temp.splice(index, 1);
            setFormValues(temp)
        }
    }


    const handleChange = (e, index) => {
        setValue('education', e.target.value.trimStart())
        let temp = [...formValues];
        temp[index] = e.target.value;
        setFormValues(temp);
    }


    const AffiliationshandleChange = (e, index) => {
        setValue('center_affiliations', e.target.value.trimStart())
        let temp = [...affiliations];
        temp[index] = e.target.value;
        setAffiliations(temp);
    }
    function addAffiliationsFields(type, index) {
        if (type === 'add') {
            setAffiliations([...affiliations, ""])
        } else {
            let temp = [...affiliations];
            temp.splice(index, 1);
            setAffiliations(temp)
        }

    }

    const AwardHandleChange = (e, index) => {
        setValue('awards_activities', e.target.value.trimStart())
        let temp = [...award];
        temp[index] = e.target.value;
        setAward(temp);
    }



    const addAwardFields = (type, index) => {
        if (type === 'add') {
            setAward([...award, ""])
        } else {
            let temp = [...award];
            temp.splice(index, 1);
            setAward(temp)
        }
    }

    const profileHandler = (e) => {
        setProfile(e.target.files[0])

    }
const resetfunData = ()=>{
    setFormValues([" "])
    setAffiliations([" "])
    setAward([" "])
    setProfile('')
    setValue('')
    reset()
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
            <div className="custom_modal lodar_modal">
                <form onSubmit={handleSubmit(updatePhysicianHandle)}>
                    <h3 className="form_heading text_center">Update a Physician</h3>
                    {
                        loader?
                            <Loader className={'content-loader'}/>
                            :
                            <div className="form">
                                <div className="form_group profile">
                                    <div className="user_profile">
                                        <div className="user_profile_pic">
                                            <img src={profile ? URL.createObjectURL(profile) : edit_physician_list?.profile ? edit_physician_list?.profile : user} alt="" />
                                            <span className='addnew'><img src={icon_plus} alt="" /> <input type="file" name="profile" id="" onChange={(e) => profileHandler(e)} /> </span>
                                        </div>
                                        <label htmlFor="" className='profile_label'>Profile Photo</label>
                                    </div>
                                </div>
                                <div className='physician_form'>
                                    <div className="form_row">
                                        <div className="form_group col-6">
                                            <label htmlFor="">Physician First Name</label>
                                            <span className={`fill ${!errors?.first_name?.message ? (watch("first_name")) ? 'valid' : "" : errors?.first_name?.message ? 'invalid' : ""}`}>
                                        <input type="text" name="first_name" id=""
                                               onChange={(e) => {
                                                   setValue('first_name', e.target.value.trimStart())
                                               }}
                                               ref={register({
                                                   required: "Physician First Name is Required", pattern: {
                                                       value: /^[A-Za-z ]+$/,
                                                       message:
                                                           "Should allow only alphabet characters"
                                                   }
                                               })}
                                               className="form_control" />
                                    </span>
                                            <Validation errors={errors.first_name} message={errors?.first_name?.message} watch={watch("first_name")} />

                                        </div>
                                        <div className="form_group col-6">
                                            <label htmlFor="">Physician Last Name</label>
                                            <span className={`fill ${!errors?.last_name?.message ? (watch("last_name")) ? 'valid' : "" : errors?.last_name?.message ? 'invalid' : ""}`}>
                                        <input type="text"
                                               onChange={(e) => {
                                                   setValue('last_name', e.target.value.trimStart())
                                               }}
                                               name="last_name" id="" ref={register({
                                            required: "Physician Last Name is Required", pattern: {
                                                value: /^[A-Za-z ]+$/,
                                                message:
                                                    "Should allow only alphabet characters"
                                            }
                                        })}
                                               className="form_control" />
                                    </span>
                                            <Validation errors={errors.last_name} message={errors?.last_name?.message} watch={watch("last_name")} />
                                        </div>
                                    </div>
                                    <div className="form_group">
                                        <label htmlFor="">Email</label>
                                        <span className={`fill ${!errors?.email?.message ? (watch("email")) ? 'valid' : "" : errors?.email?.message ? 'invalid' : ""}`}>
                                    <input type="text" id=""
                                           onChange={(e) => {
                                               setValue('email', e.target.value.trim())
                                           }}
                                           className="form_control" name="email"
                                           ref={register({
                                               required: "email is Required",
                                               pattern: {
                                                   value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                                                   message: "Please enter a valid email",
                                               },
                                           })}
                                    />
                                    <Validation errors={errors.email} message={errors?.email?.message} watch={watch("email")} />
                                </span>
                                    </div>
                                    <div className="form_row">
                                        <div className="form_group col-6">
                                            <label htmlFor="">Contact Phone</label>
                                            <input
                                                type="text"
                                                name="phone"
                                                id=""
                                                maxLength={10}
                                                className="form_control"
                                                onChange={(e) => {
                                                    const { value } = e.target;
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
                                                placeholder='(222) 222-2222' />
                                            <Validation errors={errors.phone} message={errors?.phone?.message} watch={watch("phone")} />
                                        </div>

                                        <div className="form_group col-6">
                                            <label htmlFor="">Phone Type</label>
                                            <select name="phone_type" id="" defaultValue={edit_physician_list?.phone_type} className={`${watch("phone_type")} form_control`} ref={register({required: watch("phone") ? 'Phone Type is Required' :  false})}  >
                                                <option value={''}  >Select Phone Type</option>
                                                <option value={'Mobile'}  >Mobile</option>
                                                <option value={'Work'}  >Work</option>
                                            </select>
                                            <Validation errors={errors.phone_type} message={errors?.phone_type?.message} watch={watch("phone")} />
                                        </div>
                                    </div>
                                    <div className="form_group">
                                        <label htmlFor="">Years of Experience</label>
                                        <select name="years_of_experiance"   id="" className="form_control col-3" ref={register()}  >
                                            <option value=''>Select</option>
                                            {Array.from(Array(50)).map((x, i) => {
                                                return <option value={i + 1} key={i + 1}>{i + 1}</option>
                                            })}
                                        </select>
                                    </div>
                                    <div className="form_group">
                                        <label htmlFor="">Abbreviated Degrees</label>
                                        <input type="text" id="" className="form_control" onChange={(e) => {
                                            setValue('abbreviated_degrees', e.target.value.trimStart())
                                        }} name="abbreviated_degrees" ref={register()}   />

                                    </div>
                                    <div className="form_group">
                                        <label htmlFor="">Bio</label>
                                        <textarea name="bio" id="" rows="10"
                                                  onChange={(e) => {
                                                      setValue('bio', e.target.value.trimStart())
                                                  }} className="form_control" ref={register()}   />
                                    </div>
                                    {formValues.map((element, index) => {
                                        return (
                                            <div className="form_group edit_form_group">
                                                <label htmlFor="">Education</label>
                                                <div className='text_add position_relative d_flex w_100'>
                                                    <input type="text" onChange={(e) => handleChange(e, index)} name="education" defaultValue={element} id="" className="form_control" ref={register()} />
                                                    {
                                                        index === 0 ? (
                                                            <span className='cursor_pointer' onClick={() => addFormFields('add')}>add</span>
                                                        ) : (
                                                            <span className='cursor_pointer' onClick={() => addFormFields('remove', index)}>remove</span>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        )
                                    })
                                    }

                                    {affiliations.map((element, index) => {
                                        return (
                                            <div className="form_group edit_form_group" key={index}>
                                                <label htmlFor="">Center Affiliations</label>
                                                <div className='text_add position_relative d_flex w_100'>
                                                    <input type="text" onChange={(e) => AffiliationshandleChange(e, index)} name="center_affiliations" defaultValue={element} id="" className="form_control" ref={register()} />
                                                    {
                                                        index === 0 ? (
                                                            <span className='cursor_pointer' onClick={() => addAffiliationsFields('add')}>add</span>
                                                        ) : (
                                                            <span className='cursor_pointer' onClick={() => addAffiliationsFields('remove', index)}>remove</span>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        )
                                    })
                                    }
                                    {award.map((element, index) => {
                                        return (
                                            <div className="form_group edit_form_group">
                                                <label htmlFor="">Award & Activities</label>
                                                <div className='text_add position_relative d_flex w_100'>
                                                    <input type="text"  name="awards_activities" onChange={(e) => AwardHandleChange(e, index)} defaultValue={element}  className="form_control" ref={register()} />
                                                    {
                                                        index === 0 ? (
                                                            <span className='cursor_pointer' onClick={() => addAwardFields('add')}>add</span>
                                                        ) : (
                                                            <span className='cursor_pointer' onClick={() => addAwardFields('remove', index)}>remove</span>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        )
                                    })
                                    }
                                    <div className="form_group d_flex justify_content_center form_action mt_5">
                                        <button className='btn btn_default' type='button' onClick={() => resetfunData()} >Clear</button>
                                        <FilledButton type="submit" loading={loading} value={'Submit'} className="btn btn_primary ml_2"  />
                                    </div>
                                </div>
                            </div>
                    }

                </form>
            </div>
            <CustomModal className={`${modalName === 'CommonPop' ? "modal errorPop" : "modal addPhy"}`} modalName={modalName} modalIsOpen={modalOpen} handleOpenModal={handleOpenModalError}>
                <ModalData handleOpenModal={handleOpenModalError} modalAllVal={modalVal} loading={loading} />
            </CustomModal>
        </>
    )
}

export default EditPhysicianPop;
