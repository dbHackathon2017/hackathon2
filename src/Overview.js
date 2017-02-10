import React, { Component } from 'react';
import PensionTable from './PensionTable';

class Overview extends Component {
  render() {
    return (
      <div className="row">
        <PensionTable />
      </div>
    );
  }
}

export default Overview;
