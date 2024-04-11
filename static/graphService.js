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

            // Define a class for all points for easier selection
            var allPoints = svg.selectAll(".data-point")
                .data(data)
                .enter()
                .append("g")
                .attr("class", "data-point")
                .each(function(d) {
                    var group = d3.select(this);
                    // Append price point
                    group.append("circle")
                        .attr("class", "price-point")
                        .attr("fill", d3.rgb("steelblue").darker(1))
                        .attr("stroke", "none")
                        .attr("cx", function(d) { return x(new Date(d.date)); })
                        .attr("cy", function(d) { return yLeft(d.price); })
                        .attr("r", 5);

                    // Append unobservable value point
                    group.append("circle")
                        .attr("class", "unobservable-point")
                        .attr("fill", d3.rgb("red").darker(1))
                        .attr("stroke", "none")
                        .attr("cx", function(d) { return x(new Date(d.date)); })
                        .attr("cy", function(d) { return yRight(d.unobservable_value); })
                        .attr("r", 5);
                });

            // Mouseover to highlight and show shared tooltip
            allPoints.on("mouseover", function(event, d) {
                // Highlight this point
                d3.select(this).selectAll('circle')
                    .transition()
                    .duration(200)
                    .attr("fill", "yellow") // Apply highlight color
                    .attr('r', 8); // Enlarge radius for highlight

                // Calculate position relative to the SVG
                var xPosition = x(new Date(d.date)) + margin.left;
                
                // Calculate the average y position of the two points
                var yPrice = yLeft(d.price);
                var yValue = yRight(d.unobservable_value);
                var yPosition = (yPrice + yValue) / 2 + margin.top;

                // Get the position of the SVG element on the page
                var svgTop = document.getElementById("graph-container").getBoundingClientRect().top + window.scrollY;
                var svgLeft = document.getElementById("graph-container").getBoundingClientRect().left + window.scrollX;

                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html("Date: " + d.date.toLocaleDateString() + "<br>Price: $" + d.price + "<br>Unobservable Value: " + d.unobservable_value + "<br>Comment: WIP")
                    .style("left", (svgLeft + xPosition - 50) + "px") // Adjust for the width of the tooltip if necessary
                    .style("top", (svgTop + yPosition - 30) + "px"); // Position in the middle of the y values
            })
            .on("mouseout", function(d) {
                // Remove highlight
                d3.select(this).selectAll('circle')
                    .transition()
                    .duration(500)
                    .attr("fill", function(d) { // Reset fill color based on data point type
                        return this.classList.contains('price-point') ? d3.rgb("steelblue").darker(1) : d3.rgb("red").darker(1);
                    })
                    .attr('r', 5); // Reset radius to normal size

                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });



        }
    };
})();
