# 📚 OpoTest — HTML Edition

App de preguntas tipo test para preparar oposiciones.  
**Sin frameworks. Sin instalaciones. Desplegable en GitHub Pages.**

---

## Puesta en marcha (3 pasos)

### 1 — Configura Supabase

1. Crea cuenta gratuita en [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Ve a **SQL Editor** y ejecuta el fichero `supabase/schema.sql`
4. Ve a **Settings → API** y copia:
   - `Project URL`
   - `anon public key`

### 2 — Edita `js/config.js`

Abre el fichero y sustituye las dos líneas marcadas:

```js
const SUPABASE_URL = 'https://TU-PROYECTO.supabase.co'
const SUPABASE_KEY = 'TU-CLAVE-ANON-PUBLICA'
```

### 3 — Despliega en GitHub Pages

1. Sube todo a un repositorio de GitHub
2. Ve a **Settings → Pages**
3. Source: `Deploy from a branch` → rama `main` → carpeta `/docs`
4. En 1-2 minutos tendrás una URL pública: `https://tu-usuario.github.io/opotest/`

---

## Primer acceso

1. Abre la URL de GitHub Pages → verás la pantalla de login
2. Pulsa **"Registrarse"** → introduce tu email y contraseña
3. Si Supabase pide confirmar email:
   - Revisa la bandeja de entrada, **o**
   - Desactiva la confirmación en Supabase → **Authentication → Settings → desactiva "Enable email confirmations"**
4. Ya dentro, nadie más puede acceder sin tu contraseña

---

## Uso

| Pantalla | Qué hace |
|---|---|
| **Importar → Excel** | Sube el `.xlsx` con `grupo \| codigo \| tema` |
| **Importar → TXT** | Sube uno o varios `.txt` con las preguntas |
| **Temas** | Listado del temario; toca un tema para iniciar test directo |
| **Test** | Elige temas + nº preguntas → test aleatorio |
| **Test activo** | Una pregunta por pantalla, feedback inmediato, explicación desplegable |
| **Resultados** | Nota, detalle por pregunta, revisión de falladas |
| **Estadísticas** | Historial por pregunta: aciertos, fallos, tasa |
| **Falladas** | Ranking de las más falladas + botón para practicarlas |

### Formato del Excel de temas

| grupo | codigo | tema |
|---|---|---|
| Constitución | C001 | La Constitución Española |
| Derecho Adm. | D001 | Ley 39/2015 |

### Formato de los TXT de preguntas

Nombre: `CODIGO_descripcion.txt` (ej: `C001_CONSTITUCION.txt`)  
Primera línea: cabecera (se ignora)  
Resto de líneas:
```
1 | Texto pregunta | Opción A | Opción B | Opción C | Opción D | A | Explicación
```

---

## Estructura de ficheros

```
docs/
├── index.html          ← Login / Registro
├── dashboard.html      ← Inicio
├── temas.html
├── importar.html
├── test.html           ← Configurar test
├── test-activo.html    ← Test en curso
├── resultados.html
├── estadisticas.html
├── falladas.html
├── css/style.css
├── js/
│   ├── config.js       ← ⚠️ EDITAR con tus credenciales
│   ├── auth.js
│   ├── layout.js
│   ├── utils.js
│   ├── hash.js
│   ├── shuffle.js
│   ├── txtParser.js
│   └── excel.js
└── supabase/
    └── schema.sql      ← Ejecutar una sola vez en Supabase
```
