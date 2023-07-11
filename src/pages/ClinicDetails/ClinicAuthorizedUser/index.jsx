import { formatPhoneNumber } from "../../../utils";
import moment from "moment";
import { Tooltip } from "antd";
import ghostLogin from "../../../assets/images/ghostLogin.svg";
import Un_lock from "../../../assets/images/Unlock_icon.svg";
import icon_lock from "../../../assets/images/icon_lock.svg";
import React from "react";
import { resendinvItationAuthorized } from "../../../redux/Clinic/action";
import { useDispatch } from "react-redux";
import { ghostLoginClinic } from "../../../redux/GhostLogin/action";


const ClinicAuthorizedUser = ({ clinic_detail, clinic_id, handleOpenModal }) => {
    const dispatch = useDispatch();
    const authUserChangeHandler = (e, userId, clinicId) => {
        let payload = {
            user_id: userId,
            clinic_id: clinicId
        }
        if (e.target.checked) {
            handleOpenModal('SwitchPrimaryPop', payload)
        }
    }
    const resendInvitationUser = (id) => {
        dispatch(resendinvItationAuthorized({ id: id })).then(res => {
            handleOpenModal('CommonPop', { header: 'Success', body: res.data.message, auth: true })
        })
    }
    const ghostLoginClinicData = (id) => {
        dispatch(ghostLoginClinic(id)).then(res=>{
            if(res.status === 400){
                handleOpenModal('CommonPop', { header: "Info", body: res.data.message, auth: true })
            }
        })
    }
    return (
        <div className="authorized_users">
            <div className="authorized_users_head">
                <div className="authorized_users_head_heading"><h4>Authorized Users ({clinic_detail?.AuthUserCount}/3)</h4></div>
                <div>
                    {
                        clinic_detail?.AuthUserCount >= 3 ?
                            <button className="add disabled disableButton" >Add</button>
                            :
                            <button className="add" onClick={() => handleOpenModal('AuthorizedPop')}>Add</button>
                    }

                </div>
            </div>

            <div className='main_authorized_table'>
                <table className="authorized_users_table">
                    <thead>
                        <tr>
                            <th className="blank">    </th>
                            <th>    </th>
                            <th className="authorized_users_details_text  addon"> Added On  </th>
                            <th className="authorized_users_details_text primarycontactheading"> Primary  Contact  </th>
                            <th className="authorized_users_details_text action_heading"> Actions </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            clinic_detail?.authUsers?.length > 0 ?
                                clinic_detail?.authUsers?.map((_auth, i) => (
                                    <tr className="authorized_users_data " key={_auth._id}>
                                        {/*{*/}
                                        {/*    _auth.status ?*/}
                                        {/*        <td/>*/}
                                        {/*        :*/}
                                        {/*        <td className="alert"> <img src={require("../../../assets/images/alert_icon.svg").default} alt="" /></td>*/}
                                        {/*}*/}
                                        <td className="alert phy_hover_clinic_auth">
                                            {
                                                !_auth?.status &&
                                                <div className='ps-code'>
                                                    {_auth?.status ?
                                                        '' : < img src={require("../../../assets/images/alert_icon.svg").default} alt="" />
                                                    }
                                                    <div className='reg_code'>
                                                        <p>This user is yet to accept his/her invitation</p>
                                                    </div>
                                                </div>
                                            }

                                        </td>
                                        <td>
                                            <ul className="authorized_users_data_info">
                                                <li className="authorized_users_name"><h4>{_auth.first_name + " " + _auth.last_name}</h4></li>
                                                <li className="authorized_users_email"><h5>{_auth.email}</h5></li>
                                                {console.log(_auth?.phone_type === " " ,_auth?.phone_type === "")}
                                                <li className="authorized_users_contact"><h5> {formatPhoneNumber(_auth?.phone)} {(_auth?.phone_type === " " || _auth?.phone_type === "") ? " " : `x`}  {_auth?.phone_type} </h5></li>
                                            </ul>
                                        </td>

                                        <td className="addon_date"><span>{moment(_auth.AddedOn).format('MM/DD/YYYY')}</span></td>
                                        {/*{_auth.status ?*/}
                                        <td className='td_checkbox'>
                                            <div className="form_group checkbox authorized_users_checkbox">
                                                <input type="checkbox" id="checkbox_above" checked={!!_auth?.isPrimary} onChange={(e) => authUserChangeHandler(e, _auth.user_id, clinic_id)} />
                                                <span className="checkbox_clone"/>
                                            </div>
                                        </td>
                                        {/*// : <td className='td_checkbox'></td>}*/}
                                        {
                                            _auth?.isPrimary ?
                                                <td className='td_icons'>
                                                    <div className="authorized_users_data_img">
                                                        <Tooltip placement="bottom" title={'Authorized User Ghost Login'}>
                                                            {
                                                                _auth?.status ?
                                                                    <div className="user_option" onClick={() => ghostLoginClinicData({ id: _auth?.user_id })}><img src={ghostLogin} alt="" /></div> : ''
                                                            }
                                                        </Tooltip>
                                                        <Tooltip placement="bottom" title={'Authorized User Edit'}>
                                                            <div className="user_option"><img src={require("../../../assets/images/Edit_icon.svg").default} alt="" onClick={() => handleOpenModal('editAuthorizedPop', _auth.user_id)} /></div>
                                                        </Tooltip>

                                                    </div>
                                                    {_auth?.status ? " " : <div className="invite_div">
                                                        <button className="btn btn_primary invite" onClick={() => resendInvitationUser(_auth?.user_id)}>Resend Invite</button></div>}
                                                </td>
                                                :
                                                <td className='td_icons'>
                                                    <div className="authorized_users_data_img">
                                                        <Tooltip placement="bottom" title={'Authorized User Ghost Login'}>
                                                            {
                                                                _auth?.status ?
                                                                    <div className="user_option"><img src={ghostLogin} alt="" onClick={() => ghostLoginClinicData({ id: _auth?.user_id })} /></div> : ''
                                                            }
                                                        </Tooltip>
                                                        <Tooltip placement="bottom" title={'Authorized User Edit'}>
                                                            <div className="user_option">
                                                                <img src={require("../../../assets/images/Edit_icon.svg").default} alt="" onClick={() => handleOpenModal('editAuthorizedPop', _auth.user_id)} />
                                                            </div>
                                                        </Tooltip>
                                                        <Tooltip placement="bottom" title={'Authorized User Status'}>
                                                            {_auth?.status ? <div className="user_option"><img
                                                                src={_auth.isActive[0]?.isActive ? Un_lock : icon_lock}
                                                                alt=""
                                                                onClick={() => handleOpenModal('AuthorizedUserStatusPop', {
                                                                    auth_id: _auth.user_id,
                                                                    status: _auth?.isActive[0]?.isActive
                                                                })} />
                                                            </div> : ' '}
                                                        </Tooltip>
                                                        <Tooltip placement="bottom" title={'Authorized User Delete'}>
                                                            <div className="user_option">
                                                                <img src={require("../../../assets/images/dustbin_icon.svg").default} alt="" onClick={(e) => handleOpenModal('DeleteAuthorizedPop', _auth.user_id)} />
                                                            </div>
                                                        </Tooltip>

                                                    </div>
                                                    {_auth?.status ? " " : <div className="invite_div"><button className="btn btn_primary invite" onClick={() => resendInvitationUser(_auth?.user_id)}>Resend Invite</button></div>}
                                                </td>
                                        }

                                    </tr>
                                ))
                                : <tr><td colSpan={9}><div className="mt_5 pb_5 pt_5 fullWidth text_center nodata" >No Data Found</div></td></tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default ClinicAuthorizedUser