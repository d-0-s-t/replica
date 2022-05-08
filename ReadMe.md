# VectorBloom

This is a literal 2D flower generator. Flowers are rendered as SVG elements in DOM and can either be exported as json or SVG files.

A demo is hosted here:
[d0st.me/art/flowers](https://d0st.me/art/flowers)

# Installation 
If you are using node, install with

```
npm install vector-bloom
```

If not, just import the module [src/vector-boom.js](https://github.com/d-0-s-t/vector-bloom/blob/main/src/vector-bloom.js). (If you are not using a bundler, take note to fix the imports)

# Usage

Create a beautiful flower

```
const currentConfig = {
  "petals": [{
      "geometry": {
        "width": 18,
        "count": 18,
        "length": 242
      }
	}],
  "center": {
    "radius": 180,
    "arrangement": [{
		"geometry": {
        	"density": 5.08,
        	"range": [ 0, 0.85],
        	"size": [ 1, 5],
        	"age": [ 0.4, 0.8]
			}
		}]
	}
}
currentFlower = new VectorBloom(currentConfig)
```

For additional help with flower configurations:
1. Check flower configs in the examples folder 
2. Check type files
3. Use the [generator](https://d0st.me/art/flowers) (recommended)

Draw flower inside html element:

```
htmlDivElement.appendChild(currentFlower.svgElement)
```
To draw the same flower multiple times you can either create new VectorBloom objects or cloneNode on flower's svg element:

```
htmlDivElement.appendChild(currentFlower.svgElement.cloneNode(true))
```

Flowers can also be rendered on a canvas. This is useful when svg rendering is slowing down the page. 

```
currentFlower.renderOnCanvas(canvasElement)
```

By default flowers are rendered at the center of canvas element. But this can be changed by passing additional parameters to the renderOnCanvas method:
```
//This will render a 60px*60px flower at 100px left and 50px top
currentFlower.renderOnCanvas(canvasElement, 100, 50, 60, 60)
```

Update Methods after config change:
```
//To update flower after config change
currentFlower.update()

//update only geometry?
currentFlower.updateGeometry()

//updated only styles?
currentFlower.updateStyles()

//Sometimes you may want to update the bounds of the flower to fit the drawing correctly
currentFlower.updateDrawingSize()
```

Export Methods:
```
//export flower as svg string
currentFlower.export("svgString")

/**
* Export flower as file string. This basically adds an xml header to the svg string.
* This is useful in exporting the flower as an svg file for further editing in a 
* Vector graphics tool like inkscape.
*/
currentFlower.export("svgFileString")

//export image url. This url can be directly set to an image element's src attribute.
currentFlower.export("imageURL")

//export as pretty JSON string.
currentFlower.export("jsonString")
```

# Development

Uses parcel to create commonjs and module js files. After working with the source files, create assets for package consumption using:

```
npm run build 
```

This will generate the js files inside a **dist** directory with type files (yes from js).
