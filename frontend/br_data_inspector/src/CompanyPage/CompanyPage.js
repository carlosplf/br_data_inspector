import React from "react";
import ContractsCard from "../CompanyPage/ContractsCard.js";
import BiddingsCard from "../CompanyPage/BiddingsCard.js";
import Header from "../Header/Header";
import "../CompanyPage/CompanyPage.css";

class CompanyPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount(){
        this.getURLParams();
    }

    //Expected URL: https://domain.com/company?cnpj=111222333444
    getURLParams() {
        const queryParameters = new URLSearchParams(window.location.search);
        const company_cnpj = queryParameters.get("cnpj");
        this.setState({cnpj: company_cnpj});
    }

    render() {
        return (
            <div className="companyPage">
                <Header
                    handleShareButton={this.handleShareButton}
                    show_share_button={false}
                    show_table_data={false}
                    header_text="Contratos da empresa"
                    handle_modal={this.handleOpenDataModal}
                />
                <div className="companyDataBlock">
                    <ContractsCard cnpj={this.state.cnpj}/>
                    <BiddingsCard cnpj={this.state.cnpj}/>
                </div>
            </div>
        )
    }
}

export default CompanyPage;
