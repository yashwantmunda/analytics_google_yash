import  Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render() {
    const pageProps = this.props?.__NEXT_DATA__?.props?.pageProps;

    return (
      <Html>
        <Head>
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