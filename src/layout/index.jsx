import Header from './Header';
import React, {Suspense, useEffect, useState} from 'react';
import {Decryption, isAuthenticated} from "../utils";
import Cookies from 'js-cookie';
import Sidebar from "./Sidebar";
import { updateUserDetails } from '../redux/auth/action';
import { useDispatch } from 'react-redux';

const Layout = ({ children, history }) => {
    const dispatch = useDispatch();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [active,setActive] = useState(true)
    useEffect(() => {
        if(localStorage.getItem('userDetail') && isAuthenticated){
            dispatch(updateUserDetails(Decryption(localStorage.getItem('userDetail'))))
        }
    }, [isAuthenticated(),localStorage.getItem('userDetail')])

    const handleLogout = () => {
        Cookies.remove('x-access-token',{path:"/",domain:process.env.REACT_APP_DOMAIN});
        Cookies.remove('x-access-token',{path:"/"});
        localStorage.removeItem('_Haploscope_ad_token')
        history.push('/');
        setActive('logout')
        setIsMenuOpen(false)
    };

    return (
        <div className={`${history.location.pathname.includes('invoice') ? 'layout invoice' : 'layout'}`}>
            {
                 history.location.pathname.includes('invoice') ?
                        ""
                     :
                        <Header
                            isAuthenticated={isAuthenticated()}
                            handleLogout={handleLogout}
                            setIsMenuOpen={setIsMenuOpen}
                            isMenuOpen={isMenuOpen}
                            active={active}
                        />
            }
                    <section className={isAuthenticated()? "page_wrapper":" inner_wrapper"}>
                        { history.location.pathname.includes('invoice') ?
                        " "
                        :
                        isAuthenticated()&&<Sidebar
                            history={history}
                        />
                        }
                        <Suspense fallback={""}>
                            {children}
                        </Suspense>
                    </section>

        </div>
    )
}

export default Layout;