# pixel2node2svg

An adapatation of 59naga's pixel-to-svg project. Check it out here https://github.com/59naga/pixel-to-svg

While the original converts PNG and JPG images to SVG path data, this project saves you time by instantly creating SVG files from the converted data. It also performs out of the box SVG optimization via svgo.

## SVG Optimization

In terms of file size reduction, naive test runs point at the fact that the best results are achieved with files that have smaller color palettes. As such, while it is possible to convert photographic images into SVGs, they will not really benefit from svgo's optimizations.

## Use

``` 
node pixel2node2svg.js
// Enter image name, e.g. test-0.png
// Conversion will now take place, if the file exists
// Output to file system: test-0.svg
```
