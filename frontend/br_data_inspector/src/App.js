import React from 'react';
import DataPage from './DataPage';
import Home from './Home';
import DataCompare from './DataCompare';
import Rank from './Rank'
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
          <Route path="/details">
            <DataPage key={this.state.search_id} entity_type="Subordinado" entity_id={this.state.search_id}/>
          </Route> 
          <Route path="/compare">
            <DataCompare entity_type="Subordinado"/>
          </Route>
          <Route path="/rank">
            <Rank/>          
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;