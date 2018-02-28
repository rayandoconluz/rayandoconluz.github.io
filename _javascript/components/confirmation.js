import React from 'react';
/**
 * A snippet of an AMP document that links to the full content.
 */

export default class Confirmation extends React.Component {
  render() {
    return (
      <div>
        <div>soy una confirmacion</div>
      </div>
    );
  }
}
Confirmation.propTypes = {
  title: React.PropTypes.string,
  subtitle: React.PropTypes.string,
  image: React.PropTypes.string,
}
