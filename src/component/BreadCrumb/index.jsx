import search_icon from "../../assets/images/Search_icon.png";
import history from "../../history";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { searchClinicList } from "../../redux/Clinic/action";
import {useDispatch, useSelector} from "react-redux";
import { searchPhysicianList } from "../../redux/physician/action";
import download_outlined from "../../assets/images/download-outlined.svg";
import { CSVLink } from "react-csv";
import moment from "moment";
import {searchContactData} from "../../redux/WebsiteLeads/action";

const BreadCrumb = ({ isClinc, isPhy,setCurrentPage,iswebsiteLeads }) => {
    const { handleSubmit} = useForm({ mode: "all" });
    const web_leadsData =  useSelector(state => state?.leadsReducer?.leadsData)
    const dispatch = useDispatch()
    //searchContactData
    const searchHandler = (e, type) => {
        if (type === 'clinic') {
            setCurrentPage(1)
            let Payload = {
                search: e.target.value
            }
            dispatch(searchClinicList(Payload))

        }
        if (type === 'physician') {
            setCurrentPage(1)
            let Payload = {
                search: e.target.value
            }
            dispatch(searchPhysicianList(Payload))
        }

        if(type === 'websiteLeads') {
            let Payload = {
                search: e.target.value
            }
            dispatch(searchContactData(Payload))
        }

    }

    const headers = [
        { label: "First Name", key: "first_name" },
        { label: "Last Name", key: "last_name" },
        { label: "Email", key: "email" },
        { label: "Phone", key: "phone" },
        { label: "Organization", key: "organization" },
        { label: "Comments", key: "comments" },
        { label: "Date Added", key: "createdAt" },
    ];
    return (
        <div className="heading_content">
            {
                isPhy ?
                    <form className="form_group" onSubmit={handleSubmit(searchHandler)}>
                        <input type="text" placeholder="Search" className="form_control search_input" name={'search'} onChange={(e) => searchHandler(e, 'physician')} />
                        <span className="serch_icon"><img src={search_icon} alt="Search_Icon" /></span>
                    </form>
                    :
                    iswebsiteLeads ?
                        <>
                    <form className="form_group" >
                        <input type="text" placeholder="Search" className="form_control search_input" name={'search'} onChange={(e) => searchHandler(e, 'websiteLeads')} />
                        <span className="serch_icon"><img src={search_icon} alt="Search_Icon" /></span>
                    </form>
                            <div className="add_clinics d_flex_center add_comman_header">
                                <div className="add_patient_block">
                                    <div className={'main_file_uploader_icon'}>
                                        <CSVLink data={web_leadsData} headers={headers} filename={`Patient_${moment().month() + 1}_${moment().date()}_${moment().year()}`}>
                                                <img src={download_outlined} alt={'download_outlined'} />
                                        </CSVLink>
                                    </div>

                                </div>
                            </div>

                    </>
                    :
                    <form className="form_group" onSubmit={handleSubmit(searchHandler)}>
                        <input type="text" placeholder="Search" className="form_control search_input" name={'search'} onChange={(e) => searchHandler(e, 'clinic')} />
                        <span className="serch_icon"><img src={search_icon} alt="Search_Icon" /></span>
                    </form>
            }

            {
                isClinc &&
                <div className="add_clinics">
                    <button className="btn" onClick={() => history.push('/add-clinic')}>Add A Clinic</button>
                </div>
            }

        </div>
    )
}

export default BreadCrumb