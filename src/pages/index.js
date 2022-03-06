import Navbar from '../components/navbar';
import Hero from '../components/hero';
import Services from '../components/services';
import About from '../components/about';
import Work from '../components/work';
import BlogPreview from '../components/blogPreview';
import Outreach from '../components/outreach';
import Footer from '../components/footer';


export default function Home() {
  return (
    <div>
      <title></title>

      <Navbar />

      <main>

        <Hero />

        <Services />

        <About />

        <Work />

        <BlogPreview />

        <Outreach />

      </main>

      <Footer />

    </div>
  )
}
