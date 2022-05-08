class $f007ebde6a4d0933$export$29b1dadb55dcfd29 {
    /**
	 * @param {number} [x]
	 * @param {number} [y]
	 */ constructor(x = 0, y = 0){
        /** @type {number} */ this.x = x;
        /** @type {number} */ this.y = y;
    }
    /**
	 * @param {number|{x:number, y:number}} _x 
	 * @param {number} [_y] 
	 * @returns {VectorBloomPoint}
	 */ set(_x, _y) {
        if (typeof _x == "number") {
            this.x = _x;
            this.y = _y;
        } else {
            this.x = _x.x;
            this.y = _x.y;
        }
        return this;
    }
    /**
	 * @returns {number}
	 */ magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    /**
	 * Creates a unit vector in place
	 * @returns {VectorBloomPoint}
	 */ normalize() {
        const magnitude = this.magnitude();
        this.x /= magnitude;
        this.y /= magnitude;
        return this;
    }
    /**
	 * @param {number} factor 
	 * @returns {VectorBloomPoint}
	 */ scale(factor) {
        this.x *= factor;
        this.y *= factor;
        return this;
    }
    /**
	 * Creates a unit vector but returns shiny new Point Object
	 * @returns {VectorBloomPoint}
	 */ unit() {
        return new $f007ebde6a4d0933$export$29b1dadb55dcfd29(this.x, this.y).scale(1 / this.magnitude());
    }
    /**
	 * The slope of the the unit line from origin to point in radians
	 * @returns {number}
	 */ angle() {
        let angle = Math.atan2(this.y, this.x);
        if (angle < 0) angle += 2 * Math.PI;
        return angle;
    }
    /**
	 * @param {number|VectorBloomPoint} _point 
	 * @param {number} [y] 
	 * @returns {number}
	 */ distanceFrom(_point, y) {
        return Math.sqrt(this.squaredDistanceFrom(_point, y));
    }
    /**
	 * @param {number|{x:number, y:number}} _point 
	 * @param {number} [y] 
	 * @returns {number}
	 */ squaredDistanceFrom(_point, y) {
        let xd, yd;
        if (typeof _point == "number") {
            xd = _point - this.x;
            yd = y - this.y;
        } else {
            xd = _point.x - this.x;
            yd = _point.y - this.y;
        }
        return xd * xd + yd * yd;
    }
    /**
	 * Calculates the unit vector describing the direction to the passed
	 * point
	 * @param {VectorBloomPoint} point 
	 * @returns {VectorBloomPoint}
	 */ direction(point) {
        let distance = this.distanceFrom(point);
        return new $f007ebde6a4d0933$export$29b1dadb55dcfd29(this.x - point.x, this.y - point.y).scale(1 / distance);
    }
    /**
	 * @param {number|VectorBloomPoint} _point 
	 * @param {number} [y] 
	 * @returns {VectorBloomPoint}
	 */ add(_point, y) {
        if (typeof _point == "number") {
            this.x += _point;
            this.y += y;
        } else {
            this.x += _point.x;
            this.y += _point.y;
        }
        return this;
    }
    /**
	 * @param {number|VectorBloomPoint} _point 
	 * @param {number} [y] 
	 * @returns {VectorBloomPoint}
	 */ subtract(_point, y) {
        if (typeof _point == "number") {
            this.x -= _point;
            this.y -= y;
        } else {
            this.x -= _point.x;
            this.y -= _point.y;
        }
        return this;
    }
    /**
	 * @param {number|VectorBloomPoint} _point 
	 * @param {number} [y] 
	 * @returns {VectorBloomPoint}
	 */ midPoint(_point, y) {
        let xd, yd;
        if (typeof _point == "number") {
            xd = _point;
            yd = y;
        } else {
            xd = _point.x;
            yd = _point.y;
        }
        return new $f007ebde6a4d0933$export$29b1dadb55dcfd29(this.x + xd, this.y + yd).scale(0.5);
    }
    /**
	 * Rotates a point about another point by angle provided
	 * @param {VectorBloomPoint} point 
	 * @param {number} angle In radians
	 * @returns {VectorBloomPoint}
	 */ rotateAbout(point, angle) {
        const dx = this.x - point.x;
        const dy = this.y - point.y;
        const cosx = Math.cos(angle);
        const sinx = Math.sin(angle);
        this.x = point.x + dx * cosx + dy * sinx;
        this.y = point.y + dy * cosx - dx * sinx;
        // invert y axis in dom
        return this;
    }
    /**
	 * @param {VectorBloomPoint} point 
	 * @returns {boolean}
	 */ isSame(point) {
        if (this.x == point.x && this.y == point.y) return true;
        return false;
    }
    /**
	 * @param {VectorBloomPoint[]} points
	 * @returns {VectorBloomPoint}
	 */ static ComputeCenter(points) {
        let x = 0, y = 0;
        points.forEach(function(element) {
            x += element.x;
            y += element.y;
        });
        return new $f007ebde6a4d0933$export$29b1dadb55dcfd29(x, y).scale(1 / points.length);
    }
}



