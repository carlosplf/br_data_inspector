import React from 'react';
import {RadialChart} from 'react-vis';


// Not implemented yet
class DataSummaryChart extends React.Component{
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

export default DataSummaryChart;