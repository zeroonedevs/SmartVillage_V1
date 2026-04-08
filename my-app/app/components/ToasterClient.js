"use client";

import { Toaster } from "sonner";

export default function ToasterClient() {
  return (
    <Toaster richColors position="top-center" closeButton duration={4000} />
  );
}
