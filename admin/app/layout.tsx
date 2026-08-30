import type { Metadata } from "next";
import "./globals.css";
import AdminLayout from "@/components/AdminLayout";

export const metadata: Metadata = {
  title: "Admin — วังสามหมอ Food Delivery",
  description: "Admin Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className="bg-gray-50 text-gray-800">
        <AdminLayout>{children}</AdminLayout>
      </body>
    </html>
  );
}
