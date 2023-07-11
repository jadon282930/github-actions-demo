import React, {useEffect, useState} from "react";
import {changePrimaryAuthUser} from "../../../redux/Clinic/action";
import {useDispatch} from "react-redux";
import FilledButton from "../../FilledButton";
import CustomModal from "../../../hoc/CustomModal";
import { Form, Input } from "antd";
import PopComponent from "../../../hoc/PopContent";

const SwitchPrimary = ({modalAllVal,handleOpenModal})=>{

 const dispatch=   useDispatch()
const [loading,setLoading]=useState(false)
    const [modalName, setModalName] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [formData, setFormData] = useState({});
    const [modalVal, setModalVal] = useState('')
    let ModalData = PopComponent[modalName]
    const [form] = Form.useForm();


    const handleSignIn = (value) => {
    
        Object.assign(modalAllVal,{password:value?.password})
        setLoading(true)
        dispatch(changePrimaryAuthUser(modalAllVal))
            .then(res=>{
                if(res.status === 400){
                    setLoading(false)
                    handleOpenModalError('CommonPop'  , { header: "Info", body: res.data.message , auth:true })
                }else if(res.status === 201){
                    handleOpenModal('CommonPop'  , { header: "Success", body: res.data.message , auth:true })
                    setLoading(false)
                }
        }).cache(e=>{
            setLoading(false)
            handleOpenModalError('CommonPop'  , { header: "Error", body: e.message , auth:true })
        })
    }

    useEffect(()=>{

    },[handleOpenModal])

    const handleOpenModalError = (type, data) => {
        switch (type) {
            case "CommonPop": 
                setModalVal(data)
                setModalName(type);
                setModalOpen(true)
                break;
            default: {
                setModalOpen(!modalOpen);
            }
        }
    }
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    };
    const handleCloseModal = () => {
        setFormData({})
        form.resetFields();
    }
    const handleOpenModalCancel = () =>{
        handleOpenModal()
        setFormData({})
        form.resetFields();

    }
    return(
        <div>
            <div className="primarycontact_box ">
                <div className="primarycontact_heading"><h5>Switch Primary Contact</h5></div>
                <div className=" primarycontact_subheading"><p>You are about to change the primary contact on this account. This will remove your ability to add authorized users and give that permission to new primary contact.</p></div>
                <div className="primarycontact_text"><h6>If you want to proceed, please insert your password to proceed.</h6></div>
                <Form 
                      form={form}
                      onFinish={handleSignIn}
                      layout="vertical"
                      autoComplete="off"
                      initialValues={formData}
                      onReset={() => handleCloseModal()}
                
                className="switch_primary_box signup_clinic ">
                   <Form.Item
                    name="password"
                    onChange={(e) => handleChange(e)}
                    rules={[
                        { required: true, message: 'Please input your password!' }
                    ]}
                >
                    <Input.Password
                        name="password"
                        onChange={(e) => handleChange(e)} placeholder={'Password'} />
                </Form.Item>
                <div className="form_group d_flex justify_content_center form_action">
                    <button className="btn btn_default" type="reset" onClick={()=>handleOpenModalCancel()}>Cancel</button>
                    <FilledButton type={'submit'} loading={loading} value={'Submit'} className="btn btn_primary ml_2"  />
                </div>
                </Form>
            </div>
            <CustomModal className={`${modalName === 'CommonPop' ? "modal errorPop" :modalName === 'ChangeMinutes'? 'modal deletePop' : "modal addPhy"}`} modalName={modalName} modalIsOpen={modalOpen} handleOpenModal={handleOpenModalError}>
                <ModalData  handleOpenModal={handleOpenModalError} modalAllVal={modalVal}  loading={loading}  />
            </CustomModal>
        </div>
    )
}
export default SwitchPrimary