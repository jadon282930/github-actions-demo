import history from "../../history";
import React from "react";

const CommonPop =({modalAllVal,handleOpenModal})=>{
    const {header,body,path,auth}= modalAllVal;
    return(
        <div className="delete-pop">
            <div className="title text_capitalize">
                {header}
            </div>
            <div className="desc">
                {body}
            </div>
            <div>
                {
                    auth ?
                        <button className="btn btn_primary  mt_2" onClick={()=>handleOpenModal()} > Ok</button>
                        :
                        <button className="btn btn_primary  mt_2" onClick={()=>history.push(path)} > Ok</button>
                }
            </div>
        </div>
    )
}
export default CommonPop