import { links } from "../../siteData/header";
import React from "react";
const Sidebar = ({history}) => {

    return (
        <div className="sidebar">
            {
                links.map((link,i) => {
                        if(history.location.pathname.includes('clinic') && link.route === "/clinics"){
                            return <ul className="list_unstyled" key={i}>
                                <li onClick={() => history.push(link.route)} className={ "active"} ><span>{link.name}</span></li>
                            </ul>
                        }else{
                            return <ul className="list_unstyled" key={i}>
                                <li onClick={() => history.push(link.route)} className={(link.route === history.location.pathname) ? "active" : ""} ><span>{link.name}</span></li>
                            </ul>
                        }
                })
            }

        </div>
    )
};

export default Sidebar