import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import {
  Input,
  Col,
  Row,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  FormGroup,
  Label,
} from 'reactstrap';
import style from '../Styles/search';
import autocompleteStyles from '../Styles/autocompleteInput';
import {
  getSuggestions,
  getSuggestionValue,
  renderSectionTitle,
  renderSuggestion,
  getSectionSuggestions,
} from '../Modules/autocompleteData';
import {
  isUserLogged,
  getUserDataFromToken,
  clearSession,
} from '../Modules/sessionFunctions';
import NotificationModal from '../stories/NotificationModal';
import parseError from '../Modules/errorParser';
import { login } from '../Modules/fetches';
import { saveState } from '../Modules/localStorage';
import errorParser from '../Modules/errorParser';

/* eslint react/jsx-filename-extension: 0 */

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.togglePublicate = this.togglePublicate.bind(this);
    this.toggleUser = this.toggleUser.bind(this);
    this.state = {
      suggestions: [],
      dropdownOpen: false,
      dropdownUser: false,
      dropdownOpenPublicate: false,
      modal: false,
      email: '',
      password: '',
      showErrorModal: false,
      errorTitle: '',
      errorMessage: '',
      isUserLogged: isUserLogged(),
      carState:
        this.props.carState === undefined ? 'Usado' : this.props.carState,
      value: this.props.text === undefined ? '' : this.props.text,
    };
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    this.onChange = this.onChange.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  onChange(event, { newValue, method }) {
    this.setState({
      value: newValue,
    });
  }
  onSuggestionsFetchRequested({ value }) {
    this.setState({
      suggestions: getSuggestions(value),
    });
  }
  onSuggestionsClearRequested() {
    this.setState({
      suggestions: [],
    });
  }
  isLoginFormIncomplete() {
    if (this.state.email === '' || this.state.password === '') {
      return true;
    }
    return false;
  }
  submitSearch() {
    this.props.history.push(`/SearchCars?text=${this.state.value}&carState=${
      this.state.carState
    }&page=1`);
  }
  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }
  togglePublicate() {
    this.setState({
      dropdownOpenPublicate: !this.state.dropdownOpenPublicate,
    });
  }
  toggleUser() {
    this.setState({
      dropdownUser: !this.state.dropdownUser,
    });
  }

  toggleModal() {
    this.setState({
      modal: !this.state.modal,
    });
  }
  loginUser(email, password) {
    login(email, password)
      .then((response) => {
        const MAHtoken = response.message;
        saveState({ login: { MAHtoken } });
        this.toggleModal();
        this.setState({
          email: '',
          password: '',
          isUserLogged: true,
        });
      })
      .catch((error) => {
        const errorParsed = parseError(error);
        this.setState({
          email: '',
          password: '',
          errorTitle: errorParsed.title,
          errorMessage: errorParsed.message,
          showErrorModal: true,
        });
      });
  }

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: 'Busca tu auto',
      value,
      onChange: this.onChange,
    };
    return (
      <Row className="header">
        <Col md="6">
          <Row>
            <Col md="3">
              <Button onClick={() => this.props.history.push('/')} >
                <img style={{ width: '150px' }} src="/logo.png" alt="Logo" />
              </Button>
            </Col>
            <Col md="5">
              {/* <Input type="text" id="search" value={this.state.text} onChange={(e) => { this.setState({ text: e.target.value }); }} /> */}
              <Autosuggest
                multiSection
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                renderSectionTitle={renderSectionTitle}
                getSectionSuggestions={getSectionSuggestions}
                inputProps={inputProps}
              />
              <style jsx>{autocompleteStyles}</style>
            </Col>
            <ButtonDropdown
              isOpen={this.state.dropdownOpen}
              toggle={this.toggle}
            >
              <DropdownToggle caret>{this.state.carState}</DropdownToggle>
              <DropdownMenu>
                <DropdownItem
                  value="Nuevo"
                  onClick={e => this.setState({ carState: e.target.value })}
                >
                  Nuevo
                </DropdownItem>
                <DropdownItem
                  value="Usado"
                  onClick={e => this.setState({ carState: e.target.value })}
                >
                  Usado
                </DropdownItem>
              </DropdownMenu>
            </ButtonDropdown>
            <Button
              style={{ cursor: 'pointer' }}
              className="icon is-small"
              onClick={() => {
                this.submitSearch();
              }}
            >
              <i className="fa fa-search" aria-hidden="true" />
            </Button>
          </Row>
        </Col>
        <Col md="6" className="flex-row-reverse">
          <Button color="primary" href="/pledgeCredits" > Solicitá tu crédito</Button>
          <Button color="secondary" href="/friendlyAgency" > Ver Consecionarias</Button>
          {this.state.isUserLogged ? (
            <ButtonDropdown
              isOpen={this.state.dropdownUser}
              toggle={this.toggleUser}
            >
              <DropdownToggle caret>{getUserDataFromToken().name}</DropdownToggle>
              <DropdownMenu>
                <DropdownItem
                  value="myAccount"
                  onClick={() => (getUserDataFromToken().userType === 'Agencia' ?
                    this.props.history.push('/agencyAdmin') : this.props.history.push('/userAdmin'))}
                >Mi cuenta
                </DropdownItem>
                <DropdownItem value="closeSession" onClick={() => { clearSession(); this.setState({ isUserLogged: false }); }}>Cerrar Sesión</DropdownItem>
              </DropdownMenu>
            </ButtonDropdown>
          ) : (
            <span>
              <ButtonDropdown
                isOpen={this.state.dropdownOpenPublicate}
                toggle={this.togglePublicate}
              >
                <DropdownToggle caret>Publicá Gratis</DropdownToggle>
                <DropdownMenu>
                  <DropdownItem value="publicateFree" href="/withoutRegister">
                    <h4>¡Publica ya!</h4>
                    <h6>1 Publicación Gratis</h6>
                  </DropdownItem>
                  <DropdownItem value="particular" href="/userRegister">
                    <h4>Soy Particular. Registrate, es muy fácil</h4>
                    <h6>Publicaciones gratis ilimitadas</h6>
                  </DropdownItem>
                  <DropdownItem value="agency" href="/agencyRegister">
                    <h4>Soy un Concesionario. Registrate y vende más</h4>
                    <h6>Publicaciones gratis ilimitadas</h6>
                  </DropdownItem>
                  <DropdownItem value="particular" onClick={() => this.toggleModal()}>
                    <h4>Ya tengo cuenta</h4>
                  </DropdownItem>
                </DropdownMenu>
              </ButtonDropdown>
              <Button color="default" onClick={() => this.toggleModal()}>
                Iniciá Sesión
              </Button>
            </span>
          )}
        </Col>
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggleModal}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggleModal}>Iniciar sesión</ModalHeader>
          <ModalBody>
            <Button color="primary">Registrate con facebook</Button>
            <div className="underline" />
            <FormGroup>
              <Label for="exampleEmail">Email</Label>
              <Input
                type="email"
                name="email"
                value={this.state.email}
                onChange={e => this.setState({ email: e.target.value })}
              />
            </FormGroup>
            <FormGroup>
              <Label for="exampleEmail">Contraseña</Label>
              <Input
                type="password"
                name="password"
                value={this.state.password}
                onChange={e => this.setState({ password: e.target.value })}
              />
            </FormGroup>
            <Button color="link">¿Olvidaste tu contraseña?</Button>
            <Button
              disabled={this.isLoginFormIncomplete()}
              onClick={() => this.loginUser(this.state.email, this.state.password)}
              color="primary"
            >
              Iniciar sesión
            </Button>
            <p>No tengo cuenta. Soy un particular.</p>
            <Button color="secondary">Registrarme</Button>
            <p>No tengo cuenta. Soy una concesionaria.</p>
            <Button color="secondary">Registrar Agencia</Button>
          </ModalBody>
          <style jsx>{style}</style>
        </Modal>
        <NotificationModal
          primaryText={this.state.errorTitle}
          secondaryText={this.state.errorMessage}
          buttonName="Aceptar"
          showNotificationModal={this.state.showErrorModal}
          handleClose={() => this.setState({ showErrorModal: false })}
        />
      </Row>
    );
  }
}
export default SearchBar;
