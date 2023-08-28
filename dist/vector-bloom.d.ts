declare module "vector-bloom-point" {
    /**
     * @class VectorBloomPoint
     * Creates object that holds x and y coordinates of a two dimensional Point.
     * Provides methods for common operations with the point.
     */
    export class VectorBloomPoint {
        /**
         * @param {VectorBloomPoint[]} points
         * @returns {VectorBloomPoint}
         */
        static ComputeCenter(points: VectorBloomPoint[]): VectorBloomPoint;
        /**
         * @param {number} [x]
         * @param {number} [y]
         */
        constructor(x?: number, y?: number);
        /** @type {number} */
        x: number;
        /** @type {number} */
        y: number;
        /**
         * @param {number|{x:number, y:number}} _x
         * @param {number} [_y]
         * @returns {VectorBloomPoint}
         */
        set(_x: number | {
            x: number;
            y: number;
        }, _y?: number): VectorBloomPoint;
        /**
         * @returns {number}
         */
        magnitude(): number;
        /**
         * Creates a unit vector in place
         * @returns {VectorBloomPoint}
         */
        normalize(): VectorBloomPoint;
        /**
         * @param {number} factor
         * @returns {VectorBloomPoint}
         */
        scale(factor: number): VectorBloomPoint;
        /**
         * Creates a unit vector but returns shiny new Point Object
         * @returns {VectorBloomPoint}
         */
        unit(): VectorBloomPoint;
        /**
         * The slope of the the unit line from origin to point in radians
         * @returns {number}
         */
        angle(): number;
        /**
         * @param {number|VectorBloomPoint} _point
         * @param {number} [y]
         * @returns {number}
         */
        distanceFrom(_point: number | VectorBloomPoint, y?: number): number;
        /**
         * @param {number|{x:number, y:number}} _point
         * @param {number} [y]
         * @returns {number}
         */
        squaredDistanceFrom(_point: number | {
            x: number;
            y: number;
        }, y?: number): number;
        /**
         * Calculates the unit vector describing the direction to the passed
         * point
         * @param {VectorBloomPoint} point
         * @returns {VectorBloomPoint}
         */
        direction(point: VectorBloomPoint): VectorBloomPoint;
        /**
         * @param {number|VectorBloomPoint} _point
         * @param {number} [y]
         * @returns {VectorBloomPoint}
         */
        add(_point: number | VectorBloomPoint, y?: number): VectorBloomPoint;
        /**
         * @param {number|VectorBloomPoint} _point
         * @param {number} [y]
         * @returns {VectorBloomPoint}
         */
        subtract(_point: number | VectorBloomPoint, y?: number): VectorBloomPoint;
        /**
         * @param {number|VectorBloomPoint} _point
         * @param {number} [y]
         * @returns {VectorBloomPoint}
         */
        midPoint(_point: number | VectorBloomPoint, y?: number): VectorBloomPoint;
        /**
         * Rotates a point about another point by angle provided
         * @param {VectorBloomPoint} point
         * @param {number} angle In radians
         * @returns {VectorBloomPoint}
         */
        rotateAbout(point: VectorBloomPoint, angle: number): VectorBloomPoint;
        /**
         * @param {VectorBloomPoint} point
         * @returns {boolean}
         */
        isSame(point: VectorBloomPoint): boolean;
    }
}
declare module "vector-bloom-path" {
    export class VectorBloomNode {
        /**
         *
         * @param {number} x
         * @param {number} y
         */
        constructor(x: number, y: number);
        position: VectorBloomPoint;
        curveTo: VectorBloomNode;
        controlPoint1: VectorBloomPoint;
        controlPoint2: VectorBloomPoint;
    }
    export class VectorBloomPath {
        /**
         * @param {VectorBloomNode[]} nodes
         */
        constructor(nodes: VectorBloomNode[]);
        nodes: VectorBloomNode[];
        element: SVGPathElement;
        /**
         * Call this method whenever updating nodes.
         * Updates the path attribute (d) on the svg element and assigns it to pathData member
         * @returns {string}
         */
        compilePathData(): string;
        pathData: string;
    }
    import { VectorBloomPoint } from "vector-bloom-point";
}
declare module "vector-bloom" {
    export class VectorBloom {
        /**
         * @param { BloomConfig } config
         */
        static FillDefaults(config: BloomConfig): void;
        /**
         * @param {BloomConfig} config
         */
        constructor(config: BloomConfig);
        /**
         * Assign a unique id to this flower so that the elements created have unique
         * id names and classes.
         */
        id: string;
        petals: VectorBloomPath[][];
        center: CenterArrangement[];
        backgrounds: SVGCircleElement[];
        config: BloomConfig;
        svgElement: SVGSVGElement;
        maxWidth: number;
        /**
         * Currently update and create are the same function
         * Use this to update only geometry
         */
        updateGeometry(): void;
        /**
         * Currently update and create are the same function.
         * Use this to update only styles. Useful when only file, stroke or gradient is changed
         */
        updateStyles(): void;
        /**
         * Updates geometry and styles.
         */
        update(): void;
        /**
         * By default the flower is drawn in the center of the passed canvas.
         * @param {HTMLCanvasElement} canvas
         * @param {number} [x] - left position in pixels
         * @param {number} [y] - top position in pixels
         * @param {number} [w] - width in pixels
         * @param {number} [h] - height in pixels
         */
        renderOnCanvas(canvas: HTMLCanvasElement, x?: number, y?: number, w?: number, h?: number): void;
        /**
         * @param {"svgString"|"svgFileString"|"imageURL"|"jsonString"} exportType
         * @returns {string}
         */
        export(exportType: "svgString" | "svgFileString" | "imageURL" | "jsonString"): string;
        /**
         * This is useful sometimes to update the bounds of the svg to correctly contain
         * the flower in the container.
         */
        updateDrawingSize(): void;
    }
    export type CenterArrangement = {
        bases: VectorBloomPath[];
        tips: VectorBloomPath[];
    };
    export type CircleConfig = {
        radius: number;
        color: string;
        x?: number;
        y?: number;
    };
    export type BloomConfig = {
        petals: PetalConfig[];
        center?: CenterConfig;
    };
    export type CenterConfig = {
        /**
         * The radius of the flower center
         */
        radius: number;
        arrangement: CenterArrangment[];
    };
    export type PetalConfig = {
        geometry: PetalGeometry;
        fill?: FillStyle;
    };
    export type FillStyle = {
        /**
         * hex string
         */
        color: GradientStop[];
        /**
         * ?
         */
        strokeWidth: number;
        /**
         * ? hex string
         */
        strokeColor: string;
        shadow?: ShadowConfig;
    };
    export type ShadowConfig = {
        offsetX?: number;
        offsetY?: number;
        blur: number;
        /**
         * hex string
         */
        color?: string;
        opacity?: number;
    };
    export type GradientStop = {
        color: string;
        offset?: number;
    };
    export type PetalGeometry = {
        /**
         * The width of the petal at the center
         */
        width: number;
        /**
         * The number of petals
         */
        count: number;
        length: number;
        /**
         * The width of the petal at the radial origin
         */
        innerWidth?: number;
        /**
         * The width of the petal at the outer edge
         */
        outerWidth?: number;
        /**
         * Rotate the petal arrangement. In degrees
         */
        angleOffset?: number;
        /**
         * The radial offset from the center component. This is considered
         * as factor of center radius. Sensible values are -1 to 1
         */
        radialOffset?: number;
        /**
         * The point where the center balance of the petal is considered. Sensible
         * values are in the range [0, 1]. This affects how the width value is treated
         */
        balance?: number;
        /**
         * The pointness of the petal. Sensible values are from 0 - very pointy to
         * 1 - overlysmooth (this results in pointiness too)
         */
        smoothing?: number;
        /**
         * Extend the outer edge of the metal to form a smooth curve
         */
        extendOutside?: boolean;
        offsetX?: number;
        offsetY?: number;
        /**
         * Introduce random noise in the geometry
         */
        jitter?: number;
    };
    export type CenterArrangment = {
        geometry: CenterGeometry;
        fill?: CenterFill;
    };
    export type CenterFill = {
        base: FillStyle;
        /**
         * Based on age, tips don't always exist
         */
        tip: FillStyle;
        /**
         * a hex color value
         */
        background?: string;
    };
    export type CenterGeometry = {
        /**
         * 0 forms a sleeping floret. Array length is 2
         * 0.5 makes a vertical floret
         * 1 makes a floret radiating outward
         * This is an array of two integers between 0 1,
         * Age is linearly mapped along the radius
         */
        age: Array<number>;
        /**
         * Range is the percentage range of center to occupy. Array length is 2
         * ex: [0,1] occupies the full center
         * [0.75, 1] occupies outer 25 percent of the center radius
         */
        range?: Array<number>;
        /**
         * How closely the center elements are packed. Lower value results in
         * higher density.
         */
        density: number;
        /**
         * Linearly mapped along radius. Array length is 2
         */
        size: Array<number>;
    };
    import { VectorBloomPath } from "vector-bloom-path";
}
