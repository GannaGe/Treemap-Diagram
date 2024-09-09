let movieDataURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";

d3.json(movieDataURL).then((data, error) => {
  if (error) {
    console.log(error);
  } else {
    movieData = data;
    console.log(movieData);
    treeMap();
  }
});

let canvas = d3.select("#canvas");
let legend = d3.select("#legend");

let tooltip = d3
  .select("body")
  .append("div")
  .attr("id", "tooltip")
  .style("width", "200px")
  .style("height", "auto")
  .style("padding", "5px")
  .style("visibility", "hidden")
  .style("background-color", "yellow")
  .style("opacity", 0.8);

let movieData;

let treeMap = () => {
  let family = d3
    .hierarchy(movieData, (node) => {
      return node["children"];
    })
    .sum((node) => {
      return node["value"];
    })
    .sort((node1, node2) => {
      return node2["value"] - node1["value"];
    });
  console.log(family.leaves());

  let drawTreeMap = d3.treemap().size([1000, 600]);

  drawTreeMap(family);

  let tiles = family.leaves();
  console.log(tiles);

  let section = canvas
    .selectAll("g")
    .data(tiles)
    .enter()
    .append("g")
    .attr("transform", (movie) => {
      return "translate(" + movie["x0"] + ", " + movie["y0"] + ")";
    });

  section
    .append("rect")
    .attr("class", "tile")
    .attr("fill", (movie) => {
      let category = movie["data"]["category"];
      if (category === "Action") {
        return "#f5426f";
      } else if (category === "Drama") {
        return "#edc351";
      } else if (category === "Adventure") {
        return "#d3ed51";
      } else if (category === "Family") {
        return "#51ed95";
      } else if (category === "Animation") {
        return "#42a7f5";
      } else if (category === "Comedy") {
        return "#f542a4";
      } else {
        return "#b451ed";
      }
    })
    .attr("data-name", (movie) => {
      return movie["data"]["name"];
    })
    .attr("data-category", (movie) => {
      return movie["data"]["category"];
    })
    .attr("data-value", (movie) => {
      return movie["data"]["value"];
    })
    .attr("width", (movie) => {
      return movie["x1"] - movie["x0"];
    })
    .attr("height", (movie) => {
      return movie["y1"] - movie["y0"];
    })
    .on("mouseover", (event, movie) => {
      tooltip.transition().style("visibility", "visible");
      tooltip
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 28 + "px");

      tooltip.text(
        "name: " +
          movie["data"]["name"] +
          ", " +
          "category: " +
          movie["data"]["category"] +
          ", " +
          "value: " +
          movie["data"]["value"]
      );

      document
        .querySelector("#tooltip")
        .setAttribute("data-value", movie["data"]["value"]);
    })
    .on("mouseout", (event) => {
      tooltip.transition().style("visibility", "hidden");
    });

  section
    .append("text")
    .selectAll("tspan")
    .data((movie) => {
      return movie["data"]["name"].split(/(?=[A-Z][^A-Z])/g);
    })
    .enter()
    .append("tspan")
    .attr("x", 5)
    .attr("y", (movie, i) => {
      return 13 + i * 10;
    })
    .text((movie) => {
      return movie;
    });
};
