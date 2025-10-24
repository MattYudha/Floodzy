'use client';

import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';

interface ReportFloodModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (formData: {
    waterLevel: number;
    notes: string;
    image?: File;
  }) => void;
  location: any | null;
}

const formSchema = z.object({
  waterLevel: z.number().min(0).max(300),
  notes: z
    .string()
    .min(10, { message: 'Catatan harus memiliki setidaknya 10 karakter.' })
    .max(500, { message: 'Catatan tidak boleh lebih dari 500 karakter.' }),
  image: z.any().optional(),
});

export default function ReportFloodModal({
  isOpen,
  onOpenChange,
  onSubmit,
  location,
}: ReportFloodModalProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { waterLevel: 50, notes: '', image: undefined },
  });

  const [currentWaterLevel, setCurrentWaterLevel] = useState(
    form.getValues('waterLevel'),
  );

  useEffect(() => {
    if (isOpen) {
      form.reset({ waterLevel: 50, notes: '', image: undefined });
      setCurrentWaterLevel(50);
    }
  }, [isOpen, form]);

  function handleSubmit(values: z.infer<typeof formSchema>) {
    const imageFile =
      values.image && values.image.length > 0 ? values.image[0] : undefined;
    onSubmit({
      waterLevel: values.waterLevel,
      notes: values.notes,
      image: imageFile,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          sm:max-w-[520px] p-0 overflow-hidden
          bg-gradient-to-br from-white/40 via-white/30 to-white/20 
          dark:from-gray-900/40 dark:via-gray-900/30 dark:to-gray-900/20
          backdrop-blur-2xl backdrop-saturate-150
          rounded-[2rem] shadow-2xl 
          border border-white/40 dark:border-white/10
          transition-all duration-500 ease-out
          [box-shadow:0_8px_32px_0_rgba(31,38,135,0.15),inset_0_1px_0_0_rgba(255,255,255,0.3)]
          dark:[box-shadow:0_8px_32px_0_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.1)]
        "
      >
        {/* Glass Reflection Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent pointer-events-none rounded-[2rem]" />

        {/* Animated Gradient Background */}
        <div className="absolute inset-0 opacity-30 dark:opacity-20 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 p-8">
          <DialogHeader className="mb-6 space-y-3">
            {/* Icon Container with Liquid Glass Effect */}
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border border-white/30 dark:border-white/10 flex items-center justify-center shadow-lg mb-2">
              <svg
                className="w-8 h-8 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <DialogTitle
              id="report-flood-dialog-title"
              className="text-3xl font-bold text-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-gray-200 bg-clip-text text-transparent"
            >
              Lapor Banjir
            </DialogTitle>

            {/* Location Badge */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-white/30 dark:border-white/10 shadow-lg">
                <svg
                  className="w-4 h-4 text-blue-600 dark:text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {location
                    ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
                    : 'N/A'}
                </span>
              </div>
            </div>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              {/* Water Level Card */}
              <FormField
                control={form.control}
                name="waterLevel"
                render={({ field }) => (
                  <FormItem>
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-xl">
                      <FormLabel className="flex items-center justify-between mb-4">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Ketinggian Air
                        </span>
                        <div className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg">
                          <span className="text-lg font-bold text-white">
                            {currentWaterLevel} cm
                          </span>
                        </div>
                      </FormLabel>
                      <FormControl>
                        <div className="relative pt-2">
                          {/* Water Wave Visual */}
                          <div
                            className="absolute left-0 h-1 rounded-full bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 transition-all duration-300 shadow-lg"
                            style={{
                              width: `${(currentWaterLevel / 300) * 100}%`,
                            }}
                          >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-lg border-2 border-blue-500" />
                          </div>
                          <Slider
                            min={0}
                            max={300}
                            step={10}
                            value={[field.value]}
                            onValueChange={(val) => {
                              field.onChange(val[0]);
                              setCurrentWaterLevel(val[0]);
                            }}
                            className="mt-2"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs mt-2" />
                    </div>
                  </FormItem>
                )}
              />

              {/* Notes Card */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-xl">
                      <FormLabel className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Catatan
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Deskripsikan kondisi banjir secara detail..."
                          {...field}
                          className="min-h-[120px] bg-white/60 dark:bg-gray-900/40 rounded-xl border-white/30 dark:border-white/10 shadow-inner backdrop-blur-sm focus:ring-2 focus:ring-blue-400/50 resize-none text-gray-700 dark:text-gray-200 placeholder:text-gray-400"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs mt-2" />
                    </div>
                  </FormItem>
                )}
              />

              {/* Image Upload Card */}
              <FormField
                control={form.control}
                name="image"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-xl">
                      <FormLabel className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        Unggah Gambar
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                          (Opsional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...fieldProps}
                          type="file"
                          accept="image/*"
                          onChange={(event) => {
                            onChange(event.target.files);
                          }}
                          className="
                            file:mr-4 file:py-2.5 file:px-5 file:rounded-xl 
                            file:border-0 file:text-sm file:font-semibold
                            file:bg-gradient-to-r file:from-blue-500 file:to-cyan-500 
                            file:text-white file:shadow-lg
                            file:cursor-pointer file:transition-all file:duration-200
                            hover:file:shadow-xl hover:file:scale-105
                            bg-white/60 dark:bg-gray-900/40 
                            rounded-xl border-white/30 dark:border-white/10 
                            shadow-inner backdrop-blur-sm
                            text-gray-700 dark:text-gray-300
                          "
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs mt-2" />
                    </div>
                  </FormItem>
                )}
              />

              {/* Action Buttons */}
              <DialogFooter className="flex-col-reverse sm:flex-row gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="
                    flex-1 sm:flex-none rounded-2xl px-8 py-6 
                    bg-white/50 dark:bg-gray-800/50 
                    backdrop-blur-xl border-white/40 dark:border-white/10 
                    hover:bg-white/70 dark:hover:bg-gray-800/70
                    shadow-lg hover:shadow-xl
                    transition-all duration-200 
                    hover:scale-105 active:scale-95
                    font-semibold text-gray-700 dark:text-gray-300
                  "
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="
                    flex-1 sm:flex-none rounded-2xl px-8 py-6 
                    bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 
                    text-white font-bold shadow-xl 
                    hover:shadow-2xl hover:from-blue-600 hover:via-blue-700 hover:to-cyan-600
                    transition-all duration-200 
                    hover:scale-105 active:scale-95
                    border border-white/20
                  "
                >
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                    Kirim Laporan
                  </span>
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
