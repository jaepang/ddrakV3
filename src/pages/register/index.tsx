import dynamic from 'next/dynamic'
const SignupPageComponent = dynamic(() => import('@root/src/client/components/pages/account/RegisterPageComponent'), {
  ssr: false,
})

export default function Login() {
  return <SignupPageComponent />
}
