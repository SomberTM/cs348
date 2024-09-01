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

export interface CalendarEvent {
  id: string;
  user_id: string;
  calendar_id: string;
  title: string;
  description?: string;
  start_date: Date;
  end_date: Date;
  recurrence?: string;
  recurrence_end_date?: Date;
}

export async function listEvents(values: {
  calendarId: string;
  startDate: Date;
  endDate: Date;
}) {
  const result = await apiClient.post(
    `/calendars/${values.calendarId}/events`,
    {
      start_date: values.startDate,
      end_date: values.endDate,
    }
  );
  const response: ApiResponse<CalendarEvent[]> = result.data;

  if (response.success) return response.data;
  else throw Error(response.error);
}
