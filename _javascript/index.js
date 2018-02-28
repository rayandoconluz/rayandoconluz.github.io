import Raven from 'raven-js';
import React from 'react';
import ReactDOM from 'react-dom';
import routes from './routes';
import { Router, browserHistory } from 'react-router';

Raven
.config('https://55b714e61c0847f8ac639fa047c77fa9@sentry.io/214818')
    .install();
    Raven.context(function () {
        ReactDOM.render(<Router routes={routes} onUpdate={() => window.scrollTo(0, 0)} history={browserHistory}>
        </Router>, document.getElementById('root'));
    });

window.addEventListener('beforeinstallprompt', function(e) {
    // beforeinstallprompt Event fired
    // e.userChoice will return a Promise. 
    // For more details read: https://developers.google.com/web/fundamentals/getting-started/primers/promises
    e.userChoice.then(function(choiceResult) {   
        console.log(choiceResult.outcome);
        if(choiceResult.outcome == 'dismissed') {
            console.log('User cancelled home screen install');
            ga('send', 'event', 'Banner', 'dismissedHome')    
        }
        else {
            ga('send', 'event', 'Banner', 'addtoHome')
            console.log('User added to home screen');
        }
    });
});

