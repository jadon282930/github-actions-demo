import React, { useEffect, useMemo, useState } from "react";
import BreadCrumb from "../../component/BreadCrumb";
import CustomTable from "../../hoc/CustomTable";
import { useDispatch, useSelector } from "react-redux";
import { getAllContactData } from "../../redux/WebsiteLeads/action";
import moment from "moment";
import { dotGenerator, formatPhoneNumber } from "../../utils";
import cross from "../../assets/images/cross.svg";
import CustomModal from "../../hoc/CustomModal";
import PopComponent from "../../hoc/PopContent";
import OpenComment from "../../component/Popup/WebsiteLeads/OpenComment";


const WebsiteLeads = () => {
    let PageSize = 10;
    const dispatch = useDispatch(null)
    const web_leadsData = useSelector(state => state?.leadsReducer?.leadsData)
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [height, setHeight] = useState('75');
    const [sorting, setSorting] = useState({ dataIndex: "", order: "" });
    const [modal, setModal] = useState({ status: false, id: "" })
    const [modalIsOpen, setIsOpen] = useState(false);
    const [modalAllVal, setModalAllVal] = useState();

    useEffect(() => {
        setLoading(true)
        dispatch(getAllContactData()).then(res=>{
            if(res.status === 200){
                setLoading(false)
            }else{
                setLoading(false)
            }
        })
    }, [])

    const handleOpenModal = (id) => {
        setModal({ ...modal, status: true, id: id })
    }

    const handleCloseModal = (id) => {
        setModal({ ...modal, status: false, id: id })
    }

    const columns = [
        {
            title: "",
        },
        {
            title: 'First Name',
            dataIndex: 'first_name',
            type: 'custom',
            render: (data) => {
                return <td className="text_capitalize_Phy">{data?.first_name}</td>
            }
        },
        {
            title: 'Last Name',
            dataIndex: 'last_name',
            type: 'custom',
            render: (data) => {
                return <td className="text_capitalize_Phy">{data?.last_name}</td>
            }
        },
        {
            title: 'Email',
            dataIndex: 'email',
            type: 'custom',
            render: (data) => {
                return <td className="cursor_pointer clinic-name "><a href={`mailto:${data?.email}`}>{data?.email}</a></td>
            }
        },
        {
            title: 'Contact Phone',
            dataIndex: 'phone',
            type: 'custom',
            render: (data) => {
                return <td >{formatPhoneNumber(data?.phone)}</td>
            }
        },
        {
            title: 'Organization',
            dataIndex: 'organization',
        },
        {
            title: 'Comments',
            dataIndex: 'comments',
            type: 'custom',
            render: (data) => {
                return <td className={`cursor_pointer clinic-name web_cmt_td`} >
                    <span className="web_comments" onClick={() => handleOpenModal(data._id)}>{dotGenerator(data?.comments)}</span>
                    {
                        modal?.status && modal.id === data._id &&
                        <>
                            <div className={`web_leads_modal ${modal.status ? 'open' : ''}`}>
                                <div className="web_leads_container">
                                    <button className="cross" onClick={() => handleCloseModal(data._id)}><img src={cross} /></button>
                                    <p className="cmt_modal_txt">{data?.comments}</p>
                                </div>
                            </div>
                        </>
                    }
                    {/*<OpenComment className={`${modalIsOpen}`} modalIsOpen={modalIsOpen} handleOpenModal={handleOpenModal} modalAllVal={modalAllVal} />*/}
                </td>
            }
        }, {
            title: 'Date Added',
            dataIndex: 'createdAt',
            type: 'custom',
            sortable: true,
            render: (data) => {
                return <td>{moment(data?.createdAt).format('MM/DD/YYYY')}</td>
            }
        },
    ];

    const currentTableData = useMemo(() => {
        let computedComments = web_leadsData;
        if (sorting.dataIndex) {
            const reversed = sorting.order === "asc" ? 1 : -1;
            computedComments = computedComments.sort(
                (a, b) =>
                    reversed * a[sorting.dataIndex].localeCompare(b[sorting.dataIndex])
            );
        }
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return computedComments?.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, web_leadsData, sorting]);

    return (
        <div className='content_wrapper main_web_leads'>
            <div className='clinics'>
                <BreadCrumb
                    iswebsiteLeads={true}
                />
                <CustomTable
                    columns={columns}
                    className="physician"
                    loading={loading}
                    clinicList={currentTableData}
                    setCurrentPage={setCurrentPage}
                    tableDataLength={web_leadsData}
                    currentPage={currentPage}
                    pageSize={PageSize}
                    height={height}
                    onSorting={(dataIndex, order) => setSorting({ dataIndex, order })}
                />
            </div>
            {/* <OpenComment className={`leads_comment `} modalIsOpen={modalIsOpen} handleOpenModal={handleOpenModal} modalAllVal={modalAllVal} /> */}

        </div>
    )
}
export default WebsiteLeads