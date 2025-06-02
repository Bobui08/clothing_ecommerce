"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useRouter, usePathname } from "next/navigation";
import PromotionalBanner from "./navbar/PromotionalBanner";
import Logo from "./navbar/Logo";
import DesktopMenu from "./navbar/DesktopMenu";
import ThemeToggle from "./navbar/ThemeToggle";
import AuthSection from "./navbar/AuthSection";
import MobileMenu from "./navbar/MobileMenu";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMenuClick = (item: MenuItem) => {
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
          color: textColor, // Use the extracted textColor
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
            <DesktopMenu menu={menu} handleMenuClick={handleMenuClick} />
            <motion.div
              className="flex items-center gap-3 ml-auto"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <ThemeToggle />
              <AuthSection auth={auth} />
            </motion.div>
          </motion.nav>
          <MobileMenu menu={menu} logo={logo} handleMenuClick={handleMenuClick}>
            <ThemeToggle isMobile />
            <AuthSection auth={auth} isMobile />
          </MobileMenu>
        </div>
      </motion.section>
    </>
  );
};

export default Navbar;
