import type { AppProps } from 'next/app'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../globals.css'; // Adjust the path if globals.css is located elsewhere

export default function App({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />
}
