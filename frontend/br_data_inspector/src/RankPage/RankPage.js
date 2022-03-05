import React from 'react';
import Header from '../Header/Header';
import RankTable from '../RankPage/RankTable';
import '../RankPage/RankPage.css';


class RankPage extends React.Component{
    
    render(){
        return(
            <div class="rankPage">
                <Header header_text="Maiores despesas"/>
                <div className="pageTitleRank">
                    <h2 style={{fontWeight: 'bold'}}>Soma de valores PAGOS por Órgão Subordinado.</h2>
                    <p>2021: Considerando dados até Junho.</p>
                </div>
                <RankTable date_year="2020"/>    
                <RankTable date_year="2021"/>    
            </div>
        )
    }
}

export default RankPage;
