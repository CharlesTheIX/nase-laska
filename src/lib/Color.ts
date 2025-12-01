export default class Color {
  public static alphaToHex = (alpha: number): string => {
    const a = Math.max(0, Math.min(1, alpha));
    return Math.floor(a * 255)
      .toString(16)
      .padStart(2, "0");
  };

  public static black = (alpha?: number) => {
    if (alpha == undefined) return `#222222`;
    return `#222222${Color.alphaToHex(alpha)}`;
  };

  public static red = (alpha?: number) => {
    if (alpha == undefined) return `#ff2222`;
    return `#ff2222${Color.alphaToHex(alpha)}`;
  };

  public static grey = (alpha?: number) => {
    if (alpha == undefined) return `#bbbbbb`;
    return `#bbbbbb${Color.alphaToHex(alpha)}`;
  };

  public static white = (alpha?: number) => {
    if (alpha == undefined) return `#ffffff`;
    return `#ffffff${Color.alphaToHex(alpha)}`;
  };
}
