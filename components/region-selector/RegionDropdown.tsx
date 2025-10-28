// src/components/region-selector/RegionDropdown.tsx
'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRegionData } from '@/hooks/useRegionData';
import {
  Frown,
  MapPin,
  Building2,
  Globe,
  Map,
  CheckCircle,
  Loader2,
  ChevronDown,
  Search,
  ArrowRight,
} from 'lucide-react';
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
import { CombinedWeatherData } from '@/lib/api';
import { WeatherMapIframe } from '@/components/weather/WeatherMapIframe';
import { SelectedLocation } from '@/types/location';

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
      <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
        {icon}
        <span>{placeholder}</span>
        {loading && (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-400 ml-1" />
        )}
      </label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={`
              w-full h-11 px-4
              bg-gray-800 border border-gray-700 text-white rounded-lg
              hover:bg-gray-750 hover:border-gray-600
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-200
            `}
          >
            <div className="flex items-center justify-between w-full">
              <span
                className={`text-sm ${currentDisplayName ? 'text-white' : 'text-gray-400'}`}
              >
                {currentDisplayName || `Pilih ${placeholder}`}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
              />
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[--radix-popover-trigger-width] p-0 bg-gray-800 border border-gray-700 rounded-lg shadow-xl"
          align="start"
        >
          <Command className="bg-transparent">
            <div className="px-3 py-2 border-b border-gray-700">
              <CommandInput
                placeholder={`Cari ${placeholder.toLowerCase()}...`}
                className="h-9 border-0 bg-transparent text-white placeholder:text-gray-500 focus:ring-0"
              />
            </div>

            <CommandEmpty>
              <div className="flex flex-col items-center justify-center py-6 text-gray-400">
                <Search className="h-8 w-8 mb-2 opacity-40" />
                <p className="text-sm">Tidak ditemukan</p>
              </div>
            </CommandEmpty>

            <CommandList className="max-h-64 overflow-auto">
              <CommandGroup>
                {loading ? (
                  <div className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-blue-400">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Memuat...</span>
                    </div>
                  </div>
                ) : (
                  data.map((item) => (
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
                        cursor-pointer py-2.5 px-3 mx-2 my-0.5 rounded-md
                        hover:bg-gray-700/50
                        ${selectedValue === String(item[valueKey]) ? 'bg-blue-500/10 text-blue-400' : 'text-white'}
                      `}
                    >
                      <div className="flex items-center justify-between w-full gap-2">
                        <span className="text-sm truncate">
                          {item[nameKey]}
                        </span>
                        {selectedValue === String(item[valueKey]) && (
                          <CheckCircle className="h-4 w-4 text-blue-400 flex-shrink-0" />
                        )}
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

export function RegionDropdown({
  onSelectDistrict,
  selectedLocation,
  currentWeatherData,
  loadingWeather,
  weatherError,
}: RegionDropdownProps) {
  const router = useRouter();
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

  useEffect(() => {
    if (selectedProvinceCode && provinces.length > 0) {
      const provinceName =
        provinces.find((p) => String(p.province_code) === selectedProvinceCode)
          ?.province_name || null;
      setDisplayProvinceName(provinceName);
    }
  }, [selectedProvinceCode, provinces]);

  useEffect(() => {
    if (selectedRegencyCode && regencies.length > 0) {
      const regencyName =
        regencies.find((r) => String(r.city_code) === selectedRegencyCode)
          ?.city_name || null;
      setDisplayRegencyName(regencyName);
    }
  }, [selectedRegencyCode, regencies]);

  useEffect(() => {
    if (selectedDistrictCode && districts.length > 0) {
      const districtName =
        districts.find(
          (d) => String(d.sub_district_code) === selectedDistrictCode,
        )?.sub_district_name || null;
      setDisplayDistrictName(districtName);
    }
  }, [selectedDistrictCode, districts]);

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
      className="bg-red-900/20 border-red-800 text-red-400"
    >
      <Frown className="h-4 w-4" />
      <AlertTitle className="text-sm font-semibold">Error</AlertTitle>
      <AlertDescription className="text-xs">{errorMessage}</AlertDescription>
    </Alert>
  );

  const isComplete =
    selectedDistrictCode &&
    displayProvinceName &&
    displayRegencyName &&
    displayDistrictName;

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-500 rounded-lg">
            <Globe className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Pilih Lokasi Wilayah
          </h1>
        </div>
        <p className="text-gray-400 text-sm ml-14">
          Tentukan wilayah untuk monitoring sistem deteksi banjir
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Card */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="border-b border-gray-700 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-blue-400" />
                <div>
                  <CardTitle className="text-lg font-semibold text-white">
                    Pilih Wilayah
                  </CardTitle>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Pilih dari provinsi hingga kecamatan
                  </p>
                </div>
              </div>

              {/* Progress Indicators */}
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-2 h-2 rounded-full transition-colors ${selectedProvinceCode ? 'bg-blue-500' : 'bg-gray-600'}`}
                />
                <div
                  className={`w-2 h-2 rounded-full transition-colors ${selectedRegencyCode ? 'bg-blue-500' : 'bg-gray-600'}`}
                />
                <div
                  className={`w-2 h-2 rounded-full transition-colors ${selectedDistrictCode ? 'bg-blue-500' : 'bg-gray-600'}`}
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            {/* Error Messages */}
            {errorProvinces && renderError(errorProvinces)}
            {errorRegencies && renderError(errorRegencies)}
            {errorDistricts && renderError(errorDistricts)}

            {/* Form Fields */}
            <div className="space-y-4">
              <RegionSelectField
                selectedValue={selectedProvinceCode}
                onValueChange={handleProvinceChange}
                placeholder="Provinsi"
                loading={loadingProvinces}
                disabled={loadingProvinces}
                data={provinces}
                icon={<Globe className="h-4 w-4 text-blue-400" />}
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
                icon={<Building2 className="h-4 w-4 text-blue-400" />}
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
                icon={<MapPin className="h-4 w-4 text-blue-400" />}
                valueKey="sub_district_code"
                nameKey="sub_district_name"
                currentDisplayName={displayDistrictName}
              />
            </div>

            {/* Success Summary */}
            {isComplete && (
              <div className="mt-6 p-4 bg-green-900/20 border border-green-800 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <h4 className="text-sm font-semibold text-green-400">
                    Lokasi Berhasil Dipilih
                  </h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Provinsi</span>
                    <span className="text-white font-medium">
                      {displayProvinceName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Kabupaten/Kota</span>
                    <span className="text-white font-medium">
                      {displayRegencyName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Kecamatan</span>
                    <span className="text-white font-medium">
                      {displayDistrictName}
                    </span>
                  </div>
                </div>
                <Link href="/#peta-banjir" passHref legacyBehavior>
                  <Button
                    className="w-full mt-4 bg-blue-500 hover:bg-blue-600"
                  >
                    <span className="flex items-center justify-center">
                      Lihat Peta Banjir
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </span>
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Map Card */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="border-b border-gray-700 pb-4">
            <div className="flex items-center gap-3">
              <Map className="h-5 w-5 text-blue-400" />
              <div>
                <CardTitle className="text-lg font-semibold text-white">
                  Peta Cuaca
                </CardTitle>
                <p className="text-xs text-gray-400 mt-0.5">
                  Visualisasi cuaca lokasi terpilih
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-2">
            <div className="h-[400px] lg:h-[500px]">
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
                <div className="flex flex-col items-center justify-center h-full bg-gray-900/30 rounded-lg">
                  <MapPin className="h-12 w-12 text-gray-600 mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Pilih Lokasi
                  </h3>
                  <p className="text-sm text-gray-400">
                    Peta cuaca akan ditampilkan di sini
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
