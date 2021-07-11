import React from 'react';


class DataChartLabel extends React.Component{
	constructor(props){
		//Should receive the data Keys and Colors as props
		super(props);
	}
	
	createLabels(){
		var all_labels = [];
		for(var i=0;i<this.props.keys.length; i++){
			all_labels.push(
				{
					"key": this.props.keys[i],
					"color": this.props.colors[i]
				}
			);
		}
		return all_labels;
	}
	
	render(){
		const all_labels = this.createLabels();
		return(
			all_labels.map((s_lable) => <div className="ChartLabel"><span style={{color: s_lable.color}}>{s_lable.key}</span></div>)
		)
	}
}

export default DataChartLabel; 
