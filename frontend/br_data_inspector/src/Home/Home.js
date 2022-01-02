import React from 'react';
import SearchEntity from '../Home/SearchEntity';
import MonthPicker from '../Home/MonthPicker';
import Header from '../Header/Header';
import CompareButton from '../Home/CompareButton';
import Loading from '../Utils/Loading';
import { Redirect } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { FaAngleRight } from "react-icons/fa";
import 'react-toastify/dist/ReactToastify.css';
import '../Home/Home.css';
import TagManager from 'react-gtm-module';
import Typing from 'react-typing-animation';


const tagManagerArgs = {
    gtmId: 'GTM-58D9KMC'
}

TagManager.initialize(tagManagerArgs)


class Home extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            'data': '',
            'search_id': '',
            'search_id_2': '',
            'loading': true,
            'first_load': true,
            'show_results': false,
            'show_results_type': '',
        };
    }

    items = [];
    selected_dates = [];
    dates_url_param = "";
    api_url = process.env.REACT_APP_API_URL;
    api_port = process.env.REACT_APP_API_PORT;

    handleOnSelect = (item) => {
        this.setState({search_id: item["id"]});
    }

    //If COMPARE is enabled, set the second Entity to be compared with.
    handleOnSelectSecond = (item) => {
        this.setState({search_id_2: item["id"]});
    }

    handleCompareButton = () => {
        this.setState(prevState => ({
            compare: !prevState.compare
        }));
    }

    //Callback when a Entity is selected from Autocomplete search.
    handleSearch = (item) => {
        if (this.selected_dates.length === 0){
            console.log("Alert, no date selected!");
            toast.warn('Selecione uma data', {
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
        if (this.state.search_id === ''){
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
        if (this.state.compare && this.state.search_id_2 === ''){
            console.log("Alert, no second entity selected!");
            toast.warn('Selecione uma segunda entidade para busca', {
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

    //Get all Subordinados and Superior Órgãos from backend API.
    getNamesList(entity_type){
        var base_url = this.api_url + ":" + this.api_port;
        var final_url = base_url + "/" + entity_type.toLowerCase() + "/202001";
        fetch(final_url)
            .then(response => response.json())
            .then(data => this.setState({ data: data["data"], loading: false}));
    }

    //Parse Entities list so they can be used in autocomplete search.
    prepareItems(entity_type){
        var items = [];
        for (let [key, value] of Object.entries(this.state.data)) {
            items.push({
                'id':  value["Código Órgão " + entity_type],
                'name': value["Nome Órgão " + entity_type]
            })
        }
        this.items = items;
    }

    // Based on the dates list received from MonthPicker,
    // build the URL params to results page.
    buildTableDateParam(){
        this.selected_dates.map( single_date => {
            var new_param = single_date + "-";
            this.dates_url_param += new_param;
        });
        this.dates_url_param = this.dates_url_param.slice(0, -1);
    }

    // Function passed as props to MonthPicker Component.
    // MonthPicker call this function when two valid dates are
    // selected.
    receiveDatesList = (dates_list) => {
        this.selected_dates = dates_list;
    }

    render(){

        // If true, we have results to show!
        if (this.state.show_results){
            this.buildTableDateParam();
            if(!this.state.compare){
                var url_string = "/details?id=" + this.state.search_id + "&dates=" + this.dates_url_param;
            }
            else{
                var url_string = "/compare?id1=" + this.state.search_id + "&id2=" + this.state.search_id_2 + "&dates=" + this.dates_url_param;
            }
            return (
                <Redirect to={url_string}/>
            );
        }

        // First Load! No data, need to collect the list of entities
        // to the search field autocomplete.
        if (this.state.first_load){
            this.getNamesList("Subordinado");
            this.setState({first_load: false});
        }

        // Loading... Requesting entities list from API.
        if (this.state.loading){
            return(
                <Loading/>
            )
        }

        // Entities list collected, time to show the Home page.
        if(!this.first_load && !this.state.loading && !this.show_results){
            if (this.items.length == 0){
                this.prepareItems("Subordinado");
            }
            return(
                <div className="govdata-home">

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

                    <div className="contentContainer">

                        <Header header_text="BR Data Collector - 0.1" handle_modal={this.handleOpenDataModal}/>

                        <div className="titleContainer">
                            <span className="pageTitle">Pesquisar por: </span>
                            <Typing hideCursor={true} speed={30}>
                                <div>
                                    <span className="pageTitleSpam">Ministério da Saúde.</span>
                                    <Typing.Backspace delay={1000} count={22} />
                                    <span className="pageTitleSpam">Ministério da Economia.</span>
                                    <Typing.Backspace delay={1000} count={24} />
                                    <span className="pageTitleSpam">Comando do Exército.</span>\
                                    <Typing.Backspace delay={1000} count={24} />
                                    <span className="pageTitleSpam">Universidade Federal de São Carlos.</span>
                                    <Typing.Backspace delay={1000} count={36} />
                                    <span className="pageTitleSpam">Agência Espacial Brasileira.</span>
                                </div>
                            </Typing>
                        </div>
                        <SearchEntity
                            search_id="search_1"
                            show={true}
                            items={this.items}
                            handleOnSelect={this.handleOnSelect}
                        />
                        <SearchEntity
                            search_id="search_2"
                            show={this.state.compare}
                            items={this.items}
                            handleOnSelect={this.handleOnSelectSecond}
                        />
                        <CompareButton handleCompareButton={this.handleCompareButton}/>

                        <MonthPicker
                            receiveDatesList={this.receiveDatesList}
                        />

                        <button id="search-btn" onClick={this.handleSearch}>Pesquisar</button>

                        <div className="helpCenter">
                            <p className="topic"> <FaAngleRight/> O que posso pesquisar?</p>
                            <p className="info">Você pode pesquisar por qualquer Órgão FEDERAL.</p>
                            <p className="info">Exemplo: Ministérios, Faculdades Federais, Polícia Federal, etc.</p>
                            <p className="topic"> <FaAngleRight/> Quais dados o sistema me mostra?</p>
                            <p className="info">Por enquanto, o sistema coleta e mostra dados de: Despesas, Licitações e Contratos.</p>
                        </div>

                    </div>
                </div>
            )
        }
    }
}

export default withRouter(Home);
