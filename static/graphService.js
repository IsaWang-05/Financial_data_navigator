const GraphService = (function() {
    return {
        renderLineGraph: function(data) {
            console.log("Data properties:", Object.keys(data[0]));

            // Clear the container before appending a new SVG
            d3.select("#graph-container").selectAll("*").remove();

            var margin = {top: 40, right: 60, bottom: 30, left: 60}, 
                width = 760 - margin.left - margin.right,
                height = 400 - margin.top - margin.bottom;

            var svg = d3.select("#graph-container")
              .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
              .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            // x-axis scale
            var x = d3.scaleTime()
              .domain(d3.extent(data, function(d) { return new Date(d.date); }))
              .range([0, width]);
            svg.append("g")
              .attr("transform", `translate(0,${height})`)
              .call(d3.axisBottom(x));

            // Left y-axis scale
            var yLeft = d3.scaleLinear()
              .domain([0, d3.max(data, function(d) { return +d.price; })])
              .range([height, 0]);
            var yAxisLeft = svg.append("g")
              .call(d3.axisLeft(yLeft));

            // Left y-axis label on top
            svg.append("text")
              .attr("transform", `translate(${-margin.left / 2}, ${-10})`) // Positioning label on top
              .style("text-anchor", "middle")
              .text("Price ($)");

            // Right y-axis scale
            var yRight = d3.scaleLinear()
              .domain([0, d3.max(data, function(d) { return +d.unobservable_value; })])
              .range([height, 0]);
            var yAxisRight = svg.append("g")
              .attr("transform", `translate(${width}, 0)`)
              .call(d3.axisRight(yRight));

            // Right y-axis label on top
            svg.append("text")
              .attr("transform", `translate(${width + margin.right - 20}, ${-10})`)
              .style("text-anchor", "end")
              .text("Unobservable Value");

            // Line for price
            var priceLine = d3.line()
                .x(function(d) { return x(new Date(d.date)); })
                .y(function(d) { return yLeft(d.price); });

            // Line for unobservable value
            var unobservableValueLine = d3.line()
                .x(function(d) { return x(new Date(d.date)); })
                .y(function(d) { return yRight(d.unobservable_value); });

            // Append price line to svg
            svg.append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("d", priceLine);

            // Append unobservable value line to svg
            svg.append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", "red") 
                .attr("stroke-width", 1.5)
                .attr("d", unobservableValueLine);
        }
    };
})();
