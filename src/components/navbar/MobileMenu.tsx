import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Logo from "./Logo";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
  onClick?: () => void;
}

interface MobileMenuProps {
  menu: MenuItem[];
  logo: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  handleMenuClick: (item: MenuItem) => void;
  children: React.ReactNode;
}

const renderMobileMenuItem = (
  item: MenuItem,
  handleMenuClick: (item: MenuItem) => void
) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <AccordionTrigger className="text-gray-900 dark:text-gray-100 font-medium text-base hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 px-3 py-2 rounded-md transition-all duration-300">
            {item.title}
          </AccordionTrigger>
        </motion.div>
        <AccordionContent>
          <div className="flex flex-col gap-2 pl-4">
            {item.items.map((subItem, index) => (
              <motion.div
                key={subItem.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: 0.1 * index }}
                whileHover={{ scale: 1.02, x: 5 }}
              >
                <Button
                  variant="ghost"
                  className="justify-start gap-3 text-gray-900 dark:text-gray-100 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 transition-all duration-300"
                  onClick={() => handleMenuClick(subItem)}
                >
                  {subItem.icon}
                  <span className="text-base">{subItem.title}</span>
                </Button>
              </motion.div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  }
  return (
    <motion.div
      key={item.title}
      whileHover={{ scale: 1.02, x: 5 }}
      transition={{ duration: 0.2 }}
    >
      <Button
        variant="ghost"
        className="justify-start text-gray-900 dark:text-gray-100 font-medium text-base hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 px-3 py-2 rounded-md transition-all duration-300 w-full"
        onClick={() => handleMenuClick(item)}
      >
        {item.title}
      </Button>
    </motion.div>
  );
};

const MobileMenu = ({
  menu,
  logo,
  handleMenuClick,
  children,
}: MobileMenuProps) => {
  return (
    <motion.div
      className="flex lg:hidden items-center justify-between py-4"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Logo logo={logo} isMobile />
      <Sheet>
        <SheetTrigger asChild>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300"
            >
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <Menu className="h-6 w-6 text-purple-600" />
              </motion.div>
            </Button>
          </motion.div>
        </SheetTrigger>
        <SheetContent className="w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-l border-gray-200/20 dark:border-gray-700/20">
          <SheetHeader className="border-b border-gray-200/20 dark:border-gray-700/20 pb-4">
            <SheetTitle>
              <Logo logo={logo} />
            </SheetTitle>
          </SheetHeader>
          <motion.div
            className="flex flex-col gap-6 py-6"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Accordion
              type="single"
              collapsible
              className="flex w-full flex-col gap-2"
            >
              {menu.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  {renderMobileMenuItem(item, handleMenuClick)}
                </motion.div>
              ))}
            </Accordion>
            <motion.div
              className="border-t border-gray-200/20 dark:border-gray-700/20 pt-6 flex flex-col gap-4"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {children}
            </motion.div>
          </motion.div>
        </SheetContent>
      </Sheet>
    </motion.div>
  );
};

export default MobileMenu;
