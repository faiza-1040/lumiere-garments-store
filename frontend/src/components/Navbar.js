"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { Search, User, ShoppingBag, Menu, X, ChevronRight } from "lucide-react";
import { logout } from "@/store/authSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/shop?search=${searchQuery.trim()}`);
      setSearchQuery("");
    }
  };

  return (
    <>
      <nav className="w-full fixed top-0 bg-background/95 backdrop-blur-md z-50 border-b border-secondary">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Left section: Hamburger + Brand Logo */}
          <div className="flex items-center gap-6 w-1/4">
            <button onClick={toggleSidebar} className="hover:text-muted-foreground transition">
              <Menu size={28} strokeWidth={1.5} />
            </button>
            <Link href="/">
              <h1 className="text-2xl tracking-widest font-bold uppercase font-poppins cursor-pointer">Lumière</h1>
            </Link>
          </div>

          {/* Center section: Desktop Links */}
          <div className="hidden lg:flex justify-center gap-8 text-sm uppercase tracking-widest font-medium w-2/4">
            <Link href="/" className="hover:text-muted-foreground transition relative group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-foreground transition-all group-hover:w-full"></span>
            </Link>
            <Link href="/shop?category=Men" className="hover:text-muted-foreground transition relative group">
              Men
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-foreground transition-all group-hover:w-full"></span>
            </Link>
            <Link href="/shop?category=Women" className="hover:text-muted-foreground transition relative group">
              Women
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-foreground transition-all group-hover:w-full"></span>
            </Link>
            <Link href="/shop?category=Kids" className="hover:text-muted-foreground transition relative group">
              Kids
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-foreground transition-all group-hover:w-full"></span>
            </Link>
            <Link href="/shop?category=Sale" className="text-red-900/70 hover:text-red-900 transition relative group">
              Sale
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-red-900 transition-all group-hover:w-full"></span>
            </Link>
          </div>

          {/* Right section: Search, User, Cart */}
          <div className="flex items-center justify-end gap-6 w-1/4">
            <div className="hidden xl:flex items-center border-b border-foreground/30 pb-1">
              <Search size={18} className="mr-2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search" 
                className="bg-transparent outline-none text-sm w-32 focus:w-48 transition-all duration-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>
            
            <div className="flex gap-5 items-center">
              {/* If on mobile/tablet, show search icon without input to save space */}
              <button className="xl:hidden hover:text-muted-foreground transition">
                <Search size={22} strokeWidth={1.5} />
              </button>

              <Link href={mounted && userInfo ? "/profile" : "/login"}>
                <User size={22} strokeWidth={1.5} className="cursor-pointer hover:text-muted-foreground transition" />
              </Link>
              <Link href="/cart" className="relative">
                <ShoppingBag size={22} strokeWidth={1.5} className="cursor-pointer hover:text-muted-foreground transition" />
                {mounted && cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-primary text-primary-foreground text-[10px] w-[18px] h-[18px] flex items-center justify-center rounded-full font-medium">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300" 
          onClick={toggleSidebar} 
        />
      )}

      {/* Sidebar Drawer */}
      <div className={`fixed top-0 left-0 h-full w-[85vw] max-w-[400px] bg-background z-[70] transform transition-transform duration-500 ease-in-out shadow-2xl ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} overflow-y-auto`}>
        <div className="p-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-2xl tracking-widest font-bold uppercase font-poppins">Lumière</h2>
            <button onClick={toggleSidebar} className="p-2 hover:bg-secondary rounded-full transition">
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>
          
          <div className="flex items-center border-b border-foreground/30 pb-3 mb-10 xl:hidden">
            <Search size={20} className="mr-3 text-muted-foreground" />
            <input type="text" placeholder="Search products..." className="bg-transparent outline-none text-base w-full" />
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-semibold">Collections</p>
            
            <Link href="/shop?category=Men" onClick={toggleSidebar} className="group flex justify-between items-center py-4 border-b border-secondary hover:text-muted-foreground transition text-lg tracking-wider font-light">
              Men's Collection
              <ChevronRight size={18} className="text-transparent group-hover:text-muted-foreground transition-all transform group-hover:translate-x-1" />
            </Link>
            
            <Link href="/shop?category=Women" onClick={toggleSidebar} className="group flex justify-between items-center py-4 border-b border-secondary hover:text-muted-foreground transition text-lg tracking-wider font-light">
              Women's Collection
              <ChevronRight size={18} className="text-transparent group-hover:text-muted-foreground transition-all transform group-hover:translate-x-1" />
            </Link>
            
            <Link href="/shop?category=Kids" onClick={toggleSidebar} className="group flex justify-between items-center py-4 border-b border-secondary hover:text-muted-foreground transition text-lg tracking-wider font-light">
              Kids Collection
              <ChevronRight size={18} className="text-transparent group-hover:text-muted-foreground transition-all transform group-hover:translate-x-1" />
            </Link>

            <Link href="/shop?category=Accessories" onClick={toggleSidebar} className="group flex justify-between items-center py-4 border-b border-secondary hover:text-muted-foreground transition text-lg tracking-wider font-light">
              Accessories & Bags
              <ChevronRight size={18} className="text-transparent group-hover:text-muted-foreground transition-all transform group-hover:translate-x-1" />
            </Link>
            
            <Link href="/shop?category=Sale" onClick={toggleSidebar} className="group flex justify-between items-center py-4 border-b border-secondary text-red-900/80 hover:text-red-900 transition text-lg tracking-wider font-light">
              End of Season Sale
              <ChevronRight size={18} className="text-transparent group-hover:text-red-900 transition-all transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-16">
             <p className="text-xs uppercase tracking-widest text-muted-foreground mb-6 font-semibold">Account</p>
            {mounted && userInfo ? (
              <div className="flex flex-col gap-4">
                <p className="text-sm font-medium">Welcome back, {userInfo.firstName}</p>
                <Link href="/profile" onClick={toggleSidebar} className="text-sm font-medium hover:underline text-muted-foreground">My Profile</Link>
                <Link href="/order-history" onClick={toggleSidebar} className="text-sm font-medium hover:underline text-muted-foreground">Order History</Link>
                <button 
                  onClick={() => { 
                    dispatch(logout()); 
                    toggleSidebar(); 
                    router.push('/'); 
                  }} 
                  className="text-sm text-left hover:underline text-red-900/80 mt-4 font-semibold"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <Link href="/login" onClick={toggleSidebar} className="w-full border border-primary text-primary py-3 uppercase tracking-widest text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition text-center">
                  Sign In
                </Link>
                <Link href="/register" onClick={toggleSidebar} className="w-full bg-primary text-primary-foreground py-3 uppercase tracking-widest text-xs font-semibold hover:bg-primary/90 transition text-center">
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
