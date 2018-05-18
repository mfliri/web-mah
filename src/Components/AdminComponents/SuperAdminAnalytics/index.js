/* eslint react/jsx-filename-extension: 0 */
/* eslint react/prop-types: 0 */

import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';
import { GoogleProvider, GoogleDataChart } from 'react-analytics-widget'
import AdminBar from '../../../stories/AdminBar';
import SuperAdminSideBar from '../../../stories/SuperAdminSideBar';
import { getUserToken } from '../../../Modules/sessionFunctions';

;(function(w, d, s, g, js, fjs) {
  g = w.gapi || (w.gapi = {})
  g.analytics = {
    q: [],
    ready: function(cb) {
      this.q.push(cb)
    }
  }

  js = d.createElement(s)
  fjs = d.getElementsByTagName(s)[0]
  js.src = "https://apis.google.com/js/platform.js"
  fjs.parentNode.insertBefore(js, fjs)
  js.onload = function() {
    g.load("analytics")
  }
})(window, document, "script")

const last30days = {
  reportType: "ga",
  query: {
    dimensions: "ga:date",
    metrics: "ga:pageviews",
    "start-date": "30daysAgo",
    "end-date": "yesterday"
  },
  chart: {
    type: "LINE",
    options: {
      // options for google charts
      // https://google-developers.appspot.com/chart/interactive/docs/gallery
      title: "Last 30 days pageviews"
    }
  }
}
const last7days = {
  reportType: "ga",
  query: {
    dimensions: "ga:date",
    metrics: "ga:pageviews",
    "start-date": "7daysAgo",
    "end-date": "yesterday"
  },
  chart: {
    type: "LINE"
  }
}
const paises = {
  reportType: "ga",
  query: {
    metrics: 'ga:sessions',
    dimensions: 'ga:country',
    'start-date': '30daysAgo',
    'end-date': 'yesterday',
    'max-results': 6,
    sort: '-ga:sessions'
  },
  chart: {
    container: 'chart-1-container',
    type: 'PIE',
    options: {
      width: '100%',
      pieHole: 4/9
    }
  }
}
const otros ={
  reportType: 'ga',
  query: {
    'dimensions': 'ga:browser',
    'metrics': 'ga:sessions',
    'sort': '-ga:sessions',
    'max-results': '6'
  },
  chart: {
    type: 'TABLE',
    container: 'main-chart-container',
    options: {
      width: '100%'
    }
  }
}

// analytics views ID
const views = {
  query: {
    ids: "ga:146770504"
  }
}


export default class SuperAdminAnalytics extends Component{
  constructor(props){
    super(props);
    this.state={
      token:''
    }
  }
  componentDidMount = () => {
    const request = new Request(`${process.env.REACT_APP_API}/gettoken`, {
      method: 'GET',
      headers: {'Authorization': `Bearer ${getUserToken()}`}
    });
    fetch(request)
      .then(response => response.json())
      .then(({ message }) => {
        this.setState({ token: message[0] }); // TODO: handle errors
      });
  }
  render(){
    const { location, history } = this.props
    return (
      <div>
      <AdminBar history={history} />
      <div className="container-fluid">
        <Row>
          <Col lg="3" md="12" >
            <SuperAdminSideBar history={history} location={location} />
          </Col>
          <Col lg="9" md="12" >
          <GoogleProvider accessToken={this.state.token}>
            <GoogleDataChart views={views} config={otros} />
            <GoogleDataChart views={views} config={paises} />
            <GoogleDataChart views={views} config={last30days} />
            <GoogleDataChart views={views} config={last7days} />
          </GoogleProvider>
          </Col>
        </Row>
      </div>
    </div>
    )
  }
} 