import React from 'react';
import {
    Hint,
    XAxis,
    YAxis,
    HorizontalGridLines,
    VerticalGridLines,
    AreaSeries,
    FlexibleXYPlot,
} from 'react-vis';
import "../Expenses/ExpensesChart.css";


class ExpensesChart extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            show_hint: false,
            hint_name: "",
            hint_data: {},
        }
    }
    
    hint_datapoint = {
        x: 2,
        y: 600
    }

    expenses_chart_threshold = 0.05;

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

            if(share > this.expenses_chart_threshold){
                expenses_with_big_shares.push(single_entry["Codigo"]);
            }
        });

        return expenses_with_big_shares;
    }
    
    //Group expenses by the "Código Elemento de Despesa" ID and by the Date.
	buildExpensesDict(allowed_expenses){
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
                        name: expenses_dict_by_date[cod_despesa][data_lancamento]["Nome"]
                    }
                );
            });
            expenses_data_for_chart = expenses_data_for_chart.concat([expenses_by_cod]);
        });

        return expenses_data_for_chart;
    }


    buildSeriesFromData(expenses_data_for_chart){

        let new_hint_data = {};
        let current_hint_data = {};

        return expenses_data_for_chart.map(x => {

            x = x.sort(function(first, second) {
                return first.x - second.x;
            });

            return(
                <AreaSeries
                    onNearestXY={(datapoint, event) => {
                        current_hint_data = this.state.hint_data;
                        new_hint_data = {
                            x: datapoint["x"],
                            y: datapoint["y"]
                        }
                        if(!current_hint_data[datapoint["name"]]){
                            current_hint_data[datapoint["name"]] = {}
                        }
                        current_hint_data[datapoint["name"]] = new_hint_data
                        this.setState({
                            hint_name: x[0]["name"],
                            show_hint: true,
                            hint_data: current_hint_data
                        });
                    }}
                    data={x}
                    opacity={0.5}
                    style={{}}
                />
            )
        });
    }
    
    buildHint(){
        let hint_entries = [];
        let hint_position = {};
        let max_y_value = this.getMaxY();
        let formated_y_value = 0;
        let formated_date = "";
        Object.keys(this.state.hint_data).forEach((k) => {
            hint_position = {x: this.state.hint_data[k]["x"], y: max_y_value*0.9}
            formated_y_value = this.formatNumbers(this.state.hint_data[k]["y"]);
            formated_date = this.formatMonthYear(this.props.dates[this.state.hint_data[k]["x"]]);
            hint_entries.push(
                <p>
                    {k}: Valor: R${formated_y_value} - Mês: {formated_date}
                </p>
            ); 
        });
        return(
            <Hint className="expensesChartHint" value={hint_position}>
                {hint_entries}
            </Hint>
        );
    }

    getMaxY(){
        let max_y_value = 0;
        
        Object.keys(this.state.hint_data).forEach((k) => {
            if(this.state.hint_data[k]["y"] > max_y_value){
                max_y_value = this.state.hint_data[k]["y"]
            }
        });

        return max_y_value;
    }
    
    formatNumbers(x) {
        /* Given a integer value, format for currency. */
        if (!x) {return 0}
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    formatMonthYear(x){
        /* Given a Month and Year date using the format YYYYMM, format for MM/YYYY. */
        let year = x.substr(0,4);
        let month = x.substr(4,6);
        return "" + month + "/" + year;
    }
    
    showHint(){
        /*  Return a Hint Object based on 'show_hint' state and Datapoint values. */        
        if (this.state.show_hint){
            return(this.buildHint());
        }
        else{
            return null;
        }
    }

    render(){
        let allowed_expenses = this.getExpensesByShare();
        let expenses_dict = this.buildExpensesDict(allowed_expenses);
        let new_chart_data = this.buildChartData(expenses_dict);
        new_chart_data = this.buildSeriesFromData(new_chart_data);
        const hint = this.showHint();

        return(
            <div className="expensesChart">
                <div className="chartContainer">
                    <FlexibleXYPlot
                        margin={{left: 100}}
                        height={400}
                        stackBy="y"
                        onMouseLeave={(datapoint, event) => {
                            this.setState({hint_name: "", show_hint: false, hint_data: {}})}
                        }>
                        <HorizontalGridLines />
                        <VerticalGridLines />
                        {new_chart_data}
                        {hint}
                        <XAxis hideTicks/>
                        <YAxis />
                    </FlexibleXYPlot>
                    <p className="chartInfo">Mostrando somente gastos acima de {this.expenses_chart_threshold*100}%.</p>
                </div>
            </div>
        );
    }
}

export default ExpensesChart;
