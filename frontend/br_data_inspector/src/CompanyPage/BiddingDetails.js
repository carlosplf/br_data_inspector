import React from "react";


class BiddingDetails extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            data: null,
            loading: true
        };
    }
    
    api_url = process.env.REACT_APP_API_URL;
    api_port = process.env.REACT_APP_API_PORT;
    
    buildBiddingDetails(){
        return(
            <p>
                {this.state.data[0]["Objeto"]}
            </p>
        )
    }

    render(){
        if (this.state.loading){
            return(
                <h1> Loading Bidding Details. Process ID: {this.props.process_id} </h1>
            )
        }
        else{
            let bidding_details = this.buildBiddingDetails()

            return(
                <div className="biddingDetails">
                    {bidding_details}
                </div>
            )
        }
    }
}

export default BiddingDetails;
