import React from 'react';
import "./CreateCustomLink.css";


class CreateCustomLink extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            "custom_link": null
        }
    }

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
        var api_address = "http://localhost"
        var api_port = ":8080"
        var api_request = "/save_custom_link"
		var request_url = api_address + api_port + api_request;
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
                    <p>Crie um link personalizado e compartilhe sua análise!</p>
                    <form onSubmit={this.handleSubmit}>
                        <label>Link: BRDataCollector/</label><input name="custom_url" type="text"/>
                        <br></br>
                        <br></br>
                        <spam id="newURL">http://localhost:3000/custom_link?link_name={this.state.custom_link}</spam>
                        <button id="submitBtn">Criar</button>
                    </form>
                </div>
            </div>
        )
        
    }
}

export default CreateCustomLink;