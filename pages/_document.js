import  Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render() {
    const pageProps = this.props?.__NEXT_DATA__?.props?.pageProps;

    return (
      <Html>
        <Head>
          <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="favicon-16x16.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png" />
          <link async rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
         />
        </Head>
        <body className={pageProps.isBlue ? 'bg-gradient-primary' : ''}>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}