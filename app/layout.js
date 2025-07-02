import { Outfit } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { AppContextProvider } from '@/context/AppContext';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-outfit'
});

export const metadata = {
  title: 'QuickCart - GreatStack',
  description: 'E-Commerce with Next.js',
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#000000',
        },
      }}
    >
      <AppContextProvider>
        <html lang="en" className={outfit.variable}>
          <body className={`antialiased text-gray-700 ${outfit.className}`}>
            {children}
          </body>
        </html>
      </AppContextProvider>
    </ClerkProvider>
  );
}