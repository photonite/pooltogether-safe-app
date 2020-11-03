import { theme } from "@gnosis.pm/safe-react-components";
import merge from "lodash/merge";

const getTheme = () =>
  merge(theme, {
    colors: {
      primary: "#4c249f",
      primaryHover: "#9c48ba",
      primaryLight: "#ad59cb",

      secondary: "#10d0b0",
      secondaryHover: "#35f0d0",
      secondaryLight: "#35f0d0",
    },
  });

export default getTheme;
