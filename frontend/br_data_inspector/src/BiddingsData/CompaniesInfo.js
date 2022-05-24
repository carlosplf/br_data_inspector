import React from 'react';
import '../BiddingsData/CompaniesInfo.css';
import '../BiddingsData/BiddingLoading.css';


class CompaniesInfo extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            data: [],
            show_data: false,
            loading: true
        }
    }
    
    api_url = process.env.REACT_APP_API_URL;
    api_port = process.env.REACT_APP_API_PORT;

    componentDidMount(){
        this.requestDataFromAPI();
    }
	
    //Call Backend API and retrieve data about Companies for a specific Bidding.
	requestDataFromAPI(){
        //Some process IDs have a '/' character. Lets replace it with "_", and the API will change it back.
        let process_id = this.props.process_id.replace("/", "_");
		
        var base_url = this.api_url + ":" + this.api_port;
		var request_url = base_url + "/biddings/companies/" + this.props.entity_id + "/" + this.props.bidding_id + "/" + process_id;

		return new Promise((resolve, reject) => {
			return fetch(request_url).then(response => response.json()).then(data => {
				if (data) {
                    resolve(this.setState({data: data["data"], loading: false}));
				} else {
					reject(new Error('Request failed. Empty Data return.'))
				}
			}, error => {
				reject(new Error('Request failed.'))
			})
		})
	}
    
    renderItem(item) {
        let tr_class = ((item["Flag Vencedor"] === "SIM") ? "winnerTr" : "looserTr");
        const itemRows = [
            <tr id={item["Código Participante"]} className={tr_class}>
                <td><a href={"/company?cnpj=" + item["Código Participante"]}>{item["Código Participante"]}</a></td>
                <td>{item["Nome Participante"]}</td>
                <td>{item["Flag Vencedor"]}</td>
            </tr>,
        ];
        return itemRows;
    }
    
    buildTable(table_rows) {
        return (
            <div className="biddingsTableDetails">
                <table>
                    <tbody>
                        <tr>
                            <th className="columnCompanyCNPJ"> CNPJ </th>
                            <th className="columnCompanyName"> Nome </th>
                            <th className="columnCompanyWon"> Ganhou </th>
                        </tr>
                        {table_rows}
                    </tbody>
                </table>
            </div>
        );
    }


    render(){
        let allItemRows = [];
        let full_table = [];
        
        if(this.state.data.length === 0 && this.state.loading === true){
            return(
                <div className="biddingLoading">
                    <svg viewBox="25 25 50 50">
                        <circle cx="50" cy="50" r="20"></circle>
                    </svg>
                    <p>Buscando Informações de empresas participantes...</p>
                </div>
            )
        }

        else if(this.state.data.length === 0 && this.state.loading === false){
            return(
                <div className="noBiddingCompaniesFound">
                    <p>Nenhuma informação de empresas participantes encontrada :(</p>
                </div>
            )
        }

        else{
        
            this.state.data.forEach((item) => {
                const perItemRows = this.renderItem(item);
                allItemRows = allItemRows.concat(perItemRows);
            });
        
            full_table = this.buildTable(allItemRows);
            
            return(
                <div className="biddingCompaniesInfo">
                    <h3> Empresas participantes </h3>
                    {full_table}
                </div>
            )
        }
    }
}

export default CompaniesInfo;
