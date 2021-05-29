import React from 'react';
import DataSummaryChart from './DataSummaryChart'

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

    render(){
        return(
            <div>
                <h1>Data Modal</h1>
                <DataSummaryChart data={this.prepareDataForChart()}/>
            </div>
        )
    }
}

export default ModalContent;