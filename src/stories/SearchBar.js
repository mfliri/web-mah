import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import { Input, Col, Row, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, Modal, ModalBody, ModalHeader, FormGroup, Label } from 'reactstrap';
import style from '../Styles/search';
import autocompleteStyles from '../Styles/autocompleteInput';
import { getSuggestions, getSuggestionValue, renderSectionTitle, renderSuggestion, getSectionSuggestions } from '../Modules/autocompleteData';

/* eslint react/jsx-filename-extension: 0 */

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      suggestions: [],
      dropdownOpen: false,
      modal: false,
      carState: this.props.carState === undefined ? 'Usado' : this.props.carState,
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
  submitSearch() {
    this.props.history.push(`/SearchCars?text=${this.state.value}&carState=${this.state.carState}&page=1`);
  }
  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }

  toggleModal() {
    this.setState({
      modal: !this.state.modal,
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
      <Row className="header" >
        <Col md="6">
          <Row >
            <Col md="3">
              <a href="/"><img style={{ width: '150px' }} src="/logo.png" alt="Logo" /></a>
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
            <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
              <DropdownToggle caret>
                {this.state.carState}
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem value="Nuevo" onClick={e => this.setState({ carState: e.target.value })}>Nuevo</DropdownItem>
                <DropdownItem value="Usado" onClick={e => this.setState({ carState: e.target.value })}>Usado</DropdownItem>
              </DropdownMenu>
            </ButtonDropdown>
            <Button style={{ cursor: 'pointer' }} className="icon is-small" onClick={() => { this.submitSearch(); }}>
              <i className="fa fa-search" aria-hidden="true" />
            </Button>
          </Row>

        </Col>
        <Col md="6" className="flex-row-reverse" >
          <Button color="primary"> Solicitá tu crédito</Button>
          <Button color="secondary"> Ver Consecionarias</Button>
          <strong>Publicá gratis</strong> | <Button color="default" onClick={() => this.toggleModal()} > Iniciá Sesión </Button>
        </Col>
        <Modal isOpen={this.state.modal} toggle={this.toggleModal} className={this.props.className}>
          <ModalHeader toggle={this.toggleModal}>Iniciar sesión</ModalHeader>
          <ModalBody>
            <Button color="primary">Registrate con facebook</Button>
            <div className="underline" />
            <FormGroup>
              <Label for="exampleEmail">Email</Label>
              <Input type="email" name="email" id="exampleText" />
            </FormGroup>
            <FormGroup>
              <Label for="exampleEmail">Contraseña</Label>
              <Input type="password" name="password" id="exampleText" />
            </FormGroup>
            <Button color="link">¿Olvidaste tu contraseña?</Button>
            <Button color="primary">Iniciar sesión</Button>
            <p>No tengo cuenta. Soy un particular.</p><Button color="secondary">Registrarme</Button>
            <p>No tengo cuenta. Soy una concesionaria.</p><Button color="secondary">Registrar Agencia</Button>
          </ModalBody>
          <style jsx>{style}</style>
        </Modal>
      </Row>
    );
  }
}
export default SearchBar;
