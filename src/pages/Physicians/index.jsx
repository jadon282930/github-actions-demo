import React, { useEffect, useState, useMemo } from 'react'
import BreadCrumb from "../../component/BreadCrumb";
import CustomTable from "../../hoc/CustomTable";
import Edit from "../../assets/images/Edit_icon.svg";
import icon_lock from '../../assets/images/icon_lock.svg'
import Un_lock from "../../assets/images/Unlock_icon.svg";
import dustbin from "../../assets/images/dustbin_icon.svg";
import add_user from "../../assets/images/add-user.svg";
import transfer from "../../assets/images/transfer.svg";
import { useSelector, useDispatch } from 'react-redux';
import {
    editPhysician,
    getPhysicianDetails,
    getPhysicianPatients,
    getPhysicians, resendInvitationPhysician,
} from '../../redux/physician/action';
import moment from "moment";
import { formatPhoneNumber } from "../../utils";
import PopComponent from '../../hoc/PopContent';
import CustomModal from '../../hoc/CustomModal';
import alert_icon from '../../assets/images/alert_icon.svg'
import code_icon from '../../assets/images/code_icon.png'
import { Tooltip } from "antd";
import { ghostLoginPhysician } from "../../redux/GhostLogin/action";

const Physicians = () => {
    let PageSize = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const physicianlDetail = useSelector(state => state?.physicianReducer?.physicianList)
    const dispatch = useDispatch()
    const [cancelData, setCancelData] = useState(false)
    const [tableData, setTableData] = useState([])
    const [statusCbx, setStatusCbx] = useState({ active: false, pending: false })
    const [modal, setModal] = useState()
    let ModalData = PopComponent[modal]
    const [modalIsOpen, setIsOpen] = useState(false);
    const [modalAllVal, setModalAllVal] = useState();
    const [id, setId] = useState();
    const [height, setHeight] = useState('75');
    const [loading, setLoading] = useState(false);
    const [phyLoader, setPhyLoader] = useState(false);

    const handleOpenModal = (type, data) => {
        switch (type) {
            case "AddMinutePop": {
                setModalAllVal(data)
                setModal(type)
                setIsOpen(true)
                setId(data)
                break;
            }

            case 'EditPhysicianPop': {
                setModalAllVal(data)
                // dispatch(editPhysician({ user_id: data.id }))
                setModal(type);
                setIsOpen(true)
                break;
            }

            case 'PhysicianDetailsPop': {
                setModalAllVal(id)
                setModal(type)
                setIsOpen(true)
                setId(data)
                setPhyLoader(true)
                dispatch(getPhysicianDetails({ user_id: data })).then(res => {
                    if (res.status === 200) {
                        setPhyLoader(false)
                    } else {
                        setPhyLoader(false)
                    }
                })
                break;
            }

            case "CommonPop": {
                setModalAllVal(data)
                setModal(type)
                setIsOpen(true)
                setId(data)
                break;
            }

            case 'DeletePhysicianPop': {
                setModalAllVal(data)
                setModal(type);
                setIsOpen(true)
                break
            }

            case 'PhyStatusUpdatePop': {
                setModalAllVal(data)
                setModal(type);
                setIsOpen(true)
                break;
            }

            case 'EnablePhyStatusPop': {
                setModalAllVal(data)
                setModal(type);
                setIsOpen(true)
                break;
            }
            case "TransferPatientsPop": {
                setModalAllVal(data)
                setModal(type)
                setIsOpen(true)
                setCancelData(true)
                // dispatch(getPhysicianPatients({ physician_id: data }))
                break;
            }

            default: {
                setCancelData(false)
                setIsOpen(false)
            }
        }
    }

    useEffect(() => {
        setLoading(true)
        dispatch(getPhysicians()).then(res => {
            if (res?.status === 200) {
                setLoading(false)
            } else {
                setLoading(false)
            }
        }).catch(e => {
            setLoading(false)
        })
    }, [])

    const onCheckboxChange = (e) => {
        let target = e.target;
        let checked = target.checked;
        setStatusCbx({ ...statusCbx, [e.target.name]: checked })
        let data = []
        const cl = [...physicianlDetail]
        if (target.name === 'active' && checked) {
            setCurrentPage(1)
            setStatusCbx({ ...statusCbx, active: true, pending: false })
            cl.map(element => {
                if (element.status) {
                    data.push(element)
                }
            })
        }
        if (target.name === 'pending' && checked) {
            setCurrentPage(1)
            setStatusCbx({ ...statusCbx, active: false, pending: true })
            cl.map(element => {
                if (!element.status) {
                    data.push(element)
                }
            })
        }

        setTableData(data)
    }

    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        if(statusCbx.pending || statusCbx.active){
            return tableData.length > 0 ? tableData.slice(firstPageIndex, lastPageIndex) : []
        }else {
            return physicianlDetail?.slice(firstPageIndex, lastPageIndex);
        }
    }, [currentPage, physicianlDetail, tableData, modalIsOpen]);

    const ghostLoginPhysicianData = (id) => {
        dispatch(ghostLoginPhysician(id)).then(res => {
            if (res?.status === 400) {
                handleOpenModal('CommonPop', { header: "Info", body: res.data.message, auth: true })
            }
        }).catch(err => {
            setLoading(false)
            handleOpenModal('CommonPop', { header: "Error", body: err.message, auth: true })
        })
    }

    const columns = [
        {
            title: "",
            type: 'custom',
            render: (data) => {
                // return <td className="cursor_pointer clinic-name">{data?.status ? '' : <img src={alert_icon} />}</td>
                return <td className=" clinic-name clinic_hover_icon">
                    {
                        !data?.status &&
                        <div className='ps-code'>
                            {data?.status ? '' : <img src={alert_icon} className={'cursor_pointer'} />}
                            <div className='reg_code'>
                                <p>This physician is yet to accept his/her invitation</p>
                            </div>
                        </div>
                    }
                </td>
            }
        },
        {
            title: 'Physician Name',
            dataIndex: '',
            type: 'custom',
            render: (data) => {
                return <td className="cursor_pointer clinic-name text_capitalize_Phy" onClick={() => handleOpenModal('PhysicianDetailsPop', data._id)}> Dr. {data.first_name + " " + data.last_name}</td>
            }
        },
        {
            title: '',
            dataIndex: '',
            type: 'custom',
            render: (data) => {
                return <td className="cursor_pointer clinic-name">
                    <div className='ps-code'>
                        <img src={code_icon} alt={'code_icon'} />
                        <div className='reg_code'>
                            <p>Physician Registration Code</p>
                            <span>{data?.institution_registration_code}</span>
                        </div>
                    </div>
                </td>
            }
        },
        {
            title: 'Clinic',
            dataIndex: 'clinic',
            type: 'custom',
            render: (data) => {
                return <td >{data?.clinic_name}</td>
            }
        },
        {
            title: 'Email/Phone',
            dataIndex: 'email',
            type: 'custom',
            render: (data) => {
                return <td className='td_emailphone'><span>{data.email}</span> <span>{formatPhoneNumber(data.phone)}</span></td>
            }
        },
        {
            title: 'Virtual Minutes Available\n' +
                '(Current Billing Cycle)',
            type: 'minute',
            dataIndex: '',
            minute: (data) => {
                return <td className="invite_div">
                    <div className='invite_main'><span>{data?.billing_period_meeting_minutes === 'unlimited' ? `${data?.billing_period_meeting_minutes}` : `${data?.clinic_meeting_minutes}/${Math.floor(data?.availableMinutes)}`} </span>
                        {
                            data?.status && (data.availableMinutes < data.clinic_meeting_minutes) ?
                                <button onClick={() => handleOpenModal('AddMinutePop', { id: data._id, minute: data.clinic_meeting_minutes })} className="btn btn_primary invite" type="button"> Add Minutes</button> :
                                <span />
                        }

                    </div>
                </td>
            }
        },
        {
            title: 'Added On',
            dataIndex: 'AddedOn',
            type: 'custom',
            render: (data) => {
                return <td>{moment(data.AddedOn).format('MM/DD/YYYY')}</td>
            }
        }, {
            title: 'Last Logged On',
            dataIndex: 'lastlogin',
            type: 'custom',
            render: (data) => {
                return <td>{moment(data.lastlogin).format('MM/DD/YYYY')}</td>
            }
        }, {
            title: 'Status',
            dataIndex: '',
            type: 'custom',
            filter: true,
            render: (data) => {

                return <td>
                    <div className='td_status_main'>{data?.status ? <span>Active</span> : <span>Pending</span>}  {
                        !data?.status &&
                        <div className="invite_div"><button className="btn btn_primary resend_invite invite" onClick={() => resendInvitationPhysicianHandler({ id: data?._id })} type='submit'>Resend Invite</button></div>
                    } </div></td>
            }
        },
        {
            title: 'Actions',
            type: "action",
            ActionContent: (data) => (
                <td className='td_icons'>

                    <div className="d_flex icons">

                        <Tooltip placement="bottom" title={'Transfer Patient'}>
                            {
                                data?.status ?
                                    <span className="actions_icon">{data?.status ? <img src={transfer} alt="Transfer" onClick={() => handleOpenModal('TransferPatientsPop', data?._id)} /> : ""}</span>
                                    :
                                    <span className="actions_icon" />
                            }
                        </Tooltip>
                        <Tooltip placement="bottom" title={'Ghost Login'}>
                            {
                                data?.status ?
                                    <span className="actions_icon" onClick={() => ghostLoginPhysicianData({ id: data?._id })}><img src={add_user} alt="add user" /></span>
                                    :
                                    <span className="actions_icon" />
                            }
                        </Tooltip>
                        <Tooltip placement="bottom" title={'Edit'}>
                            <span className="actions_icon"><img src={Edit} onClick={() => handleOpenModal('EditPhysicianPop', { id: data?._id })} alt="alert_icon" /></span>
                        </Tooltip>
                        {
                            data?.status ?
                                <Tooltip placement="bottom" title={'Status Physician'}>
                                    {
                                        data?.isActive?.[0]?.isActive ?
                                            <span className="actions_icon">
                                                <img src={Un_lock} onClick={() => handleOpenModal('PhyStatusUpdatePop', { physician_id: data._id, status: data?.isActive?.[0]?.isActive, type: 'list' })} alt="alert_icon" />
                                            </span>
                                            :
                                            <span className="actions_icon">
                                                <img src={icon_lock} onClick={() => handleOpenModal('EnablePhyStatusPop', { physician_id: data._id, status: data?.isActive?.[0]?.isActive, type: 'list' })} alt="alert_icon" />
                                            </span>
                                    }

                                </Tooltip>
                                : ""
                        }

                        <Tooltip placement="bottom" overlayClassName={'delete_phy_tooltip'} title={'Delete Physician'}>
                            <span className="actions_icon"><img onClick={() => handleOpenModal('DeletePhysicianPop', { id: data?._id,status: data?.status })} src={dustbin} alt="alert_icon" /></span>
                        </Tooltip>
                    </div>
                </td>
            ),
            dataIndex: '',
            key: 'x',
        },
    ];

    const resendInvitationPhysicianHandler = (id) => {
        dispatch(resendInvitationPhysician(id)).then(res => {
            if (res.status === 201) {
                handleOpenModal('CommonPop', { header: "Success", body: res.data.message, auth: true })
            }
        })
    }

    useEffect(() => {
        if (document.querySelector('.heading_content')) {
            var getHeight = document.querySelector('.heading_content').offsetHeight;
            setHeight(getHeight);
        }
    }, [document.querySelector('.heading_content')])
    return (
        <div className='content_wrapper'>
            <div className='clinics'>
                <BreadCrumb
                    isPhy={true}
                    setCurrentPage={setCurrentPage}
                />
                <CustomTable
                    columns={columns}
                    className="physician"
                    loading={loading}
                    clinicList={currentTableData}
                    setCurrentPage={setCurrentPage}
                    currentPage={currentPage}
                    pageSize={PageSize}
                    tableDataLength={tableData?.length > 0 ? tableData : physicianlDetail}
                    onCheckboxChange={onCheckboxChange}
                    statusCbx={statusCbx}
                    height={height}

                />
            </div>
            <CustomModal className={`${modal === 'DeletePhysicianPop' || modal === 'PhyStatusUpdatePop' || modal === 'EnablePhyStatusPop' ? "modal deletePop " : modal === "CommonPop" ? "modal errorPop" : modal === "TransferPatientsPop" ? "modal transferPatient" : modal === "AddMinutePop" ? "modal addMinutePop" : modal === "PhysicianDetailsPop" ? "modal physicianDetailsPop" : "modal addPhy"}`} modalIsOpen={modalIsOpen} handleOpenModal={handleOpenModal}>
                <ModalData id={id} handleOpenModal={handleOpenModal} modalAllVal={modalAllVal} cancelData={cancelData} phyLoader={phyLoader} />
            </CustomModal>
        </div>
    )
}

export default Physicians
