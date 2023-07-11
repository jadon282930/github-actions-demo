import React, { useRef, useState, useEffect } from 'react';
import logo from './../../assets/images/new_hp_logo.svg';
import profile_pic from './../../assets/images/profile_pic.png';
import down_arrow from './../../assets/images/Down_arrow.svg';
import { useSelector } from 'react-redux';

import { useRouteMatch, Link } from "react-router-dom";

const Header = ({ isAuthenticated, handleLogout, isMenuOpen, setIsMenuOpen, active }) => {
    let match = useRouteMatch("/settings");
    let password = useRouteMatch("/change-password");
    const currentUser = useSelector(state => state.loginReducer)
    const ref = useRef()

    useEffect(() => {
        const checkIfClickedOutside = e => {
            if (isMenuOpen && ref.current && !ref.current.contains(e.target) && e.target.id !== 'profileIcon') { setIsMenuOpen(false) }
        }
        document.addEventListener("mousedown", checkIfClickedOutside)
        return () => { document.removeEventListener("mousedown", checkIfClickedOutside) }
    }, [isMenuOpen])
    const settingScreenData = () => {
        setIsMenuOpen(false)
    }
    return (
        <>
            <header>
                {
                    isAuthenticated &&
                    <div className="container_fluid">
                        <div className="row main_herader_row">
                            <div className="header px_auto">
                                <div className="logo"><img src={logo} alt="logo_img" /></div>
                                <div className="header_profile">
                                    <div className="profile">
                                        <span className="profile_name">{currentUser.first_name + " " + currentUser.last_name}</span>
                                        <span className="profile_pic" ><img id="profileIcon" onClick={() => setIsMenuOpen(!isMenuOpen)} src={profile_pic} alt="profile_pic" /></span>
                                    </div>
                                    <div className="drop_down">
                                        <div className="cursor_pointer" ><img id="profileIcon" onClick={() => setIsMenuOpen(!isMenuOpen)} src={down_arrow} alt="down_arrow" /></div>
                                        {console.log(match)}
                                        {
                                            isMenuOpen &&
                                            <ul className="list_unstyled drop_down_list" ref={ref}>
                                            <li><Link to="/change-password" className={password?.url === '/change-password' && "active"} onClick={() => settingScreenData()}> Change Password <span className="dot_blue d_none" /></Link></li>
                                                <li><Link to="/settings" className={match?.url === '/settings' && "active"} onClick={() => settingScreenData()}>Settings <span className="dot_blue d_none" /></Link></li>
                                                <li><a href="#" >Contact Support <span className="dot_blue d_none" /></a></li>
                                                <li><a href="#" className={active === 'logout' && " "} onClick={() => handleLogout()}>Log Out<span className="dot_blue d_none" /></a></li>
                                            </ul>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </header>
        </>
    )
};

export default Header