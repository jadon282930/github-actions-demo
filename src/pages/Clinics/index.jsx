import React, { useEffect, useState, useMemo } from 'react'
import Sidebar from '../../layout/Sidebar'
import icon_lock from './../../assets/images/icon_lock.svg'
import arrow_up from './../../assets/images/arrow_up_icon.svg'
import alert_icon from './../../assets/images/alert_icon.svg'
import authorizedUser from "./../../assets/images/authorized-user.svg";
import Edit from './../../assets/images/Edit_icon.svg'
import Un_lock from './../../assets/images/Unlock_icon.svg'
import dustbin from './../../assets/images/dustbin_icon.svg'
import group_user from './../../assets/images/authDisable.svg'
import CustomTable from "../../hoc/CustomTable";
import { useDispatch, useSelector } from "react-redux";
import history from "../../history";
import { deleteClinic, getClinicList, resendinvItationAuthorized } from "../../redux/Clinic/action";
import BreadCrumb from '../../component/BreadCrumb';
import moment from 'moment'
import PopComponent from "../../hoc/PopContent";
import CustomModal from "../../hoc/CustomModal";
import { Tooltip, Button } from 'antd';
import { useForm } from "react-hook-form";
import { formatPhoneNumber } from '../../utils'
import code_icon from "../../assets/images/code_icon.png";



