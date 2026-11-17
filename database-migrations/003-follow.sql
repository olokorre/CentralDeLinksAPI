create table if not exists public.follow (
    follower_id varchar not null references public."user"(id),
    followee_id varchar not null references public."user"(id),
    created_at timestamp not null default now(),
    primary key (follower_id, followee_id)
);
