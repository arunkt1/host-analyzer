var urlOrigin = "http://sandboxes";

var margin_pie = {top: 20, right: 20, bottom: 30, left: 40},
    width_pie1 = document.getElementById("h_att").offsetWidth - margin_pie.left - margin_pie.right -140,
    offsetHeight1 = document.getElementById('control-bar').offsetHeight,
    height_pie1 = (screen.height - offsetHeight1)/3 - margin_pie.top - margin_pie.bottom ,
    height_pie2 = (screen.height - offsetHeight1)/2 - margin_pie.top - margin_pie.bottom ;
var pie_h_att = d3.select("#h_att").append("svg")
    .attr("width", width_pie1 + margin_pie.left + margin_pie.right)
    .attr("height", height_pie1 + margin_pie.top + margin_pie.bottom)
  .append("g")
    .attr("transform", "translate(" + margin_pie.left + "," + margin_pie.top + ")");

var pie_c_all = d3.select("#c_all").append("svg")
    .attr("width", width_pie1 + margin_pie.left + margin_pie.right)
    .attr("height", height_pie1 + margin_pie.top + margin_pie.bottom)
  .append("g")
    .attr("transform", "translate(" + margin_pie.left + "," + margin_pie.top + ")");

var pie_s_sum = d3.select("#s_sum").append("svg")
    .attr("width", width_pie1 + margin_pie.left + margin_pie.right)
    .attr("height", height_pie1 + margin_pie.top + margin_pie.bottom)
  .append("g")
    .attr("transform", "translate(" + margin_pie.left + "," + margin_pie.top + ")");

var pie_h_eff = d3.select("#h_eff").append("svg")
    .attr("width", width_pie1 + margin_pie.left + margin_pie.right)
    .attr("height", height_pie1 + margin_pie.top + margin_pie.bottom)
  .append("g")
    .attr("transform", "translate(" + margin_pie.left + "," + margin_pie.top + ")");

var pie_s_usa = d3.select("#s_usa").append("svg")
    .attr("width", width_pie1 + margin_pie.left + margin_pie.right)
    .attr("height", height_pie1 + margin_pie.top + margin_pie.bottom)
  .append("g")
    .attr("transform", "translate(" + margin_pie.left + "," + margin_pie.top + ")");

var pie_c_typ = d3.select("#c_typ").append("svg")
    .attr("width", width_pie1 + margin_pie.left + margin_pie.right)
    .attr("height", height_pie1 + margin_pie.top + margin_pie.bottom)
  .append("g")
    .attr("transform", "translate(" + margin_pie.left + "," + margin_pie.top + ")");

var pie_t_att = d3.select("#t_att").append("svg")
    .attr("width", width_pie1 + margin_pie.left + margin_pie.right)
    .attr("height", height_pie2 + margin_pie.top + margin_pie.bottom)
  .append("g")
    .attr("transform", "translate(" + margin_pie.left + "," + margin_pie.top + ")");

var pie_a_inf = d3.select("#a_inf").append("svg")
    .attr("width", width_pie1 + margin_pie.left + margin_pie.right)
    .attr("height", height_pie2 + margin_pie.top + margin_pie.bottom)
  .append("g")
    .attr("transform", "translate(" + margin_pie.left + "," + margin_pie.top + ")");



 var tipPie = d3.tip()
     .attr('class', 'd3-tip')
     .offset([-10, 0])
     .html(function (d) {
      return "<p>" + d.data.name+": "+d.data.percent +"%<br>("+d.data.value+")</p>";
 });

var randomColor = (function(){
  var golden_ratio_conjugate = 0.618033988749895;
  var h = Math.random();

  var hslToRgb = function (h, s, l){
      var r, g, b;

      if(s == 0){
          r = g = b = l; // achromatic
      }else{
          function hue2rgb(p, q, t){
              if(t < 0) t += 1;
              if(t > 1) t -= 1;
              if(t < 1/6) return p + (q - p) * 6 * t;
              if(t < 1/2) return q;
              if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
              return p;
          }

          var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          var p = 2 * l - q;
          r = hue2rgb(p, q, h + 1/3);
          g = hue2rgb(p, q, h);
          b = hue2rgb(p, q, h - 1/3);
      }

      return '#'+Math.round(r * 255).toString(16)+Math.round(g * 255).toString(16)+Math.round(b * 255).toString(16);
  };

  return function(){
    h += golden_ratio_conjugate;
    h %= 1;
    return hslToRgb(h, 0.5, 0.60);
  };
})();

function plotPieGraph(data_s_usa, data_h_att, data_s_sum, data_c_typ, data_a_inf, data_t_att, data_h_eff, data_c_all, data_h_eff ) {
    plotPie(data_s_usa, pie_s_usa, 1, height_pie1);
    plotPie(data_h_att, pie_h_att, 0, height_pie1);
    plotPie(data_s_sum, pie_s_sum, 1, height_pie1);
    plotPie(data_c_typ, pie_c_typ, 0, height_pie1);
    plotPie(data_a_inf, pie_a_inf, 0, height_pie2);
    plotPie(data_t_att, pie_t_att, 0, height_pie2);
    plotPie(data_h_eff, pie_h_eff, 1, height_pie1);
    plotPie(data_c_all, pie_c_all, 1, height_pie1);
}

function plotPie(data, chartName, enableText, height_pie) {
    var radius1 = Math.min(width_pie1, height_pie) / 2;
    var arc = d3.svg.arc()
        .outerRadius(radius1 - 10)
        .innerRadius(0);

    var pie = d3.layout.pie()
        .sort(null)
       .value(function(d) { return d.value; });

    var svg = chartName.append("svg")
        .attr("width", width_pie1)
        .attr("height", height_pie )
      .append("g")
        .attr("transform", "translate(" + width_pie1 / 2 + "," + height_pie / 2 + ")");

        var total = d3.sum(data.map(function(d) {
            return d.value;
        }));

        data.forEach(function(d) {
        d.value = +d.value;
        d.percent =Math.round(1000 * d.value / total) / 10;
        });

        var g = svg.selectAll(".arc")
          .data(pie(data))
        .enter().append("g")
          .attr("class", "arc")
          .attr("class", "arc")
        .call(tipPie)
        .on("mouseover", tipPie.show)
        .on('mouseout', tipPie.hide);


        g.append("path")
          .attr("d", arc)
          if (enableText==1) {
            g.style({fill: (function(d) { return d.data.color;} || randomColor)});
          } else {
              g.style({fill: randomColor});
          }
    if (enableText){
        //var labelr = 10;
        g.append("text")
        .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        //.style("text-anchor", "middle")
        //.text(function(d) { return d.data.name; });
/*         g.append("svg:text").attr("transform", function(d) {
            var c = arc.centroid(d),
            x = c[0],
            y = c[1],
            // pythagorean theorem for hypotenuse
            h = Math.sqrt(x*x + y*y);
            return "translate(" + (x/h * labelr) +  ',' + (y/h * labelr) +  ")";
        })
           .attr("text-anchor", function(d) {
            // are we past the center?
            return (d.endAngle + d.startAngle)/2 > Math.PI ? "end" : "start";
        });  */
    }

}