# pixel2node2svg

An adapatation of 59naga's pixel-to-svg project. Check it out here https://github.com/59naga/pixel-to-svg

While the original converts PNG and JPG images to SVG path data, this project saves you time by instantly creating SVG files from the converted data. It also performs out of the box SVG optimization via svgo.

## SVG Optimization

In terms of file size reduction, naive test runs point at the fact that the best results are achieved with files that have smaller color palettes. As such, while it is possible to convert photographic images into SVGs, they will not really benefit from svgo's optimizations.

## Use

Navigate to the project root and place your png/jpg files there. Then, run ``` node pixel2node2svg.js```. Conversion will now take place, if appropriate files exist.

