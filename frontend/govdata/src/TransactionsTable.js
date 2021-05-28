import React from 'react';
import './TransactionsTable.css';
import DataSummary from "./DataSummary.js";
import { withRouter } from 'react-router-dom'
import Button from './Button';
import TableBuilder from './TableBuilder';

import queryString from 'query-string';


class TransactionsTable extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: true, 
      data: undefined
    };
  }

  //Should be a state.
  entity_id = 0;
  dates_to_search = [];

  componentDidMount(){
    this.getURLParams();
    if (!this.state.data && this.entity_id !== ''){
      this.setState({loading: true});
      //TODO: Need a better logic to collect from multiple dates.
      this.requestDataFromAPI(this.dates_to_search[0]);
    }
  }
  
  getURLParams(){
    // This route URL receives the Entity ID and the Dates for query as arguments.
    // Example: "http://localhost:3000/table?id=26236&dates=202001-202003-202002"
    const value = queryString.parse(this.props.location.search);
    const entity_id = value.id;
    this.entity_id = entity_id;
    this.dates_to_search = value.dates.split("-");
    console.log("Dates got from URL params: " + this.dates_to_search);
  }

  requestDataFromAPI(month_date){
    // Call Backend API and retrieve data about Entities
    console.log("requesting data...");
    //TODO: need a better logic to store backend URL.
    var base_url = "http://localhost:8080/";
    var request_url = base_url + this.props.entity_type.toLowerCase() + "/" + month_date + "/" + this.entity_id;
    console.log(request_url);
    fetch(request_url)
    .then(response => response.json())
    .then(data => this.setState({ data: data["data"], loading: false}));
  }

  render(){
    if (this.state.loading){
        return (<p>Loading...</p>);
    }
    else{
      var table_builder = TableBuilder(this.props.entity_type, this.state.data);
      return (
        <div className="App-Results">
          <h1>Resultados da pesquisa:</h1>
          <Button/>
          <DataSummary key={this.entity_id} data={this.state.data}/>
          {table_builder}
        </div>
      )
    }
  }
}

export default withRouter(TransactionsTable);