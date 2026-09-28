-- ===============================================================
-- سكريبت إنشاء جداول قاعدة بيانات منصة خطوط المهندس للنقل الجامعي
-- انسخ هذا الكود والصقه في محرّر SQL في لوحة تحكم Supabase
-- (Supabase Dashboard -> SQL Editor -> New Query -> Run)
-- ===============================================================

-- 1. جدول الحسابات والمستخدمين (الطلاب والسائقين)
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  phone text unique not null,
  name text not null,
  email text,
  role text not null check (role in ('student', 'driver')),
  university_id text,
  area text not null default 'الزبير',
  vehicle_model text,
  vehicle_kind text check (vehicle_kind in ('sedan', 'van', 'bus')),
  total_seats integer default 4,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. جدول خطوط النقل الجامعي
create table if not exists public.transport_lines (
  id text primary key,
  driver_id uuid references public.profiles(id) on delete set null,
  driver_name text not null,
  driver_phone text not null,
  university_id text not null,
  from_area text not null,
  to_area text not null,
  morning_shift boolean default true,
  evening_shift boolean default false,
  seats_available integer not null default 3,
  total_seats integer not null default 4,
  monthly_price integer not null default 35000,
  depart_time text not null default '07:30 ص',
  return_time text not null default '02:00 م',
  vehicle_type text not null default 'صالون',
  vehicle_model text not null default 'كيا سيراتو',
  air_conditioned boolean default true,
  punctuality integer default 98,
  is_vip boolean default false,
  status text not null default 'approved' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. جدول طلبات التغطية للمناطق غير المخدومة
create table if not exists public.coverage_requests (
  id text primary key default gen_random_uuid()::text,
  student_name text not null,
  phone text not null,
  university_id text not null,
  area text not null,
  lat double precision,
  lng double precision,
  status text not null default 'pending' check (status in ('pending', 'reviewed', 'completed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. جدول المحادثات والرسائل الداخلية بين السائق والطالب
create table if not exists public.messages (
  id text primary key default gen_random_uuid()::text,
  conversation_id text not null default 'general',
  sender_id text not null,
  sender_name text not null,
  sender_role text not null check (sender_role in ('student', 'driver')),
  text text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. جدول طلبات حجز المقاعد
create table if not exists public.bookings (
  id text primary key default gen_random_uuid()::text,
  line_id text references public.transport_lines(id) on delete cascade,
  student_name text not null,
  student_phone text not null,
  pickup_lat double precision,
  pickup_lng double precision,
  status text not null default 'confirmed' check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- تفعيل ميزة التحديث اللحظي (Realtime) لجدول الرسائل والخطوط
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.transport_lines;

-- سياسات الأمان (Row Level Security - RLS)
alter table public.profiles enable row level security;
alter table public.transport_lines enable row level security;
alter table public.coverage_requests enable row level security;
alter table public.messages enable row level security;
alter table public.bookings enable row level security;

-- السماح بالقراءة والكتابة العامة للمنصة
create policy "Allow public read access on transport_lines" on public.transport_lines for select using (true);
create policy "Allow public insert on transport_lines" on public.transport_lines for insert with check (true);
create policy "Allow public update on transport_lines" on public.transport_lines for update using (true);

create policy "Allow public read access on messages" on public.messages for select using (true);
create policy "Allow public insert on messages" on public.messages for insert with check (true);

create policy "Allow public read/insert on coverage_requests" on public.coverage_requests for all using (true);
create policy "Allow public read/insert on bookings" on public.bookings for all using (true);
create policy "Allow public read/insert on profiles" on public.profiles for all using (true);
