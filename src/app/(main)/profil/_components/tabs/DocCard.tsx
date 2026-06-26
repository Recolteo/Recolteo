"use client";

import { useState, useEffect, useRef } from "react";
import { FileText, Check } from "@deemlol/next-icons";
import { DOC_LABELS, type DocType } from "@/src/lib/supabase/documents-types";
import { DownloadAction, DeleteAction, UploadAction } from "@/src/components/ui/docs/DocAction";

export default function DocCard({ type, onChanged }: { type: DocType; onChanged: () => void }) {
  const [exists, setExists] = useState<boolean | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`/api/docs/${type}`, { method: "HEAD" })
      .then((r) => setExists(r.ok))
      .catch(() => setExists(false));
  }, [type]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.set("file", file);
    const res = await fetch(`/api/docs/${type}`, { method: "POST", body: form });
    if (res.ok) {
      setExists(true);
      onChanged();
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDelete = async () => {
    setDeleting(true);
    await fetch(`/api/docs/${type}`, { method: "DELETE" });
    setExists(false);
    setDeleting(false);
    onChanged();
  };

  const checking = exists === null;

  return (
    <div className="flex items-center gap-4 py-5 border-b border-sapin/8 last:border-0">
      <div className="w-12 h-12 rounded-xl bg-lime border border-sapin shadow-[2px_2px_0_0_#06573F] flex items-center justify-center shrink-0">
        {checking
          ? <div className="w-4 h-4 rounded-full border-2 border-sapin/30 border-t-sapin animate-spin" />
          : exists
          ? <Check size={18} className="text-sapin" />
          : <FileText size={18} className="text-sapin" />}
      </div>
      <div className="flex-1 min-w-0">
        <span className="block font-black text-sapin leading-tight text-xl">{DOC_LABELS[type]}</span>
        <div className="flex items-center gap-1.5 mt-1.5">
          <div className={`w-2 h-2 rounded-full shrink-0 ${exists ? "bg-lime border border-sapin/30" : "bg-sapin/15"}`} />
          <span className="text-sm text-sapin/60 font-medium">
            {checking ? "Vérification…" : exists ? "Document déposé" : "Non déposé · PDF uniquement"}
          </span>
        </div>
      </div>
      <div className="flex gap-1.5 shrink-0">
        {exists ? (
          <>
            <DownloadAction href={`/api/docs/${type}`} />
            <DeleteAction onDelete={handleDelete} loading={deleting} />
          </>
        ) : (
          <UploadAction onClick={() => inputRef.current?.click()} loading={uploading} />
        )}
        <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={handleUpload} />
      </div>
    </div>
  );
}
