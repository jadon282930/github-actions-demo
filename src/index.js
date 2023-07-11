import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Router, Switch, Route, Redirect } from "react-router-dom";
import PrivateRouter from "./hoc/PrivateRouter";
import { isAuthenticated } from './utils';
import { Provider } from "react-redux";
import { Helmet } from "react-helmet";
import SignIn from './pages/SignIn';
import store from './redux/store';
import history from "./history";
import './assets/sass/app.scss';
import 'antd/dist/antd.css';
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./component/ErrorFallback";
import Loader from "./component/Loader";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router history={history}>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Suspense fallback={<Loader className={'content-loader'}/>}>
            <Switch>
              <App history={history}>
                <Switch>
                  <Route
                    exact
                    path={"/admin"}
                    render={() => {
                      return <Redirect to={"/"} />;
                    }}
                  />
                  <Route
                    exact path="/"
                    render={props =>
                      !isAuthenticated() ? <>
                        <Helmet>
                          <title>{"Haploscope Admin"}</title>
                        </Helmet>
                        <SignIn {...props} />
                      </> :
                            <Redirect to={{ pathname: '/clinics', user: isAuthenticated, state: { from: props.location } }} />
                    }
                  />
                </Switch>
            <Switch>
              <PrivateRouter />
            </Switch>
          </App>
        </Switch>
              </Suspense>
          </ErrorBoundary>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
