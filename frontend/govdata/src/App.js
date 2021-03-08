//Comented to use styled-components in EntityTable.js
//import './App.css';

import React from 'react';
import EntityTable from './EntityTable';
import TransactionsTable from './TransactionsTable';
import Search from './Search';

class App extends React.Component {
  constructor(props) { 
    super(props);
    this.state = {
      'value': '',
      'search_id': '',
      'should_update_table': false,
    };

  }

  handleSubmit = (event, value) => {
    console.log(value);
    this.setState({
      search_id: value,
      should_update_table: true
    });
    event.preventDefault();

  }

  render (){
    if(this.state.should_update_table){
      return (
        <div className="App">
          <Search value={this.state.value} handleSubmit={this.handleSubmit}/>
          <EntityTable entity_type="Superior"/>
          <TransactionsTable key={this.state.search_id} entity_type="Subordinado" entity_id={this.state.search_id} tableLoaded={this.tableLoaded}/>
        </div>
      );
    }
    else{
      return (
        <div className="App">
          <Search value={this.state.value} handleChange={this.handleChange} handleSubmit={this.handleSubmit}/>
          <EntityTable entity_type="Superior"/>
        </div>
      );
    }
  }
}

export default App;
