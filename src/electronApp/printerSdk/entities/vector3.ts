/**
 * A three axis number.
 */
export class Vector3 {
    /**
     * Gets the value of the X axis.
     */
    X: number;

    /**
     * Gets the value of the Y axis.
     */
    Y: number;

    /**
     * Gets the value of the Z axis.
     */
    Z: number;

    /**
     * Initializes a new instance fo the Vector3 class.
     * @param x The value of the X axis.
     * @param y The value of the Y axis.
     * @param z The value of the Z axis.
     */
    constructor (x: number, y: number, z: number) {
        this.X = x;
        this.Y = y;
        this.Z = z;
    }
}