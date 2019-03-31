function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  
  // Use `d3.json` to fetch the metadata for a sample
    var url =`/metadata/${sample}`
    d3.json(url).then(function(data){
  
    // Use d3 to select the panel with id of `#sample-metadata`
    var metaData = d3.select("#sample-metadata");
    metaData.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(data).forEach(([key, value]) => {
      // metadata.append.text([key, value]);
      metaData.append("h6").text(`${key}:  ${value}`);
    });
  });
}
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  url = `/samples/${sample}`
  d3.json(url).then(function(sampleData) {
    // @TODO: Build a Bubble Chart using the sample data
    var bubble = {
      x: sampleData.otu_ids,
      y: sampleData.sample_values,
      mode: "markers",
      marker: {
        color: sampleData.otu_ids,
        size: sampleData.sample_values,
      },
      text: sampleData.otu_lables
    };
    var layout = {
      title: "Bubble chart",
      xaxis: {title: 'OTU ID'},
      showlegend: false,
    };
    var bubbleData = [bubble]
    Plotly.newPlot("bubble", bubbleData, layout)

    // @TODO: Build a Pie Chart
    var data = [];
    for (var i=0; i<sampleData.otu_ids.length; i++) {
      data.push({'id': sampleData.otu_ids[i], 'label': sampleData.otu_labels[i], 'value': sampleData.sample_values[i]});
    }
    data.sort(function(a, b){return b.value-a.value})
    var slicedData= data.slice(0, 10);

    var pie = {
      "labels": slicedData.map(sd=> sd.id),
      "values": slicedData.map(sd => sd.value),
      "type": "pie",
      "hovertext": slicedData.map(sd => sd.label)
    };

    var pieData= [pie];
    console.log(slicedData);
    Plotly.newPlot("pie", pieData);
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    

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