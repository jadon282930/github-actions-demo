import React, { useState } from 'react';
import PopComponent from "../../hoc/PopContent";
import CustomModal from "../../hoc/CustomModal";
import { editPhysician, getPhysicians } from '../../redux/physician/action';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import ClinicDetailInfo from "./ClinicDetailInfo";
import {
    editAuthUser,
    getAllClinicDetails,
    getclinic, getMinutes,
} from "../../redux/Clinic/action";
import ClinicAuthorizedUser from "./ClinicAuthorizedUser";
import ClinicPhysician from "./ClinicPhysician";
import Loader from "../../component/Loader";
import moment from "moment";


const ClinicDetail = () => {
    let clinic_detail = useSelector(state => state?.clinicReducer?.clinicDetail)
    const addPhysicianResponse = useSelector(state => state?.physicianReducer?.addPhsyician)
    const [loader, setLoader] = useState(false)
    const [loading] = useState(true);
    const [openModal, setModalOpen] = useState(false);
    const [modalAllVal, setModalAllVal] = useState({})
    const [modalName, setModalName] = useState('')
    const [editAuthId, setEditAuthId] = useState()
    const { id: clinic_id } = useParams();
    const dispatch = useDispatch()
    let ModalData = PopComponent[modalName]
console.log(clinic_id,clinic_detail)
    useEffect(() => {
        setLoader(true)
        dispatch(getAllClinicDetails({ id: clinic_id }))
            .then(res => {
                if (res.status === 200) {
                    console.log(res.status)
                    setLoader(false)
                } else {
                    setLoader(false)
                }
            })
    }, [clinic_id])
    useEffect(() => {
        dispatch(getMinutes())
    }, [])

    useEffect(() => {
        if (addPhysicianResponse) {
            dispatch(getPhysicians())
        }
    }, [addPhysicianResponse])


    const handleOpenModal = (type, data) => {
        switch (type) {
            case 'AuthorizedPop': {
                setModalName(type);
                setModalOpen(true)
                break;
            }
            case 'AddPhysicianPop': {
                setModalAllVal(data)
                setModalName(type);
                setModalOpen(true)
                break;
            }
            case 'EditPhysicianPop': {
                // dispatch(editPhysician({ user_id: data.id }))
                setModalAllVal(data)
                setModalName(type);
                setModalOpen(true)
                break;
            }
            case 'editAuthorizedPop': {
                setModalName(type);
                setModalOpen(true)
                setEditAuthId(data)
                dispatch(editAuthUser({ user_id: data }))
                break;
            }
            case "SwitchPrimaryPop": {
                setModalAllVal(data)
                setModalName(type);
                setModalOpen(true)
                break;
            }
            case 'EditCinicDetailPop': {
                setModalAllVal(data)
                setModalName(type);
                setModalOpen(true)
                // dispatch(getclinic({ id: clinic_id }))
                break;
            }
            case 'DeleteAuthorizedPop': {
                setModalAllVal(data)
                setModalName(type);
                setModalOpen(true)
                break;
            }
            case 'DeletePhysicianPop': {
                setModalAllVal(data)
                setModalName(type);
                setModalOpen(true)
            }
                break;
            case "CommonPop": {
                setModalAllVal(data)
                setModalName(type);
                setModalOpen(true)
            }
                break;
            case 'PhyStatusUpdatePop': {
                setModalAllVal(data)
                setModalName(type);
                setModalOpen(true)
            }
                break;
            case 'AuthorizedUserStatusPop': {
                setModalAllVal(data)
                setModalName(type);
                setModalOpen(true)
                break
            }
            case 'ChangeMinutesPlanBtn': {
                setModalAllVal(data)
                setModalName(type);
                setModalOpen(true)
                break
            }
            case 'CancelMinutesPlanBtn': {
                setModalAllVal(data)
                setModalName(type);
                setModalOpen(true)
                break
            }
            default: {
                setModalOpen(!openModal);
            }
        }
    }

    const TimeDate = (data) => {
        let currentTime = moment();
        let endString = `${data?.nextBillingDate}`;
        let endTime = data && moment(endString);
        return Math.round(moment.duration(endTime?.diff(currentTime))?.asDays());

    }

    return (
        <>
            <div className="clinic_detail">
                <div className="clinic_detail_heading">
                    <div className="clinic_detail_heading_box sub-heading_block">
                        <div className="clinic_detail_heading_text"><h2>clinic details</h2></div>
                        <div className="clinic_detail_heading_text"><span className='reg_code-span'>Care Center Registration Code: {clinic_detail?.care_registration_code}</span></div>
                        <div className="clinic_detail_heading_text"><h2 className='licenses_title'>Total Monthly Recurring Licenses: {clinic_detail?.tot_recuring_licenses}</h2></div>
                    </div>
                </div>
                {
                    loader ?
                        <Loader className={'content-loader'} />
                        :
                        <>
                            <div className="clinic_details_flex">
                                <ClinicDetailInfo clinicDetailList={clinic_detail} handleOpenModal={handleOpenModal} cliinc_id={clinic_id} />
                                <div className="clinic_details_flex--block2">
                                    <ClinicAuthorizedUser clinic_detail={clinic_detail} clinic_id={clinic_id} handleOpenModal={handleOpenModal} />
                                    <ClinicPhysician clinic_detail={clinic_detail} clinic_id={clinic_id} handleOpenModal={handleOpenModal} />
                                </div>
                            </div>
                            <div className="billing_details_main">
                                <div className="billing_heading"><h4>Billing Details</h4></div>
                                <div className="billing_details">
                                    <div className="curr_bill"><h4>Current Billing Cycle: {`${moment.utc(clinic_detail?.current_biling_cycle?.startBillingDate).local().format('MM/DD/YYYY')} - ${moment.utc(clinic_detail?.current_biling_cycle?.nextBillingDate).local().format('MM/DD/YYYY')}`}</h4></div>
                                    <div className="curr_bill_details">
                                        <div className={`curr_bill`}>
                                            <h6>Total Recurring Licenses: {clinic_detail?.tot_recuring_licenses}</h6>
                                            <h6>Total Virtual Minutes Available: {clinic_detail?.billing_period_meeting_minutes === 'unlimited' ? 'unlimited' :(Math.round(clinic_detail?.totAvailableMin) || 0)}</h6>
                                            <h6>Total Virtual Minutes Per License: {clinic_detail?.billing_period_meeting_minutes}</h6>
                                            <h6>Total Virtual Minutes Scheduled: {Math.round(clinic_detail?.totScheduledMin) || 0}</h6>
                                            <h6>Total Virtual Minutes Consumed: {Math.round(clinic_detail?.totConsumedMin) || 0}</h6>
                                            <h6>Days Left In Billing Cycle: {TimeDate(clinic_detail?.current_biling_cycle) > 0 ? TimeDate(clinic_detail?.current_biling_cycle) : 0}</h6>
                                        </div>
                                        {/*<div className="curr_bill_details_text_flex">*/}

                                        {/*<div className="curr_bill_details_text">*/}
                                        {/*    <div className="curr_partleft">*/}
                                        {/*        <h6>Total Monthly Recurring Licenses: {clinic_detail?.tot_recuring_licenses}</h6>*/}
                                        {/*        <h6>Monthly Cost: {`$${clinic_detail?.min_monthly_cost || 0}`}</h6>*/}
                                        {/*    </div>*/}
                                        {/*    <div className="curr_partright">*/}
                                        {/*        <div className="curr_bill_details_text2 curr_bill">*/}
                                        {/*            <h6>Monthly Virtual Minutes per Physician (Plan): <span className={'text_capitalize'}>{clinic_detail?.monthly_plan}</span></h6>*/}

                                        {/*            /!*<button className="btn btn_primary " onClick={() => handleOpenModal('ChangeMinutesPlanBtn', { id: clinic_id, minute: clinic_detail?.upcoming_clinic_billing_minute })}>Change Minutes Plan</button>*!/*/}
                                        {/*        </div>*/}
                                        {/*        /!*<div className=" curr_bill_details_text2 curr_bill">*!/*/}
                                        {/*        /!*    {*!/*/}
                                        {/*        /!*        clinic_detail?.upcoming_clinic_billing_minute &&*!/*/}
                                        {/*        /!*        <>*!/*/}
                                        {/*        /!*            <a >This plan will change to {clinic_detail?.upcoming_clinic_billing_minute} min*!/*/}
                                        {/*        /!*                / physician from next billing cycle</a>*!/*/}
                                        {/*        /!*            <button className="btn btn_primary" onClick={() => handleOpenModal('CancelMinutesPlanBtn', { id: clinic_id })}>Cancel Change</button>*!/*/}
                                        {/*        /!*        </>*!/*/}
                                        {/*        /!*    }*!/*/}
                                        {/*        /!*</div>*!/*/}
                                        {/*    </div>*/}
                                        {/*</div>*/}
                                        {/*</div>*/}
                                        {/*<a href="#" className="additional_charges">View additional charges in current billing cycle</a>*/}
                                    </div>


                                    <div className='pastinvoice_main'>
                                        <div className='past_invoices'>
                                            <h6>Past Invoices</h6>
                                            <h6>Total Charged</h6>
                                        </div>
                                        <div className='total_charged'>
                                            <div className='invoices_date'>
                                                {
                                                    clinic_detail?.invoiceData?.length > 0 ?
                                                        clinic_detail?.invoiceData?.map(item => {
                                                            return (
                                                                <div className={`sub_invoice-block`}>
                                                                    <span className={`date`}>{moment(item?.invoiceDate).format('MMM, YYYY')}</span>
                                                                    <div className='charges_row'>
                                                                        <span className='price'>${`${item?.totalCost}`}</span>
                                                                        <a href={`/invoice/${item?._id}`} target={'_blank'} className='viewinvoice'>View Invoice</a>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                        :
                                                        <div>No Data Found</div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                }
            </div>





            <CustomModal className={`${modalName === 'DeleteAuthorizedPop' || modalName === 'DeletePhysicianPop' || modalName === 'PhyStatusUpdatePop' || modalName === "AuthorizedUserStatusPop" || modalName === 'CancelMinutesPlanBtn' ? "modal deletePop " : modalName === 'SwitchPrimaryPop' || modalName === 'ChangeMinutesPlanBtn' ? "modal primaryPop changemin-modal" : modalName === 'CommonPop' ? "modal errorPop" : "modal addPhy"}`} modalName={modalName} modalIsOpen={openModal} handleOpenModal={handleOpenModal}>
                <ModalData clinicId={clinic_id} handleOpenModal={handleOpenModal} modalAllVal={modalAllVal} editAuthId={editAuthId} loading={loading} />
            </CustomModal>
        </>


    )
}
export default ClinicDetail