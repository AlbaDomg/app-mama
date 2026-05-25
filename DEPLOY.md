# 🚀 Guía de Despliegue y Configuración de Dominio para App-mama

¡Tu aplicación está 100% lista para ser desplegada en internet! Hemos configurado los archivos necesarios en el proyecto para que funcione perfectamente en **Vercel** o **GitHub Pages**, y soporte **rutas relativas** y enrutamiento SPA automático.

A continuación, tienes las instrucciones paso a paso para desplegar tu aplicación en minutos y asignarle tu propio nombre de dominio personalizado.

---

## 🌟 Opción 1: Desplegar en Vercel (Recomendado - Cero Configuración)

Vercel es la plataforma de hosting moderna más rápida y potente para proyectos React + Vite. Es 100% gratuita y te otorga certificados SSL (HTTPS) automáticos.

### Paso A: Subir el proyecto a GitHub
Si aún no has subido tu proyecto a GitHub:
1. Abre tu terminal en la carpeta del proyecto.
2. Inicializa git y sube el código:
   ```bash
   git init
   git add .
   git commit -m "feat: configuraciones de despliegue"
   # Crea un repositorio vacío en github.com y asócialo:
   git remote add origin https://github.com/TU_USUARIO/app-mama.git
   git branch -M main
   git push -u origin main
   ```

### Paso B: Conectar a Vercel
1. Ve a [vercel.com](https://vercel.com/) y regístrate o inicia sesión con tu cuenta de **GitHub**.
2. Haz clic en el botón **"Add New..."** y luego en **"Project"**.
3. Importa tu repositorio `app-mama`.
4. Vercel detectará automáticamente que es un proyecto **Vite**. Deja las opciones por defecto y haz clic en **"Deploy"**.
5. ¡Listo! En menos de 1 minuto tendrás una URL pública similar a `https://app-mama.vercel.app`.

### Paso C: Vincular tu Dominio Personalizado en Vercel
1. En el panel del proyecto en Vercel, ve a **Settings** (Ajustes) -> **Domains** (Dominios).
2. Escribe tu dominio personalizado (por ejemplo, `appmama.com` o `www.appmama.com`) y haz clic en **Add**.
3. Vercel te mostrará los datos de DNS que debes configurar. Usualmente son:
   - **Para un subdominio** (como `www.appmama.com`): Crea un registro **CNAME** en tu proveedor de dominio que apunte a `cname.vercel-dns.com`.
   - **Para el dominio raíz** (como `appmama.com`): Crea un registro **A** que apunte a la dirección IP de Vercel: `76.76.21.21`.
4. ¡Una vez guardado en tu proveedor (como GoDaddy, Hostinger, Namecheap, etc.), tu app estará activa bajo tu propio dominio en unos minutos!

---

## 🐙 Opción 2: Desplegar en GitHub Pages (Directo desde GitHub)

GitHub Pages te permite alojar la aplicación de forma gratuita directamente en los servidores de GitHub.

### Paso A: Publicar la App
1. Instala las dependencias del proyecto ejecutando en tu terminal:
   ```bash
   npm install
   ```
2. Ejecuta el script de despliegue automático que hemos creado en tu `package.json`:
   ```bash
   npm run deploy
   ```
   *Este comando compilará tu aplicación (`npm run build`) y creará una rama especial llamada `gh-pages` con el contenido público.*
3. Tu app ya estará disponible de forma gratuita en: `https://TU_USUARIO.github.io/app-mama/`

### Paso B: Vincular tu Dominio Personalizado en GitHub Pages
1. Ve a tu repositorio en **github.com**.
2. Haz clic en la pestaña **Settings** (Ajustes) en la barra superior.
3. En la barra lateral izquierda, haz clic en **Pages**.
4. En la sección **Custom domain**, escribe tu dominio (ej. `www.appmama.com` o `appmama.com`) y haz clic en **Save**.
5. Ve a tu proveedor de dominios y añade el registro DNS correspondiente:
   - **Para `www.appmama.com`**: Crea un registro **CNAME** apuntando a `TU_USUARIO.github.io`.
   - **Para dominio raíz**: Añade registros **A** apuntando a las IPs de GitHub Pages:
     ```text
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
6. Marca la casilla **"Enforce HTTPS"** en la configuración de GitHub Pages para que tu sitio sea seguro y use `https://`.

---

## 🛠️ ¿Cómo configuro las DNS de mi dominio? (Paso general)

Cualquiera que sea la opción de hosting elegida, deberás entrar en la web donde compraste tu dominio (GoDaddy, Namecheap, Hostinger, DonDominio, etc.):

1. Inicia sesión y ve a la sección **Mis Productos** o **Mis Dominios**.
2. Busca tu dominio y haz clic en **Administrar DNS** o **Zona DNS**.
3. **Añade los registros** según la plataforma elegida (Vercel o GitHub) eliminando o editando cualquier registro previo que esté en conflicto (como registros `A` o `CNAME` viejos dirigidos al mismo host).
4. Los cambios de DNS pueden tardar desde **5 minutos hasta 24 horas** en propagarse por todo el mundo, aunque usualmente se activan casi de inmediato.

¡Tu App-mama está lista para brillar en internet bajo tu propia marca y dominio! 🚀❤️
