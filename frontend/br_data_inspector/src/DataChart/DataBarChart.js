import React from 'react';
import {
	XAxis,
	YAxis,
	VerticalGridLines,
	HorizontalGridLines,
	VerticalBarSeries,
    Hint,
    FlexibleWidthXYPlot
} from 'react-vis';
import "../DataChart/DataBarChart.css";
import DataChartLabel from "../DataChart/DataChartLabel";


class DataBarChart extends React.Component{
	constructor (props) {
		super(props);
        this.state = {
            show_hint: false,
            datapoint: null,
            series_name: "",
        }
	}

	keys_to_show = [
		"Valor Empenhado (R$)",
		"Valor Liquidado (R$)",
		"Valor Pago (R$)"
	]

    hint_datapoint = {
        x: 10,
        y: 10
    }

	graph_bar_colors = ["#29B6F6", "#80DEEA", "#66BB6A"];

	sumByMonth(key){
		/*
			Sum data[key] by month date. X-Axis is Month axis and Y-Axis is total_value Axis. Expected return:
			[
					{
							x: '202001',
							y: XXXX,
					},
					{
							x: '202002',
							y: YYYY,
					}
			]
		*/
		var sum_by_month = [];
		var sum_value = 0;
		this.props.selected_dates.forEach(single_date =>{

			// Parse date Month to the format at the Table data: YYYY/MM.
			var current_date = single_date.slice(0, 4) + "/" + single_date.slice(4);

			this.props.all_transactions_data.forEach(item => {
				if (item["Ano e mês do lançamento"] === current_date){
					sum_value += parseFloat(item[key]);
				}
			});
			sum_by_month.push({
				x: single_date,
				y: sum_value
			})
			sum_value = 0;
		})
		return sum_by_month;
	}

	createDatasetBarGraph(){
		/*
			Put together the total value for each month and each key (table column).
			Expected return is a Array with sumByMonth results for each key.
		*/
		var dataset_all_months_and_keys = [];
		this.keys_to_show.forEach(single_key => {
			dataset_all_months_and_keys.push(this.sumByMonth(single_key));
		});
		return dataset_all_months_and_keys;
	}
    
    formatNumbers(x) {
        if (!x) {return 0}
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    showHint(){
        /*  Return a Hint Object based on 'show_hint' state and Datapoint values. */        
        if (this.state.show_hint){
            const month_as_str = this.getMonthName(this.state.datapoint.x);
            return(
                <Hint className="hintBox" value={this.state.datapoint}>
                    <div className="hintLine">
                        <div className="hintBarColor" style={{backgroundColor: this.state.series_color}}></div>
                        <spam className="hintSeparator">
                            <p>{this.state.series_name}</p>
                            <p style={{fontWeight: "bold"}}>R${this.formatNumbers(this.state.datapoint.y)}</p>
                            <p>{month_as_str}</p>
                        </spam>
                    </div>
                </Hint>
            );
        }
        else{
            return null;
        }
    }
    
    getMonthName(current_date){
        // Receiving current_date as YYYYMM.
        let year = current_date.substr(0,4);
        let month = current_date.substr(4,6);
        let my_date = new Date(year, parseInt(month) - 1, '01');
        let date_to_str =  my_date.toLocaleString('pt-BR', {month: 'long', year: 'numeric'});
        return this.upperCaseFirstLetter(date_to_str);
    }
    
    upperCaseFirstLetter(text){
        return text[0].toUpperCase() + text.slice(1).toLowerCase();
    }

	createDataSeries(){
		//Create the VerticalDataSeries objects for the chart.
		var all_data_series = []
		var prepared_data = this.createDatasetBarGraph(this.keys_to_show);
		for (var i=0; i<prepared_data.length; i++){
            const series_id = i;

			all_data_series.push(
				<VerticalBarSeries key={i}
                    onValueMouseOver={(datapoint, event) => {
                        this.setState({show_hint: true,
                            datapoint: datapoint,
                            series_name: this.keys_to_show[series_id],
                            series_color: this.graph_bar_colors[series_id]
                        });
                    }}
                    onValueMouseOut={(datapoint, event) => {this.setState({show_hint: false})}}
                    color={this.graph_bar_colors[i]}
                    style={{strokeWidth: 12, marginLeft: 10}}
                    data={prepared_data[i]}
                />
			);
		}
		return all_data_series;
	}

	render(){

		const all_data_series = this.createDataSeries();
		const entities = [this.props.all_transactions_data[0]["Nome Órgão Subordinado"]];
        const hint = this.showHint();

		return (
			<div className="DataBarChart">
				<DataChartLabel entities={entities} keys={this.keys_to_show} colors={this.graph_bar_colors}/>
				<FlexibleWidthXYPlot xType="ordinal" style={{marginTop: 20}} height={600} margin={{left: 120}}>
				<VerticalGridLines />
				<HorizontalGridLines />
				<XAxis 
				style={{
					text: {stroke: 'none', fill: '#FFFFFF', fontWeight: 600}
				}}/>
				<YAxis
				style={{
					text: {stroke: 'none', fill: '#FFFFFF', fontWeight: 600}
				}}/>
				{all_data_series}
                {hint}
				</FlexibleWidthXYPlot>
				<br></br>
			</div>
		)
	}
}

export default DataBarChart;
