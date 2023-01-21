import React from 'react';
import '../Expenses/ExpensesTable.css';
import ExpensesChart from "../Expenses/ExpensesChart.js"

class ExpensesTable extends React.Component{
    formatNumbers(x) {
        if (!x) {return 0}
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    total_in_expenses = 0;
    
    //Transform the list of dicts received from API in a dic of expenses.
    //Expenses are grouped by the "Código Elemento de Despesa" ID.
	buildExpensesDict(){
        this.total_in_expenses = 0;
		var expenses_summary = {}

		this.props.data.forEach(single_line => {

            //Sum all values so we can calculate the share of an expense.
            this.total_in_expenses += parseFloat(single_line["Valor Pago (R$)"]);

			var previous_total_value = 0;
			if (expenses_summary[single_line["Código Elemento de Despesa"]]){
				//Dict already contains an expense with a valid value. Sum.
				previous_total_value = parseFloat(expenses_summary[single_line["Código Elemento de Despesa"]]["Valor Pago"]);
			}
			var new_entry = {
				"Nome": single_line["Nome Elemento de Despesa"],
				"Valor Pago": parseFloat(single_line["Valor Pago (R$)"]) + previous_total_value,
                "Codigo": single_line["Código Elemento de Despesa"]
			}
			expenses_summary[single_line["Código Elemento de Despesa"]] = new_entry
		});
		return expenses_summary;
	}

    buildTable(expenses_data_as_dict){

        var data_array = Object.keys(expenses_data_as_dict).map((key, i)=> {
            return {
                "Key": key,
                "Name": expenses_data_as_dict[key]["Nome"],
                "Value": expenses_data_as_dict[key]["Valor Pago"]
            }
        })

        var sorted_data_array = data_array.sort((a, b) => {
            return b["Value"] - a["Value"]    
        })

        var data_table = sorted_data_array.map(x => {

            // Calculate the share of this expense compared to total.
            var share = (parseFloat(x["Value"])/parseFloat(this.total_in_expenses))*100;
            share = share.toFixed(2);

            return(
                <tr key={x["Key"]}>
                    <td className="idColumn">{x["Key"]}</td>
                    <td className="nameColumn">{x["Name"]}</td>
                    <td className="valueColumn">R$ {this.formatNumbers(x["Value"])},00</td>
                    <td className="shareColumn">{share}%</td>
                </tr>
            )
        })

        return (
            <div className="expensesTable">
                <table>
                <tbody>
                    <tr>
                        <th id="idHead"> ID </th>
                        <th id="nameHead"> Nome </th>
                        <th id="paidHead"> Valor PAGO </th>
                        <th id="shareHead"> Fatia </th>
                    </tr>
                    {data_table}
                </tbody>
                </table>
            </div>
        )
    }

    render(){
        let expenses_as_dict = this.buildExpensesDict();
        let data_table = this.buildTable(expenses_as_dict);
        
        return(
            <div className="expensesBlock" id={"expensesData" + this.props.entity_id}>
                <h1> Elementos de Despesas: </h1>
                <h3> {this.props.entity_name}</h3>
                <ExpensesChart expenses={expenses_as_dict} total_in_expenses={this.total_in_expenses} expenses_shares={[{angle:1}]} raw_data={this.props.data} dates={this.props.dates}/>
                {data_table}
            </div>
        )
    }
}

export default ExpensesTable;
