import React from 'react';
import { Redirect } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import queryString, { stringify } from 'query-string';


class CustomLinkRouter extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            loading: true,
            data: null
        }
    }

    componentDidMount(){
        const values = queryString.parse(this.props.location.search);
		const custom_url = values.link_name;
        this.getRealURLFromAPI(custom_url);
    }

    adjustRealURL(){
        var real_url = this.state.data["real_url"].replace(/'/g, '');
        real_url = real_url.split("/")[3];
        return real_url;
    }

    getRealURLFromAPI(custom_url){
        this.setState({loading: true});
		// Call Backend API and get the real URL from custom_url
		console.log("Requesting data...");
        var api_address = "http://localhost"
        var api_port = ":8080"
        var api_request = "/get_real_url/" + custom_url
		var request_url = api_address + api_port + api_request;
		fetch(request_url)
			.then(response => response.json())
			.then(data => {
				this.setState({ data: data, loading: false})
			});
    }

    render(){
        if(!this.state.loading){
            const path = this.adjustRealURL();
            return(
                    <Redirect to={path}/>
            )
        }
        else{
            return(
                <h2>Loading...</h2>
            )
        }
    }
}

export default withRouter(CustomLinkRouter);