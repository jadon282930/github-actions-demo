import React from 'react';
import { Modal } from 'antd';

const CustomModal = ({ children, modalIsOpen, handleOpenModal, className, modalName }) => {
    return (
        <>
            <Modal maskClosable={false} className={className} footer={null} centered={(modalName === 'DeleteAlert' || modalName === "CommonPop") ? 'centered' : ""} visible={modalIsOpen}
                   onCancel={() => handleOpenModal()} >
                <div className="modal_dialog">
                    {children}
                </div>
            </Modal>
        </>
    )
}

export default CustomModal
