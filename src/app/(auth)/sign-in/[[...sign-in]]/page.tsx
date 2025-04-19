// SADECE redirectUrl EKLENDİ ▼
import { SignIn } from "@clerk/nextjs";

const Signin = () => {
  return (
    <SignIn 
      redirectUrl="/callback" // BU SATIR DEĞİŞTİ
      appearance={{
        elements: {
          rootBox: "w-full",
          card: "mx-auto"
        }
      }}
    />
  )
}

export default Signin