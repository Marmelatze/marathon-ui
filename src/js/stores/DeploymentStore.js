var EventEmitter = require("events").EventEmitter;
var lazy = require("lazy.js");

var AppDispatcher = require("../AppDispatcher");
var DeploymentEvents = require("../events/DeploymentEvents");

var DeploymentStore = lazy(EventEmitter.prototype).extend({
  deployments: []
}).value();

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case DeploymentEvents.REQUEST:
      DeploymentStore.deployments = action.data;
      DeploymentStore.emit(DeploymentEvents.CHANGE);
      break;
    case DeploymentEvents.REQUEST_ERROR:
      DeploymentStore.emit(DeploymentEvents.REQUEST_ERROR);
      break;
    case DeploymentEvents.REVERT:
      DeploymentStore.deployments.push(action.data);
      DeploymentStore.emit(DeploymentEvents.CHANGE);
      break;
    case DeploymentEvents.REVERT_ERROR:
      DeploymentStore.emit(DeploymentEvents.REVERT_ERROR);
      break;
    case DeploymentEvents.STOP:
      DeploymentStore.deployments = lazy(DeploymentStore.deployments).reject({
        deploymentId: action.deploymentId
      }).value();
      DeploymentStore.emit(DeploymentEvents.CHANGE);
      break;
    case DeploymentEvents.STOP_ERROR:
      DeploymentStore.emit(DeploymentEvents.STOP_ERROR);
      break;
  }
});

module.exports = DeploymentStore;
