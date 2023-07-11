import FilledButton from "../../FilledButton";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

const ChangeMinutes = ({ cancelMinuteData, changeMinuteData }) => {
    const [loading] = useState(false)
    const { handleSubmit } = useForm({ mode: "all" });

    return (
        <div className='main_delete_modal'>
            <h4>Change Minutes Plan</h4>
            <div className='delete_content delete-modal_content'>
                <p>You are about to change the monthly meeting minutes available to every physician. This change will be effective from the beginning of the next billing cycle.</p>
            </div>
            <span className='proceed'>Do you want to proceed?</span>
            <form onSubmit={handleSubmit(changeMinuteData)} className="form_group d_flex justify_content_center form_action delete_modal_btn">
                <button className="btn btn_default" type={'button'} onClick={() => cancelMinuteData()}>No</button>
                <FilledButton type="submit" loading={loading} value={'Yes'} className="btn btn_primary" loader_class={'btn_loader_red'} />
            </form>
        </div>
    )
}
export default ChangeMinutes