# SoundEngine - Sistema de Audio Profesional

Sistema completo de audio para la app de bienestar emocional NANE VIDA.

## 🎵 Características

- ✅ Descarga automática de sonidos con reintentos
- ✅ Caché en IndexedDB (persistente entre sesiones)
- ✅ Fade in/out profesional (2-4 segundos)
- ✅ Loops sin clics (seamless)
- ✅ Crossfade entre sonidos
- ✅ Ducking automático para voz guiada
- ✅ Haptics/vibraciones (móviles PWA)
- ✅ Sesiones multi-flow con encadenamiento
- ✅ Modos: Normal, Silencio Guiado, Noche
- ✅ Preferencias de usuario persistentes
- ✅ Fallback silencioso si fallan descargas

---

## 📦 Estructura de Archivos

```
/sound-engine/
├── soundEngine.ts          # Motor principal (API pública)
├── /utils/
│   ├── downloader.ts       # Descarga y caché con IndexedDB
│   ├── audioHelpers.ts     # Fades, crossfades, ducking
│   └── haptics.ts          # Vibraciones para móviles
└── /assets/sounds/         # (vacía, archivos en IndexedDB)
```

---

## 🚀 Uso Básico

### 1. Inicialización

```typescript
import { SoundEngine } from './sound-engine/soundEngine';

// Inicializar al cargar la app
await SoundEngine.init();

// Opcional: Descargar todos los sonidos de una vez
await SoundEngine.downloadAll();
```

### 2. Reproducir sonido para una herramienta

```typescript
// Reproducir sonido para "Calm" (5 minutos por defecto)
await SoundEngine.play('calm');

// Con opciones personalizadas
await SoundEngine.play('breath', {
  duration: 10,           // 10 minutos
  volume: 0.7,           // 70% volumen
  mode: 'night',         // Modo noche (volumen reducido)
  enableHaptics: true,   // Vibraciones activadas
});
```

### 3. Control de reproducción

```typescript
// Detener sonido actual
SoundEngine.stop();

// Fade in/out manual
SoundEngine.fadeIn(2, 0.8);    // 2 segundos, volumen 80%
SoundEngine.fadeOut(3);        // 3 segundos

// Cambiar volumen instantáneamente
SoundEngine.setVolume(0.5);
```

### 4. Sesiones Multi-Flow

```typescript
// Sesión completa: Breath → Calm → Reflection
await SoundEngine.playMultiFlow([
  { tool: 'breath', duration: 2 },      // 2 minutos
  { tool: 'calm', duration: 3 },        // 3 minutos
  { tool: 'reflection', duration: 5 },  // 5 minutos
], {
  volume: 0.6,
  mode: 'normal',
  enableHaptics: true,
});
```

---

## 🎛️ API Completa

### Métodos Principales

| Método | Descripción |
|--------|-------------|
| `SoundEngine.init()` | Inicializa el motor (obligatorio) |
| `SoundEngine.downloadAll()` | Descarga todos los sonidos |
| `SoundEngine.play(tool, options)` | Reproduce sonido para una herramienta |
| `SoundEngine.stop()` | Detiene reproducción actual |
| `SoundEngine.fadeIn(duration, volume)` | Fade in manual |
| `SoundEngine.fadeOut(duration)` | Fade out manual |
| `SoundEngine.setVolume(volume)` | Cambia volumen (0-1) |
| `SoundEngine.setSoundForTool(tool, sound)` | Asigna sonido a herramienta |
| `SoundEngine.getAvailableSounds()` | Lista sonidos disponibles |
| `SoundEngine.getUserPreferences()` | Obtiene preferencias |
| `SoundEngine.savePreferences()` | Guarda preferencias |
| `SoundEngine.playMultiFlow(steps, options)` | Sesión multi-herramienta |
| `SoundEngine.cleanup()` | Limpia recursos |

### Opciones de Reproducción

```typescript
interface PlayOptions {
  duration?: 1 | 3 | 5 | 10;        // Duración en minutos
  volume?: number;                   // 0-1
  mode?: 'normal' | 'guided-silence' | 'night';
  enableHaptics?: boolean;
  onPhaseChange?: (phase: string) => void;
}
```

---

## 🎨 Sonidos Incluidos

| Nombre | Uso Recomendado | Fuente |
|--------|-----------------|--------|
| `calming-pad` | Calm (relajación) | Free Music Archive |
| `soft-meditation` | Reflection (meditación) | Free Music Archive |
| `deep-breath-pulse` | Breath (respiración) | Pixabay |
| `ambient-nature` | Grounding (conexión) | Pixabay |
| `white-noise` | Background (opcional) | Pixabay |

---

## 🔄 Mapeo Herramienta-Sonido

Por defecto:
- **Calm** → `calming-pad`
- **Breath** → `deep-breath-pulse`
- **Grounding** → `ambient-nature`
- **Reflection** → `soft-meditation`

Personalizar:
```typescript
SoundEngine.setSoundForTool('calm', 'white-noise');
```

---

## 📳 Haptics (Vibraciones)

