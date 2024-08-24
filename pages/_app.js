import '../styles/globals.css';
import { NextUIProvider } from '@nextui-org/react';
import MyLayout from '../components/MyLayout';

function MyApp({ Component, pageProps }) {
  return (
    <NextUIProvider>
      <MyLayout>
      <Component {...pageProps} />
      </MyLayout>
    </NextUIProvider>
  );
}

export default MyApp;
