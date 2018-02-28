import { Router, Route, browserHistory } from 'react-router';
import AMPDocument from './components/amp-document/amp-document';
import React from 'react';
import ReactDOM from 'react-dom';
import Shell from './components/shell';
import Checkout from "./components/checkout"

/**
 * @see https://github.com/ampproject/amphtml/blob/master/extensions/amp-install-serviceworker/amp-install-serviceworker.md#shell-url-rewrite
 */
function redirectSWFallbackURL(nextState, replace) {
  var hash = typeof window !== 'undefined' && window.location.hash;
  if (hash && hash.indexOf('#href=') === 0) {
    var href = decodeURIComponent(hash.substr(6));
    replace({pathname: href});
  }
}

module.exports = (
  <Route path='/' component={Shell}>
                     <Route path='/checkout' component={
                        props => <Checkout/>
                      } />     
                    <Route path=':page' component={
                        props => <AMPDocument src={`/${props.params.page}/`} />
                      } />  
                    <Route path=':category/:document' component={
                      props => <AMPDocument src={`/${props.params.category}/${props.params.document}`} />
                    } />
  </Route>
)

