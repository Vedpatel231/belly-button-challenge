// Start the webpage
function init() {
    // Get data from the file
    d3.json("samples.json").then(data => {
        // Fill the dropdown with names
        var dropdown = d3.select("#selDataset");
        data.names.forEach(name => {
            dropdown.append("option").text(name).property("value", name);
        });

        // Show info for the first name
        showInfo(data.names[0], data);

        // Add event listener for dropdown changes
        dropdown.on("change", function() {
            var newSample = d3.select(this).property('value');
            newName(newSample);
        });
    });
}

// When you pick a new name
function newName(newSample) {
    // Get data again and show info for the new name
    d3.json("samples.json").then(data => {
        showInfo(newSample, data);
    });
}

// Show info for the name you picked
function showInfo(sample, data) {
    // Find the person's details
    var personDetails = data.metadata.find(obj => obj.id == sample);

    // Clear the old details and show the new ones
    var detailsBox = d3.select("#sample-metadata");
    detailsBox.html("");
    for (var key in personDetails) {
        detailsBox.append("h6").text(`${key}: ${personDetails[key]}`);
    }

    // Set up the bar chart with top 10 data
    var personData = data.samples.find(obj => obj.id == sample);
    var barChart = [{
        x: personData.sample_values.slice(0, 10),
        y: personData.otu_ids.slice(0, 10).map(id => `OTU ${id}`),
        text: personData.otu_labels.slice(0, 10),
        type: 'bar',
        orientation: 'h'
    }];
    Plotly.newPlot('bar', barChart);

    // Set up the bubble chart
    var bubbleChart = [{
        x: personData.otu_ids,
        y: personData.sample_values,
        mode: 'markers',
        marker: {
            size: personData.sample_values,
            color: personData.otu_ids
        }
    }];
    Plotly.newPlot('bubble', bubbleChart);
}

// Make the webpage start
init();
