"use client";
import React, { useState } from "react";
import { motion, HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

export const WobbleCard = ({
  children,
  containerClassName,
  className,
  onClick,
  onMouseEnter: onMouseEnterProp,
  onMouseLeave: onMouseLeaveProp,
  onMouseMove: onMouseMoveProp,
  ...props
}: {
  children: React.ReactNode;
  containerClassName?: string;
  className?: string;
} & HTMLMotionProps<"section">) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const { clientX, clientY } = event;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (clientX - (rect.left + rect.width / 2)) / 20;
    const y = (clientY - (rect.top + rect.height / 2)) / 20;
    setMousePosition({ x, y });
    onMouseMoveProp?.(event);
  };
  return (
    <motion.section
      {...props}
      onMouseMove={handleMouseMove}
      onMouseEnter={(e) => {
        setIsHovering(true);
        onMouseEnterProp?.(e);
      }}
      onMouseLeave={(e) => {
        setIsHovering(false);
        setMousePosition({ x: 0, y: 0 });
        onMouseLeaveProp?.(e);
      }}
      onClick={onClick}
      style={{
        transform: isHovering
          ? `translate3d(${mousePosition.x}px, ${mousePosition.y}px, 0) scale3d(1, 1, 1)`
          : "translate3d(0px, 0px, 0) scale3d(1, 1, 1)",
        transition: "transform 0.1s ease-out",
      }}
      className={cn(
        "mx-auto w-full relative overflow-hidden",
        containerClassName
      )}
    >
      <div
        className="relative h-full sm:mx-0 overflow-hidden"
      >
        <motion.div
          style={{
            transform: isHovering
              ? `translate3d(${-mousePosition.x}px, ${-mousePosition.y}px, 0) scale3d(1.03, 1.03, 1)`
              : "translate3d(0px, 0px, 0) scale3d(1, 1, 1)",
            transition: "transform 0.1s ease-out",
          }}
          className={cn("h-full", className)}
        >
          {children}
        </motion.div>
      </div>
    </motion.section>
  );
};
