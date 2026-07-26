import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "ПрокатКостюм.kz — прокат детских костюмов в Алматы",
  description:
    "Прокат детских костюмов для садика и школы: Наурыз, Новый год, Осенний бал, 9 Мая, персонажи и животные. Бронь на нужную дату онлайн.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
