import React from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

// Custom hooks and animation utilities
const useInView = (threshold = 0.1) => {
  const [isInView, setIsInView] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isInView] as const;
};

// Animation wrapper component
const AnimatedDiv: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "scale";
}> = ({ children, className = "", delay = 0, direction = "up" }) => {
  const [ref, isInView] = useInView();

  const getInitialTransform = () => {
    switch (direction) {
      case "up":
        return "translateY(60px)";
      case "down":
        return "translateY(-60px)";
      case "left":
        return "translateX(60px)";
      case "right":
        return "translateX(-60px)";
      case "scale":
        return "scale(0.8)";
      default:
        return "translateY(60px)";
    }
  };

  React.useEffect(() => {
    if (ref.current && isInView) {
      const element = ref.current;
      element.style.transition = `all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms`;
      element.style.transform =
        direction === "scale" ? "scale(1)" : "translate(0, 0)";
      element.style.opacity = "1";
    }
  }, [isInView, delay, direction]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: 0,
        transform: getInitialTransform(),
        transition: `all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

// Stagger children animation
const StaggerContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}> = ({ children, className = "", staggerDelay = 100 }) => {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <AnimatedDiv delay={index * staggerDelay}>{child}</AnimatedDiv>
      ))}
    </div>
  );
};

const Testimonial: React.FC = () => {
  return (
    <section className="py-32 px-4 overflow-hidden">
      <div>
        <AnimatedDiv direction="up" delay={0}>
          <div className="text-center mb-12 flex flex-col gap-4">
            <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              What Our Customers Say
            </h2>
            <p className="text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover the experiences of our valued customers who have enjoyed
              our high-quality garments and exceptional service.
            </p>
          </div>
        </AnimatedDiv>

        <div className="flex flex-col gap-6">
          <AnimatedDiv direction="up" delay={200}>
            <div className="grid grid-cols-1 items-stretch gap-x-0 gap-y-4 lg:grid-cols-3 lg:gap-4">
              <div className="overflow-hidden rounded-md">
                <img
                  src="https://cafebiz.cafebizcdn.vn/2017/photo-1-1492139762650.jpg"
                  alt="placeholder"
                  className="h-72 w-full rounded-md object-cover lg:h-auto hover:scale-110 transition-transform duration-700"
                />
              </div>
              <Card className="col-span-2 flex items-center justify-center p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex flex-col gap-4">
                  <q className="text-xl font-medium lg:text-3xl">
                    Exceptional quality and impeccable service. The garments
                    exceeded my expectations in both style and comfort. A
                    seamless shopping experience-I highly recommend this brand
                    to others.
                  </q>
                  <div className="flex flex-col items-start font-semibold text-xl">
                    <p className="font-bold">Amancio Ortega</p>
                    <p className="text-muted-foreground">Founder, Zara</p>
                  </div>
                </div>
              </Card>
            </div>
          </AnimatedDiv>

          <StaggerContainer
            className="grid grid-cols-1 gap-4 lg:grid-cols-3"
            staggerDelay={150}
          >
            <Card className="hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
              <CardContent className="px-6 pt-6 leading-7 text-foreground/70">
                <q>
                  Amazing quality and fit, very comfortable. Will definitely
                  shop here again.
                </q>
              </CardContent>
              <CardFooter>
                <div className="flex gap-4 leading-5">
                  <Avatar className="size-9 rounded-full ring-1 ring-input hover:ring-2 hover:ring-blue-500 transition-all duration-200">
                    <AvatarImage
                      src="https://images.unsplash.com/photo-1654110455429-cf322b40a906?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt="placeholder"
                    />
                  </Avatar>
                  <div className="text-sm">
                    <p className="font-medium">Anna Lee</p>
                    <p className="text-muted-foreground">
                      Product Manager, Prada
                    </p>
                  </div>
                </div>
              </CardFooter>
            </Card>

            <Card className="hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
              <CardContent className="px-6 pt-6 leading-7 text-foreground/70">
                <q>
                  Fast delivery, excellent customer service, and stylish clothes
                  that feel great.
                </q>
              </CardContent>
              <CardFooter>
                <div className="flex gap-4 leading-5">
                  <Avatar className="size-9 rounded-full ring-1 ring-input hover:ring-2 hover:ring-green-500 transition-all duration-200">
                    <AvatarImage
                      src="https://images.unsplash.com/photo-1628157588553-5eeea00af15c?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt="placeholder"
                    />
                  </Avatar>
                  <div className="text-sm">
                    <p className="font-medium">James Smith</p>
                    <p className="text-muted-foreground">
                      Sales Director, Burberry
                    </p>
                  </div>
                </div>
              </CardFooter>
            </Card>

            <Card className="hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
              <CardContent className="px-6 pt-6 leading-7 text-foreground/70">
                <q>
                  Beautiful designs, soft fabrics, and perfect sizing. Truly a
                  great brand.
                </q>
              </CardContent>
              <CardFooter>
                <div className="flex gap-4 leading-5">
                  <Avatar className="size-9 rounded-full ring-1 ring-input hover:ring-2 hover:ring-purple-500 transition-all duration-200">
                    <AvatarImage
                      src="https://plus.unsplash.com/premium_photo-1731499365452-6b8dc111229a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt="placeholder"
                    />
                  </Avatar>
                  <div className="text-sm">
                    <p className="font-medium">Linda Nguyen</p>
                    <p className="text-muted-foreground">
                      Fashion Consultant, Dior
                    </p>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
};

export { Testimonial };
