"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Label } from "@/components/ui/label";

interface CompanyLogoInputProps {
  defaultLogo?: string;
}

export default function CompanyLogoInput({ defaultLogo }: CompanyLogoInputProps) {
   const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (defaultLogo) {
      // next/image requires absolute path or public-relative path
      setPreview(defaultLogo.startsWith("/") ? defaultLogo : `/${defaultLogo}`);
    }
  }, [defaultLogo]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreview(url);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreview(url);

    if (inputRef.current) {
      const dt = new DataTransfer();
      dt.items.add(file);
      inputRef.current.files = dt.files;
    }
  }

  return (
    <div>
      <Label className="mb-2">Logo</Label>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-blue-400"
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <Image
            src={preview}
            width={100}
            height={100}
            alt="Company Logo"
            className="rounded shadow"
            onError={() => setPreview(null)} 
          />
        ) : (
          <p className="text-sm text-gray-400">Drag & drop logo here or click to select</p>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        name="logo"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
