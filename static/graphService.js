const GraphService = (function() {
    return {
        renderLineGraph: function(data) {
            console.log("Data properties:", Object.keys(data[0]));

            // Clear the container before appending a new SVG
            d3.select("#graph-container").selectAll("*").remove();

            var margin = {top: 40, right: 80, bottom: 30, left: 80},
                width = 960 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom;

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


            // Define the div for the tooltip
            var tooltip = d3.select("#graph-container")
                .append("div")
                .attr("class", "tooltip")
                .style("opacity", 0)
                .style("position", "absolute")
                .style("padding", "10px")
                .style("background", "rgba(255, 255, 255, 0.9)")
                .style("border", "1px solid #ddd")
                .style("border-radius", "3px")
                .style("pointer-events", "none");

            // Add circles for hover effect for the price line
            svg.selectAll(".price-point")
                .data(data)
                .enter()
                .append("circle")
                .attr("class", "price-point")
                .attr("fill", "steelblue")
                .attr("stroke", "none")
                .attr("cx", function(d) { return x(new Date(d.date)); })
                .attr("cy", function(d) { return yLeft(d.price); })
                .attr("r", 5)
                .on("mouseover", function(event, d) {
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                    tooltip.html("Price: $" + d.price + " Comment: WIP")
                        .style("left", (x(new Date(d.date)) + margin.left) + "px")
                        .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", function(d) {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                });
        }
    };
})();
