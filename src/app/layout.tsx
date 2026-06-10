import "./globals.css";

export const metadata = { title: "ZYNC BOT | Algo Trading Dashboard" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0b0f17] text-slate-300 font-sans antialiased overflow-hidden">
        {children}
      </body>
    </html>
  );
}
