"use client";

import React from "react";
import Link from "next/link";
import { Navigation } from "./components/landing/Navigation";
import { Stat } from "./components/landing/Stat";
import { Features } from "./components/landing/Features";
import { Testimonial } from "./components/landing/Testimonial";

export default function LandingPage() {
  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-grow pb-stack-lg flex flex-col gap-stack-lg">
        {/* Hero Section */}
        <section className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg pt-20 md:pt-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg items-center">
            <div className="flex flex-col gap-stack-md">
              <h1 className="font-display-lg text-display-lg md:text-display-lg text-on-surface">
                The Transparent, Accountable National Fertilizer Grid
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg">
                Bridging the gap between agricultural supply chains and digital
                trust. Empowering stakeholders with real-time, immutable data
                for sustainable food security.
              </p>
              <div className="flex flex-wrap gap-stack-md mt-stack-md">
                <button className="flex items-center justify-center bg-primary-container text-on-primary font-label-md text-label-md px-8 py-4 rounded-full hover:bg-primary transition-colors soft-bloom">
                  Access Your Quota
                </button>
                <button className="flex items-center justify-center bg-transparent border-2 border-secondary text-secondary font-label-md text-label-md px-8 py-4 rounded-full hover:bg-surface-container-low transition-colors soft-bloom">
                  Explore the Green Market
                </button>
              </div>
            </div>
            <div className="relative h-96 w-full rounded-xl overflow-hidden soft-bloom bg-surface-container-highest flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-surface-container to-surface-container-highest opacity-50"></div>
              <div className="relative z-10 flex flex-col items-center gap-4">
                <span
                  className="material-symbols-outlined text-6xl text-primary opacity-20"
                  data-icon="account_tree"
                >
                  account_tree
                </span>
                <div className="w-64 h-32 bg-surface rounded-lg shadow-sm flex items-center justify-center p-4 border border-outline-variant">
                  <div className="w-full bg-surface-container h-4 rounded-full overflow-hidden">
                    <div className="bg-primary-container h-full w-3/4"></div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-32 h-24 bg-surface rounded-lg shadow-sm flex items-center justify-center p-4 border border-outline-variant">
                    <span
                      className="material-symbols-outlined text-3xl text-secondary"
                      data-icon="inventory_2"
                    >
                      inventory_2
                    </span>
                  </div>
                  <div className="w-32 h-24 bg-surface rounded-lg shadow-sm flex items-center justify-center p-4 border border-outline-variant">
                    <span
                      className="material-symbols-outlined text-3xl text-tertiary-container"
                      data-icon="local_shipping"
                    >
                      local_shipping
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Stat />
        </section>

        {/* Features Section */}
        <section className="w-full">
          <Features />
        </section>

        {/* Testimonials Section */}
        <section className="w-full">
          <Testimonial />
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full py-stack-lg bg-surface-container-low border-t border-outline-variant mt-auto">
        <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-stack-md">
            <div className="flex flex-col gap-2">
              <Link
                href="#"
                className="text-title-lg font-title-lg font-bold text-primary flex items-center gap-2 mb-2"
              >
                <span className="material-symbols-outlined" data-icon="agriculture">
                  agriculture
                </span>
                PohoraPiyasa
              </Link>
              <p className="font-caption text-caption text-on-surface-variant">
                © 2024 PohoraPiyasa National Agricultural Grid. All rights
                reserved.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="font-label-md text-label-md text-on-surface font-semibold mb-2">
                Platform
              </h4>
              <Link
                href="#"
                className="font-caption text-caption text-on-surface-variant hover:text-primary underline transition-all duration-200"
              >
                Product
              </Link>
              <Link
                href="#"
                className="font-caption text-caption text-on-surface-variant hover:text-primary underline transition-all duration-200"
              >
                Network
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="font-label-md text-label-md text-on-surface font-semibold mb-2">
                Resources
              </h4>
              <Link
                href="#"
                className="font-caption text-caption text-on-surface-variant hover:text-primary underline transition-all duration-200"
              >
                Governance
              </Link>
              <Link
                href="#"
                className="font-caption text-caption text-on-surface-variant hover:text-primary underline transition-all duration-200"
              >
                Compliance
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="font-label-md text-label-md text-on-surface font-semibold mb-2">
                Legal
              </h4>
              <Link
                href="#"
                className="font-caption text-caption text-on-surface-variant hover:text-primary underline transition-all duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="font-caption text-caption text-on-surface-variant hover:text-primary underline transition-all duration-200"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
