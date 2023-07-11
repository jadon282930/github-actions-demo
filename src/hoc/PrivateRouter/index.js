import { Route, Redirect } from 'react-router-dom';
import { Helmet } from "react-helmet";
import { adminRoutes } from '../../routes';
import { isAuthenticated } from "../../utils";
import {useEffect} from "react";

const PrivateRouter = () => {
useEffect(()=>{
    localStorage.getItem('_Haploscope_ad_token')
},[isAuthenticated()])
    return (
        adminRoutes.map(({ path, Component, title }, key) => (
            <Route exact path={path} render={(props) =>
            (localStorage.getItem('_Haploscope_ad_token') ?  localStorage.getItem('_Haploscope_ad_token'):"") && isAuthenticated() ? <>
                    {title &&
                        <Helmet>
                            {/*<title>{title}</title>*/}
                            <title>{'Haploscope Admin'}</title>
                        </Helmet>
                    }
                    <Component {...props} />
                </> : (<Redirect to={{ pathname: '/', user: isAuthenticated, state: { from: props.location } }} />)
            } key={key} />
        ))
    )
};

export default PrivateRouter
