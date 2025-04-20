"use client";
import * as React from "react";

interface TabsProps {
    defaultValue?: string;
    value: string;
    onValueChange: (value: string) => void;
    children: React.ReactNode;
    className?: string;
}

const Tabs: React.FC<TabsProps> = ({ value, onValueChange, children, className = "" }) => {
    return (
        <div className={className} role="tablist" aria-orientation="horizontal">
            {React.Children.map(children, (child) =>
                React.isValidElement(child)
                    ? React.cloneElement(child, { activeTab: value, setActiveTab: onValueChange } as any)
                    : child
            )}
        </div>
    );
};

interface TabsListProps {
    children: React.ReactNode;
    className?: string;
    activeTab?: string;
    setActiveTab?: (value: string) => void;
}

const TabsList: React.FC<TabsListProps> = ({ children, className = "", activeTab, setActiveTab }) => {
    return (
        <div className={`border-b border-gray-200 grid grid-cols-5 w-full mb-6 ${className}`}>
            {React.Children.map(children, (child) =>
                React.isValidElement(child)
                    ? React.cloneElement(child, { activeTab, setActiveTab } as any)
                    : child
            )}
        </div>
    );
};

interface TabsTriggerProps {
    value: string;
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
    activeTab?: string;
    setActiveTab?: (value: string) => void;
}

const TabsTrigger: React.FC<TabsTriggerProps> = ({
    value,
    children,
    className = "",
    disabled,
    activeTab,
    setActiveTab,
}) => {
    const isActive = activeTab === value;
    return (
        <button
            className={`px-4 py-2 text-sm font-medium border-b-2 cursor-pointer ${isActive ? "border-blue-500 text-blue-500" : "border-transparent hover:border-blue-300 hover:text-blue-500"
                } ${disabled ? "opacity-50 pointer-events-none cursor-not-allowed" : ""} ${className}`}
            onClick={() => setActiveTab && setActiveTab(value)}
            role="tab"
            aria-selected={isActive}
            aria-disabled={disabled}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

interface TabsContentProps {
    value: string;
    children: React.ReactNode;
    className?: string;
    activeTab?: string;
}

const TabsContent: React.FC<TabsContentProps> = ({ value, children, className = "", activeTab }) => {
    if (activeTab !== value) return null;
    return (
        <div className={className} role="tabpanel" aria-labelledby={`tab-${value}`}>
            {children}
        </div>
    );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };