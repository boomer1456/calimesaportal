-- Shared p-card receipt log (unowned — whole house can view / edit / print).
create table if not exists pcard_receipts (
  id              text primary key,
  purchased_at    date,
  who             text not null default '',
  card            text not null default '',
  vendor          text not null default '',
  description     text not null default '',
  coding          text not null default '',
  amount          text not null default '',
  supervisor      text not null default '',
  receipt_image   text,
  receipt_thumb   text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists pcard_receipts_purchased_idx
  on pcard_receipts (purchased_at desc nulls last, created_at desc);
