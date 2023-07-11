import React from 'react'
import { useSelector } from 'react-redux';
import Loader from "../../Loader";
import {formatPhoneNumber, generateAvatar} from "../../../utils";

function PhysicianDetailsPop({phyLoader}) {
    const getPhsycianDetals = useSelector(state => state?.physicianReducer?.getPhysicianDtails)

    return (
        <>
            <div className="physician_detail form_group lodar_modal_phy">
                <h4>Physician Detail</h4>
                {
                    phyLoader?
                        <Loader className={'content-loader'}/>
                        :
                    Object.keys(getPhsycianDetals)?.length &&
                        <div className='pd_block'>
                            <div className="main_physician_details">
                                <div className="form_group profile">
                                    <div className="user_profile">
                                        <div className="user_profile_pic">
                                            <img src={getPhsycianDetals?.profile ? getPhsycianDetals?.profile : generateAvatar(`${getPhsycianDetals?.first_name + " " + getPhsycianDetals?.last_name}`)} alt="" />
                                        </div>
                                        <label htmlFor="" className='profile_label'>Profile Photo</label>
                                    </div>
                                </div>
                                <div className="form form_group details">
                                    <div className="forms_details_box">
                                        <div className="form_row">
                                            <div className="clinic_data">
                                                <h3 className="forms_details"> Physician First Name</h3>
                                                <p className="forms_details_text montserrat_bold text_capitalize" >{getPhsycianDetals?.first_name}</p>
                                            </div>
                                            <div className="clinic_data">
                                                <h3 className="forms_details">Physician Last Name </h3>
                                                <p className="forms_details_text montserrat_bold text_capitalize" >{getPhsycianDetals?.last_name}</p>
                                            </div>
                                        </div>
                                        <div className="clinic_name_wrap">
                                            <div className="clinic_data">
                                                <h3 className="forms_details"> Contact Email </h3>
                                                <p id="email" className="mb_3 forms_details_text montserrat_bold" >{getPhsycianDetals?.email}</p>
                                            </div>
                                        </div>
                                        <div className="d_flex form_row form_group">
                                            <div className="clinic_data">
                                                <h3 className="forms_details"> Contact Phone </h3>
                                                <p className="forms_details_text montserrat_bold" >{formatPhoneNumber(getPhsycianDetals?.phone)}</p>
                                            </div>
                                            <div className="clinic_data">
                                                <h3 className="forms_details"> Extension </h3>
                                                <p className="forms_details_text montserrat_bold" >{getPhsycianDetals?.phone_type}</p>
                                            </div>
                                        </div>
                                        <div className="clinic_name_wrap">
                                            <div className="clinic_data">
                                                <h3 className="forms_details"> Years of Experience </h3>
                                                <p className="mb_3 forms_details_text montserrat_bold" >{getPhsycianDetals?.years_of_experiance}</p>
                                            </div>
                                        </div>
                                        <div className="clinic_name_wrap">
                                            <div className="clinic_data">
                                                <h3 className="forms_details"> Abbreviated Degrees </h3>
                                                <div className='main_degrees_div main_list'>
                                                    <p className="mb_3 forms_details_text montserrat_bold physician_degress" >{getPhsycianDetals?.abbreviated_degrees},</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="clinic_name_wrap">
                                            <div className="clinic_data main_bio">
                                                <h3 className="forms_details">Bio </h3>
                                                <p className="mb_3 forms_details_text montserrat_bold" >{getPhsycianDetals?.bio}</p>
                                            </div>
                                        </div>
                                        <div className="clinic_name_wrap">
                                            <div className="clinic_data">
                                                <h3 className="forms_details">Education </h3>
                                                <div className='main_education main_list'>

                                                    {getPhsycianDetals?.education?.map((data) => (<ul className="mb_3 forms_details_text montserrat_bold"  > <li key={data._id}>{data},</li>  </ul>))
                                                    }

                                                </div>
                                            </div>
                                        </div>
                                        <div className="clinic_name_wrap">
                                            <div className="clinic_data">
                                                <h3 className="forms_details">Center Affiliations </h3>
                                                <div className='main_list'>

                                                    {getPhsycianDetals?.center_affiliations?.map(data => (<ul className="mb_3 forms_details_text montserrat_bold" > <li key={data._id}>{data},</li>   </ul>))
                                                    }

                                                </div>
                                            </div>
                                        </div>
                                        <div className="clinic_name_wrap">
                                            <div className="clinic_data">
                                                <h3 className="forms_details">Awards and Activities </h3>
                                                <div className='main_list'>

                                                    {
                                                        getPhsycianDetals?.awards_activities?.map(data => (<ul className="mb_3 forms_details_text montserrat_bold" > <li key={data._id}>{data},</li>   </ul>))
                                                    }

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                }

            </div>
        </>
    )
}

export default PhysicianDetailsPop
