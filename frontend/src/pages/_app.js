import '../styles/globals.css';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

// Define rutas sin navbar aquí
const hiddenNavbarRoutes = ['/login', '/registro', '/olvidaste-tu-clave'];

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // Función que decide si envuelve en Layout o no
  const getLayout = Component.getLayout || ((page) => {
    // Si la ruta está en las ocultas, no envuelvas en Layout (sin navbar)
    if (hiddenNavbarRoutes.includes(router.pathname)) {
      return page;
    }
    // Si no, envuelve en el Layout por defecto
    return <Layout>{page}</Layout>;
  });

  return getLayout(<Component {...pageProps} />);
}


