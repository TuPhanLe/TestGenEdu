"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { SidebarProvider } from "./ui/sidebar";
const queryClient = new QueryClient();

const Providers = ({ children }: ThemeProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
        {/* <SidebarProvider> */}
        <SessionProvider>{children}</SessionProvider>
        {/* </SidebarProvider> */}
      </NextThemesProvider>
    </QueryClientProvider>
  );
};

export default Providers;
