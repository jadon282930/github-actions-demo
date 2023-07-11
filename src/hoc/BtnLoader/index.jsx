import { Spin } from 'antd';
import 'antd/es/spin/style/css';

const BtnLoader = ({ loader_class }) => {
    return (
        <div className={loader_class ? `btn-loader ${loader_class}` : "btn-loader"}>
            <Spin size="small" />
        </div>
    )
};

export default BtnLoader;