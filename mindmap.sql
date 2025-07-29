-- Supabase SQL for mindmap_nodes table and policies
create table if not exists mindmap_nodes (
  id text primary key,
  label text not null,
  parentId text references mindmap_nodes(id) on delete cascade
);

-- Enable row-level security
alter table mindmap_nodes enable row level security;

-- Policy: Allow authenticated users to select, insert, update, delete their own nodes
create policy "Allow all access to mindmap_nodes (development)" on mindmap_nodes
  for all
  using (true);
