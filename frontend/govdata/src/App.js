//Comented to use styled-components in EntityTable.js
//import './App.css';

import React from 'react';
import EntityTable from './EntityTable';
import TransactionsTable from './TransactionsTable';

class App extends React.Component {
  render (){
    return (
      <div className="App">
        <EntityTable entity_type="Superior"/>
        <TransactionsTable entity_type="Subordinado"/>
      </div>
    );
  }
}

export default App;
