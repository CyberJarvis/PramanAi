import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PRAMAN 2.0 | Crisis Analytics",
  description: "Advanced causal crisis analytics and decision support system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased selection:bg-blue-500/30 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
