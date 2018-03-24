const pixel = require('pixel');
const svg = require('pixel-to-svg');
const fs = require('fs');
const me = this;
const dir = require('node-dir');
const SVGO = require('svgo');
const svgo = new SVGO();
const readline = require('readline');

var files;
var directoryOfPngs;

// provide option to target folder with PNGs
// via process.argv
// val should be provided as an absolute path
process.argv.forEach(function (val, index, array) {
  //console.log(index + ': ' + val);
  // array[2] is the reference to the passed target folder
  directoryOfPngs = array.length === 3 ? array[2] : __dirname;
//  files = dir.files(directoryOfPngs, {sync:true, recursive:false});
  files = dir.files(directoryOfPngs, {sync:true, recursive:false});

  // See number of arguments
  // if (index === array.length-1) console.log('argument length is', array.length);
});



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

        pixel.parse(directoryOfPngs + item)
            .then(function (images) {

                console.log("Converting "+item+"...");

                /* save converted data in global var */
                me.convertedSVG = svg.convert(images[0]);
                //console.log(me.convertedSVG);

                // optimize converted file via svgo
                // to compare file size reduction comment the following three lines out and run pixel2node2svg
                svgo.optimize(me.convertedSVG, function(result) {
                   me.convertedSVG = result.data;
                });

                /* create new file name for the svg file */
                var newName = item;
                newName = item.replace(/\.png/g, '').replace(/\.jpg/g, '');

                // save file metadata before going further to retrieve it later
                //var tempMetadata = me.convertedSVG.substring(0, me.convertedSVG.indexOf('<g>')+3);
                //console.log(tempMetadata);

                console.log("Looking for empty paths...");
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
                me.convertedSVG += (me.convertedSVG.indexOf("</svg>") === -1) ? "</svg>" : "";
                //console.log("look at this shiny new SVG! \n" + me.convertedSVG);

                /* appends a unique id to every path element */
                var counter = 0;
                me.convertedSVG = me.convertedSVG.replace(/<path/g, function () {
                    counter++;
                    return "<path id=" + "'" + newName + "-" + counter + "'";
                });


                fs.writeFile(directoryOfPngs + newName + ".svg", me.convertedSVG, function (err) {
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
