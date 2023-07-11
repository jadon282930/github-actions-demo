import BtnLoader from "../../hoc/BtnLoader";

const DeletePop = ({deleteAuthorizedList,loading})=>{

    return (
        <div className="delete-pop">
            <div className="title">
                Delete Authorized Users
            </div>
            <div className="desc">
                Do you really want to delete Authorized Users ? This process cannot be undone.
            </div>
            <div className="action">
                <button className="btn btn_default  mt_4"   > Cancel</button>
                {
                    loading?
                        <button  className="btn btn_primary ml_2 mt_4" > <BtnLoader/></button>
                        :
                        <button  className="btn btn_primary ml_2 mt_4"  onClick={()=>deleteAuthorizedList()}> Submit</button>
                }

            </div>
        </div>
    )
}

export default DeletePop