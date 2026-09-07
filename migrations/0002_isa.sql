-- Shared Crafton ISA house log (unowned — whole company reads/writes hours).
create table if not exists isa_roster (
  id          text primary key,
  first_name  text not null,
  last_name   text not null,
  student_id  text not null,
  shift       text,
  active      boolean not null default true
);

create table if not exists isa_entries (
  id              text primary key,
  batch_id        text not null,
  event_id        text,
  firefighter_id  text not null references isa_roster(id),
  work_date       date not null,
  start_time      text not null,
  hours           double precision not null,
  assignment_id   text not null,
  description     text not null,
  ior_present     boolean not null default true,
  created_at      timestamptz not null default now()
);

create index if not exists isa_entries_ff_date_idx on isa_entries (firefighter_id, work_date);
create index if not exists isa_entries_batch_idx on isa_entries (batch_id);

create table if not exists isa_meta (
  id                    text primary key,
  college               text not null,
  agency                text not null,
  course                text not null,
  syn                   text not null,
  instructor            text not null,
  term                  text not null,
  reimbursement_status  text not null
);
