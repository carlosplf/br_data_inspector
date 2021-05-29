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
        width={400}
        height={400}/>
    }
}

export default DataSummaryChart;