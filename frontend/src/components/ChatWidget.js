"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { MessageCircle, X, Send, Sparkles, Check } from "lucide-react";
import { addToCart } from "@/store/cartSlice";
import { addFavourite } from "@/store/favouritesSlice";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const WELCOME_MESSAGE = {
  role: "assistant",
  text: "Hi! I'm your Lumière shopping assistant. Ask me to find products, check sizes, or help with an order — what are you looking for today?",
};

// Convert an aiService product shape into what cartSlice/favouritesSlice expect
function toCartItem(p) {
  return {
    id: p.id,
    name: p.name,
    price: p.isSale && p.discountPrice ? p.discountPrice : p.price,
    image: p.image,
  };
}
function toFavouriteItem(p) {
  return {
    _id: p.id,
    name: p.name,
    price: p.price,
    discountPrice: p.discountPrice,
    isSale: p.isSale,
    image: p.image,
  };
}

export default function ChatWidget() {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, isOpen]);

  const applyClientActions = (actions = []) => {
    const notes = [];
    for (const action of actions) {
      if (action.type === "ADD_TO_CART" && action.product) {
        dispatch(addToCart(toCartItem(action.product)));
        notes.push(`Added "${action.product.name}" to your cart`);
      }
      if (action.type === "ADD_TO_WISHLIST" && action.product) {
        dispatch(addFavourite(toFavouriteItem(action.product)));
        notes.push(`Saved "${action.product.name}" to your favourites`);
      }
    }
    return notes;
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages = [...messages, { role: "user", text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();

      const actionNotes = applyClientActions(data.actions);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.reply,
          products: data.products || [],
          actionNotes,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-[90] w-16 h-16 rounded-full bg-primary text-primary-foreground shadow-2xl flex items-center justify-center hover:scale-105 transition-transform"
          aria-label="Open shopping assistant"
        >
          <MessageCircle size={26} strokeWidth={1.5} />
        </button>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-[90] sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 z-[95] h-full w-full sm:w-[400px] bg-background border-l border-secondary shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 h-20 border-b border-secondary bg-background shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-primary" />
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest">
                AI Shopping Assistant
              </p>
              <p className="text-xs text-muted-foreground">Lumière</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-secondary rounded-full transition"
            aria-label="Close chat"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-secondary text-foreground rounded-bl-sm"
                }`}
              >
                <p className="whitespace-pre-wrap">{m.text}</p>

                {m.actionNotes && m.actionNotes.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {m.actionNotes.map((note, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 text-xs bg-background/60 rounded-lg px-2 py-1.5"
                      >
                        <Check size={12} className="text-green-700 shrink-0" />
                        <span>{note}</span>
                      </div>
                    ))}
                  </div>
                )}

                {m.products && m.products.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {m.products.map((p) => (
                      <Link
                        key={p.id}
                        href={`/product/${p.id}`}
                        onClick={() => setIsOpen(false)}
                        className="bg-background rounded-lg overflow-hidden border border-secondary hover:border-primary transition block"
                      >
                        <div className="w-full aspect-square bg-secondary overflow-hidden">
                          {p.image && (
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="p-2">
                          <p className="text-xs font-medium truncate">{p.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {p.isSale && p.discountPrice ? (
                              <>
                                <span className="line-through mr-1">${p.price}</span>
                                <span className="text-red-700">${p.discountPrice}</span>
                              </>
                            ) : (
                              <>${p.price}</>
                            )}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-secondary rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" />
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-secondary p-3 shrink-0">
          <div className="flex items-end gap-2 bg-secondary rounded-2xl px-3 py-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about products, sizing, orders..."
              rows={1}
              className="flex-1 bg-transparent outline-none text-sm resize-none max-h-24 py-1.5"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="p-2 rounded-full bg-primary text-primary-foreground disabled:opacity-40 transition shrink-0"
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}