//Comented to use styled-components in EntityTable.js

import './App.css';

import React from 'react';
import SearchEntity from './SearchEntity';
import EntityTable from './EntityTable';
import TransactionsTable from './TransactionsTable';

class App extends React.Component {
  constructor(props) { 
    super(props);
    this.state = {
      'data': '',
      'value': '',
      'search_id': '',
      'loading': true,
      'first_load': true,
      'show_results': false,
      'show_results_type': ''
    };
  }

  items = [];

  handleSubmitPagador = (event, value) => {
    console.log("Pesquisa PAGADOR");
    console.log("Searched: " + value);
    this.setState({
      search_id: value,
      show_results: true,
      show_results_type: 'Superior'
    });
    event.preventDefault();
  }

  handleSubmitRecebedor = (item) => {
    console.log("Pesquisa RECEBEDOR");
    console.log("Searched: " + item["id"]);
    this.setState({
      search_id: item["id"],
      show_results: true,
      show_results_type: 'Subordinado'
    });
  }

  //Get all Subordinados and Superior Órgãos from backend API.
  getNamesList(entity_type){
    console.log("First load. Geting entities names and IDs...");
    var request_url = "http://localhost:8080/" + entity_type.toLowerCase() + "/202001";
    fetch(request_url)
    .then(response => response.json())
    .then(data => this.setState({ data: data["data"], loading: false}));
  }

  //Parse Entities list so they can be used in autocomplete search.
  prepareItems(entity_type){
    console.log("Transforming items for autocomplete.");
    var items = [];
    for (let [key, value] of Object.entries(this.state.data)) {
      items.push({
        'id':  value["Código Órgão " + entity_type],
        'name': value["Nome Órgão " + entity_type]
      })
    }
    this.items = items;
  }


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
}

export default App;
