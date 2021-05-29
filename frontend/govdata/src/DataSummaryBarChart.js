import React from 'react';
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  VerticalBarSeries
} from 'react-vis';


class DataSummaryBarChart extends React.Component{
    constructor(props){
        super(props);
        this.state = {}
    }

    render(){

        //Create a BarSeries for each dataset passed as props.
        //More info at ModalContent:createDatasetBarGraph().
        const all_data_series = this.props.data.map(data_serie =>{
          return(
            <VerticalBarSeries style={{strokeWidth: 12}, {marginLeft: 10}} data={data_serie}/>
          );
        });
        return (
            <div className="DataBarChart">
              <XYPlot xType="ordinal" style={{marginTop: 60}} width={1200} height={600} margin={{left: 120}}>
                <VerticalGridLines />
                <HorizontalGridLines />
                <XAxis />
                <YAxis />
                {all_data_series}
              </XYPlot>
            </div>
        )
    }
}

export default DataSummaryBarChart;