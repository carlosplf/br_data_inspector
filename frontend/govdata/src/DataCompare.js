import React from 'react';
import { withRouter } from 'react-router-dom'


class DataCompare extends React.Component{
	constructor(props) {
		super(props);
		this.state = {};
	}

	render(){
        return <h2> Data Compare Page </h2>
    }
}

export default withRouter(DataCompare);
