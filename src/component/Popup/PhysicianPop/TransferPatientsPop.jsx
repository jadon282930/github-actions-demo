import React, { useEffect, useMemo, useState } from 'react'
import SearchIcon from '../../../assets/images/Search_icon.png'
import { assignPatientsData, filterSearch, getPhysicianPatients } from "../../../redux/physician/action";
import { useDispatch, useSelector } from "react-redux";
import Checkbox from '../../Checkbox'
import { useForm } from "react-hook-form";
import Validation from "../../formValidation";
import SearchTransferPhy from "../../SearchTransferPhy";
import FilledButton from "../../FilledButton";
import Loader from '../../Loader';

const CheckboxGroup = Checkbox.Group;

export default function TransferPatientsPop({ modalAllVal, handleOpenModal, cancelData }) {
    const { register, watch, errors, formState, handleSubmit, setValue, reset } = useForm({ mode: "all" });
    const [loading, setLoading] = useState(false)
    const [loader, setLoader] = useState(false)
      let phyList =  useSelector(state => state?.physicianReducer?.getPhyPatients)
    const dispatch = useDispatch()
    const [isCheckAll, setIsCheckAll] = useState(true)
    const [isCheck, setIsCheck] = useState([]);
   const [checkBoxError,setCheckBoxError] = useState()
   useEffect(()=>{
    setLoader(true)
    dispatch(getPhysicianPatients({ physician_id: modalAllVal })).then(res=>{
        if(res.status === 200){
            setLoader(false)
        }else{
            setLoader(false)
        }
    })
},[modalAllVal])
    const handleClick = e => {
        const { id, checked } = e.target;
        setIsCheck([...isCheck, id]);
        if (!checked) {
            setIsCheck(isCheck.filter(item => item !== id));
        }


    };
    useEffect(() => {
        if (phyList?.patients?.length > 0) {
            setIsCheck(phyList?.patients?.map(li => li?.patient_id));
        }
    }, [phyList?.patients?.length])

    useEffect(()=>{
        if(isCheck.length === phyList?.patients?.length){
            setIsCheckAll(true)
        } else {
            setIsCheckAll(false)
        }

    }, [isCheck, phyList?.patients?.length])

    const handleSelectAll = e => {
        setIsCheckAll(!isCheckAll);
        setIsCheck(phyList?.patients.map(li => li?.patient_id));
        if (isCheckAll) {
            setIsCheck([]);
        }
    }
    useEffect(() => {
        if (isCheck.length > 0) {
            setCheckBoxError('')
        }
    },[isCheck])
    const transferPhysicianData =(state)=>{
            if(isCheck.length === 0) {
                setCheckBoxError('Please Select patients')
            }else{
                setLoading(true)
                Object.assign(state,{patients:isCheck})
                Object.assign(state,{old_physician_id:modalAllVal})
                dispatch(assignPatientsData(state)).then(res=>{
                    if(res.status === 201) {
                        setLoading(false)
                        handleOpenModal('CommonPop', { header: "Success", body: res?.data?.message, auth: true })
                    }else {
                        setLoading(false)
                        handleOpenModal('CommonPop', { header: "Info", body: res?.data?.message, auth: true })
                    }
                }).cache(e => {
                setLoading(false)
                handleOpenModal('CommonPop', { header: "Error", body: e.message, auth: true })
            })
        }
    }


    useEffect(() => {
        reset()
    }, [handleOpenModal])


    return (
        <div className='main_transfer_patients'>
            <h4>Assign patients to another physician</h4>
            <form onSubmit={handleSubmit(transferPhysicianData)}>
                <div className='sub_transfer_patients'>
                    <div className='form_group transfer_form_grup'>
                        <label htmlFor='select_physician'>Select Physician</label>
                        <select
                            name="physician_id"
                            className={`${watch('physician_id')} form_control`}
                            ref={register({ required: "Please Select a Physician" })}
                        >
                            <option value={''} >Select</option>
                            {
                                phyList?.physicians?.length > 0 && phyList?.physicians?.map((_phy, i) => {
                                    return (
                                        <option value={_phy._id} key={_phy._id}>{_phy?.first_name + " " + _phy?.last_name}</option>
                                    )
                                })
                            }
                        </select>

                        <Validation errors={errors.physician_id} message={errors?.physician_id?.message} watch={watch("physician_id")} />
                    </div>
                    <div className='main_select_patient'>
                        <h6>Select patients from below</h6>
                        <div className="select_patient_box">
                            <SearchTransferPhy id={modalAllVal} />

                            <div className='select_all_patient_box'>
                                <div className='main_select_all'>
                                    {
                                             loader?
                                             <>
                                                 <Loader className={'content-loader-transfer'}/>
                                             </>
                                             :
                                        phyList?.patients?.length > 0 ?
                                            <>
                                                <div className="form_group checkbox selectall_checkbox">
                                                    <Checkbox
                                                        type="checkbox"
                                                        name="selectAll"
                                                        id="selectAll"
                                                        handleClick={(e) => handleSelectAll(e)}
                                                        isChecked={isCheckAll}
                                                    />
                                                    <span className="checkbox_clone" />
                                                    <label htmlFor="selectAll">Select All</label>
                                                </div>
                                                <div>
                                                    <div className='main_patients_details '>
                                                        <div
                                                            className='patients_name patients_details patients_name_email'>
                                                            <h4>Patient Name</h4>
                                                            <h4>Email/Phone</h4>
                                                        </div>
                                                        {
                                                            phyList?.patients?.length > 0 && phyList?.patients?.map((item) => {
                                                                return (
                                                                    <div className={'d_flex inner_phy_content'} key={item.patient_id}>
                                                                        <div className='inner_div'>
                                                                            <div
                                                                                className="form_group checkbox">
                                                                                <Checkbox
                                                                                    key={item?.patient_id}
                                                                                    type="checkbox"
                                                                                    handleClick={handleClick}
                                                                                    id={item?.patient_id}
                                                                                    name={item?.first_name}
                                                                                    isChecked={isCheck.includes(item?.patient_id)}
                                                                                />

                                                                                <span className="checkbox_clone" />
                                                                            </div>
                                                                            <div
                                                                                className='show_name'>
                                                                                <label htmlFor={item?.patient_id} className={'pl_1 pl_label_1'}>{item?.first_name + " " + item?.last_name}</label>
                                                                            </div>
                                                                        </div>

                                                                        <div className={'patients_name patients_details'}>
                                                                            <div
                                                                                className='show_name'>
                                                                                <label  htmlFor={item?.patient_id}  className={'pl_label_2'}>{item?.email}</label>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })
                                                        }

                                                        {/*<div*/}
                                                        {/*    className='patients_email patients_details'>*/}

                                                        {/*{*/}
                                                        {/*    phyList?.patients?.length > 0 && phyList?.patients?.map((item,i) => {*/}
                                                        {/*        return (*/}
                                                        {/*            <div*/}
                                                        {/*                className='show_name' key={i}>*/}
                                                        {/*                <span>{item?.email}</span>*/}
                                                        {/*            </div>*/}


                                                        {/*        )*/}
                                                        {/*    })*/}
                                                        {/*}*/}

                                                        {/*</div>*/}
                                                    </div>
                                                </div>
                                            </>
                                            :
                                            <div className='nodata'>No Data found</div>
                                    }

                                </div>
                            </div>


                        </div>
                        <div className={'errorMsg'}>{checkBoxError}</div>
                    </div>
                    {/* buttons */}
                    <div className="form_group d_flex justify_content_center form_action modal_btn">
                        <button className="btn btn_default" type={'reset'} onClick={() => handleOpenModal()}>Cancel</button>
                        <FilledButton type="submit" loading={loading} value={'Submit'} className="btn btn_primary ml_2" />
                        {/*<button className="btn btn_primary" type="submit">Submit</button>*/}
                    </div>
                </div>
            </form>
        </div>
    )
}
