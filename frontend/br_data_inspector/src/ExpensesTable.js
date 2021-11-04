import React from 'react';
import './ExpensesTable.css';

class ExpensesTable extends React.Component{
    formatNumbers(x) {
        if (!x) {return 0}
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    buildTable(){
        
        var data_array = Object.keys(this.props.data).map((key, i)=> {
            return {
                "Key": key,
                "Name": this.props.data[key]["Nome"],
                "Value": this.props.data[key]["Valor Pago"]
            }
        })

        var sorted_data_array = data_array.sort((a, b) => {
            return b["Value"] - a["Value"]    
        })

        var data_table = sorted_data_array.map(x => {
            return(
                <tr key={x["Key"]}>
                    <td className="idColumn">{x["Key"]}</td>
                    <td className="nameColumn">{x["Name"]}</td>
                    <td className="valueColumn">R$ {this.formatNumbers(x["Value"])},00</td>
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
