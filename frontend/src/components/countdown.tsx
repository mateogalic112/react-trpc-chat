interface Props {
  counter: number | null;
  username: string;
}

const Countdown = ({ counter, username }: Props) => {
  return (
    <div>
      {counter && username !== username && (
        <p className="text-lg font-bold">
          Countdown: <span className="text-xl">{counter}</span>
        </p>
      )}
    </div>
  );
};

export default Countdown;
