import { VectorBloomPoint } from "./vector-bloom-point.js"

export class VectorBloomNode {
	/**
	 * 
	 * @param {number} x 
	 * @param {number} y 
	 */
	constructor(x, y) {
		this.position = new VectorBloomPoint(x, y)
		this.curveTo = /** @type {VectorBloomNode} */ (null)
		this.controlPoint1 = new VectorBloomPoint(x, y)
		this.controlPoint2 = new VectorBloomPoint(x, y)
	}
}

export class VectorBloomPath {
	/**
	 * @param {VectorBloomNode[]} nodes 
	 */
	constructor(nodes) {
		this.nodes = nodes
		this.element = document.createElementNS("http://www.w3.org/2000/svg", "path")
		this.nodes.forEach((node, index) => node.curveTo = this.nodes[index + 1])
		this.nodes[this.nodes.length - 1].curveTo = this.nodes[0]
		this.pathData = this.compilePathData()
	}

	compilePathData() {
		/**
		 * @param {VectorBloomNode} node 
		 */
		function writeData(node) {
			pathString += `${node.controlPoint2.x} ${node.controlPoint2.y} `
			pathString += `${node.curveTo.controlPoint1.x} ${node.curveTo.controlPoint1.y} `
			pathString += `${node.curveTo.position.x} ${node.curveTo.position.y} `
		}

		let pathString = `M ${this.nodes[0].position.x} ${this.nodes[0].position.y} C `
		const target = this.nodes.length - 1
		for (let i = 0; i < target; i++) {
			const node = this.nodes[i]
			writeData(node)
		}
		writeData(this.nodes[target])
		pathString += "Z "
		this.element.setAttribute("d", pathString)
	}
}