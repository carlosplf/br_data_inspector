import React from 'react';

import TableBuilder from '../Utils/TableBuilder';

class ModalContent extends React.Component{
    constructor (props) {
        super(props);
    }
    //TODO: Table is really heavy. Insert a 'Loading' placeholder.
    render(){
        const table_builder = TableBuilder(this.props.all_transactions_data);
        return(
            <div>{table_builder}</div>
        )
    }
}

export default ModalContent;
