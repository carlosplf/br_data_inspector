import React from 'react';
import '../Home/CompareButton.css';


class CompareButton extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            'plus_or_minus': true
        }
    }

    handleClick = () => {
        this.setState(prevState => ({
            plus_or_minus: !prevState.plus_or_minus
        }));
        this.props.handleCompareButton();
    }

    render(){
        if(this.state.plus_or_minus){
            return(
                <button id="compare-btn-add" onClick={this.handleClick}>Comparar entitades</button>
            )
        }
        else{
            return(
                <button id="compare-btn-remove" onClick={this.handleClick}>Remover comparação</button>
            )
        }
    }
}

export default CompareButton;
