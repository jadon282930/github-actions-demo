import React from 'react'

const Validation = ({errors,message}) => {
    return (
        errors ?
            <div className="invalid-feedback pl-4 d-block errorMsg">{message}</div>
            : ''
    )
}
export default Validation