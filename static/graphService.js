const GraphService = (function() {
    return {
        renderLineGraph: function(data) {
            // Clear the container before appending a new SVG
            d3.select("#graph-container").selectAll("*").remove();

            var margin = {top: 10, right: 30, bottom: 30, left: 60},
                width = 460 - margin.left - margin.right,
                height = 400 - margin.top - margin.bottom;

            var svg = d3.select("#graph-container")
              .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
              .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            var x = d3.scaleTime()
              .domain(d3.extent(data, function(d) { return new Date(d.date); }))
              .range([0, width]);
            svg.append("g")
              .attr("transform", `translate(0,${height})`)
              .call(d3.axisBottom(x));

            var y = d3.scaleLinear()
              .domain([0, d3.max(data, function(d) { return +d.price; })])
              .range([height, 0]);
            svg.append("g")
              .call(d3.axisLeft(y));

            var line = d3.line()
                .x(function(d) { return x(new Date(d.date)); })
                .y(function(d) { return y(d.price); });

            svg.append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("d", line);
        }
    };
})();
