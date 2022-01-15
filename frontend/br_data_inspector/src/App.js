import React from 'react';
import DataPage from './DataPage/DataPage';
import Home from './Home/Home';
import DataCompare from './DataComparePage/DataCompare';
import RankPage from './RankPage/RankPage';
import About from './About/About';
import CustomLinkRouter from './CustomLink/CustomLinkRouter';
import ContractsPage from './ContractsPage/ContractsPage';
import CompanyPage from './CompanyPage/CompanyPage';

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
            <RankPage/>          
          </Route>
          <Route path="/contracts">
            <ContractsPage/>          
          </Route>
          <Route path="/company">
            <CompanyPage/>          
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
