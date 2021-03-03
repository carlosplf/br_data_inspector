import React from 'react';
import './EntityTable.css'
import { useTable } from 'react-table'

function Table({ columns, data }) {
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

  console.log("Building table...");
  console.log(data);

  const columns = [
    {
      Header: 'ID Órgão ' + entity_type,
      accessor: 'Código Órgão ' + entity_type,
    },
    {
      Header: 'Nome Órgão ' + entity_type,
      accessor: 'Nome Órgão ' + entity_type,
    },
  ];

  return (
    <div>
      <Table columns={columns} data={data} />
    </div>
  );
}

class EntityTable extends React.Component{
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
    var request_url = "http://localhost:8080/" + this.props.entity_type.toLowerCase() + "/202001";
    fetch(request_url)
    .then(response => response.json())
    .then(data => this.setState({ data: data["data"], loading: false}));
  }

  render(){
    if (this.state.loading){
        return (<p>Loading...</p>);
    }
    else{
      let table_builder = TableBuilder(this.props.entity_type, this.state.data);
      return (<div className="EntityTable">{table_builder}</div>)
    }
  }
}

export default EntityTable;