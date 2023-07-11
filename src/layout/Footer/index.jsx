import React from "react";
import moment from "moment";

const Footer = () => {
    return (
        <footer>
            <div className="fullWidth">
                <div className="copyright">Copyright © {`${moment().format('YYYY')}`} Haploscope - All Rights Reserved</div>
            </div>  
        </footer>
    )
}

export default Footer