const Clinics = () => {
    let PageSize = 10;
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const clinicList = useSelector(_ => _.clinicReducer.clinicList)
    const [currentPage, setCurrentPage] = useState(1);
    const [openModal, setModalOpen] = useState(false);
    const [modalAllVal, setModalAllVal] = useState({});
    const [modalName, setModalName] = useState('');
    const [height, setHeight] = useState('75');
    let ModalData = PopComponent[modalName]
    useEffect(() => {
        setLoading(true)
        dispatch(getClinicList()).then(res => {
            if (res?.status === 200) {
                setLoading(false)
            } else {
                setLoading(false)
            }
        }).catch(e => {
            setLoading(false)
        })
    }, [])

    useEffect(() => {
        if (document.querySelector('.heading_content')) {
            var getHeight = document.querySelector('.heading_content').offsetHeight;
            setHeight(getHeight);
        }
    }, [document.querySelector('.heading_content')])

    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return clinicList?.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, clinicList]);

    const resendInvitationUser = (id) => {
        dispatch(resendinvItationAuthorized({ id: id })).then(res => {
            handleOpenModal('CommonPop', { header: 'Success', body: res.data.message, auth: true })
        })
    }

    const columns = [
        {
            title: "",
            type: 'custom',
            render: (data) => {
                return <td className=" clinic-name clinic_hover_icon">
                    {
                        !data.PrimaryUser[0]?.status &&
                        <div className='ps-code'>
                            {data.PrimaryUser[0]?.status ? '' : <img src={alert_icon} alt={'alert_icon'} className={'cursor_pointer'} />}
                            <div className='reg_code'>
                                <p>This user is yet to accept his/her invitation</p>
                            </div>
                        </div>
                    }
                </td>
            }
        },
        {
            title: 'Clinic Name',
            dataIndex: 'clinic_name',
            type: 'custom',
            render: (data) => {
                return <td onClick={() => history.push(`/clinic-detail/${data._id}`)} className="cursor_pointer clinic-name text_capitalize_clinic">{data.clinic_name}</td>
            }
        },
        {
            title: 'Primary Contact Name',
            type: 'custom',
            render: (data) => {
                return <td className={'text_capitalize_clinic'}>{data.PrimaryUser[0].first_name + " " + data.PrimaryUser[0].last_name}</td>
            }
        },
        {
            title: 'Primary Contact Email/Phone',
            type: 'custom',
            render: (data) => {
                return <td className='td_emailphone'>{(data?.PrimaryUser?.[0]?.email)} <br /> <span>{data?.PrimaryUser?.[0]?.phone ? formatPhoneNumber(data?.PrimaryUser?.[0]?.phone) : ""}</span></td>
            }
        },
        {
            title: 'Physicians',
            dataIndex: 'PhysicianCount',
            type: 'custom',
            render: (data) => {
                return <td onClick={() => history.push(`/clinic-detail/${data._id}`)} className="cursor_pointer clinic-name">{data?.PhysicianCount}</td>
            }
        }, {
            title: 'Min/Phys',
            dataIndex: 'billing_period_meeting_minutes',
        },
        {
            title: 'Total Rev YTD',
            dataIndex: '',
            sort: true,
        },
        {
            title: 'Added On',
            type: 'custom',
            dataIndex: 'createdAt',
            render: (data) => {
                return <td>{moment(data.createdAt).format('MM/DD/YYYY')}</td>
            }
        },
        {
            title: 'Actions',
            type: "action",
            ActionContent: (data) => (
                <td className='td_icons'>
                    <div className="d_flex icons">
                        <Tooltip placement="bottom" title={'Edit'}>
                            <span className="actions_icon" onClick={() => history.push(`clinic/${data._id}`)} ><img src={Edit} alt="alert_icon" /></span>
                        </Tooltip>
                        <Tooltip placement="bottom" title={'Status'}>
                            <span className="actions_icon"><img src={data.isActive ? Un_lock : icon_lock} alt="alert_icon" onClick={() => handleOpenModal('ClinicStatusUpdatePop', data)} /></span>
                        </Tooltip>
                        <Tooltip placement="bottom" title={'Delete'}>
                            <span className="actions_icon"><img src={dustbin} alt="alert_icon" onClick={() => handleOpenModal('DeletePop', data._id)} /></span>
                        </Tooltip>
                        <Tooltip placement="bottom" title={'Add Authorized User'}>
                            <span className="actions_icon">
                                {
                                    data.AuthUserCount >= 3 ?
                                        <img src={group_user} alt="alert_icon" />
                                        :
                                        <img src={authorizedUser} alt="alert_icon" onClick={() => handleOpenModal('AuthorizedPop', data)} />
                                }
                            </span>
                        </Tooltip>

                        <Tooltip placement="bottom" title={'Authorized User Count'}>
                            <span className="actions_icon">({data.AuthUserCount})</span>
                        </Tooltip>

                    </div>
                    {
                        !data.PrimaryUser[0]?.status &&
                        <div className='td_status_main td_status_clinic_list'> {
                            <div className="invite_div"><button className="btn btn_primary resend_invite invite" onClick={() => resendInvitationUser(data?.PrimaryUser[0]?._id)}>Resend Invite</button></div>
                        } </div>
                    }

                </td>
            ),
            dataIndex: '',
            key: 'x',
        },
    ];

    const handleOpenModal = (type, data) => {
        switch (type) {
            case "CommonPop": {
                setModalAllVal(data)
                setModalName(type);
                setModalOpen(true)
            }
                break;
            case 'AuthorizedPop': {
                setModalAllVal(data)
                setModalName(type);
                setModalOpen(true)
            }
                break;
            case 'ClinicStatusUpdatePop':
                setModalAllVal(data)
                setModalName(type);
                setModalOpen(true)

                break;
            case 'DeletePop':
                setModalAllVal(data)
                setModalName(type);
                setModalOpen(true)
                break;
            case 'EditClinicList': {
                setModalAllVal(data)
                setModalName(type);
                setModalOpen(true)
                break;
            }
            default: {
                setModalOpen(!openModal);
            }
        }
    }


    return (
        <>
            <div className="content_wrapper">
                <div className="clinics">
                    <BreadCrumb
                        isClinc={true}
                        setCurrentPage={setCurrentPage}
                    />
                    <CustomTable
                        columns={columns}
                        clinicList={currentTableData}
                        clssName="clinic"
                        loading={loading}
                        setCurrentPage={setCurrentPage}
                        currentPage={currentPage}
                        pageSize={PageSize}
                        tableDataLength={clinicList}
                        height={height}
                    />
                </div>
            </div>
                <CustomModal className={modalName === 'CommonPop' ? "modal errorPop" : (modalName === 'DeletePop' || modalName === 'ClinicStatusUpdatePop') ? "modal deletePop " : modalName === 'AuthorizedPop' ? 'modal authorizedPop addPhy' : 'modal addPhy'} modalName={modalName} modalIsOpen={openModal} handleOpenModal={handleOpenModal}>
                    <ModalData handleOpenModal={handleOpenModal} openModal={openModal} modalAllVal={modalAllVal} />
                </CustomModal>
        </>
    )
}

export default Clinics
