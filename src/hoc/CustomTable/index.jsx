import React, { useEffect, useRef, useState } from "react";
import Loader from "../../component/Loader";
import Pagination from '../../hoc/CustomTable/Pagination'
import filter from "../../assets/images/filter.svg";
import up_arrow_web from "../../assets/images/up_arrow_web.svg";
import filterColor from "../../assets/images/filterColor.svg";
import { useDispatch } from "react-redux";
import useOutsideClick from "../../component/useOutsideClick";

//up_arrow_web

const CustomTable = ({ columns, clinicList, className, loading, currentPage, pageSize, setCurrentPage, tableDataLength, onCheckboxChange, statusCbx ,onSorting}) => {
    const [filterData, setFilterData] = useState(false)
    const [sortingField, setSortingField] = useState("");
    const [sortingOrder, setSortingOrder] = useState("desc");
    const ref = useRef()

    useOutsideClick(ref, () => {
        if (filterData) setFilterData(false);
    });
    const onSortingChange = (field) => {
        const order =
            field === sortingField && sortingOrder === "asc" ? "desc" : "asc";
        setSortingField(field);
        setSortingOrder(order);
        onSorting(field, order);
    };

    return (
        <div className="table_wrapper">
            <div className="table_responsive">
                <table className={`table clinic_data_list ${className ? className : ''}`}>
                    <thead>
                        <tr>
                            {columns.map((col, index) => (
                                <>
                                    <td key={index}>
                                        {col.title}
                                        {col.filter && <span className={`filter_dropdown ${col.title === 'Status' ? 'Status' : ''} 
                                         ${(col.title === 'Status' && clinicList.length) ? 'filter icon_filter' : ''}`}>
                                            <img src={!filterData ? filter : filterColor} alt="Filter" onClick={() => setFilterData(!filterData)} /></span>}
                                        {
                                            filterData && col.title === 'Status' &&
                                            <div className="drop_down filter-drop-status" ref={ref}>
                                                <div className="list_unstyled drop_down_list    " >
                                                    <h4>Select</h4>
                                                    <div className='form_group checkbox status_checkbox'>
                                                        <input name="active" type="checkbox" checked={statusCbx.active} onChange={(e) => onCheckboxChange(e)} />
                                                        <span className="checkbox_clone" />
                                                        <label htmlFor="cohort_checkbox">Active</label>
                                                    </div>
                                                    <div className='form_group checkbox status_checkbox'>
                                                        <input name="pending" type="checkbox" checked={statusCbx.pending} onChange={(e) => onCheckboxChange(e)} />
                                                        <span className="checkbox_clone" />
                                                        <label htmlFor="cohort_checkbox">Pending</label>
                                                    </div>

                                                </div>

                                            </div>
                                        }
                                        {
                                            col.title === 'Date Added' &&
                                                <span className={'date-added-leads-website'}>
                                                    <img src={up_arrow_web} alt={"up_arrow"} className={sortingOrder === 'asc'? 'order_asc' : ""} onClick={()=>col?.sortable ? onSortingChange(col.dataIndex) : null }/>
                                                </span>
                                        }
                                    </td>

                                </>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            clinicList?.length ?
                                clinicList.map((_data, i) => (
                                    <tr key={_data._id}>
                                        {
                                            columns.map(col => {
                                                switch (col.type) {
                                                    case "custom": {
                                                        return col.render(_data)
                                                    }
                                                    case "action": {
                                                        return col.ActionContent(_data)
                                                    }
                                                    case "minute": {
                                                        return col.minute(_data)
                                                    }
                                                    default: {
                                                        return (
                                                            <td>{_data[col.dataIndex]}</td>
                                                        )
                                                    }
                                                }
                                            })
                                        }
                                    </tr>
                                ))
                                :
                                (loading || clinicList?.length) ? <Loader className={'content-loader'} /> : <tr><td colSpan={columns?.length} ><div className="mt_5 pb_5 pt_5 fullWidth text_center" >No Data Found</div></td></tr>
                        }
                    </tbody>
                </table>
            </div>
            <Pagination
                className="pagination-bar"
                currentPage={currentPage}
                totalCount={tableDataLength?.length}
                pageSize={pageSize}
                onPageChange={page => setCurrentPage(page)}
            />
        </div>
    )
}
export default CustomTable