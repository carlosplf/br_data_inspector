import React from 'react';
import './ContractsTable.css';


class ContractsTable extends React.Component{
    formatNumbers(x) {
        if (!x) {return 0}
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    buildTable(){
        
        var data_array = this.props.contracts_data;

        var sorted_data_array = data_array.sort((a, b) => {
            return b["Valor Final Compra"] - a["Valor Final Compra"]    
        })

        var data_table = sorted_data_array.map(x => {
            return(
                <tr key={x["Número Licitação"]}>
                    <td className="idColumn">{x["Número Licitação"]}</td>
                    <td className="nameColumn">{x["Nome Contratado"]}</td>
                    <td className="valueColumn">R$ {this.formatNumbers(x["Valor Final Compra"])},00</td>
                </tr>
            )
        })

        return (
            <div className="contractsTable">
                <table>
                <tbody>
                    <tr>
                        <th> Licitação </th>
                        <th> Nome Contratado</th>
                        <th> Valor Final da Compra </th>
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
            <div className="contractsBlock">
                <h1> Contratos assinados para o período: </h1>
                {data_table}
            </div>
        )
    }
}

export default ContractsTable;
