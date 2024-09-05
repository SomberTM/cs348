import {
	Component,
	ComponentProps,
	createResource,
	createSignal,
	Show,
} from "solid-js";
import {
	eachDayOfInterval,
	endOfMonth,
	endOfWeek,
	format,
	getDate,
	getMonth,
	getYear,
	isSameYear,
	isToday,
	startOfMonth,
	startOfWeek,
} from "date-fns";
import clsx from "clsx";
import { CalendarEvent, listEvents } from "../api/calendars";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

function PlusIcon() {
	return (
		<svg
			viewBox="0 0 24 24"
			width={20}
			height={20}
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
		>
			<g id="SVGRepo_bgCarrier" stroke-width="0"></g>
			<g
				id="SVGRepo_tracerCarrier"
				stroke-linecap="round"
				stroke-linejoin="round"
			></g>
			<g id="SVGRepo_iconCarrier">
				<path
					d="M4 12H20M12 4V20"
					stroke="#000000"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				></path>
			</g>
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
	...props
}) => {
	const [open, setOpen] = createSignal(false);

	return (
		<div
			{...props}
			class={clsx(
				"group relative flex flex-col gap-2 rounded-lg border border-zinc-200 p-2",
				props.class,
			)}
		>
			<span class="text-sm text-stone-800">{format(date, "dd")}</span>
			{/* <Show when={events()}>
              {events()!
                .filter((event) => isDateEqual(date, event.start_date))
                .map((event) => (
                  <div>{event.title}</div>
                ))}
            </Show> */}
			<Button
				class="absolute bottom-1 right-1 hidden aspect-square w-4 bg-white p-0 group-hover:grid"
				onClick={() => setOpen((prev) => !prev)}
			>
				<PlusIcon />
			</Button>
			<dialog
				open={open()}
				class="absolute right-0 top-1 z-10 m-0 ml-auto block h-0 max-h-min w-0 translate-x-[calc(100%+0.5rem)] overflow-x-clip rounded-lg border p-2 opacity-0 shadow-lg shadow-zinc-300 transition-all duration-200 open:h-fit open:w-64 open:opacity-100"
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
			</dialog>
		</div>
	);
};

export const Calendar: Component = () => {
	const now = Date.now();
	const start = startOfMonth(now);
	const end = endOfMonth(now);

	const calendarRange = eachDayOfInterval({
		start,
		end,
	});

	const params = new URLSearchParams(window.location.search);
	const calendarId = params.get("cid");

	const [events] = createResource(
		() => ({ calendarId: calendarId!, startDate: start, endDate: end }),
		listEvents,
	);

	return (
		<div class="flex h-full flex-col gap-2">
			<span class="text-2xl font-bold">{format(start, "MMMM yyyy")}</span>
			<div class="grid h-full grid-cols-7 gap-1 rounded-lg shadow-zinc-200">
				{calendarRange.map((date, idx) => (
					<CalendarDay
						date={date}
						events={
							events()?.filter((event) =>
								isDateEqual(event.start_date, date),
							) ?? []
						}
						class={clsx(
							isToday(date) && "bg-stone-200",
							idx === 0 && "bg-zinc-50",
							idx === calendarRange.length - 1 && "bg-zinc-50",
						)}
					/>
				))}
			</div>
		</div>
	);
};
