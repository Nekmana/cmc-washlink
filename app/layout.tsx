import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Or Outfit as suggested
import "./globals.css";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";

const font = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "CMC WashLink",
    description: "Peer-to-Peer Laundry Marketplace",
    generator: 'v0.dev',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={font.className}>
                <div className="flex min-h-screen flex-col">
                    <Navbar />
                    <main className="flex-1">
                        {children}
                    </main>
                    <BottomNav />
                </div>
                <Toaster richColors position="top-center" />
            </body>
        </html>
    );
}
