import type { Metadata } from "next";
import { Roboto, Poppins } from "next/font/google";
import "../styles/globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "400", "700", "900"],
  variable: "--font-roboto",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "400", "700", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Ignite Call",
  description: "Aplicação desenvolvido no último módulo da Rocketseat com o professor Diego Fernandes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className={`${roboto.variable} ${poppins.variable}`}>
        {children}
      </body>
    </html>
  );
}
