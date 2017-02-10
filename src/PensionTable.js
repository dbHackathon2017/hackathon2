import React, { Component } from 'react';
import $ from "jquery";
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

const options = {
  onRowClick: function(row) {
    alert(`You click row id: ${row.email}`);
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
    return $.getJSON('https://randomuser.me/api/')
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
