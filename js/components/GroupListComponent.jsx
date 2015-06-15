/** @jsx React.DOM */

var React = require("react/addons");
var States = require("../constants/States");
var BackboneMixin = require("../mixins/BackboneMixin");
var GroupComponent = require("../components/GroupComponent");


var GroupListComponent = React.createClass({
  displayName: "GroupListComponent",

  mixins: [BackboneMixin],

  propTypes: {
    groups: React.PropTypes.object.isRequired,
    router: React.PropTypes.object.isRequired
  },

  getResource: function () {
    return this.props.groups;
  },

  getGroupNodes: function () {
    return (
      this.props.groups.map(function (model) {
        /* jshint trailing:false, quotmark:false, newcap:false */
        /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
        return (
          <GroupComponent
            key={model.id}
            model={model}
            router={this.props.router} />
        );
        /* jshint trailing:true, quotmark:true, newcap:true */
        /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
      }, this)
    );
  },

  render: function () {
    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <div>
        {this.getGroupNodes()}
      </div>
    );
  }
});

module.exports = GroupListComponent;
