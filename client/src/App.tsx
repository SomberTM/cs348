import { createResource, Match, Show, Switch, type Component } from "solid-js";
import { getUser } from "./api/authentication";
import { Login } from "./components/login";
import { Logout } from "./components/logout";
import { Calendars } from "./components/calendars";
import { Calendar } from "./components/calendar";

const App: Component = () => {
  const [user, { refetch }] = createResource(getUser);
  const params = new URLSearchParams(window.location.search);
  const currentCalendarName = params.get("cid");

  return (
    <main class="flex min-h-[100dvh]">
      <Show when={user.loading}>Loading user</Show>
      <Switch>
        <Match when={user.error}>
          <div class="w-full grid place-items-center">
            <Login onLogin={refetch} />
          </div>
        </Match>
        <Match when={user()}>
          <div class="flex w-full">
            <div class="basis-1/5 p-4 flex flex-col gap-4">
              <span class="flex justify-between items-center">
                <h1 class="text-2xl font-bold text-stone-600 h-8">Calendar</h1>
                <span class="text-sm font-semibold text-zinc-400">cs348</span>
              </span>
              <Calendars />
            </div>
            <div class="border border-zinc-100"></div>
            <div class="py-4 px-8 flex flex-col w-full gap-4 h-full">
              <div class="flex justify-end h-8">
                <Logout
                  onLogout={refetch}
                  tooltip={`User name: ${user()?.user_name}`}
                />
              </div>
              {currentCalendarName && <Calendar />}
            </div>
          </div>
        </Match>
      </Switch>
    </main>
  );
};

export default App;
