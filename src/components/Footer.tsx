import React from "react";
import { motion } from "framer-motion";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn, MdArrowForward } from "react-icons/md";
import { HiSparkles, HiHeart } from "react-icons/hi";

interface Footer7Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  sections?: Array<{
    title: string;
    links: Array<{ name: string; href: string }>;
  }>;
  description?: string;
  socialLinks?: Array<{
    icon: React.ReactElement;
    href: string;
    label: string;
  }>;
  copyright?: string;
  legalLinks?: Array<{
    name: string;
    href: string;
  }>;
}

const defaultSections = [
  {
    title: "Shop",
    links: [
      { name: "New Arrivals", href: "#" },
      { name: "Women's Fashion", href: "#" },
      { name: "Men's Fashion", href: "#" },
      { name: "Accessories", href: "#" },
      { name: "Sale Items", href: "#" },
    ],
  },
  {
    title: "Customer Care",
    links: [
      { name: "Size Guide", href: "#" },
      { name: "Shipping Info", href: "#" },
      { name: "Returns & Exchanges", href: "#" },
      { name: "Track Your Order", href: "#" },
      { name: "FAQ", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Press", href: "#" },
      { name: "Store Locator", href: "#" },
      { name: "Contact", href: "#" },
    ],
  },
];

const defaultSocialLinks = [
  { icon: <FaInstagram className="w-5 h-5" />, href: "#", label: "Instagram" },
  { icon: <FaFacebook className="w-5 h-5" />, href: "#", label: "Facebook" },
  { icon: <FaTiktok className="w-5 h-5" />, href: "#", label: "TikTok" },
  { icon: <FaYoutube className="w-5 h-5" />, href: "#", label: "YouTube" },
  { icon: <FaTwitter className="w-5 h-5" />, href: "#", label: "Twitter" },
];

const defaultLegalLinks = [
  { name: "Privacy Policy", href: "#" },
  { name: "Terms of Service", href: "#" },
  { name: "Cookie Policy", href: "#" },
];

const contactInfo = [
  { icon: <MdEmail className="w-4 h-4" />, text: "quockhang972@gmail.com" },
  { icon: <MdPhone className="w-4 h-4" />, text: "0336642035" },
  { icon: <MdLocationOn className="w-4 h-4" />, text: "Ha Noi, Vietnam" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 20,
    },
  },
};

const socialVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 15,
      delay: 0.1,
    },
  },
  hover: {
    scale: 1.1,
    y: -3,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
};

