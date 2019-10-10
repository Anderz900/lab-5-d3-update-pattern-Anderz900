
// SVG drawing area

let margin = {top: 40, right: 10, bottom: 60, left: 60};

let width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

let svg = d3.select("#chart-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// Scales

let y = d3.scaleLinear()
	.range([height, 0]);
	

let x = d3.scaleBand()
    .rangeRound([0, width])
	.paddingInner(0.1);

// Initialize axes Here


let yAxis = d3.axisLeft()
	.scale(y);

let xAxis = d3.axisBottom()
	.scale(x);





// Initialize SVG axes groups here

let yAxisG = svg.append('g')
	.attr('class', 'y-axis axis')
let xAxisG = svg.append('g')
	.attr('class', 'x-axis axis')


let title = svg.append('text')
	.attr("class", "title")
	.attr('x', 0)
	.attr('y', -10)
	.attr("text-anchor", "middle");


// Initialize data
let data = null;// global variable

// Load CSV file
d3.csv("data/coffee-house-chains.csv", (d)=>{
	return {
		...d,
		revenue : +d.revenue,
		stores : +d.stores
	}
}).then((allSales)=>{
	data = allSales;
	updateVisualization();

});



// Add Event listener (reverse sort order)


let clickz = false;

d3.select('#change-sorting')
	.on('click', function(){
		clickz = !clickz;
		updateVisualization();
	})

// Add Event Listener (ranking type)


d3.select ("#ranking-type")
	.on("change", function(){
	updateVisualization();

});
// Render visualization


function updateVisualization() {
	

	let valz = document.querySelector('#ranking-type');


	valz = valz.options[valz.selectedIndex].value;
	// Sort data
if (clickz == false){
	data.sort(function(a,b){ return b[valz] - a[valz];})
}
else{
	data.sort(function(a,b){ return a[valz] - b[valz];})

}

	// Data join


let barz = svg.selectAll('.bar')
	.data(data, function(d){return d.company});
	

	// Update scale domains

y.domain([0,d3.max(data.map(function(d){return d[valz]}))]);
x.domain(data.map(d=>d.company));

barz.enter()
	.append('rect')
	.attr('class', 'bar')
	.attr('y', height)
	.attr('height', 1)
	.merge(barz)
	.style('opacity', 0.5)
	.transition()
	.duration(1000)
	.attr('y', function(d){return y(d[valz])})
	.attr('x', function(d){return x(d.company)})
	.style('opacity', 1)
	.attr('width', x.bandwidth())
	.attr('height', function(d){return height - y(d[valz])});
	
	

	// Exit

if (valz == 'revenue'){title.text('Billions USD');}
else{title.text('Stores')}

	// Draw Axes

yAxigG = svg.select('.y-axis')
	.transition()
	.duration(1000)
	.call(yAxis);

xAxisG = svg.select('.x-axis')
	.transition()
	.duration(1000)
	.attr("transform", "translate(0," + height + ")")
	.call(xAxis);




}