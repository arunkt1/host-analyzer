var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width1 = document.getElementById("rectangle_three").offsetWidth - margin.left - margin.right,
    width2 = document.getElementById("rectangle_four").offsetWidth - margin.left - margin.right,
    offsetHeight1 = document.getElementById('control-bar').offsetHeight,
    height1 = screen.height - offsetHeight1 - margin.top - margin.bottom-140;
    height2 = height1/2;
 //alert ("tornado:   screenheight: "+screen.height+ "offset: "+offsetHeight1 + "height1: "+height1);
 
var x1 = d3.scale.linear()
    .range([0, width1]);
    
var y1 = d3.scale.ordinal();

var y0 = d3.scale.ordinal()
    .rangeRoundBands([height1, 0], .1);

var xAxis1 = d3.svg.axis()
    .scale(x1)
    .orient("bottom");

var yAxis1 = d3.svg.axis()
    .scale(y0)
    .orient("left");
    
var x2 = d3.scale.linear()
    .range([0, width2]);

var y2 = d3.scale.ordinal()
    .rangeRoundBands([height2, 0], .1);

var xAxis2 = d3.svg.axis()
    .scale(x2)
    .orient("bottom")
    .ticks(10, "%");

var yAxis2 = d3.svg.axis()
    .scale(y2)
    .orient("left");
    
 var tipTornado = d3.tip()
     .attr('class', 'd3-tip')
     .offset([-10, 0])
     .html(function (d) {
     return "<strong>Frequency:</strong> <span style='color:red'>" + d.value + "</span>";
 });

var chart1 = d3.select("#rectangle_three").append("svg")
    .attr("width", width1 + margin.left + margin.right)
    .attr("height", height1 + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
   .call(d3.behavior.zoom().on("zoom", function () {
    chart1.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")}));
   
chart1.call(tipTornado);
    
var chart2 = d3.select("#rectangle_four").append("svg")
    .attr("width", width2 + margin.left + margin.right)
    .attr("height", height2 + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
var chart3 = d3.select("#rectangle_five").append("svg")
    .attr("width", width2 + margin.left + margin.right)
    .attr("height", height2 + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    
    

    
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

function plotTornadoGraph () {
     //   var val = document.getElementById("cluster_dropdown").value;
    //if (val=="Bmain") {
      //  d3.csv("dataGroup.csv", function(error, data) {
      //  if (error) throw error;
           // var ageNames = d3.keys(data[0]).filter(function(key) { return key !== "State"; });

           // data.forEach(function(d) {
         //   d.ages = ageNames.map(function(name) { return {name: name, value: +d[name]}; });
          //  });
            y0.domain(hostInfo.map(function(d) { return hostInfo.name }));
            y1.domain(ageNames).rangeRoundBands([0, y0.rangeBand()]);
            x1.domain([0, d3.max(data, function(d) { return d3.max(d.ages, function(d) { return d.value; }); })]);          
            //y0.domain(data.map(function(d) { return d.name; }));
            //y1.domain(data.map(function(d) { return d.letter; }));          
            //x1.domain([0, d3.max(data, function(d) { return d.frequency; })]);

            chart1.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height1 + ")")
                .call(xAxis1)
                .append("text")
                .attr("x", 6)
                .attr("dx", "35em")
                .attr("dy", "3em")
                .style("text-anchor", "end")
                .text("Frequency");

          chart1.append("g")
              .attr("class", "y axis")
              .call(yAxis1)
              .append("text")
              .attr("transform", "rotate(-90)")
             .attr("dx", "-20em")
              .attr("dy", "-2em")
              .style("text-anchor", "end")
              .text("Population");
              
            var state = chart1.selectAll(".state")
              .data(hostInfo)
            .enter().append("g")
              .attr("class", "g")
              .attr("transform", function(d) { return "translate(0," + y0(d.name) + ")"; });
          state.selectAll("rect")
              .data(function(d) { return d.value; })
            .enter().append("rect")
              .attr("class", "bar")
              .attr("y", function(d) { return y1(d.); })
              .attr("height", y1.rangeBand()*.50)
              .attr("x", function(d) { return 0; })
              .attr("width", function(d) { return x1(d.value); })
               .on("mouseover", function (d) {
                   var self = this;
                  tipTornado.show(d);

              }) 
              .on('mouseout', tipTornado.hide);
}
        function type(d) {
            d.frequency = +d.frequency;
            return d;
        }
        function change_graph (self, d) {

             var id = d3.select(self).attr("id"); 
            d3.tsv("data.tsv", type, function(error, data) {
              if (error) throw error;

              y2.domain(data.map(function(d) { return d.letter; }));
              x2.domain([0, d3.max(data, function(d) { return d.frequency; })]);

              chart2.append("g")
                  .attr("class", "x axis")
                  .attr("transform", "translate(0," + height2 + ")")
                  .call(xAxis2);

              chart2.append("g")
                  .attr("class", "y axis")
                  .call(yAxis2)
                .append("text")
                  .attr("transform", "rotate(-90)")
                  .attr("y", 6)
                  .attr("dy", ".71em")
                  .style("text-anchor", "end")
                  .text("Frequency");

              chart2.selectAll(".bar")
                  .remove();
              chart2.selectAll(".bar")
                  .data(data.filter( function(d){return d.letter === id}))
                .enter().append("rect")
                  .attr("class", "bar")
                  .attr("y", function(d) { return y2(d.letter); })
                  .attr("height", y2.rangeBand())
                  .attr("x", function(d) { return 0; })
                  .attr("width", function(d) { return x2(d.frequency); })
                  .on("click", function(d,i) { alert("you have clicked on the side graph"); });
            }); 
        }