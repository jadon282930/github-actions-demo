import React from "react";
import { Modal } from "antd";


const OpenComment = ({ className, modalIsOpen, handleOpenModal, modalAllVal }) => {
    return (
        <div className={`web_leads_modal ${className}`} onCancel={() => handleOpenModal()} visible={modalIsOpen}>
            <div className="web_leads_container"></div>
        </div>

        // {/* <Modal maskClosable={false} mask={true} className={className} footer={null}   visible={modalIsOpen}
        //        onCancel={() => handleOpenModal()} >
        //     <div className="modal_dialog">
        //         <div className='main_delete_modal'>
        //             <h4>Comments</h4>
        //             <div className='delete_content'>
        //                 <p>{modalAllVal}</p>
        //             </div>
        //         </div>
        //     </div>
        // </Modal> */}
    )
}
export default OpenComment