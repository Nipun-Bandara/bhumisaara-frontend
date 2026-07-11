"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Loader } from "@/components/Loader";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { inAppWallet } from "thirdweb/wallets";
import { client } from "@/lib/thirdwebClient";
import { polygonAmoy as amoy } from "thirdweb/chains";

const ConnectButton = dynamic(
    () => import("thirdweb/react").then((mod) => mod.ConnectButton),
    { ssr: false }
);

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!isLoading && !user) {
            router.replace("/auth");
        }
    }, [user, isLoading, router]);

    if (!isLoading && !user) {
        return null;
    }

    const wallet = inAppWallet({
        smartAccount: {
            chain: amoy, // your Amoy chain object
            sponsorGas: true,
        },
    });

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                {isLoading ? (
                    <div className="flex h-full w-full items-center justify-center min-h-screen">
                        <Loader />
                    </div>
                ) : (
                    <>
                        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b border-sidebar-border">
                            <div className="flex items-center gap-2 px-4 w-full">
                                <SidebarTrigger className="-ml-1" />
                                <div className="ml-auto flex items-center gap-3">
                                    {mounted ? (
                                        <ConnectButton
                                            client={client}
                                            wallets={[wallet]}
                                            theme={resolvedTheme === "light" ? "light" : "dark"}
                                        />
                                    ) : (
                                        <div className="w-[140px] h-[40px] bg-muted animate-pulse rounded-xl" />
                                    )}
                                    <ThemeToggle />
                                </div>
                            </div>
                        </header>
                        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background text-foreground">
                            {children}
                        </main>
                    </>
                )}
            </SidebarInset>
        </SidebarProvider>
    );
}