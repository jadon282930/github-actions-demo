import React, {useEffect, useState} from "react";
import {useDispatch,useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {getInvoiceData} from "../../redux/Invoice/action";
import {getCountryData, getStateData} from "../../redux/Clinic/action";
import moment from "moment";
import Loader from "../../component/Loader";
import logo from './../../assets/images/hp-logo.png';

const Invoice = ()=>{

    const dispatch =  useDispatch(null)
    let { id: invoice_id } = useParams();
    const invoice_data = useSelector(state => state?.invoiceReducer?.invoice_data)
    const country = useSelector(state => state?.clinicReducer?.countryData)
    const [billing, setBilling] = useState({})
    const[loading,setLoading] = useState(false)

    useEffect(()=>{
        setLoading(true)
        dispatch(getInvoiceData({invoice_id:invoice_id})).then(res=>{
            if(res.status === 200){
                setLoading(false)
            }else{
                setLoading(false)
            }
        })
        dispatch(getCountryData())
    },[])
    useEffect(() => {
        if (country.length > 0 && invoice_id) {
            dispatch(getStateData({ country_id: invoice_data?.billing_address?.country })).then((res) => {
                if (res.status === 200) {
                    res.data.data.states?.forEach(ele =>{
                        if( ele.id === invoice_data?.billing_address?.state){
                            setBilling(ele)
                        }
                    })

                }
            })
        }
    }, [country.length,invoice_data])
    return(
        <>
            <header>
                <div className="container_fluid">
                    <div className="row main_herader_row">
                        <div className="header px_auto">
                            <div className="logo"><img src={logo} alt="logo_img" /></div>

                        </div>
                    </div>
                </div>
            </header>
        <div className="main_additionalmin-block invoice-block" id="cal">
            {
                loading?
                    <Loader className={'content-loader'}/>
                    :
            <div className="sub_additionalmin-block">
                <div className="client_corporation_block">
                    <h4>Invoice {invoice_data?.invoiceNo}</h4>
                    <h6>{invoice_data?.clinic_name}</h6>
                    {
                        country?.map(item => {
                            return (
                                item.id === invoice_data?.billing_address?.country ?
                                    <span className="address" key={item.id}>{invoice_data?.billing_address?.street}, <br></br> {invoice_data?.billing_address?.city}, {billing?.name} {item.name} {invoice_data?.billing_address?.zipcode}</span>
                                    :
                                    ""
                            )}
                        )
                    }
                    {/*<span className="address">{invoice_data?.billing_address?.street},{invoice_data?.billing_address?.city}</span>*/}
                    <div className="physician_licenses-block physician_block-top">
                        <span className="title">Total Physician Licenses: {invoice_data?.noOfPhysician}</span>
                    </div>
                    <div className="physician_licenses-block">
                        <span className="title">Monthly Minutes Plan: {invoice_data?.plan}</span>
                    </div>
                    <div className="billing_cycle-block">
                        <h4>Billing Cycle: {moment.utc(invoice_data?.startDate).local().format('MM/DD/YYYY')} - {moment.utc(invoice_data?.endDate).local().format('MM/DD/YYYY')}</h4>
                        <div className="total_plan total">
                            <span>Total Plan Cost for {invoice_data?.noOfPhysician} licenses</span>
                            <span>${new Intl.NumberFormat('US', { maximumSignificantDigits: 3 }).format(invoice_data?.totalPlanCost || 0)}</span>
                        </div>
                    </div>
                </div>
                <div className="table_responsive">
                    <table className="table additionalmin_table">
                        <thead>
                        <tr>
                            <td>Additional Minutes</td>
                            <td>Purchase Date</td>
                            <td>Purchased Minutes</td>
                            <td>Cost</td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            invoice_data?.additionalMin?.length > 0 &&
                            invoice_data?.additionalMin?.map((cost, i) => {
                                return (
                                    <tr>
                                        <td><span>Physician - {cost?.physicianName}</span></td>
                                        <td><span> {moment.utc(cost?.purchesedDate).local().format('MM/DD/YYYY')}</span></td>
                                        <td><span>{cost?.purchesedMin}</span></td>
                                        <td><span>${cost?.cost}</span></td>
                                    </tr>
                                )
                            })

                        }
                        </tbody>
                    </table>
                </div>
                <div className="total_cost total">
                    <div className="sub_total-cost">
                        <span>Total Cost</span>
                        <span>${new Intl.NumberFormat('US', { maximumSignificantDigits: 3 }).format(invoice_data?.totalCost || 0)}</span>
                    </div>
                </div>
            </div>
            }
        </div>
            <footer>
                <div className="gradiant_border"/>
                <div className="sub-footer_block">
                    <p>Haploscope is building the first patient-centric integrated Tele-oncology platform
                        for immediate access to oncologists and community platform.</p>
                    <span>Copyright © 2022 Haploscope - All Rights Reserved</span>
                </div>
            </footer>
            </>
    )
}

export default Invoice