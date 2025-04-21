// SADECE redirectUrl EKLENDİ ▼
import { SignIn } from "@clerk/nextjs";

const Signin = () => {
  return (
    <div style={{ display: "grid", placeContent: "center" }}>
      <SignIn
        redirectUrl="/callback" // BU SATIR DEĞİŞTİ
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "mx-auto",
          },
        }}
      />
    </div>
  );
};

export default Signin;
