import React from 'react';
import DataSummaryPieChart from './DataSummaryPieChart';
import DataSummaryBarChart from './DataSummaryBarChart';

class ModalContent extends React.Component{
    constructor (props) {
        super(props);
    }

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
            Sum data[key] by month date. X-Axis is Month axis and Y-Axis is total_value Axis. Expected result:
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
        console.log("data by Month: " + sum_by_month);
        return sum_by_month;
    }

    render(){
        return(
            <div>
                <h1>Data Modal</h1>
                <DataSummaryPieChart data={this.prepareDataForChart()}/>
                <DataSummaryBarChart data={this.sumByMonth("Valor Empenhado (R$)")}/>
            </div>
        )
    }
}

export default ModalContent;