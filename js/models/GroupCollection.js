var config = require("../config/config");
var Group = require("../models/Group");
var SortableCollection = require("../models/SortableCollection");

var GroupCollection = SortableCollection.extend({
  model: Group,

  initialize: function (models, options) {
    this.options = options;
    this.setComparator("-id");
    this.sort();
  },

  parse: function (response) {
    console.log(response);
    return response;
  },

  url: config.apiURL + "v2/groups"
});

module.exports = GroupCollection;
