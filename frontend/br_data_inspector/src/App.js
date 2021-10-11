import React from 'react';
import DataPage from './DataPage';
import Home from './Home';
import DataCompare from './DataCompare';
import Rank from './Rank';
import About from './About';
import CustomLinkRouter from './CustomLinkRouter';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

require('dotenv').config({ path: require('find-config')('.env') })

class App extends React.Component {
  constructor(props) { 
    super(props);
    this.state = {
      'search_id': ''
    };
  }

  render(){
    console.log("URL: ", process.env.REACT_APP_API_URL);
    console.log("PORT: ", process.env.REACT_APP_API_PORT);
    return(
      <Router>
        <Switch>
          <Route path="/home">
            <Home />
          </Route>
          <Route path="/details">
            <DataPage key={this.state.search_id} entity_type="Subordinado" entity_id={this.state.search_id}/>
          </Route> 
          <Route path="/compare">
            <DataCompare entity_type="Subordinado"/>
          </Route>
          <Route path="/rank">
            <Rank/>          
          </Route>
          <Route path="/about">
            <About/>          
          </Route>
          <Route path="/custom_link">
            <CustomLinkRouter/>
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
