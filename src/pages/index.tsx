import dynamic from 'next/dynamic'
const HomePageComponent = dynamic(() => import('@components/pages/home'), { ssr: false })
export default function MainPage() {
  return <HomePageComponent />
}
