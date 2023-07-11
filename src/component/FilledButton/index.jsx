import BtnLoader from "../../hoc/BtnLoader";

const FilledButton = ({ type="button", className="btn btn_gray", value="Clear", loading,loader_class, ...rest }) => {
    return (
        <button disabled={loading} {...rest} type={type} className={className}>{loading ? <BtnLoader loader_class={loader_class} /> : value}</button>
    )
};

export  default FilledButton