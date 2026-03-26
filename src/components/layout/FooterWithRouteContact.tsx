"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/layout/footer";
import Contact from "@/components/landing/contact";

const CONTACT_AFTER_FOOTER_ROUTES = new Set(["/result", "/resources"]);

export default function FooterWithRouteContact() {
  const pathname = usePathname();
  const showContactBelowFooter = CONTACT_AFTER_FOOTER_ROUTES.has(pathname);

  return (
    <>
      {showContactBelowFooter ? <Contact /> : null}
      <Footer />
    </>
  );
}
