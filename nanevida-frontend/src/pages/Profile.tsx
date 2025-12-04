import { useEffect, useState } from 'react';
import { api } from '../api';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Textarea } from '../components/ui/Input';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { HeartIcon } from '../assets/icons';

type UserProfile = {
  id: number;
  username: string;
  email: string;
  bio: string;
  avatar: string | null;
  created_at: string;
  updated_at: string;
};

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [bio, setBio] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const nav = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const { data } = await api.get('/profile/');
      setProfile(data);
      setBio(data.bio || '');
      setAvatarPreview(data.avatar);
      setError('');
    } catch (e: any) {
      if (e?.response?.status === 401) {
        nav('/login');
        return;
      }
      setError('No pudimos cargar tu perfil. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('La imagen debe pesar menos de 5MB');
        return;
      }

      // Validar tipo
      if (!file.type.startsWith('image/')) {
        setError('Por favor selecciona una imagen válida');
        return;
      }

      setAvatarFile(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('bio', bio);
      
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      // No especificar Content-Type - Axios lo configura automáticamente para FormData
      const { data } = await api.put('/profile/', formData);

      setProfile(data);
      setAvatarFile(null);
      setSuccess('¡Perfil actualizado! Los cambios se han guardado correctamente.');
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setSuccess(''), 3000);
    } catch (e: any) {
      if (e?.response?.status === 401) {
        nav('/login');
        return;
      }
      setError(e?.response?.data?.error || 'No pudimos guardar los cambios. Intenta nuevamente.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="flex items-center justify-center py-12">
          <LoadingSpinner />
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="text-center py-8">
          <p className="text-[#EC4899]">No pudimos cargar tu perfil</p>
        </Card>
      </div>
    );
  }

  const joinDate = new Date(profile.created_at).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="max-w-2xl mx-auto animate-fadeIn">
      {/* Header */}
      <Card gradient className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-[#A78BFA]/20">
          <HeartIcon size={32} color="#A78BFA" />
        </div>
        <h2 className="text-3xl font-bold text-black dark:text-white mb-2">
          Mi Perfil
        </h2>
        <p className="text-slate-800 dark:text-slate-100">
          Personaliza tu espacio y comparte un poco sobre ti
        </p>
      </Card>

      {/* Success Message */}
      {success && (
        <Card className="mb-6 bg-[#BBF7D0]/30 border-[#BBF7D0]/50">
          <p className="text-[#22C55E] flex items-center gap-2">
            <span style={{ filter: 'contrast(1.2) saturate(1.3)' }}>✅</span>
            {success}
          </p>
        </Card>
      )}

      {/* Error Message */}
      {error && (
        <Card className="mb-6 bg-[#FBCFE8]/20 border-[#FBCFE8]/40">
          <p className="text-slate-900 dark:text-white">{error}</p>
        </Card>
      )}

      {/* Profile Info Card */}
      <Card gradient className="mb-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar"
                loading="lazy"
                decoding="async"
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#A78BFA] to-[#C4B5FD] flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg">
                {profile.username[0].toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-black dark:text-white">{profile.username}</h3>
            <p className="text-slate-800 dark:text-slate-100">{profile.email}</p>
            <p className="text-sm text-[#888888] mt-2 flex items-center gap-1">
              <span style={{ filter: 'contrast(1.2) saturate(1.3)' }}>📅</span>
              Miembro desde {joinDate}
            </p>
          </div>
        </div>
      </Card>

      {/* Edit Profile Form */}
      <Card>
        <h3 className="text-xl font-bold text-black dark:text-white mb-6 flex items-center gap-2">
          <span style={{ filter: 'contrast(1.2) saturate(1.3)' }}>✏️</span>
          Editar Perfil
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span style={{ filter: 'contrast(1.2) saturate(1.3)' }}>📸</span>
              Foto de perfil
            </label>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    loading="lazy"
                    decoding="async"
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-2xl font-bold border-2 border-gray-200">
                    {profile.username[0].toUpperCase()}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  id="avatar-upload"
                />
                <label htmlFor="avatar-upload">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => document.getElementById('avatar-upload')?.click()}
                  >
                    Seleccionar imagen
                  </Button>
                </label>
                <p className="text-xs text-[#888888] mt-2">
                  JPG, PNG o GIF (máximo 5MB)
                </p>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <Textarea
              label="💭 Sobre mí"
              rows={5}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Comparte lo que quieras sobre ti: tus intereses, lo que te hace feliz, tus metas..."
              maxLength={500}
            />
            <p className="text-xs text-[#888888] mt-1 text-right">
              {bio.length}/500 caracteres
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={saving}
            >
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </Button>
            
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={() => nav('/dashboard')}
            >
              Volver
            </Button>
          </div>
        </form>
      </Card>

      {/* Account Info */}
      <Card className="mt-6 bg-[#F7F5FF]">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <span style={{ filter: 'contrast(1.2) saturate(1.3)' }}>ℹ️</span>
          Información de la cuenta
        </h4>
        <div className="space-y-2 text-sm text-slate-800 dark:text-slate-100">
          <p><strong className="text-black dark:text-white">Usuario:</strong> {profile.username}</p>
          <p><strong className="text-black dark:text-white">Email:</strong> {profile.email}</p>
          <p><strong className="text-black dark:text-white">Última actualización:</strong> {new Date(profile.updated_at).toLocaleString('es-ES')}</p>
        </div>
      </Card>
    </div>
  );
}
