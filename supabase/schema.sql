-- =====================================================
-- OPOTEST — Schema con autenticación (uso personal)
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- =====================================================

create extension if not exists "pgcrypto";

-- ── Tablas ────────────────────────────────────────────

create table if not exists public.temas (
  id         uuid primary key default gen_random_uuid(),
  grupo      text not null,
  codigo     text not null unique,
  tema       text not null,
  created_at timestamptz default now()
);

create table if not exists public.preguntas (
  id                 uuid primary key default gen_random_uuid(),
  tema_id            uuid references public.temas(id) on delete cascade,
  codigo_tema        text not null,
  pregunta           text not null,
  opcion_a           text not null,
  opcion_b           text not null,
  opcion_c           text not null,
  opcion_d           text not null,
  respuesta_correcta char(1) not null check (respuesta_correcta in ('a','b','c','d')),
  explicacion        text,
  hash_unico         text not null unique,
  activa             boolean default true,
  eliminada          boolean default false,
  created_at         timestamptz default now()
);

create table if not exists public.intentos_test (
  id            uuid primary key default gen_random_uuid(),
  fecha         timestamptz default now(),
  temas_ids     uuid[] default '{}',
  total_validas int default 0,
  aciertos      int default 0,
  errores       int default 0,
  eliminadas    int default 0,
  porcentaje    numeric(5,2) default 0,
  completado    boolean default false,
  created_at    timestamptz default now()
);

create table if not exists public.respuestas_usuario (
  id               uuid primary key default gen_random_uuid(),
  intento_test_id  uuid not null references public.intentos_test(id) on delete cascade,
  pregunta_id      uuid not null references public.preguntas(id) on delete cascade,
  respuesta        char(1) check (respuesta in ('a','b','c','d')),
  correcta         boolean,
  eliminada        boolean default false,
  created_at       timestamptz default now()
);

-- ── Índices ───────────────────────────────────────────

create index if not exists idx_temas_grupo         on public.temas (grupo);
create index if not exists idx_preguntas_tema_id   on public.preguntas (tema_id);
create index if not exists idx_preguntas_activa    on public.preguntas (activa);
create index if not exists idx_preguntas_eliminada on public.preguntas (eliminada);
create index if not exists idx_intentos_fecha      on public.intentos_test (fecha desc);
create index if not exists idx_respuestas_intento  on public.respuestas_usuario (intento_test_id);
create index if not exists idx_respuestas_pregunta on public.respuestas_usuario (pregunta_id);

-- ── Vista de estadísticas ─────────────────────────────

create or replace view public.estadisticas_preguntas as
select
  p.id                                                          as pregunta_id,
  p.pregunta,
  p.codigo_tema,
  p.respuesta_correcta,
  t.tema,
  t.grupo,
  count(r.id)                                                   as veces_mostrada,
  count(r.id) filter (where r.correcta = true)                  as aciertos,
  count(r.id) filter (where r.correcta = false and not r.eliminada) as fallos,
  count(r.id) filter (where r.eliminada = true)                 as eliminaciones,
  case
    when count(r.id) filter (where not r.eliminada) = 0 then 0
    else round(
      count(r.id) filter (where r.correcta = true)::numeric
      / nullif(count(r.id) filter (where not r.eliminada), 0) * 100, 1)
  end                                                           as tasa_acierto
from public.preguntas p
left join public.temas t              on t.id = p.tema_id
left join public.respuestas_usuario r on r.pregunta_id = p.id
where p.activa = true
group by p.id, p.pregunta, p.codigo_tema, p.respuesta_correcta, t.tema, t.grupo;

-- ── Row Level Security ────────────────────────────────
-- Solo usuarios autenticados pueden acceder.
-- Como la app es de uso personal (un solo usuario),
-- basta con verificar que hay sesión activa.

alter table public.temas              enable row level security;
alter table public.preguntas          enable row level security;
alter table public.intentos_test      enable row level security;
alter table public.respuestas_usuario enable row level security;

-- Eliminar políticas anteriores si existían
drop policy if exists "Acceso público temas"      on public.temas;
drop policy if exists "Acceso público preguntas"  on public.preguntas;
drop policy if exists "Acceso público intentos"   on public.intentos_test;
drop policy if exists "Acceso público respuestas" on public.respuestas_usuario;

-- Nuevas políticas: solo usuarios con sesión activa
create policy "Solo auth — temas"
  on public.temas for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

create policy "Solo auth — preguntas"
  on public.preguntas for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

create policy "Solo auth — intentos"
  on public.intentos_test for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

create policy "Solo auth — respuestas"
  on public.respuestas_usuario for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

-- ── Confirmación de email (opcional) ─────────────────
-- Si no quieres confirmar email al registrarte, ve a:
-- Supabase Dashboard → Authentication → Settings
-- → desactiva "Enable email confirmations"
