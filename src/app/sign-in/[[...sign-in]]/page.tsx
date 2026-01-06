import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-linear-to-br from-indigo-50 via-white to-purple-50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 h-full w-full animate-pulse rounded-full bg-linear-to-br from-blue-100/40 to-transparent blur-3xl"></div>
        <div className="absolute -right-1/2 -bottom-1/2 h-full w-full animate-pulse rounded-full bg-linear-to-tl from-purple-100/40 to-transparent blur-3xl delay-700"></div>
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center space-y-8 px-4">
        <div className="animate-in fade-in slide-in-from-top-4 mb-8 space-y-3 text-center duration-1000">
          <div className="inline-block">
            <h1 className="mb-2 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-5xl font-bold text-transparent md:text-6xl">
              Quiz Engine
            </h1>
            <div className="h-1 w-full rounded-full bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600"></div>
          </div>
          <p className="max-w-md text-lg font-medium text-gray-600 md:text-xl">
            Test your knowledge on a wide range of topics
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-green-500"></span>
            <span>Join thousands of learners today</span>
          </div>
        </div>
        <div className="animate-in fade-in slide-in-from-bottom-4 relative delay-300 duration-1000">
          <div className="absolute -inset-1 rounded-lg bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-25 blur-lg transition duration-1000 group-hover:opacity-40"></div>
          <div className="relative rounded-lg border border-gray-100/50 bg-white p-2 shadow-2xl">
            <SignIn
              forceRedirectUrl="/dashboard"
              appearance={{
                elements: {
                  rootBox: "mx-auto",
                  card: "shadow-none border-0",
                  headerTitle: "text-2xl font-bold",
                  headerSubtitle: "text-gray-600",
                  socialButtonsBlockButton:
                    "bg-white border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200",
                  formButtonPrimary:
                    "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg",
                  footerActionLink:
                    "text-indigo-600 hover:text-indigo-700 font-semibold",
                  formFieldInput:
                    "border-2 border-gray-200 focus:border-indigo-500 rounded-lg transition-all duration-200",
                  identityPreviewEditButton:
                    "text-indigo-600 hover:text-indigo-700",
                },
              }}
            />
          </div>
        </div>
        <div className="animate-in fade-in slide-in-from-bottom-4 mt-8 grid grid-cols-1 gap-4 text-center delay-500 duration-1000 md:grid-cols-2">
          <div className="flex flex-col items-center space-y-2 rounded-lg border border-white/80 bg-white/50 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md">
            <span className="text-2xl">🎯</span>
            <span className="text-sm font-medium text-gray-700">
              Multiple Quiz Types
            </span>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border border-white/80 bg-white/50 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md">
            <span className="text-2xl">📊</span>
            <span className="text-sm font-medium text-gray-700">
              Track Your Progress
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
