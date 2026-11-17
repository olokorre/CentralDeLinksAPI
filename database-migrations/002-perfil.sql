alter table public."user" add column if not exists bio varchar not null default '';
alter table public.link add column if not exists is_public boolean not null default false;
