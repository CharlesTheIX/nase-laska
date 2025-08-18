/* D */
type DrawRectangleProps = { rectangle: IRectangle; color?: string };
type DrawTextLinesProps = {
  color?: string;
  lines: string[];
  position: IVector2;
  align?: CanvasTextAlign;
};
