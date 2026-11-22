import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import "./globals.css";
export const metadata:Metadata={title:{default:"SalonBook — The Beauty Sanctuary",template:"%s | SalonBook"},description:"A considered approach to beauty. Discover bespoke salon services and reserve your moment of calm."};
export default function RootLayout({children}:{children:ReactNode}){
 return <html lang="en"><body>{children}<Toaster position="top-right" richColors closeButton/></body></html>;
}
