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
// filter for actual file name, not file path
filteredFiles.forEach(function (item, index) {
    filteredFiles[index] = item.substring(item.lastIndexOf("/") + 1);
});
console.log("Found these guys: " + filteredFiles);

filteredFiles.forEach(function(item, index ) {

        pixel.parse('./' + item)
            .then(function (images) {
                /*console.log(svg.convert(images[0]));*/
                me.convertedSVG = svg.convert(images[0]);
                //console.log(me.convertedSVG);

                /* create new file name for the svg file*/
                var newName = item;
                newName = item.replace(/\.png/g, '').replace(/\.jpg/g, '');
                console.log(item + " has been converted.");

                fs.writeFile("./" + newName + ".svg", me.convertedSVG, function (err) {
                    if (err) {
                        return console.log(err);
                    }

                });
            });
});
