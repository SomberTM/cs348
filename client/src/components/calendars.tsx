import {
	Component,
	createEffect,
	createResource,
	createSignal,
	Match,
	Show,
	Switch,
} from "solid-js";
import { deleteCalendar, listCalendars } from "../api/calendars";
import clsx from "clsx";
import { Button } from "./ui/button";
import { IconButton } from "./ui/icon-button";
import { Trash } from "./icons/trash";
import { Edit } from "./icons/edit";
import { Dialog } from "./ui/dialog";
import { CalendarForm } from "./forms/calendar";
import { cn } from "../utils/cn";

export const Calendars: Component = () => {
	const [calendars] = createResource(listCalendars);
	const params = new URLSearchParams(window.location.search);
	const currentCalendarName = params.get("cid");

	const [isUpdateOpen, setIsUpdateOpen] = createSignal(false);
	const [isDeleteLoading, setIsDeleteLoading] = createSignal(false);

	createEffect(() => {
		const cals = calendars();
		if (!cals || cals.length === 0) return;
		const currentCalendar = cals.find((c) => c.id === currentCalendarName);
		if (!!currentCalendar) return;
		params.set("cid", cals[0].id);
		window.location.search = params.toString();
	});

	async function onDeleteCalendar(id: string) {
		setIsDeleteLoading(true);
		await deleteCalendar(id);
		setIsDeleteLoading(false);

		window.location.reload();
	}

	return (
		<div class="flex flex-col gap-2">
			<Switch>
				<Match when={calendars.error}>err {calendars.error.message}</Match>
				<Match when={calendars()}>
					{calendars()!.map((calendar) => (
						<div class="flex items-center gap-1">
							<Button
								class={cn(
									"grow text-start",
									currentCalendarName === calendar.id && "bg-stone-100",
								)}
								onClick={() => {
									params.set("cid", calendar.id);
									window.location.search = params.toString();
								}}
							>
								{calendar.name}
							</Button>
							<IconButton onClick={() => setIsUpdateOpen(true)}>
								<Edit width={16} height={16} />
							</IconButton>
							<Dialog
								open={isUpdateOpen}
								onClose={() => setIsUpdateOpen(false)}
								title="Update Calendar"
							>
								<CalendarForm isUpdateForm defaultValue={calendar} />
							</Dialog>
							<IconButton
								disabled={isDeleteLoading()}
								onClick={() => onDeleteCalendar(calendar.id)}
							>
								<Trash width={16} height={16} />
							</IconButton>
						</div>
					))}
				</Match>
			</Switch>
		</div>
	);
};
