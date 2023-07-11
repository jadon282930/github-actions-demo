import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getSettingsData, updateAppVersion, updateMaintenanceMode} from "../../redux/Settings/action";
import {getPhysicianDetails} from "../../redux/physician/action";
import PopComponent from "../../hoc/PopContent";
import CustomModal from "../../hoc/CustomModal";
import Loader from "../../component/Loader";
import Validation from "../../component/formValidation";
import {useForm} from "react-hook-form";

const Settings = () => {
    const dispatch =useDispatch();
    const [loading, setLoading] = useState(false);
    const { register, watch, errors, formState, handleSubmit, setValue, reset } = useForm({ mode: "all" });
   const {AndroidHaploscopeMD, AndroidHaploscope, maintenanceModeData, IOSHaploscope, IOSHaploscopeMD } =  useSelector(state => state.settingReducer?.setting_list)
    const [openModal, setModalOpen] = useState(false);
    const [modalAllVal, setModalAllVal] = useState({});
    const [modalName, setModalName] = useState('');
    let ModalData = PopComponent[modalName]
    const [checked, setChecked] = useState({
        androidMD: false,
        androidHealth:false,
        iosMD: false,
        iosHealth:false,
        maintenanceMode: false
    });
    const [version, setVersion ] = useState({
        androidMD:'',
        androidHealth:'',
        iosMD:'',
        iosHealth:'',
    });


    useEffect(()=>{
        setLoading(true)
        dispatch(getSettingsData()).then(res=>{
            if(res.status === 200){
                setLoading(false)
            }else{
                setLoading(false)
            }
        })
    },[dispatch])

    useEffect(()=>{
        if(AndroidHaploscopeMD){
            setChecked({
                ...checked,
                androidMD :  AndroidHaploscopeMD?.isForceUpdate,
                androidHealth : AndroidHaploscope?.isForceUpdate,
                maintenanceMode :maintenanceModeData?.isMaintenanceMode,
                iosHealth:IOSHaploscope?.isForceUpdate,
                iosMD: IOSHaploscopeMD?.isForceUpdate
            })
            setVersion({
                ...version,
                androidMD: AndroidHaploscopeMD?.version,
                androidHealth:AndroidHaploscope?.version,
                iosMD: IOSHaploscopeMD?.version,
                iosHealth:IOSHaploscope?.version,
            })
        }
    },[AndroidHaploscopeMD])

    const settingHandler = (type) => {
        switch (type) {
            case 'Maintenance':{
                dispatch(updateMaintenanceMode({id:maintenanceModeData?._id,status:checked?.maintenanceMode})).then(res=>{
                    if(res.status === 200){
                        handleOpenModal('CommonPop', { header: 'Success', body: '', auth: true })
                    }else{
                        handleOpenModal('CommonPop', { header: 'Info', body: res.data.message, auth: true })
                    }
                })
            }
            break;
        }
    }

    const handleOpenModal = (type, data) => {
        switch (type) {
            case "CommonPop": {
                setModalAllVal(data)
                setModalName(type);
                setModalOpen(true)
                break;
            }
            default: {
                setModalOpen(false)
            }
        }
    }
const settingHandlerAndroidHaploscope = (state)=>{
    let payload ={
        id: AndroidHaploscope?._id,
        appName: AndroidHaploscope?.appName,
        appType: AndroidHaploscope?.appType,
        version: version.androidHealth,
        status: checked?.androidHealth
    }
    if(version.androidHealth !== ""){
        dispatch(updateAppVersion(payload)).then(res=>{
            if(res.status === 200){
                handleOpenModal('CommonPop', { header: 'Success', body: '', auth: true })
            }else{
                handleOpenModal('CommonPop', { header: 'Info', body: res.data.message, auth: true })
            }
        })
    }
}
const settingAndroidHaploscopeMD = ()=>{
    let payload ={
        id: AndroidHaploscopeMD?._id,
        appName: AndroidHaploscopeMD?.appName,
        appType: AndroidHaploscopeMD?.appType,
        version: version.androidMD,
        status: checked?.androidMD
    }
    dispatch(updateAppVersion(payload)).then(res=>{
        if(res.status === 200){
            handleOpenModal('CommonPop', { header: 'Success', body: '', auth: true })
        }else{
            handleOpenModal('CommonPop', { header: 'Info', body: res.data.message, auth: true })
        }
    })
}
    const settingIOSHaploscopeMD = ()=>{
        let payload ={
            id: IOSHaploscopeMD?._id,
            appName: IOSHaploscopeMD?.appName,
            appType: IOSHaploscopeMD?.appType,
            version: version.iosMD,
            status: checked?.iosMD
        }
        dispatch(updateAppVersion(payload)).then(res=>{
            if(res.status === 200){
                handleOpenModal('CommonPop', { header: 'Success', body: '', auth: true })
            }else{
                handleOpenModal('CommonPop', { header: 'Info', body: res.data.message, auth: true })
            }
        })
    }
    const settingIOSHaploscope = ()=>{
        let payload ={
            id: IOSHaploscope?._id,
            appName: IOSHaploscope?.appName,
            appType: IOSHaploscope?.appType,
            version: version.iosHealth,
            status: checked?.iosHealth
        }
        dispatch(updateAppVersion(payload)).then(res=>{
            if(res.status === 200){
                handleOpenModal('CommonPop', { header: 'Success', body: '', auth: true })
            }else{
                handleOpenModal('CommonPop', { header: 'Info', body: res.data.message, auth: true })
            }
        })
    }
console.log(errors)
    return (
        <div className="main_setting_block">
            {/* header */}
            <div className="setting_header">
                <h2>Settings</h2>
            </div>
            {
                loading ?
                    <Loader/>
                    :
                    <div className="setting_fields_block">
                        {/* maintenance mode */}
                        <div className="maintenance_mode_block">
                            <h4>Maintenance Mode</h4>
                            <div className="switch_btn_block">
                                {/* switch */}
                                <div className="switch_box">
                                    <p className={`${!checked.maintenanceMode ? 'off checked' : 'off'}`}>Off</p>
                                    <div className="switch">
                                        <input type="checkbox" checked={checked.maintenanceMode} onChange={() => setChecked({...checked, maintenanceMode : !checked.maintenanceMode})} />
                                        <span className="slider"/>
                                    </div>
                                    <p className={`${checked.maintenanceMode ? 'on checked' : 'on'}`}>On</p>
                                </div>
                                {/* save button */}
                                <button className="save_btn" onClick={()=>settingHandler('Maintenance')}>save</button>
                            </div>
                        </div>

                        {/* Android Build */}
                        <div className="android_build">
                            <h4>Android Build</h4>
                            <div className="haploscope_admin">
                                {/* input fields*/}
                                <h5 className="heading_">Haploscope</h5>
                                <form className="android_build_fields">
                                    {/* version input */}
                                    <div className="input_field">
                                        <input type='text' placeholder="Version" name='version' defaultValue={version.androidHealth} onChange={(e)=>setVersion({
                                            ...version,
                                            androidHealth: e.target.value
                                        })} ref={register({
                                            required: "Haploscope Version is Required",
                                            pattern: {
                                                value: /^[0-9]*\.?[0-9]*\.?[0-9]*\.?[0-9]*\.?[0-9]*\.?[0-9]*$/,
                                                message:
                                                    "Should allow only Numeric and dot Value"

                                            }
                                        })} />
                                        <Validation errors={errors.version} message={errors?.version?.message} watch={watch("version")} />
                                    </div>
                                    {/* switch */}
                                    <div className="main_switch_block">
                                        <h5>Force Update :</h5>
                                        <div className="switch_box">
                                            <p className={`${!checked.androidHealth ? 'off checked' : 'off'}`}>Off</p>
                                            <div className="switch">
                                                <input type="checkbox" checked={checked.androidHealth} onChange={() => setChecked({...checked, androidHealth : !checked.androidHealth})} />
                                                <span className="slider"/>
                                            </div>
                                            <p className={`${checked.androidHealth ? 'on checked' : 'on'}`}>On</p>
                                        </div>
                                    </div>
                                    {/* save button */}
                                    <button className="save_btn"  onClick={handleSubmit(settingHandlerAndroidHaploscope)}>save</button>
                                </form>
                            </div>

                            <div className="haploscope_md">
                                {/* input fields*/}
                                <h5 className="heading_">Haploscope Md</h5>
                                <div className="android_build_fields">
                                    {/* version input */}
                                    <div className="input_field">
                                        <input type='text' placeholder="Version" name={'md'} defaultValue={version.androidMD} onChange={(e)=>setVersion({
                                            ...version,
                                            androidMD: e.target.value
                                        })} ref={register({
                                            required: "Haploscope MD Version is Required",
                                            pattern: {
                                                value: /^[0-9]*\.?[0-9]*\.?[0-9]*\.?[0-9]*\.?[0-9]*\.?[0-9]*$/,
                                                message:
                                                    "Should allow only Numeric and dot Value"

                                            }
                                        })} />
                                        <Validation errors={errors.md} message={errors?.md?.message} watch={watch("md")} />
                                    </div>
                                    {/* switch */}
                                    <div className="main_switch_block">
                                        <h5>Force Update :</h5>
                                        <div className="switch_box">
                                            <p className={`${!checked.androidMD ? 'off checked' : 'off'}`}>Off</p>
                                            <div className="switch">
                                                <input type="checkbox" checked={checked.androidMD} onChange={() => setChecked({...checked, androidMD : !checked.androidMD})} />
                                                <span className="slider"/>
                                            </div>
                                            <p className={`${checked.androidMD ? 'on checked' : 'on'}`}>On</p>
                                        </div>
                                    </div>
                                    {/* save button */}
                                    <button className="save_btn" onClick={handleSubmit(settingAndroidHaploscopeMD)}>save</button>
                                </div>
                            </div>
                        </div>

                        {/* ios Build */}
                        <div className="ios_build android_build">
                            <h4>iOS Build</h4>

                            <div className="haploscope_admin">
                                {/* input fields*/}
                                <h5 className="heading_">Haploscope</h5>
                                <div className="android_build_fields">
                                    {/* version input */}
                                    <div className="input_field">
                                        <input type='text' placeholder="Version" defaultValue={version?.iosHealth} name={'iosVersion'}  onChange={(e) => setVersion({...version, iosHealth : e.target.value})} ref={register({
                                            required: "Haploscope  Version is Required",
                                            pattern: {
                                                value: /^[0-9]*\.?[0-9]*\.?[0-9]*\.?[0-9]*\.?[0-9]*\.?[0-9]*$/,
                                                message:
                                                    "Should allow only Numeric and dot Value"

                                            }
                                        })} />
                                        <Validation errors={errors.iosVersion} message={errors?.iosVersion?.message} watch={watch("iosVersion")} />
                                    </div>
                                    {/* switch */}
                                    <div className="main_switch_block">
                                        <h5>Force Update :</h5>
                                        <div className="switch_box">
                                            <p className={`${!checked.iosHealth ? 'off checked' : 'off'}`}>Off</p>
                                            <div className="switch">
                                                <input type="checkbox" checked={checked.iosHealth} onChange={() => setChecked({...checked,iosHealth:!checked.iosHealth})} />
                                                <span className="slider"></span>
                                            </div>
                                            <p className={`${checked.iosHealth ? 'on checked' : 'on'}`}>On</p>
                                        </div>
                                    </div>
                                    {/* save button */}
                                    <button className="save_btn" onClick={handleSubmit(settingIOSHaploscope)}>save</button>
                                </div>
                            </div>
                            <div className="haploscope_md">
                                {/* input fields*/}
                                <h5 className="heading_">Haploscope Md</h5>
                                <div className="android_build_fields">
                                    {/* version input */}
                                    <div className="input_field">
                                        <input type='text' placeholder="Version" defaultValue={version?.iosMD}  name={'iosVersionMd'} onChange={(e) => setVersion({...version, iosMD : e.target.value})}ref={register({
                                            required: "Haploscope MD  Version is Required",
                                            pattern: {
                                                value: /^[0-9]*\.?[0-9]*\.?[0-9]*\.?[0-9]*\.?[0-9]*\.?[0-9]*$/,
                                                message:
                                                    "Should allow only Numeric and dot Value"

                                            }
                                        })} />
                                        <Validation errors={errors.iosVersionMd} message={errors?.iosVersionMd?.message} watch={watch("iosVersionMd")} />
                                    </div>
                                    {/* switch */}
                                    <div className="main_switch_block">
                                        <h5>Force Update :</h5>
                                        <div className="switch_box">
                                            <p className={`${!checked.iosMD ? 'off checked' : 'off'}`}>Off</p>
                                            <div className="switch">
                                                <input type="checkbox" checked={checked.iosMD} onChange={() => setChecked({
                                                    ...checked,
                                                    iosMD: !checked.iosMD
                                                })} />
                                                <span className="slider"></span>
                                            </div>
                                            <p className={`${checked.iosMD ? 'on checked' : 'on'}`}>On</p>
                                        </div>
                                    </div>
                                    {/* save button */}
                                    <button className="save_btn" onClick={handleSubmit(settingIOSHaploscopeMD)}>save</button>
                                </div>
                            </div>
                        </div>
                    </div>
            }

            <CustomModal className={modalName === 'CommonPop' ? "modal errorPop setting-popup" : (modalName === 'DeletePop' || modalName === 'ClinicStatusUpdatePop') ? "modal deletePop " : modalName === 'AuthorizedPop' ? 'modal authorizedPop addPhy' : 'modal addPhy'} modalName={modalName} modalIsOpen={openModal} handleOpenModal={handleOpenModal}>
                <ModalData handleOpenModal={handleOpenModal} openModal={openModal} modalAllVal={modalAllVal} />
            </CustomModal>
        </div>
    )
}
export default Settings