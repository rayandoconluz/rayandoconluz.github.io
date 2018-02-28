import React from 'react';
import { withRouter } from 'react-router'
import ToggleButton from 'react-toggle-button'
import {askPermission, subscribeUserToPush,registerTokenOnServer} from '../../messaging'



/**
 * Fetches the AMP document at a given `src` URL and renders it via Shadow DOM.
 */
class AMPDocument extends React.Component {
  constructor(props) {
    super(props);
    this.isNotificationSupported = (('PushManager' in window) && ('serviceWorker' in navigator))
    this.state = { 'offline': false,
                   'loading': false
    };
    // 'offline' is set to true if and when the document fetch fails.
    if (this.isNotificationSupported) { 
      if (Notification.permission === 'granted') {
        this.state.notify = true
      }
      else { 
        this.state.notify = false
      }
    }
 
    /**
     * `window.AMP` is set by the AMP runtime when it finishes loading.
     * @const
     * @private
     */
    this.ampReadyPromise_ = new Promise(resolve => {
      (window.AMP = window.AMP || []).push(resolve);
    });
    /**
     * Child element that will wrap the AMP shadow root.
     * @private
     * @type {Element}
     */
    this.container_ = null;

    /**
     * XMLHTTPRequest that fetches the AMP document.
     * @private
     * @type {XMLHTTPRequest}
     */
    this.xhr_ = null;

    /**
     * Provides AMP functionality on the newly created shadow root after
     * an AMP document is attached.
     * @private
     * @type {Object}
     */
    this.shadowAmp_ = null;

    /**
     * The root node of the shadow AMP.
     * @note A single node must not be reused for multiple shadow AMP docs.
     * @type {Element}
     */
    this.shadowRoot_ = null;

    /** @private */
    this.boundClickListener_ = this.clickListener_.bind(this);
  }

  componentDidMount() {
    this.container_.addEventListener('click', this.boundClickListener_);

    this.fetchAndAttachAmpDoc_(this.props.src);
  }

  componentWillUnmount() {
    if (!this.AmpDocClosed){ 
      this.closeShadowAmpDoc_();
    }
    this.container_.removeEventListener('click', this.boundClickListener_);
    if (this.xhr_) {
      this.xhr_.abort();
      this.xhr_ = null;
    }
  }

  componentWillReceiveProps(nextProps) {
    this.AmpDocClosed = false;
    this.fetchAndAttachAmpDoc_(nextProps.src);
  }

  render() {
    var Subscribe = (<div className="fixed">
                      <div className="subscribe">
                      🔔 recibe notificaciones cuando publiquemos rutas
                      <ToggleButton
                        inactiveLabel="off"
                        activeLabel="on"
                        value={this.state.notify}
        onToggle={(suscribe) => {
          if (!suscribe) {
            askPermission()
              .then(() => { return subscribeUserToPush() })
              .then((pushSubscription) => { return registerTokenOnServer(pushSubscription) })
              .then(() => {
                this.setState({
                  notify: true,
                })
              })
              .catch((e) => {
                console.log(e)
              })
          }}} />
    </div></div>)
    var Social = (<div className="fixed">
                  <ul className="site_social">
                    <li>
                        <a target="_blank" href="https://twitter.com/RutasAndes">
                          <img width="40px" height="40px" src="/images/twitter-logo-button.png" />
                        </a>
                    </li>
                    <li>
                        <a target="_blank" href="https://www.facebook.com/rutasdelosandes0">
                          <img width="40px" height="40px" src="/images/facebook-logo-button.png" />
                        </a>
                    </li>
                    <li>
                        <a target="_blank" href="https://www.instagram.com/rutasdelosandes/">
                          <img width="40px" height="40px" src="/images/instagram-logo.png" />
                        </a>
                    </li>
                     <li>
                        <a target="_blank" href="https://www.youtube.com/channel/UC2n-KkSMxnUtb_UQrXM_9XA">
                          <img width="40px" height="40px" src="/images/youtube-logo-button.png" />
                        </a>
                    </li>
              </ul>
            </div>)
    if (this.state.offline) {
      return (
        <div>
          <h2>Houston, tenemos problemas</h2>
          <p>parece que estas sin Conexión a internet&mdash; por favor revisala</p>
        </div>
      );
    }
    else {
      return (
        <div>
          {this.state.loading ? (<div className="loading"><img src="/images/loading.gif" /></div>): ""}  
          { typeof this.state.notify !== "undefined" ? Subscribe : Social }
            <div className={this.state.loading ? 'amp-container-hide' : null}  ref={ref => this.container_ = ref}>       
          </div>
      </div>);
    }
  }
  /**
   * Fetches the AMP document at `url` and attaches it as a shadow root.
   * @private
   * @param {string} url
   */
  fetchAndAttachAmpDoc_(url) {
    this.setState({'loading': true});
    this.fetchDocument_(url).then(doc => {
      return this.ampReadyPromise_.then(amp => {
        // Replace the old shadow root with a new div element.
        const oldShadowRoot = this.shadowRoot_;
        this.shadowRoot_ = document.createElement('div');
        if (oldShadowRoot) {
          this.container_.replaceChild(this.shadowRoot_, oldShadowRoot);
        } else {
          this.container_.appendChild(this.shadowRoot_);
        }
        // Attach the shadow document to the new shadow root.
        this.shadowAmp_ = amp.attachShadowDoc(this.shadowRoot_, doc, url);
        this.setState({'loading': false});
      });
    }).catch(error => {
      console.log(error)
      this.setState({'offline': true});
    });
  }

