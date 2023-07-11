import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addClinicList } from "../../../redux/Clinic/action";
import { formatPhoneNumber, numberValidate } from "../../../utils";
import Validation from "../../../component/formValidation"
import PopComponent from "../../../hoc/PopContent";
import CustomModal from "../../../hoc/CustomModal";
import BtnLoader from "../../../hoc/BtnLoader";
import FilledButton from "../../../component/FilledButton";

function AddPhysicians() {
    const dispatch = useDispatch();
    const { register, watch, errors, handleSubmit, setValue, reset } = useForm({ mode: "all" });
    const clinicDetail = useSelector(state => state.clinicReducer.addClinicData);
    const [formValues, setFormValues] = useState(['']);
    const [affiliations, setAffiliations] = useState([""]);
    const [openModal, setModalOpen] = useState(false);
    const [modalAllVal, setModalAllVal] = useState({});
    const [modalName, setModalName] = useState('');
    const [loader, setLoader] = useState(false);
    const [loading, setLoading] = useState(false);
    let ModalData = PopComponent[modalName]

    const [award, setAward] = useState([""])
    


    const addPhysiciansHandler = (state, type) => {
        if (type === 'skipPhysician') {
            setLoader(true);
            dispatch(addClinicList(clinicDetail))
                .then(res => {
                    if (res.status === 201) {
                        setLoader(false);
                        handleOpenModal('CommonPop', { header: "Success", body: res.data.message, path: "/clinics" })
                    } else {
                        setLoader(false);
                        handleOpenModal('CommonPop', { header: "Info", body: res.data.message, auth: true })
                    }
                }).catch(err => {
                    setLoader(false);
                    handleOpenModal('CommonPop', { header: "Error", body: err.message, auth: true })
                });
        } else {

            setLoading(true)
            let payload = {}
            let physicianData = {
                first_name: state.first_name?.trimEnd(),
                last_name: state.last_name.trimEnd(),
                email: state.email.trimEnd(),
            }

            if (formValues?.filter(item => item !== '')) Object.assign(state, { education: formValues.filter(item => item !== '')})
            if (affiliations?.filter(item => item !== '')) Object.assign(state, { center_affiliations: affiliations.filter(item => item !== '') })
            if (award?.filter(item => item !== '')) Object.assign(state, { awards_activities: award?.filter(item => item !== '') })

            // if (state.education) { Object.assign(physicianData, { education: formValues }) }
            // if (state.center_affiliations) { Object.assign(physicianData, { center_affiliations: affiliations }) }
            if (state.bio) { Object.assign(physicianData, { bio: state.bio }) }
            if (state.phone_type) { Object.assign(physicianData, { phone_type: state.phone_type }) }
            if (state.abbreviated_degrees) { Object.assign(physicianData, { abbreviated_degrees: state.abbreviated_degrees }) }
            if (state.phone) { Object.assign(physicianData, { phone:state?.phone?.replace(/[ ()-]/g,"") }) }
            // if (state.awards_activities) Object.assign(physicianData, { awards_activities: award })
            if (state.years_of_experiance){ Object.assign(physicianData,{years_of_experiance:state?.years_of_experiance})}
            Object.assign(payload, clinicDetail )
            Object.assign(payload, { physician: physicianData })

            dispatch(addClinicList(payload)).then(res => {
                if (res.status === 201) {
                    setLoading(false);
                    handleOpenModal('CommonPop', { header: "Success", body: res.data.message, path: "/clinics" })
                } else {
                    setLoading(false);
                    handleOpenModal('CommonPop', { header: "Info", body: res.data.message, auth: true })
                }
            }).catch(err => {
                setLoading(false);
                handleOpenModal('CommonPop', { header: "Error", body: err.message, auth: true })
            });
        }

    }
    const handleOpenModal = (type, data) => {
        switch (type) {
            case "CommonPop": {
                setModalAllVal(data)
                setModalName(type);
                setModalOpen(true)
            }
            break
            default: {
                setModalName(type);
                setModalOpen(!openModal);
            }
        }
    }
    function addFormFields(type, index) {
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


    const resetField = () => {
        reset();
        setFormValues([" "])
        setAffiliations([" "])
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
    return (
        <>
            <div className='content_wrapper'>
                <div className='main_clinic_header_block pysicianicfo_block'>
                    <div className="inner_header clinic_header">
                        <ul className='breadcrumb text_uppercase montserrat_bold'>
                            <li>add a clinic</li>
                            <li className='active'>add a physician</li>
                        </ul>
                        <ul className='clinic_steps'>
                            <li><span>1</span></li>
                            <li><span className='active'>2</span></li>
                        </ul>
                    </div>
                </div>
                <div className="clinic physicain_header_block">
                    <div className="clinic_form">
                        <form onSubmit={handleSubmit(addPhysiciansHandler)}>
                            <div className="card">
                                <div className="form_row">
                                    <div className="form_group col-6">
                                        <label htmlFor="">Physician First Name</label>
                                        <span className={`fill ${!errors?.first_name?.message ? watch("first_name") ? 'valid' : "" : errors?.first_name?.message ? 'invalid' : ""}`}>
                                            <input type="text" maxLength={20} ref={register({
                                                required: "First Name is Required",
                                                pattern: {
                                                    value: /^[A-Za-z ]+$/,
                                                    message:
                                                        "Should allow only alphabet characters"
                                                }
                                            })} id=""
                                                onChange={(e) => {
                                                    setValue('first_name', e.target.value.trimStart())
                                                }}
                                                className="form_control" name="first_name" />
                                        </span>
                                        <Validation errors={errors.first_name} message={errors?.first_name?.message} watch={watch("first_name")} />

                                    </div>
                                    <div className="form_group col-6">
                                        <label htmlFor="">Physician Last Name</label>
                                        <span className={`fill ${!errors?.last_name?.message ? watch("last_name") ? 'valid' : "" : errors?.last_name?.message ? 'invalid' : ""}`}>
                                            <input type="text" name="last_name" id=""
                                                maxLength={20}
                                                onChange={(e) => {
                                                    setValue('last_name', e.target.value.trimStart())
                                                }}
                                                className="form_control" ref={register({
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
                                    <label htmlFor="">Email</label>
                                    <span className={`fill ${!errors?.email?.message ? watch("email") ? 'valid' : "" : errors?.email ? 'invalid' : ""}`}>
                                        <input type="text" name="email" id="" className="form_control"
                                            onChange={(e) => {
                                                setValue('email', e.target.value.trim())
                                            }}
                                            ref={register({
                                                required: "Email is Required",
                                                pattern: {
                                                    value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                                                    message: "Please provide a valid email address",
                                                },
                                            })}
                                        />
                                    </span>
                                    <Validation
                                        errors={errors.email}
                                        message={errors?.email?.message}
                                        watch={watch("email")}
                                    />
                                </div>
                                <div className="form_row">
                                    <div className="form_group col-6">
                                        <label htmlFor="">Contact Phone</label>
                                        <span className="">
                                            <input
                                                type="tel"
                                                inputMode="numeric"
                                                maxLength={10}
                                                className={`form_control`}
                                                placeholder='(222) 222-2222'
                                                name="phone"
                                                autoComplete="conatct_number"
                                                onChange={(e) => {
                                                    const { value } = e.target
                                                    if (value) {
                                                        e.target.value = formatPhoneNumber(value)
                                                    }
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
                                        </span>
                                        <Validation errors={errors.phone} message={errors?.phone?.message} watch={watch("conatct_number")} />
                                    </div>

                                    <div className="form_group col-6">
                                        <label htmlFor="">Phone Type</label>
                                        <select name="phone_type" id="" className={`${watch("phone_type")} form_control`} ref={register({
                                            required: watch("phone") ? 'Phone Type is Required' :  false
                                        })} >
                                            <option value={''}  >Select Phone Type</option>
                                            <option value={'Mobile'}  >Mobile</option>
                                            <option value={'Work'}  >Work</option>
                                        </select>
                                        <Validation errors={errors.phone_type} message={errors?.phone_type?.message} watch={watch("phone_type")} />
                                    </div>
                                </div>

                                <div className="form_group">
                                    <label htmlFor="">Years of Experience</label>
                                    <select name="years_of_experiance"  id="" className={`${watch("years_of_experiance")} form_control col-3`} ref={register()}>
                                        <option value=''>Select</option>
                                        {Array.from(Array(50)).map((x, i) => {
                                            return <option value={i + 1}>{i + 1}</option>
                                        })}
                                    </select>
                                </div>

                                <div className="form_group">
                                    <label htmlFor="">Abbreviated Degrees</label>
                                    <input type="text" name="abbreviated_degrees" onChange={(e) => {
                                        setValue('abbreviated_degrees', e.target.value.trimStart())
                                    }} id="" className="form_control" ref={register()} />
                                </div>
                                <div className="form_group">
                                    <label htmlFor="">Bio</label>
                                    <textarea name="bio" id="" rows="9" className="form_control" onChange={(e) => {
                                        setValue('bio', e.target.value.trimStart())
                                    }} ref={register()}/>
                                </div>

                                {formValues.map((element, index) => {
                                    let name = `name-${index}`
                                    return (
                                        <div className="form_group main_add_remove_block">
                                            <label htmlFor="">Education</label>
                                            <div className='text_add position_relative d_flex w_100 add_remove_block'>

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
                                        <div className="form_group main_add_remove_block">
                                            <label htmlFor="">Center Affiliations</label>
                                            <div className='text_add position_relative d_flex w_100 add_remove_block'>
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
                                    return(
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
                                    )})
                                }
                               

                                <div className="d_flex justify_content_center form_action">
                                    <button className='btn btn_default clear_btn' type={'reset'} onClick={() => resetField()}>Clear</button>
                                    <FilledButton type="submit" loading={loading} value={'Submit'} className="btn_primary ml_2"  />
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="skip_for_now_btn">
                        {
                            loader ? (
                                <button className="btn_skip btn" ><BtnLoader /></button>
                            ) : (
                                <button className="btn_skip btn" onClick={() => addPhysiciansHandler('', 'skipPhysician')}>Skip for Now</button>
                            )
                        }
                    </div>
                </div>
            </div>
            <CustomModal className={"modal  errorPop"} modalName={'DeleteAlert'} modalIsOpen={openModal} handleOpenModal={handleOpenModal}>
                <ModalData handleOpenModal={handleOpenModal} modalAllVal={modalAllVal} />
            </CustomModal>
        </>
    )
}

export default AddPhysicians
