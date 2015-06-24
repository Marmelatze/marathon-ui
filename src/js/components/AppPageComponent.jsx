var _ = require("underscore");
var classNames = require("classnames");
var React = require("react/addons");

var config = require("../config/config");
var AppBreadcrumbsComponent = require("../components/AppBreadcrumbsComponent");
var AppVersionListComponent = require("../components/AppVersionListComponent");
var TabPaneComponent = require("../components/TabPaneComponent");
var TaskDetailComponent = require("../components/TaskDetailComponent");
var TaskViewComponent = require("../components/TaskViewComponent");
var TogglableTabsComponent = require("../components/TogglableTabsComponent");
var Util = require("../helpers/Util");

var tabsTemplate = [
  {id: "apps/:appid", text: "Tasks"},
  {id: "apps/:appid/configuration", text: "Configuration"}
];

if (config.statsURL !== undefined && config.statsURL.length > 0) {
  tabsTemplate.push({id: "apps/:appid/stats", text: "Stats"});
}

var AppPageComponent = React.createClass({
  displayName: "AppPageComponent",

  propTypes: {
    appVersionsFetchState: React.PropTypes.number.isRequired,
    destroyApp: React.PropTypes.func.isRequired,
    fetchAppVersions: React.PropTypes.func.isRequired,
    fetchTasks: React.PropTypes.func.isRequired,
    model: React.PropTypes.object.isRequired,
    onTasksKilled: React.PropTypes.func.isRequired,
    restartApp: React.PropTypes.func.isRequired,
    rollBackApp: React.PropTypes.func.isRequired,
    scaleApp: React.PropTypes.func.isRequired,
    suspendApp: React.PropTypes.func.isRequired,
    tasksFetchState: React.PropTypes.number.isRequired,
    view: React.PropTypes.string
  },

  getInitialState: function () {
    var appId = this.props.model.get("id");
    var activeTabId;

    var tabs = _.map(tabsTemplate, function (tab) {
      var id = tab.id.replace(":appid", encodeURIComponent(appId));
      if (activeTabId == null) {
        activeTabId = id;
      }

      return {
        id: id,
        text: tab.text
      };
    });

    return {
      activeViewIndex: 0,
      activeTabId: activeTabId,
      tabs: tabs
    };
  },

  componentWillReceiveProps: function (nextProps) {
    var view = nextProps.view;
    var activeTabId = "apps/" + encodeURIComponent(this.props.model.get("id"));
    var activeTask = this.props.model.tasks.get(view);
    var activeViewIndex = 0;

    if (view === "stats") {
      activeTabId += "/stats";
    }

    if (view === "configuration") {
      activeTabId += "/configuration";
    }

    if (view != null && activeTask == null) {
      activeTask = this.state.activeTask;
    }

    if (activeTask != null) {
      activeViewIndex = 1;
    }

    this.setState({
      activeTabId: activeTabId,
      activeTask: activeTask,
      activeViewIndex: activeViewIndex
    });
  },

  onTabClick: function (id) {
    this.setState({
      activeTabId: id
    });
  },

  scaleApp: function () {
    var model = this.props.model;
    var instancesString = Util.prompt("Scale to how many instances?",
      model.get("instances"));
    // Clicking "Cancel" in a prompt returns either null or an empty String.
    // perform the action only if a value is submitted.
    if (instancesString != null && instancesString !== "") {
      var instances = parseInt(instancesString, 10);
      this.props.scaleApp(instances);
    }
  },

  getControls: function () {
    if (this.state.activeViewIndex !== 0) {
      return null;
    }

    return (
      <div className="header-btn">
        <button className="btn btn-sm btn-default"
            onClick={this.props.suspendApp}
            disabled={this.props.model.get("instances") < 1}>
          Suspend
        </button>
        <button className="btn btn-sm btn-default" onClick={this.scaleApp}>
          Scale
        </button>
        <button className="btn btn-sm btn-danger pull-right"
          onClick={this.props.destroyApp}>
          Destroy App
        </button>
        <button className="btn btn-sm btn-default pull-right"
          onClick={this.props.restartApp}>
          Restart App
        </button>
      </div>
    );
  },

  getTaskDetailComponent: function () {
    var model = this.props.model;

    return (
      <TaskDetailComponent
        fetchState={this.props.tasksFetchState}
        taskHealthMessage={model.formatTaskHealthMessage(this.state.activeTask)}
        hasHealth={model.hasHealth()}
        task={this.state.activeTask} />
    );
  },

  getStatsUrl: function () {
    return _.template(config.statsURL)({model: this.props.model});
  },

  getAppDetails: function () {
    var model = this.props.model;

    return (
      <TogglableTabsComponent className="page-body page-body-no-top"
          activeTabId={this.state.activeTabId}
          onTabClick={this.onTabClick}
          tabs={this.state.tabs} >
        <TabPaneComponent
          id={"apps/" + encodeURIComponent(model.get("id")) + "/stats"}
          >
          <a className="btn btn-sm btn-default pull-right" href={this.getStatsUrl()} target="_blank">
            Open on External Page
          </a>
          <iframe src={this.getStatsUrl()} />
        </TabPaneComponent>
        <TabPaneComponent
          id={"apps/" + encodeURIComponent(model.get("id"))}>
          <TaskViewComponent
            collection={model.tasks}
            fetchState={this.props.tasksFetchState}
            fetchTasks={this.props.fetchTasks}
            formatTaskHealthMessage={model.formatTaskHealthMessage}
            hasHealth={model.hasHealth()}
            onTasksKilled={this.props.onTasksKilled} />
        </TabPaneComponent>
        <TabPaneComponent
          id={"apps/" + encodeURIComponent(model.get("id")) + "/configuration"}
          onActivate={this.props.fetchAppVersions} >
          <AppVersionListComponent
            app={model}
            fetchAppVersions={this.props.fetchAppVersions}
            fetchState={this.props.appVersionsFetchState}
            onRollback={this.props.rollBackApp} />
        </TabPaneComponent>
      </TogglableTabsComponent>
    );
  },

  render: function () {
    var content;
    var model = this.props.model;
    var statusClassSet = classNames({
      "text-warning": model.isDeploying()
    });

    if (this.state.activeViewIndex === 0) {
      content = this.getAppDetails();
    } else if (this.state.activeViewIndex === 1) {
      content = this.getTaskDetailComponent();
    }

    return (
      <div>
        <AppBreadcrumbsComponent
          activeTask={this.state.activeTask}
          activeViewIndex={this.state.activeViewIndex}
          model={model} />
        <div className="container-fluid">
          <div className="page-header">
            <span className="h3 modal-title">{model.get("id")}</span>
            <ul className="list-inline list-inline-subtext">
              <li>
                <span className={statusClassSet}>
                  {model.getStatus()}
                </span>
              </li>
            </ul>
            {this.getControls()}
          </div>
          {content}
        </div>
      </div>
    );
  }
});

module.exports = AppPageComponent;
