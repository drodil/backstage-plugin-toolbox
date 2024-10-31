export interface Config {
  app: {
    toolbox?: {
      /**
       * QR code settings
       * @visibility frontend
       */
      qrCode?: {
        /**
         * all the defaults for the qr code generator
         * @deepVisibility frontend
         */
        defaults?: {
          /**
           * Dot type
           * @visibility frontend
           */
          dotType?: string;
          /**
           * Dot color
           * @visibility frontend
           */
          dotColor?: string;
          /**
           * Corner square type
           * @visibility frontend
           */
          cornerSquareType?: string;
          /**
           * Corner square color
           * @visibility frontend
           */
          cornerSquareColor?: string;
          /**
           * Corner dot type
           * @visibility frontend
           */
          cornerDotType?: string;
          /**
           * Corner dot color
           * @visibility frontend
           */
          cornerDotColor?: string;
          /**
           * Shape
           * @visibility frontend
           */
          shape?: string;
        };
      };
    };
  };
}
