"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingCart, Package, History } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import PromotionalBanner from "./navbar/PromotionalBanner";
import Logo from "./navbar/Logo";
import DesktopMenu from "./navbar/DesktopMenu";
import ThemeToggle from "./navbar/ThemeToggle";
import AuthSection from "./navbar/AuthSection";
import MobileMenu from "./navbar/MobileMenu";
import { useAuth } from "@/context/AuthContext";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
  requireAuth?: boolean;
  onClick?: () => void;
}

interface NavbarProps {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  menu?: MenuItem[];
  auth?: {
    login: {
      title: string;
      url: string;
    };
  };
}

interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    description: string;
    price: number;
    image?: string;
    category: string;
    stock: number;
  };
  quantity: number;
}

interface CartData {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
}

// Fetch cart data to get item count
async function fetchCartCount(): Promise<number> {
  try {
    const response = await fetch("/api/cart", {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return 0;
    }

    const data = await response.json();

    // Process items - could be Array or Object
    let items = [];
    if (Array.isArray(data.items)) {
      items = data.items;
    } else if (data.items && typeof data.items === "object") {
      items = Object.values(data.items);
    }

    return items.length; // Return number of unique items, not total quantity
  } catch (error) {
    console.error("Error fetching cart count:", error);
    return 0;
  }
}

const Navbar = ({
  logo = {
    url: "/",
    src: "https://upload.wikimedia.org/wikipedia/commons/5/51/Elo_logo.png",
    alt: "logo",
    title: "FashionHub",
  },
  menu = [
    { title: "Home", url: "/" },
    { title: "Product", url: "/products" },
    { title: "Manage", url: "/collections" },
    {
      title: "About Us",
      url: "#about-us",
      onClick: () => {
        if (window.location.pathname === "/") {
          const aboutSection = document.getElementById("about-us");
          if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: "smooth" });
          }
        } else {
          window.location.href = "/#about-us";
        }
      },
    },
  ],
  auth = {
    login: { title: "Sign in", url: "/handler/signin" },
  },
}: NavbarProps) => {
  const { theme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  // Fetch cart count for authenticated users
  const { data: cartItemCount = 0 } = useQuery({
    queryKey: ["cartCount"],
    queryFn: fetchCartCount,
    enabled: !!user, // Only fetch when user is authenticated
    refetchInterval: 1000,
    retry: false,
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMenuClick = (item: MenuItem) => {
    // Check if item requires auth and user is not logged in
    if (item.requireAuth && !user) {
      router.push("/auth/login");
      return;
    }

    if (item.onClick) {
      item.onClick();
    } else if (item.url.startsWith("#")) {
      if (pathname === "/") {
        const sectionId = item.url.substring(1);
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        router.push(`/${item.url}`);
      }
    } else {
      router.push(item.url);
    }
  };

  // Handle cart click
  const handleCartClick = () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    router.push("/cart");
  };

  // Handle orders click
  const handleOrdersClick = () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    router.push("/orders");
  };

  // Filter menu items based on auth status
  const filteredMenu = menu.filter((item) => {
    if (item.requireAuth && !user) {
      return false; // Hide auth-required items for non-authenticated users
    }
    return true;
  });

  // Extracted backgroundColor logic
  let backgroundColor: string;
  if (scrolled) {
    if (theme === "dark") {
      backgroundColor = "rgba(31, 41, 55, 0.95)";
    } else {
      backgroundColor = "rgba(243, 244, 246, 0.95)";
    }
  } else {
    if (theme === "dark") {
      backgroundColor = "rgba(31, 41, 55, 0.8)";
    } else {
      backgroundColor = "rgba(243, 244, 246, 0.8)";
    }
  }

  // Extracted backdropFilter logic
  const backdropFilter = scrolled ? "blur(20px)" : "blur(10px)";

  // Extracted color logic
  const textColor = theme === "dark" ? "#ffffff" : "#1f2937";

  return (
    <>
      <PromotionalBanner />
      <motion.section
        className="sticky top-0 z-50 backdrop-blur-lg border-b border-gray-200/20 dark:border-gray-700/20"
        animate={{
          backgroundColor: backgroundColor,
          backdropFilter: backdropFilter,
        }}
        transition={{ duration: 0.3 }}
        style={{
          color: textColor,
        }}
      >
        <div className="container mx-auto px-4">
          <motion.nav
            className="hidden lg:flex items-center py-4 relative"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Logo logo={logo} />
            <DesktopMenu
              menu={filteredMenu}
              handleMenuClick={handleMenuClick}
            />
            <motion.div
              className="flex items-center gap-3 ml-auto"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {/* Orders History Icon Button */}
              <motion.button
                onClick={handleOrdersClick}
                className="relative p-2 rounded-lg cursor-pointer hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors duration-200 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Order History"
                title="Order History"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                >
                  <path
                    fill="currentColor"
                    d="m17.275 18.125l-.425-.425q-.225-.225-.537-.225t-.538.225t-.225.525t.225.525l.975.975q.225.225.525.225t.525-.225l2.425-2.375q.225-.225.225-.538t-.225-.537t-.538-.225t-.537.225zM7 9h10q.425 0 .713-.288T18 8t-.288-.712T17 7H7q-.425 0-.712.288T6 8t.288.713T7 9m11 14q-2.075 0-3.537-1.463T13 18t1.463-3.537T18 13t3.538 1.463T23 18t-1.463 3.538T18 23M3 5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v5.375q0 .425-.288.713t-.712.287t-.712-.288t-.288-.712V5H5v14.05h6.075q.05.375.15.75t.225.725q.125.275-.1.438t-.425-.038l-.075-.075q-.15-.15-.35-.15t-.35.15l-.8.8q-.15.15-.35.15t-.35-.15l-.8-.8q-.15-.15-.35-.15t-.35.15l-.8.8q-.15.15-.35.15t-.35-.15l-.8-.8q-.15-.15-.35-.15t-.35.15L3 22zm4 12h3.375q.425 0 .713-.288t.287-.712t-.288-.712t-.712-.288H7q-.425 0-.712.288T6 16t.288.713T7 17m0-4h6.55q.425 0 .713-.288T14.55 12t-.288-.712T13.55 11H7q-.425 0-.712.288T6 12t.288.713T7 13m-2 6.05V5z"
                  ></path>
                </svg>
              </motion.button>

              {/* Cart Icon Button */}
              <motion.button
                onClick={handleCartClick}
                className="relative p-2 rounded-lg cursor-pointer hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors duration-200 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Shopping Cart"
                title="Shopping Cart"
              >
                <ShoppingCart
                  size={20}
                  className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                />
                {/* Cart Item Count Badge */}
                {user && cartItemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg"
                  >
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </motion.span>
                )}
              </motion.button>

              <ThemeToggle />
              <AuthSection auth={auth} />
            </motion.div>
          </motion.nav>
          <MobileMenu
            menu={filteredMenu}
            logo={logo}
            handleMenuClick={handleMenuClick}
          >
            {/* Orders History for Mobile */}
            <motion.button
              onClick={handleOrdersClick}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors duration-200 w-full text-left"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <History size={20} className="text-gray-700 dark:text-gray-300" />
              <span className="text-sm font-medium">Order History</span>
            </motion.button>

            {/* Cart Icon for Mobile */}
            <motion.button
              onClick={handleCartClick}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors duration-200 w-full text-left relative"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative">
                <ShoppingCart
                  size={20}
                  className="text-gray-700 dark:text-gray-300"
                />
                {/* Cart Item Count Badge for Mobile */}
                {user && cartItemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold"
                  >
                    {cartItemCount > 9 ? "9+" : cartItemCount}
                  </motion.span>
                )}
              </div>
              <span className="text-sm font-medium">
                Cart {user && cartItemCount > 0 && `(${cartItemCount})`}
              </span>
            </motion.button>

            <ThemeToggle isMobile />
            <AuthSection auth={auth} isMobile />
          </MobileMenu>
        </div>
      </motion.section>
    </>
  );
};

export default Navbar;
