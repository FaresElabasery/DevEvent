import type { Metadata } from "next";
import { Martian_Mono, Schibsted_Grotesk } from "next/font/google";
import "./globals.css";
import LightRays from "@/components/ui/LightRays";

const martianMono = Martian_Mono({
  variable: "--font-Martian-Mono",
  subsets: ["latin"],
});

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-Schibsted-Grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevEvent",
  description: "The Hub for Developer Events Worldwide",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${martianMono.variable} ${schibstedGrotesk.variable} min-h-screen antialiased`}
      >
        <div className="min-h-screen absolute inset-0 -z-1 ">
          <LightRays
            raysOrigin="top-center-offset"
            raysColor="#5dfeca"
            raysSpeed={0.5}
            lightSpread={0.9}
            rayLength={1.4}
            followMouse={true}
            mouseInfluence={0.06}
            noiseAmount={0}
            distortion={0.01}
          />
        </div>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
