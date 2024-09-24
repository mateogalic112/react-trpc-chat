import { Button } from "./components/ui/button";
import { trpc } from "./trpc";

function Root() {
  trpc.onMessageAdd.useSubscription(undefined, {
    onData(data) {
      console.log({ data });
    },
    onError(err) {
      console.error("Subscription error:", err);
    },
  });
  const mutation = trpc.addMessage.useMutation();

  return (
    <main>
      <h1>Vite + React</h1>
      <Button
        variant="default"
        onClick={() => {
          mutation.mutate({
            userId: "1",
            text: "Hello, World!",
          });
        }}
      >
        Update
      </Button>
    </main>
  );
}

export default Root;
