import { ConversationsLauncher } from "@/components/conversations/ConversationsLauncher";
import { AppRouter } from "@/routes/AppRouter";

function App() {
  return (
    <>
      <AppRouter />
      <ConversationsLauncher />
    </>
  );
}

export default App;
