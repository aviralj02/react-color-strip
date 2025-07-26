export interface ColorValue {
  hex: string;
  rgb: {
    r: number;
    g: number;
    b: number;
  };
  hsl: {
    h: number;
    s: number;
    l: number;
  };
}

export interface PointerProps {
  /**
   * Width of the pointer in pixels
   * @default 12
   */
  width?: number;
  /**
   * Height of the pointer in pixels (defaults to strip height)
   */
  height?: number;
  /**
   * Background color of the pointer
   * @default 'white'
   */
  backgroundColor?: string;
  /**
   * CSS border style
   * @default none
   */
  border?: React.CSSProperties["border"];
  /**
   * Border radius of the pointer
   * @default '2px'
   */
  borderRadius?: React.CSSProperties["borderRadius"];
  /**
   * Box shadow of the pointer
   * @default '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
   */
  boxShadow?: React.CSSProperties["boxShadow"];
  /**
   * Whether to show scale animation on drag
   * @default true
   */
  scaleOnDrag?: boolean;
  /**
   * Scale factor when dragging (only if scaleOnDrag is true)
   * @default 1.1
   */
  dragScale?: number;
}

export interface ColorStripProps {
  /**
   * Current color value (can be hex, rgb, or hsl string)
   */
  value?: string;
  /**
   * Width of the color strip in pixels
   * @default 300
   */
  width?: number;
  /**
   * Height of the color strip in pixels
   * @default 20
   */
  height?: number;
  /**
   * Whether the color strip is disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * Pointer configuration
   */
  pointer?: PointerProps;
  /**
   * Additional CSS Styling
   */
  style?: React.CSSProperties;
  /**
   * Strip's Border Radius
   */
  rounded?: React.CSSProperties["borderRadius"];
  /**
   * Custom Color Strip
   */
  customColor?: string;
  /**
   * Called when color changes during drag
   */
  onChange?: (color: ColorValue) => void;
  /**
   * Called when color change is complete (drag ends)
   */
  onChangeComplete?: (color: ColorValue) => void;
}
