import SearchIcon from "../../assets/images/Search_icon.png";
import React from "react";
import { filterSearch } from "../../redux/physician/action";
import { useDispatch } from "react-redux";

const SearchTransferPhy = ({ id }) => {
    const dispatch = useDispatch()
    const searchPatientsHandler = (e) => {
        let Payload = {
            physician_id: id,
            search: e.target.value,
        }
        dispatch(filterSearch(Payload))
    }

    return (
        <div className="form_group search">
            <input type="text" placeholder="Search" className="form_control search_input" name="search"
                onChange={(e) => searchPatientsHandler(e)} />
            <span className="serch_icon">
                <img src={SearchIcon} alt="Search_Icon" />
            </span>
        </div>
    )
}
export default SearchTransferPhy