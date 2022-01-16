import React from 'react';
import "../CustomLink/CreateCustomLink.css";


class CreateCustomLink extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            "custom_link": null
        }
    }
    
    api_url = process.env.REACT_APP_API_URL;
    api_port = process.env.REACT_APP_API_PORT; 
    frontend_url = process.env.REACT_APP_FRONTEND_URL;
    frontend_port = process.env.REACT_APP_FRONTEND_PORT;

    showModal(){
        if(this.props.show){
            return {display: 'block'};
        }
        else{
            return {display: 'none'};
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.sendToAPI(e.target.elements.custom_url.value)
        this.setState({"custom_link": e.target.elements.custom_url.value})
        return "";
    }

    sendToAPI(custom_url){
        const request_options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin':'*' 
            },
            body: JSON.stringify({
                custom_url: custom_url,
                real_url: window.location.href
            })
        };

        this.setState({loading: true});
		// Call Backend API and retrieve data
		console.log("Sending data... Custom link: ", custom_url);
        var api_request = "/save_custom_link"
        var request_url = this.api_url + ":" + this.api_port + api_request;
		console.log(request_url);

		fetch(request_url, request_options)
            .then(response => console.log("Response from API: ", response))
    }

    render(){
        return(
            <div className="CustomLinkModal" style={this.showModal()}>
                <div className="CustomLinkModalContent">
                    <button onClick={this.props.handleClose} id="closeBtn">X</button>
                    <h2>Criar link para análise:</h2>
                    <br></br> 
                    <form onSubmit={this.handleSubmit}>
                        <label>Link: BRDataCollector/</label><input name="custom_url" type="text"/>
                        <br></br>
                        <br></br>
                        <label id="newURL">{this.frontend_url + ":" + this.frontend_port + "/custom_link?link_name=" + this.state.custom_link}</label>
                        <button id="submitBtn">Criar</button>
                    </form>
                </div>
            </div>
        )
        
    }
}

export default CreateCustomLink;
