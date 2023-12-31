const canvas = d3.select('.canva')

const svg = canvas.append('svg')
                  .attr('width', 800)
                  .attr('height', 800)
                  
const margin = {top: 30, right: 30, bottom: 80, left: 80}
const graphWidth = 650 - margin.left - margin.right;
const graphHeight = 650 -margin.top - margin.bottom;

const mainCanvas = svg.append('g')
                .attr('height', graphHeight /2)
                .attr('width', graphWidth / 2)
                .attr('transform',`translate(${margin.left + 260},${margin.top + 310})`);

 // mainCanvas.call(tip)
 var tooltip = d3.select("body")
    .append("div")
     .style("position", "absolute")
     .style("z-index", "10")
     .style("visibility", "hidden")
     .style("background-color", "#ffffff");

    //create pie
 const pie = d3.pie()
               .sort(null)
               .value(data => data.number)   
               
 //radius
 const arcPath = d3.arc()
                    .outerRadius(200)
                    .innerRadius(100)

  //title
  svg.append('text')
      .attr('class', 'title')
      .attr('dx', margin.left + 260)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'text-before-edge')
      .attr('opacity', 0)
      .transition()
        .duration(1000)
        .style('opacity', (d, i) => i+0.7)

      .text('Pie Chart')
      .attr('fill', 'white')

  //add text
  mainCanvas.append('text')
            .attr('class', 'mytext')
           // .attr('dy', '.85em')
            .style('opacity', '0.0')
            .transition()
                .duration(1000)
                .style('opacity', (d, i) => i+0.7)
            .text('Expance')
            .attr('text-anchor', 'middle')
            .attr("dominant-baseline", "central")
         //   .attr('fill', 'white')
            
  //difine ordinal scale
  const colorScale = d3.scaleOrdinal(d3['schemeCategory10'])

  
function getCSVData() {
  d3.csv('/expence.csv', function(d){
    return d;
  }).then(drawPieChart);

}          

getCSVData();

function drawPieChart(data){

  //update color scale domain
  colorScale.domain(data.map(d => d.number))

  const angles = pie(data);
  
  //create path and pie on screen
  const paths = mainCanvas.selectAll('path')
                          .data(angles)

  paths.enter()
        .append('path')
        .attr('class', 'arc')
        .attr('stroke', '#cde')
        .attr('fill', d => colorScale(d.data.number))
        .attr('d', arcPath)
        .on("mouseover", function(event){
          d3.select(this)
             .transition()
             .duration(100)//100 ms
             .style('opacity', '0.7')
          tooltip.html( d => {return '<p>Type: ' + '<span style="color:orange"></span>' + event.target.__data__.data.type + '</p>' + 
          '<p>  Price: ' + '<span style="color:orangered"></span>' + event.target.__data__.data.number + '</p>'})
          tooltip.style("visibility", "visible")
          tooltip.style('opacity', '0.9')
          tooltip.style('background', 'black')
          tooltip.style('color', 'white')
          tooltip.attr('class', 'tooltip')

        })
        .on("mouseout", function(event){
          d3.select(this)
          .transition()
          .duration(100)//100 ms
          .style('opacity', '1')
          tooltip.style("visibility", "hidden");
        })
        .on("mousemove", function(event){ tooltip.style("top", (event.pageY + 10)+"px").style("left",(event.pageX+25)+"px");})
        .transition()
              .duration(750)       
              .attrTween('d', arcAnimatio)

       //label
       paths.enter()
            .append('text')
            .text(function(d) {if(d.endAngle - d.startAngle > (Math.PI/7))
            return  d.data.type;})
            .attr('transform', function(d){
              return 'translate(' + arcPath.centroid(d) + ')';
            })
            .attr('dominant-baseline', 'central')
            .style('text-anchor', 'middle')
            .style('font-size', 19)
            .style('fill', function(d) {
              var bgColor = colorScale(d.data.number)
              var rgb = d3.rgb(bgColor)
              var backgroundIsDark = (rgb.r + rgb.g + rgb.b) / 3 < 128
              return backgroundIsDark ? '#fff' : '#000'})
            

}

//tween animation
const arcAnimatio = (d) =>{
  var i = d3.interpolate(d.endAngle, d.startAngle)
  return function(t){
    d.startAngle = i(t)

    return arcPath(d)
  }
}

