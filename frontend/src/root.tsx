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
      <button
        onClick={() => {
          mutation.mutate({
            userId: "1",
            text: "Hello, World!",
          });
        }}
      >
        Update
      </button>
    </main>
  );
}

export default Root;
