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
          
          <footer className="bg-secondary text-foreground py-16 mt-20 border-t border-secondary/80">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.7fr_0.7fr_0.9fr] gap-10 lg:gap-12 mb-12">
                <div className="max-w-md">
                  <h2 className="text-xl font-bold uppercase tracking-widest mb-4 font-poppins text-primary">Lumière</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    Elevating modern fashion with timeless aesthetics and sustainable quality. Premium clothing for the contemporary wardrobe.
                  </p>
                  <div className="flex gap-3">
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-primary/20 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all rounded-full">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-primary/20 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all rounded-full">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                    </a>
                    <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-primary/20 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all rounded-full">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                    </a>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold uppercase tracking-wider mb-4 text-sm text-primary">Shop</h3>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li><Link href="/shop?gender=Men" className="hover:text-primary transition">Men</Link></li>
                    <li><Link href="/shop?gender=Women" className="hover:text-primary transition">Women</Link></li>
                    <li><Link href="/shop?gender=Kids" className="hover:text-primary transition">Kids</Link></li>
                    <li><Link href="/shop?sale=true" className="hover:text-red-900 transition">Sale</Link></li>
                    <li><Link href="/shop" className="hover:text-primary transition">All Collections</Link></li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold uppercase tracking-wider mb-4 text-sm text-primary">Help</h3>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li><Link href="/profile" className="hover:text-primary transition">My Account</Link></li>
                    <li><Link href="/favourites" className="hover:text-primary transition">Favourites</Link></li>
                    <li><Link href="/cart" className="hover:text-primary transition">Cart</Link></li>
                    <li><Link href="/order-history" className="hover:text-primary transition">Track Order</Link></li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold uppercase tracking-wider mb-4 text-sm text-primary">Need Help?</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    Our team is happy to help with orders, sizing, or styling questions.
                  </p>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <a href="mailto:hello@lumiere.com" className="flex items-center gap-2 hover:text-primary transition">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      <span>hello@lumiere.com</span>
                    </a>
                    <a href="tel:+923001234567" className="flex items-center gap-2 hover:text-primary transition">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.86 2 2 0 0 1 1.05 5.4L3 7a15.38 15.38 0 0 0 6 6l1.6 1.95a2 2 0 0 1 1.68 1.05 12.84 12.84 0 0 0 1.14 2.3A2 2 0 0 1 22 16.92z"/></svg>
                      <span>+92 300 123 4567</span>
                    </a>
                    <a href="https://maps.google.com/?q=MM+Alam+Road+Gulberg+III+Lahore+Pakistan" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      <span>Get directions</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="border-t border-primary/10 pt-10">
                <div className="grid grid-cols-1 xl:grid-cols-[0.9fr_1.1fr] gap-8 items-start">
                  <div className="rounded-2xl border border-primary/10 bg-background/40 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      </div>
                      <h3 className="font-semibold uppercase tracking-wider text-sm text-primary">Visit Our Store</h3>
                    </div>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <div className="flex items-start gap-3">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        <span>MM Alam Road, Gulberg III<br />Lahore, Punjab 54000, Pakistan</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.86 2 2 0 0 1 1.05 5.4L3 7a15.38 15.38 0 0 0 6 6l1.6 1.95a2 2 0 0 1 1.68 1.05 12.84 12.84 0 0 0 1.14 2.3A2 2 0 0 1 22 16.92z"/></svg>
                        <span>+92 300 123 4567</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        <span>Mon–Sat: 11 AM – 10 PM</span>
                      </div>
                    </div>
                    <a href="https://maps.google.com/?q=MM+Alam+Road+Gulberg+III+Lahore+Pakistan" target="_blank" rel="noopener noreferrer" className="inline-flex items-center mt-5 text-sm font-medium text-primary hover:text-primary/80 transition">
                      Open in Google Maps
                    </a>
                  </div>

                  <div className="rounded-2xl overflow-hidden border border-primary/10 shadow-sm">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3402.543!2d74.3436!3d31.5204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3919053d97e34f25%3A0xd7e7f3d5b7e8c8a0!2sMM%20Alam%20Rd%2C%20Gulberg%20III%2C%20Lahore!5e0!3m2!1sen!2spk!4v1691000000000!5m2!1sen!2spk"
                      width="100%"
                      height="320"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Lumière Store Location - Lahore"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-primary/10 pt-6 mt-10 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-xs text-muted-foreground">
                  © {new Date().getFullYear()} Lumière. All rights reserved.
                </p>
                <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-xs text-muted-foreground">
                  <Link href="/contact" className="hover:text-primary transition">Privacy Policy</Link>
                  <Link href="/contact" className="hover:text-primary transition">Terms of Service</Link>
                  <Link href="/returns" className="hover:text-primary transition">Refund Policy</Link>
                </div>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
