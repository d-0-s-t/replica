import { VectorBloomPoint } from "./vector-bloom-point.js"
import { VectorBloomPath, VectorBloomNode } from "./vector-bloom-path.js"

/**
 * @typedef BloomConfig
 * @property {PetalConfig[]} petals
 * @property {CenterConfig[]} [center]
 */

/**
 * @typedef CenterConfig
 * @property {number} radius The radius of the flower center
 * @property {CenterArrangment[]} arrangement
 */

/** 
 * @typedef PetalConfig
 * 	@property {PetalGeometry} geometry
 * 	@property {FillStyle} [fill]
 */

/** 
 * @typedef FillStyle
 * @property {GradientStop[]} color hex string
 * @property {number} strokeWidth?
 * @property {string} strokeColor? hex string
 * @property {ShadowConfig} [shadow]
 */

/** 
 * @typedef ShadowConfig
 * @property {number} [offsetX] 
 * @property {number} [offsetY]
 * @property {number} blur
 * @property {string} [color] hex string
 * @property {number} [opacity]
 */

/** 
 * @typedef GradientStop
 * @property {string} color
 * @property {number} [offset]
 */

/** 
 * @typedef PetalGeometry
 * @property {number} width
 * @property {number} count
 * @property {number} length
 * @property {number} [innerWidth]
 * @property {number} [outerWidth]
 * @property {number} [angleOffset]
 * @property {number} [radialOffset]
 * @property {number} [balance]
 * @property {number} [smoothing]
 * @property {boolean} [extendOutside]
 * @property {number} [offsetX]
 * @property {number} [offsetY]
 */

/** 
 * @typedef CenterArrangment
 * @property {CenterGeometry} geometry
 * @property {CenterFill}	[fill] 
 */


/** 
 * @typedef CenterFill 
 * @property {FillStyle} base
 * @property {FillStyle} tip Based on age, tips don't always exist
 * @property {string} [background] a hex color value
 */

/** 
 * @typedef CenterGeometry
 * @property {Array<number>} age 0 forms a sleeping floret. Array length is 2
 * 0.5 makes a vertical floret
 * 1 makes a floret radiating outward
 * This is an array of two integers between 0 1, 
 * Age is linearly mapped along the radius
 * @property {Array<number>} [range] Range is the percentage range of center to occupy. Array length is 2
 * ex: [0,1] occupies the full center
 * [0.75, 1] occupies outer 25 percent of the center radius
 * @property {number} density How closely the center elements are packed
 * @property {Array<number>} size Linearly mapped along radius. Array length is 2
 */

const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2
const GOLDEN_RADIANS = 2 * (Math.PI - (GOLDEN_RATIO * Math.PI / (1 + GOLDEN_RATIO)))
const DEFAULT_PAGE_SIZE = 512

export class VectorBloom {
	/**
	 * @param {BloomConfig} config 
	 * @param {HTMLElement} [container]
	 */
	constructor(config, container) {
		VectorBloom.FillDefaults(config)

		this.petals = /** @type {VectorBloomPath[][]} */ ([])
		this.center = /** @type {CenterArrangement[]} */ ([])
		this.backgrounds = /** @type {SVGCircleElement[]} */ ([])
		this.config = config
		this.currentContainer = container
		this.zoomLevel = 1
		const _this = this
		this.svgElement = createSVGElement(DEFAULT_PAGE_SIZE)
		this.drawingWidth = DEFAULT_PAGE_SIZE

		/**
		 * assign a unique id to this flower so that the elements created 
		 * do not have overlapping ids. Hope this is enough
		 */
		this.flowerID = (Math.random() + "").replace(".", "")


		this.svgElement.addEventListener("wheel", function( /** @type {WheelEvent} */ event) {
			event.preventDefault()
			_this.zoomLevel += event.deltaY * 0.001
			_this.zoomLevel = Math.max(0.1, Math.min(_this.zoomLevel, 5))
			_this.zoomDrawing(_this.zoomLevel)
		})

		this.createElements()

		if (this.currentContainer) {
			this.drawSVG(this.currentContainer)
			this.fitDrawing()
		}
	}

