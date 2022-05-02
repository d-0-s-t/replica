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
currentFlower = new VectorBloom(currentConfig, emptyDivContainer)
```

Stroke, fills and shadow effects are possible with additional config. Check flower configs in the examples folder (or check the type files) for additional config options.

```
//render flower as svg inside a dom element
currentFlower.drawSVG(container)

//modified just the colour, stroke and shadow effects?
currentFlower.applyStyles()

//get Flower as pretty JSON
currentFlower.getJSON()

//get Flower as svg. This svg can be saved as a file to be edited in any Vector Graphics Editing tool.
currentFlower.getSVG()
```



