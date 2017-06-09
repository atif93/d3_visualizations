require(["d3", "forceDirectedGraph", "lodash"], function (d3, ForceDirectedGraph, lodash) {

  // Initialize the force directed graph.
  var container = d3.select("#container").node(),
      forceDirectedGraph = ForceDirectedGraph({ container: container });

  // Initialize zoom based on client size.
  var scale = container.clientWidth * 1 / 800;
  forceDirectedGraph.scale = scale;
  forceDirectedGraph.translate = [
    container.clientWidth / 2 * (1 - scale),
    container.clientHeight / 2 * (1 - scale)
  ];
  

  // Set up default data.
  if(!location.hash){
    location.hash = '{"nodes":[{"type":"lambda","fixed":1,"x":442,"y":200},\
    {"type":"property","property":"Input","fixed":1,"x":442,"y":150},\
    {"type":"property","property":"Point non-coding mutations","fixed":1,"x":250,"y":250},\
    {"type":"property","property":"Structural variations","fixed":1,"x":380,"y":250},\
    {"type":"property","property":"Point coding mutations","fixed":1,"x":510,"y":250},\
    {"type":"property","property":"All mutations","fixed":1,"x":650,"y":250},\
    {"type":"property","property":"FunSeq2","fixed":1,"x":250,"y":350},\
    {"type":"property","property":"FunSeq2 score","fixed":1,"x":250,"y":450},\
    {"type":"property","property":"Region annotation","fixed":1,"x":380,"y":300},\
    {"type":"property","property":"Gene function classification","fixed":1,"x":380,"y":350},\
    {"type":"property","property":"8,000 Cancer Exomes","fixed":1,"x":380,"y":400},\
    {"type":"property","property":"Normalized peak score","fixed":1,"x":380,"y":450},\
    {"type":"property","property":"SIFT","fixed":1,"x":490,"y":280},\
    {"type":"property","property":"GERP++","fixed":1,"x":490,"y":305},\
    {"type":"property","property":"SiPhy","fixed":1,"x":490,"y":330},\
    {"type":"property","property":"PhyloP","fixed":1,"x":490,"y":355},\
    {"type":"property","property":"Mutation Taster","fixed":1,"x":490,"y":380},\
    {"type":"property","property":"PolyPhen2","fixed":1,"x":555,"y":280},\
    {"type":"property","property":"Mutation Assessor","fixed":1,"x":555,"y":305},\
    {"type":"property","property":"LRT","fixed":1,"x":555,"y":330},\
    {"type":"property","property":"FATHMM","fixed":1,"x":555,"y":355},\
    {"type":"property","property":"CADD","fixed":1,"x":555,"y":380},\
    {"type":"property","property":"VEST","fixed":1,"x":530,"y":405},\
    {"type":"property","property":"Radial SVM Score","fixed":1,"x":530,"y":450},\
    \
    {"type":"property","property":"","fixed":1,"x":1650,"y":250}],\
    "links":[{"source":1,"target":0},{"source":0,"target":2},\
    {"source":0,"target":3},{"source":0,"target":4},{"source":0,"target":5},\
    {"source":2,"target":6},{"source":6,"target":7},{"source":3,"target":8},\
    {"source":8,"target":9},{"source":9,"target":10},{"source":10,"target":11},\
    {"source":4,"target":12},{"source":12,"target":13},{"source":13,"target":14},\
    {"source":14,"target":15},{"source":15,"target":16},{"source":16,"target":22},\
    {"source":4,"target":17},{"source":17,"target":18},{"source":18,"target":19},\
    {"source":19,"target":20},{"source":20,"target":21},{"source":21,"target":22},\
    {"source":22,"target":23},{"source":20,"target":21},{"source":21,"target":22}],\
    "scale":1.938287710980903,"translate":[-360.71751731834274,-241.583180104211]}';
  }

  // Update the fragment identifier in response to user interactions.
  forceDirectedGraph.when(["state"], function(state){
    location.hash = JSON.stringify(state);
    console.log(JSON.stringify(state));
  });
  
  // Sets the data on the graph visualization from the fragment identifier.
  // See https://github.com/curran/screencasts/blob/gh-pages/navigation/examples/code/snapshot11/main.js
  function navigate(){
      if(location.hash){
      //var newState = JSON.parse(location.hash.substr(1));
      var newState = JSON.parse(unescape(location.hash.substr(1)));
      if(JSON.stringify(newState) !== JSON.stringify(forceDirectedGraph.state)){
        forceDirectedGraph.state = newState;
      }
    }
  }

  // Navigate once to the initial hash value.
  navigate();
  
  // Navigate whenever the fragment identifier value changes.
  window.addEventListener("hashchange", navigate);

  // Sets the `box` model property
  // based on the size of the container,
  function computeBox(){
    forceDirectedGraph.box = {
      width: container.clientWidth,
      height: container.clientHeight
    };
  }

  // once to initialize `model.box`, and
  computeBox();

  // whenever the browser window resizes in the future.
  window.addEventListener("resize", computeBox);
  
});