var pixel = require('pixel');
var svg = require('pixel-to-svg');
var fs = require('fs');
var me = this;
var dir = require('node-dir');


var files = dir.files(__dirname, {sync:true, recursive:false});
//console.log(files);


// filters file array and returns an array of ONLY the png files
var filteredFiles = files.filter(function(legitFile) {
    return legitFile.match( /(png|jpg)/ );
});


/* If no files found, output status */
if (filteredFiles.length > 0) {

// filter for actual file name, not file path
    filteredFiles.forEach(function (item, index) {
        filteredFiles[index] = item.substring(item.lastIndexOf("/") + 1);
    });
    console.log("Found these guys: " + filteredFiles);

    filteredFiles.forEach(function (item, index) {

        pixel.parse('./' + item)
            .then(function (images) {

                /* save converted data in global var */
                me.convertedSVG = svg.convert(images[0]);
                //console.log(me.convertedSVG);

                /* create new file name for the svg file */
                var newName = item;
                newName = item.replace(/\.png/g, '').replace(/\.jpg/g, '');

                // save file metadata before going further to retrieve it later
                var tempMetadata = me.convertedSVG.substring(0, me.convertedSVG.indexOf('<g>')+3);
                //console.log(tempMetadata);

                console.log("looking for empty paths...\n");
                // create an array of paths to filter out the empty paths
                var pathArray = me.convertedSVG.split("<path");
                //console.log(pathArray);
                // keep only paths with FULL alpha channel values
                pathArray = pathArray.filter(function(path) {
                    return path.indexOf(',0)"') === -1;
                });
                //console.log(pathArray);

                pathArray.forEach(function(item, index) {
                    /* this ridiculous if statement is necessary to avoid appending "<path" to the metadata */
                    if (index < pathArray.length-1) {
                    pathArray[index+1] =  "<path" + pathArray[index+1];
                    }
                });
                // at this point the SVG is clean of 'empty' paths, but now needs to be pieced up together
                //console.log(pathArray);
                me.convertedSVG = pathArray.join('');

                /* Make sure there is a closing tag */
                me.convertedSVG += (me.convertedSVG.indexOf("</g></svg>") === -1) ? "</g></svg>" : "";
                console.log("look at this shiny new SVG! \n" + me.convertedSVG);

                /* appends a unique id to every path element */
                var counter = 0;
                me.convertedSVG = me.convertedSVG.replace(/<path/g, function () {
                    counter++;
                    return "<path id=" + "'" + newName + "-" + counter + "'";
                });


                fs.writeFile("./" + newName + ".svg", me.convertedSVG, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                });
                console.log(item + " has been converted.");
            });
    });
} else {
    console.log('No appropriate files found.');
}
