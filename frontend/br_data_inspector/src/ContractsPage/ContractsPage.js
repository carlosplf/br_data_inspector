import React from "react";
import { Redirect } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import ContractsRank from "../ContractsPage/ContractsRank";
import Header from "../Header/Header";
import SearchEntity from "../Home/SearchEntity";
import "../ContractsPage/ContractsPage.css";

class ContractsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
    }

    items = undefined;
    api_url = process.env.REACT_APP_API_URL;
    api_port = process.env.REACT_APP_API_PORT;

    componentDidMount() {
        this.requestAllCompaniesFromAPI();
    }
    
    //Handle selected item on SearchField
    handleOnSelect = (item) => {
        this.setState({search_id: item["id"]});
    }
    
    //Callback when a Entity is selected from Autocomplete search.
    handleSearch = (item) => {
        if (this.state.search_id === undefined){
            console.log("Alert, no entity selected!");
            toast.warn('Selecione uma entidade para busca', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }
        this.setState({
            show_results: true
        });
    }

    //Call Backend API and request a list of all Companies and CNPJs.
    requestAllCompaniesFromAPI() {
        var base_url = this.api_url + ":" + this.api_port;
        var request_url = base_url + "/companies/list";

        return new Promise((resolve, reject) => {
            return fetch(request_url)
                .then((response) => response.json())
                .then(
                    (data) => {
                        if (data) {
                            resolve(this.prepareCompaniesList(data));
                        } else {
                            reject(
                                console.log(
                                    "Contracts Rank request returned empty."
                                )
                            );
                        }
                    },
                    (error) => {
                        reject(new Error("Request failed."));
                    }
                );
        });
    }

    prepareCompaniesList(data){
        let all_companies_list = [];
        data["data"].forEach((item) => {
            let new_item = {"name": item["Nome"], "id": item["CNPJ"]}
            all_companies_list = all_companies_list.concat(new_item);
        });
        this.items = all_companies_list;
        this.setState({loading: false});
    }

    render() {

        if (this.state.show_results){
            let url_string = "/company?cnpj=" + this.state.search_id;
            return (
                <Redirect to={url_string}/>
            );
        }
        
        if (this.state.loading){
            return (
                <h1> Buscando índice de Empresas... </h1>
            )
        }
        
        else{
            return (
                <div className="contractsDataPage">
                    <ToastContainer
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />
                    <Header
                        handleShareButton={this.handleShareButton}
                        show_share_button={false}
                        show_table_data={false}
                        header_text="Contratos e Empresas"
                        handle_modal={undefined}
                    />

                    <h3 className="contractsPageTitle"> Pesquisar por empresa contratada: </h3>

                    <SearchEntity
                        search_id="search_company"
                        show={true}
                        items={this.items}
                        handleOnSelect={this.handleOnSelect}
                    />

                    <button id="search-btn" onClick={this.handleSearch}>Pesquisar</button>
                    
                    <div className="obsDiv">
                        <p className="obsMessage"> Não achou a empresa que procura? A busca considera 
                            apenas empresas com ao menos um contrato publicado com uma Instituição Federal.
                        </p>
                    </div>

                    <div className="contractsDataBlock">
                        <ContractsRank year="2020" />
                        <ContractsRank year="2021" />
                    </div>
                </div>
            );
        }
    }
}

export default withRouter(ContractsPage);
