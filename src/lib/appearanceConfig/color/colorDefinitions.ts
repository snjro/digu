import type { ThemeColor } from "@db/dbTypes";
import colors from "tailwindcss/colors";
import type { DefaultColors } from "tailwindcss/types/generated/colors";
import { colorDefinitionsDark } from "./colorDefinitionsDark";
import { colorDefinitionsLight } from "./colorDefinitionsLight";

export type ColorDefinitionForParts = {
  text: `text-${string}`;
  textOpacity: `text-${string}/${number}`;
  textEmphasis: `text-${string}`;
  textHover: `hover:text-${string}`;
  fill: `fill-${string}`;
  fillEmphasis: `fill-${string}`;
  fillOpacity: `fill-${string}/${number}`;
  fillHover: `hover:fill-${string}`;
  bg: `bg-${string}`;
  bgEmphasis: `bg-${string}`;
  bgOpacity: `bg-${string}/${number}`;
  bgHover: `hover:bg-${string}`;
  shadow: `shadow-${string}`;
  border: `border-${string}`;
};
export type ColorCategory =
  | "success"
  | "error"
  | "interactive"
  | "primary"
  | "secondary";
export type ColorDefinitionCategories = {
  [key in ColorCategory]: ColorDefinitionForParts;
};
type ColorDefinitions = {
  [key in ThemeColor]: ColorDefinitionCategories;
};
export const colorDefinitions: ColorDefinitions = {
  light: colorDefinitionsLight,
  dark: colorDefinitionsDark,
};
export function getColorHexWithSharpFromTailwindColor(
  tailWindColorClass: ColorDefinitionForParts[keyof ColorDefinitionForParts],
): `#${string}` {
  const splitTailwindColorClass: string[] = tailWindColorClass.split("-");
  const colorName: keyof DefaultColors =
    splitTailwindColorClass[1] as keyof DefaultColors;
  const colorDepth =
    splitTailwindColorClass[2] as keyof DefaultColors[typeof colorName];
  const colorHexWithSharp = colors[colorName][
    colorDepth
  ] as DefaultColors[typeof colorName][typeof colorDepth];
  return colorHexWithSharp;
}
