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
import { Flip } from "gsap/all";

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

	const key = format(date, "yyyy-MM-dd");
	let dialogRef: HTMLDialogElement | undefined;
	let contentRef: HTMLDivElement | undefined;
	let state: Flip.FlipState;

	return (
		<>
			{/* {open() && <div class="w-full"></div>} */}
			<div
				{...props}
				class={clsx(
					"group relative flex flex-col gap-2 rounded-lg border border-zinc-200 bg-white p-2 transition-all duration-300",
					open() && "z-10",
					props.class,
				)}
				ref={contentRef}
			>
				<span class="text-sm text-stone-800">{format(date, "dd")}</span>
				<div>
					{events.map((event) => (
						<div>{event.title}</div>
					))}
				</div>
				{/* <Show when={events()}>
              {events()!
                .filter((event) => isDateEqual(date, event.start_date))
                .map((event) => (
                  <div>{event.title}</div>
                ))}
            </Show> */}
				<Button
					class="absolute bottom-1 right-1 hidden aspect-square w-4 bg-white p-0 group-hover:grid"
					onClick={(event) => {
						console.log(contentRef);
						if (!contentRef || !dialogRef) return;
						if (!open()) {
							state = Flip.getState(contentRef);
							dialogRef.showModal();
							Flip.fit(contentRef, dialogRef, {
								duration: 0.3,
								absolute: true,
							});
						} else {
							dialogRef.close();
							Flip.fit(contentRef, state, {
								absolute: false,
							});
						}

						setOpen((prev) => !prev);
					}}
				>
					<Expand
						class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
						width={20}
						height={20}
					/>
				</Button>
				{/* <dialog
					open={open()}
					class="absolute right-0 top-0 z-10 m-0 ml-auto block w-0 translate-x-[calc(100%+0.5rem)] overflow-x-clip rounded-lg border p-2 opacity-0 shadow-lg shadow-zinc-300 transition-all duration-200 open:h-fit open:w-64 open:opacity-100"
					ref={dialogRef}
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
						<Input type="date">Start Date</Input>
						<Input type="date">End Date</Input>
						<Button type="submit">Create</Button>
						</form>
						</dialog> */}
			</div>
			<dialog ref={dialogRef} class="h-[50dvh] w-[50dvw]"></dialog>
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
			<div class="relative grid h-full grid-cols-7 gap-1 rounded-lg shadow-zinc-200">
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
