import {
	Component,
	createEffect,
	createResource,
	Match,
	Show,
	Switch,
} from "solid-js";
import { listCalendars } from "../api/calendars";
import clsx from "clsx";
import { Button } from "./ui/button";

export const Calendars: Component = () => {
	const [calendars] = createResource(listCalendars);
	const params = new URLSearchParams(window.location.search);
	const currentCalendarName = params.get("cid");

	createEffect(() => {
		if (!!currentCalendarName) return;
		const cals = calendars();
		if (!cals || cals.length === 0) return;
		params.set("cid", cals[0].id);
		window.location.search = params.toString();
	});

	return (
		<div class="flex flex-col gap-2">
			{/* <Show when={calendars.loading}>loading</Show> */}
			<Switch>
				<Match when={calendars.error}>err {calendars.error.message}</Match>
				<Match when={calendars()}>
					{calendars()!.map((calendar) => (
						<Button
							class={clsx(
								"text-start",
								currentCalendarName === calendar.id && "bg-stone-100",
							)}
							onClick={() => {
								params.set("cid", calendar.id);
								window.location.search = params.toString();
							}}
						>
							{calendar.name}
						</Button>
					))}
				</Match>
			</Switch>
		</div>
	);
};
