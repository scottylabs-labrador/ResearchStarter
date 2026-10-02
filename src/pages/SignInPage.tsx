import { signIn } from "../lib/authClient";
import Logo from "../components/Logo";
import Surface from "../components/ui/Surface";
import Button from "../components/ui/Button";

const SignInPage = () => {
  const handleSignIn = () => {
    signIn.oauth2({ providerId: "keycloak", callbackURL: `${window.location.origin}/` });
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-canvas bg-hairline-texture px-4">
      <Surface className="w-full max-w-[400px] p-[40px] text-center shadow-popover">
        <Logo size="lg" alt="CMU Research" className="mx-auto mb-8" />
        <h1 className="text-title text-ink">Sign in to CMU Research</h1>
        <p className="mt-2 text-body text-ink-muted">Use your Andrew account</p>
        <Button variant="primary" className="mt-8 w-full" onClick={handleSignIn}>
          Sign in with CMU
        </Button>
      </Surface>
    </main>
  );
};

export default SignInPage;
