import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import TopicPage from "@/pages/TopicPage";
import { pathToTopic, TOPIC_META, TOPICS } from "@/lib/topics";

const queryClient = new QueryClient();

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Switch>
        <Route path="/" component={() => <Redirect to="/ai" />} />
        {TOPICS.map((t) => (
          <Route key={t} path={TOPIC_META[t].path}>
            {() => <TopicPage topic={t} />}
          </Route>
        ))}
        <Route>{() => <Redirect to="/ai" />}</Route>
      </Switch>
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <AppRoutes />
      </WouterRouter>
    </QueryClientProvider>
  );
}
