import React, { Component } from 'react';
import $ from "jquery";
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { browserHistory } from 'react-router';


const options = {
  onRowClick: function(row) {
      browserHistory.push('/pension/1')
  }
};

class PensionTable extends Component {
  constructor(props) {
    super()
    this.state = { pensions: [] };
  }

  componentDidMount() {
    this.PensionList();
  }

  PensionList() {
    return $.getJSON('https://randomuser.me/api/?results=15')
      .then((data) => {
        console.log(data)
        this.setState({ pensions: data.results });
      });
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-12">
          <BootstrapTable data={ this.state.pensions } options={ options }>
            <TableHeaderColumn dataField='email' isKey>Pension ID</TableHeaderColumn>
            <TableHeaderColumn dataField='cell'>Pension Name</TableHeaderColumn>
          </BootstrapTable>
        </div>
      </div>
    );
  }
}

export default PensionTable;
