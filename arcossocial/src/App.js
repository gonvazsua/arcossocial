import React, { useState  } from 'react';
import Login from './components/Login/Login';
import Main from './components/Main/Main';
import './App.css';
import 'materialize-css/dist/css/materialize.min.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import GlobalState from './GlobalState'; 
import AuthRoute from './components/AuthRoute/AuthRoute';

const App = (props) => {

  const [state, setState] = useState({});  

  const handleToken = (token) => {
    setState({token: token});
  };

  return (
    <GlobalState.Provider value={[state, setState]}>
      <Router>
        <Switch>
          <AuthRoute path="/main">
            <Main />
          </AuthRoute>
          <AuthRoute path="/login">
            <Login handleFunction={handleToken}/>
          </AuthRoute>
          <Route path="/">
            <Login handleFunction={handleToken}/>
          </Route>
        </Switch>
      </Router>
    </GlobalState.Provider>
  );
};

App.propTypes = {};

App.defaultProps = {};

export default App;
