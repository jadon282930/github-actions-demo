import { formatPhoneNumber } from "../../../utils";
import ghostLogin from "../../../assets/images/ghostLogin.svg";
import Un_lock from "../../../assets/images/Unlock_icon.svg";
import icon_lock from "../../../assets/images/icon_lock.svg";
import moment from 'moment';
import { Tooltip } from "antd";
import { useDispatch } from "react-redux";
import React from "react";
import { resendInvitationPhysician } from "../../../redux/physician/action";
import { ghostLoginPhysician } from "../../../redux/GhostLogin/action";
import alert_icon from "../../../assets/images/alert_icon.svg";

const ClinicPhysician = ({ clinic_detail, clinic_id, handleOpenModal }) => {
    const dispatch = useDispatch(null)
    const resendInvitation = (id) => {
        dispatch(resendInvitationPhysician(id)).then(res => {
            if (res.status === 201) {
                handleOpenModal('CommonPop', { header: "Success", body: res.data.message, auth: true })
            } else {
                handleOpenModal('CommonPop', { header: "Info", body: res.data.message, auth: true })
            }
        }).catch(err => {
            handleOpenModal('CommonPop', { header: "Error", body: err.message })
        })
    }
    const ghostLoginPhysicianData = (id) => {
        dispatch(ghostLoginPhysician(id)).then(res=>{
            if(res.status === 400){
                handleOpenModal('CommonPop', { header: "Info", body: res.data.message, auth: true })
            }
        })
    }
    return (
        <div className="physicians">
            <div className="physicians_users_head">
                <div className="authorized_users_head_heading"><h4>Physicians (Licenses)</h4></div>
                <div><button className="add" onClick={() => handleOpenModal('AddPhysicianPop', { type: 'clinic' })}>Add</button></div>
            </div>

            <div className='main_physicians_users_table'>
                <table className="authorized_users_table">
                    <thead>
                        <tr>
                            <th className="blank">    </th>
                            <th />
                            <th className="authorized_users_details_text  physicians_addon"> Added On  </th>
                            <th className="authorized_users_details_text physicians_action_heading"> Actions </th>
                        </tr>
                    </thead>
                    <tbody>
                        {clinic_detail?.physicianUsers?.length > 0 ?
                            clinic_detail?.physicianUsers?.map((_phy, i) => (
                                <tr className="authorized_users_data " key={_phy?._id}>
                                    {/*<td className="alert">*/}
                                    {/*    {_phy?.status ?*/}
                                    {/*        '' : < img src={require("../../../assets/images/alert_icon.svg").default} alt="" />*/}
                                    {/*    }*/}
                                    {/*</td>*/}
                                    <td className="alert phy_hover_clinic_auth">
                                        {!_phy?.status &&
                                        <div className='ps-code'>
                                            {_phy?.status ?
                                                '' :
                                                < img src={require("../../../assets/images/alert_icon.svg").default}
                                                      alt=""/>
                                            }
                                            <div className='reg_code'>
                                                <p>This physician is yet to accept his/her invitation</p>
                                            </div>
                                        </div>}
                                    </td>
                                    <td>
                                        <ul className="authorized_users_data_info">
                                            <li className="authorized_users_name"><h4>Dr. {_phy.first_name + " " + _phy.last_name}</h4></li>
                                            <li className="authorized_users_email"><h5>{_phy.email}</h5></li>
                                            <li className="authorized_users_contact"><h5>{formatPhoneNumber(_phy.phone)} {(_phy?.phone_type === " " || _phy?.phone_type === '') ? " " : `x`} {_phy?.phone_type} </h5></li>
                                        </ul>
                                    </td>
                                    <td className="addon_date"><span>{moment(_phy.AddedOn).format('MM/DD/YYYY')}</span></td>
                                    <td className='td_icons'>
                                        <div className="authorized_users_data_img">

                                            {
                                                _phy?.status ?
                                                    <Tooltip placement="bottom" title={'Ghost Login Physician'}>
                                                        <div className="user_option"><img src={ghostLogin} alt="" onClick={() => ghostLoginPhysicianData({ id: _phy?.physician_id })} /></div>
                                                    </Tooltip>
                                                    :
                                                    <div className="user_option"><img alt="" /></div>
                                            }
                                            <Tooltip placement="bottom" title={'Edit Physician'}>
                                                <div className="user_option"><img onClick={() => handleOpenModal('EditPhysicianPop', { id: _phy.physician_id, type: 'clinic' })} src={require("../../../assets/images/Edit_icon.svg").default} alt="" /></div>
                                            </Tooltip>
                                            {_phy?.status ?
                                                <Tooltip placement="bottom" title={'Status Physician'}>
                                                    <div className="user_option"><img
                                                        src={_phy?.isActive[0]?.isActive ? Un_lock : icon_lock} alt=""
                                                        onClick={() => handleOpenModal('PhyStatusUpdatePop', { physician_id: _phy.physician_id, status: _phy?.isActive[0]?.isActive, type: 'clinic' })}
                                                    />
                                                    </div>
                                                </Tooltip>
                                                :
                                                ''
                                            }
                                            <Tooltip placement="bottom" title={'Delete Physician'}>
                                                <div className="user_option">
                                                    <img onClick={() => handleOpenModal('DeletePhysicianPop', { id: _phy?.physician_id, type: 'clinic' })} src={require("../../../assets/images/dustbin_icon.svg").default} alt="" />
                                                </div>
                                            </Tooltip>
                                        </div>
                                        {
                                            _phy?.status ?
                                                ''
                                                :
                                                <div className="invite_div"><button className="btn btn_primary invite" onClick={() => resendInvitation({ id: _phy?.physician_id })} type='submit'>Resend Invite</button></div>
                                        }
                                    </td>
                                </tr>
                            )) : <tr><td colSpan={9}><div className="mt_5 pb_5 pt_5 fullWidth text_center nodata" >No Data Found</div></td></tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default ClinicPhysician