import React from 'react';
import DataSummaryPieChart from './DataSummaryPieChart';
import DataSummaryBarChart from './DataSummaryBarChart';

class ModalContent extends React.Component{
    constructor (props) {
        super(props);
    }

    keys_to_show = [
        "Valor Empenhado (R$)",
        "Valor Liquidado (R$)",
        "Valor Pago (R$)"
    ]

    prepareDataForChart(){
        /* 
            Expected data format:
            [
                {angle: x, label: 'something'},
                {angle: y, label: 'something'},
                {angle: z, label: 'something'},
            ]
        */
        var data_for_chart = []
        this.props.data_keys.forEach(key => {
            data_for_chart.push({angle: this.props.values_summary[key], label: key})
        })
        return data_for_chart;
    }

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

    render(){
        return(
            <div>
                <DataSummaryPieChart data={this.prepareDataForChart()}/>
                <DataSummaryBarChart data_labels={this.keys_to_show} data={this.createDatasetBarGraph(this.props.date_keys)}/>
            </div>
        )
    }
}

export default ModalContent;