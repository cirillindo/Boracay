import React, { useState, useEffect } from 'react';
import { Wifi, AirVent, Umbrella, Trees as Tree, Camera, Bed, Sofa, Briefcase, ShowerHead, Scissors, Bath, Clock, CalendarClock, Flame, Refrigerator, Coffee, UtensilsCrossed, Utensils, PawPrint, Key, Users, Home, Users2, Luggage, Cigarette, Siren as Fire, DollarSign, Stars as Stairs, Armchair as Wheelchair } from 'lucide-react';

interface PropertyFeaturesEditorProps {
  features: any;
  onChange: (features: any) => void;
}

// This should match the structure in PropertyTabs.tsx
const featureMap = {
  special: {
    title: 'Special Features',
    items: {
      internet: { icon: Wifi, label: 'Internet', hasValue: true },
      airConditioned: { icon: AirVent, label: 'Air-Conditioned' },
      privateTerrace: { icon: Umbrella, label: 'Private Terrace' },
      gardenAccess: { icon: Tree, label: 'Garden Access' },
      cctv: { icon: Camera, label: 'CCTV' }
    }
  },
  bedroom: {
    title: 'Bedroom',
    items: {
      kingBeds: { icon: Bed, label: 'King Beds', hasValue: true },
      queenBeds: { icon: Bed, label: 'Queen Beds', hasValue: true },
      sofaBeds: { icon: Sofa, label: 'Sofa Beds', hasValue: true },
      closetStorage: { icon: Briefcase, label: 'Closet / Storage' },
      workDesk: { icon: Briefcase, label: 'Work Desk' }
    }
  },
  bathroom: {
    title: 'Bathroom',
    items: {
      showers: { icon: ShowerHead, label: 'Showers', hasValue: true },
      hairDryer: { icon: Scissors, label: 'Hair Dryer' },
      toiletries: { icon: Bath, label: 'Toiletries' },
      towelChangeFrequency: { icon: Clock, label: 'Towel Change Every', hasValue: true, suffix: ' days' },
      bedSheetChangeFrequency: { icon: CalendarClock, label: 'Bed Sheet Change Every', hasValue: true, suffix: ' days' }
    }
  },
  kitchen: {
    title: 'Kitchen',
    items: {
      stoveOven: { icon: Flame, label: 'Stove + Oven' },
      refrigeratorFreezer: { icon: Refrigerator, label: 'Refrigerator + Freezer' },
      coffeeMaker: { icon: Coffee, label: 'Coffee Maker' },
      riceCooker: { icon: UtensilsCrossed, label: 'Rice Cooker' },
      cutleryPlates: { icon: Utensils, label: 'Cutlery & Plates' }
    }
  },
  general: {
    title: 'General',
    items: {
      petsAllowed: { icon: PawPrint, label: 'Pets Allowed' },
      selfCheckIn: { icon: Key, label: 'Self Check-In' },
      staffOnSite: { icon: Users, label: 'Staff on Site' },
      longTermRental: { icon: Home, label: 'Long-Term Rental Available' }
    }
  },
  optional: {
    title: 'Optional',
    items: {
      maxGuests: { icon: Users2, label: 'Max Guests', hasValue: true },
      luggageDropOff: { icon: Luggage, label: 'Luggage Drop-Off' },
      smokeAlarm: { icon: Cigarette, label: 'Smoke Alarm' },
      fireExtinguisher: { icon: Fire, label: 'Fire Extinguisher' },
      cleaningFee: { icon: DollarSign, label: 'Cleaning Fee Applies' },
      stairsElevator: { icon: Stairs, label: 'Access via', hasValue: true },
      wheelchairAccessible: { icon: Wheelchair, label: 'Wheelchair Accessible' }
    }
  }
};

const PropertyFeaturesEditor: React.FC<PropertyFeaturesEditorProps> = ({ features = {}, onChange }) => {
  const [localFeatures, setLocalFeatures] = useState<any>(features);

  useEffect(() => {
    // Initialize with default structure if features is empty
    if (!features || Object.keys(features).length === 0) {
      const initialFeatures: any = {};
      Object.keys(featureMap).forEach(category => {
        initialFeatures[category] = {};
      });
      setLocalFeatures(initialFeatures);
    } else {
      setLocalFeatures(features);
    }
  }, []);

  const handleBooleanChange = (category: string, feature: string, checked: boolean) => {
    const updatedFeatures = {
      ...localFeatures,
      [category]: {
        ...(localFeatures[category] || {}),
        [feature]: checked
      }
    };
    setLocalFeatures(updatedFeatures);
    onChange(updatedFeatures);
  };

  const handleValueChange = (category: string, feature: string, value: string) => {
    // Convert to number if it's a numeric value
    const processedValue = !isNaN(Number(value)) && value !== '' ? Number(value) : value;
    
    const updatedFeatures = {
      ...localFeatures,
      [category]: {
        ...(localFeatures[category] || {}),
        [feature]: processedValue
      }
    };
    setLocalFeatures(updatedFeatures);
    onChange(updatedFeatures);
  };

  return (
    <div className="space-y-8">
      {Object.entries(featureMap).map(([category, { title, items }]) => (
        <div key={category} className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(items).map(([feature, { icon: Icon, label, hasValue, suffix }]) => {
              const categoryFeatures = localFeatures[category] || {};
              const value = categoryFeatures[feature];
              
              return (
                <div key={feature} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                  
                  {hasValue ? (
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {label}
                      </label>
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={value || ''}
                          onChange={(e) => handleValueChange(category, feature, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        {suffix && <span className="ml-2 text-gray-600">{suffix}</span>}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between flex-1">
                      <label className="text-sm text-gray-700 cursor-pointer" htmlFor={`${category}-${feature}`}>
                        {label}
                      </label>
                      <input
                        type="checkbox"
                        id={`${category}-${feature}`}
                        checked={!!value}
                        onChange={(e) => handleBooleanChange(category, feature, e.target.checked)}
                        className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PropertyFeaturesEditor;