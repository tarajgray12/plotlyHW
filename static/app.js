function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    url=`/metadata/${sample}`

    d3.json(url).then(function(data) {
      newFunction(data);
      //console.log(data.WFREQ)
 
    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
    })
};

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  url=`/samples/${sample}`
  d3.json(url).then(function(sample_data) {
    
    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: sample_data.otu_ids, 
      y: sample_data.sample_values,
      mode: "markers",
      marker: {
         color: sample_data.otu_ids,
         size: sample_data.sample_values
      },
      text: sample_data.otu_labels
    };
    
    var layout = {
      title: "Bubble chart",
      xaxis: {title: 'OTU ID'},
      showlegend: false,
    };

    var trace = [trace1]
    Plotly.newPlot("bubble", trace, layout)
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    console.log(sample_data.otu_labels.slice(0, 10))
    tracepie = {
      "values" : sample_data.sample_values.slice(0, 10),
      "labels" : sample_data.otu_ids.slice(0, 10),
      "name" : sample_data.otu_labels.slice(0, 10),
      "hovertext": sample_data.otu_labels.slice(0, 10),
      "type" : "pie"
    };
    layout = {
      // hoverinfo: "name",
      title: "Top 10 details"
    }
    data = [tracepie]
    Plotly.newPlot("pie", data)
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