  /**
   * Cleans up internal state of current shadow AMP document.
   * @private
   */
  closeShadowAmpDoc_() {
    if (typeof this.shadowAmp_.close === 'function') {
       this.shadowAmp_.close();  
    }
  }
  /**
   * Fetches and parses HTML at `url`.
   * @private
   * @param {string} url
   * @return {!Promise<!Document|!string>} If fetch succeeds, resolved with {!Document}.
   *         Otherwise, rejects with {!string} error description.
   */
   fetchDocument_(url) {
    return new Promise((resolve, reject) => {
      this.xhr_ = new XMLHttpRequest();
      this.xhr_.open('GET',url, true);
      this.xhr_.responseType = 'document';
      this.xhr_.setRequestHeader('Accept', 'text/html');
      this.xhr_.onreadystatechange = () => {
        if (this.xhr_.readyState < /* STATUS_RECEIVED */ 2) {
          return;
        }
        if (this.xhr_.status < 100 || this.xhr_.status > 599) {
          this.xhr_.onreadystatechange = null;
          reject(new Error(`Unknown HTTP status ${this.xhr_.status}`));
          this.xhr_ = null;
          return;
        }
        if (this.xhr_.readyState === /* COMPLETE */ 4) {
          if (this.xhr_.responseXML) {
            resolve(this.xhr_.responseXML);
          } else {
            reject(new Error('No xhr.responseXML'));
          }
          this.xhr_ = null;
        }
      };
      this.xhr_.onerror = () => { reject(new Error('Network failure')); };
      this.xhr_.onabort = () => { reject(new Error('Request aborted')); };
      this.xhr_.send();
    });
  }

  /**
   * Event listener that redirects clicks on same-domain links to react-router.
   * This avoids page reload due to navigation from same-domain links in the AMP document,
   * which affords seamless UX in the style of a single-page app.
   * @private
   * @param e {!Event}
   */
  clickListener_(e) {
    if (e.defaultPrevented) {
      return false;
    }

    let a = null;

    if (e.path) {
      // Check `path` since events that cross the Shadow DOM boundary are retargeted.
      // See http://www.html5rocks.com/en/tutorials/webcomponents/shadowdom-301/#toc-events
      for (let i = 0; i < e.path.length; i++) {
        const node = e.path[i];
        if (node.tagName === 'A') {
          a = node;
          break;
        }
      }
    } else {
      // Polyfill for `path`.
      let node = e.target;
      while (node && node.tagName !== 'A') {
        node = node.parentNode;
      }
      a = node;
    }
    if (a && a.href) {
      const url = new URL(a.href);
      if (url.origin === window.location.origin) {
        // Perform router push instead of page navigation.
        e.preventDefault();
        // Clean up current shadow AMP document.
        this.closeShadowAmpDoc_();
        this.AmpDocClosed = true;
        // Router push reuses current component with new props.
        this.props.router.push(url.pathname);
        return false;
      }
    }

    return true;
  }
}
AMPDocument.propTypes = { src: React.PropTypes.string.isRequired }
export default withRouter(AMPDocument);
