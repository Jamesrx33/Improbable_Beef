function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
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
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
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

// 1.1. Create the buildCharts function.
function buildCharts(sample) {
  // 1.2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 1.3. Create a variable that holds the samples array. 
    let samples = data.samples

    // 1.4. Create a variable that filters the samples for the object with the desired sample number.
    let filtered = samples.filter(x => x.id == sample)
    //  1.5. Create a variable that holds the first sample in the array.
    let subject = filtered[0]

    // 1.6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    let otu_ids = subject.otu_ids
    let otu_labels = subject.otu_labels
    let sample_values = subject.sample_values

    // 3.1, 3.2, 3.3 Create a variable that holds the washing frequency.
    let Meta = data.metadata
    let filteredMeta = Meta.filter(x => x.id == sample)[0]
    var wFreq = parseFloat(filteredMeta.wfreq)

    // 1.7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

     var yticks = otu_ids.slice(0,10).map(x => "OTU " + x).reverse();

    // 1.8. Create the trace for the bar chart. 
     var barData = [{
      x: sample_values.slice(0,10).reverse(),
      y: yticks,
      type:"bar",
      orientation: "h",
      hovertext: otu_labels.slice(0,10).reverse()
     }];
    // 1.9. Create the layout for the bar chart. 
     var barLayout = {
     title: "Top 10 Bacteria Cultures Found",
     yaxis: {
      tickmode: "array", // If "array", the placement of the ticks is set via `tickvals` and the tick text is `ticktext`.
      tickvals: yticks
    }
   };

   var config = {responsive: true}

    // 1.10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout, config)

    console.log("Bar Chart Compiled")

  // Bubble charts section
    // 2.1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      hovertext: otu_labels,
      mode: "markers",
      marker: {
        color: otu_ids,
        colorscale: "Earth",
        size: sample_values
      }
    }
    ];

    // 2.2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID", automargin: true},
      yaxis: {automargin: true},
      hovermode: 'closest'
    };

    // 2.3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout, config); 

    console.log("Bubble Chart Compiled")

    // 3.4. Create the trace for the gauge chart.
    var gaugeData = [{
      type: "indicator",
      mode: "gauge+number",
      value: wFreq,
      title: { text: "Scrubs per Week"},
      gauge: {
        axis: { range: [0, 10] },
        bar: { color: "black" },
        steps: [
          { range: [0, 2], color: "crimson" },
          { range: [2, 4], color: "pink" },
          { range: [4, 6], color: "navajowhite" },
          { range: [6, 8], color: "palegreen" },
          { range: [8, 10], color: "forestgreen" }
        ],
      }
    }
    ];
        
    // 3.5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 500,
      height: 250,
      margin: { t: 25, r: 25, l: 25, b: 25 },
      font: { color: "midnightblue", family: "Arial" }
    };

  
    
    // 3.6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout, config);

    console.log("Gauge Chart Compiled")

  });
}
