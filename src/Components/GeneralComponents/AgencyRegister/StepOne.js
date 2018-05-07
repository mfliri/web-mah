/* eslint react/jsx-filename-extension: 0 */
/* eslint react/prop-types: 0 */

import React from 'react';
import { Col, Row, Button } from 'reactstrap';
import { stringify, parse } from 'query-string';
import ReactGA from 'react-ga';

import RegisterBar from '../../../stories/RegisterBar';
import Input from '../../../stories/Input';

ReactGA.initialize(process.env.REACT_APP_ANALYTICS);

class StepOne extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: parse(this.props.location.search).email ? parse(this.props.location.search).email : '',
      emailValidate: parse(this.props.location.search).email,
      repeatPass: parse(this.props.location.search).repeatPass ? parse(this.props.location.search).repeatPass : '',
      repeatPassValidate: parse(this.props.location.search).repeatPass,
      name: parse(this.props.location.search).name ? parse(this.props.location.search).name : '',
      nameValidate: parse(this.props.location.search).name,
      address: parse(this.props.location.search).address ? parse(this.props.location.search).name : '',
      addressValidate: parse(this.props.location.search).address,
      phone: parse(this.props.location.search).phone ? parse(this.props.location.search).phone : '',
      phoneValidate: parse(this.props.location.search).phone,
    };
    ReactGA.pageview('/REGISTRO-AGENCIA');
  }

  next() {
    if (!(this.state.emailValidate && this.state.addressValidate && this.state.phoneValidate && this.state.nameValidate)) {
      this._inputName.validate('string');
      this._inputEmail.validate('email');
      this._inputAddress.validate('string');
      this._inputPhone.validate('number');
      return false;
    }

    const dataAgency = {
      email: this.state.email,
      repeatPass: this.state.repeatPass,
      name: this.state.name,
      address: this.state.address,
      phone: this.state.phone,
      nameAgency: parse(this.props.location.search).nameAgency ? parse(this.props.location.search).nameAgency : '',
    };
    return this.props.history.push(`/agencyRegisterS2?${stringify(dataAgency)}`);
  }

  render() {
    return (
      <div>
        <RegisterBar onlyLogin history={this.props.history} />
        <div className="container-fluid register-steps">
          <Row>
            <Col md="6" sm="12" xs="12" className="bg">
              <div className="col-md-9 float-right">
                <div className="text-block">
                  <h4 className="title-division-primary">Creá tu cuenta como Concesionario!</h4>
                  <p>Registrate en muy pocos pasos</p>
                </div>

                <div className="steps">
                  <div className="step">
                    <h6>PASO 1</h6>
                    <h4>Crear tu cuenta</h4>
                    <a className="link">Modificar datos</a>
                  </div>

                  <div className="step disable">
                    <h6>PASO 2</h6>
                    <h4>Contanos sobre tu Concesionario</h4>
                    <a className="link">Modificar datos</a>
                  </div>

                  <div className="step disable">
                    <h6>PASO 3</h6>
                    <h4>Información del responsable de la Concesionario</h4>
                    <a className="link">Modificar datos</a>
                  </div>

                </div>
                <div className="text-block">
                  <p>Tengo cuenta. <a href="/login" className="link">Iniciar sesión</a> <br />
                  Soy un Particular. <a href="/userRegister" className="link">Registrarme</a>
                  </p>
                </div>
              </div>
            </Col>
            <Col md="6" sm="12" xs="12">
              <div className="col-md-9 float-left pb-4">
                <h4 className="title-division">Registrarme</h4>
                <Input
                  ref={inputEmail => (this._inputEmail = inputEmail)}
                  label="Email (Email para iniciar sesión)"
                  type="email"
                  value={this.state.email}
                  onChange={event => this.setState({ email: event.target.value })}
                  validate={isValid => this.setState({ emailValidate: isValid })}
                />
                <Input
                  ref={inputName => (this._inputName = inputName)}
                  label="Nombre del Encargado"
                  type="text"
                  value={this.state.name}
                  onChange={event => this.setState({ name: event.target.value })}
                  validate={isValid => this.setState({ nameValidate: isValid })}
                />
                <Input
                  ref={inputAddress => (this._inputAddress = inputAddress)}
                  label="Domicilio del Encargado"
                  type="string"
                  value={this.state.address}
                  onChange={event => this.setState({ address: event.target.value })}
                  validate={isValid => this.setState({ addressValidate: isValid })}
                />
                <Input
                  ref={inputPhone => (this._inputPhone = inputPhone)}
                  label="Teléfono del Encargado"
                  type="number"
                  value={this.state.phone}
                  onChange={event => this.setState({ phone: event.target.value })}
                  validate={isValid => this.setState({ phoneValidate: isValid })}
                />

                <div>
                  <div className="underline" />
                  <Button color="primary" className="float-right" onClick={() => this.next()} >Siguiente</Button>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default StepOne;
