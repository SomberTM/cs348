import apiClient, { ApiResponse } from "./apiClient";

export interface Calendar {
	id: string;
	user_id: string;
	name: string;
}

export async function listCalendars() {
	const result = await apiClient.get("/calendars/");
	const response: ApiResponse<Calendar[]> = result.data;

	if (response.success) return response.data;
	else throw Error(response.error);
}

export async function getCalendar(id: string) {
	if (!id) return;
	const result = await apiClient.get(`/calendars/${id}/`);
	const response: ApiResponse<Calendar> = result.data;

	if (response.success) return response.data;
	else throw Error(response.error);
}

export async function createCalendar(values: { name: string }) {
	const result = await apiClient.post(`/calendars/`, values);
	const response: ApiResponse<Calendar> = result.data;

	if (response.success) return response.data;
	else throw Error(response.error);
}

export async function updateCalendar(calendar: Calendar) {
	const result = await apiClient.put(`/calendars/${calendar.id}/`, calendar);
	const response: ApiResponse<Calendar> = result.data;

	if (response.success) return response.data;
	else throw Error(response.error);
}

export async function deleteCalendar(id: string) {
	const result = await apiClient.delete(`/calendars/${id}/`);
	const response: ApiResponse = result.data;

	if (response.success) return true;
	else throw Error(response.error);
}

export interface CalendarEvent {
	id: string;
	user_id: string;
	calendar_id: string;
	title: string;
	description?: string;
	start_date: string;
	end_date: string;
	recurrence?: string;
	recurrence_end_date?: string;
}

export async function listEvents(values: {
	calendarId: string;
	startDate: Date;
	endDate: Date;
}) {
	const result = await apiClient.post(
		`/calendars/${values.calendarId}/list-events`,
		{
			start_date: values.startDate,
			end_date: values.endDate,
		},
	);
	const response: ApiResponse<CalendarEvent[]> = result.data;

	if (response.success) return response.data;
	else throw Error(response.error);
}

export async function createCalendarEvent(values: {
	calendarId: string;
	title: string;
	description?: string;
	startDate: Date;
	endDate: Date;
}) {
	const result = await apiClient.post(
		`/calendars/${values.calendarId}/events/`,
		{
			title: values.title,
			description: values.description,
			start_date: values.startDate,
			end_date: values.endDate,
		},
	);
	const response: ApiResponse<CalendarEvent> = result.data;

	if (response.success) return response.data;
	else throw Error(response.error);
}

export async function updateCalendarEvent(event: CalendarEvent) {
	const result = await apiClient.put(
		`/calendars/${event.calendar_id}/events/${event.id}/`,
		event,
	);
	const response: ApiResponse<Calendar> = result.data;

	if (response.success) return response.data;
	else throw Error(response.error);
}

export async function deleteCalendarEvent(values: {
	calendarId: string;
	eventId: string;
}) {
	const result = await apiClient.delete(
		`/calendars/${values.calendarId}/events/${values.eventId}`,
	);

	if (result.status >= 400) throw Error(result.statusText);
}
