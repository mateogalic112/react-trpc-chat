import { trpc } from "../trpc";
import { Card, CardContent } from "../components/ui/card";
import { ScrollArea } from "../components/ui/scroll-area";
import MessageList from "../components/message-list";
import MessageInput from "../components/message-input";
import useTypingUsersSub from "../hooks/use-typing-users-sub";
import useUsername from "../hooks/use-username";
import useMessageAddSub from "../hooks/use-message-add-sub";

function Root() {
  const { data = [] } = trpc.chat.messages.useQuery();

  const username = useUsername();

  const { countdown } = useMessageAddSub(username);

  const typingUsers = useTypingUsersSub(username);

  return (
    <main className="bg-slate-600 dark:bg-slate-800 h-[100dvh] flex items-center justify-center">
      <div className="max-w-[600px] w-full mx-[5%] h-[75vh] flex flex-col gap-4">
        {/* Countdown */}
        {Boolean(countdown.counter) && countdown.username !== username && (
          <p className="text-lg font-bold">
            Countdown: <span className="text-xl">{countdown.counter}</span>
          </p>
        )}

        {/* Chat Messages */}
        <Card className="flex-1 overflow-hidden">
          <CardContent className="p-0 h-full">
            <ScrollArea className="h-full bg-slate-700 dark:bg-slate-900">
              <MessageList messages={data} username={username} />
              {typingUsers.length > 0 && <p className="p-4">Typing...</p>}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Input Area */}
        <MessageInput username={username} />
      </div>
    </main>
  );
}

export default Root;
