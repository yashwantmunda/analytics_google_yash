import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/sb-admin-2.css";
import "../styles/custom.scss";

function MyApp({ Component, pageProps }) {
  return (
    <>
      
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;