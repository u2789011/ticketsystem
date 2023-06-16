import { Providers } from "./provider";
import Home from "./home";

export const metadata = {
  title: "NFT Ticketing",
  description: "PGTalk NFT Ticketing System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Home>{children}</Home>
        </Providers>
      </body>
    </html>
  );
}
