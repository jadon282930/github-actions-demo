import user from '../../../assets/images/avatar.png'
import icon_plus from '../../../assets/images/icon_plus.svg'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addPhysician } from '../../../redux/physician/action'
import { useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { formatPhoneNumber, numberValidate } from '../../../utils';
import Validation from '../../formValidation'
import PopComponent from "../../../hoc/PopContent";
import CustomModal from "../../../hoc/CustomModal";
import BtnLoader from "../../../hoc/BtnLoader";
import FilledButton from "../../FilledButton";




const AddPhysicianPop = ({modalAllVal, handleOpenModal }) => {
    const clinic_id = useParams()
    const { register, watch, errors, handleSubmit, setValue, reset } = useForm({ mode: 'all' });
    const [formValues, setFormValues] = useState([""]);
    const [affiliations, setAffiliations] = useState([""]);
    const [award, setAward] = useState([""])
    const [loading, setLoading] = useState(false)
    const [modalName, setModalName] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [modalVal, setModalVal] = useState('')
    let ModalData = PopComponent[modalName]

    const state = useSelector(state => state)
    const dispatch = useDispatch()
    const [profile, setProfile] = useState('')
    const [profileImage, setProfileImage] = useState()
    const [Year, setYear] = useState()


    //addPhysicianHandle
    const addPhysicianHandle = (data) => {

        if (formValues?.filter(item => item !== '')) Object.assign(data, { education: formValues.filter(item => item !== '')})
        if (affiliations?.filter(item => item !== '')) Object.assign(data, { center_affiliations: affiliations.filter(item => item !== '') })
        if (award?.filter(item => item !== '')) Object.assign(data, { awards_activities: award?.filter(item => item !== '') })
        if (data.bio) Object.assign(data, { bio: data.bio })
        if (data.abbreviated_degrees) Object.assign(data, { abbreviated_degrees: data.abbreviated_degrees })
        let payload = {
            physician: {
                ...data,
                first_name:  data?.first_name?.trimEnd(),
                phone:data?.phone?.replace(/[ ()-]/g,""),
            },
            clinic_id: clinic_id.id,
        }
        if (profile) Object.assign(payload, { image: profile })
        setLoading(true)

        dispatch(addPhysician(payload,modalAllVal.type)).then(res => {
            if (res.status === 201) {
                setLoading(false)
                handleOpenModal('CommonPop', { header: "Success", body: res.data.message, auth: true })
            } else {
                setLoading(false)
                handleOpenModalError('CommonPop', { header: "Info", body: res.data.message, auth: true })
            }
        }).catch(err => {
            setLoading(false)
            handleOpenModalError('CommonPop', { header: "Error", body: err.message, auth: true })
        })
    }

    //eduction,Affiliation,award add filed
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
    const Awardhandlechange = (e, index) => {
        setValue('awards_activities', e.target.value.trimStart())
        let temp = [...award];
        temp[index] = e.target.value;
        setAward(temp)
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

    const addAffiliationsFields = (type, index) => {
        if (type === 'add') {
            setAffiliations([...affiliations, ""])
        } else {
            let temp = [...affiliations];
            temp.splice(index, 1);
            setAffiliations(temp)
        }
    }

    const changeImage = (e) => {
        setProfile(e.target.files[0])
    }

    const resetFiled = () => {
        reset();
        setProfile('')
        setFormValues([" "])
        setAffiliations([" "])
        setAward([" "])
    }
    useEffect(() => {
        reset()
        setProfile('')
    }, [handleOpenModal])

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

                <form onSubmit={handleSubmit(addPhysicianHandle)}>
                    <h3 className="form_heading text_center">Add a Physician</h3>
                    <div className="form">
                        <div className="form_group profile">
                            <div className="user_profile">
                                <div className="user_profile_pic">
                                    <img src={profile ? URL.createObjectURL(profile) : user} alt="" />
                                    <span className='addnew'><img src={icon_plus} alt="" /> <input type="file" name="profile" id="" onChange={changeImage} /> </span>
                                </div>
                                <label htmlFor="" className='profile_label'>Profile Photo</label>
                            </div>
                        </div>
                        <div className='physician_form'>
                            <div className="form_row">
                                <div className="form_group col-6">
                                    <label htmlFor="">Physician First Name</label>
                                    <span className={`fill ${!errors?.first_name?.message ? (watch("first_name")) ? 'valid' : "" : errors?.first_name?.message ? 'invalid' : ""}`}>
                                        <input type="text" name="first_name" id="first_name"
                                            onChange={(e) => {
                                                setValue('first_name', e.target.value.trimStart())
                                            }}
                                            ref={register({
                                                required: "Physician First Name is Required",
                                                pattern: {
                                                    value: /^[A-Za-z ]+$/,
                                                    message:
                                                        "Should allow only alphabet characters"
                                                },


                                            })} className="form_control"
                                        />                                </span>
                                    <Validation errors={errors.first_name} message={errors?.first_name?.message} watch={watch("first_name")} />


                                </div>
                                <div className="form_group col-6">
                                    <label htmlFor="">Physician Last Name</label>
                                    <span className={`fill ${!errors?.last_name?.message ? (watch("last_name")) ? 'valid' : "" : errors?.last_name?.message ? 'invalid' : ""}`}>
                                        <input type="text" name="last_name" id="last_name" className="form_control"
                                            onChange={(e) => {
                                                setValue('last_name', e.target.value.trimStart())
                                            }}
                                            ref={register({
                                                required: "Physician Last Name is Required", pattern: {
                                                    value: /^[A-Za-z ]+$/,
                                                    message:
                                                        "Should allow only alphabet characters"
                                                }
                                            })} />                               </span>
                                    <Validation errors={errors.last_name} message={errors?.last_name?.message} watch={watch("last_name")} />
                                </div>
                            </div>
                            <div className="form_group">
                                <label htmlFor="">Email</label>
                                <span className={`fill ${!errors?.first_name?.message ? (watch("email")) ? 'valid' : "" : errors?.email?.message ? 'invalid' : ""}`}>
                                    <input type="text" id="email" className="form_control" name="email"
                                        onChange={(e) => {
                                            setValue('email', e.target.value.trim())
                                        }}
                                        ref={register({
                                            required: "Email is Required",
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
                                    <select name="phone_type" id="" className={`${watch("phone_type")} form_control`} ref={register({required: watch("phone") ? 'Phone Type is Required' :  false})} >
                                        <option value={''}  >Select Phone Type</option>
                                        <option value={'Mobile'}  >Mobile</option>
                                        <option value={'Work'}  >Work</option>
                                    </select>
                                    <Validation errors={errors.phone_type} message={errors?.phone_type?.message} watch={watch("phone")} />
                                </div>
                            </div>
                            <div className="form_group">
                                <label htmlFor="">Years of Experience</label>
                                <select name="years_of_experiance" id="" className="form_control col-3"
                                    ref={register()}  >
                                    <option value=''>Select</option>
                                    {Array.from(Array(50)).map((x, i) => {
                                        return <option value={i + 1} key={i + 1}>{i + 1}</option>
                                    })}
                                    {/*<option value="1">1</option>*/}
                                    {/*<option value="2">2</option>*/}
                                    {/*<option value="3">3</option>*/}
                                </select>
                            </div>
                            <div className="form_group">
                                <label htmlFor="">Abbreviated Degrees</label>
                                <input type="text" id="" className="form_control" name="abbreviated_degrees"
                                    onChange={(e) => {
                                        setValue('abbreviated_degrees', e.target.value.trimStart())
                                    }}
                                    ref={register()} />
                            </div>
                            <div className="form_group">
                                <label htmlFor="">Bio</label>
                                <textarea name="bio" id="" rows="10" className="form_control"
                                    onChange={(e) => {
                                        setValue('bio', e.target.value.trimStart())
                                    }}
                                    ref={register()}  ></textarea>

                            </div>
                            {formValues.map((element, index) => {
                                return (
                                    <div className="form_group edit_form_group" >
                                        <label htmlFor="">Education</label>
                                        <div className='text_add position_relative d_flex w_100'>
                                            <input type="text" onChange={(e) => handleChange(e, index)} name="education" value={element} id="" className="form_control" ref={register()} />
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
                                    <div className="form_group edit_form_group">
                                        <label htmlFor="">Center Affiliations</label>
                                        <div className='text_add position_relative d_flex w_100'>
                                            <input type="text" onChange={(e) => AffiliationshandleChange(e, index)} name="center_affiliations" value={element} id="" className="form_control" ref={register()} />
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
                                            <input type="text" onChange={(e) => Awardhandlechange(e, index)} name="awards_activities" value={element} id="" className="form_control" ref={register()} />
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
                                <button className='btn btn_default' type='reset' onClick={() => resetFiled()}>Clear</button>
                                <FilledButton type="submit" loading={loading} value={'Submit'} className="btn btn_primary ml_2"  />
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

export default AddPhysicianPop