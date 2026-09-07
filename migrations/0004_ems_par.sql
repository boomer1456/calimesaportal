-- Shared station PAR. On-hand is house-visible; min_qty is an admin override.
create table if not exists ems_par_counts (
  item_id    text primary key,
  qty        int not null,
  min_qty    int,
  updated_at timestamptz not null default now()
);