```typescript
import { haptics } from './sound-engine/utils/haptics';

// Patrones predefinidos
haptics.trigger('light');      // Toque suave
haptics.trigger('medium');     // Toque medio
haptics.trigger('heavy');      // Toque fuerte
haptics.trigger('success');    // Patrón de éxito
haptics.trigger('warning');    // Patrón de advertencia
haptics.trigger('error');      // Patrón de error

// Patrones específicos
haptics.breathPattern('inhale');    // Inhalación
haptics.breathPattern('hold');      // Sostener
haptics.breathPattern('exhale');    // Exhalación
haptics.stepComplete();             // Paso completado
haptics.sessionStart();             // Inicio de sesión
haptics.sessionEnd();               // Fin de sesión

// Personalizado
haptics.custom([100, 50, 100]);    // Patrón personalizado
```

---

## 🌙 Modos Especiales

### Modo Silencio Guiado
```typescript
await SoundEngine.play('calm', { mode: 'guided-silence' });
// No reproduce audio, pero mantiene haptics y temporizadores
```

### Modo Noche
```typescript
await SoundEngine.play('reflection', { mode: 'night' });
// Volumen reducido automáticamente (30% menos)
```

---

## 💾 Preferencias de Usuario

```typescript
// Obtener preferencias actuales
const prefs = SoundEngine.getUserPreferences();
/*
{
  toolSounds: { calm: 'calming-pad', ... },
  defaultVolume: 0.5,
  nightModeVolume: 0.35,
  enableHaptics: true,
  enableSounds: true,
}
*/

// Modificar y guardar
prefs.defaultVolume = 0.7;
prefs.enableHaptics = false;
SoundEngine.savePreferences();
```

---

## 🔧 Integración con Componentes React

### Ejemplo: Componente Breath

```typescript
import { useEffect } from 'react';
import { SoundEngine } from '../sound-engine/soundEngine';
import { haptics } from '../sound-engine/utils/haptics';

export default function Breath() {
  useEffect(() => {
    // Iniciar sonido al montar
    SoundEngine.play('breath', {
      duration: 5,
      enableHaptics: true,
    });

    // Cleanup al desmontar
    return () => {
      SoundEngine.stop();
    };
  }, []);

  const handlePhaseChange = (phase: 'inhale' | 'hold' | 'exhale') => {
    haptics.breathPattern(phase);
  };

  return (
    // ... UI
  );
}
```

---

## 🐛 Troubleshooting

### Los sonidos no se descargan
- Verificar conexión a internet
- Revisar console para errores de CORS
- El sistema usa fallback silencioso si fallan descargas

### El audio no se reproduce
- Browsers modernos bloquean autoplay
- Requiere interacción del usuario primero
- Llamar `SoundEngine.play()` desde un evento (click, tap)

### IndexedDB lleno
```typescript
import { downloader } from './sound-engine/utils/downloader';
await downloader.clearCache();
```

---

## 📊 Estado de Descarga

Para verificar si los sonidos están descargados:

```typescript
import { downloader } from './sound-engine/utils/downloader';

const isWindDownloaded = await downloader.exists('calming-pad.mp3');
console.log('Calming pad downloaded:', isWindDownloaded);
```

---

## 🎯 Ejemplo Completo: App Initialization

```typescript
// App.tsx o main.tsx
import { useEffect } from 'react';
import { SoundEngine } from './sound-engine/soundEngine';

function App() {
  useEffect(() => {
    // Inicializar al cargar app
    const initSound = async () => {
      try {
        await SoundEngine.init();
        
        // Descargar sonidos en background (opcional)
        SoundEngine.downloadAll().then(() => {
          console.log('All sounds ready!');
        });
      } catch (error) {
        console.error('SoundEngine init failed:', error);
      }
    };

    initSound();

    // Cleanup global al cerrar app
    return () => {
      SoundEngine.cleanup();
    };
  }, []);

  return (
    // ... resto de la app
  );
}
```

---

## ✅ Checklist de Implementación

- [x] `soundEngine.ts` - Motor principal
- [x] `downloader.ts` - Descarga con reintentos
- [x] `audioHelpers.ts` - Fades y crossfades
- [x] `haptics.ts` - Vibraciones móviles
- [x] Auto-descarga de 5 sonidos
- [x] Cache en IndexedDB
- [x] Fade in/out (2-4s)
- [x] Loops seamless
- [x] Crossfade entre tracks
- [x] Multi-flow sessions
- [x] 3 modos (normal/silence/night)
- [x] 4 duraciones (1/3/5/10 min)
- [x] Haptics patterns
- [x] User preferences
- [x] Fallback silencioso

---

## 📝 Notas Técnicas

- **IndexedDB**: Cache persistente, sobrevive a refrescos
- **Web Audio API**: Fallback generado con AudioContext
- **Singleton**: Una sola instancia del motor
- **Memory-safe**: Cleanup automático de intervalos y audio
- **PWA-ready**: Compatible con Progressive Web Apps
- **TypeScript**: Tipado completo para seguridad

---

## 🎓 Próximas Mejoras Sugeridas

1. Visualizador de audio (waveform)
2. Ecualizador de frecuencias
3. Sonidos generados por IA
4. Sincronización con animaciones
5. Export/import de preferencias
6. Modo offline-first
7. Compresión de audio adaptativa

---

¡El SoundEngine está listo para usar! 🎵✨
