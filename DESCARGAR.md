# 📱 Guía de Instalación y Descarga de App-Mama

¡Tu aplicación ahora tiene soporte completo para ser descargada e instalada! Hemos implementado **PWA (Progressive Web App)** con iconos de calendario minimalistas premium y soporte offline, y configurado **Capacitor** para empaquetado nativo.

Elige el método que prefieras para tener App-Mama en tu pantalla de inicio:

---

## ⚡ Método 1: Instalación Rápida PWA (Recomendado - 3 segundos)

Una PWA (Progressive Web App) se comporta exactamente como una aplicación nativa descargable: se abre a pantalla completa, tiene su propio icono minimalista en el escritorio y carga de forma instantánea sin internet.

### 🤖 En Android (Chrome / Edge / Opera)
1. Abre tu navegador y navega a la URL donde tengas desplegada tu web (o entra localmente si tienes un túnel).
2. Verás una barra inferior flotante que dice **"Añadir App-Mama a la pantalla de inicio"**.
3. Si no aparece, haz clic en los **tres puntos de la esquina superior derecha** de Chrome y selecciona **"Instalar aplicación"** o **"Añadir a pantalla de inicio"**.
4. ¡Listo! Tendrás el icono en tu pantalla de inicio y se abrirá sin barra de navegación del explorador.

### 🍏 En iPhone / iPad (Safari)
1. Abre la URL de tu aplicación en **Safari** (obligatorio en iOS).
2. Toca el botón **"Compartir"** (el icono de un cuadro con una flecha hacia arriba en la barra inferior).
3. Desplázate hacia abajo y selecciona **"Añadir a pantalla de inicio"** (Add to Home Screen).
4. Escribe el nombre "App-Mama" y toca **Añadir**.
5. ¡Listo! Ya aparecerá en tu iPhone con su icono y comportamiento de app nativa.

### 💻 En Computadoras (Windows / macOS con Chrome o Edge)
1. Entra a la web en Chrome o Edge.
2. En la barra de direcciones (donde escribes la URL), aparecerá un icono de **un ordenador con una flecha** o un símbolo **"+"** que indica "Aplicación disponible".
3. Haz clic en él y selecciona **"Instalar"**.
4. ¡Listo! Se creará un acceso directo en tu escritorio y la aplicación se abrirá en su propia ventana dedicada independiente.

---

## 🛠️ Método 2: Compilación de App Nativa Android (APK) con Capacitor

Si necesitas generar un archivo **`.apk`** instalable físicamente o subirlo a la tienda Google Play, hemos configurado **Capacitor** en el proyecto. 

Para compilarlo localmente en tu sistema, sigue estos pasos:

### ⚙️ Requisitos Previos en tu Ordenador:
1. Tener instalado **Node.js** y **npm** (ya los tienes).
2. Tener instalado **Android Studio** y el SDK de Android.
3. Asegurarte de que la variable de entorno `ANDROID_HOME` esté configurada apuntando a tu SDK de Android.

### 🚀 Pasos para Generar la APK:

1. **Compilar la aplicación web** (genera la carpeta `dist` con los archivos optimizados):
   ```bash
   npm run build
   ```

2. **Inicializar y añadir la plataforma Android**:
   ```bash
   # Añade la carpeta nativa de Android al proyecto
   npx cap add android
   ```

3. **Copiar y sincronizar los archivos web en el proyecto nativo**:
   ```bash
   npx cap sync
   ```

4. **Abrir el proyecto en Android Studio**:
   ```bash
   npx cap open android
   ```
   *Esto abrirá automáticamente Android Studio con la configuración correcta del proyecto.*

5. **Generar la APK en Android Studio**:
   - En la barra superior de Android Studio, haz clic en **Build** (Compilar) -> **Build Bundle(s) / APK(s)** -> **Build APK(s)**.
   - Android Studio compilará la app. Al finalizar, aparecerá una notificación abajo a la derecha con un enlace que dice **"locate"**. Haz clic para abrir la carpeta donde está tu archivo `app-debug.apk`.
   - ¡Copia ese `.apk` a tu teléfono e instálalo!

*(Nota: Cada vez que realices cambios en tu código React y quieras actualizarlos en la app nativa, solo debes ejecutar `npm run build` y luego `npx cap sync`).*

---

## ❤️ Resumen de Características de la PWA implementada:
* **Icono de Calendario Minimalista**: Diseñado con un estilo neón moderno en tonos morados.
* **Offline Caching**: Carga instantánea gracias al Service Worker (`sw.js`).
* **Pantalla de carga (Splash Screen)**: Soporte completo en Android e iOS.
* **Diseño adaptativo en móviles**: Sin barras de dirección ni pies de página del navegador.
