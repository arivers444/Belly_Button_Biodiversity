function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
        console.log(data);
        var sampleNames = data.names;
        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
    });
})}
 
init();

function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
};

function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var PANEL = d3.select("#sample-metadata");

        PANEL.html("");
        PANEL.append("h6").text('ID: ' + result.id);
        PANEL.append("h6").text('ETHNICITY: ' + result.ethnicity);
        PANEL.append("h6").text('GENDER: ' + result.gender);
        PANEL.append("h6").text('AGE: ' + result.age);
        PANEL.append("h6").text('LOCATION: ' + result.location);
        PANEL.append("h6").text('BBTYPE: ' + result.bbtype);
        PANEL.append("h6").text('WFREQ: ' + result.wfreq);
        
    });
};

function buildCharts(sample) {
    d3.json("samples.json").then((data) => {
        var samples = data.samples;
        var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var PANEL = d3.select("#bar");

        var sampleValues = result.sample_values;
        var sampleValuesSort = sampleValues.sort((first, second) => second - first);
        var sampleValuesSlice = sampleValuesSort.slice(0,10);
        var sampleValuesSliceRev = sampleValuesSlice.reverse();
        
        var otuids = result.otu_ids;
        var otuIDs = result.otu_ids.map(id => `OTU ${id}`);
        var otuLabels = result.otu_labels;
        

        PANEL.html("");
        var trace = {
            x: sampleValuesSliceRev,
            y: otuIDs,
            type: "bar",
            orientation: 'h',
            text: otuLabels
        };

        Plotly.newPlot("bar", [trace]);

        var trace2 = {
            x: otuids,
            y: sampleValues,
            mode: "markers",
            marker: {
                size: sampleValues,
                color: otuids
            },
            text: otuLabels,
        };

        var layout2 ={
            xaxis: {
                title: {
                    text: 'OTU ID'
                }
            }
        };

        Plotly.newPlot("bubble", [trace2], layout2);



    });
};
