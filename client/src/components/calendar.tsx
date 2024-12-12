import {
	Component,
	ComponentProps,
	createEffect,
	createResource,
	createSignal,
	Show,
} from "solid-js";
import {
	addDays,
	addMonths,
	eachDayOfInterval,
	endOfDay,
	endOfMonth,
	format,
	getDate,
	getDay,
	getMonth,
	getYear,
	isFirstDayOfMonth,
	isLastDayOfMonth,
	isSameMonth,
	isToday,
	parse,
	parseISO,
	startOfDay,
	startOfMonth,
	subDays,
	subMonths,
} from "date-fns";
import clsx from "clsx";
import {
	CalendarEvent,
	deleteCalendarEvent,
	listEvents,
} from "../api/calendars";
import { Button } from "./ui/button";
import { ChevronLeft } from "./icons/chevron-left";
import { ChevronRight } from "./icons/chevron-right";
import { IconButton } from "./ui/icon-button";
import { Home } from "./icons/home";
import { Expand } from "./icons/expand";
import { CalendarEventForm } from "./forms/calendar-event";
import { Dialog } from "./ui/dialog";
import { Trash } from "./icons/trash";
import { cn } from "../utils/cn";
import { Plus } from "./icons/plus";
import { Edit } from "./icons/edit";

function isDateEqual(d1: Date, d2: Date) {
	return (
		getYear(d1) === getYear(d2) &&
		getMonth(d1) === getMonth(d2) &&
		getDate(d1) === getDate(d2)
	);
}

interface CalendarDayProps {
	calendarId: string;
	date: Date;
	events: CalendarEvent[];
}

const CalendarDay: Component<ComponentProps<"div"> & CalendarDayProps> = ({
	date,
	events,
	calendarId,
	...props
}) => {
	const [isCreateOpen, setIsCreateOpen] = createSignal(false);
	const [isUpdateOpen, setIsUpdateOpen] = createSignal(false);

	return (
		<>
			<div
				{...props}
				class={cn(
					"group relative flex flex-col gap-2 overflow-y-hidden rounded-lg border border-zinc-200 bg-white p-2 transition-all duration-300",
					props.class,
				)}
			>
				<span class="text-sm text-stone-800">{format(date, "dd")}</span>
				<div class="flex flex-col gap-2">
					{events.map((event) => (
						<div class="group/day flex min-h-8 items-center justify-between rounded-lg border py-1 pl-2 pr-1 text-sm font-semibold shadow-lg shadow-zinc-200">
							<div class="flex items-center gap-1 self-start overflow-hidden overflow-ellipsis">
								<p class="self-start overflow-ellipsis text-nowrap">
									{event.title}
								</p>

								{event.description && (
									<span class="overflow-ellipsis text-nowrap text-xs opacity-75">
										- {event.description}
									</span>
								)}
							</div>
							<span class="flex gap-1">
								<IconButton
									class="hidden w-6 px-1 py-1 group-hover/day:block"
									onClick={() => {
										setIsUpdateOpen(true);
									}}
								>
									<Edit width={12} height={12} />
								</IconButton>
								<Dialog
									open={isUpdateOpen}
									onClose={() => setIsUpdateOpen(false)}
									title="Update Event"
								>
									<CalendarEventForm
										calendarId={calendarId}
										isUpdateForm
										defaultValue={event}
									/>
								</Dialog>
								<IconButton
									class="hidden w-6 px-1 py-1 group-hover/day:block"
									onClick={async () => {
										await deleteCalendarEvent({
											calendarId,
											eventId: event.id,
										});
										window.location.reload();
									}}
								>
									<Trash width={12} height={12} />
								</IconButton>
							</span>
						</div>
					))}
				</div>
				<div class="absolute bottom-1 right-1 hidden gap-1 group-hover:flex">
					<Button
						class="relative aspect-square w-8 px-1 py-1"
						onClick={() => {
							setIsCreateOpen(true);
						}}
					>
						<Plus
							class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
							width={16}
							height={16}
						/>
					</Button>
				</div>
			</div>
			<Dialog
				open={isCreateOpen}
				onClose={() => setIsCreateOpen(false)}
				title="New Event"
			>
				<CalendarEventForm calendarId={calendarId} defaultDate={date} />
			</Dialog>
		</>
	);
};

