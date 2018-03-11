import { Link } from 'react-router';
import Home from './home';
import React from 'react';
import ReactTransitionGroup from 'react-addons-transition-group';
import TransitionWrapper from './transition-wrapper';
/**
 * The (App) Shell contains the web app's entire UI.
 *
 * The navigation bar is always displayed, with either a `Home` or `Article` component beneath it.
 */
export default class Shell extends React.Component {
  constructor(props) {
    super(props);
    // preload state in server and in client
    let documents = typeof global != 'undefined' ? global.__documents__ : window.__documents__
    this.state = {
      isTransitioning: false,
      sidebarIsOpen: false,
      documents: documents
    };
  }
  toggleSideBar(state) { 
    this.setState({sidebarIsOpen:state})
  }
  render() {
    return this.renderApp(this.state.documents)
  }
  renderApp(documents){
     return (
      <div>
        <div className="side-bar" open = {this.state.sidebarIsOpen}>
          <button onClick={() => { this.toggleSideBar(false) } } className="side-bar__close">
            <img  src="/images/ic_close_black_18dp_2x.png"
                  width="20"
                  height="20"
                  alt="close sidebar"
            />
            </button> 
            <ul>
              {documents.jekyll.pages.map((page,index) =>
                <li key={index}>
                  <Link onClick={() => { this.toggleSideBar(false) } } to={page.url}>
                    {page.title}  
                  </Link>  
                </li>)} 
          </ul>
           <a className="messegeus" href="https://m.me/rutasdelosandes0">
           <i></i>   
            <span>🤖 habla con el asistente virtual</span>
          </a>
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
        </div>
        { this.state.sidebarIsOpen &&
              <div className="side-bar__mask" onClick={() => { this.toggleSideBar(false) }} >
            </div>      
        }      
        <header className="site-header" style={{ backgroundColor: documents.jekyll.brandColor, borderBottom: "solid 1px black" }} >
          <div className='header-wrapper page-content'>
            <Link className="site-logo" to='/'>
              <img src={documents.jekyll.logo} height="50" width="50">
              </img>
            </Link>        
            <button onClick={() => { this.toggleSideBar(true) }} className='ampstart-btn caps m2 menu-button'>      
               <svg viewBox="0 0 18 15" width="35px" height="45px">
                <path fill="#424242" d="M18,1.484c0,0.82-0.665,1.484-1.484,1.484H1.484C0.665,2.969,0,2.304,0,1.484l0,0C0,0.665,0.665,0,1.484,0 h15.031C17.335,0,18,0.665,18,1.484L18,1.484z"/>
                <path fill="#424242" d="M18,7.516C18,8.335,17.335,9,16.516,9H1.484C0.665,9,0,8.335,0,7.516l0,0c0-0.82,0.665-1.484,1.484-1.484 h15.031C17.335,6.031,18,6.696,18,7.516L18,7.516z"/>
                <path fill="#424242" d="M18,13.516C18,14.335,17.335,15,16.516,15H1.484C0.665,15,0,14.335,0,13.516l0,0 c0-0.82,0.665-1.484,1.484-1.484h15.031C17.335,12.031,18,12.696,18,13.516L18,13.516z"/>
                </svg>              
            </button>
         </div>
        </header>
        <div className='container main'>
          <ReactTransitionGroup>
            {
              (this.props.children) ?
                  <TransitionWrapper
                      key='transition-wrapper'
                      contents={this.props.children}
                      isTransitioning={this.state.isTransitioning} /> :
                  <Home key='home'
                      documents={documents.docs}
                      transitionStateDidChange={this.onTransitionStateChange_.bind(this)} />
            }
          </ReactTransitionGroup>
        </div>
      </div>
    );
  }
  /** @private */
  onTransitionStateChange_(isTransitioning) {
    this.setState({isTransitioning: isTransitioning});
  }
}
