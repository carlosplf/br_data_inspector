import React from 'react';
import {RadialChart} from 'react-vis';


class DataSummaryPieChart extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return <RadialChart
        data={this.props.data}
        showLabels={true}
        labelsAboveChildren={true}
        width={500}
        height={500}/>
    }
}

export default DataSummaryPieChart;