class $a124a4be495d40a7$export$e4c1e9b5fa4cf163 {
    /**
	 * 
	 * @param {number} x 
	 * @param {number} y 
	 */ constructor(x, y){
        this.position = new $f007ebde6a4d0933$export$29b1dadb55dcfd29(x, y);
        this.curveTo = null;
        this.controlPoint1 = new $f007ebde6a4d0933$export$29b1dadb55dcfd29(x, y);
        this.controlPoint2 = new $f007ebde6a4d0933$export$29b1dadb55dcfd29(x, y);
    }
}
class $a124a4be495d40a7$export$49e3432e3d0b046c {
    /**
	 * @param {VectorBloomNode[]} nodes 
	 */ constructor(nodes){
        this.nodes = nodes;
        this.element = document.createElementNS("http://www.w3.org/2000/svg", "path");
        this.nodes.forEach((node, index)=>node.curveTo = this.nodes[index + 1]
        );
        this.nodes[this.nodes.length - 1].curveTo = this.nodes[0];
        this.pathData = this.compilePathData();
    }
    compilePathData() {
        /**
		 * @param {VectorBloomNode} node 
		 */ function writeData(node) {
            pathString += `${node.controlPoint2.x} ${node.controlPoint2.y} `;
            pathString += `${node.curveTo.controlPoint1.x} ${node.curveTo.controlPoint1.y} `;
            pathString += `${node.curveTo.position.x} ${node.curveTo.position.y} `;
        }
        let pathString = `M ${this.nodes[0].position.x} ${this.nodes[0].position.y} C `;
        const target = this.nodes.length - 1;
        for(let i = 0; i < target; i++){
            const node = this.nodes[i];
            writeData(node);
        }
        writeData(this.nodes[target]);
        pathString += "Z ";
        this.element.setAttribute("d", pathString);
    }
}


/**
 * @typedef BloomConfig
 * @property {PetalConfig[]} petals
 * @property {CenterConfig} [center]
 */ /**
 * @typedef CenterConfig
 * @property {number} radius The radius of the flower center
 * @property {CenterArrangment[]} arrangement
 */ /** 
 * @typedef PetalConfig
 * 	@property {PetalGeometry} geometry
 * 	@property {FillStyle} [fill]
 */ /** 
 * @typedef FillStyle
 * @property {GradientStop[]} color hex string
 * @property {number} strokeWidth?
 * @property {string} strokeColor? hex string
 * @property {ShadowConfig} [shadow]
 */ /** 
 * @typedef ShadowConfig
 * @property {number} [offsetX] 
 * @property {number} [offsetY]
 * @property {number} blur
 * @property {string} [color] hex string
 * @property {number} [opacity]
 */ /** 
 * @typedef GradientStop
 * @property {string} color
 * @property {number} [offset]
 */ /** 
 * @typedef PetalGeometry
 * @property {number} width The width of the petal at the center
 * @property {number} count The number of petals
 * @property {number} length 
 * @property {number} [innerWidth] The width of the petal at the radial origin
 * @property {number} [outerWidth] The width of the petal at the outer edge
 * @property {number} [angleOffset] Rotate the petal arrangement. In degrees
 * @property {number} [radialOffset] The radial offset from the center component. This is considered
 * as factor of center radius. Sensible values are -1 to 1
 * @property {number} [balance] The point where the center balance of the petal is considered. Sensible
 * values are in the range [0, 1]. This affects how the width value is treated
 * @property {number} [smoothing] The pointness of the petal. Sensible values are from 0 - very pointy to
 * 1 - overlysmooth (this results in pointiness too)
 * @property {boolean} [extendOutside] Extend the outer edge of the metal to form a smooth curve
 * @property {number} [offsetX]
 * @property {number} [offsetY]
 */ /** 
 * @typedef CenterArrangment
 * @property {CenterGeometry} geometry
 * @property {CenterFill}	[fill] 
 */ /** 
 * @typedef CenterFill 
 * @property {FillStyle} base
 * @property {FillStyle} tip Based on age, tips don't always exist
 * @property {string} [background] a hex color value
 */ /** 
 * @typedef CenterGeometry
 * @property {Array<number>} age 0 forms a sleeping floret. Array length is 2
 * 0.5 makes a vertical floret
 * 1 makes a floret radiating outward
 * This is an array of two integers between 0 1, 
 * Age is linearly mapped along the radius
 * @property {Array<number>} [range] Range is the percentage range of center to occupy. Array length is 2
 * ex: [0,1] occupies the full center
 * [0.75, 1] occupies outer 25 percent of the center radius
 * @property {number} density How closely the center elements are packed. Lower value results in
 * higher density.
 * @property {Array<number>} size Linearly mapped along radius. Array length is 2
 */ const $2fc098c386365677$var$GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;
