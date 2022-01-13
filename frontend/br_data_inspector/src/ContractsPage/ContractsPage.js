import React from "react";
import { withRouter } from "react-router-dom";
import ContractsRank from "../ContractsPage/ContractsRank";
import Header from "../Header/Header";
import "../ContractsPage/ContractsPage.css";

class ContractsPage extends React.Component {
    render() {
        return (
            <div className="contractsDataPage">
                <Header
                    handleShareButton={this.handleShareButton}
                    show_share_button={false}
                    show_table_data={false}
                    header_text="Rank de Contratos"
                    handle_modal={this.handleOpenDataModal}
                    dark_background={true}
                />
                <div className="contractsDataBlock">
                    <ContractsRank year="2020" />
                </div>
            </div>
        )
    }
}

export default withRouter(ContractsPage);
