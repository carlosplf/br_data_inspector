import React from "react";
import './Header.css';
import AppButton from './AppButton';
import { FaShareAlt } from 'react-icons/fa';

class Header extends React.Component{
    constructor(props){
        super(props);
    }

    showShareButton(){
        if(this.props.show_share_button){
            return <button id="shareBtn" className="page-btn" onClick={this.props.handleShareButton}><FaShareAlt/></button>
        }
        else{
            <spam/>
        }
    }

    showTableData(){
        if(this.props.show_table_data){
            return <button id="all-data-btn" className="page-btn" onClick={this.props.handle_modal}>Mostrar dados</button>
        }
        else{
            return <spam/>
        }
    }

    render(){
        const table_data_button = this.showTableData();
        const share_button = this.showShareButton();
        return(
            <div className="header">
                <h1>{this.props.header_text}</h1>
                <div className="header-btns">
                    {table_data_button}
                    {share_button}
                    <AppButton btn_type="about-btn"/>
                    <AppButton btn_type="home-btn"/>
                    <AppButton btn_type="rank-btn"/>
                </div>
            </div>
        )
    }
}

export default Header;
