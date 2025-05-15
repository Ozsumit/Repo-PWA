"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import logo from "../components/image/logo.svg";
import Link from "next/link";
import { Home, Phone, CodeXml, Search, DollarSign, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import PulsatingButton from "@/components/ui/button";
import { Dock, DockIcon } from "@/components/ui/dock";
import { useRouter, usePathname } from "next/navigation";
// import { useServiceWorker } from "@/hooks/useServiceWorker";
import { Analytics } from "@vercel/analytics/next"
import Head from "next/head";
import { PushNotificationSubscriber } from "@/components//ui/pushnotification";

const inter = Inter({ subsets: ["latin"] });

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  title: string;
  isActive?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon: Icon, title }) => (
  <Link
    title={title}
    href={href}
    className="group flex items-center space-x-10 px-4 py-2 rounded-md transition-all duration-350"
  >
    <Icon
      size={30}
      className="text-gray-400 group-hover:text-green-400 transition-colors duration-300"
    />
  </Link>
);

const MobileNavItem: React.FC<NavItemProps> = ({
  href,
  icon: Icon,
  isActive,
}) => (
  <Icon
    size={24}
    className={`${
      isActive ? "text-green-400" : "text-gray-400"
    } transition-colors duration-300`}
  />
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // useServiceWorker();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);

      if (currentScrollY < 20) {
        setShowNav(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowNav(false);
      } else if (currentScrollY < lastScrollY) {
        setShowNav(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then(
        function (registration) {
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );
        },
        function (err) {
          console.log("Service Worker registration failed:", err);
        }
      );

      const handleOffline = () => {
        setIsOffline(true);
        router.push("/offline");
      };

      const handleOnline = () => {
        setIsOffline(false);
      };

      window.addEventListener("offline", handleOffline);
      window.addEventListener("online", handleOnline);

      return () => {
        window.removeEventListener("offline", handleOffline);
        window.removeEventListener("online", handleOnline);
      };
    }
  }, [router]);

  if (isOffline) {
    return <div>{children}</div>; // This will render the offline page when offline
  }

  return (
    <html lang="en" className="scroll-smooth">
      <Head>
        <title>Odyssey</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=0.9, maximum-scale=1"
        />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <body className="bg-black text-white min-h-screen mx-4 lg:mx-0 flex flex-col overflow-x-visible">
        <PushNotificationSubscriber />
        <header
          className={`w-[96vw] z-50 transition-all duration-300 ${
            scrolled ? "" : "bg-transparent"
          }`}
        >
          <div className="navigation flex flex-row justify-center items-center w-[95vw] mx-0">
            <div className="flex w-[96vw] lg:justify-between justify-between items-center py-4">
              <Link href="/" className="flex items-center">
                <Image width={100} height={100} src={logo} alt="Logo" />
              </Link>

              <nav
                className={`hidden md:flex transition-all duration-300 nav gap-7 bg-black border border-white/[0.2] dark:border-white/[0.2] group-hover:border-slate-70 items-center justify-evenly px-4 py-2 rounded-md ${
                  scrolled ? "" : "bg-transparent"
                }`}
              >
                <NavItem href="/" icon={Home} title="Home" />
                <NavItem href="/contact" icon={Phone} title="Contact" />
                <NavItem href="/Dev" icon={CodeXml} title="Dev" />
                <NavItem href="/QuickFind" icon={Search} title="Quick find" />
              </nav>
              <div className="hidden P-4 mr-4 lg:flex">
                {/* <Link href="/donate" className="p-[3px] relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#94fc02] to-[#294c83] rounded-lg" />
                  <div className="px-8 py-2 flex flex-row items-center justify-center bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
                    Donate
                    <DollarSign size={20} />
                  </div>
                </Link> */}
              </div>
            </div>
          </div>
        </header>
        <main className="flex-grow justify-center items-center flex-col flex pb-16  md:pb-0">
          {children}
        </main>
        {/* Mobile Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-black w-[100vw]  border-t-[1px] border-t-[#294c83] z-50 md:hidden">
          <Dock className="py-2 px-4">
            <DockIcon onClick={() => router.push("/")}>
              <MobileNavItem
                href="/"
                icon={Home}
                title="Home"
                isActive={pathname === "/"}
              />
            </DockIcon>
            <DockIcon onClick={() => router.push("/contact")}>
              <MobileNavItem
                href="/contact"
                icon={Phone}
                title="Contact"
                isActive={pathname === "/contact"}
              />
            </DockIcon>
            <DockIcon onClick={() => router.push("/Dev")}>
              <MobileNavItem
                href="/Dev"
                icon={CodeXml}
                title="Dev"
                isActive={pathname === "/Dev"}
              />
            </DockIcon>
            <DockIcon onClick={() => router.push("/QuickFind")}>
              <MobileNavItem
                href="/QuickFind"
                icon={Search}
                title="Quick find"
                isActive={pathname === "/QuickFind"}
              />
            </DockIcon>
            <DockIcon onClick={() => router.push("/donate")}>
              <MobileNavItem
                href="/donate"
                icon={DollarSign}
                title="Donate"
                isActive={pathname === "/donate"}
              />
            </DockIcon>
          </Dock>
        </nav>
        <Toaster />
      </body>
    </html>
  );
}
