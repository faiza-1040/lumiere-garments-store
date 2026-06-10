"use client";
import { RefreshCcw, ShieldCheck, HelpCircle, FileText } from "lucide-react";

export default function ReturnsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-32 space-y-24">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-light font-poppins tracking-tight">Returns & Exchanges</h1>
        <p className="text-muted-foreground uppercase tracking-[0.3em] text-xs">Our commitment to your satisfaction</p>
      </div>

      <div className="space-y-16">
        <div className="prose prose-sm max-w-none space-y-8 font-light text-muted-foreground leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-light text-foreground flex items-center gap-4 border-b border-secondary pb-4">
              <RefreshCcw size={24} strokeWidth={1} />
              Return Policy
            </h2>
            <p>We accept returns for a full refund within 14 days of delivery. To be eligible, your item must be in the same condition that you received it: unworn or unused, with tags, and in its original packaging.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-light text-foreground flex items-center gap-4 border-b border-secondary pb-4">
              <RefreshCcw size={24} strokeWidth={1} className="rotate-180" />
              Exchanges
            </h2>
            <p>The fastest way to ensure you get what you want is to return the item you have, and once the return is accepted, make a separate purchase for the new item. We currently offer free exchange shipping for size adjustments.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-light text-foreground flex items-center gap-4 border-b border-secondary pb-4">
              <ShieldCheck size={24} strokeWidth={1} />
              Exceptions
            </h2>
            <p>Certain types of items cannot be returned, like perishable goods (such as food, flowers, or plants), custom products (such as special orders or personalized items), and personal care goods (such as beauty products). Please get in touch if you have questions or concerns about your specific item.</p>
          </section>
        </div>

        <div className="grid sm:grid-cols-2 gap-8 pt-12">
          <div className="bg-secondary/30 p-8 space-y-6 flex flex-col items-center text-center">
            <FileText size={40} strokeWidth={1} className="text-primary mb-2" />
            <h3 className="text-sm uppercase tracking-widest font-bold">Initiate a Return</h3>
            <p className="text-sm font-light">Enter your order number and email address to start the process.</p>
            <button className="px-8 py-3 bg-primary text-primary-foreground text-[10px] uppercase tracking-widest font-bold hover:opacity-90 transition">
              Start Return
            </button>
          </div>

          <div className="bg-secondary/30 p-8 space-y-6 flex flex-col items-center text-center">
            <HelpCircle size={40} strokeWidth={1} className="text-primary mb-2" />
            <h3 className="text-sm uppercase tracking-widest font-bold">Need Help?</h3>
            <p className="text-sm font-light">Our concierge team is available to assist with your return or exchange.</p>
            <button className="px-8 py-3 border border-primary text-primary text-[10px] uppercase tracking-widest font-bold hover:bg-primary hover:text-white transition">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
