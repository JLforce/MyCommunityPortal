import '../styles/globals.css';

export const metadata = {
  title: 'MyCommunityPortal',
  description: 'Connecting communities for better waste management and civic engagement.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>
        {children}
      </body>
    </html>
  );
}


