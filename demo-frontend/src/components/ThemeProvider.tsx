"use client";

import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline } from "@mui/material";

type Mode = "light" | "dark";

const ColorModeContext = createContext({ toggleColorMode: () => { } });

export function useColorMode() {
    return useContext(ColorModeContext);
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
    const [mode, setMode] = useState<Mode>("light");

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => setMode((prev) => (prev === "light" ? "dark" : "light")),
        }),
        []
    );

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    ...(mode === "light"
                        ? { background: { default: "#f5f7fa" } }
                        : {}),
                },
                typography: {
                    fontFamily: "var(--font-geist-sans), sans-serif",
                },
            }),
        [mode]
    );

    return (
        <ColorModeContext.Provider value={colorMode}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        </ColorModeContext.Provider>
    );
}
