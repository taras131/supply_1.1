import { createTheme } from '@mui/material/styles';
import {colorSchemes, typography} from './themePrimitives';

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
});