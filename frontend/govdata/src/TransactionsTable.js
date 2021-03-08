import React from 'react';
import { useTable } from 'react-table'
import './TransactionsTable.css'

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

  const columns = [
    {
      Header: 'ID Órgão Superior',
      accessor: 'Código Órgão Superior',
    },
    {
        Header: 'Nome Órgão Superior',
        accessor: 'Nome Órgão Superior',
    },
    {
        Header: 'Ano e mês do lançamento',
        accessor: 'Ano e mês do lançamento',
    },
    {
        Header: 'ID Órgão Subordinado',
        accessor: 'Código Órgão Subordinado',
    },
    {
      Header: 'Nome Órgão Subordinado',
      accessor: 'Nome Órgão Subordinado',
    },
    {
        Header: 'Valor Empenhado (R$)',
        accessor: 'Valor Empenhado (R$)',
    },
    {
        Header: 'Valor Liquidado (R$)',
        accessor: 'Valor Liquidado (R$)',
    },
    {
        Header: 'Valor Pago (R$)',
        accessor: 'Valor Pago (R$)',
    },
    {
        Header: 'Valor Restos a Pagar Cancelado (R$)',
        accessor: 'Valor Restos a Pagar Cancelado (R$)',
    },
    {
        Header: 'Valor Restos a Pagar Inscritos (R$)',
        accessor: 'Valor Restos a Pagar Inscritos (R$)',
    },
    {
        Header: 'Valor Restos a Pagar Pagos (R$)',
        accessor: 'Valor Restos a Pagar Pagos (R$)',
    },
  ];

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
    var request_url = "http://localhost:8080/" + this.props.entity_type.toLowerCase() + "/202001/" + this.props.entity_id;
    console.log(request_url);
    fetch(request_url)
    .then(response => response.json())
    .then(data => this.setState({ data: data["data"], loading: false}));
  }

  sumData(){
    var total = 0;
    this.state.data.forEach(element => {
      total += parseFloat(element['Valor Pago (R$)']);
    });
    return total;
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
          <p>TOTAL (Valor Pago (R$)): {total}</p>
          {table_builder}
        </div>
      )
    }
  }
}

export default TransactionsTable;