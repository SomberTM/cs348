import {
	Component,
	ComponentProps,
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
import { CalendarEvent, listEvents } from "../api/calendars";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ChevronLeft } from "./icons/chevron-left";
import { ChevronRight } from "./icons/chevron-right";
import { IconButton } from "./ui/icon-button";
import { Home } from "./icons/home";
import { Expand } from "./icons/expand";
import gsap from "gsap";

function PlusIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
		>
			<path d="M5 12h14" />
			<path d="M12 5v14" />
		</svg>
	);
}

function isDateEqual(d1: Date, d2: Date) {
	return (
		getYear(d1) === getYear(d2) &&
		getMonth(d1) === getMonth(d2) &&
		getDate(d1) === getDate(d2)
	);
}

interface CalendarDayProps {
	date: Date;
	events: CalendarEvent[];
}

const CalendarDay: Component<ComponentProps<"div"> & CalendarDayProps> = ({
	date,
	events,
	...props
}) => {
	const [open, setOpen] = createSignal(false);

	let dialogRef: HTMLDialogElement | undefined;

	function onOpen() {
		dialogRef?.showModal();
		gsap.to(dialogRef!, {
			width: "50dvw",
			height: "50dvh",
			duration: 0.3,
		});
	}

	function onClose() {
		gsap.to(dialogRef!, {
			width: 0,
			height: 0,
			duration: 0.3,
		});
		dialogRef?.close();
	}

	return (
		<>
			<div
				{...props}
				class={clsx(
					"group relative flex flex-col gap-2 overflow-y-hidden rounded-lg border border-zinc-200 bg-white p-2 transition-all duration-300",
					props.class,
				)}
			>
				<span class="text-sm text-stone-800">{format(date, "dd")}</span>
				<div>
					{events.map((event) => (
						<div>{event.title}</div>
					))}
				</div>
				<div class="absolute bottom-1 right-1 hidden gap-1 group-hover:flex">
					<Button class="relative aspect-square w-4">
						<ChevronRight
							class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90"
							width={16}
							height={16}
						/>
					</Button>
					<Button
						class="relative aspect-square w-4"
						onClick={() => {
							setOpen(true);
							onOpen();
						}}
					>
						<Expand
							class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
							width={16}
							height={16}
						/>
					</Button>
				</div>
			</div>
			<dialog
				ref={dialogRef}
				onClose={() => onClose()}
				class="rounded-lg border border-zinc-200 p-4 shadow-lg shadow-zinc-200"
			>
				<form
					class="flex flex-col gap-2"
					onSubmit={(event) => {
						event.preventDefault();
					}}
				>
					<Input required name="name" class="px-2 py-1 text-sm">
						Name
					</Input>
					<Input>Description</Input>
					<div class="flex items-center gap-2">
						<Input type="date">Start Date</Input>
						<Input type="date">End Date</Input>
					</div>
					<Button type="submit">Create</Button>
				</form>
			</dialog>
		</>
	);
};

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

	const [events] = createResource(
		() => ({ calendarId: calendarId!, startDate: start, endDate: end }),
		listEvents,
	);

	return (
		<div class="flex h-full flex-col gap-2">
			<span class="flex items-start gap-1">
				<IconButton
					onClick={() => {
						params.set("d", format(subMonths(selectedMonthYear, 1), "yyyy-MM"));
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
						params.set("d", format(addMonths(selectedMonthYear, 1), "yyyy-MM"));
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
			<div class="relative grid h-full auto-rows-fr grid-cols-7 gap-1 rounded-lg shadow-zinc-200">
				<Show when={events()}>
					{calendarRange.map((date) => (
						<CalendarDay
							date={date}
							events={
								events()?.filter((event) =>
									isDateEqual(parseISO(event.start_date), date),
								) ?? []
							}
							class={clsx(
								(!isSameMonth(date, start) || !isSameMonth(date, end)) &&
									"bg-stone-100 opacity-50",
								isToday(date) && "bg-stone-200",
								isSameMonth(date, start) &&
									(isFirstDayOfMonth(date) || isLastDayOfMonth(date)) &&
									"bg-zinc-50",
							)}
						/>
					))}
				</Show>
			</div>
		</div>
	);
};
