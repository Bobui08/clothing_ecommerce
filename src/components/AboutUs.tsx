import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface About3Props {
  title?: string;
  description?: string;
  mainImage?: {
    src: string;
    alt: string;
  };
  secondaryImage?: {
    src: string;
    alt: string;
  };
  breakout?: {
    src: string;
    alt: string;
    title?: string;
    description?: string;
    buttonText?: string;
    buttonUrl?: string;
  };
  companiesTitle?: string;
  companies?: Array<{
    src: string;
    alt: string;
  }>;
  achievementsTitle?: string;
  achievementsDescription?: string;
  achievements?: Array<{
    label: string;
    value: string;
  }>;
}

const defaultCompanies = [
  {
    src: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=160&h=80&fit=crop",
    alt: "Premium Fashion",
  },
  {
    src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=160&h=80&fit=crop",
    alt: "Luxury Brands",
  },
  {
    src: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=160&h=80&fit=crop",
    alt: "Designer Collection",
  },
  {
    src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=160&h=80&fit=crop",
    alt: "Fashion House",
  },
  {
    src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=160&h=80&fit=crop",
    alt: "Style Studio",
  },
];

const defaultAchievements = [
  { label: "Global Customers", value: "125K+" },
  { label: "Fashion Items Sold", value: "500K+" },
  { label: "Customer Satisfaction", value: "99.8%" },
  { label: "Years of Excellence", value: "18+" },
];

const About = ({
  title = "Crafting Fashion Excellence",
  description = "We are a premium fashion brand committed to delivering exceptional style and uncompromising quality. Our passion for innovative design and meticulous craftsmanship has made us a trusted name in the fashion industry worldwide.",
  mainImage = {
    src: "https://images.unsplash.com/photo-1570857502809-08184874388e?q=80&w=2078&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Luxury Fashion Boutique",
  },
  secondaryImage = {
    src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&h=600&fit=crop",
    alt: "Designer Fashion Collection",
  },
  breakout = {
    src: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=80&h=80&fit=crop",
    alt: "Fashion Icon",
    title: "Exclusive Designer Collections",
    description:
      "Discover our curated selection of premium fashion pieces, designed to elevate your style and express your unique personality.",
    buttonText: "Explore Collection",
    buttonUrl: "#",
  },
  companiesTitle = "Trusted by Leading Fashion Retailers Worldwide",
  companies = defaultCompanies,
  achievementsTitle = "Our Fashion Legacy",
  achievementsDescription = "Two decades of fashion innovation, serving style-conscious customers across the globe with premium quality and exceptional service.",
  achievements = defaultAchievements,
}: About3Props = {}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  return (
    <section className="relative py-24 px-4 overflow-hidden" ref={ref}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--primary)_1px,transparent_1px),linear-gradient(to_bottom,var(--primary)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div className="container mx-auto max-w-7xl relative">
        {/* Header Section */}
        <motion.div
          className="text-center mb-20"
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6"
          >
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-primary">
              About Our Brand
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight"
          >
            <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
              {title}
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            {description}
          </motion.p>
        </motion.div>

        {/* Main Content Grid */}
        <motion.div
          className="grid lg:grid-cols-12 gap-8 mb-24"
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Large Image */}
          <motion.div
            className="lg:col-span-8 relative group"
            variants={scaleIn}
          >
            <div className="relative overflow-hidden rounded-3xl bg-card">
              <img
                src={mainImage.src}
                alt={mainImage.alt}
                className="w-full h-[500px] lg:h-[600px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Floating Badge */}
              <div className="absolute top-6 left-6 bg-background/90 backdrop-blur-sm border border-border/50 rounded-2xl p-4 transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold">Premium Quality</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Side Content */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            {/* Feature Card */}
            <motion.div
              className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-3xl p-8 flex-1 group hover:shadow-xl transition-all duration-500"
              variants={fadeInUp}
            >
              <div className="w-20 h-20 rounded-2xl overflow-hidden mb-6 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
                <img
                  src={breakout.src}
                  alt={breakout.alt}
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                {breakout.title}
              </h3>

              <p className="text-muted-foreground mb-8 leading-relaxed">
                {breakout.description}
              </p>

              <Button
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12 font-semibold transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                asChild
              >
                <a href={breakout.buttonUrl}>{breakout.buttonText}</a>
              </Button>
            </motion.div>

            {/* Secondary Image */}
            <motion.div
              className="relative overflow-hidden rounded-3xl group"
              variants={scaleIn}
            >
              <img
                src={secondaryImage.src}
                alt={secondaryImage.alt}
                className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </motion.div>
          </div>
        </motion.div>

        {/* Partners Section */}
        <motion.div
          className="text-center mb-24"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p className="text-muted-foreground mb-12 text-lg font-medium">
            {companiesTitle}
          </p>

          <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-16">
            {companies.map((company, idx) => (
              <motion.div
                key={company.src + idx}
                className="group"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={
                  isInView
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.8 }
                }
                transition={{ duration: 0.5, delay: 0.8 + idx * 0.1 }}
              >
                <div className="w-32 h-16 rounded-xl overflow-hidden grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-500 group-hover:scale-110">
                  <img
                    src={company.src}
                    alt={company.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Statistics Section */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <div className="bg-gradient-to-br from-muted/50 to-muted/20 border border-border/50 rounded-3xl p-12 lg:p-16 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-2xl"></div>

            <div className="relative z-10">
              <div className="text-center mb-16">
                <motion.h2
                  className="text-4xl lg:text-5xl font-bold mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.8, delay: 1.2 }}
                >
                  {achievementsTitle}
                </motion.h2>
                <motion.p
                  className="text-xl text-muted-foreground max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.8, delay: 1.3 }}
                >
                  {achievementsDescription}
                </motion.p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {achievements.map((item, idx) => (
                  <motion.div
                    key={item.label + idx}
                    className="text-center group"
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={
                      isInView
                        ? { opacity: 1, y: 0, scale: 1 }
                        : { opacity: 0, y: 30, scale: 0.9 }
                    }
                    transition={{ duration: 0.6, delay: 1.4 + idx * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <div className="bg-background/70 backdrop-blur-sm border border-border/30 rounded-2xl p-8 group-hover:bg-background/90 group-hover:border-primary/30 transition-all duration-500 group-hover:shadow-lg">
                      <div className="text-4xl lg:text-5xl font-bold text-primary mb-3 group-hover:scale-110 transition-transform duration-300">
                        {item.value}
                      </div>
                      <div className="text-muted-foreground font-medium group-hover:text-foreground transition-colors duration-300">
                        {item.label}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export { About };
