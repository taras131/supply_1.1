import { createTheme } from '@mui/material/styles';
import {colorSchemes, typography} from './themePrimitives';
import {gridClasses} from "@mui/x-data-grid";

declare module '@mui/material/styles' {
    interface Palette {
        baseShadow: string;
    }
    interface PaletteOptions {
        baseShadow?: string;
    }
    interface TypeText {
        warning?: string;
    }
}
export const theme = createTheme({
    cssVariables: {
        colorSchemeSelector: 'data', // или 'class'
        // cssVarPrefix: 'mui' // опционально
    },
    colorSchemes,
    typography: {
        fontFamily: `'Inter', sans-serif`,
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
        fontWeightBold: 600,
    },
});