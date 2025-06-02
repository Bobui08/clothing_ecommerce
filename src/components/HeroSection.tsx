import React from "react";
import { ArrowDownRight, Star } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

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

interface Hero3Props {
  heading?: string;
  description?: string;
  buttons?: {
    primary?: {
      text: string;
      url: string;
    };
    secondary?: {
      text: string;
      url: string;
    };
  };
  reviews?: {
    count: number;
    avatars: {
      src: string;
      alt: string;
    }[];
    rating?: number;
  };
}

const Hero: React.FC<Hero3Props> = ({
  heading = "Trendy Outfits Made for Every Season",
  description = "Discover stylish clothing for every occasion. Our collections blend comfort and fashion. Shop now and elevate your wardrobe with trendy outfits for men and women.",
  buttons = {
    primary: {
      text: "Shop Now",
      url: "/",
    },
    secondary: {
      text: "New Arrivals",
      url: "/",
    },
  },
  reviews = {
    count: 200,
    rating: 5.0,
    avatars: [
      {
        src: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Avatar 1",
      },
      {
        src: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Avatar 2",
      },
      {
        src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Avatar 3",
      },
      {
        src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Avatar 4",
      },
      {
        src: "https://images.unsplash.com/photo-1576348076752-6085814e5a51?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Avatar 5",
      },
    ],
  },
}) => {
  return (
    <>
      <style jsx>{`
        @keyframes slideInScale {
          0% {
            transform: translateY(20px) scale(0.8);
            opacity: 0;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes fadeInRotate {
          0% {
            transform: rotate(-180deg) scale(0);
            opacity: 0;
          }
          100% {
            transform: rotate(0deg) scale(1);
            opacity: 1;
          }
        }
      `}</style>

      <section className="overflow-hidden">
        <div className="grid items-center p-8 gap-10 lg:grid-cols-2 lg:gap-20">
          <div className="mx-auto flex flex-col items-center text-center md:ml-auto lg:max-w-3xl lg:items-start lg:text-left">
            <AnimatedDiv direction="up" delay={0}>
              <h1 className="my-6 text-4xl font-bold text-pretty lg:text-6xl xl:text-7xl">
                {heading}
              </h1>
            </AnimatedDiv>

            <AnimatedDiv direction="up" delay={200}>
              <p className="mb-8 max-w-xl text-muted-foreground lg:text-xl">
                {description}
              </p>
            </AnimatedDiv>

            <AnimatedDiv direction="up" delay={400}>
              <div className="mb-12 flex w-fit flex-col items-center gap-4 sm:flex-row">
                <span className="inline-flex items-center -space-x-4">
                  {reviews.avatars.map((avatar, index) => (
                    <div
                      key={index}
                      style={{
                        animationDelay: `${600 + index * 100}ms`,
                        animationDuration: "0.6s",
                        animationFillMode: "both",
                        animationName: "slideInScale",
                      }}
                    >
                      <Avatar className="size-12 border hover:scale-110 transition-transform duration-300">
                        <AvatarImage src={avatar.src} alt={avatar.alt} />
                      </Avatar>
                    </div>
                  ))}
                </span>
                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        className="size-5 fill-yellow-400 text-yellow-400 hover:scale-125 transition-transform duration-200"
                        style={{
                          animationDelay: `${800 + index * 50}ms`,
                          animationDuration: "0.5s",
                          animationFillMode: "both",
                          animationName: "fadeInRotate",
                        }}
                      />
                    ))}
                    <span className="mr-1 font-semibold">
                      {reviews.rating?.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-left font-medium text-muted-foreground">
                    from {reviews.count}+ reviews
                  </p>
                </div>
              </div>
            </AnimatedDiv>

            <AnimatedDiv direction="up" delay={600}>
              <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
                {buttons.primary && (
                  <Button
                    asChild
                    className="w-full sm:w-auto hover:scale-105 transition-transform duration-200"
                  >
                    <a href={buttons.primary.url}>{buttons.primary.text}</a>
                  </Button>
                )}
                {buttons.secondary && (
                  <Button
                    asChild
                    variant="outline"
                    className="hover:scale-105 transition-transform duration-200"
                  >
                    <a href={buttons.secondary.url}>
                      {buttons.secondary.text}
                      <ArrowDownRight className="size-4" />
                    </a>
                  </Button>
                )}
              </div>
            </AnimatedDiv>
          </div>

          <AnimatedDiv direction="right" delay={300} className="flex">
            <img
              src="https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA3L3Vwd2s2MTg0MzM0NC13aWtpbWVkaWEtaW1hZ2UtbGtocWw2YWIuanBn.jpg"
              alt="placeholder hero"
              className="max-h-[600px] w-full rounded-md object-cover lg:max-h-[800px] hover:scale-105 transition-transform duration-500"
            />
          </AnimatedDiv>
        </div>
      </section>
    </>
  );
};

export { Hero };
