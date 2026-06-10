import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap", preload: true });
const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  preload: true,
});

export const metadata = {
  title: "LUMIÈRE | Modern Luxury Fashion",
  description: "Premium eCommerce clothing for Men, Women, and Kids.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="antialiased min-h-screen flex flex-col font-sans">
        <Providers>
          <Navbar />
          <main className="flex-grow pt-20">{children}</main>
          
          <footer className="bg-secondary text-foreground py-12 mt-20 border-t border-secondary/80">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h2 className="text-xl font-bold uppercase tracking-widest mb-4 font-poppins text-primary">Lumière</h2>
                <p className="text-sm text-muted-foreground">Elevating modern fashion with timeless aesthetics and sustainable quality.</p>
              </div>
              <div>
                <h3 className="font-semibold uppercase tracking-wider mb-4 text-sm text-primary">Shop</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="/shop?category=Men" className="hover:text-primary transition">Men</Link></li>
                  <li><Link href="/shop?category=Women" className="hover:text-primary transition">Women</Link></li>
                  <li><Link href="/shop?category=Kids" className="hover:text-primary transition">Kids</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold uppercase tracking-wider mb-4 text-sm text-primary">Help</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="/contact" className="hover:text-primary transition">Contact Us</Link></li>
                  <li><Link href="/shipping" className="hover:text-primary transition">Shipping</Link></li>
                  <li><Link href="/returns" className="hover:text-primary transition">Returns</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold uppercase tracking-wider mb-4 text-sm text-primary">Newsletter</h3>
                <div className="flex gap-2">
                  <input type="email" placeholder="Email Address" className="px-4 py-2 w-full border border-primary/20 bg-background text-foreground outline-none focus:border-primary transition" />
                  <button className="bg-primary text-primary-foreground px-4 py-2 font-medium hover:bg-primary/90 transition">Subscribe</button>
                </div>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
