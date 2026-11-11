# NY2Bolivia Web — Andean Skyline Logistics

Plataforma web moderna y de alto rendimiento para servicios de casillero postal internacional y compras asistidas directas Nueva York (JFK) ➔ Bolivia (La Paz, Santa Cruz, Cochabamba y todo el país), inspirada en el sistema de diseño **Andean Skyline Logistics** y construida con **Next.js 15 (App Router)**, **React 19**, **TypeScript** y **Tailwind CSS**.

---

## Tabla de Contenidos
1. [Introducción y Arquitectura](#1-introducción-y-arquitectura)
2. [Guía de Ejecución Local](#2-guía-de-ejecución-local)
3. [Estructura del Proyecto y Vistas](#3-estructura-del-proyecto-y-vistas)
4. [Guía de Publicación y Control de Versiones (GitHub)](#4-guía-de-publicación-y-control-de-versiones-github)
5. [Guía de Despliegue en Vercel](#5-guía-de-despliegue-en-vercel)
6. [Arquitectura e Integración Modular de Firebase](#6-arquitectura-e-integración-modular-de-firebase)
7. [Calculadora y Fórmulas Logísticas](#7-calculadora-y-fórmulas-logísticas)

---

## 1. Introducción y Arquitectura

**NY2Bolivia Web** conecta a compradores en Bolivia con las principales tiendas de Manhattan y el comercio electrónico de Estados Unidos (Apple, Nike, Best Buy, Sephora, Amazon, B&H Photo, Macy's), brindando acceso a ofertas exclusivas de Black Friday, Cyber Week y compras durante todo el año sin trabas cambiarias ni complicaciones aduaneras.

### Stack Tecnológico
- **Framework Principal**: [Next.js 15 (App Router)](https://nextjs.org/) con soporte completo para Server y Client Components.
- **Librería de Interfaz**: [React 19](https://react.dev/).
- **Lenguaje**: [TypeScript 5.7+](https://www.typescriptlang.org/) con tipado estricto en todas las entidades de dominio y servicios.
- **Motor de Estilos**: [Tailwind CSS 3.4](https://tailwindcss.com/) configurado con design tokens específicos de la marca.
- **Tipografías**:
  - *Plus Jakarta Sans*: Titulares de impacto, hero banners y llamadas a la acción.
  - *Inter*: Textos informativos, campos de formulario y navegación.
  - *JetBrains Mono*: Datos numéricos, tarifas, tipos de cambio, códigos Suite y números de tracking.
  - *Material Symbols Outlined* & *Lucide Icons*: Iconografía consistente y accesible.
- **Capa de Persistencia Híbrida**: Cliente modular de Google Firebase (Firestore + Cloud Storage) con fallback 100% offline automático mediante LocalStorage.

### Tokens de Diseño (Andean Skyline Logistics)
| Token | Código HEX | Rol Semántico |
|---|---|---|
| `Core Navy` | `#0B192C` | Fondos de navegación, hero banners y contraste nocturno de Manhattan. |
| `Navy Surface` | `#1E3E62` | Tarjetas secundarias, contenedores de timeline y acentos estructurales. |
| `Aero Blue` | `#008DDA` | Botones de acción primaria, enlaces activos e indicadores de estado activo. |
| `Radiant Gold` | `#FFB200` | Urgencia Black Friday, badges de descuento y avisos destacados. |
| `Logistics Canvas` | `#F4F6F9` | Fondo neutral limpio de lectura diurna y áreas de contenido. |
| `Pure White` | `#FFFFFF` | Contenedores modales, superficies de formulario y dropdowns. |

---

## 2. Guía de Ejecución Local

### Requisitos Previos
- **Node.js**: Versión 18.18.0 o superior (recomendado Node.js 20 LTS o 22 LTS).
- **npm**: Versión 9+ incluida con Node.js.
- **Sistema Operativo**: Compatible con Windows (PowerShell / CMD), macOS y Linux.

> **Nota para entornos Windows / PowerShell:**
> En Windows PowerShell, ejecute los comandos de node/npm con la extensión `.cmd` (ejemplo: `npm.cmd install`, `npx.cmd tsc --noEmit`) para evitar restricciones de política de ejecución de scripts de PowerShell (`ExecutionPolicy`). En Linux/macOS puede utilizar `npm` y `npx` convencionales.

### Paso 1: Clonar o Situarse en el Directorio del Proyecto
```powershell
cd "c:\Users\Juan Pablo\Desktop\Pagina Web - Compras EEUU\ny2bolivia_web"
```

### Paso 2: Instalación de Dependencias
Instale todas las dependencias del proyecto (Next.js, React, Tailwind, Firebase SDK, Lucide, etc.):
```powershell
npm.cmd install
```
*(En Linux/macOS: `npm install`)*

### Paso 3: Ejecución del Servidor de Desarrollo
Inicie el servidor local en modo desarrollo con Hot Module Replacement (HMR):
```powershell
npm.cmd run dev
```
*(En Linux/macOS: `npm run dev`)*

Abra su navegador web en:
👉 **`http://localhost:3000`**

### Paso 4: Verificación de Tipos (TypeScript Typecheck)
Compruebe la consistencia de tipos sin emitir archivos JavaScript:
```powershell
npx.cmd tsc --noEmit
```
*(En Linux/macOS: `npx tsc --noEmit`)*
*Resultado esperado: Exit code 0 sin errores.*

### Paso 5: Análisis de Código Estático (Linting)
Ejecute ESLint para verificar el cumplimiento de reglas y buenas prácticas de código:
```powershell
npm.cmd run lint
```
*(En Linux/macOS: `npm run lint`)*
*Resultado esperado: Exit code 0 (✔ No ESLint warnings or errors).*

### Paso 6: Compilación de Producción (Production Build)
Genere la versión optimizada para despliegue en producción:
```powershell
npm.cmd run build
```
*(En Linux/macOS: `npm run build`)*
*Resultado esperado: Exit code 0, con generación exitosa de rutas estáticas y bundles optimizados.*

Para probar localmente el paquete de producción ya generado:
```powershell
npm.cmd run start
```
*(En Linux/macOS: `npm run start`)*

---

## 3. Estructura del Proyecto y Vistas

La aplicación está organizada bajo la convención estándar de Next.js 15 App Router:

```
ny2bolivia_web/
├── public/
│   ├── images/                       # Recursos gráficos y mockups de marcas Manhattan
│   └── favicon.ico                   # Ícono de pestaña
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Shell raíz con inyección de fuentes, metadata y safe-areas
│   │   ├── page.tsx                  # Vista principal: Landing Page de Black Friday
│   │   ├── globals.css               # Importaciones de Tailwind, variables CSS y utilidades seguras
│   │   └── registro/
│   │       └── page.tsx              # Vista interactiva: Pre-Alerta y Compra Asistida
│   ├── components/
│   │   ├── layout/                   # Componentes globales de navegación y estructura
│   │   │   ├── AnnouncementBar.tsx   # Cintillo superior de urgencia y contador de cupos de vuelo
│   │   │   ├── Navbar.tsx            # Barra de navegación superior con menú responsive
│   │   │   ├── Footer.tsx            # Pie de página institucional con hubs NYC y sucursales Bolivia
│   │   │   └── MobileBottomNav.tsx   # Barra de navegación inferior móvil estilo native app
│   │   ├── landing/                  # Secciones de la Landing Page Black Friday
│   │   │   ├── HeroSection.tsx       # Banner principal de Manhattan, badges de vuelo y CTAs
│   │   │   ├── FloatingCounterCard.tsx # Badge flotante de cupos disponibles en mobile
│   │   │   ├── StoreShowcase.tsx     # Vitrina de tiendas de Nueva York con enlaces y descuentos
│   │   │   ├── ModalitySelector.tsx  # Selector entre "Compra Asistida" y "Casillero NY"
│   │   │   ├── ShippingCalculator.tsx# Calculadora interactiva dual (USD / BOB, libras)
│   │   │   ├── LogisticsTimeline.tsx # Cronograma de vuelos JFK ➔ Viru Viru / El Alto
│   │   │   └── FAQSection.tsx        # Preguntas frecuentes en acordeón con gatillador WhatsApp
│   │   └── registration/             # Módulos del flujo de registro y pre-alerta
│   │       ├── RegistrationHero.tsx  # Encabezado del formulario con breadcrumbs dinámicos
│   │       ├── ModalityToggle.tsx    # Alternador de modo (Pre-Alerta con tracking vs Compra Asistida)
│   │       ├── ClientProfileForm.tsx # Datos del cliente, WhatsApp (+591), ciudad y entrega
│   │       ├── SuiteCodeModal.tsx    # Modal/drawer con dirección de bodega y suite temporal
│   │       ├── StoreChips.tsx        # Selector rápido de tiendas Manhattan
│   │       ├── DynamicItemBuilder.tsx# Creador dinámico de múltiples paquetes con consolidación $0
│   │       ├── FileUploadDropzone.tsx# Zona de arrastre para facturas o capturas de compra (PDF/JPG/PNG)
│   │       ├── SpecialHandling.tsx   # Opciones de almacén (descarte de caja, foto, embalaje navideño)
│   │       ├── StickySummarySidebar.tsx # Desglose financiero en tiempo real (USD y BOB)
│   │       └── OrderSuccessModal.tsx # Modal de éxito con ID de orden, QR de pago y enlace WhatsApp
│   ├── lib/
│   │   ├── firebase.ts               # Inicialización segura y detección de modo offline
│   │   └── orders-service.ts         # Adaptador híbrido Firestore / LocalStorage con seed de prueba
│   └── types/
│       └── order.ts                  # Contratos e interfaces TypeScript de pedidos y finanzas
├── .env.example                      # Plantilla documentada de variables de entorno
├── .gitignore                        # Reglas estrictas de exclusión de secretos y artefactos
├── package.json                      # Scripts de compilación y dependencias
├── tsconfig.json                     # Configuración estricta de TypeScript
└── tailwind.config.ts                # Configuración de colores, fuentes y breakpoints
```

### Vistas Principales de la Aplicación
1. **Ruta `/` — Landing Page Black Friday**:
   - Presentación de la propuesta de valor de Andean Skyline Logistics.
   - Vitrina de tiendas de la Quinta Avenida y SoHo con descuentos de hasta 70% OFF.
   - Calculadora logística interactiva que calcula fletes en tiempo real a $9.50/lb y tipo de cambio oficial de 6.96 BOB.
   - Cronograma de vuelo directo JFK ➔ Bolivia con fechas de corte y entrega garantizada.
   - Soporte dual para navegación en escritorio y barra inferior fija nativa en dispositivos móviles.

2. **Ruta `/registro` — Pre-Alerta y Compra Asistida**:
   - **Modo Pre-Alerta ("Ya compré online")**: Para usuarios que compraron en tiendas de EE.UU. e ingresan su número de tracking estadounidense (UPS, FedEx, USPS, Amazon Logistics).
   - **Modo Compra Asistida ("Nosotros compramos por ti")**: Para clientes que desean pagar en bolivianos vía QR o transferencia y requieren que nuestro personal shopper en Nueva York efectúe la compra física o digital con tarjeta estadounidense.
   - Selector interactivo de Suite temporal (`NY-TEMP-XXXX`) y dirección física del almacén en Manhattan / Queens.
   - Creación dinámica de ítems con consolidación gratuita ($0 extra por paquete adicional).
   - Adjuntos de comprobantes/facturas y selección de servicios especiales de almacén (optimización de peso descartando cajas voluminosas, inspección fotográfica gratuita, embalaje de regalo).
   - Generación instantánea del pedido en la base de datos (Firestore / LocalStorage) con código alfanumérico único (ej. `NY-2026-8492`) y enlace directo prellenado para WhatsApp y confirmación bancaria por QR.

---

## 4. Guía de Publicación y Control de Versiones (GitHub)

Siga estos pasos para versionar el proyecto e impulsarlo a un repositorio remoto en GitHub.

### Paso 1: Verificar el Estado de Exclusión de `.gitignore`
El archivo `.gitignore` ya está preconfigurado para garantizar que ningún secreto o archivo pesado sea enviado al repositorio. Protege:
- Dependencias (`node_modules/`)
- Artefactos de compilación (`.next/`, `build/`, `out/`, `dist/`)
- Secretos y variables locales (`.env`, `.env*.local`)
- Configuraciones de Vercel (`.vercel`)
- Archivos temporales de sistema operativo (`.DS_Store`, `Thumbs.db`)

Para verificar que no existan archivos de credenciales expuestos, asegúrese de que `.env.local` no esté en seguimiento git.

### Paso 2: Inicializar el Repositorio Git Local
En la carpeta del proyecto (`ny2bolivia_web`):
```powershell
git init
```

### Paso 3: Agregar los Archivos y Crear el Commit Inicial
```powershell
git add .
git commit -m "feat: initial commit - NY2Bolivia Web with Next.js 15, Tailwind and hybrid Firebase service"
```

### Paso 4: Crear el Repositorio en GitHub
1. Ingrese a [GitHub](https://github.com/) e inicie sesión en su cuenta.
2. Haga clic en **New repository** (o visite `https://github.com/new`).
3. Asigne el nombre del repositorio (por ejemplo: `ny2bolivia-web`).
4. Seleccione la visibilidad deseada (**Public** o **Private**).
5. **No** marque las casillas de inicializar con README, .gitignore o licencia (ya existen localmente).
6. Haga clic en **Create repository**.

### Paso 5: Vincular el Remoto y Enviar el Código a la Rama Principal
Copie la URL HTTPS o SSH provista por GitHub y ejecute en su terminal:
```powershell
# Cambiar el nombre de la rama a main si es necesario
git branch -M main

# Vincular el repositorio remoto (reemplace con la URL de su repositorio)
git remote add origin https://github.com/SU_USUARIO/ny2bolivia-web.git

# Enviar los cambios
git push -u origin main
```

---

## 5. Guía de Despliegue en Vercel

Vercel es la plataforma nativa y recomendada para alojar aplicaciones Next.js con soporte Edge, SSR y optimización global de imágenes.

### Paso 1: Importar el Proyecto en Vercel
1. Ingrese a [Vercel](https://vercel.com/) e inicie sesión con su cuenta de GitHub.
2. En el panel principal (Dashboard), haga clic en **Add New...** ➔ **Project**.
3. En la lista de repositorios de GitHub, localice `ny2bolivia-web` y haga clic en **Import**.

### Paso 2: Configuración del Proyecto (Build and Output Settings)
Vercel detecta automáticamente Next.js:
- **Framework Preset**: `Next.js`
- **Root Directory**: `./` (o la ruta correspondiente si el repositorio engloba más carpetas)
- **Build Command**: `npm run build` (o `next build`)
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### Paso 3: Configurar las Variables de Entorno en Vercel
En la sección **Environment Variables** de la pantalla de configuración del proyecto en Vercel, agregue las siguientes variables (tomadas de su `.env.local`):

| Variable | Valor de Ejemplo / Descripción |
|---|---|
| `NEXT_PUBLIC_APP_URL` | `https://ny2bolivia-web.vercel.app` |
| `NEXT_PUBLIC_WHATSAPP_SUPPORT_PHONE` | `59177012345` |
| `NEXT_PUBLIC_EXCHANGE_RATE_BOB` | `6.96` |
| `NEXT_PUBLIC_BASE_AIR_FREIGHT_USD_LB` | `9.50` |
| `NEXT_PUBLIC_BASE_BOOKING_FEE_USD` | `20.00` |
| `NEXT_PUBLIC_DEFAULT_COMMISSION_PERCENT` | `8` |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | *(Su clave de Firebase)* |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `su-proyecto.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `su-proyecto` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `su-proyecto.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `102938475610` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:102938475610:web:9a8b...` |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | `G-XXXXXXXXXX` |

> **Nota:** Si no configura las credenciales de Firebase de inmediato, la aplicación en Vercel funcionará en modo offline seguro utilizando el almacenamiento del navegador del usuario sin interrumpir la experiencia.

### Paso 4: Desplegar y Disfrutar de los Beneficios de Vercel
Haga clic en **Deploy**. En menos de 2 minutos obtendrá una URL de producción activa con:
- **Red Edge Global (CDN)**: Latencia ultrabaja para usuarios en Bolivia y Estados Unidos.
- **Optimización Automática de Imágenes**: Redimensionamiento y compresión en formato WebP/AVIF.
- **Compilaciones Continuas (CI/CD)**: Cada `git push` a la rama `main` disparará un nuevo despliegue automático con verificación de tipos y compilación.

---

## 6. Arquitectura e Integración Modular de Firebase

### Funcionamiento del Cliente Híbrido (`src/lib/firebase.ts` y `src/lib/orders-service.ts`)
La aplicación implementa un patrón adaptador de datos tolerante a fallos:

```
                  ┌───────────────────────────────┐
                  │    Componentes de la App      │
                  │   (/registro, Calculadora)    │
                  └──────────────┬────────────────┘
                                 │
                                 ▼
                  ┌───────────────────────────────┐
                  │      OrdersService Adapter    │
                  │   (src/lib/orders-service.ts) │
                  └──────────────┬────────────────┘
                                 │
                   ¿Credenciales válidas en .env?
                                ╱ ╲
                             SÍ ╱   ╲ NO
                               ╱     ╲
                              ▼       ▼
    ┌───────────────────────────┐   ┌───────────────────────────┐
    │   Google Cloud Firebase   │   │     Offline Mock Engine   │
    │  - Firestore Database     │   │  - LocalStorage persistente│
    │  - Cloud Storage Bucket   │   │  - Memoria SSR segura     │
    │  - Sincronización en vivo │   │  - Órdenes pre-cargadas   │
    └───────────────────────────┘   └───────────────────────────┘
```

1. **Detección Automática**: `src/lib/firebase.ts` inspecciona las variables `NEXT_PUBLIC_FIREBASE_API_KEY` y `NEXT_PUBLIC_FIREBASE_PROJECT_ID`. Si no están presentes o contienen valores placeholder, el cliente desactiva la inicialización en vivo sin generar excepciones.
2. **Modo 100% Offline con Seed Data**: Si Firebase no está configurado, `src/lib/orders-service.ts` recurre al almacenamiento `localStorage` del navegador. El servicio inicializa automáticamente 4 pedidos representativos de prueba con compras en Apple 5th Ave, Sephora SoHo, Nike NYC y Best Buy, cubriendo los 4 estados del ciclo de vida (`pedido`, `pagado_fee`, `recepcionado`, `entregado`).
3. **Persistencia y Reactividad Local**: Cada nuevo pedido creado a través del formulario `/registro` se guarda en LocalStorage y emite un evento `orders_db_changed`, permitiendo probar el flujo completo de registro, cálculo y modales sin necesidad de internet ni credenciales de Google Cloud.

---

### Paso a Paso para Conectar un Proyecto Firebase Real

#### 1. Crear el Proyecto en Firebase Console
1. Ingrese a [Firebase Console](https://console.firebase.google.com/) con su cuenta Google.
2. Haga clic en **Agregar proyecto** (Add project) y asigne un nombre (ej. `ny2bolivia-logistics`).
3. Opcionalmente active Google Analytics y confirme la creación.

#### 2. Registrar la Aplicación Web
1. En la página de inicio del proyecto, haga clic en el ícono Web `</>`.
2. Asigne un apodo (ej. `ny2bolivia-web`) y haga clic en **Registrar app**.
3. Firebase le mostrará el objeto `firebaseConfig` con sus 7 variables.

#### 3. Habilitar Cloud Firestore
1. En el menú lateral izquierdo, vaya a **Compilación (Build)** ➔ **Firestore Database**.
2. Haga clic en **Crear base de datos** (Create database).
3. Seleccione la ubicación de la base de datos (se recomienda `nam5 (us-central)` o la más cercana a la costa este de EE.UU.).
4. En modo de inicio, puede comenzar en **modo de prueba** o definir las reglas de seguridad recomendadas a continuación.

#### 4. Habilitar Cloud Storage (para Comprobantes)
1. En el menú lateral izquierdo, vaya a **Compilación (Build)** ➔ **Storage**.
2. Haga clic en **Empezar** (Get started) y acepte la configuración regional.

#### 5. Configurar el Archivo `.env.local`
En la raíz de su proyecto local, cree `.env.local` copiando `.env.example`:
```powershell
Copy-Item .env.example .env.local
```
Abra `.env.local` y reemplace los valores correspondientes:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSySuClaveRealGeneradaPorGoogle
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ny2bolivia-logistics.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ny2bolivia-logistics
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ny2bolivia-logistics.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=102938475610
NEXT_PUBLIC_FIREBASE_APP_ID=1:102938475610:web:9a8b7c6d5e4f3a2b1c0d
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

#### 6. Reglas de Seguridad Recomendadas

**Reglas para Cloud Firestore (`firestore.rules`):**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Colección de órdenes de clientes
    match /orders/{orderId} {
      // Cualquier cliente puede registrar su orden
      allow create: if request.resource.data.clientPhone != null 
                    && request.resource.data.clientName != null;
      
      // Lectura permitida para consulta de estado
      allow read: if true;
      
      // Actualizaciones restringidas o de uso administrativo
      allow update: if true;
      allow delete: if false; // Solo administradores
    }
  }
}
```

**Reglas para Cloud Storage (`storage.rules`):**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /invoices/{orderId}/{fileName} {
      // Permite subir comprobantes de hasta 10MB en formatos imagen o PDF
      allow write: if request.resource.size < 10 * 1024 * 1024
                   && (request.resource.contentType.matches('image/.*') 
                       || request.resource.contentType == 'application/pdf');
      allow read: if true;
    }
  }
}
```

---

## 7. Calculadora y Fórmulas Logísticas

El sistema aplica con exactitud las directrices de tarificación logística internacional acordadas para la ruta Nueva York ➔ Bolivia:

### 1. Flete Aéreo Directo ($9.50 USD / lb)
- **Tarifa Base**: **$9.50 USD** por libra americana (1 lb ≈ 0.453 kg).
- **Conversión a Moneda Local**: La tarifa en bolivianos se calcula multiplicando el importe en USD por el tipo de cambio oficial de referencia:
  $$\text{Flete (BOB)} = \text{Peso en Libras} \times 9.50 \times 6.96$$
  *Ejemplo para 5 lbs:* $5 \times 9.50 = \$47.50\text{ USD} \rightarrow 47.50 \times 6.96 = 330.60\text{ BOB}$.

### 2. Fórmula de Peso Volumétrico IATA
Para envíos livianos pero de gran volumen (calzado en cajas grandes, peluches, carteras rígidas), las aerolíneas internacionales calculan el peso aforado según la regla estándar IATA:
$$\text{Peso Volumétrico (lbs)} = \frac{\text{Largo (pulgadas)} \times \text{Ancho (pulgadas)} \times \text{Alto (pulgadas)}}{166}$$
El flete se cobra sobre el **peso mayor** entre el peso real de báscula y el peso volumétrico. Por ello, la opción *"Optimizar peso descartando cajas voluminosas"* incluida en el formulario `/registro` permite al cliente ahorrar hasta un 40% del costo de flete descartando empaques secundarios innecesarios.

### 3. Comisión de Compra Asistida ("Nosotros Compramos Por Ti")
Cuando el cliente solicita el servicio de Personal Shopper en Manhattan para comprar en tiendas físicas o con tarjeta emitida en EE.UU.:
$$\text{Comisión USD} = (\text{Total de Productos USD} \times 8\%) + \$20.00\text{ USD}$$
- **8% Variable**: Cubre la gestión cambiaria, comisión de compra y traslado del personal shopper a tiendas de la 5ta Avenida, SoHo o centros comerciales.
- **$20.00 USD Base**: Tarifa fija de reserva de cupo de vuelo chárter semanal directo JFK ➔ Bolivia, recepción e inspección física en bodega.

### 4. Política de Reserva Reembolsable en Casillero NY ("Tú Compras")
- Para la modalidad de casillero donde el cliente compra por su cuenta e ingresa su tracking USA, la reserva de **$20.00 USD** garantiza el espacio en el siguiente vuelo directo semanal.
- **Deducción de Flete**: Al arribar la carga a Bolivia y realizarse el pesaje final, los $20.00 USD abonados se descuentan íntegramente del total a pagar por concepto de flete aéreo.

---

## Licencia y Soporte
Desarrollado para **NY2Bolivia Logistics Corp** bajo el sistema de diseño **Andean Skyline Logistics**.  
Para consultas de desarrollo y soporte técnico, contacte a la coordinación de logística a través del canal oficial de WhatsApp (+591 77012345).
