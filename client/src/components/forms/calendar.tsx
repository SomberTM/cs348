import { Component, createSignal } from "solid-js";
import { Calendar, createCalendar, updateCalendar } from "../../api/calendars";
import { createStore } from "solid-js/store";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface CalendarFormProps {
	isUpdateForm?: boolean;
	defaultValue?: Calendar;
}

export const CalendarForm: Component<CalendarFormProps> = (props) => {
	const [isLoading, setIsLoading] = createSignal(false);

	const [form, setForm] = createStore({
		name: props.defaultValue?.name ?? "",
	});

	const updateForm = (name: keyof typeof form) => (event: Event) => {
		const input = event.currentTarget as HTMLInputElement;
		setForm({
			[name]: input.value,
		});
	};

	async function onSubmit() {
		if (!form.name) return;

		setIsLoading(true);
		if (!props.isUpdateForm) {
			await createCalendar({
				name: form.name,
			});
		} else {
			await updateCalendar({ ...props.defaultValue!, name: form.name });
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
				value={form.name}
				onChange={updateForm("name")}
			>
				Name
			</Input>
			<Button type="submit" disabled={isLoading()}>
				{props.isUpdateForm ? "Update" : "Create"}
			</Button>
		</form>
	);
};
