import { trpc } from "./trpc";

const Test = () => {
  const { data } = trpc.sayHi.useQuery();

  return <div>{data ? data : "OMG"}</div>;
};

export default Test;
