-- TimsValorant : profils privés liés aux comptes Supabase Auth
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null check (char_length(username) between 3 and 20),
  favorite_map text not null,
  favorite_agent text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists profiles_username_lower_unique
  on public.profiles (lower(username));

alter table public.profiles enable row level security;

drop policy if exists "Players can read their own profile" on public.profiles;
create policy "Players can read their own profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "Players can update their own profile" on public.profiles;
create policy "Players can update their own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

grant select, update on public.profiles to authenticated;
revoke all on public.profiles from anon;

create or replace function public.create_timsvalorant_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  profile_username text;
begin
  profile_username := left(btrim(coalesce(new.raw_user_meta_data ->> 'username', 'Joueur')), 20);
  if char_length(profile_username) < 3 then
    profile_username := 'Joueur_' || left(new.id::text, 8);
  end if;

  insert into public.profiles (id, username, favorite_map, favorite_agent)
  values (
    new.id,
    profile_username,
    coalesce(nullif(new.raw_user_meta_data ->> 'favorite_map', ''), 'Ascent'),
    coalesce(nullif(new.raw_user_meta_data ->> 'favorite_agent', ''), 'Jett')
  );
  return new;
end;
$$;

revoke all on function public.create_timsvalorant_profile() from public;

drop trigger if exists on_auth_user_created_timsvalorant on auth.users;
create trigger on_auth_user_created_timsvalorant
  after insert on auth.users
  for each row execute procedure public.create_timsvalorant_profile();


-- Photos de profil : bucket public avec écriture limitée au dossier de chaque joueur
alter table public.profiles add column if not exists avatar_url text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update
set public = true, file_size_limit = 5242880, allowed_mime_types = array['image/jpeg','image/png','image/webp'];

drop policy if exists "Avatar images are publicly readable" on storage.objects;
create policy "Avatar images are publicly readable"
on storage.objects for select
to public
using (bucket_id = 'avatars');

drop policy if exists "Players can upload their own avatar" on storage.objects;
create policy "Players can upload their own avatar"
on storage.objects for insert
to authenticated
with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists "Players can update their own avatar" on storage.objects;
create policy "Players can update their own avatar"
on storage.objects for update
to authenticated
using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text)
with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists "Players can delete their own avatar" on storage.objects;
create policy "Players can delete their own avatar"
on storage.objects for delete
to authenticated
using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
