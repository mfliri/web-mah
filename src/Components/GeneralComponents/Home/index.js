/* eslint react/jsx-filename-extension: 0 */
/* eslint react/prop-types: 0 */

import React from 'react';
import _ from 'lodash';
import { graphql, compose } from 'react-apollo';
import { branch, renderComponent } from 'recompose';

import {
  HomeQuery,
  LastPublicationsQuery,
} from '../../../ApolloQueries/HomeQuery';
import CarHomeContainer from '../../../stories/CarHomeContainer';
import TopTopNav from '../../../stories/TopTopNav';
import SearchBar from '../../../stories/SearchBar';
import CarResult from '../../../stories/CarResult';
import Banner from '../../../stories/Banner';
import CreditsBanner from '../../../stories/CreditsBanner';
import LastPublications from '../../../stories/LastPublications';
import FriendlyCompanies from '../../../stories/FriendlyCompanies';
import Footer from '../../../stories/Footer';
import LoadingComponent from '../../../stories/LoadingComponent';

import photoGaleryParser from '../../../Modules/photoGaleryParser';

const script = document.createElement('script');

script.src = '//code.tidio.co/2adtbpujxsburoaa4sm7umttnp1j1wjr.js';
script.async = true;

document.body.appendChild(script);
const renderWhileLoading = (component, propName = 'data') =>
  branch(
    props => props[propName] && props[propName].loading,
    renderComponent(component),
  );
const Home = ({
  data, history, location, lastPubs,
}) => (
  <div>
    {!data.loading && (
      <div>
        <TopTopNav history={history} />
        <SearchBar history={history} location={location} />
        <Banner />
        <CreditsBanner history={history} />
        <CarHomeContainer>
          {data.AllPublications.map(row => (
            <CarResult
              photoGalery={photoGaleryParser(row.ImageGroup)}
              data={row}
            />
          ))}
        </CarHomeContainer>
        <LastPublications>
          {!lastPubs.loading ?
            lastPubs.LastPublications.map(row => (
              <CarResult
                photoGalery={photoGaleryParser(row.ImageGroup)}
                data={row}
              />
            ))
            :
            []
          }
        </LastPublications>
        <FriendlyCompanies>
          <a href="http://www.mendoza.gov.ar/prevencionvial/"><img src="/assets/images/EA1.jpg" alt="prevencion" /></a>
          <a href="http://www.pueblobenegas.com/"><img src="/assets/images/EA2.jpg" alt="benegas" /></a>
          <a href="http://miautohoy.com/concesionaria/lm-automotores/"><img src="/assets/images/EA3.jpg" alt="lm-automotores" /></a>
          <a href="http://www.mktinversiones.com.ar/"><img src="/assets/images/EA4.jpg" alt="mkt" /></a>
        </FriendlyCompanies>
        <Footer history={history} />
      </div>
    )}
  </div>
);
const options = {
  variables: {
    limit: 12,
    stateName: 'Activas',
  },
};
const withHomeQuery = graphql(HomeQuery, { options });
const withLastPublicationsQuery = graphql(LastPublicationsQuery, {
  name: 'lastPubs',
});
const withData = compose(
  withLastPublicationsQuery,
  withHomeQuery,
  renderWhileLoading(LoadingComponent, 'data'),
);

export default withData(Home);
