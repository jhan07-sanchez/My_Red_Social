import '../styles/globals.css';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import Head from 'next/head';
import { useEffect } from 'react';
import NProgress from 'nprogress'; // 🚀 npm install nprogress
import 'nprogress/nprogress.css';

const hiddenNavbarRoutes = ['/login', '/registro', '/forgot-password'];

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // 🚀 Barra de progreso en navegación
  useEffect(() => {
    const handleStart = () => NProgress.start();
    const handleStop = () => NProgress.done();

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleStop);
    router.events.on('routeChangeError', handleStop);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleStop);
      router.events.off('routeChangeError', handleStop);
    };
  }, [router]);

  const getLayout = Component.getLayout || ((page) => {
    if (hiddenNavbarRoutes.includes(router.pathname)) {
      return page;
    }
    return <Layout>{page}</Layout>;
  });

  return (
    <>
      {/* 🌍 Meta globales */}
      <Head>
        <title>Mi Red Social</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Tu red social moderna y responsiva" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* 🌙 Providers globales */}
      <AuthProvider>
        <ThemeProvider>
          {getLayout(<Component {...pageProps} />)}
        </ThemeProvider>
      </AuthProvider>
    </>
  );
}



