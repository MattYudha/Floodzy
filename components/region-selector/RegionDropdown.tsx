// src/components/region-selector/RegionDropdown.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRegionData } from '@/hooks/useRegionData';
import { Button } from '@/components/ui/Button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Frown,
  MapPin,
  Building2,
  Globe,
  Map,
  CheckCircle,
  Info,
  Loader2,
  ChevronDown,
  Search,
  Star,
} from 'lucide-react';
import { CombinedWeatherData } from '@/lib/api';
import { WeatherMapIframe } from '@/components/weather/WeatherMapIframe';

import { SelectedLocation } from '@/types/location';

// Props for the RegionSelectField component
interface RegionSelectFieldProps {
  selectedValue: string | null;
  onValueChange: (value: string) => void;
  placeholder: string;
  loading: boolean;
  disabled: boolean;
  data: any[];
  icon: React.ReactNode;
  valueKey: string;
  nameKey: string;
  currentDisplayName: string | null;
}

// Dedicated component for the select field with the new UI
function RegionSelectField({
  selectedValue,
  onValueChange,
  placeholder,
  loading,
  disabled,
  data,
  icon,
  valueKey,
  nameKey,
  currentDisplayName,
}: RegionSelectFieldProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-200">
        <div className="p-1.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg">
          {icon}
        </div>
        <span>{placeholder}</span>
        {loading && (
          <div className="flex items-center gap-1">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-cyan-400" />
            <span className="text-xs text-cyan-400">Memuat...</span>
          </div>
        )}
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={`
              w-full justify-between p-4 min-h-[52px] text-left
              bg-gradient-to-r from-gray-800/50 via-gray-800/40 to-gray-800/50 
              border-2 border-gray-700/40 text-white rounded-xl 
              hover:from-gray-700/60 hover:to-gray-700/60 
              hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/10
              focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 
              disabled:opacity-40 disabled:cursor-not-allowed 
              backdrop-blur-sm transition-all duration-300
              group relative overflow-hidden
              ${open ? 'border-cyan-500/60 shadow-lg shadow-cyan-500/20' : ''}
            `}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {currentDisplayName ? (
              <div className="flex items-center gap-2.5 relative z-10">
                <div className="p-1.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                  <CheckCircle className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-white font-medium text-sm sm:text-base block truncate">
                    {currentDisplayName}
                  </span>
                  <span className="text-gray-400 text-xs">Terpilih</span>
                </div>
              </div>
            ) : (
              // IKON DI DALAM TOMBOL TELAH DIHAPUS DARI BAGIAN INI
              <div className="flex items-center relative z-10">
                <div className="flex-1 min-w-0">
                  <span className="text-gray-400 font-medium text-sm sm:text-base block">
                    {`Pilih ${placeholder}`}
                  </span>
                  <span className="text-gray-500 text-xs">Belum dipilih</span>
                </div>
              </div>
            )}

            <ChevronDown
              className={`
                h-4 w-4 text-gray-400 transition-transform duration-200 relative z-10
                ${open ? 'rotate-180 text-cyan-400' : 'group-hover:text-cyan-400'}
              `}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0 bg-gray-800/95 border-2 border-gray-700/50 text-white backdrop-blur-xl rounded-xl shadow-2xl">
          <div className="p-3 border-b border-gray-700/30 bg-gradient-to-r from-gray-800/80 to-gray-700/80">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-200">
              <Search className="h-4 w-4 text-cyan-400" />
              <span>Cari {placeholder}</span>
            </div>
          </div>

          <Command className="bg-transparent">
            <CommandInput
              placeholder={`Ketik nama ${placeholder.toLowerCase()}...`}
              className="h-10 border-0 bg-transparent text-white placeholder:text-gray-400 ring-offset-0 focus:ring-0 px-4"
            />
            <CommandEmpty>
              <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <Search className="h-8 w-8 mb-2 opacity-50" />
                <p className="font-medium">
                  Tidak ada {placeholder.toLowerCase()} ditemukan
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Coba kata kunci lain
                </p>
              </div>
            </CommandEmpty>
            <CommandList className="max-h-72">
              <CommandGroup>
                {loading ? (
                  <div className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-cyan-400">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">
                        Memuat data {placeholder.toLowerCase()}...
                      </span>
                    </div>
                  </div>
                ) : (
                  data.map((item, index) => (
                    <CommandItem
                      key={item[valueKey]}
                      value={item[nameKey]}
                      onSelect={(currentValue) => {
                        const selected = data.find(
                          (d) =>
                            d[nameKey].toLowerCase() ===
                            currentValue.toLowerCase(),
                        );
                        if (selected) {
                          onValueChange(String(selected[valueKey]));
                        }
                        setOpen(false);
                      }}
                      className={`
                        transition-all duration-200 cursor-pointer py-3 px-4 
                        rounded-lg mx-2 my-1 border border-transparent
                        hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-blue-500/10 
                        hover:border-cyan-500/20 hover:shadow-sm
                        ${
                          selectedValue === String(item[valueKey])
                            ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30'
                            : ''
                        }
                      `}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div
                          className={`
                            flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold
                            ${
                              selectedValue === String(item[valueKey])
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                                : 'bg-gradient-to-r from-gray-600/50 to-gray-500/50 text-gray-300'
                            }
                          `}
                        >
                          {index < 3 ? (
                            <Star className="h-3 w-3" />
                          ) : (
                            String(index + 1).padStart(2, '0')
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <span className="text-sm sm:text-base font-medium text-white block truncate">
                            {item[nameKey]}
                          </span>
                          {index < 3 && (
                            <span className="text-xs text-yellow-400">
                              ⭐ Populer
                            </span>
                          )}
                        </div>

                        <div
                          className={`
                          flex items-center justify-center w-6 h-6 rounded-full transition-all duration-200
                          ${
                            selectedValue === String(item[valueKey])
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                              : 'border-2 border-gray-600'
                          }
                        `}
                        >
                          {selectedValue === String(item[valueKey]) && (
                            <CheckCircle className="h-3.5 w-3.5 text-white" />
                          )}
                        </div>
                      </div>
                    </CommandItem>
                  ))
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

interface RegionDropdownProps {
  onSelectDistrict: (location: SelectedLocation) => void;
  selectedLocation: SelectedLocation | null;
  currentWeatherData?: CombinedWeatherData | null;
  loadingWeather?: boolean;
  weatherError?: string | null;
}

// Main component that orchestrates the dropdowns
export function RegionDropdown({
  onSelectDistrict,
  selectedLocation,
  currentWeatherData,
  loadingWeather,
  weatherError,
}: RegionDropdownProps) {
  const [selectedProvinceCode, setSelectedProvinceCode] = useState<
    string | null
  >(null);
  const [selectedRegencyCode, setSelectedRegencyCode] = useState<string | null>(
    null,
  );
  const [selectedDistrictCode, setSelectedDistrictCode] = useState<
    string | null
  >(null);

  const [displayProvinceName, setDisplayProvinceName] = useState<string | null>(
    null,
  );
  const [displayRegencyName, setDisplayRegencyName] = useState<string | null>(
    null,
  );
  const [displayDistrictName, setDisplayDistrictName] = useState<string | null>(
    null,
  );

  const {
    data: provinces,
    loading: loadingProvinces,
    error: errorProvinces,
  } = useRegionData({ type: 'provinces' });

  const {
    data: regencies,
    loading: loadingRegencies,
    error: errorRegencies,
  } = useRegionData({
    type: 'regencies',
    parentCode: selectedProvinceCode,
    enabled: !!selectedProvinceCode,
  });

  const {
    data: districts,
    loading: loadingDistricts,
    error: errorDistricts,
  } = useRegionData({
    type: 'districts',
    parentCode: selectedRegencyCode,
    enabled: !!selectedRegencyCode,
  });

  // Effect to synchronize internal state with the selectedLocation prop
  useEffect(() => {
    if (selectedLocation) {
      setSelectedProvinceCode(selectedLocation.provinceCode);
      setSelectedRegencyCode(selectedLocation.regencyCode);
      setSelectedDistrictCode(selectedLocation.districtCode);
      setDisplayDistrictName(selectedLocation.districtName);
    } else {
      setSelectedProvinceCode(null);
      setDisplayProvinceName(null);
      setSelectedRegencyCode(null);
      setDisplayRegencyName(null);
      setSelectedDistrictCode(null);
      setDisplayDistrictName(null);
    }
  }, [selectedLocation]);

  // Effect to update province display name when data is available
  useEffect(() => {
    if (selectedProvinceCode && provinces.length > 0) {
      const provinceName =
        provinces.find((p) => String(p.province_code) === selectedProvinceCode)
          ?.province_name || null;
      setDisplayProvinceName(provinceName);
    }
  }, [selectedProvinceCode, provinces]);

  // Effect to update regency display name when data is available
  useEffect(() => {
    if (selectedRegencyCode && regencies.length > 0) {
      const regencyName =
        regencies.find((r) => String(r.city_code) === selectedRegencyCode)
          ?.city_name || null;
      setDisplayRegencyName(regencyName);
    }
  }, [selectedRegencyCode, regencies]);

  const handleProvinceChange = (value: string) => {
    setSelectedProvinceCode(value);
    const name =
      provinces.find((p) => String(p.province_code) === value)?.province_name ||
      null;
    setDisplayProvinceName(name);

    setSelectedRegencyCode(null);
    setDisplayRegencyName(null);
    setSelectedDistrictCode(null);
    setDisplayDistrictName(null);
  };

  const handleRegencyChange = (value: string) => {
    setSelectedRegencyCode(value);
    const name =
      regencies.find((r) => String(r.city_code) === value)?.city_name || null;
    setDisplayRegencyName(name);

    setSelectedDistrictCode(null);
    setDisplayDistrictName(null);
  };

  const handleDistrictChange = (value: string) => {
    setSelectedDistrictCode(value);

    if (!selectedProvinceCode || !selectedRegencyCode) {
      setDisplayDistrictName(null);
      return;
    }

    const selectedDistrict = districts.find(
      (d) => d.sub_district_code === Number(value),
    );

    if (selectedDistrict) {
      const name = selectedDistrict.sub_district_name || null;
      setDisplayDistrictName(name);

      const lat = selectedDistrict.sub_district_latitude;
      const lng = selectedDistrict.sub_district_longitude;

      if (lat == null || lng == null || isNaN(lat) || isNaN(lng)) {
        console.warn(
          `Invalid coordinates for district ${name}: lat=${lat}, lng=${lng}`,
        );
      }

      const locationData = {
        districtCode: String(selectedDistrict.sub_district_code),
        districtName: selectedDistrict.sub_district_name || '',
        regencyCode: selectedRegencyCode,
        provinceCode: selectedProvinceCode,
        latitude: lat,
        longitude: lng,
        geometry: selectedDistrict.sub_district_geometry,
      };

      if (onSelectDistrict) {
        onSelectDistrict(locationData);
      }
    } else {
      setDisplayDistrictName(null);
    }
  };

  const renderError = (errorMessage: string) => (
    <Alert
      variant="destructive"
      className="bg-red-500/10 border-red-500/20 text-red-400 mb-3"
    >
      <Frown className="h-4 w-4" />
      <AlertTitle className="text-sm font-semibold">Error!</AlertTitle>
      <AlertDescription className="text-xs">{errorMessage}</AlertDescription>
    </Alert>
  );

  const isComplete =
    selectedDistrictCode &&
    displayProvinceName &&
    displayRegencyName &&
    displayDistrictName;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 md:p-6">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
            <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Pilih Lokasi Wilayah
          </span>
        </h1>
        <p className="text-gray-400 text-sm mt-2">
          Tentukan wilayah untuk monitoring sistem deteksi banjir.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <Card className="bg-gray-800/30 border-gray-700/30 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-b border-gray-700/30 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/20 rounded-lg">
                  <MapPin className="h-5 w-5 text-cyan-300" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-white">
                    Pilih Wilayah
                  </CardTitle>
                  <p className="text-gray-400 text-xs mt-0.5">
                    Mulai dari provinsi hingga kecamatan.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${selectedProvinceCode ? 'bg-cyan-400' : 'bg-gray-600'}`}
                />
                <div
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${selectedRegencyCode ? 'bg-cyan-400' : 'bg-gray-600'}`}
                />
                <div
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${selectedDistrictCode ? 'bg-cyan-400' : 'bg-gray-600'}`}
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-5 sm:p-6 space-y-6">
            {errorProvinces && renderError(errorProvinces)}
            {errorRegencies && renderError(errorRegencies)}
            {errorDistricts && renderError(errorDistricts)}

            <div className="space-y-6">
              <RegionSelectField
                selectedValue={selectedProvinceCode}
                onValueChange={handleProvinceChange}
                placeholder="Provinsi"
                loading={loadingProvinces}
                disabled={loadingProvinces}
                data={provinces}
                icon={<Globe className="h-4 w-4 text-cyan-400" />}
                valueKey="province_code"
                nameKey="province_name"
                currentDisplayName={displayProvinceName}
              />
              <RegionSelectField
                selectedValue={selectedRegencyCode}
                onValueChange={handleRegencyChange}
                placeholder="Kabupaten/Kota"
                loading={loadingRegencies}
                disabled={!selectedProvinceCode || loadingRegencies}
                data={regencies}
                icon={<Building2 className="h-4 w-4 text-cyan-400" />}
                valueKey="city_code"
                nameKey="city_name"
                currentDisplayName={displayRegencyName}
              />
              <RegionSelectField
                selectedValue={selectedDistrictCode}
                onValueChange={handleDistrictChange}
                placeholder="Kecamatan"
                loading={loadingDistricts}
                disabled={!selectedRegencyCode || loadingDistricts}
                data={districts}
                icon={<MapPin className="h-4 w-4 text-cyan-400" />}
                valueKey="sub_district_code"
                nameKey="sub_district_name"
                currentDisplayName={displayDistrictName}
              />
            </div>
            {isComplete && (
              <div className="mt-6 p-4 bg-green-500/10 rounded-lg border border-green-500/20 animate-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <h4 className="text-sm font-semibold text-green-400">
                    Lokasi Berhasil Dipilih
                  </h4>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Provinsi:</span>
                    <span className="text-white font-medium">
                      {displayProvinceName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Kab/Kota:</span>
                    <span className="text-white font-medium">
                      {displayRegencyName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Kecamatan:</span>
                    <span className="text-white font-medium">
                      {displayDistrictName}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-800/30 border-gray-700/30 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden min-h-[400px] lg:min-h-0">
          <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-gray-700/30 p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Map className="h-5 w-5 text-blue-300" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-white">
                  Peta Cuaca
                </CardTitle>
                <p className="text-gray-400 text-xs mt-0.5">
                  Visualisasi cuaca lokasi terpilih.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-2 h-full">
            <div className="h-full min-h-[450px]">
              {selectedLocation &&
              typeof selectedLocation.latitude === 'number' &&
              typeof selectedLocation.longitude === 'number' ? (
                <WeatherMapIframe
                  selectedLocationCoords={{
                    lat: selectedLocation.latitude,
                    lng: selectedLocation.longitude,
                    name: selectedLocation.districtName,
                  }}
                  currentWeatherData={currentWeatherData}
                  loadingWeather={loadingWeather}
                  weatherError={weatherError}
                  height="100%"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-center text-gray-500 rounded-lg bg-gray-900/20">
                  <div>
                    <MapPin className="h-12 w-12 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white">
                      Pilih Lokasi
                    </h3>
                    <p className="text-sm">Peta cuaca akan muncul di sini.</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
