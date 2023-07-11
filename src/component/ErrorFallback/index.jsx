import React, { useEffect } from "react";
import Loader from "../Loader";
import Cookies from 'js-cookie';


const ErrorFallback = ({ error }) => {

    useEffect(() => {
        if (localStorage.getItem('counter') === "1") {
            localStorage.removeItem('counter');
            localStorage.clear()
            Cookies.remove('x-access-token')
            window.location.reload(true)
            return false
        }else{  
            localStorage.setItem('counter', "1");
        }
     
        const chunkFailedMessage = /Loading chunk [\d]+ failed/;
        if (error?.message && chunkFailedMessage.test(error.message)) {
            window.location.reload()
        }
    }, [error]);
    return (<Loader className={'content-loader'}/>)
};


export default ErrorFallback