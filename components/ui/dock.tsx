import React, { PropsWithChildren, useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";

export interface DockProps extends VariantProps<typeof dockVariants> {
  className?: string;
  magnification?: number;
  children: React.ReactNode;
}

const DEFAULT_MAGNIFICATION = 1.2;

const dockVariants = cva(
  "mx-auto w-[97vw] h-[58px] p-2 flex justify-around items-center rounded-full  dark:bg-black"
);

const Dock = React.forwardRef<HTMLDivElement, DockProps>(
  (
    { className, children, magnification = DEFAULT_MAGNIFICATION, ...props },
    ref
  ) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const renderChildren = () => {
      return React.Children.map(children, (child: any, index) => {
        return React.cloneElement(child, {
          magnification: magnification,
          isActive: activeIndex === index,
          onActivate: () => setActiveIndex(index),
          onDeactivate: () => setActiveIndex(null),
        });
      });
    };

    return (
      <motion.div
        ref={ref}
        {...props}
        className={cn(dockVariants({ className }))}
      >
        {renderChildren()}
      </motion.div>
    );
  }
);

Dock.displayName = "Dock";

export interface DockIconProps {
  magnification?: number;
  isActive?: boolean;
  onActivate?: () => void;
  onDeactivate?: () => void;
  onClick?: () => void; // New onClick prop
  className?: string;
  children?: React.ReactNode;
  props?: PropsWithChildren;
}

const DockIcon = ({
  magnification = DEFAULT_MAGNIFICATION,
  isActive = false,
  onActivate,
  onDeactivate,
  onClick, // New onClick prop
  className,
  children,
  ...props
}: DockIconProps) => {
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <motion.div
      animate={{
        scale: isActive ? magnification : 1,
        y: isActive ? -5 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      className={cn(
        "flex aspect-square cursor-pointer items-center justify-center rounded-full relative",
        className
      )}
      onTouchStart={onActivate}
      onTouchEnd={onDeactivate}
      onClick={handleClick} // Add onClick handler
      {...props}
    >
      {children}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.2 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-white dark:bg-gray-400 rounded-full"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

DockIcon.displayName = "DockIcon";

export { Dock, DockIcon, dockVariants };
