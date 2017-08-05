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
                console.log(item + " has been converted.");

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
            });
    });
} else {
    console.log('No appropriate files found.');
}
