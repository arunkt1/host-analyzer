var margin_session = {top: 20, right: 20, bottom: 30, left: 40},
    width_session1 = document.getElementById("rectangle_nine").offsetWidth - margin_session.left - margin_session.right,
    offsetHeight_session1 = document.getElementById('control-bar').offsetHeight,
    height_session1 = screen.height - offsetHeight_session1 - margin_session.top - margin_session.bottom-140;
 //alert ("session:   screenheight: "+screen.height+ "offset: "+offsetHeight1 + "height1: "+height1);
 
var x_session1 = d3.scale.ordinal()
    .rangeRoundBands([0, width_session1], .1);

var y_session1 = d3.scale.linear()
    .range([height_session1, 0]);

var xAxis_session1 = d3.svg.axis()
    .scale(x_session1)
    .orient("bottom");

var yAxis_session1 = d3.svg.axis()
    .scale(y_session1)
    .orient("left")
    .ticks(10, "%");
    
var chart_session = d3.select("#rectangle_nine").append("svg")
    .attr("width", width_session1 + margin_session.left + margin_session.right)
    .attr("height", height_session1 + margin_session.top + margin_session.bottom)
  .append("g")
    .attr("transform", "translate(" + margin_session.left + "," + margin_session.top + ")")
    .call(d3.behavior.zoom().on("zoom", function () {
    chart1.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")}))
  .append("g");
        
/*         var resizable = d3.select('#resizable');
var resizer = resizable.select('.resizer');

var dragResize = d3.behavior.drag()
   .on('drag', function() {
// Determine resizer position relative to resizable (parent)
x = d3.mouse(this.parentNode)[0];

// Avoid negative or really small widths
x = Math.max(50, x);

resizable.style('width', x + 'px');
})

resizer.call(dragResize); */

function plotSessionGraph() {
    var val = document.getElementById("cluster_dropdown").value;
    if (val=="Bmain") {
        d3.tsv("data.tsv", type_session, function(error, data) {
          if (error) throw error;

          x_session1.domain(data.map(function(d) { return d.letter; }));
          y_session1.domain([0, d3.max(data, function(d) { return d.frequency; })]);

          chart_session.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height_session1 + ")")
              .call(xAxis_session1);

          chart_session.append("g")
              .attr("class", "y axis")
              .call(yAxis_session1)
            .append("text")
              .attr("transform", "rotate(-90)")
              .attr("x", 6)
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text("Frequency");

          chart_session.selectAll(".bar")
              .data(data)
            .enter().append("rect")
              .attr("class", "bar")
              .attr("id",function(d){return d.letter;} )
              .attr("x", function(d) { return x_session1(d.letter); })
              .attr("width", x_session1.rangeBand())
              .attr("y", function(d) { return y_session1(d.frequency); })
              .attr("height", function(d) { return height_session1 - y_session1(d.frequency); })
        });
    }
}

function type_session(d) {
    d.frequency = +d.frequency;
    return d;
}