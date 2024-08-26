import {
  createResource,
  createSignal,
  Match,
  Show,
  Switch,
  type Component,
} from "solid-js";
import { getUser, login, logout } from "./api/authentication";

const App: Component = () => {
  const [user, { refetch }] = createResource(getUser);

  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");

  return (
    <main class="flex min-h-[100dvh]">
      <Show when={user.loading}>Loading user</Show>
      <Switch>
        <Match when={user.error}>
          <div class="w-full grid place-items-center">
            <form
              class="border p-4 rounded-lg flex flex-col gap-2 shadow-sm shadow-zinc-200 w-1/5"
              onSubmit={async (event) => {
                event.preventDefault();
                await login(username(), password());
                refetch();
              }}
            >
              <span class="flex flex-col">
                <label class="text-stone-400 lowercase text-sm font-semibold">
                  Username
                </label>
                <input
                  required
                  name="username"
                  value={username()}
                  onChange={(event) => setUsername(event.target.value)}
                  class="border-zinc-200 border rounded-md focus-visible:border-zinc-400 outline-none px-3 py-2 text-zinc-700"
                />
              </span>
              <span class="flex flex-col">
                <label class="text-stone-400 lowercase text-sm font-semibold">
                  Password
                </label>
                <input
                  required
                  name="password"
                  type="password"
                  value={password()}
                  onChange={(event) => setPassword(event.target.value)}
                  class="border-zinc-200 border rounded-md focus-visible:border-zinc-400 outline-none px-3 py-2 text-sm text-zinc-700"
                />
              </span>
              <button type="submit">Login</button>
            </form>
          </div>
        </Match>
        <Match when={user()}>
          <div class="flex w-full">
            <div class="basis-1/5 p-4 flex flex-col gap-4">
              <h1 class="text-2xl font-bold text-stone-600">Calendar</h1>
            </div>
            <div class="border border-zinc-100"></div>
            <div class="py-4 px-8 flex flex-col w-full gap-8">
              <div class="flex justify-end">
                <button
                  onClick={async () => {
                    await logout();
                    refetch();
                  }}
                >
                  Logout
                </button>
              </div>
              <div></div>
            </div>
          </div>
        </Match>
      </Switch>
    </main>
  );
};

export default App;
