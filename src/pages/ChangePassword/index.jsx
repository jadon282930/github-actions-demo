import React, { useEffect, useState } from "react";
import { Form, Input} from 'antd';
import { changePassword } from "../../redux/Settings/action";
import { useDispatch } from "react-redux";
import CustomModal from "../../hoc/CustomModal";
import PopComponent from "../../hoc/PopContent";

const Settings = () => {
    const dispatch = useDispatch()
    const [formRef, setFormRef] = useState(null);
    const [formData, setFormData] = useState({});
    const [modalAllVal, setModalAllVal] = useState()
    const [modalName, setModalName] = useState()
    let ModalData = PopComponent[modalName]
    const [modalIsOpen, setModalOpen] = useState(false);
    const [form] = Form.useForm();

    const handleChangePassword = (value) => {
        dispatch(changePassword(value)).then(res => {
            if (res.status === 200) {
                setFormData({})
                form.resetFields();
                handleOpenModal('CommonPop', { header: "Success", body: res.data.message, auth: true })
            } else {
                handleOpenModal('CommonPop', { header: "Info", body: res.data.message, auth: true })
            }
        })
    }
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    useEffect(() => {
        setFormRef(form)
    }, [])
    const handleOpenModal = (type, data) => {
        switch (type) {
            case "CommonPop": {
                setModalAllVal(data)
                setModalName(type);
                setModalOpen(true)
            }
                break;
            default: {
                setModalOpen(!modalIsOpen);
            }
        }
    }
    const handleCloseModal = () => {
        setFormData({})
        form.resetFields();
    }
    return (
        <div className='content_wrapper'>
            <div className='main_clinic_header_block'>
                <div className="inner_header clinic_header">
                    <span className='breadcrumb text_uppercase montserrat_bold'> Change Password</span>
                </div>
            </div>
            <div className={'admin_sigin main_setting'}>

                <Form
                    className="setting_form"
                    form={form}
                    onFinish={handleChangePassword}
                    layout="vertical"
                    autoComplete="off"
                    initialValues={formData}
                    onReset={() => handleCloseModal()}
                >
                    <Form.Item
                        label="Current Password"
                        name="currentPassword"
                        onChange={handleChange}
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password
                            name="currentPassword"
                            onChange={handleChange} />
                    </Form.Item>
                    <Form.Item
                        label="New Password"
                        name="newPassword"
                        onChange={handleChange}
                        rules={[
                            { required: true, message: 'Please input your New password!' },
                            {
                                pattern: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
                                message: "8 characters which contain at least one numeric digit,one special character one uppercase and one lowercase letter "
                            },
                            {
                                maxLength: 8,
                                message: "Password should be at-least 8 characters.",
                            }
                        ]}
                    >
                        <Input.Password
                            name="newPassword"
                            onChange={handleChange} />
                    </Form.Item>
                    <Form.Item
                        label="Confirm Password"
                        name="verifyPassword"
                        onChange={handleChange}
                        rules={!formData.verifyPassword
                            ? [{ required: true, message: 'Please input your Confirm password!' }]
                            : [{
                                validator: (_, value) => {
                                    if (formData.newPassword !== value) {
                                        return Promise.reject('Confirm password is not match with new password');
                                    } else {
                                        return Promise.resolve();
                                    }
                                }
                            }]}
                    >

                        <Input.Password name="verifyPassword"
                            onChange={handleChange} />
                    </Form.Item>
                    <Form.Item className="setting_btn_block">
                        <button type="reset" className="btn_default" onClick={() => handleCloseModal()} >Clear</button>
                        <button type="submit" className="btn_primary ml_2" >Submit</button>
                    </Form.Item>
                </Form>
            </div>
            <CustomModal className={"modal errorPop"} modalIsOpen={modalIsOpen} handleOpenModal={handleOpenModal}>
                <ModalData handleOpenModal={handleOpenModal} modalAllVal={modalAllVal} />
            </CustomModal>
        </div>
    )
}
export default Settings

