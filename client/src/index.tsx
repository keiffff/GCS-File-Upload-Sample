import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ApolloClient } from 'apollo-client';
import { createUploadLink } from 'apollo-upload-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from '@apollo/react-hooks';
import { App } from './App';

const uploadLink = createUploadLink({
  uri: 'http://localhost:4000',
  headers: {
    'keep-alive': 'true',
  },
});

const client = new ApolloClient({ link: uploadLink, cache: new InMemoryCache() });

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root'),
);
