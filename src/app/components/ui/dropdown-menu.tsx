"use client";
import { cn } from "@/app/lib/utils";
import * as React from "react";
import { useState, useRef, useEffect } from "react";

interface DropdownMenuProps {
  children: React.ReactNode;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }: any) => {
  return <div>{children}</div>;
};

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
}

const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({ children, className, asChild }: any) => {
  // If asChild is true, expect children to handle their own rendering
  return asChild ? <>{children}</> : <div className={cn(className)}>{children}</div>;
};

interface DropdownMenuContentProps {
  children: React.ReactNode;
  className?: string;
  align?: "start" | "end" | "center";
  sideOffset?: number;
}

const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({ children, className, align = "end", sideOffset = 4 }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Toggle dropdown on trigger click
  const toggleDropdown = () => setIsOpen(!isOpen);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Determine alignment classes
  const alignClasses = align === "end" ? "right-0" : align === "start" ? "left-0" : "left-1/2 -translate-x-1/2";

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger: Wrap children in a div to handle click */}
      <div onClick={toggleDropdown} className="cursor-pointer">
        <DropdownMenuTrigger>{children[0]}</DropdownMenuTrigger>
      </div>
      {/* Content: Show when open */}
      {isOpen && (
        <div
          className={cn(
            "absolute z-50 min-w-[8rem] bg-white border border-gray-200 rounded-md shadow-lg p-1 text-gray-700",
            alignClasses,
            `mt-${sideOffset}`,
            className
          )}
          role="menu"
        >
          {React.Children.map(children.slice(1), (child, index) => (
            <div key={index} onClick={() => setIsOpen(false)}>
              {child}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface DropdownMenuItemProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({ children, className, onClick, disabled }) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm cursor-pointer hover:bg-gray-100",
        disabled && "opacity-50 pointer-events-none cursor-not-allowed",
        className
      )}
      onClick={onClick}
      role="menuitem"
    >
      {children}
    </div>
  );
};

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem };