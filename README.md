# DICRI Evidencias – Frontend (React + Vite)

Interfaz web para el sistema DICRI.  
Incluye dashboards, gestión de usuarios, registro de expedientes e indicios y reportes estadísticos.

---

## 1. Tecnologías utilizadas
- React + Vite
- React Router DOM
- Axios
- Bootstrap 5
- CSS personalizado (styles.css)

---

## 2. Arquitectura del proyecto
src/
  components/
    Layout.jsx
    Navbar.jsx
    ProtectedRoute.jsx
  pages/
    LoginPage.jsx
    TecnicoDashboard.jsx
    CoordinadorDashboard.jsx
    ReportesPage.jsx
    UsuariosPage.jsx
  services/
    api.js
  styles/
    styles.css
  App.jsx
  main.jsx
index.html
.env.example

---

## 3. Instalación

### 1. Clonar proyecto
git clone (https://github.com/PRMQ98/DICRI-MP-FRONTEND.git)
cd frontend

### 2. Instalar dependencias
npm install

### 3. Crear archivo .env
VITE_API_URL=http://localhost:3000/api

### 4. Ejecutar en desarrollo
npm run dev

### 5. Generar build
npm run build

---

## 4. Funcionalidades principales
- Inicio de sesión con JWT
- Rutas protegidas y autorizadas por rol
- Dashboard de técnico (expedientes + indicios)
- Dashboard de coordinador (revisión, aprobación, rechazo)
- Módulo de reportes estadísticos
- Gestión completa de usuarios

---

## 5. Comunicación con el backend
- Axios configurado con baseURL dinámico desde `.env`
- Interceptor automático de JWT
- Manejo unificado de errores

---

## 6. Estilos
El archivo styles.css define:
- Variables globales
- Estilos de navbar, cards, tablas y formularios
- Píldoras de estado
- Adaptación responsiva
- Identidad visual para todo el sistema

---

## 7. Despliegue
Compatible con:
- Netlify
- Vercel
- Firebase Hosting
- NGINX / Apache
- Cloudflare Pages
