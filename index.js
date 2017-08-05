var pixel = require('pixel');
var svg = require('pixel-to-svg');
var fs = require('fs');
var convertedSVG;
var me = this;
var prompt = require('prompt');

/* ask user to set name of origin file and name of new file once converted */
prompt.start();

prompt.message = "Convert what to SVG? Enter";
prompt.delimiter = ' ';
prompt.get(['fileName'], function (err = null, result) {

    /* only perform conversion if a file type has been provided */
    if (result.fileName.indexOf(".")>-1) {

        pixel.parse('./' + result.fileName)
            .then(function (images) {
                /* console.log(svg.convert(images[0])); */
                me.convertedSVG = svg.convert(images[0]);
                //console.log(me.convertedSVG);

                /* create new file name for the svg file */
                var newName = result.fileName;
                newName = newName.replace(/\.png/g, '').replace(/\.jpg/g, '');
                //console.log(newName);

                /* appends a unique id to every path element */
                var counter = 0;
                me.convertedSVG = me.convertedSVG.replace(/<path/g, function() {
                    counter++;
                    return "<path id="+"'"+newName+"-"+counter+"'";
                });

                fs.writeFile("./" + newName + ".svg", me.convertedSVG, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("The file was saved!");
                });
            });
    } else {
        console.log('Invalid input. Forgot the file extension?');
    }
});
