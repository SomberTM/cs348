import {
	createEffect,
	createResource,
	createSignal,
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
import { Button } from "./components/ui/button";
import { Dialog } from "./components/ui/dialog";
import { getCalendar } from "./api/calendars";
import { CalendarForm } from "./components/forms/calendar";

gsap.registerPlugin(Flip);

const App: Component = () => {
	const [user, { refetch }] = createResource(getUser);
	const params = new URLSearchParams(window.location.search);
	const currentCalendarId = params.get("cid");
	const currentMonthYear = params.get("d");

	const [open, setOpen] = createSignal(false);

	if (!currentMonthYear) {
		params.set("d", format(Date.now(), "yyyy-MM"));
		window.location.search = params.toString();
	}

	const [calendar, { refetch: refetchCalendar }] = createResource(
		() => currentCalendarId,
		getCalendar,
	);

	if (!calendar && currentCalendarId) refetchCalendar();

	return (
		<main class="flex min-h-[100dvh]">
			<Show when={user.loading}>Loading user</Show>
			<Switch>
				<Match when={user.error}>
					<div class="grid w-full place-items-center">
						<Login onLogin={() => window.location.reload()} />
					</div>
				</Match>
				<Match when={user()}>
					<div class="flex w-full">
						<div class="relative flex basis-1/5 flex-col gap-4 p-4">
							<span class="flex items-center justify-between">
								<h1 class="h-8 text-2xl font-bold text-stone-600">Calendar</h1>
								<span class="text-sm font-semibold text-zinc-400">cs348</span>
							</span>
							<Calendars />
							<Button class="absolute bottom-4" onClick={() => setOpen(true)}>
								New Calendar
							</Button>
							<Dialog
								open={open}
								onClose={() => setOpen(false)}
								title="New Calendar"
							>
								<CalendarForm />
							</Dialog>
						</div>
						<div class="border border-zinc-100"></div>
						<div class="flex h-full w-full flex-col gap-4 px-8 py-4">
							<div class="flex items-center justify-between">
								<h1 class="px-2 text-3xl font-bold text-stone-600">
									{calendar()?.name}
								</h1>
								<div class="flex h-8 justify-end">
									<Logout
										onLogout={refetch}
										tooltip={`User name: ${user()?.user_name}`}
									/>
								</div>
							</div>

							{currentCalendarId && <Calendar />}
						</div>
					</div>
				</Match>
			</Switch>
		</main>
	);
};

export default App;
