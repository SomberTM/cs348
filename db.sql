-- using postgresql

drop table if exists users;
create table if not exists users (
	id uuid primary key default gen_random_uuid(),
	user_name text unique not null,
	password_hash text not null
);

drop table if exists sessions;
create table if not exists sessions (
	id uuid primary key default gen_random_uuid(),
	user_id uuid references users(id) on delete cascade,
	token text unique not null,
	expires timestamp not null
);

drop table if exists calendars;
create table if not exists calendars (
	id uuid primary key default gen_random_uuid(),
	user_id uuid references users(id) on delete cascade,
	name text not null
);
drop index ix_calendars_user_id_name;
create unique index ix_calendars_user_id_name on calendars (user_id, name);

create type recurrence_period as enum (
	'daily',
	'weekly',
	'monthly',
	'yearly'
);

drop table if exists calendar_events;
create table if not exists calendar_events (
	id uuid primary key default gen_random_uuid(),
	user_id uuid references users(id) on delete cascade,
	calendar_id uuid references calendars(id) on delete cascade,
	title text not null,
	description text,
	start_date timestamp not null,
	end_date timestamp not null,
	recurrence recurrence_period,
	recurrence_end_date timestamp
);
create index ix_calendar_events_start_date on calendar_events using btree (start_date);

DROP TABLE IF EXISTS shared_calendars;
create table if not exists shared_calendars (
	owner_id uuid references users(id) on delete cascade,
	target_id uuid references users(id) on delete cascade,
	accepted bool not null default false,
	calendar_id uuid references calendars(id) on delete cascade
);
drop index ix_unique_shared_calendars;
create unique index ix_unique_shared_calendars on shared_calendars (owner_id, target_id, calendar_id);