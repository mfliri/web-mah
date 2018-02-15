/* eslint react/jsx-filename-extension: 0 */
/* eslint react/prop-types: 0 */

import React from 'react';
import { Col, Row, FormGroup, Input, Label, Button } from 'reactstrap';
import { graphql, compose, withApollo } from 'react-apollo';
import { stringify, parse } from 'query-string';
import _ from 'lodash';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import AdminBar from '../../../stories/AdminBar';

import { AllBrandsQuery, GroupsQuery, ModelsQuery, YearsQuery } from '../../../ApolloQueries/TautosQuery';
import { prepareArraySelect } from '../../../Modules/functions';


class CreatePublication extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      carState: this.props.location.search === '' ? 'Nuevo' : parse(this.props.location.search).carState,
      brand: this.props.location.search === '' ? '' : parse(this.props.location.search).brand,
      group: this.props.location.search === '' ? '' : parse(this.props.location.search).group,
      codia: this.props.location.search === '' ? '' : parse(this.props.location.search).codia,
      year: this.props.location.search === '' ? '' : parse(this.props.location.search).year,
      kms: this.props.location.search === '' ? '' : parse(this.props.location.search).kms,
      price: this.props.location.search === '' ? '' : parse(this.props.location.search).price,
      observation: this.props.location.search === '' ? '' : parse(this.props.location.search).observation,
      Groups: [],
      Models: [],
      Prices: [],
    };
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.location.search !== '') {
      this.props.client.query({
        query: GroupsQuery,
        variables: {
          gru_nmarc: parse(this.props.location.search).brand,
        },
      })
        .then(response => this.setState({ Groups: response.data.Group }));
      this.props.client.query({
        query: ModelsQuery,
        variables: {
          ta3_nmarc: parse(this.props.location.search).brand,
          ta3_cgrup: parse(this.props.location.search).group,
        },
      })
        .then(response => this.setState({ Models: response.data.Models }));
      this.props.client.query({
        query: YearsQuery,
        variables: {
          ta3_codia: parse(this.props.location.search).codia,
        },
      })
        .then(response => this.setState({ Prices: response.data.Price }));
    }
  }

  onChangeBrand(newBrand) {
    this.setState({
      brand: newBrand,
      group: '',
      codia: '',
      Models: [],
      modelName: '',
      Prices: [],
      year: '',
      priceSuggested: '',
    });
    this.props.client.query({
      query: GroupsQuery,
      variables: {
        gru_nmarc: newBrand,
      },
    })
      .then(response => this.setState({ Groups: response.data.Group }));
  }

  onChangeGroup(newGroup) {
    this.setState({
      group: newGroup,
      modelName: '',
      Prices: [],
      year: '',
      priceSuggested: '',
    });
    this.props.client.query({
      query: ModelsQuery,
      variables: {
        ta3_nmarc: this.state.brand,
        ta3_cgrup: newGroup,
      },
    })
      .then(response => this.setState({ Models: response.data.Models }));
  }

  onChangeModel(newModel) {
    this.setState({ codia: newModel, modelName: _.find(this.state.Models, ['ta3_codia', newModel]).ta3_model });
    this.props.client.query({
      query: YearsQuery,
      variables: {
        ta3_codia: newModel,
      },
    })
      .then(response => this.setState({ Prices: response.data.Price }));
  }

  onChangeYear(newYear) {
    this.setState({
      year: newYear,
      priceSuggested: this.state.Prices[this.state.Prices[0].anio - parseInt(newYear, 10)].precio,
    });
  }

  disabled() {
    const {
      brand, group, codia, year, kms, price,
    } = this.state;
    return !(brand !== 0 && group !== 0 && codia !== 0 && year !== 0 && kms !== '' && price !== '');
  }

  next() {
    const dataCar = {
      carState: this.state.carState,
      brand: this.state.brand,
      group: this.state.group,
      codia: this.state.codia,
      modelName: this.state.modelName,
      year: this.state.year,
      kms: this.state.kms,
      price: this.state.price,
      priceSuggested: this.state.priceSuggested,
      observation: this.state.observation,
    };
    this.props.history.push(`/publicateWithoutRegisterS1?${stringify(dataCar)}`);
  }

  render() {
    const {
      ta3AllBrands: { AllBrands },
    } = this.props;
    return (
      <div>
        <AdminBar history={this.props.history} />
        <div className="container-fluid register-steps">
          <Row>
            <Col md="6" sm="12" xs="12" className="bg">
              <div className="col-md-8 float-right">
                <div className="text-block">
                  <h4 className="title-division-primary">Vendé tu auto ya!</h4>
                  <p>En muy simples pasos podés publicar tu auto.</p>
                </div>

                <div className="steps">
                  <div className="step">
                    <h6>PASO 1</h6>
                    <h4>Contanos de tu auto</h4>
                    <a className="link">Modificar datos</a>
                  </div>

                  <div className="step disable">
                    <h6>PASO 2</h6>
                    <h4>Dejá tus datos de contacto para recibir mensajes de los interesados</h4>
                    <a className="link">Modificar datos</a>
                  </div>

                  <div className="step disable">
                    <h6>PASO 3</h6>
                    <h4>Mostralo con fotos</h4>
                    <p className="info">* Mínimo 3 fotos</p>
                  </div>
                </div>
              </div>
            </Col>

            <Col md="6" sm="12" xs="12" className="mb-4">
              <div className="col-md-9 float-left">
                <h4 className="title-division">Describe tu auto</h4>
                <FormGroup>
                  <Label for="exampleSelect">¿Qué tipo de auto quieres vender?</Label>
                  <Select
                    id="carState-select"
                    ref={(ref) => { this.select = ref; }}
                    onBlurResetsInput={false}
                    autoFocus
                    clearable={false}
                    onSelectResetsInput={false}
                    options={[{ value: 'Nuevo', label: 'Nuevo' }, { value: 'Usado', label: 'Usado' }]}
                    simpleValue
                    name="selected-state"
                    value={this.state.carState}
                    onChange={newValue => this.setState({ carState: newValue })}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="exampleSelect">¿Cuál es la marca?</Label>
                  <Select
                    id="brand-select"
                    ref={(ref) => { this.select = ref; }}
                    onBlurResetsInput={false}
                    onSelectResetsInput={false}
                    options={prepareArraySelect(AllBrands, 'ta3_nmarc', 'ta3_marca')}
                    simpleValue
                    clearable
                    name="selected-state"
                    value={this.state.brand}
                    placeholder="Selecciona una marca"
                    onChange={newValue => this.onChangeBrand(newValue)}
                    searchable
                    noResultsText="No se encontraron resultados"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="exampleSelect">¿Cuál es el grupo?</Label>
                  <Select
                    id="groups-select"
                    ref={(ref) => { this.select = ref; }}
                    onBlurResetsInput={false}
                    onSelectResetsInput={false}
                    options={prepareArraySelect(this.state.Groups, 'gru_cgrup', 'gru_ngrup')}
                    simpleValue
                    clearable
                    name="selected-state"
                    value={this.state.group}
                    placeholder="Selecciona un grupo"
                    onChange={newValue => this.onChangeGroup(newValue)}
                    searchable
                    noResultsText="No se encontraron resultados"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="exampleSelect">¿Cuál es el modelo?</Label>
                  <Select
                    id="models-select"
                    ref={(ref) => { this.select = ref; }}
                    onBlurResetsInput={false}
                    onSelectResetsInput={false}
                    options={prepareArraySelect(this.state.Models, 'ta3_codia', 'ta3_model')}
                    simpleValue
                    clearable
                    name="selected-state"
                    value={this.state.codia}
                    placeholder="Selecciona un modelo"
                    onChange={newValue => this.onChangeModel(newValue)}
                    searchable
                    noResultsText="No se encontraron resultados"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="exampleSelect">¿Cuál es el año?</Label>
                  <Select
                    id="year-select"
                    ref={(ref) => { this.select = ref; }}
                    onBlurResetsInput={false}
                    onSelectResetsInput={false}
                    options={prepareArraySelect(_.filter(this.state.Prices, o => o.precio !== 0), 'anio', 'anio')}
                    simpleValue
                    clearable
                    name="selected-state"
                    value={this.state.year}
                    placeholder="Selecciona un año"
                    onChange={newValue => this.onChangeYear(newValue)}
                    searchable
                    noResultsText="No se encontraron resultados"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="exampleEmail">¿Cuántos kilometros tiene?</Label>
                  <Input type="numeric" value={this.state.kms} onChange={event => this.setState({ kms: event.target.value })} placeholder="Ingrese un número sin puntos ni comas" />
                </FormGroup>
                <FormGroup>
                  <Label for="exampleEmail">¿A qué precio lo querés vender?</Label>
                  <Input type="numeric" value={this.state.price} onChange={event => this.setState({ price: event.target.value })} placeholder="Ingrese un número sin puntos ni comas" />
                  {this.state.priceSuggested && <p>Precio Sugerido: <b>$ {this.state.priceSuggested}</b></p>}
                </FormGroup>
                <FormGroup>
                  <Label for="exampleText">Observaciones</Label>
                  <Input type="textarea" value={this.state.observation} onChange={event => this.setState({ observation: event.target.value })} />
                </FormGroup>

                <div className="underline" />
                <Button color="primary" className="float-right" disabled={this.disabled()} onClick={() => this.next()} >Siguiente</Button>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

const WithAllBrands = graphql(AllBrandsQuery, {
  name: 'ta3AllBrands',
});


const withData = compose(WithAllBrands);

export default withApollo(withData(CreatePublication));