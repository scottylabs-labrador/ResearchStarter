import { FaExclamationTriangle } from "react-icons/fa";
import EmptyState from "../components/ui/EmptyState";
import { ButtonLink } from "../components/ui/Button";

const NotFoundPage = () => (
  <main className="mx-auto max-w-xl px-6 py-24">
    <EmptyState
      className="w-full"
      icon={<FaExclamationTriangle size={18} />}
      title="Page not found"
      titleAs="h1"
      message="womp womp — this page doesn’t exist."
      action={
        <ButtonLink to="/" variant="primary">
          Back to search
        </ButtonLink>
      }
    />
  </main>
);

export default NotFoundPage;
