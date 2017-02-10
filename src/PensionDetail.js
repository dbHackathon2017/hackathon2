import React, { Component } from 'react';
import $ from "jquery";
import PensionTimeline from './PensionTimeline';
import './PensionDetail.css';

class PensionDetail extends Component {
  findPensionById() {
    return $.getJSON('https://randomuser.me/api/')
      .then((data) => {
        this.setState({ pension: data.results[0] });
      });
  }

  componentDidMount() {
    this.setState({
      pension: this.findPensionById(this.props.params.pensionId)
    })
  }

  render() {
    return (
      <div className="col-md-12">
        <div className="row">
          <div className="col-md-12">
            <div className="pension-detail-header">

            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <PensionTimeline />
          </div>
        </div>
      </div>
    );
  }
}

export default PensionDetail;
