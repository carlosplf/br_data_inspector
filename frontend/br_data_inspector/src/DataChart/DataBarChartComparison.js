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


class DataBarChartComparison extends React.Component{
    /* 
        The difference between this Component and the DataBarChart, is that this one
        deals with two Entities.
    */
	constructor (props) {
		super(props);
        this.state = {
            show_hint: false
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

	graph_bar_colors = [
        "#E3F2FD",
        "#90CAF9",
        "#2196F3",
        "#C8E6C9",
        "#81C784",
        "#43A047"
    ];

	sumByMonth(entity_1_or_2, key){
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
        var transactions_data = [];

        if (entity_1_or_2 === 1){
            transactions_data = this.props.all_transactions_data_1;
        }
        else{
            transactions_data = this.props.all_transactions_data_2;
        }
		
        this.props.selected_dates.forEach(single_date =>{

			// Parse date Month to the format at the Table data: YYYY/MM.
			var current_date = single_date.slice(0, 4) + "/" + single_date.slice(4);

			transactions_data.forEach(item => {
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
			Put together the total value for each month and each key.
			Expected return is a Array with sumByMonth results for each key.
		*/
		var dataset_all_months_and_keys = [];
        
        var entity_1_or_2 = 1;
		this.keys_to_show.forEach(single_key => {
			dataset_all_months_and_keys.push(this.sumByMonth(entity_1_or_2, single_key));
		});
        
        entity_1_or_2 = 2;
		this.keys_to_show.forEach(single_key => {
			dataset_all_months_and_keys.push(this.sumByMonth(entity_1_or_2, single_key));
		});

		return dataset_all_months_and_keys;
	}
    
    formatNumbers(x) {
        if (!x) {return 0}
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    showHint(datapoint){
        /*  Return a Hint Object based on 'show_hint' state and Datapoint values. */    
        if (this.state.show_hint){
            return(
                <Hint className="hintBox" value={this.hint_datapoint}>
                    <p>Valor: R${this.formatNumbers(this.hint_datapoint.y)}</p>
                    <p>Mês: {this.hint_datapoint.x}</p>
                </Hint>
            );
        }
        else{
            return null;
        }
    }

	createDataSeries(){
		//Create the VerticalDataSeries objects for the chart.
		var all_data_series = []
		var prepared_data = this.createDatasetBarGraph(this.keys_to_show);
		for (var i=0; i<prepared_data.length; i++){
			all_data_series.push(
				<VerticalBarSeries
                    onValueMouseOver={(datapoint, event) => {
                        this.hint_datapoint = datapoint;
                        this.setState({show_hint: true});
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
        const entities = [this.props.all_transactions_data_1[0]["Nome Órgão Subordinado"], this.props.all_transactions_data_2[0]["Nome Órgão Subordinado"]]
        const hint = this.showHint();

		return (
			<div className="DataBarChart">
                <link rel="stylesheet" href="https://unpkg.com/react-vis/dist/style.css"/>
                <DataChartLabel entities={entities} keys={this.keys_to_show} colors={this.graph_bar_colors}/>
                <FlexibleWidthXYPlot xType="ordinal" style={{marginTop: 20}} height={600} margin={{left: 120}}>
                <VerticalGridLines />
                <HorizontalGridLines />
                <XAxis 
                    style={{
                        text: {stroke: 'none', fill: '#FFFFFF', fontWeight: 600}
                    }}
                />
                <YAxis
                    style={{
                        text: {stroke: 'none', fill: '#FFFFFF', fontWeight: 600}
                    }}
                />
                {all_data_series}
                {hint}
                </FlexibleWidthXYPlot>
                <br></br>
			</div>
		)
	}
}

export default DataBarChartComparison;
