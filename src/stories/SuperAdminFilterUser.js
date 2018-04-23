import React, { Component } from 'react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Col, Row, Button } from 'reactstrap';
import { parse, stringify } from 'query-string';
import { graphql, compose } from 'react-apollo';
import { branch, renderComponent } from 'recompose';
import Input from './Input';
import { searchUserMutation } from '../ApolloQueries/SuperAdminUsersQuery';

/* eslint react/jsx-filename-extension: 0 */

class SuperAdminFilterUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tipoUserDropdown: false,
      search: '',
      dropDownTipoUserValue: 'Tipo de Cliente',
    };
    this.toggleTipoUserDropdown = this.toggleTipoUserDropdown.bind(this);
    this.changeTipoUserValue = this.changeTipoUserValue.bind(this);
  }

  searchWithParam(property, value) {
    let searchObj = {};
    const { location, history, location: { pathname } } = this.props;
    searchObj = (parse(location.search));
    searchObj[property] = value;
    history.push(`${pathname}?${stringify(searchObj)}`);
  }

  toggleTipoUserDropdown() {
    this.setState({
      tipoUserDropdown: !this.state.tipoUserDropdown,
    });
  }
  changeTipoUserValue(e) {
    this.searchWithParam('userType', e.currentTarget.textContent);
    this.setState({ dropDownTipoUserValue: e.currentTarget.textContent });
  }

  submitSearch(){
    this.props.searchUser({
      variables: {
        text: this.state.search,
      }
    })
    .then(({data:{searchUser}})=>{
      this.props.searchResults(searchUser)
    })
  }

  render() {
    return (
      <Row className="header-filters align-items-center">
        <Col md="12" sm="12">
          <Row className="align-items-center">
            <div>
              <p>Filtrar por</p>
            </div>
            <div className="col-3">
              <Dropdown size="sm" isOpen={this.state.tipoUserDropdown} toggle={this.toggleTipoUserDropdown}>
                <DropdownToggle caret className="btn-select btn-default">
                  {this.state.dropDownTipoUserValue}
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem header>Elije una</DropdownItem>
                  <DropdownItem onClick={e => this.changeTipoUserValue(e)}>Usuario</DropdownItem>
                  <DropdownItem onClick={e => this.changeTipoUserValue(e)}>Agencia</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>

            <div className="col-8 text-right" style={{ marginBottom: '-1rem' }} >
              <div className="row" >
                <Input
                  type="text"
                  value={this.state.search}
                  placeholder="Buscar..."
                  onChange={event => this.setState({ search: event.target.value })}
                  validate={isValid => this.setState({ emailValidate: isValid })}
                />
                <Button
                  color="primary"
                  style={{ cursor: 'pointer' }}
                  className="icon is-small btn-icon"
                  onClick={() => {
                    this.submitSearch();
                  }}
                >
                  <img src="/assets/images/icon-search.svg" alt="" />
                </Button>
              </div>
            </div>
          </Row>
        </Col>
      </Row>
    );
  }
}
const withSearhMutation = graphql(searchUserMutation, { name: 'searchUser' });


const withData = compose(withSearhMutation)
export default withData(SuperAdminFilterUser);
