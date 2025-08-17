/* D */
type DrawImageProps = { image: HTMLImageElement; r_src: IRectangle; r_dest: IRectangle };
type DrawRectangleProps = { rectangle: IRectangle; color?: string };
type DrawTextLinesProps = {
  color?: string;
  lines: string[];
  position: IVector2;
  align?: CanvasTextAlign;
};
