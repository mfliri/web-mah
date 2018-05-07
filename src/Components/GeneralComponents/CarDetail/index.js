/* eslint react/jsx-filename-extension: 0 */
/* eslint react/prop-types: 0 */

import React, { Component } from 'react';
import { Col, Row, Button } from 'reactstrap';
import { graphql, compose } from 'react-apollo';
import { branch, renderComponent } from 'recompose';
import { stringify, parse } from 'query-string';
import _ from 'lodash';
import decode from 'jwt-decode';
import { Helmet } from 'react-helmet';

import {
  CarDetailQuery,
  CarSpecs,
  CommentThreadQuery,
} from '../../../ApolloQueries/CarDetailQuery';

import TopTopNav from '../../../stories/TopTopNav';
import SearchBar from '../../../stories/SearchBar';
import Footer from '../../../stories/Footer';
import BreadCrum from '../../../stories/BreadCrum';
import PublicityBanner from '../../../stories/PublicityBanner';
import CarCarousel from '../../../stories/CarCarousel';
import CarSpecifications from '../../../stories/CarSpecifications';
import MessageCarDetail from '../../../stories/MessagesCarDetail';

import _404page from '../../../stories/404page';
import LoadingComponent from '../../../stories/LoadingComponent';

import { thousands } from '../../../Modules/functions';
import photoGaleryParser from '../../../Modules/photoGaleryParser';
import {
  getUserToken,
  getUserDataFromToken,
  isUserLogged,
} from '../../../Modules/sessionFunctions';

const renderForNullPublication = (component, propName = 'data') =>
  branch(
    props => props[propName] && props[propName].Publication === null,
    renderComponent(component),
  );

const renderWhileLoading = (component, propName = 'data', propName2 = 'data') =>
  branch(
    props =>
      props[propName] && props[propName].loading && props[propName2].loading,
    renderComponent(component),
  );

class CarDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
    };
    this.toggle = this.toggle.bind(this);
    this.isPublicationVisible = this.isPublicationVisible.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal,
    });
  }
  isPublicationVisible() {
    const { carDetailData, carSpecsData } = this.props;
    if (!carDetailData.loading && !carSpecsData.loading) {
      if (carDetailData.Publication.CurrentState.stateName === 'Pendiente') {
        return false;
      }
      return true;
    }
    return true;
  }
  showUserPhone(data) {
    if (!data.loading) {
      if (data.User) {
        return data.User.isAgency ? data.User.agencyPhone : data.User.phone;
      }
      return data.phone;
    }
    return '';
  }
  dontShowEditButton() {
    if (
      isUserLogged() &&
      !this.props.carDetailData.loading &&
      this.props.carDetailData.Publication.User &&
      getUserDataFromToken().id === this.props.carDetailData.Publication.User.id
    ) {
      return false;
    }
    return true;
  }
  render() {
    const {
      carDetailData,
      carSpecsData,
      commentThreadData,
      history,
      location,
    } = this.props;
    let hiddenClass = '';
    if (!carDetailData.loading && !carSpecsData.loading) {
      if (carDetailData.Publication.CurrentState.stateName === 'Pendiente') {
        hiddenClass = 'hidden';
      } else {
        hiddenClass = '';
      }
      if (
        carDetailData.Publication.CurrentState.stateName === 'Pendiente' &&
        parse(this.props.location.search).t
      ) {
        const uData = decode(parse(this.props.location.search).t);
        if (uData.userType === 'Admin') {
          hiddenClass = '';
        } else {
          hiddenClass = 'hidden';
        }
      }
    }
    return (
      <div>
        {!carDetailData.loading &&
        <Helmet>
          <meta charSet="utf-8" />
          <title>{`${carDetailData.Publication.brand} - ${carDetailData.Publication.group}` }</title>
          <meta property="fb:app_id" content={146328269397173} />
          <meta property="og:url" content={`https://beta.miautohoy.com/carDetail${location.search}`} />
          <meta property="og:type" content="website" />
          <meta property="og:image" content={`https://beta.miautohoy.com/images/${carDetailData.Publication.ImageGroup.image1}`} />
        </Helmet>
       }
        <TopTopNav history={history} />
        <SearchBar history={history} location={location} />
        <div className="container mb-4 mt-4">
          <Row>
            <Col md="8" sm="12" xs="12">
              <BreadCrum history={history} />
            </Col>
            <Col md="4" sm="12" xs="12">
              <PublicityBanner
                history={history}
                dataPublication={carDetailData.Publication}
              />
            </Col>
          </Row>
        </div>
        {!this.isPublicationVisible() && (
          <Row>
            <div className="col-md-3 hidden-sm-down" />
            <Col md="6" sm="12" xs="12">
              <h3 className="hiddenMessage">
                Esta publicación esta pendiente de aprobación.
              </h3>
            </Col>
            <div className="col-md-3 hidden-sm-down" />
          </Row>
        )}
        <div className={`container ${hiddenClass}`}>
          {carDetailData.Publication === null && (
            <h3>Esta publicación no exite o ha sido eliminada.</h3>
          )}
          {!carDetailData.loading &&
            carDetailData.Publication !== null && (
              <Row>
                <Col md="8" sm="12" xs="12">
                  <CarCarousel
                    photoGalery={photoGaleryParser(carDetailData.Publication.ImageGroup)}
                  />
                  <div className="container-data-input-group">
                    <h5 className="title">Resumen</h5>
                    <Row>
                      <Col md="6" sm="6" xs="12">
                        <div className="data-input-group">
                          <label>ESTADO</label>
                          <p>{carDetailData.Publication.carState}</p>
                        </div>
                      </Col>
                      <Col md="6" sm="6" xs="12">
                        <div className="data-input-group">
                          <label>KM</label>
                          <p>
                            {thousands(
                              carDetailData.Publication.kms,
                              0,
                              ',',
                              '.',
                            )}
                          </p>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="6" sm="6" xs="12">
                        <div className="data-input-group">
                          <label>MARCA</label>
                          <p>{carDetailData.Publication.brand}</p>
                        </div>
                      </Col>
                      <Col md="6" sm="6" xs="12">
                        <div className="data-input-group">
                          <label>AÑO</label>
                          <p>{carDetailData.Publication.year}</p>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="6" sm="6" xs="12">
                        <div className="data-input-group">
                          <label>MODELO</label>
                          <p>{carDetailData.Publication.modelName}</p>
                        </div>
                      </Col>
                      <Col md="6" sm="6" xs="12">
                        <div className="data-input-group">
                          <label>COMBUSTIBLE</label>
                          <p>{carDetailData.Publication.fuel}</p>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  {!carSpecsData.loading &&
                    carSpecsData.Publication.Specifications !== null && (
                      <CarSpecifications
                        data={carSpecsData.Publication.Specifications}
                      />
                    )}
                  <div className="container-data-input-group">
                    <div className="data-input-group">
                      <h5>Comentarios del Vendedor</h5>
                      <p>{carDetailData.Publication.observation}</p>
                    </div>
                  </div>
                </Col>
                <Col md="4" sm="12" xs="12" className="sheet sheet-min">
                  <Row>
                    <Col md="12" sm="6" xs="12">
                      <Row>
                        <div className="col-12 item-data">
                          <small className="item-year">
                            {carDetailData.Publication.year} -
                            {thousands(
                              carDetailData.Publication.kms,
                              0,
                              ',',
                              '.',
                            )}
                            km
                          </small>
                          <p className="item-name">
                            <strong>
                              {`${carDetailData.Publication.brand} ${
                                carDetailData.Publication.group
                              }`}
                            </strong>
                          </p>
                          <p className="item-description">
                            {carDetailData.Publication.modelName}
                          </p>
                          <p className="item-price">
                            <strong>
                              {carDetailData.Publication.price
                                ? `$${thousands(
                                    carDetailData.Publication.price,
                                    2,
                                    ',',
                                    '.',
                                  )}`
                                : 'Consultar'}
                            </strong>
                          </p>
                        </div>
                      </Row>
                      <Button
                        color="primary"
                        onClick={() =>
                          history.push(`/pledgeCredits?${stringify(carDetailData.Publication)}`)
                        }
                      >
                        ¡Solicitá tu crédito!
                      </Button>
                      <div className="container-social">
                        <a
                          // href={`https://www.facebook.com/sharer.php?s=100&p[title]=${carDetailData.Publication.brand - carDetailData.Publication.group}&p[url]=https://beta.miautohoy.com/carDetail${location.search}&p[summary]="Mi auto hoy, cambia la forma de comprar o vender tu auto."&p[images][0]=https://beta.miautohoy.com/images/${carDetailData.Publication.ImageGroup.image1}`}
                          href={`https://www.facebook.com/sharer.php?s=100&p[title]=${carDetailData.Publication.brand}-${carDetailData.Publication.group}&p[url]=https://beta.miautohoy.com/carDetail?publication_id=15&p[summary]="Mi auto hoy, cambia la forma de comprar o vender tu auto."&p[images][0]=http://lvh.me:3000/images/${carDetailData.Publication.ImageGroup.image1}`}
                          className="btn btn-social-icon"
                        >
                          <img
                            src="/assets/images/icon-facebook.svg"
                            alt="icon-fb"
                          />
                        </a>
                        <a
                          href="https://twitter.com/intent/tweet?text=Hello%20world"
                          className="btn btn-social-icon"
                        >
                          <img
                            src="/assets/images/icon-twitter.svg"
                            alt="icon-tw"
                          />
                        </a>
                      </div>
                    </Col>
                    <Col md="12" sm="6" xs="12">
                      <div className="container-data-input-group">
                        <h5>
                          {carDetailData.Publication.User
                            ? carDetailData.Publication.User.agencyName ||
                              carDetailData.Publication.User.name
                            : carDetailData.Publication.name}
                        </h5>
                        {carDetailData.Publication.User ? (
                          carDetailData.Publication.User.agencyName && (
                            <Button onClick={() => this.props.history.push(`/microsite?concesionaria=${carDetailData.Publication.User.agencyName}&c_id=${carDetailData.Publication.User.id}`)} color="link">Ver todos los autos</Button>
                          )
                        ) : (
                          <span />
                        )}
                        <div className="data-input-group">
                          <label>DOMICILIO</label>
                          <p>
                            {carDetailData.Publication.User
                              ? carDetailData.Publication.User.agencyAdress ||
                                carDetailData.Publication.User.address
                              : 'No especificado'}
                          </p>
                        </div>
                        <div className="data-input-group">
                          <label>TELÉFONOS</label>
                          <p>{this.showUserPhone(carDetailData.Publication)}</p>
                        </div>
                        <div className="data-input-group">
                          <label>EMAIL</label>
                          <p>
                            {carDetailData.Publication.User
                              ? carDetailData.Publication.User.agencyEmail ||
                                carDetailData.Publication.User.email ||
                                'No especificado'
                              : carDetailData.Publication.email}
                          </p>
                        </div>
                      </div>
                      {this.dontShowEditButton() ? (
                        <MessageCarDetail
                          commentThread_id={
                            commentThreadData.CommentThread &&
                            !_.isEmpty(commentThreadData.CommentThread)
                              ? commentThreadData.CommentThread[0].id
                              : null
                          }
                          location={location}
                          history={history}
                          publicationUserId={
                            carDetailData.Publication.User
                              ? carDetailData.Publication.User.id
                              : undefined
                          }
                          publicationId={parse(location.search).publication_id}
                        />
                      ) : (
                        <Button color="secondary">Editar Publicación</Button>
                      )}
                    </Col>
                  </Row>
                </Col>
              </Row>
            )}
        </div>
        <Footer history={history} />
      </div>
    );
  }
}
const options = ({ location, commentThreadData }) => ({
  variables: {
    id: parse(location.search).publication_id,
    publication_id: parse(location.search).publication_id,
    MAHtokenP1: getUserToken(),
    chatToken: parse(location.search).chatToken,
    commentThread_id:
      commentThreadData && !commentThreadData.loading
        ? commentThreadData.CommentThread.id
        : null,
  },
});
const withCarDetails = graphql(CarDetailQuery, {
  name: 'carDetailData',
  options,
});

const withSpecs = graphql(CarSpecs, { name: 'carSpecsData', options });
const withCommentThread = graphql(CommentThreadQuery, {
  name: 'commentThreadData',
  options,
});

const withData = compose(
  withSpecs,
  withCarDetails,
  withCommentThread,
  renderForNullPublication(_404page, 'carDetailData'),
  renderWhileLoading(LoadingComponent, 'carDetailData', 'carSpecsData'),
);
const CarDetailwithData = withData(CarDetail);

export default CarDetailwithData;
