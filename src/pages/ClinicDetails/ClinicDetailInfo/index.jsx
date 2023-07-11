
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { getCountryData, getStateData } from "../../../redux/Clinic/action";
import {formatPhoneNumber} from "../../../utils";

const ClinicDetailInfo = ({ clinicDetailList, handleOpenModal,cliinc_id }) => {
    const country = useSelector(state => state?.clinicReducer?.countryData)
    const [business, setBussines] = useState([])
    const [billing, setBilling] = useState([])
    const [test,setTest]= useState()
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getCountryData())
    }, [])

    useEffect(() => {

        if (country.length > 0 && clinicDetailList && cliinc_id === clinicDetailList?._id) {
            if(clinicDetailList?.billing_address?.country?.length > 0  && clinicDetailList?.business_address?.country?.length > 0 ){
                if(clinicDetailList?.billing_address?.country === clinicDetailList?.business_address?.country){
                    console.log('one')
                    dispatch(getStateData({ country_id: clinicDetailList?.business_address?.country })).then((res) => {
                        if (res.status === 200) {
                            setBussines(res.data.data.states)
                            setBilling(res.data.data.states)
                        }
                    })
                }else{
                    dispatch(getStateData({ country_id: clinicDetailList?.business_address?.country })).then((res) => {
                        if (res.status === 200) {
                            setBussines(res.data.data.states)
                        }
                    })
                    dispatch(getStateData({ country_id: clinicDetailList?.billing_address?.country })).then((res) => {
                        if (res.status === 200) {
                            setBilling(res.data.data.states)
                        }
                    })
                }
            }
        }
    }, [country.length,dispatch,clinicDetailList])


    return (
        <div className="clinic_details_flex--block1">
            <div id="form">
                <div className="  forms_details">
                    <span className="forms_details_text ">Clinic Name</span> <button className="edit" onClick={() => handleOpenModal('EditCinicDetailPop')}>Edit</button>
                </div>
                <div> <p id="clinic_name" className="mb_3">{clinicDetailList?.clinic_name}</p> </div>

                <div className="forms_details_box">
                    <div className="clinic_name_wrap">
                        <div className="clinic_data">
                            <h3 className="forms_details"> Contact First Name</h3>
                            <p className="  forms_details_text text_capitalize" >{clinicDetailList?.PrimaryUser?.first_name}</p>
                        </div>
                        <div className="clinic_data">
                            <h3 className="forms_details"> Contact Last Name </h3>
                            <p className="  forms_details_text text_capitalize" >{clinicDetailList?.PrimaryUser?.last_name}</p>
                        </div>
                    </div>

                    <div>
                        <div className="clinic_name_wrap">
                            <div className="clinic_data">
                                <h3 className="forms_details"> Contact Email </h3>
                                <p id="email" className="mb_3 forms_details_text" >{clinicDetailList?.PrimaryUser?.email}</p>
                            </div>
                        </div>
                        <div className="d_flex clinic_name_wrap">
                            <div className="clinic_data">

                                <h3 className="forms_details"> Contact Phone </h3>
                                <p className="  forms_details_text" >{formatPhoneNumber(clinicDetailList?.PrimaryUser?.phone)}</p>
                            </div>
                            <div className="clinic_data">
                                <h3 className="forms_details"> Phone Type </h3>
                                <p className="  forms_details_text" >{clinicDetailList?.PrimaryUser?.phone_type}</p>
                            </div>
                        </div>
                        <div className="primarycontact"><h5>(Primary Contact)  </h5></div>
                    </div>
                </div>
            </div>

            <div className="business_box">
                <div className="business_box_heading "><h5 className="fill valid" >Business Address</h5></div>
                <div className="business_address_box">
                    <div className="business_data clinic_data" >
                        <h3 className="businessforms_details"> Street </h3>
                        <p id="street" className="forms_details_text text_capitalize" >{clinicDetailList?.business_address?.street}</p>
                    </div>

                    <div className="d_flex address">
                        <div className="business_data business_addr">
                            <h3 className="businessforms_details"> City </h3>
                            <p id="street" className="  forms_details_text text_capitalize" >{clinicDetailList?.business_address?.city}</p>
                        </div>
                        <div className="business_data business_addr">
                            <h3 className="businessforms_details"> Zip Code </h3>
                            <p id="street" className="mb_3 forms_details_text" >{clinicDetailList?.business_address?.zipcode}</p>
                        </div>
                    </div>

                    <div className="d_flex state">
                        <div className="business_data country">
                            <h3 className="businessforms_details"> Country </h3>
                            {
                                country?.map(item => (
                                    <>
                                        {
                                            item.id === clinicDetailList?.business_address?.country ?
                                                <p id="street"
                                                   className="text_capitalize  forms_details_text" key={item.id}>{item.name}</p>
                                                :
                                                ""
                                        }

                                    </>
                                ))
                            }
                        </div>
                        <div className="business_data state_street">
                            <h3 className="businessforms_details"> State </h3>
                            {
                                business?.map(item => (
                                    <>
                                        {
                                            item.id === clinicDetailList?.business_address?.state ?
                                                <p id="street"
                                                   className=" text_capitalize forms_details_text" key={item.id}>{item.name}</p>
                                                :
                                                ""
                                        }

                                    </>
                                ))
                            }
                        </div>
                    </div>

                </div>

            </div>
            <div className="business_box">
                <div className="business_box_heading"><h5>Billing Address</h5></div>

                <div className="business_address_box">
                    <div className="business_data clinic_data">
                        <h3 className="businessforms_details"> Street </h3>
                        <p id="street" className="  forms_details_text text_capitalize" >{clinicDetailList?.billing_address?.street}</p>
                    </div>

                    <div className="d_flex address">
                        <div className="business_data business_addr">
                            <h3 className="businessforms_details"> City </h3>
                            <p id="street" className="text_capitalize forms_details_text" >{clinicDetailList?.billing_address?.city}</p>
                        </div>
                        <div className="business_data business_addr">
                            <h3 className="businessforms_details"> Zip Code </h3>
                            <p id="street" className="  forms_details_text" >{clinicDetailList?.billing_address?.zipcode}</p>
                        </div>
                    </div>

                    <div className="d_flex state">
                        <div className="business_data country">
                            <h3 className="businessforms_details"> Country </h3>
                            {
                                country?.map(item => (
                                    <>
                                        {
                                            item.id === clinicDetailList?.billing_address?.country ?
                                                <p id="street"
                                                   className="text_capitalize forms_details_text" key={item.id}>{item.name}</p>
                                                :
                                                ""
                                        }

                                    </>
                                ))
                            }
                        </div>
                        <div className="business_data state_street">
                            <h3 className="businessforms_details"> State </h3>
                            {
                                billing?.map(item => (
                                    <>
                                        {
                                            item.id === clinicDetailList?.billing_address?.state ?
                                                <p id="street"
                                                   className="text_capitalize forms_details_text" key={item.id}>{item.name}</p>
                                                :
                                                ""
                                        }

                                    </>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ClinicDetailInfo