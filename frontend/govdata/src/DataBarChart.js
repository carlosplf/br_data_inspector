import React from 'react';
import {
	XYPlot,
	XAxis,
	YAxis,
	VerticalGridLines,
	HorizontalGridLines,
	VerticalBarSeries
} from 'react-vis';
import "./DataBarChart.css";
import DataChartLabel from "./DataChartLabel";


class DataBarChart extends React.Component{
	constructor (props) {
		super(props);
	}

	keys_to_show = [
		"Valor Empenhado (R$)",
		"Valor Liquidado (R$)",
		"Valor Pago (R$)"
	]

	graph_bar_colors = ["#00bbff", "#33ffd7", "#ff9c33"];

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

	createDataSeries(){
		//Create the VerticalDataSeries objects for the chart.
		var all_data_series = []
		var prepared_data = this.createDatasetBarGraph(this.keys_to_show);
		for (var i=0; i<prepared_data.length; i++){
			all_data_series.push(
				<VerticalBarSeries color={this.graph_bar_colors[i]} style={{strokeWidth: 12}, {marginLeft: 10}} data={prepared_data[i]}/>
			);
		}
		return all_data_series;
	}

	render(){

		const all_data_series = this.createDataSeries();
		const entities = [this.props.all_transactions_data[0]["Nome Órgão Subordinado"]];

		return (
			<div className="DataBarChart">
				<DataChartLabel entities={entities} keys={this.keys_to_show} colors={this.graph_bar_colors}/>
				<XYPlot xType="ordinal" style={{marginTop: 20}} width={1200} height={600} margin={{left: 120}}>
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
				</XYPlot>
				<br></br>
			</div>
		)
	}
}

export default DataBarChart;
