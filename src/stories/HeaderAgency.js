import React from 'react';
import { Row, Col } from 'reactstrap';
/* eslint react/jsx-filename-extension: 0 */

export default ({ data }) => (
  <div className="col-md-12 microsite-header" >
    <Row className="microsite-portrait">
      <img src={`${process.env.REACT_APP_API}/images/${data.bannerImage}`} alt="banner" width="100%" />
    </Row>
    <div className="container">
      <Row className="microsite-data">
        <Col lg="3" md="6" sm="6" xs="6" className="microsite-data-avatar">
          <img src={`${process.env.REACT_APP_API}/images/${data.profileImage}`} alt="ProfilePic" width="100%" />
        </Col>
        <div className="col-lg-9 col-md-12 col-sm-12 col-xs-12 container-data-input-group" >
          <h3><strong>{data.agencyName}</strong></h3>
          <Row>
            <Col md="4" sm="12" xs="12">
              <div className="data-input-group">
                <label>DOMICILIO</label>
                <p>{data.agencyAdress}</p>
              </div>
            </Col>
            <Col md="4" sm="12" xs="12">
              <div className="data-input-group">
                <label>TELÉFONO</label>
                <p>{data.agencyPhone} / {data.phone}</p>
              </div>
            </Col>
            <Col md="4" sm="12" xs="12">
              <div className="data-input-group">
                <label>EMAIL</label>
                <p>{data.agencyEmail}</p>
              </div>
            </Col>
          </Row>
        </div>
      </Row>
    </div>
  </div>
);

