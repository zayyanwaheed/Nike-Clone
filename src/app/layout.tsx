import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nike. Just Do It. Nike.com",
  description: "Nike delivers innovative products, experiences and services to inspire athletes. Free Delivery and Returns.",
  keywords: ["Nike", "Shoes", "Sneakers", "Running", "Basketball", "Training", "Football", "Just Do It"],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='%23111' fill-rule='evenodd' d='M21 8.719L7.836 14.303C6.74 14.768 5.818 15 5.075 15c-.836 0-1.445-.295-1.819-.884-.485-.76-.273-1.982.559-3.272.494-.754 1.122-1.446 1.734-2.108-.144.234-1.415 2.349-.025 3.345.275.2.666.298 1.147.298.386 0 .829-.063 1.316-.19L21 8.719z' clip-rule='evenodd'/></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-white text-[#111] font-['Helvetica_Neue',Helvetica,Arial,sans-serif]">
        {children}
      </body>
    </html>
  );
}
