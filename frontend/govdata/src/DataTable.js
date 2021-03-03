import React from 'react';
import './DataTable.css'
import { useTable } from 'react-table'

function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
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

  // Render the UI for your table
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

function TableBuilder(data) {

  console.log("Building table...");
  console.log(data);

  const columns = [
    {
      Header: 'ID Órgão Subordinado',
      accessor: 'Código Órgão Subordinado',
    },
    {
      Header: 'Nome Órgão Subordinado',
      accessor: 'Nome Órgão Subordinado',
    },
  ];

  return (
    <div>
      <Table columns={columns} data={data} />
    </div>
  );
}

class DataTable extends React.Component{
  constructor(props) {
    super(props);
    this.state = {loading: true, data: undefined};
  }

  componentDidMount(){
    if (!this.state.data){
      console.log("Requesting data...")
      this.setState({loading: true});
      this.requestDataFromAPI();
      console.log("Done");
    }
  }

  requestDataFromAPI(){
    fetch("http://localhost:8080/subordinado/202001")
    .then(response => response.json())
    .then(data => this.setState({ data: data["data"], loading: false}));
  }

  render(){
    if (this.state.loading){
        return (<p>Loading...</p>);
    }
    else{
      let table_builder = TableBuilder(this.state.data);
      return (<div className="DataTable">{table_builder}</div>)
    }
  }
}

export default DataTable;