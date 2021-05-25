import React from 'react';
import { useTable } from 'react-table';
import './TransactionsTable.css';
import table_columns from './TransactionsTableColumns.js';
import DataSummary from "./DataSummary.js";
import { withRouter } from 'react-router-dom'
import Button from './Button';

import queryString from 'query-string';
import {
  BrowserRouter as Router,
  Link,
  useLocation
} from "react-router-dom";


function Table({columns, data}) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  })

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

function TableBuilder(entity_type, data) {
  const columns = table_columns;
  return (
    <div>
      <Table columns={columns} data={data} />
    </div>
  );
}

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
    const value = queryString.parse(this.props.location.search);
    const entity_id = value.id;
    this.entity_id = entity_id;
    this.dates_to_search = value.dates.split("-");
    console.log("Dates got from URL params: " + this.dates_to_search);
  }

  requestDataFromAPI(month_date){
    console.log("requesting data...");
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