	createElements() {
		this.petals.length = 0
		this.center.length = 0
		this.backgrounds.length = 0
		this.config.petals.forEach((petalConfig) =>
			this.petals.unshift(createPetals(petalConfig, this.config.center.radius)))
		this.config.center.arrangement.forEach(arrangement => {
			this.center.unshift(createCenter(arrangement.geometry, this.config.center.radius))
			if (arrangement.fill.background) {
				this.backgrounds.push(createCircleElement({
					radius: this.config.center.radius * Math.max.apply(null, arrangement.geometry.range),
					color: arrangement.fill.background
				}))
			}
		})
		this.backgrounds.sort((c1, c2) => {
			const r1 = parseFloat(c1.getAttribute("r"))
			const r2 = parseFloat(c2.getAttribute("r"))
			return r2 - r1
		})
	}

	/**
	 * @param {HTMLElement} container 
	 */
	drawSVG(container) {
		if (container)
			this.currentContainer = container
		container.appendChild(this.svgElement)

		const elementsInsertionTarget = this.svgElement.querySelector("g")
		elementsInsertionTarget.innerHTML = ""

		this.backgrounds.forEach(c => elementsInsertionTarget.appendChild(c))
		this.petals.forEach((petalArray, i) => {
			const g = document.createElementNS("http://www.w3.org/2000/svg", "g")
			elementsInsertionTarget.appendChild(g)
			g.setAttribute("fill", `url(#petal${this.flowerID}-Gradient-${i})`)
			g.id = `petalGroup${this.flowerID}-${i}`
			g.classList.add(`petalStyles${this.flowerID}-${i}`)
			petalArray.forEach(petal => g.appendChild(petal.element))
		})
		this.center.forEach((arrangement, i) => {
			const baseG = document.createElementNS("http://www.w3.org/2000/svg", "g")
			baseG.setAttribute("fill", `url(#centerBase${this.flowerID}-Gradient-${i})`)
			baseG.id = `centerBaseGroup${this.flowerID}-${i}`
			arrangement.bases.forEach(base => {
				baseG.appendChild(base.element)
			})
			baseG.classList.add(`centerBaseStyles${this.flowerID}-${i}`)
			elementsInsertionTarget.appendChild(baseG)

			const tipG = document.createElementNS("http://www.w3.org/2000/svg", "g")
			tipG.setAttribute("fill", `url(#centerTip${this.flowerID}-Gradient-${i})`)
			tipG.id = `centerTipGroup${this.flowerID}-${i}`
			arrangement.tips.forEach(tip => {
				tipG.appendChild(tip.element)
			})
			tipG.classList.add(`centerTipStyles${this.flowerID}-${i}`)
			elementsInsertionTarget.appendChild(tipG)
		})
		this.applyStyles()
	}

