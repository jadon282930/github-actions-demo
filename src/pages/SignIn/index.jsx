import React, { useState } from 'react';
import Footer from '../../layout/Footer';
import history from '../../history';
import { Form, Input } from "antd";
import { userLogin } from '../../redux/auth/action';
import { useDispatch } from 'react-redux';
import logo from '../../assets/images/new_hp_logo.svg';
import CustomModal from "../../hoc/CustomModal";
import PopComponent from "../../hoc/PopContent";
import FilledButton from "../../component/FilledButton";


const SignIn = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false)
    const [openModal, setModalOpen] = useState(false);
    const [modalVal, setModalAllVal] = useState('')
    const [modalName, setModalName] = useState('')
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    let ModalData = PopComponent[modalName]

    const handleOpenModal = (type, data) => {
        switch (type) {
            case 'CommonPop':
                setModalAllVal(data)
                setModalName(type);
                setModalOpen(true)

                break
            default: {
                setModalOpen(!openModal);
            }
        }
    }


    const [form] = Form.useForm();
    const handleCloseModal = () => {
        setFormData({})
        form.resetFields();
    }
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value.trim() })
    };
    const handleSignIn = () => {
        setLoading(true)
        dispatch(userLogin(formData)).then(res => {
            if (res.status === 200) {
                setLoading(false)
                history.push("/clinics");
            } else if (res.status === 400) {
                setLoading(false)
                handleOpenModal('CommonPop', { header: "Info", body: res.data.message, auth: true })
            }

        }).catch(e => {
            setLoading(false)
            handleOpenModal('CommonPop', { header: "Error", body: e.message, auth: true })
        })
    }


    return (
        <>
            <div className="signin">
                <div className="container">
                    <div className="row header_logo">
                        <div className="logo"><img src={logo} alt="logo_img" /></div>
                    </div>
                </div>
                <section className="sigin_banner">
                    <div className="container">
                        <div className="sign_box">
                            <div className="account_system">
                                <h4>Account Management System</h4>
                            </div>
                            <div className="admin_sigin signup_clinic">
                                <div className='sub_admin-signin'>
                                    <h2>Admin Sign In</h2>
                                    <Form
                                        form={form}
                                        onFinish={handleSignIn}
                                        layout="vertical"
                                        autoComplete="off"
                                        initialValues={formData}
                                        onReset={() => handleCloseModal()}
                                    >
                                        <Form.Item
                                            label="Email"
                                            name="email"
                                            className={'ant-input-filed'}
                                            normalize={(val) => val?.replace(/\s/g, "") || ""}
                                            rules={[
                                                { required: true, message: 'Please input your Email!' },
                                                {
                                                    pattern: "[a-zA-Z0-9\\+\\.\\_\\%\\-\\+]{1,256}" +
                                                        "\\@" +
                                                        "[a-zA-Z0-9][a-zA-Z0-9\\-]{0,64}" +
                                                        "(" +
                                                        "\\." +
                                                        "[a-zA-Z0-9][a-zA-Z0-9\\-]{0,25}" +
                                                        ")+",
                                                    message: "Please enter a valid email",
                                                },
                                                { whitespace: false }
                                            ]}
                                        >
                                            <Input
                                                name="email"
                                                onChange={(e) => handleChange(e)} placeholder={'Email'} value={formData?.email} />
                                        </Form.Item>
                                        <Form.Item
                                            label="Password"
                                            name="password"
                                            onChange={(e) => handleChange(e)}
                                            normalize={(val) => val?.replace(/\s/g, "") || ""}
                                            rules={[
                                                { required: true, message: 'Please input your password!' },
                                            ]}
                                        >
                                            <Input.Password
                                                name="password"
                                                onChange={(e) => handleChange(e)} placeholder={'Password'} value={formData?.password} />
                                        </Form.Item>

                                        <div className="d_flex_center mt_4 mb_4 form_buttons">
                                            <button type="reset" className="btn_default" onClick={() => handleCloseModal()} >Clear</button>
                                            <FilledButton type="submit" loading={loading} value={'Submit'} className="btn_primary ml_2" />
                                        </div>
                                    </Form>
                                </div>
                                <div className={'terms-condition-sec'}>
                                    <h5>By joining, you are agreeing to our {' '}
                                        <a href={'https://haploscope.com/tos.html'} target={'_blank'}>Terms of Service</a> and <a href={'https://haploscope.com/privacy.html'} target={'_blank'}>Privacy Policy</a></h5>
                                </div>
                            </div>

                        </div>
                    </div>

                </section>
            </div>
            <Footer />
            <CustomModal className={`modal errorPop`} modalIsOpen={openModal} handleOpenModal={handleOpenModal}>
                <ModalData handleOpenModal={handleOpenModal} modalAllVal={modalVal} cancelData={handleOpenModal} />
            </CustomModal>
        </>
    )
}

export default SignIn
