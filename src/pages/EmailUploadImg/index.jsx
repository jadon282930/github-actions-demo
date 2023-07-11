import Validation from "../../component/formValidation";
import {formatPhoneNumber, numberValidate} from "../../utils";
import Clinic_logo from "../../assets/images/clinic-logo.png";
import icon_plus from "../../assets/images/icon_plus.svg";
import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {editPhysician, getPhysicianDetails, getPhysicianPatients} from "../../redux/physician/action";
import PopComponent from "../../hoc/PopContent";
import CustomModal from "../../hoc/CustomModal";
import {uploademailTemImg} from "../../redux/EmailUpload/action";
import {useForm} from "react-hook-form";

const EmailUploadimg = ()=>{
    const { register, watch, errors, handleSubmit, setValue, reset } = useForm({ mode: "all" });
    const [validationImg,setValidationImg]=useState(null)
    const [profile, setProfile] = useState(null)
    const [modal, setModal] = useState()
    let ModalData = PopComponent[modal]
    const [modalIsOpen, setIsOpen] = useState(false);
    const [modalAllVal, setModalAllVal] = useState();
    const dispatch = useDispatch()
    const profileClinicHandler = (e)=>{
        setProfile(e.target.files[0])
    }
    const handleUploadImg = (state)=>{
            let payload = {
                type:state.type,
                logo:state?.logo[0]
            }
            dispatch(uploademailTemImg(payload)).then(res=>{
                if(res.status === 200){
                    handleOpenModal('CommonPop', { header: "Success", body: res.data.message, auth: true })
                    setProfile(null)
                    reset()
                }else{
                    handleOpenModal('CommonPop', { header: "Info ", body: res.data.message, auth: true })
                }
            })
    }
    const handleOpenModal = (type, data) => {
        switch (type) {

            case "CommonPop": {
                setModalAllVal(data)
                setModal(type)
                setIsOpen(true)
                break;
            }
            default: {
                setIsOpen(false)
            }
        }
    }

    return(
        <div className="physiciandetail">
            <div className="physiciandetail_nav">
                <div className="physiciandetail_nav--block1"><h2>Upload Images</h2></div>
            </div>
            <div className="clinic add-clinic_block">
                <div className="clinic-addText">
                    <form onSubmit={handleSubmit(handleUploadImg)}>
                        <div className='form_group profile_main'>
                            <div className='user_profile'>
                                <div className='user_profile_pic'>
                                    <img className='clinic-logo_img'
                                         src={(!validationImg && profile) ? URL.createObjectURL(profile) : Clinic_logo} alt=''/>
                                    <span className="addnew">
                                            <img src={icon_plus} alt=""/>
                                            <input type="file" name="logo"
                                                   onChange={(e) => profileClinicHandler(e)} ref={register({required: "logo image is Required",})} />
                                        </span>
                                </div>
                                <label htmlFor="" className="profile_label">Upload image</label>
                                <Validation                  errors={errors.logo}
                                                             message={errors?.logo?.message}
                                                             watch={watch("logo")}/>
                            </div>
                            <div className="form_group col-12">
                                <label htmlFor="">Logo Name</label>
                                <select name="type" className={`fill ${!errors?.type?.message ? watch("type") ? 'valid' : "" : errors?.type ? 'invalid' : ""}`} id="" ref={register({required: "Logo Name is Required",})} >
                                    <option value={''}  >Select Logo Name</option>
                                    <option value={'haploscope_health'}  >Haploscope Health</option>
                                    <option value={'google_play'}  > Google Play</option>
                                    <option value={'app_store'}> App Store</option>
                                    <option value={'footer_line'}>Footer Line</option>
                                </select>
                            </div>
                            <Validation
                                errors={errors.type}
                                message={errors?.type?.message}
                                watch={watch("type")}
                            />
                        </div>
                        <div className="form_group d_flex justify_content_center form_action">
                            <button className='btn btn_primary ml_2' type={'submit'}>Submit</button>
                        </div>
                    </form>
                </div>
            </div>
            <CustomModal className={`${ modal === "CommonPop" ? "modal errorPop" : ''}`} modalIsOpen={modalIsOpen} handleOpenModal={handleOpenModal}>
                <ModalData  handleOpenModal={handleOpenModal} modalAllVal={modalAllVal}  />
            </CustomModal>
        </div>
    )
}

export default EmailUploadimg