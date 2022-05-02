/**
 * @class VectorBloomPoint
 * Creates object that holds x and y coordinates of a two dimensional Point.
 * Provides methods for common operations with the point.
 */
 export class VectorBloomPoint {
	/**
	 * @param {number} [x]
	 * @param {number} [y]
	 */
	constructor(x = 0, y = 0) {
		/** @type {number} */
		this.x = x
		/** @type {number} */
		this.y = y
	}

	/**
	 * @param {number|{x:number, y:number}} _x 
	 * @param {number} [_y] 
	 * @returns {VectorBloomPoint}
	 */
	set(_x, _y) {
		if (typeof _x == "number") {
			this.x = _x
			this.y = _y
		} else {
			this.x = _x.x
			this.y = _x.y
		}
		return this
	}

	/**
	 * @returns {number}
	 */
	magnitude() {
		return Math.sqrt((this.x * this.x) + (this.y * this.y))
	}

	/**
	 * Creates a unit vector in place
	 * @returns {VectorBloomPoint}
	 */
	normalize() {
		const magnitude = this.magnitude()
		this.x /= magnitude
		this.y /= magnitude
		return this
	}

	/**
	 * @param {number} factor 
	 * @returns {VectorBloomPoint}
	 */
	scale(factor) {
		this.x *= factor
		this.y *= factor
		return this
	}

	/**
	 * Creates a unit vector but returns shiny new Point Object
	 * @returns {VectorBloomPoint}
	 */
	unit() {
		return new VectorBloomPoint(this.x, this.y).scale(1 / this.magnitude())
	}

	/**
	 * The slope of the the unit line from origin to point in radians
	 * @returns {number}
	 */
	angle() {
		let angle = Math.atan2(this.y, this.x)
		if (angle < 0) {
			angle += 2 * Math.PI
		}
		return angle
	}

	/**
	 * @param {number|VectorBloomPoint} _point 
	 * @param {number} [y] 
	 * @returns {number}
	 */
	distanceFrom(_point, y) {
		return Math.sqrt(this.squaredDistanceFrom(_point, y))
	}

	/**
	 * @param {number|{x:number, y:number}} _point 
	 * @param {number} [y] 
	 * @returns {number}
	 */
	squaredDistanceFrom(_point, y) {
		let xd, yd
		if (typeof _point == "number") {
			xd = _point - this.x
			yd = y - this.y
		} else {
			xd = _point.x - this.x
			yd = _point.y - this.y
		}

		return (xd * xd) + (yd * yd)
	}

	/**
	 * Calculates the unit vector describing the direction to the passed
	 * point
	 * @param {VectorBloomPoint} point 
	 * @returns {VectorBloomPoint}
	 */
	direction(point) {
		let distance = this.distanceFrom(point)
		return new VectorBloomPoint((this.x - point.x), (this.y - point.y)).scale(1 / distance)
	}

	/**
	 * @param {number|VectorBloomPoint} _point 
	 * @param {number} [y] 
	 * @returns {VectorBloomPoint}
	 */
	add(_point, y) {
		if (typeof _point == "number") {
			this.x += _point
			this.y += y
		} else {
			this.x += _point.x
			this.y += _point.y
		}
		return this
	}

	/**
	 * @param {number|VectorBloomPoint} _point 
	 * @param {number} [y] 
	 * @returns {VectorBloomPoint}
	 */
	subtract(_point, y) {
		if (typeof _point == "number") {
			this.x -= _point
			this.y -= y
		} else {
			this.x -= _point.x
			this.y -= _point.y
		}
		return this
	}

	/**
	 * @param {number|VectorBloomPoint} _point 
	 * @param {number} [y] 
	 * @returns {VectorBloomPoint}
	 */
	midPoint(_point, y) {
		let xd, yd
		if (typeof _point == "number") {
			xd = _point
			yd = y
		} else {
			xd = _point.x
			yd = _point.y
		}
		return new VectorBloomPoint(this.x + xd, this.y + yd).scale(1 / 2)
	}

	/**
	 * Rotates a point about another point by angle provided
	 * @param {VectorBloomPoint} point 
	 * @param {number} angle In radians
	 * @returns {VectorBloomPoint}
	 */
	rotateAbout(point, angle) {
		const dx = this.x - point.x
		const dy = this.y - point.y

		const cosx = Math.cos(angle)
		const sinx = Math.sin(angle)

		this.x = point.x + (dx * cosx) + (dy * sinx)
		this.y = point.y + (dy * cosx) - (dx * sinx)
		// invert y axis in dom

		return this
	}

	/**
	 * @param {VectorBloomPoint} point 
	 * @returns {boolean}
	 */
	isSame(point) {
		if (this.x == point.x && this.y == point.y) {
			return true
		}
		return false
	}

	/**
	 * @param {VectorBloomPoint[]} points
	 * @returns {VectorBloomPoint}
	 */
	static ComputeCenter(points) {
		let x = 0,
			y = 0
		points.forEach(function(element) {
			x += element.x
			y += element.y
		})
		return new VectorBloomPoint(x, y).scale(1 / points.length)
	}
}