import React from 'react';


class DataChartLabel extends React.Component{
	constructor(props){
		//Should receive the data Keys and Colors as props
		super(props);
	}
	
	createLabels(){
		var all_labels = [];
		for (var j=0;j<this.props.entities.length; j++){
			for(var i=0;i<this.props.keys.length; i++){
				all_labels.push(
					{
						"key": this.props.keys[i] + " - " + this.props.entities[j],
						"color": this.props.colors[i+(this.props.keys.length * j)]
					}
				);
			}
		}
		return all_labels;
	}
	
	render(){
		const all_labels = this.createLabels();
		return(
			all_labels.map((s_label) => <div key={s_label.key} className="ChartLabel"><span style={{color: s_label.color}}>{s_label.key}</span></div>)
		)
	}
}

export default DataChartLabel; 
