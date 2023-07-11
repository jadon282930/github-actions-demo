import { Spin } from 'antd';
import 'antd/es/spin/style/css';
import React from "react";

const Loader = ({ className }) => {
    return (
        <div className={`loader ${className ? className : ''}`}>
            <Spin size="large" />
        </div>
    )
};

export default Loader;