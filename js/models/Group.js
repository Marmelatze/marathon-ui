var Backbone = require("backbone");
var _ = require("underscore");
var AppCollection = require("../models/AppCollection");

var Group = Backbone.Model.extend({
  defaults: function () {
    return {
      id: null,
      dependencies: []
    };
  },

  initialize: function (options) {
    this.options = options;
    this.apps = new AppCollection(options.apps);

    // need to require this here, to avoid circular requirements
    var GroupCollection = require("../models/GroupCollection");
    this.groups = new GroupCollection(options.groups);

    console.log("group " + options.id, this);
  }
});

module.exports = Group;
