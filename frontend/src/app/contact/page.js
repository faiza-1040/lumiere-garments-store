"use client";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-32">
      <div className="grid lg:grid-cols-2 gap-24">
        {/* Left Column: Info */}
        <div className="space-y-12">
          <div className="space-y-4">
            <h1 className="text-5xl font-light font-poppins tracking-tight">Get in Touch</h1>
            <p className="text-muted-foreground text-lg font-light leading-relaxed">
              We're here to help. Whether you have a question about our collections, 
              need styling advice, or assistance with an order, our dedicated concierge team is at your service.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-start gap-6 group">
              <div className="w-12 h-12 bg-secondary flex items-center justify-center rounded-full transition-transform group-hover:scale-110">
                <Mail size={20} className="text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-sm uppercase tracking-widest font-semibold mb-1">Email Us</h3>
                <p className="text-muted-foreground font-light">concierge@lumiere.com</p>
              </div>
            </div>

            <div className="flex items-start gap-6 group">
              <div className="w-12 h-12 bg-secondary flex items-center justify-center rounded-full transition-transform group-hover:scale-110">
                <Phone size={20} className="text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-sm uppercase tracking-widest font-semibold mb-1">Call Us</h3>
                <p className="text-muted-foreground font-light">+1 (888) LUMIERE</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Mon - Fri: 9AM - 6PM EST</p>
              </div>
            </div>

            <div className="flex items-start gap-6 group">
              <div className="w-12 h-12 bg-secondary flex items-center justify-center rounded-full transition-transform group-hover:scale-110">
                <MapPin size={20} className="text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-sm uppercase tracking-widest font-semibold mb-1">Visit Our Flagship</h3>
                <p className="text-muted-foreground font-light">742 Lumière Avenue, Paris, France</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="bg-secondary/30 p-12 backdrop-blur-sm border border-secondary">
          <form className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">First Name</label>
                <input type="text" className="w-full bg-transparent border-b border-muted-foreground/30 py-2 outline-none focus:border-primary transition" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">Last Name</label>
                <input type="text" className="w-full bg-transparent border-b border-muted-foreground/30 py-2 outline-none focus:border-primary transition" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">Email Address</label>
              <input type="email" className="w-full bg-transparent border-b border-muted-foreground/30 py-2 outline-none focus:border-primary transition" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">Message</label>
              <textarea rows="4" className="w-full bg-transparent border-b border-muted-foreground/30 py-2 outline-none focus:border-primary transition resize-none"></textarea>
            </div>

            <button className="w-full py-5 bg-primary text-primary-foreground text-xs uppercase tracking-widest font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-3">
              <Send size={14} />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