const dayTitles = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

export const Calendar: Component = () => {
	const params = new URLSearchParams(window.location.search);
	const calendarId = params.get("cid");
	const currentMonthYear = params.get("d");
	const selectedMonthYear = parse(currentMonthYear!, "yyyy-MM", new Date());

	const now = new Date();
	const start = startOfMonth(selectedMonthYear);
	const end = endOfMonth(selectedMonthYear);

	const calendarRange = eachDayOfInterval({
		start: startOfDay(subDays(start, getDay(start))),
		end: endOfDay(addDays(end, 6 - getDay(end))),
	});

	const [open, setOpen] = createSignal(false);

	const [events] = createResource(
		() => ({
			calendarId: calendarId!,
			startDate: startOfDay(subDays(start, getDay(start))),
			endDate: endOfDay(addDays(end, 6 - getDay(end))),
		}),
		listEvents,
	);

	createEffect(() =>
		events()?.forEach((event) =>
			console.log(
				"Date: ",
				event.start_date,
				"Parse ISO: ",
				parseISO(event.start_date),
				"New Date: ",
				getDate(new Date(event.start_date)),
			),
		),
	);

	return (
		<div class="flex h-full flex-col gap-2">
			<div class="flex items-center justify-between">
				<span class="flex items-start gap-1">
					<IconButton
						onClick={() => {
							params.set(
								"d",
								format(subMonths(selectedMonthYear, 1), "yyyy-MM"),
							);
							window.location.search = params.toString();
						}}
					>
						<ChevronLeft />
					</IconButton>
					<span class="w-56 text-center text-2xl font-bold leading-7">
						{format(start, "MMMM yyyy")}
					</span>
					<IconButton
						onClick={() => {
							params.set(
								"d",
								format(addMonths(selectedMonthYear, 1), "yyyy-MM"),
							);
							window.location.search = params.toString();
						}}
					>
						<ChevronRight />
					</IconButton>
					{!isSameMonth(selectedMonthYear, now) && (
						<IconButton
							onClick={() => {
								params.set("d", format(now, "yyyy-MM"));
								window.location.search = params.toString();
							}}
						>
							<Home />
						</IconButton>
					)}
				</span>
				<div class="flex items-center gap-2 self-end justify-self-end">
					<Button onClick={() => setOpen(true)}>New Event</Button>
					<Dialog open={open} onClose={() => setOpen(false)} title="New Event">
						<CalendarEventForm calendarId={calendarId!} />
					</Dialog>
				</div>
			</div>

			<div class="grid grid-cols-7">
				{calendarRange.slice(0, 7).map((date) => (
					<span class="px-2 text-sm font-semibold text-stone-600">
						{dayTitles[getDay(date)]}
					</span>
				))}
			</div>
			<div class="grid h-full auto-rows-fr grid-cols-7 gap-1 rounded-lg shadow-zinc-200">
				<Show when={events()}>
					{calendarRange.map((date) => {
						return (
							<CalendarDay
								calendarId={calendarId!}
								date={date}
								events={
									events()?.filter((event) =>
										// jank bc parseISO converts to local, dates are saved with 00:00:00 timepart
										isDateEqual(addDays(parseISO(event.start_date), 1), date),
									) ?? []
								}
								class={cn(
									(!isSameMonth(date, start) || !isSameMonth(date, end)) &&
										"bg-stone-100 opacity-50",
									isToday(date) && "bg-stone-200",
									isSameMonth(date, start) &&
										(isFirstDayOfMonth(date) || isLastDayOfMonth(date)) &&
										"bg-zinc-50",
									"hover:scale-[1.01]",
								)}
							/>
						);
					})}
				</Show>
			</div>
		</div>
	);
};
