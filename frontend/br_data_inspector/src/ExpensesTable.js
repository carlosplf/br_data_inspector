import React from 'react';
import './ExpensesTable.css';

class ExpensesTable extends React.Component{
    constructor(props){
        super(props);
    }

    formatNumbers(x) {
        if (!x) {return 0}
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    buildTable(){
        console.log(this.props.data);
        var data_table = Object.keys(this.props.data).map((key, i)=> {
            return(
                <tr>
                    <td className="idColumn">{key}</td>
                    <td className="nameColumn">{this.props.data[key]["Nome"]}</td>
                    <td className="valueColumn">R$ {this.formatNumbers(this.props.data[key]["Valor Pago"])},00</td>
                </tr>
            )
        })
        return (
            <div className="expensesTable">
                <table>
                <tbody>
                    <tr>
                        <th> ID </th>
                        <th> Nome </th>
                        <th> Valor PAGO </th>
                    </tr>
                    {data_table}
                </tbody>
                </table>
            </div>
        )
    }


    render(){
        const data_table = this.buildTable();
        return(
            <div className="expensesBlock">
                <h1> Elementos de Despesas: </h1>
                {data_table}
            </div>
        )
    }
}

export default ExpensesTable;