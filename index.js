const canvas = d3.select('.canva')

const svg = canvas.append('svg')
                  .attr('width', 900)
                  .attr('height', 900)
                  
const margin = {top: 30, right: 30, bottom: 80, left: 80}
const graphWidth = 650 - margin.left - margin.right;
const graphHeight = 650 -margin.top - margin.bottom;

const mainCanvas = svg.append('g')
                .attr('height', graphHeight /2)
                .attr('width', graphWidth / 2)
                .attr('transform',`translate(${margin.left},${margin.top + 100})`);

function getCSVData() {
  d3.csv('/expence.csv', function(d){
    console.log('Data', d)
  });

}          

getCSVData();

function drawPieChart(data){

}
