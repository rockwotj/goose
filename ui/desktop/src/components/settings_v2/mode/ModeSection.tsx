import { useEffect, useState } from 'react';
import { getApiUrl, getSecretKey } from '../../../config';
import { all_goose_modes, ModeSelectionItem } from './ModeSelectionItem';
import { View, ViewOptions } from '../../../App';

interface ModeSectionProps {
  setView: (view: View, viewOptions?: ViewOptions) => void;
}

export const ModeSection = ({ setView }: ModeSectionProps) => {
  const [currentMode, setCurrentMode] = useState('auto');

  const handleModeChange = async (newMode: string) => {
    const storeResponse = await fetch(getApiUrl('/configs/store'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Secret-Key': getSecretKey(),
      },
      body: JSON.stringify({
        key: 'GOOSE_MODE',
        value: newMode,
        isSecret: false,
      }),
    });

    if (!storeResponse.ok) {
      const errorText = await storeResponse.text();
      console.error('Store response error:', errorText);
      throw new Error(`Failed to store new goose mode: ${newMode}`);
    }
    setCurrentMode(newMode);
  };

  useEffect(() => {
    const fetchCurrentMode = async () => {
      try {
        const response = await fetch(getApiUrl('/configs/get?key=GOOSE_MODE'), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Secret-Key': getSecretKey(),
          },
        });

        if (response.ok) {
          const { value } = await response.json();
          if (value) {
            setCurrentMode(value);
          }
        }
      } catch (error) {
        console.error('Error fetching current mode:', error);
      }
    };

    fetchCurrentMode();
  }, []);

  return (
    <section id="mode" className="px-8">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-medium text-textStandard">Mode</h2>
      </div>
      <div className="border-b border-borderSubtle pb-8">
        <p className="text-sm text-textStandard mb-6">
          Configure how Goose interacts with tools and extensions
        </p>
        <div>
          {all_goose_modes.map((mode) => (
            <ModeSelectionItem
              key={mode.key}
              mode={mode}
              currentMode={currentMode}
              showDescription={true}
              isApproveModeConfigure={false}
              parentView="settings"
              setView={setView}
              handleModeChange={handleModeChange}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
