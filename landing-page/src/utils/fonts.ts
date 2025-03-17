import { Comfortaa, Inter, Poppins, Young_Serif, IBM_Plex_Mono } from "next/font/google";

export const comfortaa = Comfortaa({ subsets: ["latin"] });
export const inter = Inter({ subsets: ["latin"] });
// regular
export const poppins400 = Poppins({
    subsets: ["latin"],
    weight: "400",
});
// medium
export const poppins500 = Poppins({
    subsets: ["latin"],
    weight: "500",
});
// semi-bold
export const poppins600 = Poppins({
    subsets: ["latin"],
    weight: "600",
});

// bold
export const poppins700 = Poppins({
    subsets: ["latin"],
    weight: "700",
});
export const youngserif = Young_Serif({
    subsets: ["latin"],
    weight: "400"
});
export const ibmplexmono600 = IBM_Plex_Mono({
    subsets: ["latin"],
    weight: "600"
});
