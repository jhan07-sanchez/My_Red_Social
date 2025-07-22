import '../styles/globals.css';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { AuthProvider } from '../../context/AuthContext'; // 👈 Importa el AuthProvider, no el Contexto directo

const hiddenNavbarRoutes = ['/login', '/registro', '/forgot-password'];

export default function App({ Component, pageProps }) {
  const router = useRouter();

  const getLayout = Component.getLayout || ((page) => {
    if (hiddenNavbarRoutes.includes(router.pathname)) {
      return page;
    }
    return <Layout>{page}</Layout>;
  });

  return (
    <AuthProvider> {/* 👈 Aquí envuelves todo con el AuthProvider completo */}
      {getLayout(<Component {...pageProps} />)}
    </AuthProvider>
  );
}



