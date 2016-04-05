$( document ).ready(function() {
    console.log( "ready!" );
});

var margin = {
  top:20,
  right:50,
  bottom:30,
  left:70
};

var width = 800 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

//url campaign finance data
var filerId = 931;
var url = 'http://54.213.83.132/hackoregon/http/current_candidate_transactions_in/' + filerId + '/';

//json and date parsing
d3.json(url, function(json){
  var data = json;
  var parseDate = d3.time.format('%Y-%m-%d').parse;
  var dataSet = data.map(function(item) {
    return {
      date: parseDate(item.tran_date),
      amount: item.amount
    }
  });


//sorting function
function sortDates(a, b) {
  return a.date - b.date;
};

//mapping function takes care of multiple instances of the same amt/date
var dates = _.map(dataSet, 'date');
var amounts = _.map(dataSet, 'amount');

//x, y values
var x = d3.time.scale()   //similar to linear scale but specific to time/date
  .domain(d3.extent(dates))  //extent method works like using max and min at same time
  .range([0, width]);
var y = d3.scale.linear()
  .domain(d3.extent(amounts))
  .range([height, 0]);

//calling sort funtion on dataSet
dataSet.sort(sortDates);

//axes
var xAxis = d3.svg.axis().scale(x)
  .orient('bottom').ticks(6);
var yAxis = d3.svg.axis().scale(y)
  .orient('left').ticks(10);

//attaching svg to html
var svg = d3.select('#content').append('svg')
  .attr('width', width + margin.left + margin.right)  //attr: css manipulation
  .attr('height', height + margin.top + margin.bottom)
  .append('g')  //g is graphic
  .attr('transform', 'translate(' + margin.left +', ' + margin.top +')');
      //transform, translate scales data (not literal representation) for readability?

//path function to generate line
var path = d3.svg.line()
  .x(function(d){
    return x(d.date)  //attaches date values data to x coord
  })
  .y(function(d){
    return y(d.amount)  //attached amount values data to y coord
  })
  .interpolate('basis')  //interpolate works like a transition to map value to output (ie. color)
                        //basis helps smooth over extreme spikes in the graph


//append path to svg element
svg.append('path')
  .attr('class', 'line')
  .attr('d', path(dataSet))

//calling axis labels to each element in array as outlined above
svg.append('g')
  .attr('class', 'x axis')
  .attr('transform', 'translate(0,' + height + ')')
  .call(xAxis);
svg.append('g')
  .attr('class', 'y axis')
  .call(yAxis);  //no transform, translate becuase no no need to scale in relation to graph?
});