const linkVariants = {
  hover: {
    x: 5,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};

const sparkleVariants = {
  animate: {
    scale: [1, 1.2, 1],
    rotate: [0, 180, 360],
    opacity: [0.5, 1, 0.5],
  },
};

const Footer = ({
  logo = {
    url: "/",
    src: "https://www.logoai.com/oss/icons/2021/12/02/EoLJeYhT6YPfd26.png",
    alt: "logo",
    title: "FashionHub",
  },
  sections = defaultSections,
  description = "Discover the latest fashion trends and express your unique style with our curated collection of premium clothing and accessories.",
  socialLinks = defaultSocialLinks,
  copyright = "© 2024 FashionHub. All rights reserved.",
  legalLinks = defaultLegalLinks,
}: Footer7Props) => {
  return (
    <motion.footer
      className="relative bg-gray-900 text-white overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -40, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Floating sparkles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-yellow-400/30"
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 10}%`,
            }}
            variants={sparkleVariants}
            animate="animate"
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          >
            <HiSparkles className="w-4 h-4" />
          </motion.div>
        ))}
      </div>

      <div className="relative">
        {/* Newsletter Section */}
        <motion.div
          className="border-b border-gray-700/50 bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm"
          variants={itemVariants}
        >
          <div className="container mx-auto px-6 py-12">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-center lg:text-left max-w-md">
                <motion.div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
                  <HiSparkles className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Stay in Style
                  </h3>
                </motion.div>
                <motion.p
                  className="text-gray-300 leading-relaxed"
                  variants={itemVariants}
                >
                  Subscribe to get exclusive access to new collections, fashion
                  tips, and special offers delivered to your inbox.
                </motion.p>
              </div>

              <motion.div
                className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto min-w-[400px]"
                variants={itemVariants}
              >
                <div className="relative flex-1">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full px-4 py-4 pr-12 rounded-xl bg-gray-800/80 border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all duration-300 backdrop-blur-sm"
                  />
                  <MdEmail className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
                <motion.button
                  className="px-8 py-4 bg-white text-gray-900 rounded-xl cursor-pointer font-semibold flex items-center gap-2 hover:bg-gray-100 transition-all duration-300 group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Subscribe
                  <motion.div className="group-hover:translate-x-1 transition-transform duration-300">
                    <MdArrowForward className="w-4 h-4" />
                  </motion.div>
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Main Footer Content */}
        <div className="container mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Brand Section */}
            <motion.div
              className="lg:col-span-2 space-y-8"
              variants={itemVariants}
            >
              <motion.div
                className="flex items-center gap-3"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className="relative"
                  whileHover={{ rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    title={logo.title}
                    className="h-12 w-12 rounded-xl shadow-lg"
                  />
                  <div className="absolute -top-1 -right-1">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <HiSparkles className="w-4 h-4 text-yellow-400" />
                    </motion.div>
                  </div>
                </motion.div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                  {logo.title}
                </h2>
              </motion.div>

              <motion.p
                className="text-gray-300 leading-relaxed text-lg"
                variants={itemVariants}
              >
                {description}
              </motion.p>

              {/* Contact Info */}
              <motion.div className="space-y-4" variants={containerVariants}>
                <h4 className="text-white font-semibold text-lg mb-4">
                  Get in Touch
                </h4>
                {contactInfo.map((contact, idx) => (
                  <motion.div
                    key={idx}
                    className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors duration-300 group"
                    variants={itemVariants}
                    whileHover={{ x: 5 }}
                  >
                    <div className="p-3 rounded-xl bg-gray-800/50 text-gray-400 group-hover:text-white transition-colors duration-300">
                      {contact.icon}
                    </div>
                    <span className="font-medium">{contact.text}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Social Links */}
              <motion.div variants={containerVariants}>
                <h4 className="text-white font-semibold text-lg mb-4">
                  Follow Our Journey
                </h4>
                <div className="flex gap-4">
                  {socialLinks.map((social, idx) => (
                    <motion.a
                      key={idx}
                      href={social.href}
                      aria-label={social.label}
                      className="p-4 rounded-xl bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-300 group"
                      variants={socialVariants}
                      whileHover="hover"
                    >
                      <motion.div className="group-hover:scale-110 transition-transform duration-300">
                        {social.icon}
                      </motion.div>
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Links Sections */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
              {sections.map((section, sectionIdx) => (
                <motion.div key={sectionIdx} variants={itemVariants}>
                  <motion.h3
                    className="text-xl font-bold text-white mb-6 relative"
                    whileHover={{ x: 4 }}
                  >
                    {section.title}
                    <motion.div
                      className="absolute -bottom-2 left-0 h-0.5 bg-gradient-to-r from-white to-transparent"
                      initial={{ width: 0 }}
                      whileInView={{ width: "60%" }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    />
                  </motion.h3>
                  <motion.ul className="space-y-4" variants={containerVariants}>
                    {section.links.map((link, linkIdx) => (
                      <motion.li key={linkIdx} variants={itemVariants}>
                        <motion.a
                          href={link.href}
                          className="text-gray-300 hover:text-white transition-all duration-300 font-medium inline-flex items-center gap-2 group"
                          variants={linkVariants}
                          whileHover="hover"
                        >
                          <span>{link.name}</span>
                          <motion.div
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            initial={{ x: -5 }}
                            whileHover={{ x: 0 }}
                          >
                            <MdArrowForward className="w-3 h-3" />
                          </motion.div>
                        </motion.a>
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="border-t border-gray-700/50 bg-gray-800/30 backdrop-blur-sm"
          variants={itemVariants}
        >
          <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
              <motion.div
                className="flex items-center gap-2 text-gray-300"
                variants={itemVariants}
              >
                <span>Made with</span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <HiHeart className="w-4 h-4 text-red-400" />
                </motion.div>
                <span>for fashion lovers</span>
              </motion.div>

              <motion.p
                className="text-gray-400 text-center"
                variants={itemVariants}
              >
                {copyright}
              </motion.p>

              <motion.div className="flex gap-8" variants={containerVariants}>
                {legalLinks.map((link, idx) => (
                  <motion.a
                    key={idx}
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300 text-sm font-medium"
                    variants={itemVariants}
                    whileHover={{ y: -2 }}
                  >
                    {link.name}
                  </motion.a>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export { Footer };