const $2fc098c386365677$var$GOLDEN_RADIANS = 2 * (Math.PI - $2fc098c386365677$var$GOLDEN_RATIO * Math.PI / (1 + $2fc098c386365677$var$GOLDEN_RATIO));
class $2fc098c386365677$export$5a1d4940b51d91ff {
    /**
	 * @param {BloomConfig} config 
	 */ constructor(config){
        /**
		 * Assign a unique id to this flower so that the elements created have unique
		 * id names and classes.
		 */ this.id = (Math.random() + "").replace(".", "");
        $2fc098c386365677$export$5a1d4940b51d91ff.FillDefaults(config);
        this.petals = [];
        this.center = [];
        this.backgrounds = [];
        this.config = config;
        this.svgElement = $2fc098c386365677$var$createSVGElement();
        this.maxWidth = 100;
        let zoomLevel = 1;
        const _this = this;
        this.svgElement.addEventListener("wheel", function(/** @type {WheelEvent} */ event) {
            event.preventDefault();
            zoomLevel += event.deltaY * 0.001;
            zoomLevel = Math.max(0.1, Math.min(zoomLevel, 5));
            const zoomedWidth = _this.maxWidth * zoomLevel;
            const difference = (_this.maxWidth - zoomedWidth) / 2;
            _this.svgElement.setAttribute("viewBox", `${difference} ${difference} ${zoomedWidth} ${zoomedWidth}`);
        });
        this.update();
        this.updateDrawingSize();
    }
    /**
	 * Currently update and create are the same function
	 * Use this to update only geometry
	 */ updateGeometry() {
        this.petals.length = 0;
        this.center.length = 0;
        this.backgrounds.length = 0;
        this.config.petals.forEach((petalConfig)=>this.petals.unshift($2fc098c386365677$var$createPetals(petalConfig, this.config.center.radius))
        );
        this.config.center.arrangement.forEach((arrangement)=>{
            this.center.unshift($2fc098c386365677$var$createCenter(arrangement.geometry, this.config.center.radius));
            if (arrangement.fill.background) this.backgrounds.push($2fc098c386365677$var$createCircleElement({
                radius: this.config.center.radius * Math.max.apply(null, arrangement.geometry.range),
                color: arrangement.fill.background
            }));
        });
        this.backgrounds.sort((c1, c2)=>{
            const r1 = parseFloat(c1.getAttribute("r"));
            const r2 = parseFloat(c2.getAttribute("r"));
            return r2 - r1;
        });
        const elementsInsertionTarget = this.svgElement.querySelector("g");
        elementsInsertionTarget.innerHTML = "";
        this.backgrounds.forEach((c)=>elementsInsertionTarget.appendChild(c)
        );
        this.petals.forEach((petalArray, i)=>{
            const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
            elementsInsertionTarget.appendChild(g);
            g.setAttribute("fill", `url(#petal${this.id}-Gradient-${i})`);
            g.id = `petalGroup${this.id}-${i}`;
            g.classList.add(`petalStyles${this.id}-${i}`);
            petalArray.forEach((petal)=>g.appendChild(petal.element)
            );
        });
        this.center.forEach((arrangement, i)=>{
            const baseG = document.createElementNS("http://www.w3.org/2000/svg", "g");
            baseG.setAttribute("fill", `url(#centerBase${this.id}-Gradient-${i})`);
            baseG.id = `centerBaseGroup${this.id}-${i}`;
            arrangement.bases.forEach((base)=>{
                baseG.appendChild(base.element);
            });
            baseG.classList.add(`centerBaseStyles${this.id}-${i}`);
            elementsInsertionTarget.appendChild(baseG);
            const tipG = document.createElementNS("http://www.w3.org/2000/svg", "g");
            tipG.setAttribute("fill", `url(#centerTip${this.id}-Gradient-${i})`);
            tipG.id = `centerTipGroup${this.id}-${i}`;
            arrangement.tips.forEach((tip)=>{
                tipG.appendChild(tip.element);
            });
            tipG.classList.add(`centerTipStyles${this.id}-${i}`);
            elementsInsertionTarget.appendChild(tipG);
        });
    }
    /**
	 * Currently update and create are the same function.
	 * Use this to update only styles. Useful when only file, stroke or gradient is changed
	 */ updateStyles() {
        let defs = this.svgElement.querySelector("defs");
        defs.innerHTML = "";
        //@ts-ignore this is intended. Container is already an svg element, its style is in the svg NS
        let styleTag = /** @type {SVGStyleElement} */ this.svgElement.querySelector("style");
        styleTag.innerHTML = "";
        const highlightString = ".vectorBloomHighlight {fill: blue;opacity: 0.5;stroke: blue;stroke-width: 5;}";
        styleTag.appendChild(document.createTextNode(highlightString));
        const _this = this;
        /**
		 * @param {string} id 
		 * @param {ShadowConfig} config 
		 * @param {SVGElement} target 
		 * @param {boolean} [filterOnElements]
		 */ function createAndApplyFilter(id, config, target, filterOnElements) {
            if (config.blur == 0) {
                target.removeAttribute("filter");
                if (target.children[0] && target.children[0].hasAttribute("filter")) for(let i = 0; i < target.children.length; i++)target.children[i].removeAttribute("filter");
                return;
            }
            const filter = $2fc098c386365677$var$createShadowFilter(id, config);
            if (filterOnElements) for(let i = 0; i < target.children.length; i++)target.children[i].setAttribute("filter", `url(#${id})`);
            else target.setAttribute("filter", `url(#${filter.id})`);
            defs.appendChild(filter);
        }
        /**
		 * @param {string} prefix 
		 * @param {number} id 
		 * @param {GradientStop[]} config 
		 * @param {number} configIndex
		 */ function createAndApplyRGradient(prefix, id, config, configIndex) {
            const gradient = $2fc098c386365677$var$createRadialGradient(`${prefix}Gradient-${id}`, config);
            let radius;
            if (prefix == `petal${_this.id}-`) radius = _this.config.center.radius + _this.config.petals[configIndex].geometry.length;
            else radius = _this.config.center.arrangement[configIndex].geometry.range[1] * _this.config.center.radius;
            /**
			 * why 1.5?
			 * This produces a more natural color spread between stops
			 */ gradient.setAttribute("r", radius * 1.5 + "");
            defs.appendChild(gradient);
        }
        this.config.petals.forEach((petalConfig, index)=>{
            const inverseIndex = this.config.petals.length - (index + 1);
            createAndApplyRGradient(`petal${this.id}-`, inverseIndex, petalConfig.fill.color, index);
            createAndApplyFilter(`petalShadow${this.id}-${inverseIndex}`, petalConfig.fill.shadow, this.svgElement.querySelector(`#petalGroup${this.id}-${inverseIndex}`));
            const styleString = `.petalStyles${this.id}-${inverseIndex} {` + `stroke: ${petalConfig.fill.strokeColor};` + `stroke-width: ${petalConfig.fill.strokeWidth};` + "}";
            styleTag.appendChild(document.createTextNode(styleString));
        });
        this.config.center.arrangement.forEach((arrangement, index)=>{
            const inverseIndex = this.config.center.arrangement.length - (index + 1);
            createAndApplyRGradient(`centerBase${this.id}-`, inverseIndex, arrangement.fill.base.color, index);
            createAndApplyRGradient(`centerTip${this.id}-`, inverseIndex, arrangement.fill.tip.color, index);
            createAndApplyFilter(`centerBaseShadow${this.id}-${inverseIndex}`, arrangement.fill.base.shadow, this.svgElement.querySelector(`#centerBaseGroup${this.id}-${inverseIndex}`), true);
            createAndApplyFilter(`centerTipShadow${this.id}-${inverseIndex}`, arrangement.fill.tip.shadow, this.svgElement.querySelector(`#centerTipGroup${this.id}-${inverseIndex}`));
            const styleString = `.centerBaseStyles${this.id}-${inverseIndex} {` + `stroke: ${arrangement.fill.base.strokeColor};` + `stroke-width: ${arrangement.fill.base.strokeWidth};` + "}";
            styleTag.appendChild(document.createTextNode(styleString));
            const styleString2 = `.centerTipStyles${this.id}-${inverseIndex} {` + `stroke: ${arrangement.fill.tip.strokeColor};` + `stroke-width: ${arrangement.fill.tip.strokeWidth};` + "}";
            styleTag.appendChild(document.createTextNode(styleString2));
        });
    }
    /**
	 * Updates geometry and styles.
	 */ update() {
        this.updateGeometry();
        this.updateStyles();
    }
    /**
	 * By default the flower is drawn in the center of the passed canvas.
	 * @param {HTMLCanvasElement} canvas
	 * @param {number} [x] - left position in pixels
	 * @param {number} [y] - top position in pixels
	 * @param {number} [w] - width in pixels
	 * @param {number} [h] - height in pixels
	 */ renderOnCanvas(canvas, x, y, w, h) {
        if (canvas && canvas.tagName == "CANVAS") {
            /**
			 * @param {number} width
			 * @param {number} height
			 */ function updateParams(width, height) {
                if (typeof w != "number") w = Math.min(width, height);
                if (typeof h != "number") h = w;
                if (typeof x != "number") x = (width - w) / 2;
                if (typeof y != "number") y = (height - h) / 2;
            }
            const image = new Image();
            image.classList.add("svgPreview");
            image.onload = function() {
                const ctx = canvas.getContext("2d");
                updateParams(canvas.width, canvas.height);
                ctx.drawImage(image, x, y, w, h);
            };
            image.src = this.export("imageURL");
        }
    }
    /**
	 * @param {"svgString"|"svgFileString"|"imageURL"|"jsonString"} exportType 
	 * @returns {string}
	 */ export(exportType) {
        const xml = new XMLSerializer().serializeToString(this.svgElement);
        switch(exportType){
            case "svgString":
                return xml;
            case "svgFileString":
                return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>\r\n${xml}`;
            case "imageURL":
                return "data:image/svg+xml; charset=utf8, " + encodeURIComponent(xml);
            case "jsonString":
                return JSON.stringify(this.config, null, 2);
        }
    }
    /**
	 * This is useful sometimes to update the bounds of the svg to correctly contain
	 * the flower in the container.
	 */ updateDrawingSize() {
        const _this = this;
        this.maxWidth = -Infinity;
        /**
		 * @param {VectorBloomPath[]} component 
		 */ function loopNodes(component) {
            component.forEach((base)=>{
                base.nodes.forEach((node)=>{
                    const magnitude = node.position.magnitude();
                    if (magnitude > _this.maxWidth) _this.maxWidth = magnitude;
                });
            });
        }
        if (!this.petals.length) this.center.forEach((arrangmenet)=>loopNodes(arrangmenet.bases)
        );
        else this.petals.forEach((petals)=>loopNodes(petals)
        );
        this.maxWidth *= 2;
        this.svgElement.setAttribute("pageWidth", `${this.maxWidth}`);
        this.svgElement.setAttribute("pageHeight", `${this.maxWidth}`);
        this.svgElement.setAttribute("width", `${this.maxWidth}px`);
        this.svgElement.setAttribute("height", `${this.maxWidth}px`);
        this.svgElement.setAttribute("viewBox", `0 0 ${this.maxWidth} ${this.maxWidth}`);
        const containerGroup = this.svgElement.getElementsByTagName("g")[0];
        containerGroup.setAttribute("transform", `translate(${this.maxWidth / 2}, ${this.maxWidth / 2})`);
    }
    /**
	 * @param { BloomConfig } config
	 */ static FillDefaults(config) {
        if (!config.petals) config.petals = [];
        if (!config.center) config.center = {
            radius: 50,
            arrangement: []
        };
        config.petals.forEach($2fc098c386365677$var$fillPetalDefaults);
        config.center.arrangement.forEach($2fc098c386365677$var$fillCenterDefaults);
    }
}
/**
 * @param {number} angle 
 * @returns {number}
 */ function $2fc098c386365677$var$ToRadian(angle) {
    return angle * Math.PI / 180;
}
/**
 * @param {any} value 
 * @returns {boolean}
 */ function $2fc098c386365677$var$isNull(value) {
    return value === undefined || value === null;
}
/**
 * @param {VectorBloomNode} node 
 * @param {VectorBloomNode} originNode 
 * @param {number} value 
 */ function $2fc098c386365677$var$ApplySmoothing(node, originNode, value) {
    const workerPoint1 = new $f007ebde6a4d0933$export$29b1dadb55dcfd29(0, 0);
    const workerPoint2 = new $f007ebde6a4d0933$export$29b1dadb55dcfd29(0, 0);
    workerPoint1.set(node.position).subtract(originNode.position).normalize();
    workerPoint2.set(node.curveTo.position).subtract(node.position).normalize();
    workerPoint1.add(workerPoint2).normalize();
    workerPoint2.set(workerPoint1).scale(value * node.curveTo.position.distanceFrom(node.position));
    node.controlPoint2.set(node.position).add(workerPoint2);
    workerPoint2.set(workerPoint1).scale(-value * node.position.distanceFrom(originNode.position));
    node.controlPoint1.set(node.position).add(workerPoint2);
}
/**
 * @param {PetalConfig} config 
 */ function $2fc098c386365677$var$fillPetalDefaults(config) {
    const geometry = config.geometry;
    if (!geometry.width || !geometry.count || !geometry.length) console.log("crucial config missing or invalid config.");
    else {
        if ($2fc098c386365677$var$isNull(geometry.outerWidth)) geometry.outerWidth = geometry.width;
        if ($2fc098c386365677$var$isNull(geometry.angleOffset)) geometry.angleOffset = 0;
        if ($2fc098c386365677$var$isNull(geometry.radialOffset)) geometry.radialOffset = 0;
        if ($2fc098c386365677$var$isNull(geometry.balance)) geometry.balance = 0.5;
        if ($2fc098c386365677$var$isNull(geometry.smoothing)) geometry.smoothing = 0;
        if ($2fc098c386365677$var$isNull(geometry.innerWidth)) geometry.innerWidth = geometry.width;
        if ($2fc098c386365677$var$isNull(geometry.offsetX)) geometry.offsetX = 0;
        if ($2fc098c386365677$var$isNull(geometry.offsetY)) geometry.offsetY = 0;
    }
    $2fc098c386365677$var$fillFillDefaults(config.fill);
}
/**
 * @param {FillStyle} fill
 */ function $2fc098c386365677$var$fillFillDefaults(fill) {
    fill.color.forEach((stop)=>{
        if ($2fc098c386365677$var$isNull(stop.offset)) stop.offset = 0.5;
    });
    if ($2fc098c386365677$var$isNull(fill.strokeColor)) fill.strokeColor = "#000000";
    if ($2fc098c386365677$var$isNull(fill.strokeWidth)) fill.strokeWidth = 0;
    if (!fill.shadow) fill.shadow = {
        blur: 0,
        offsetX: 0,
        offsetY: 0,
        color: "#000",
        opacity: 1
    };
}
/**
 * 
 * @param {CenterArrangment} config 
 */ function $2fc098c386365677$var$fillCenterDefaults(config) {
    $2fc098c386365677$var$fillFillDefaults(config.fill.base);
    $2fc098c386365677$var$fillFillDefaults(config.fill.tip);
}
/**
 * Makes a unit vector and returns
 * one perpendicular vector to it
 * @param {VectorBloomPoint} point 
 */ function $2fc098c386365677$var$makePerpendicular(point) {
    point.normalize();
    const x = point.x;
    const y = point.y;
    point.x = -y;
    point.y = x;
}
/**
 * @typedef CenterArrangement
 * @property {VectorBloomPath[]} bases
 * @property {VectorBloomPath[]} tips
 */ /**
 * @param {CenterGeometry} arrangement 
 * @param {number} radius 
 * @returns {CenterArrangement}
 */ function $2fc098c386365677$var$createCenter(arrangement, radius) {
    let n = 0;
    let currentRadius = (arrangement.range[0] || 0) * radius;
    const minRadius = currentRadius;
    const maxRadius = (arrangement.range[1] || 1) * radius;
    const radiusRange = maxRadius - currentRadius;
    const ageRange = arrangement.age[1] - arrangement.age[0];
    const sizeRange = arrangement.size[1] - arrangement.size[0];
    /**@type {CenterArrangement} */ const centerArrangement = {
        bases: [],
        tips: []
    };
    let angle = 0;
    if (currentRadius != 0) n = Math.pow(currentRadius / arrangement.density, 2);
    do {
        angle = n * $2fc098c386365677$var$GOLDEN_RADIANS;
        currentRadius = arrangement.density * Math.sqrt(n);
        const currentRadiusRatio = (currentRadius - minRadius) / radiusRange;
        const currentAge = currentRadiusRatio * ageRange + arrangement.age[0];
        const currentSize = currentRadiusRatio * sizeRange + arrangement.size[0];
        const { base: base , tip: tip  } = $2fc098c386365677$var$createCenterShape(currentRadius, currentAge, currentSize, angle);
        if (base) centerArrangement.bases.push(base);
        if (tip) centerArrangement.tips.push(tip);
        n++;
    }while (currentRadius < maxRadius)
    return centerArrangement;
}
/**
 * 
 * @param {number} r 
 * @param {number} age
 * @param {number} size
 * @param {number} angle 
 * @returns {{base: VectorBloomPath, tip: VectorBloomPath}}
 */ function $2fc098c386365677$var$createCenterShape(r, age, size, angle) {
    const workerPoint1 = new $f007ebde6a4d0933$export$29b1dadb55dcfd29(0, 0);
    const workerPoint2 = new $f007ebde6a4d0933$export$29b1dadb55dcfd29(0, 0);
    const workerPoint3 = new $f007ebde6a4d0933$export$29b1dadb55dcfd29(0, 0);
    const workerPoint4 = new $f007ebde6a4d0933$export$29b1dadb55dcfd29(0, 0);
    workerPoint1.set(r * Math.sin(angle), r * Math.cos(angle));
    const baseNodes = [];
    const tipNodes = [];
    if (age < 0.5) {
        /**
		 * this shape is a quadrilateral with points in clockwise order start from South
		 * The south one points towards the center
		 */ let offset = angle + Math.PI;
        const smoothingFactor = age < 0.1 ? 0 : size * age;
        let floretLength = Math.min(size * 6, 0.5 / age * size);
        if (floretLength > r) floretLength = r;
        baseNodes.push($2fc098c386365677$var$getRadialNode(offset, floretLength, workerPoint1, 0));
        for(let i = 0; i < 3; i++){
            offset += Math.PI / 2;
            baseNodes.push($2fc098c386365677$var$getRadialNode(offset, size, workerPoint1, smoothingFactor));
        }
    } else {
        //create base shape
        const fullCirle = Math.PI * 2;
        let currentAngle = angle;
        const step = fullCirle / 10;
        let maxR = size;
        let minR = size;
        const deviation = size * (age - 0.5);
        minR -= deviation;
        const smoothing = Math.PI * minR / 15;
        for(let i = 0; i < 10; i++){
            baseNodes.push($2fc098c386365677$var$getRadialNode(currentAngle, i % 2 == 0 ? maxR : minR, workerPoint1, smoothing));
            currentAngle += step;
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
			 */ const hs = size * age / 4;
            const circleR = size / 2;
            tipNodes.push($2fc098c386365677$var$getRadialNode(angle - Math.PI / 2, hs, workerPoint1));
            tipNodes.push($2fc098c386365677$var$getRadialNode(angle + Math.PI / 2, hs, workerPoint1));
            workerPoint4.set(workerPoint1).normalize();
            workerPoint2.set(workerPoint4).scale(circleR * (age - 0.7) * 8).add(workerPoint1);
            tipNodes.push($2fc098c386365677$var$getRadialNode(angle + Math.PI / 2, hs, workerPoint2));
            //sweep a cicle. the following point is the center
            workerPoint3.set(workerPoint4).scale(circleR).add(workerPoint2);
            let offset = angle + Math.PI / 2;
            for(let i = 0; i < 3; i++){
                tipNodes.push($2fc098c386365677$var$getRadialNode(offset, circleR, workerPoint3, -circleR * 0.66));
                offset -= Math.PI / 2;
            }
            tipNodes.push($2fc098c386365677$var$getRadialNode(angle - Math.PI / 2, hs, workerPoint2));
        }
    }
    return {
        base: baseNodes.length ? new $a124a4be495d40a7$export$49e3432e3d0b046c(baseNodes) : null,
        tip: tipNodes.length ? new $a124a4be495d40a7$export$49e3432e3d0b046c(tipNodes) : null
    };
}
/**
 * @param {PetalConfig} petalConfig
 * @param {number} centerRadius
 * @returns  {VectorBloomPath[]}
 */ function $2fc098c386365677$var$createPetals(petalConfig, centerRadius) {
    const petalGeometry = petalConfig.geometry;
    //start from 0 degrees 12oclock.
    let offset = $2fc098c386365677$var$ToRadian(petalGeometry.angleOffset || 0);
    const step = Math.PI * 2 / petalGeometry.count;
    const petals = [];
    centerRadius += (petalConfig.geometry.radialOffset || 0) * centerRadius;
    for(let i = 0; i < petalGeometry.count; i++){
        const petal = $2fc098c386365677$var$createPetal(petalGeometry, centerRadius, offset);
        petals.push(petal);
        offset += step;
    }
    return petals;
}
/**
 * A petal is defined by 8 points.
 * @param {PetalGeometry} petalGeometry 
 * @param {number} centerRadius 
 * @param {number} offset 
 * @returns {VectorBloomPath}
 */ function $2fc098c386365677$var$createPetal(petalGeometry, centerRadius, offset) {
    const innerWidthHalf = $2fc098c386365677$var$ToRadian(petalGeometry.innerWidth / 2);
    const outerWidthHalf = $2fc098c386365677$var$ToRadian(petalGeometry.outerWidth / 2);
    const widthHalf = $2fc098c386365677$var$ToRadian(petalGeometry.width / 2);
    let extension = 0;
    if (petalGeometry.extendOutside) extension = (centerRadius + petalGeometry.length) * outerWidthHalf;
    const centerOffset = new $f007ebde6a4d0933$export$29b1dadb55dcfd29(petalGeometry.offsetX || 0, petalGeometry.offsetY || 0);
    const petalNodes = [];
    petalNodes.push($2fc098c386365677$var$getRadialNode(offset - innerWidthHalf, centerRadius, centerOffset), $2fc098c386365677$var$getRadialNode(offset, centerRadius - 10, centerOffset), $2fc098c386365677$var$getRadialNode(offset + innerWidthHalf, centerRadius, centerOffset), $2fc098c386365677$var$getRadialNode(offset + widthHalf, centerRadius + petalGeometry.length * petalGeometry.balance, centerOffset), $2fc098c386365677$var$getRadialNode(offset + outerWidthHalf, centerRadius + petalGeometry.length, centerOffset), $2fc098c386365677$var$getRadialNode(offset, centerRadius + petalGeometry.length + extension, centerOffset), $2fc098c386365677$var$getRadialNode(offset - outerWidthHalf, centerRadius + petalGeometry.length, centerOffset), $2fc098c386365677$var$getRadialNode(offset - widthHalf, centerRadius + petalGeometry.length * petalGeometry.balance, centerOffset));
    const petal = new $a124a4be495d40a7$export$49e3432e3d0b046c(petalNodes);
    if (petalGeometry.smoothing) {
        petal.nodes.forEach((node, index)=>{
            const fromNode = index === 0 ? petal.nodes[petal.nodes.length - 1] : petal.nodes[index - 1];
            $2fc098c386365677$var$ApplySmoothing(node, fromNode, petalGeometry.smoothing);
        });
        petal.compilePathData();
    }
    return petal;
}
/**
 * @param {number} angle 
 * @param {number} distance 
 * @param {VectorBloomPoint} [position] 
 * @param {number} [smoothing]
 * @returns {VectorBloomNode}
 */ function $2fc098c386365677$var$getRadialNode(angle, distance, position, smoothing) {
    let x = Math.sin(angle) * distance;
    let y = Math.cos(angle) * distance;
    if (position) {
        x += position.x;
        y += position.y;
    }
    const createdNode = new $a124a4be495d40a7$export$e4c1e9b5fa4cf163(x, y);
    if (smoothing) {
        const workerPoint1 = new $f007ebde6a4d0933$export$29b1dadb55dcfd29();
        workerPoint1.set(createdNode.position).subtract(position);
        $2fc098c386365677$var$makePerpendicular(workerPoint1);
        createdNode.controlPoint1.set(workerPoint1.scale(smoothing)).add(createdNode.position);
        createdNode.controlPoint2.set(workerPoint1.scale(-1).add(createdNode.position));
    }
    return createdNode;
}
/**
 * 
 * @param {string} id 
 * @param {GradientStop[]} stops 
 * @returns {SVGRadialGradientElement}
 */ function $2fc098c386365677$var$createRadialGradient(id, stops) {
    const radialGradient = document.createElementNS("http://www.w3.org/2000/svg", "radialGradient");
    radialGradient.id = id;
    radialGradient.setAttribute("cx", "0");
    radialGradient.setAttribute("cy", "0");
    radialGradient.setAttribute("fx", "0");
    radialGradient.setAttribute("fy", "0");
    radialGradient.setAttribute("r", "50%");
    stops.forEach((stopObj)=>{
        const stop = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        stop.setAttribute("style", `stop-color:${stopObj.color}`);
        stop.setAttribute("offset", stopObj.offset == null ? "50%" : stopObj.offset * 100 + "%");
        radialGradient.appendChild(stop);
    });
    radialGradient.setAttribute("gradientUnits", "userSpaceOnUse");
    radialGradient.classList.add("vectorBloomTypes");
    return radialGradient;
}
/**
 * @param {string} id 
 * @param {ShadowConfig} shadowConfig 
 * @returns {SVGFilterElement}
 */ function $2fc098c386365677$var$createShadowFilter(id, shadowConfig) {
    const filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
    filter.setAttribute("x", "-150%");
    filter.setAttribute("y", "-150%");
    filter.setAttribute("width", "300%");
    filter.setAttribute("height", "300%");
    filter.id = id;
    /**
	 * FeDropShadow is a short hand notation for a composite of filter. 
	 * It may not be supported by all renderers. Alteast Inkscape doesn't 
	 * support it. May be its not spec?
	 */ /* const feShadowElem = document.createElementNS("http://www.w3.org/2000/svg", "feDropShadow")
	feShadowElem.setAttribute("dx", shadowConfig.offsetX + "")
	feShadowElem.setAttribute("dy", shadowConfig.offsetY + "")
	feShadowElem.setAttribute("stdDeviation", shadowConfig.blur + "")
	feShadowElem.setAttribute("flood-color", shadowConfig.color)
	feShadowElem.setAttribute("flood-opacity", shadowConfig.opacity + "") */ //feFlood
    const feFlood = document.createElementNS("http://www.w3.org/2000/svg", "feFlood");
    feFlood.setAttribute("flood-opacity", shadowConfig.opacity + "");
    feFlood.setAttribute("flood-color", shadowConfig.color);
    feFlood.setAttribute("result", "flood");
    //feOffset
    const feOffset = document.createElementNS("http://www.w3.org/2000/svg", "feOffset");
    feOffset.setAttribute("dx", (shadowConfig.offsetX || 0) + "");
    feOffset.setAttribute("dy", (shadowConfig.offsetY || 0) + "");
    feOffset.setAttribute("result", "offset");
    //feGaussianBlur
    const feGB = document.createElementNS("http://www.w3.org/2000/svg", "feGaussianBlur");
    feGB.setAttribute("stdDeviation", (shadowConfig.blur || 0) + "");
    feGB.setAttribute("in", "composite1");
    feGB.setAttribute("result", "blur");
    //composites
    const feComposite1 = document.createElementNS("http://www.w3.org/2000/svg", "feComposite");
    feComposite1.setAttribute("in", "flood");
    feComposite1.setAttribute("in2", "SourceGraphic");
    feComposite1.setAttribute("operator", "in");
    feComposite1.setAttribute("result", "composite1");
    const feComposite2 = document.createElementNS("http://www.w3.org/2000/svg", "feComposite");
    feComposite2.setAttribute("in", "SourceGraphic");
    feComposite2.setAttribute("in2", "offset");
    feComposite2.setAttribute("operator", "over");
    feComposite2.setAttribute("result", "composite2");
    filter.appendChild(feFlood);
    filter.appendChild(feComposite1);
    filter.appendChild(feGB);
    filter.appendChild(feOffset);
    filter.appendChild(feComposite2);
    filter.classList.add("vectorBloomTypes");
    return filter;
}
/**
 * @returns {SVGSVGElement}
 */ function $2fc098c386365677$var$createSVGElement() {
    const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svgElement.setAttribute("class", "vectorBloomSVG");
    svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svgElement.style.width = "100%";
    svgElement.style.height = "100%";
    //ensure this is the first element
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.classList.add("vectorBloomDefs");
    svgElement.appendChild(defs);
    const styleTag = document.createElementNS("http://www.w3.org/2000/svg", "style");
    styleTag.type = "text/css";
    svgElement.appendChild(styleTag);
    const translateGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svgElement.appendChild(translateGroup);
    return svgElement;
}
/**
 * @typedef CircleConfig
 * @property {number} radius
 * @property {string} color
 * @property {number} [x] 
 * @property {number} [y] 
 */ /**
 * @param {CircleConfig} config
 * @returns {SVGCircleElement}
 */ function $2fc098c386365677$var$createCircleElement(config) {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", ($2fc098c386365677$var$isNull(config.x) ? 0 : config.x) + "");
    circle.setAttribute("cy", ($2fc098c386365677$var$isNull(config.y) ? 0 : config.y) + "");
    circle.setAttribute("r", config.radius + "");
    circle.setAttribute("fill", config.color);
    return circle;
}


export {$2fc098c386365677$export$5a1d4940b51d91ff as VectorBloom};
//# sourceMappingURL=vector-bloom.module.js.map
