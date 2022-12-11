import dynamic from 'next/dynamic'
const RegisterPageComponent = dynamic(() => import('@root/src/client/components/pages/account/RegisterPageComponent'), {
  ssr: false,
})

export default function Register() {
  return <RegisterPageComponent />
}
