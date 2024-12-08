import type { AppProps } from 'next/app';
import Head from 'next/head';
import type { NextPage } from 'next';
import { ContextProvider } from '../contexts/ContextProvider';
import { AppBar } from '../components/common/AppBar';
import { ContentContainer } from '../components/layouts/ContentContainer';
import { Footer } from '../components/common/Footer';
import { default as NotificationList } from '../components/common/Notification';
import { AccessibilityProvider } from '../components/common/AccessibilityProvider';
import { Toaster } from 'react-hot-toast';
require('@solana/wallet-adapter-react-ui/styles.css');
require('../styles/globals.css');

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head children={
        <>
          <title>TokenForge</title>
          <meta name="description" content="Create and deploy Solana tokens with AI-powered tools" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </>
      } />

      <AccessibilityProvider>
        <ContextProvider>
          <div className="flex flex-col min-h-screen">
            <NotificationList />
            <AppBar />
            <main id="main-content" className="flex-1">
              <ContentContainer>
                <Component {...pageProps} />
              </ContentContainer>
            </main>
            <Footer />
          </div>
        </ContextProvider>
      </AccessibilityProvider>
      <Toaster position="top-right" />
    </>
  );
};

export default App;