	applyStyles() {
		let defs = this.svgElement.querySelector("defs")
		defs.innerHTML = ""

		//@ts-ignore this is intended. Container is already an svg element, its style is in the svg NS
		let styleTag = /** @type {SVGStyleElement} */ (this.svgElement.querySelector("style"))
		styleTag.innerHTML = ""

		const highlightString = ".vectorBloomHighlight {" +
			"fill: blue;" +
			"opacity: 0.5;" +
			"stroke: blue;" +
			"stroke-width: 5;" +
			"}"
		styleTag.appendChild(document.createTextNode(highlightString))

		const _this = this
		/**
		 * @param {string} id 
		 * @param {ShadowConfig} config 
		 * @param {SVGElement} target 
		 * @param {boolean} [filterOnElements]
		 */
		function createAndApplyFilter(id, config, target, filterOnElements) {
			if (config.blur == 0) {
				target.removeAttribute("filter")
				if (target.children[0] && target.children[0].hasAttribute("filter"))
					for (let i = 0; i < target.children.length; i++)
						target.children[i].removeAttribute("filter")
				return
			}

			const filter = createShadowFilter(id, config)
			if (filterOnElements)
				for (let i = 0; i < target.children.length; i++)
					target.children[i].setAttribute("filter", `url(#${id})`)
			else
				target.setAttribute("filter", `url(#${filter.id})`)
			defs.appendChild(filter)
		}

		/**
		 * @param {string} prefix 
		 * @param {number} id 
		 * @param {GradientStop[]} config 
		 * @param {number} configIndex
		 */
		function createAndApplyRGradient(prefix, id, config, configIndex) {
			const gradient = createRadialGradient(`${prefix}Gradient-${id}`, config)

			let radius
			if (prefix == `petal${_this.flowerID}-`) {
				radius = _this.config.center.radius + _this.config.petals[configIndex].geometry.length
			} else
				radius = _this.config.center.arrangement[configIndex].geometry.range[1] * _this.config.center.radius

			/**
			 * why 1.5?
			 * This produces a more natural color spread between stops
			 */
			gradient.setAttribute("r", radius * 1.5 + "")
			defs.appendChild(gradient)
		}

		this.config.petals.forEach((petalConfig, index) => {
			const inverseIndex = (this.config.petals.length - (index + 1))
			createAndApplyRGradient(`petal${this.flowerID}-`, inverseIndex, petalConfig.fill.color, index)
			createAndApplyFilter(`petalShadow${this.flowerID}-${inverseIndex}`, petalConfig.fill.shadow,
				this.svgElement.querySelector(`#petalGroup${this.flowerID}-${inverseIndex}`))

			const styleString = `.petalStyles${this.flowerID}-${inverseIndex} {` +
				`stroke: ${petalConfig.fill.strokeColor};` +
				`stroke-width: ${petalConfig.fill.strokeWidth};` +
				"}"
			styleTag.appendChild(document.createTextNode(styleString))
		})

		this.config.center.arrangement.forEach((arrangement, index) => {
			const inverseIndex = this.config.center.arrangement.length - (index + 1)
			createAndApplyRGradient(`centerBase${this.flowerID}-`, inverseIndex, arrangement.fill.base.color, index)
			createAndApplyRGradient(`centerTip${this.flowerID}-`, inverseIndex, arrangement.fill.tip.color, index)
			createAndApplyFilter(`centerBaseShadow${this.flowerID}-${inverseIndex}`, arrangement.fill.base.shadow,
				this.svgElement.querySelector(`#centerBaseGroup${this.flowerID}-${inverseIndex}`), true)
			createAndApplyFilter(`centerTipShadow${this.flowerID}-${inverseIndex}`, arrangement.fill.tip.shadow,
				this.svgElement.querySelector(`#centerTipGroup${this.flowerID}-${inverseIndex}`))
			const styleString = `.centerBaseStyles${this.flowerID}-${inverseIndex} {` +
				`stroke: ${arrangement.fill.base.strokeColor};` +
				`stroke-width: ${arrangement.fill.base.strokeWidth};` +
				"}"
			styleTag.appendChild(document.createTextNode(styleString))
			const styleString2 = `.centerTipStyles${this.flowerID}-${inverseIndex} {` +
				`stroke: ${arrangement.fill.tip.strokeColor};` +
				`stroke-width: ${arrangement.fill.tip.strokeWidth};` +
				"}"
			styleTag.appendChild(document.createTextNode(styleString2))
		})
	}

