create table if not exists public.commercants (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  boutique text not null,
  secteur text not null,
  telephone text not null,
  zone text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.operateurs (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  telephone text not null,
  role text not null,
  zone text not null,
  disponibilite text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.produits (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  prix numeric not null default 0,
  description text,
  categorie text not null default 'autre',
  telephone_commercant text not null default '',
  images text[] not null default '{}',
  statut text not null default 'pending',
  created_at timestamptz not null default now()
);

alter table public.produits
add column if not exists nom text;

alter table public.produits
add column if not exists prix numeric default 0;

alter table public.produits
alter column prix type numeric
using (
  case
    when nullif(regexp_replace(prix::text, '[^0-9,.-]', '', 'g'), '') is null then 0
    else replace(regexp_replace(prix::text, '[^0-9,.-]', '', 'g'), ',', '.')::numeric
  end
);

update public.produits
set prix = 0
where prix is null;

alter table public.produits
add column if not exists description text;

alter table public.produits
add column if not exists categorie text default 'autre';

alter table public.produits
add column if not exists telephone_commercant text default '';

alter table public.produits
add column if not exists images text[] not null default '{}';

alter table public.produits
add column if not exists statut text not null default 'pending';

alter table public.produits
add column if not exists created_at timestamptz not null default now();

alter table public.produits
drop constraint if exists produits_prix_check;

alter table public.produits
add constraint produits_prix_check check (prix >= 0);

alter table public.produits
drop constraint if exists produits_statut_check;

alter table public.produits
add constraint produits_statut_check check (statut in ('pending', 'published', 'rejected'));

update public.produits
set statut = 'published'
where statut is null;

alter table public.commercants enable row level security;
alter table public.operateurs enable row level security;
alter table public.produits enable row level security;

drop policy if exists "Public insert commercants" on public.commercants;
create policy "Public insert commercants"
on public.commercants for insert
to anon
with check (true);

drop policy if exists "Public insert operateurs" on public.operateurs;
create policy "Public insert operateurs"
on public.operateurs for insert
to anon
with check (true);

drop policy if exists "Public insert produits" on public.produits;
create policy "Public insert produits"
on public.produits for insert
to anon
with check (statut = 'pending');

drop policy if exists "Public read published produits" on public.produits;
create policy "Public read published produits"
on public.produits for select
to anon
using (statut = 'published');

insert into storage.buckets (id, name, public)
values ('produits', 'produits', true)
on conflict (id) do update set public = true;
