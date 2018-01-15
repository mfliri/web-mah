import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const HomeQuery = graphql(gql`
{AllPublications(stateName:"Activas", limit: 12){
  CurrentState{
    stateName
  }
    ImageGroup{
      image1
      image2
      image3
    }
    id
    group
    modelName
    price
    fuel
    year
    carState
    kms  
  }}
`);
export default HomeQuery;
