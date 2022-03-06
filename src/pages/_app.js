import '../styles/globals.css'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="title" content="Product Development as a service" />
        <meta name="author" content="Abdi Adan" />

        <meta name="keywords" content="software as a service, SaaS, software engineering, startup, app development, freelance, product development, neumorphism, tech blog articles, Programming, Abdi Adan" />
        <meta name=" description" content="We make high-quality custom software products for your next big app idea" />

        <meta itemProp="name" content="Intrepid: Product Development as a service" />
        <meta itemProp="description" content="With us you'll get, fast, reliable and on demand digital experiences to kick-start and scale your next app idea!" />

      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
