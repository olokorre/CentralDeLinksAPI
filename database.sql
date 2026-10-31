create table if not exists public."user" (
    id varchar primary key,
    nick varchar not null,
    password varchar not null,
    created_at timestamp not null default now()
);

create table if not exists public.link (
    id varchar primary key,
    description varchar not null,
    url varchar not null,
    user_id varchar not null,
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
