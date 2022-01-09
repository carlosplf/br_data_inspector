import React from "react";
import { withRouter } from "react-router-dom";
import ContractsRank from "../ContractsPage/ContractsRank";

class ContractsPage extends React.Component {
    render() {
        return <ContractsRank year="2020" />;
    }
}

export default withRouter(ContractsPage);
