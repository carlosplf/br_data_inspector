import React from 'react';
import { useTable } from 'react-table'
import './TransactionsTable.css'
import table_columns from './TransactionsTableColumns.js'
import DataSummary from "./DataSummary.js"

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

  componentDidMount(){
    if (!this.state.data && this.props.entity_id !== ''){
      this.setState({loading: true});
      this.requestDataFromAPI();
    }
  }

  requestDataFromAPI(){
    console.log("requesting data...");
    /* Date rande not implemented yet */
    var data_range = "202001";
    var base_url = "http://localhost:8080/";
    var request_url = base_url + this.props.entity_type.toLowerCase() + "/" + data_range + "/" + this.props.entity_id;
    console.log(request_url);
    fetch(request_url)
    .then(response => response.json())
    .then(data => this.setState({ data: data["data"], loading: false}));
  }

  sumData(){
    var value_keys = ["Valor Empenhado (R$)", "Valor Liquidado (R$)", "Valor Pago (R$)", "Valor Restos a Pagar Cancelado (R$)", "Valor Restos a Pagar Inscritos (R$)", "Valor Restos a Pagar Pagos (R$)"];
    var all_sums = {};
    this.state.data.forEach(single_line => {
      value_keys.forEach(key => {
        if (!all_sums[key]) { all_sums[key] = 0; }
        all_sums[key] += parseFloat(single_line[key]);
        console.log(parseFloat(single_line[key]));
      })
    });
    console.log(all_sums);
    return all_sums;
  }

  render(){
    if (this.state.loading){
        return (<p>Loading...</p>);
    }
    else{
      var total = this.sumData();
      var table_builder = TableBuilder(this.props.entity_type, this.state.data);
      return (
        <div className="TransactionsTable">
          <DataSummary data={this.state.data}/>
          {table_builder}
        </div>
      )
    }
  }
}

export default TransactionsTable;