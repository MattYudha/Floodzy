'use client';

import React, { useState, useEffect } from 'react';
import { LatLng } from 'leaflet';
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
  onSubmit: (formData: { waterLevel: number; notes: string; image?: File }) => void;
  location: LatLng | null;
}

const formSchema = z.object({
  waterLevel: z.number().min(0).max(300),
  notes: z.string().min(10, { message: "Catatan harus memiliki setidaknya 10 karakter." }).max(500, { message: "Catatan tidak boleh lebih dari 500 karakter." }),
  image: z.any().optional(), // Will handle File object separately
});

export default function ReportFloodModal({
  isOpen,
  onOpenChange,
  onSubmit,
  location,
}: ReportFloodModalProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      waterLevel: 50,
      notes: "",
      image: undefined,
    },
  });

  const [currentWaterLevel, setCurrentWaterLevel] = useState(form.getValues("waterLevel"));

  useEffect(() => {
    if (isOpen) {
      form.reset();
      setCurrentWaterLevel(form.getValues("waterLevel"));
    }
  }, [isOpen, form]);

  function handleSubmit(values: z.infer<typeof formSchema>) {
    const imageFile = values.image && values.image.length > 0 ? values.image[0] : undefined;
    onSubmit({
      waterLevel: values.waterLevel,
      notes: values.notes,
      image: imageFile,
    });
    onOpenChange(false); // Close modal after submission
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" aria-labelledby="report-flood-dialog-title" aria-describedby="report-flood-dialog-description">
        <DialogHeader>
          <DialogTitle id="report-flood-dialog-title">Lapor Banjir di Lokasi Pilihan</DialogTitle>
          <DialogDescription id="report-flood-dialog-description">
            Laporkan detail banjir di koordinat: {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'N/A'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4" aria-labelledby="report-flood-dialog-title">
            <FormField
              control={form.control}
              name="waterLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ketinggian Air ({currentWaterLevel} cm)</FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={300}
                      step={10}
                      value={[field.value]}
                      onValueChange={(val) => {
                        field.onChange(val[0]);
                        setCurrentWaterLevel(val[0]);
                      }}
                      className="w-[100%]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catatan</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Deskripsikan kondisi banjir..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Unggah Gambar (Opsional)</FormLabel>
                  <FormControl>
                    <Input
                      {...fieldProps}
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        onChange(event.target.files);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Batal
              </Button>
              <Button type="submit">Kirim Laporan</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
