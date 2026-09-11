import Header from '../components/Header'
import Gallery from '../components/Gallery'
import Footer from '../components/Footer'

export default function GaleriaPage() {
  return (
    <div className="min-h-screen bg-amz-areia dark:bg-amz-terra-dark transition-colors duration-500">
      <Header />
      <div className="pt-16">
        <Gallery />
      </div>
      <Footer />
    </div>
  )
}
