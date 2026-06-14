"use client";
import { cn } from "@/app/lib/utils";
import React, { useEffect, useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  animate = true,
}: {
  children: React.ReactNode;
  animate?: boolean;
}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 639px)");
    const syncOpenState = () => setOpen(media.matches);

    syncOpenState();
    media.addEventListener("change", syncOpenState);
    return () => media.removeEventListener("change", syncOpenState);
  }, []);

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  animate = true,
}: {
  children: React.ReactNode;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <>
      <motion.div
        className={cn(
          "h-screen px-2 py-4 hidden md:flex md:flex-col bg-surface-container-low border-r border-outline-variant dark:border-outline overflow-hidden w-[300px] shrink-0",
          className
        )}
        animate={{
          width: animate ? (open ? "300px" : "70px") : "300px",
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        {...props}
      >
        {children}
      </motion.div>
    </>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "h-14 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-surface dark:bg-inverse-surface border-b border-outline-variant dark:border-outline w-full"
        )}
        {...props}
      >
        <div className="flex justify-end z-20 w-full">
          <Menu
            className="text-on-surface cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed h-full w-full inset-0 bg-sidebar-primary p-10 z-[100] flex flex-col justify-between",
                className
              )}
            >
              <div
                className="absolute right-3 top-3 z-50 text-on-surface cursor-pointer"
                onClick={() => setOpen(!open)}
              >
                <X />
              </div>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
}) => {
  const { open, animate } = useSidebar();
  const pathname = usePathname();
  
  // Consider active if exact match or if we are in a sub-route (except for dashboard home which might be exactly /dashboard)
  const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));

  return (
    <Link
      href={link.href}
      className={cn(
        "flex items-center justify-start gap-3 rounded-lg px-4 py-3 font-label-md text-label-md",
        isActive 
          ? "bg-secondary-container dark:bg-on-secondary-fixed-variant text-on-secondary-container dark:text-secondary-fixed font-bold active:scale-95 transition-transform"
          : "text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-high dark:hover:bg-surface-variant transition-colors",
        className
      )}
      {...props}
    >
      {link.icon}

      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-inherit transition duration-150 whitespace-pre inline-block !p-0 !m-0"
      >
        {link.label}
      </motion.span>
    </Link>
  );
};
