import React from 'react';
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  VerticalBarSeries,
  VerticalBarSeriesCanvas
} from 'react-vis';


class DataSummaryBarChart extends React.Component{
    constructor(props){
        super(props);
        this.state = {}
    }

    render(){
        const {useCanvas} = this.state;
        const content = useCanvas ? 'TOGGLE TO SVG' : 'TOGGLE TO CANVAS';
        const BarSeries = useCanvas ? VerticalBarSeriesCanvas : VerticalBarSeries;
        return (
            <XYPlot xType="ordinal" width={600} height={600} xDistance={100}>
              <VerticalGridLines />
              <HorizontalGridLines />
              <XAxis />
              <YAxis />
              <BarSeries data={this.props.data} />
            </XYPlot>
        )
    }
}

export default DataSummaryBarChart;