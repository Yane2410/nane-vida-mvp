import { useEffect, useState } from 'react';
import { api } from '../api';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Textarea } from '../components/ui/Input';
import LoadingSpinner from '../components/ui/LoadingSpinner';

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
      setError('Error al cargar el perfil');
    } finally {
      setLoading(false);
    }
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('La imagen debe ser menor a 5MB');
        return;
      }

      // Validar tipo
      if (!file.type.startsWith('image/')) {
        setError('Solo se permiten imágenes');
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

      const { data } = await api.put('/profile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setProfile(data);
      setAvatarFile(null);
      setSuccess('✅ Perfil actualizado exitosamente');
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setSuccess(''), 3000);
    } catch (e: any) {
      if (e?.response?.status === 401) {
        nav('/login');
        return;
      }
      setError(e?.response?.data?.error || 'Error al actualizar el perfil');
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
          <p className="text-red-600">❌ No se pudo cargar el perfil</p>
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
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <span>👤</span>
          Mi Perfil
        </h2>
        <p className="text-gray-600">
          Personaliza tu perfil y comparte un poco sobre ti
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <Card className="mb-6 bg-green-50 border-green-200">
          <div className="flex items-center gap-2 text-green-700">
            <span>✅</span>
            <p>{success}</p>
          </div>
        </Card>
      )}

      {/* Error Message */}
      {error && (
        <Card className="mb-6 bg-red-50 border-red-200">
          <div className="flex items-center gap-2 text-red-700">
            <span>⚠️</span>
            <p>{error}</p>
          </div>
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
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg">
                {profile.username[0].toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-800">{profile.username}</h3>
            <p className="text-gray-600">{profile.email}</p>
            <p className="text-sm text-gray-500 mt-2">
              📅 Miembro desde {joinDate}
            </p>
          </div>
        </div>
      </Card>

      {/* Edit Profile Form */}
      <Card>
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span>✏️</span>
          Editar Perfil
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              📸 Foto de Perfil
            </label>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
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
                    📁 Seleccionar Imagen
                  </Button>
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  JPG, PNG o GIF. Máximo 5MB.
                </p>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <Textarea
              label="💭 Biografía"
              rows={5}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Cuéntanos un poco sobre ti, tus intereses, o lo que quieras compartir..."
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1 text-right">
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
              icon={saving ? undefined : <span>💾</span>}
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
            
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={() => nav('/diary')}
              icon={<span>📔</span>}
            >
              Volver al Diario
            </Button>
          </div>
        </form>
      </Card>

      {/* Account Info */}
      <Card className="mt-6 bg-gray-50">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">
          ℹ️ Información de la Cuenta
        </h4>
        <div className="space-y-2 text-sm text-gray-600">
          <p><strong>Usuario:</strong> {profile.username}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Última actualización:</strong> {new Date(profile.updated_at).toLocaleString('es-ES')}</p>
        </div>
      </Card>
    </div>
  );
}
