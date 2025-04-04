import React from "react";
import Home from "../src/Pages/Home";
import Login from "../src/Pages/Login";
import AddMember from "../src/Pages/AddMember";
import MoveMember from "../src/Pages/MoveMember";
import "./App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/addMember" component={AddMember} />
        <Route exact path="/moveMember" component={MoveMember} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
