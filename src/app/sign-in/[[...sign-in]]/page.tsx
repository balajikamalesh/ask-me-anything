import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <SignIn forceRedirectUrl="/dashboard"/>
    </div>
);
};

export default SignInPage;
