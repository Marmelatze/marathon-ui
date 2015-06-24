var config = {
  // Defines the Marathon API URL,
  // leave empty to use the same as the UI is served.
  apiURL: "",
  // Intervall of API request in ms
  updateInterval: 5000,
  // Local http server URI while tests run
  localTestserverURI: {
    address: "localhost",
    port: 8181
  },
  statsURL: "http://" + window.location.hostname + ":3000/dashboard/db/containers?from=now-1h&to=now&var-node=All&var-container=All&var-marathon_app=<%= model.id %>&var-image=All"
};

module.exports = config;
