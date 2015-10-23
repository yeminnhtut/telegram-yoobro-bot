var graph = require("fbgraph");
var memory = [];
var READY = false;

var fbtoken = "{facebook-token}";
var yoobro_pageid = "1039852779358258";

graph.setAccessToken(fbtoken);

function getPhotos(url) {
  url = url || (yoobro_pageid + "/photos/uploaded?fields=source&limit=500");
  console.log("getting...");
  graph.get(url, function (err, res) {
    if (err) return console.error(err);

    memory = memory.concat(res.data);

    if (res.paging && res.paging.next) {
      getPhotos(res.paging.next);
    } else {
      memory = _.uniq(memory);
      READY = true;
      console.log("done");
    }
  });
}

getPhotos();

module.exports = {
  getRandom: function () {
    if (!READY) {
      return false;
    }
    return _.sample(memory).source;
  }
};
