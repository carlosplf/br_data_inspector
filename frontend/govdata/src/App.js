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
      'show_results': false,
      'show_results_type': 'Subordinado'
    };

  }

  handleSubmitPagador = (event, value) => {
    console.log("Pesquisa PAGADOR");
    console.log("Searched: " + value);
    this.setState({
      search_id: value,
      should_update_table: true,
      show_results: true,
      show_results_type: 'Superior'
    });
    event.preventDefault();
  }

  handleSubmitRecebedor = (event, value) => {
    console.log("Pesquisa RECEBEDOR");
    console.log("Searched: " + value);
    this.setState({
      search_id: value,
      should_update_table: true,
      show_results: true,
      show_results_type: 'Subordinado'
    });
    event.preventDefault();
  }

  render (){
    if (!this.state.show_results){
      return(
        <div class="searches">
          <p> Pesquisar Órgão PAGADOR</p>
          <Search type="pagador" value={this.state.value} handleChange={this.handleChange} handleSubmit={this.handleSubmitPagador}/>
          <br/>
          <p> Pesquisar Órgão RECEBEDOR</p>
          <Search type="recebedor" value={this.state.value} handleChange={this.handleChange} handleSubmit={this.handleSubmitRecebedor}/>
        </div>
      );
    }
    else{
      return(
        <TransactionsTable key={this.state.search_id} entity_type={this.state.show_results_type} entity_id={this.state.search_id} tableLoaded={this.tableLoaded}/>
      );
    }
  }
}

export default App;
