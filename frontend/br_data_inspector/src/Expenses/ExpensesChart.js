import React from 'react';
import {
    XAxis,
    YAxis,
    HorizontalGridLines,
    VerticalGridLines,
    AreaSeries,
    FlexibleXYPlot,
    Crosshair,
} from 'react-vis';
import "../Expenses/ExpensesChart.css";


class ExpensesChart extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            show_hint: false,
            hint_name: "",
            hint_data: {},
            build_chart: true
        }
    }

    chart_colors = [
        "#66bb6a",
        "#4db6ac",
        "#4dd0e1",
        "#4fc3f7",
        "#64b5f6",
        "#7986cb"
    ];

    // This variable is redundant. Need to store color data more efficiently.
    map_series_colors = {};

    color_idx = 0;

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
        // Select only the expenses that have a share greater then expenses_chart_threshold.
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
    
	buildExpensesDict(allowed_expenses){
        //Group expenses by the "Código Elemento de Despesa" ID and by the Date.
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
        /*
        * Based on the dates searched and the data received, build the data dict that needs to be considered
        * in building the chart.
        * Note that the data is not ready yet to be shown. The Component needs to build the Data Series.
        */
        let expenses_by_cod = [];
        let expenses_data_for_chart = [];
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
        // Based on the data that must be shown in the chart, build the Data Series.
        let new_hint_data = {};
        let current_hint_data = {};
        let series_color = "000000";
        this.color_idx = 0;

        return expenses_data_for_chart.map(x => {
            
            series_color = this.chart_colors[this.color_idx];
            this.map_series_colors[x[0]["name"]] = series_color;
            this.color_idx = this.color_idx + 1;

            if(this.color_idx >= this.chart_colors.length){
                this.color_idx = 0;
            }
            
            x = x.sort(function(first, second) {
                return first.x - second.x;
            });

            return(
                <AreaSeries
                    onNearestXY={(datapoint, event) => {
                        current_hint_data = this.state.hint_data;
                        new_hint_data = {
                            x: datapoint["x"],
                            y: datapoint["y"],
                        }
                        if(!current_hint_data[datapoint["name"]]){
                            current_hint_data[datapoint["name"]] = {}
                        }
                        current_hint_data[datapoint["name"]] = new_hint_data
                        this.setState({
                            hint_name: x[0]["name"],
                            show_hint: true,
                            hint_data: current_hint_data,
                            hint_datapoint: datapoint
                        });
                    }}
                    color={series_color}
                    data={x}
                    opacity={0.5}
                    style={{}}
                />
            )
        });
    }
    
    buildHint(){
        /*
        * The Hint Obj must be built based on the information stored in the Component State hint_data.
        * This information is changed based on the mouse over event and other user interations.
        */
        let hint_entries = [];
        let formated_y_value = 0;
        let formated_date = "";

        Object.keys(this.state.hint_data).forEach((k) => {
            formated_y_value = this.formatNumbers(this.state.hint_data[k]["y"]);
            formated_date = this.formatMonthYear(this.props.dates[this.state.hint_data[k]["x"]]);
            hint_entries.push(
                <div className="hintLine">
                    <div className="hintCircleColor" style={{backgroundColor: this.map_series_colors[k]}}></div>
                    <spam className="hintSeparator">
                        <p>
                            {k}: Valor: R${formated_y_value} - Mês: {formated_date}
                        </p>
                    </spam>
                </div>
            ); 
        });
        return(
            <Crosshair className="crossHair" values={[this.state.hint_datapoint]}>
                <div className="expensesChartHint">{hint_entries.reverse()}</div>
            </Crosshair>
        );
    }

    getMaxY(){
        // Get the maximum value iside a dict considering a specific key.
        let max_y_value = 0;
        Object.keys(this.state.hint_data).forEach((k) => {
            if(this.state.hint_data[k]["y"] > max_y_value){
                max_y_value = this.state.hint_data[k]["y"]
            }
        });
        return max_y_value;
    }
    
    formatNumbers(x) {
        // Given a integer value, format for currency.
        if (!x) {return 0}
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    formatMonthYear(x){
        // Given a Month and Year date using the format YYYYMM, change to MM/YYYY.
        let year = x.substr(0,4);
        let month = x.substr(4,6);
        return "" + month + "/" + year;
    }
    
    showHint(){
        // Return a Hint Object or NULL, based on 'show_hint' state and Datapoint values.
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
        let chart_series = this.buildSeriesFromData(new_chart_data);
        let hint = this.showHint();

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
                        {chart_series}
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
