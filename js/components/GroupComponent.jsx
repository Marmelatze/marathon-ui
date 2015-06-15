/** @jsx React.DOM */

var React = require("react/addons");
var AppListComponent = require("../components/AppListComponent");


var GroupComponent = React.createClass({
  displayName: "GroupComponent",

  propTypes: {
    model: React.PropTypes.object.isRequired,
    router: React.PropTypes.object.isRequired
  },

  render: function () {
    var model = this.props.model;
    // need to require this here, to avoid circular requirements
    var GroupListComponent = require("../components/GroupListComponent");

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <div>
        Group {model.id}
        <AppListComponent
          collection={model.apps}
          router={this.props.router} />
        <GroupListComponent
          groups={this.props.model.groups}
          router={this.props.router} />
      </div>
    );
  }
});

module.exports = GroupComponent;
