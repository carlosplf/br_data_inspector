//Comented to use styled-components in EntityTable.js

import './App.css';

import React from 'react';
import SearchEntity from './SearchEntity';
import TransactionsTable from './TransactionsTable';
import Home from './Home';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
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





  /*
  render (){
    if (this.state.show_results){
      return(
        <div className="App-Results">
          <TransactionsTable key={this.state.search_id} entity_type={this.state.show_results_type} entity_id={this.state.search_id} tableLoaded={this.tableLoaded}/>
        </div>
      );
    }

    if (this.state.first_load){
      this.getNamesList("Subordinado");
      this.setState({first_load: false});
    }

    if (this.state.loading){
      return(
        <p>Loading...</p>
      )
    }

    if(!this.first_load && !this.state.loading && !this.show_results){
      if (this.items.length == 0){
        this.prepareItems("Subordinado");
      }
      return(
        <div className="App-Search">
          <p>Pesquisar por Órgão Recebedor:</p>
          <SearchEntity
            items={this.items}
            handleOnSelect={this.handleSubmitRecebedor}
          />
        </div>
      )
    }
  }
  */


