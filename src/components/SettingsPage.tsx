/* filepath: /workspaces/SlimmeCijfersFrontend/src/components/SettingsPage.tsx */
import React, { useState, useEffect } from 'react';
import { Settings, Palette, Bell, Shield, Globe, Moon, Sun, Sunset, MoonStar, Snowflake, LeafyGreen } from 'lucide-react';

const THEMES = [
  { name: 'light', display: 'Licht', icon: Sun },
  { name: 'dark', display: 'Donker', icon: Moon },
  { name: 'winter', display: 'Winter', icon: Snowflake },
  { name: 'night', display: 'Nacht', icon: MoonStar },
  { name: 'emerald', display: 'Blad', icon: LeafyGreen },
  { name: 'sunset', display: 'Zonsondergang', icon: Sunset },
];

interface SettingsPageProps {
  grades?: any[];
}

const SettingsPage: React.FC<SettingsPageProps> = ({ grades }) => {
  const [currentTheme, setCurrentTheme] = useState<string>('light');
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('nl');
  const [autoSave, setAutoSave] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);

  useEffect(() => {
    // Only get the current theme from localStorage, don't set it
    const savedTheme = localStorage.getItem('theme') || 'light';
    setCurrentTheme(savedTheme);
  }, []);

  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  };

  return (
    <div className="space-y-6 motion-reduce:transition-none">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold text-base-content">Instellingen</h1>
      </div>

      {/* Theme Settings */}
      <div className="card bg-base-100 shadow-lg transition-none transform-none">
        <div className="card-body">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-base-content">Thema</h2>
          </div>
          <p className="text-base-content/70 text-sm mb-4">Kies je gewenste thema</p>
          
          <div className="grid grid-cols-2 gap-2">
            {THEMES.map((theme) => {
              const IconComponent = theme.icon;
              return (
                <button
                  key={theme.name}
                  onClick={() => handleThemeChange(theme.name)}
                  className={`btn btn-sm btn-outline flex items-center gap-2 transition-none ${
                    currentTheme === theme.name ? 'btn-primary' : ''
                  }`}
                >
                  <IconComponent className="h-3 w-3" />
                  {theme.display}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="card bg-base-100 shadow-lg transition-none transform-none">
        <div className="card-body">
          <div className="flex flex-col gap-2">
            <button className="btn btn-primary transition-none">Instellingen Opslaan</button>
            <button className="btn btn-outline transition-none">Standaard Herstellen</button>
            <button className="btn btn-outline btn-error transition-none">Alle Gegevens Wissen</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { SettingsPage };