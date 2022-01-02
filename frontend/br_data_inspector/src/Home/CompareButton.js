import React from 'react';
import { FaPlus } from 'react-icons/fa';
import { FaMinus } from 'react-icons/fa';
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
                <button id="compare-btn" onClick={this.handleClick}><FaPlus/></button>
            )
        }
        else{
            return(
                <button id="compare-btn" onClick={this.handleClick}><FaMinus/></button>
            )
        }
    }
}

export default CompareButton;
