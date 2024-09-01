import { Component, createResource, Show } from "solid-js";
import {
  eachDayOfInterval,
  endOfWeek,
  format,
  getDate,
  getMonth,
  getYear,
  isSameYear,
  isToday,
  startOfWeek,
} from "date-fns";
import clsx from "clsx";
import { listEvents } from "../api/calendars";

function isDateEqual(d1: Date, d2: Date) {
  return (
    getYear(d1) === getYear(d2) &&
    getMonth(d1) === getMonth(d2) &&
    getDate(d1) === getDate(d2)
  );
}

export const Calendar: Component = () => {
  const now = Date.now();
  const start = startOfWeek(now);
  const end = endOfWeek(now);

  const week = eachDayOfInterval({
    start,
    end,
  });

  const params = new URLSearchParams(window.location.search);
  const calendarId = params.get("cid");

  const [events] = createResource(
    () => ({ calendarId: calendarId!, startDate: start, endDate: end }),
    listEvents
  );

  return (
    <div class="grid grid-cols-7 h-full shadow-lg rounded-lg shadow-zinc-200">
      {week.map((date, idx) => (
        <div
          class={clsx(
            "flex flex-col gap-2 border-t border-l border-b border-zinc-200 p-2",
            idx === week.length - 1 && "border-r",
            idx === 0 || (idx === week.length - 1 && "bg-zinc-50"),
            isToday(date) && "bg-stone-200",
            idx === 0 && "rounded-tl-lg rounded-bl-lg",
            idx === week.length - 1 && "rounded-tr-lg rounded-br-lg"
          )}
        >
          <div class="flex flex-col">
            <span class="font-bold">{format(date, "EEEE")}</span>
            <span class="text-sm text-stone-600">
              {format(date, "MMM dd, yyyy")}
            </span>
          </div>
          <Show when={events()}>
            {events()!
              .filter((event) => isDateEqual(date, event.start_date))
              .map((event) => (
                <div>{event.title}</div>
              ))}
          </Show>
        </div>
      ))}
    </div>
  );
};
