import { Component, createSignal } from "solid-js";
import { login } from "../api/authentication";

interface LoginProps {
  onLogin?(): void;
}

export const Login: Component<LoginProps> = (props) => {
  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");

  return (
    <form
      class="border p-4 rounded-lg flex flex-col gap-2 shadow-sm shadow-zinc-200 w-1/5"
      onSubmit={async (event) => {
        event.preventDefault();
        const success = await login(username(), password());
        if (success) props.onLogin?.();
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
  );
};
