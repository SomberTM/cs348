import {
	createEffect,
	createResource,
	Match,
	Show,
	Switch,
	type Component,
} from "solid-js";
import { getUser } from "./api/authentication";
import { Login } from "./components/login";
import { Logout } from "./components/logout";
import { Calendars } from "./components/calendars";
import { Calendar } from "./components/calendar";
import { format } from "date-fns";
import gsap from "gsap";
import { Flip } from "gsap/all";

gsap.registerPlugin(Flip);

const App: Component = () => {
	const [user, { refetch }] = createResource(getUser);
	const params = new URLSearchParams(window.location.search);
	const currentCalendarName = params.get("cid");
	const currentMonthYear = params.get("d");

	if (!currentMonthYear) {
		params.set("d", format(Date.now(), "yyyy-MM"));
		window.location.search = params.toString();
	}

	return (
		<main class="flex min-h-[100dvh]">
			<Show when={user.loading}>Loading user</Show>
			<Switch>
				<Match when={user.error}>
					<div class="grid w-full place-items-center">
						<Login onLogin={refetch} />
					</div>
				</Match>
				<Match when={user()}>
					<div class="flex w-full">
						<div class="flex basis-1/5 flex-col gap-4 p-4">
							<span class="flex items-center justify-between">
								<h1 class="h-8 text-2xl font-bold text-stone-600">Calendar</h1>
								<span class="text-sm font-semibold text-zinc-400">cs348</span>
							</span>
							<Calendars />
						</div>
						<div class="border border-zinc-100"></div>
						<div class="flex h-full w-full flex-col gap-4 px-8 py-4">
							<div class="flex h-8 justify-end">
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
