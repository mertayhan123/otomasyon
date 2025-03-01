"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ProfileData {
  avatar: string;
  title: string;
  department: string;
  phone: string;
  address: string;
  bio: string;
}

interface SettingsData {
  theme: 'light' | 'dark' | 'system';
  language: 'tr' | 'en';
  notifications: boolean;
  emailAlerts: boolean;
}

const ProfilePage: React.FC = () => {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');
  
  const [profileData, setProfileData] = useState<ProfileData>({
    avatar: '',
    title: '',
    department: '',
    phone: '',
    address: '',
    bio: ''
  });
  
  const [settingsData, setSettingsData] = useState<SettingsData>({
    theme: 'system',
    language: 'tr',
    notifications: true,
    emailAlerts: true
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Profil ve ayarları getiren fonksiyon
  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/profile");
      const data = await response.json();
      
      if (data.success) {
        setProfileData(data.profile);
        setSettingsData(data.settings);
      } else {
        setError(data.message || "Profil bilgileri getirilemedi");
      }
    } catch (err) {
      setError("Profil bilgileri getirilemedi");
      console.error("Profil getirme hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  // Profil bilgilerini güncelleme
  const updateProfile = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");
      
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          profile: profileData
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess("Profil bilgileri başarıyla güncellendi");
        // Oturum bilgilerini güncelle
        await update({
          profile: data.profile
        });
      } else {
        setError(data.message || "Profil güncellenirken bir hata oluştu");
      }
    } catch (err) {
      setError("Profil güncellenirken bir hata oluştu");
      console.error("Profil güncelleme hatası:", err);
    } finally {
      setSaving(false);
    }
  };

  // Ayarları güncelleme
  const updateSettings = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");
      
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          settings: settingsData
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess("Ayarlar başarıyla güncellendi");
        // Oturum bilgilerini güncelle
        await update({
          settings: data.settings
        });
        
        // Tema değişikliğini uygula
        if (settingsData.theme === 'dark') {
          document.documentElement.classList.add('dark');
          document.documentElement.setAttribute('data-theme', 'dark');
        } else if (settingsData.theme === 'light') {
          document.documentElement.classList.remove('dark');
          document.documentElement.setAttribute('data-theme', 'light');
        } else {
          // Sistem teması
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          document.documentElement.classList.toggle('dark', prefersDark);
          document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        }
        
        // Tema değişikliğini localStorage'a kaydet
        localStorage.setItem('theme', settingsData.theme);
      } else {
        setError(data.message || "Ayarlar güncellenirken bir hata oluştu");
      }
    } catch (err) {
      setError("Ayarlar güncellenirken bir hata oluştu");
      console.error("Ayarlar güncelleme hatası:", err);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchProfileData();
    }
  }, [status]);

  // Form değişikliklerini işleme
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Ayar değişikliklerini işleme
  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setSettingsData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setSettingsData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-auto">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground">Profil Ayarları</h1>
          <p className="text-muted-foreground mt-2">
            Hesap bilgilerinizi ve uygulama ayarlarınızı yönetin
          </p>
        </header>
        
        {error && (
          <div className="mb-6 p-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-destructive" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 text-sm text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {success}
          </div>
        )}
        
        <div className="card">
          {/* Tabs */}
          <div className="flex border-b border-border">
            <button
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'profile'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              Profil Bilgileri
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'settings'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveTab('settings')}
            >
              Uygulama Ayarları
            </button>
          </div>
          
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-foreground mb-1">
                      Ünvan
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={profileData.title}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground"
                      placeholder="Ünvanınız"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-foreground mb-1">
                      Departman
                    </label>
                    <input
                      type="text"
                      id="department"
                      name="department"
                      value={profileData.department}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground"
                      placeholder="Departmanınız"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground"
                      placeholder="Telefon numaranız"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-foreground mb-1">
                      Adres
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={profileData.address}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground"
                      placeholder="Adresiniz"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-foreground mb-1">
                      Hakkımda
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={profileData.bio}
                      onChange={handleProfileChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground"
                      placeholder="Kendiniz hakkında kısa bir bilgi"
                    ></textarea>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={updateProfile}
                  disabled={saving}
                  className="btn btn-primary"
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Kaydediliyor...
                    </>
                  ) : (
                    "Değişiklikleri Kaydet"
                  )}
                </button>
              </div>
            </div>
          )}
          
          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="theme" className="block text-sm font-medium text-foreground mb-1">
                      Tema
                    </label>
                    <select
                      id="theme"
                      name="theme"
                      value={settingsData.theme}
                      onChange={handleSettingsChange}
                      className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground"
                    >
                      <option value="light">Açık</option>
                      <option value="dark">Koyu</option>
                      <option value="system">Sistem</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="language" className="block text-sm font-medium text-foreground mb-1">
                      Dil
                    </label>
                    <select
                      id="language"
                      name="language"
                      value={settingsData.language}
                      onChange={handleSettingsChange}
                      className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground"
                    >
                      <option value="tr">Türkçe</option>
                      <option value="en">İngilizce</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="notifications"
                      name="notifications"
                      checked={settingsData.notifications}
                      onChange={handleSettingsChange}
                      className="h-4 w-4 text-primary border-input rounded"
                    />
                    <label htmlFor="notifications" className="ml-2 block text-sm text-foreground">
                      Uygulama Bildirimleri
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="emailAlerts"
                      name="emailAlerts"
                      checked={settingsData.emailAlerts}
                      onChange={handleSettingsChange}
                      className="h-4 w-4 text-primary border-input rounded"
                    />
                    <label htmlFor="emailAlerts" className="ml-2 block text-sm text-foreground">
                      E-posta Bildirimleri
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={updateSettings}
                  disabled={saving}
                  className="btn btn-primary"
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Kaydediliyor...
                    </>
                  ) : (
                    "Değişiklikleri Kaydet"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-6 text-center">
          <Link href="/main" className="text-primary hover:text-primary-hover">
            Dashboard'a Dön
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 