	/**
	 * @param {boolean} [download] 
	 * @returns {string}
	 */
	getSVG(download) {
		this.fitDrawing()
		const serializer = new XMLSerializer()
		const svgText = serializer.serializeToString(this.svgElement)
		if (download) {
			const xml = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>\r\n${svgText}`
			DownloadData(xml, "flower", "svg")
		} else {
			return svgText
		}
	}

	/**
	 * @param {boolean} download 
	 * @returns {string}
	 */
	getJSON(download) {
		const json = JSON.stringify(this.config, null, 2)
		if (download)
			DownloadData(json, "flower", "json")
		else
			return json
	}

	fitDrawing() {
		const containerGroup = this.svgElement.getElementsByTagName("g")[0]
		const bBox = containerGroup.getBBox()
		const width = Math.max(bBox.width, bBox.height)
		this.drawingWidth = width
		this.svgElement.setAttribute("pageWidth", `${width}`)
		this.svgElement.setAttribute("pageHeight", `${width}`)
		this.svgElement.setAttribute("viewBox", `0 0 ${width} ${width}`)
		containerGroup.setAttribute("transform", `translate(${width/2}, ${width/2})`)
	}

	/**
	 * @param {number} zoom 
	 */
	zoomDrawing(zoom) {
		const zoomedWidth = this.drawingWidth * zoom
		const difference = (this.drawingWidth - zoomedWidth) / 2
		this.svgElement.setAttribute("viewBox", `${difference} ${difference} ${zoomedWidth} ${zoomedWidth}`)
	}

	/**
	 * @param { BloomConfig } config
	 */
	static FillDefaults(config) {
		if (!config.petals)
			config.petals = []
		if (!config.center)
			config.center = {
				radius: 50,
				arrangement: []
			}
		config.petals.forEach(fillPetalDefaults)
		config.center.arrangement.forEach(fillCenterDefaults)
	}

	/**
	 * @param {number} index 
	 */
	highlightPetal(index) {
		index = this.config.petals.length - index - 1
		if (index > -1)
			this.svgElement.querySelector(`#petalGroup${this.flowerID}-${index}`).classList.add("vectorBloomHighlight")
	}

	/**
	 * @param {number} index 
	 */
	unhighlightPetal(index) {
		index = this.config.petals.length - index - 1
		if (index > -1)
			this.svgElement.querySelector(`#petalGroup${this.flowerID}-${index}`).classList.remove("vectorBloomHighlight")
	}

	/**
	 * @param {number} index 
	 */
	highlightCenter(index) {
		index = this.config.center.arrangement.length - index - 1
		if (index > -1) {
			this.svgElement.querySelector(`#centerBaseGroup${this.flowerID}-${index}`).classList.add("vectorBloomHighlight")
			this.svgElement.querySelector(`#centerTipGroup${this.flowerID}-${index}`).classList.add("vectorBloomHighlight")
		}
	}

	/**
	 * @param {number} index 
	 */
	unhighlightCenter(index) {
		index = this.config.center.arrangement.length - index - 1
		if (index > -1) {
			this.svgElement.querySelector(`#centerBaseGroup${this.flowerID}-${index}`).classList.remove("vectorBloomHighlight")
			this.svgElement.querySelector(`#centerTipGroup${this.flowerID}-${index}`).classList.remove("vectorBloomHighlight")
		}
	}
}

/**
 * @param {number} angle 
 * @returns {number}
 */
function ToRadian(angle) {
	return angle * Math.PI / 180
}

/**
 * @param {any} value 
 * @returns {boolean}
 */
function isNull(value) {
	return value === undefined || value === null
}


/**
 * @param {VectorBloomNode} node 
 * @param {VectorBloomNode} originNode 
 * @param {number} value 
 */
function ApplySmoothing(node, originNode, value) {
	const workerPoint1 = new VectorBloomPoint(0, 0)
	const workerPoint2 = new VectorBloomPoint(0, 0)
	workerPoint1.set(node.position).subtract(originNode.position).normalize()
	workerPoint2.set(node.curveTo.position).subtract(node.position).normalize()
	workerPoint1.add(workerPoint2).normalize()
	workerPoint2.set(workerPoint1).scale(value * node.curveTo.position.distanceFrom(node.position))
	node.controlPoint2.set(node.position).add(workerPoint2)
	workerPoint2.set(workerPoint1).scale(-value * node.position.distanceFrom(originNode.position))
	node.controlPoint1.set(node.position).add(workerPoint2)
}

/**
 * @param {PetalConfig} config 
 */
function fillPetalDefaults(config) {
	const geometry = config.geometry

	if (!geometry.width || !geometry.count || !geometry.length)
		console.log("crucial config missing or invalid config.")
	else {
		if (isNull(geometry.outerWidth))
			geometry.outerWidth = geometry.width
		if (isNull(geometry.angleOffset))
			geometry.angleOffset = 0
		if (isNull(geometry.radialOffset))
			geometry.radialOffset = 0
		if (isNull(geometry.balance))
			geometry.balance = 0.5
		if (isNull(geometry.smoothing))
			geometry.smoothing = 0
		if (isNull(geometry.innerWidth))
			geometry.innerWidth = geometry.width
		if (isNull(geometry.offsetX))
			geometry.offsetX = 0
		if (isNull(geometry.offsetY))
			geometry.offsetY = 0
	}

	fillFillDefaults(config.fill)
}

/**
 * @param {FillStyle} fill
 */
function fillFillDefaults(fill) {
	fill.color.forEach(stop => {
		if (isNull(stop.offset))
			stop.offset = 0.5
	})
	if (isNull(fill.strokeColor))
		fill.strokeColor = "#000000"
	if (isNull(fill.strokeWidth))
		fill.strokeWidth = 0

	if (!fill.shadow) {
		fill.shadow = {
			blur: 0,
			offsetX: 0,
			offsetY: 0,
			color: "#000",
			opacity: 1
		}
	}
}

/**
 * 
 * @param {CenterArrangment} config 
 */
function fillCenterDefaults(config) {
	fillFillDefaults(config.fill.base)
	fillFillDefaults(config.fill.tip)
}

/**
 * Makes a unit vector and returns
 * one perpendicular vector to it
 * @param {VectorBloomPoint} point 
 */
function makePerpendicular(point) {
	point.normalize()
	const x = point.x
	const y = point.y
	point.x = -y
	point.y = x
}

/**
 * @typedef CenterArrangement
 * @property {VectorBloomPath[]} bases
 * @property {VectorBloomPath[]} tips
 */

/**
 * @param {CenterGeometry} arrangement 
 * @param {number} radius 
 * @returns {CenterArrangement}
 */
function createCenter(arrangement, radius) {
	let n = 0
	let currentRadius = (arrangement.range[0] || 0) * radius
	const minRadius = currentRadius
	const maxRadius = (arrangement.range[1] || 1) * radius
	const radiusRange = maxRadius - currentRadius
	const ageRange = arrangement.age[1] - arrangement.age[0]
	const sizeRange = arrangement.size[1] - arrangement.size[0]

	/**@type {CenterArrangement} */
	const centerArrangement = {
		bases: [],
		tips: []
	}
	let angle = 0
	if (currentRadius != 0)
		n = Math.pow(currentRadius / arrangement.density, 2)
	do {
		angle = n * GOLDEN_RADIANS
		currentRadius = arrangement.density * Math.sqrt(n)
		const currentRadiusRatio = (currentRadius - minRadius) / radiusRange
		const currentAge = (currentRadiusRatio * ageRange) + arrangement.age[0]
		const currentSize = (currentRadiusRatio * sizeRange) + arrangement.size[0]
		const { base, tip } = createCenterShape(currentRadius, currentAge, currentSize, angle)
		if (base)
			centerArrangement.bases.push(base)
		if (tip)
			centerArrangement.tips.push(tip)
		n++
	} while (currentRadius < maxRadius)
	return centerArrangement
}

/**
 * 
 * @param {number} r 
 * @param {number} age
 * @param {number} size
 * @param {number} angle 
 * @returns {{base: VectorBloomPath, tip: VectorBloomPath}}
 */
function createCenterShape(r, age, size, angle) {
	const workerPoint1 = new VectorBloomPoint(0, 0)
	const workerPoint2 = new VectorBloomPoint(0, 0)
	const workerPoint3 = new VectorBloomPoint(0, 0)
	const workerPoint4 = new VectorBloomPoint(0, 0)
	workerPoint1.set(r * Math.sin(angle), r * Math.cos(angle))

	const baseNodes = /** @type {VectorBloomNode[]} */ ([])
	const tipNodes = /** @type {VectorBloomNode[]} */ ([])

	if (age < 0.5) {
		/**
		 * this shape is a quadrilateral with points in clockwise order start from South
		 * The south one points towards the center
		 */
		let offset = angle + Math.PI
		const smoothingFactor = (age < 0.1 ? 0 : size * age)
		let floretLength = Math.min(size * 6, (0.5 / age) * size)
		if (floretLength > r)
			floretLength = r
		baseNodes.push(getRadialNode(offset, floretLength, workerPoint1, 0))
		for (let i = 0; i < 3; i++) {
			offset += Math.PI / 2
			baseNodes.push(getRadialNode(offset, size, workerPoint1, smoothingFactor))
		}
	} else {
		//create base shape
		const fullCirle = Math.PI * 2
		let currentAngle = angle
		const step = fullCirle / 10
		let maxR = size
		let minR = size
		const deviation = size * (age - 0.5)
		minR -= deviation
		const smoothing = Math.PI * minR / 15
		for (let i = 0; i < 10; i++) {
			baseNodes.push(getRadialNode(currentAngle, ((i % 2 == 0) ? maxR : minR), workerPoint1, smoothing))
			currentAngle += step
		}

		if (age > 0.7) {
			/**
			 * create the tip shape. Its basically a stem with a spherical top
			 * start with the stem part. can be made with 7 nodes
			 * 			 5
			 * 			/ \  	
			 * 		   6\  |4
			 * 		   7/ /3
			 *		   / /
			 *        / /
			 *		1	2 
			 */
			const hs = size * age / 4
			const circleR = size / 2
			tipNodes.push(getRadialNode(angle - Math.PI / 2, hs, workerPoint1))
			tipNodes.push(getRadialNode(angle + Math.PI / 2, hs, workerPoint1))
			workerPoint4.set(workerPoint1).normalize()
			workerPoint2.set(workerPoint4).scale(circleR * (age - 0.7) * 8).add(workerPoint1)
			tipNodes.push(getRadialNode(angle + Math.PI / 2, hs, workerPoint2))

			//sweep a cicle. the following point is the center
			workerPoint3.set(workerPoint4).scale(circleR).add(workerPoint2)
			let offset = angle + Math.PI / 2
			for (let i = 0; i < 3; i++) {
				tipNodes.push(getRadialNode(offset, circleR, workerPoint3, -circleR * 0.66))
				offset -= Math.PI / 2
			}
			tipNodes.push(getRadialNode(angle - Math.PI / 2, hs, workerPoint2))
		}
	}

	return {
		base: (baseNodes.length ? new VectorBloomPath(baseNodes) : null),
		tip: (tipNodes.length ? new VectorBloomPath(tipNodes) : null)
	}
}

/**
 * @param {PetalConfig} petalConfig
 * @param {number} centerRadius
 * @returns  {VectorBloomPath[]}
 */
function createPetals(petalConfig, centerRadius) {
	const petalGeometry = petalConfig.geometry
	//start from 0 degrees 12oclock.
	let offset = ToRadian(petalGeometry.angleOffset || 0)
	const step = Math.PI * 2 / petalGeometry.count
	const petals = []
	centerRadius += (petalConfig.geometry.radialOffset || 0) * centerRadius
	for (let i = 0; i < petalGeometry.count; i++) {
		const petal = createPetal(petalGeometry, centerRadius, offset)
		petals.push(petal)
		offset += step
	}
	return petals
}

/**
 * A petal is defined by 8 points.
 * @param {PetalGeometry} petalGeometry 
 * @param {number} centerRadius 
 * @param {number} offset 
 * @returns {VectorBloomPath}
 */
function createPetal(petalGeometry, centerRadius, offset) {
	const innerWidthHalf = ToRadian(petalGeometry.innerWidth / 2)
	const outerWidthHalf = ToRadian(petalGeometry.outerWidth / 2)
	const widthHalf = ToRadian(petalGeometry.width / 2)

	let extension = 0
	if (petalGeometry.extendOutside)
		extension = (centerRadius + petalGeometry.length) * outerWidthHalf

	const centerOffset = new VectorBloomPoint(petalGeometry.offsetX || 0, petalGeometry.offsetY || 0)


	const petalNodes = /** @type {VectorBloomNode[]}*/ ([])
	petalNodes.push(
		getRadialNode(offset - innerWidthHalf, centerRadius, centerOffset),
		getRadialNode(offset, centerRadius - 10, centerOffset),
		getRadialNode(offset + innerWidthHalf, centerRadius, centerOffset),
		getRadialNode(offset + widthHalf, centerRadius + (petalGeometry.length * petalGeometry.balance), centerOffset),
		getRadialNode(offset + outerWidthHalf, centerRadius + petalGeometry.length, centerOffset),
		getRadialNode(offset, centerRadius + petalGeometry.length + extension, centerOffset),
		getRadialNode(offset - outerWidthHalf, centerRadius + petalGeometry.length, centerOffset),
		getRadialNode(offset - widthHalf, centerRadius + (petalGeometry.length * petalGeometry.balance), centerOffset)
	)
	const petal = new VectorBloomPath(petalNodes)
	if (petalGeometry.smoothing) {
		petal.nodes.forEach((node, index) => {
			const fromNode = index === 0 ? petal.nodes[petal.nodes.length - 1] :
				petal.nodes[index - 1]
			ApplySmoothing(node, fromNode, petalGeometry.smoothing)
		})
		petal.compilePathData()
	}

	return petal
}

/**
 * @param {number} angle 
 * @param {number} distance 
 * @param {VectorBloomPoint} [position] 
 * @param {number} [smoothing]
 * @returns {VectorBloomNode}
 */
function getRadialNode(angle, distance, position, smoothing) {
	let x = Math.sin(angle) * distance
	let y = Math.cos(angle) * distance
	if (position) {
		x += position.x
		y += position.y
	}
	const createdNode = new VectorBloomNode(x, y)
	if (smoothing) {
		const workerPoint1 = new VectorBloomPoint()
		workerPoint1.set(createdNode.position).subtract(position)
		makePerpendicular(workerPoint1)
		createdNode.controlPoint1.set(workerPoint1.scale(smoothing)).add(createdNode.position)
		createdNode.controlPoint2.set(workerPoint1.scale(-1).add(createdNode.position))
	}

	return createdNode
}

/**
 * 
 * @param {string} id 
 * @param {GradientStop[]} stops 
 * @returns {SVGRadialGradientElement}
 */
function createRadialGradient(id, stops) {
	const radialGradient = document.createElementNS("http://www.w3.org/2000/svg", "radialGradient")
	radialGradient.id = id
	radialGradient.setAttribute("cx", "0")
	radialGradient.setAttribute("cy", "0")
	radialGradient.setAttribute("fx", "0")
	radialGradient.setAttribute("fy", "0")
	radialGradient.setAttribute("r", "50%")
	stops.forEach(stopObj => {
		const stop = document.createElementNS("http://www.w3.org/2000/svg", "stop")
		stop.setAttribute("style", `stop-color:${stopObj.color}`)
		stop.setAttribute("offset", ((stopObj.offset == null) ? "50%" : (stopObj.offset * 100) + "%"))
		radialGradient.appendChild(stop)
	})
	radialGradient.setAttribute("gradientUnits", "userSpaceOnUse")
	radialGradient.classList.add("vectorBloomTypes")
	return radialGradient
}

/**
 * @param {string} id 
 * @param {ShadowConfig} shadowConfig 
 * @returns {SVGFilterElement}
 */
function createShadowFilter(id, shadowConfig) {
	const filter = document.createElementNS("http://www.w3.org/2000/svg", "filter")
	filter.setAttribute("x", "-150%")
	filter.setAttribute("y", "-150%")
	filter.setAttribute("width", "300%")
	filter.setAttribute("height", "300%")
	filter.id = id

	/**
	 * FeDropShadow is a short hand notation for a composite of filter. 
	 * It may not be supported by all renderers. Alteast Inkscape doesn't 
	 * support it. May be its not spec?
	 */
	/* const feShadowElem = document.createElementNS("http://www.w3.org/2000/svg", "feDropShadow")
	feShadowElem.setAttribute("dx", shadowConfig.offsetX + "")
	feShadowElem.setAttribute("dy", shadowConfig.offsetY + "")
	feShadowElem.setAttribute("stdDeviation", shadowConfig.blur + "")
	feShadowElem.setAttribute("flood-color", shadowConfig.color)
	feShadowElem.setAttribute("flood-opacity", shadowConfig.opacity + "") */

	//feFlood
	const feFlood = document.createElementNS("http://www.w3.org/2000/svg", "feFlood")
	feFlood.setAttribute("flood-opacity", shadowConfig.opacity + "")
	feFlood.setAttribute("flood-color", shadowConfig.color)
	feFlood.setAttribute("result", "flood")

	//feOffset
	const feOffset = document.createElementNS("http://www.w3.org/2000/svg", "feOffset")
	feOffset.setAttribute("dx", (shadowConfig.offsetX || 0) + "")
	feOffset.setAttribute("dy", (shadowConfig.offsetY || 0) + "")
	feOffset.setAttribute("result", "offset")

	//feGaussianBlur
	const feGB = document.createElementNS("http://www.w3.org/2000/svg", "feGaussianBlur")
	feGB.setAttribute("stdDeviation", (shadowConfig.blur || 0) + "")
	feGB.setAttribute("in", "composite1")
	feGB.setAttribute("result", "blur")

	//composites
	const feComposite1 = document.createElementNS("http://www.w3.org/2000/svg", "feComposite")
	feComposite1.setAttribute("in", "flood")
	feComposite1.setAttribute("in2", "SourceGraphic")
	feComposite1.setAttribute("operator", "in")
	feComposite1.setAttribute("result", "composite1")

	const feComposite2 = document.createElementNS("http://www.w3.org/2000/svg", "feComposite")
	feComposite2.setAttribute("in", "SourceGraphic")
	feComposite2.setAttribute("in2", "offset")
	feComposite2.setAttribute("operator", "over")
	feComposite2.setAttribute("result", "composite2")

	filter.appendChild(feFlood)
	filter.appendChild(feComposite1)
	filter.appendChild(feGB)
	filter.appendChild(feOffset)
	filter.appendChild(feComposite2)

	filter.classList.add("vectorBloomTypes")
	return filter
}

/**
 * @param {number} pageSize
 * @returns {SVGSVGElement}
 */
function createSVGElement(pageSize) {
	const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg")
	svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg")
	svgElement.setAttribute("class", "vectorBloomSVG")
	svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet")
	svgElement.style.width = "100%"
	svgElement.style.height = "100%"
	svgElement.setAttribute("pageWidth", pageSize + "")
	svgElement.setAttribute("pageHeight", pageSize + "")
	svgElement.setAttribute("viewBox", `0 0 ${pageSize} ${pageSize}`)


	//ensure this is the first element
	const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs")
	defs.classList.add("vectorBloomDefs")
	svgElement.appendChild(defs)

	const styleTag = document.createElementNS("http://www.w3.org/2000/svg", "style")
	styleTag.type = "text/css"
	svgElement.appendChild(styleTag)

	const translateGroup = document.createElementNS("http://www.w3.org/2000/svg", "g")
	translateGroup.setAttribute("transform", `translate(${pageSize/2},${pageSize/2})`)
	svgElement.appendChild(translateGroup)

	return svgElement
}

/**
 * @typedef CircleConfig
 * @property {number} radius
 * @property {string} color
 * @property {number} [x] 
 * @property {number} [y] 
 */

/**
 * @param {CircleConfig} config
 * @returns {SVGCircleElement}
 */
function createCircleElement(config) {
	const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
	circle.setAttribute("cx", (isNull(config.x) ? 0 : config.x) + "")
	circle.setAttribute("cy", (isNull(config.y) ? 0 : config.y) + "")
	circle.setAttribute("r", config.radius + "")
	circle.setAttribute("fill", config.color)
	return circle
}

/**
 * Will make browser prompt to download a file. 
 * Can be used to download in memory image as file etc.
 * @param {string} data string data of the file
 * @param {string} fileName the filename of the browser downloaded file
 * @param {string} [type] the file mime type
 */
function DownloadData(data, fileName, type) {
	let mimeType = "text/plain"
	switch (type) {
		case "json":
			if (typeof data != "string") {
				data = JSON.stringify(data, null, 2)
			}
			mimeType = "application/json"
			break
		case "svg":
			mimeType = "image/svg+xml"
			break
		default:
			if (typeof data == "string") {
				if (data.match(/^data:image\/[^;]/)) {
					let image_data = atob(data.split(",")[1])
					// Use typed arrays to convert the binary data to a Blob
					let arraybuffer = new ArrayBuffer(image_data.length)
					let view = new Uint8Array(arraybuffer)
					for (let i = 0; i < image_data.length; i++) {
						view[i] = image_data.charCodeAt(i) & 0xff
					}
					data = arraybuffer
					mimeType = "image/png"
				}
			}
			break
	}

	let blob = new Blob([data], { type: mimeType })
	let url = window.URL.createObjectURL(blob)
	const a = document.createElement("a")
	document.body.appendChild(a)
	a.href = url
	a.download = fileName
	a.click()
	setTimeout(() => document.body.removeChild(a), 1000)
	window.URL.revokeObjectURL(url)
}