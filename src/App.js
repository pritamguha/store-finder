import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition
} from "react-toasts";
import HomePage from "./Pages/home";
import AppWrapper from "./Components/AppWrapper";
import OrdersPage from "./Pages/orders";
import StoresPage from "./Pages/stores";

const App = props => {
  console.log = () => {};
  return (
    <Router>
      <ToastsContainer
        store={ToastsStore}
        position={ToastsContainerPosition.BOTTOM_RIGHT}
      />

      <Route
        render={({ location, history }) => (
          <React.Fragment>
            <AppWrapper {...props} {...location} {...history} />
          </React.Fragment>
        )}
      />
      <main
        style={{
          paddingLeft: 90,
          paddingTop: 20,
          paddingBottom: 20,
          paddingRight: 20
        }}
      >
        <Switch>
          <Route exact path="/home" component={props => <HomePage />} />
          <Route exact path="/orders" component={props => <OrdersPage />} />
          <Route exact path="/stores" component={props => <StoresPage />} />
          <Route exact path="*" component={HomePage} />
        </Switch>
      </main>
    </Router>
  );
};

export default App;
