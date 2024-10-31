import type {CornerDotType, CornerSquareType, DotType, ShapeType} from "qr-code-styling";

export interface Config {
    app: {
        toolbox: {
            /**
             * QR code settings
             * @visibility frontend
             */
            qrCode: {
                /**
                 * all the defaults for the qr code generator
                 * @deepVisibility frontend
                 */
                defaults: {
                    /**
                     * Dot type
                     * @visibility frontend
                     */
                    dotType: DotType;
                    /**
                     * Dot color
                     * @visibility frontend
                     */
                    dotColor: string;
                    /**
                     * Corner square type
                     * @visibility frontend
                     */
                    cornerSquareType: CornerSquareType;
                    /**
                     * Corner square color
                     * @visibility frontend
                     */
                    cornerSquareColor: string;
                    /**
                     * Corner dot type
                     * @visibility frontend
                     */
                    cornerDotType: CornerDotType;
                    /**
                     * Corner dot color
                     * @visibility frontend
                     */
                    cornerDotColor: string;
                    /**
                     * Shape
                     * @visibility frontend
                     */
                    shape: ShapeType;
                };
            };
        };
    };
}
