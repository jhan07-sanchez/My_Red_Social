import '../styles/globals.css';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext'; // ✅ Asegúrate de que la ruta sea correcta

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
    <AuthProvider>
      <ThemeProvider> {/* ✅ Envuelve todo con ThemeProvider */}
        {getLayout(<Component {...pageProps} />)}
      </ThemeProvider>
    </AuthProvider>
  );
}



