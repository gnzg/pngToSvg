# pngToSvg

An adapatation of 59naga's pixel-to-svg project.

While the original converts PNG and JPG images to SVG path data, this project saves you time by instantly creating SVG files from the converted data. It also performs out of the box SVG optimization via svgo.

## SVG Optimization

In terms of file size reduction, naive test runs point at the fact that the best results are achieved with files that have smaller color palettes. As such, while it is possible to convert photographic images into SVGs, they will not really benefit from svgo's optimizations.

## Use

`node ./pngToSvg.js` with no parameters will convert all PNG/JPG files into SVGs within the root folder. If a directory parameter is provided, e.g. `node ./pngToSvg.js home/userFoo/myPNGs/`, pngToSvg will non-recursively convert all PNG/JPG files into SVGs inside of the provided folder.
