import { addDays, format } from "date-fns";
import { Component, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
	CalendarEvent,
	createCalendarEvent,
	updateCalendarEvent,
} from "../../api/calendars";

interface CalendarEventFormProps {
	calendarId: string;
	defaultDate?: Date;
	isUpdateForm?: boolean;
	defaultValue?: CalendarEvent;
}

export const CalendarEventForm: Component<CalendarEventFormProps> = (props) => {
	const [isLoading, setIsLoading] = createSignal(false);

	const [form, setForm] = createStore({
		title: props.defaultValue?.title ?? "",
		description: props.defaultValue?.description ?? undefined,
		startDate: format(
			props.defaultValue?.start_date ?? props.defaultDate ?? new Date(),
			"yyyy-MM-dd",
		),
		endDate: format(
			props.defaultValue?.end_date ?? props.defaultDate ?? new Date(),
			"yyyy-MM-dd",
		),
	});

	const updateForm = (name: keyof typeof form) => (event: Event) => {
		const input = event.currentTarget as HTMLInputElement;
		setForm({
			[name]: input.value,
		});
	};

	async function onSubmit() {
		if (!form.startDate || !form.endDate) return;

		setIsLoading(true);
		if (!props.isUpdateForm) {
			await createCalendarEvent({
				calendarId: props.calendarId,
				title: form.title,
				description: form.description,
				startDate: new Date(form.startDate),
				endDate: new Date(form.endDate),
			});
		} else {
			await updateCalendarEvent({
				...props.defaultValue!,
				title: form.title,
				description: form.description,
				start_date: new Date(form.startDate).toISOString(),
				end_date: new Date(form.endDate).toISOString(),
			});
		}
		setIsLoading(false);

		window.location.reload();
	}

	return (
		<form
			class="flex flex-col gap-2"
			onSubmit={(event) => {
				event.preventDefault();
				onSubmit();
			}}
		>
			<Input
				required
				name="name"
				class="px-2 py-1 text-sm"
				value={form.title}
				onChange={updateForm("title")}
			>
				Title
			</Input>
			<Input value={form.description} onChange={updateForm("description")}>
				Description
			</Input>
			<div class="flex items-center gap-2">
				<Input
					required
					type="date"
					value={form.startDate}
					onChange={updateForm("startDate")}
				>
					Start Date
				</Input>
				<Input
					required
					type="date"
					value={form.endDate}
					onChange={updateForm("endDate")}
				>
					End Date
				</Input>
			</div>
			<Button type="submit" disabled={isLoading()}>
				{props.isUpdateForm ? "Update" : "Create"}
			</Button>
		</form>
	);
};
