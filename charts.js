function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector.append("option").text(sample).property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Demographics Panel
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter((sampleObj) => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

//**************************************
// DELIVERABLE 1: Create a Bar Chart
//**************************************

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array.
    let sampleDataArr = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    let desiredSampleArr = sampleDataArr.filter((sampleObj) => {
      return sampleObj.id == sample;
    });
    //  5. Create a variable that holds the first sample in the array.
    let desiredSampleObj = desiredSampleArr[0];
    console.log("Sample Object: ", desiredSampleObj);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    let otu_ids = desiredSampleObj.otu_ids;
    let otu_lables = desiredSampleObj.otu_labels.slice(0, 10).reverse();
    let sample_values = desiredSampleObj.sample_values.slice(0, 10).reverse();
    console.log("labels:", otu_lables);
    console.log("ids:", otu_ids);
    console.log("values:", sample_values);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order
    //  so the otu_ids with the most bacteria are last.

    var yticks = otu_ids
      .map((s) => "OTU " + s)
      .slice(0, 10)
      .reverse();

    // 8. Create the trace for the bar chart.
    var barData = [
      {
        x: sample_values,
        y: yticks,
        type: "bar",
        orientation: "h",
        text: otu_lables
      }
    ];
    // 9. Create the layout for the bar chart.
    var barLayout = {
      title: "<b>Top 10 Bacteria Cultures Found</b>"
    };
    // 10. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bar", barData, barLayout);

    //**************************************
    // DELIVERABLE 2: Create a Bubble Chart
    //**************************************

    // 1. Create the trace for the bubble chart.
    var bubbleData = [
      {
        x: otu_ids,
        y: desiredSampleObj.sample_values,
        text: desiredSampleObj.otu_labels,
        mode: "markers",
        marker: {
          size: desiredSampleObj.sample_values,
          color: desiredSampleObj.sample_values,
          colorscale: "Rainbow"
        }
      }
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "<b>Bacteria Cultures Per Sample</b>",
      xaxis: { title: "OTU ID" },
      automargin: true,
      hovermode: "closest"
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    //**************************************
    // DELIVERABLE 3: Create a Gauge Chart
    //**************************************

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    let metadataArray = data.metadata;
    let desiredMetadataArr = metadataArray.filter((s) => s.id == sample);

    // 2. Create a variable that holds the first sample in the metadata array.
    let desiredMetadataObj = desiredMetadataArr[0];
    console.log("metadata: ", desiredMetadataObj);

    // 3. Create a variable that holds the washing frequency.
    let desiredWashFreq = desiredMetadataObj.wfreq;
    console.log("washing Freq: ", desiredWashFreq);

    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        value: desiredWashFreq,
        type: "indicator",
        mode: "gauge+number",
        title: {
          text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week"
        },
        gauge: {
          axis: { range: [null, 10], dtick: "2" },
          bar: { color: "black" },
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "yellowgreen" },
            { range: [8, 10], color: "green" }
          ],
          dtick: 2
        }
      }
    ];

    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { automargin: true };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
