import { motion } from "framer-motion";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
  onClick?: () => void;
}

interface DesktopMenuProps {
  menu: MenuItem[];
  handleMenuClick: (item: MenuItem) => void;
}

const renderMenuItem = (
  item: MenuItem,
  handleMenuClick: (item: MenuItem) => void
) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
          <NavigationMenuTrigger className="bg-transparent hover:bg-purple-50 dark:hover:bg-purple-900/20 text-gray-900 dark:text-gray-100 font-medium text-base hover:text-purple-600 transition-all duration-300">
            {item.title}
          </NavigationMenuTrigger>
        </motion.div>
        <NavigationMenuContent>
          <motion.ul
            className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {item.items.map((subItem, index) => (
              <motion.li
                key={subItem.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: 0.1 * index }}
                whileHover={{ scale: 1.02 }}
              >
                <NavigationMenuLink
                  asChild
                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 focus:bg-purple-50 dark:focus:bg-purple-900/20 focus:text-purple-600"
                >
                  <a
                    href={subItem.url}
                    onClick={(e) => {
                      e.preventDefault();
                      handleMenuClick(subItem);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {subItem.icon}
                      <span className="text-sm font-medium leading-none">
                        {subItem.title}
                      </span>
                    </div>
                    {subItem.description && (
                      <p className="line-clamp-2 text-sm leading-snug text-gray-500 dark:text-gray-400">
                        {subItem.description}
                      </p>
                    )}
                  </a>
                </NavigationMenuLink>
              </motion.li>
            ))}
          </motion.ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }
  return (
    <NavigationMenuItem key={item.title}>
      <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
        <NavigationMenuLink
          asChild
          className="text-gray-900 dark:text-gray-100 font-medium text-base hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 px-4 py-2 rounded-md transition-all duration-300"
        >
          <a
            href={item.url}
            onClick={(e) => {
              e.preventDefault();
              handleMenuClick(item);
            }}
          >
            {item.title}
          </a>
        </NavigationMenuLink>
      </motion.div>
    </NavigationMenuItem>
  );
};

const DesktopMenu = ({ menu, handleMenuClick }: DesktopMenuProps) => {
  return (
    <motion.div
      className="absolute left-1/2 transform -translate-x-1/2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <NavigationMenu>
        <NavigationMenuList className="gap-2">
          {menu.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
            >
              {renderMenuItem(item, handleMenuClick)}
            </motion.div>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </motion.div>
  );
};

export default DesktopMenu;
