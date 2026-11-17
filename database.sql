create table if not exists public."user" (
    id varchar primary key,
    nick varchar not null,
    password varchar not null,
    bio varchar not null default '',
    created_at timestamp not null default now()
);

create table if not exists public.link (
    id varchar primary key,
    description varchar not null,
    url varchar not null,
    user_id varchar not null,
    is_public boolean not null default false,
    created_at timestamp not null default now()
);

create unique index if not exists link_url_idx on public.link (url, user_id);

create table if not exists public.users_data (
    id uuid primary key,
    user1_id varchar not null,
    user2_id varchar not null,
    data text not null,
    created_at timestamp not null default now()
);

alter table public."user" add column if not exists bio varchar not null default '';
alter table public.link add column if not exists is_public boolean not null default false;

create table if not exists public.follow (
    follower_id varchar not null references public."user"(id),
    followee_id varchar not null references public."user"(id),
    created_at timestamp not null default now(),
    primary key (follower_id, followee_id)
);
