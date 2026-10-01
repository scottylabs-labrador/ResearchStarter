import { useSession } from "./authClient";
import { getDevMockSession } from "../data/devMockSession";

export function useEffectiveSession() {
  const result = useSession();
  const mock = getDevMockSession();

  if (mock && !result.isPending && !result.data?.user) {
    return { ...result, data: mock };
  }

  return result;
}
