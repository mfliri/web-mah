/* eslint react/jsx-filename-extension: 0 */
/* eslint react/prop-types: 0 */
/* eslint class-methods-use-this: 0 */

import React, { Component } from 'react';
import { Col, Row, Button, Input, FormGroup } from 'reactstrap';
import { parse } from 'query-string';
import { graphql, compose } from 'react-apollo';
import { ChatFeed, Message } from 'react-chat-ui';
import jwtDecode from 'jwt-decode';
import moment from 'moment';
import AdminBar from '../../../stories/AdminBar';

import { CommentThreadQuery, markThreadAsReaded } from '../../../ApolloQueries/InboxQuery';
import { MessageQuery, MessageSubscription, addMessageMutation } from '../../../ApolloQueries/MessagesCarDetailQuery';

import style from '../../../Styles/pledgeCredits';
import { getUserToken, getUserDataFromToken } from '../../../Modules/sessionFunctions';
import { thousands } from '../../../Modules/functions';

class Inbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
    };
  }
  componentWillMount() {
    this.props.subscribeToNewMessages({
      commentThread_id: parse(this.props.location.search).ct_id,
    });
    this.props.markAsRead({
      variables: {
        commentThread_id: parse(this.props.location.search).ct_id,
      },
    });
  }
  fillStateWithMessages(ThreadsQuery, messagesData, publicationUserId) {
    // En caso de ser un mensaje de un usuario anónimo
    if (!ThreadsQuery.loading) {
      const anonymName = ThreadsQuery.GetThreadForInbox.chatToken
        ? jwtDecode(ThreadsQuery.GetThreadForInbox.chatToken).email
        : null;
      const messages = [];
      messagesData.Messages.map((message) => {
        messages.push(new Message({
          id: publicationUserId === message.from_id ? 0 : message.from_id,
          message: message.content,
          senderName: message.User ? `${message.User.name}--${moment(message.createdAt).format('DD/MM/YYYY HH:mm')}` : `${anonymName}--${moment(message.createdAt).format('DD/MM/YYYY HH:mm')} `,
        }));
      });
      return messages;
    }
    return [
      new Message({
        id: 0,
        message: 'Cargando mensajes...',
      }),
    ];
  }
  sendMessage() {
    const { content } = this.state;
    if (parse(this.props.location.search).ct_id) {
      this.props.mutate({
        variables: {
          commentThread_id: parse(this.props.location.search).ct_id,
          from_id: getUserDataFromToken().id,
          content,
          read: moment(),
        },
      });
      this.setState({ content: '' });
      return true;
    }
  }
  render() {
    const { ThreadsQuery, messagesData, history } = this.props;
    const publicationUserId = getUserDataFromToken().id;
    return (
      <div>
        <AdminBar history={this.props.history} />
        <Row>
          <Col md="6">
            <Button type="secondary" onClick={() => history.goBack()} >{'< Volver a Bandeja de Entrada'}</Button>
            {(ThreadsQuery.loading || messagesData.loading) ?
              <img
                className="loading-gif"
                style={{ height: '250px' }}
                src="/loading.gif"
                key={0}
                alt="Loading..."
              /> :
              <div className="d-flex flex-row">
                <img src={`${process.env.REACT_APP_API}/images/${ThreadsQuery.GetThreadForInbox.Publication.ImageGroup.image1}`} alt="banner" />
                <div className="d-flex flex-column">
                  <h6>{ThreadsQuery.GetThreadForInbox.Publication.brand} {ThreadsQuery.GetThreadForInbox.Publication.group}</h6>
                  <h6>{ThreadsQuery.GetThreadForInbox.Publication.modelName}</h6>
                  <h6>$ {thousands(ThreadsQuery.GetThreadForInbox.Publication.price, 2, ',', '.')}</h6>
                  <h6>{ThreadsQuery.GetThreadForInbox.Publication.year} - {thousands(ThreadsQuery.GetThreadForInbox.Publication.kms, 0, ',', '.')}</h6>
                </div>
              </div>}
          </Col>
          <Col md="6" >
            <ChatFeed
              maxHeight={500}
              messages={this.fillStateWithMessages(
              ThreadsQuery,
              messagesData,
              publicationUserId,
)
            } // Boolean: list of message objects
              hasInputField={false} // Boolean: use our input, or use your own
              showSenderName // show the name of the user who sent the message
              bubblesCentered // Boolean should the bubbles be centered in the feed?

            />
            <FormGroup>
              <Input type="textarea" value={this.state.content} onChange={e => this.setState({ content: e.target.value })} name="text" id="exampleText" />
            </FormGroup>
            <Button color="primary" onClick={() => this.sendMessage()}>Responder</Button>
          </Col>
        </Row>
        <style jsx>{style}</style>
      </div>
    );
  }
}

const options = ({ location }) => ({
  variables: {
    MAHtoken: getUserToken(),
    id: parse(location.search).ct_id,
    commentThread_id: parse(location.search).ct_id, // requerida por MessageQuery
  },
});
const withThreadData = graphql(CommentThreadQuery, { name: 'ThreadsQuery', options });
const withMessages = graphql(MessageQuery, {
  name: 'messagesData',
  options,
});
const withMessageMutation = graphql(addMessageMutation);
const withMarkThreadAsReadedMutation = graphql(markThreadAsReaded, { name: 'markAsRead' });
const withMessagesSubscription = graphql(MessageQuery, {
  name: 'messagesSubscriptions',
  options,
  props: props => ({
    subscribeToNewMessages: params =>
      props.messagesSubscriptions.subscribeToMore({
        document: MessageSubscription,
        variables: {
          commentThread_id: params.commentThread_id,
        },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) {
            return prev;
          }
          const newFeedItem = subscriptionData.data.messageAdded;
          return Object.assign({}, prev, {
            Messages: [...prev.Messages, newFeedItem],
          });
        },
      }),
  }),
});


const withData = compose(withThreadData, withMessages, withMarkThreadAsReadedMutation, withMessagesSubscription, withMessageMutation);

export default withData(Inbox);