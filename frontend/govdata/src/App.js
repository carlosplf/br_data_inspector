//Comented to use styled-components in EntityTable.js

import './App.css';

import React from 'react';
import TransactionsTable from './TransactionsTable';
import Home from './Home';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

class App extends React.Component {
  constructor(props) { 
    super(props);
    this.state = {
      'search_id': ''
    };
  }

  render(){
    return(
      <Router>
        <Switch>
          <Route path="/home">
            <Home />
          </Route>
          <Route path="/table">
            <TransactionsTable key={this.state.search_id} entity_type="Subordinado" entity_id={this.state.search_id}/>
          </Route>  
        </Switch>
      </Router>
    );
  }
}

export default App;