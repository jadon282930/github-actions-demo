import Layout from "./layout";
import { useRouteMatch  } from "react-router-dom"


function App({ children, history }) {

  return (
    <Layout history={history} >
      {children}
    </Layout>
  );
}

export default App;
