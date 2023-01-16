import React from 'react';
import {
    RadialChart,
    Hint,
    XYPlot,
    XAxis,
    YAxis,
    HorizontalGridLines,
    VerticalGridLines,
    AreaSeries
} from 'react-vis';
import "../Expenses/ExpensesChart.css";


class ExpensesChart extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            show_hint: false,
        }
    }

    orderDates(){
        let new_dates = [];
        this.props.dates.forEach((x) => {
            new_dates.push(parseInt(x.replace("/", "")));
        });
        
        new_dates.sort(function(a, b) {
            return a - b;
        });

        return new_dates;
    }

    getExpensesByShare(){
        let expenses_with_big_shares = [];
        let share = 0.0;

        Object.keys(this.props.expenses).forEach((k) => {

            let single_entry = this.props.expenses[k];
            
            share = (parseFloat(single_entry["Valor Pago"])/parseFloat(this.props.total_in_expenses));

            if(share > 0.05){
                expenses_with_big_shares.push(single_entry["Codigo"]);
            }
        });

        return expenses_with_big_shares;
    }
    
    //Group expenses by the "Código Elemento de Despesa" ID and by the Date.
	buildExpensesDict(allowed_expenses){
        console.log(allowed_expenses);
        this.total_in_expenses = 0;
		var expenses_summary = {}
        let entry_date = "";
        let cod_despesa = "";
		this.props.raw_data.forEach(single_line => {

            entry_date = single_line["Ano e mês do lançamento"];
            cod_despesa = single_line["Código Elemento de Despesa"];

            if(!allowed_expenses.includes(cod_despesa)){
                return;
            }

            if (!expenses_summary[cod_despesa]){
                expenses_summary[cod_despesa] = {}
			}

            //Sum all values so we can calculate the share of an expense.
            this.total_in_expenses += parseFloat(single_line["Valor Pago (R$)"]);

			var previous_total_value = 0;
			if (expenses_summary[cod_despesa][entry_date]){
				//Dict already contains an expense with a valid value. Sum.
				previous_total_value = parseFloat(expenses_summary[cod_despesa][entry_date]["Valor Pago"]);
			}
			var new_entry = {
				"Nome": single_line["Nome Elemento de Despesa"],
				"Valor Pago": parseFloat(single_line["Valor Pago (R$)"]) + previous_total_value
			}

            expenses_summary[cod_despesa][entry_date] = new_entry;
        });

		return expenses_summary;
	}

    buildChartData(expenses_dict_by_date){
        let expenses_by_cod = [];
        let expenses_data_for_chart = [];
        let chart_label = "";
        let share = 0.0;
        let dates = this.orderDates();

        Object.keys(expenses_dict_by_date).forEach((cod_despesa) => {
            expenses_by_cod = [];
            Object.keys(expenses_dict_by_date[cod_despesa]).forEach((data_lancamento) => {
                let date_as_int = parseInt(data_lancamento.replace("/", ""));
                
                expenses_by_cod = expenses_by_cod.concat(
                    {
                        y: expenses_dict_by_date[cod_despesa][data_lancamento]["Valor Pago"],
                        x: dates.indexOf(date_as_int),
                        className: expenses_dict_by_date[cod_despesa][data_lancamento]["Nome"]
                    }
                );
            });
            expenses_data_for_chart = expenses_data_for_chart.concat([expenses_by_cod]);
        });

        return expenses_data_for_chart;
    }


    buildSeriesFromData(expenses_data_for_chart){
        return expenses_data_for_chart.map(x => {

            x = x.sort(function(first, second) {
                return second.x - first.x;
            });

            return(
                <AreaSeries
                    data={x}
                    opacity={0.5}
                    style={{}}
                />
            )
        });
    }

    render(){
        let allowed_expenses = this.getExpensesByShare();
        let expenses_dict = this.buildExpensesDict(allowed_expenses);
        let new_chart_data = this.buildChartData(expenses_dict);
        new_chart_data = this.buildSeriesFromData(new_chart_data);

        return(
            <div className="expensesChart">
                <div className="chartContainer">
                    <XYPlot
                        width={800}
                        margin={{left: 100}}
                        height={800}
                        stackBy="y">
                        <HorizontalGridLines />
                        <VerticalGridLines />
                        {new_chart_data}
                        <XAxis />
                        <YAxis />
                    </XYPlot>
                </div>
            </div>
        );
    }
}

export default ExpensesChart;
