"use client";

import { useState, useEffect, useRef } from "react";
import { FileText, Check, Shield } from "@deemlol/next-icons";
import { createClient } from "@/src/lib/supabase/client";
import { getAdminAllDocuments } from "@/src/lib/supabase/documents";
import { BUCKET, DOC_LABELS, type DocType, type UserDocEntry } from "@/src/lib/supabase/documents-types";
import { DownloadAction, DeleteAction, UploadAction } from "@/src/components/ui/DocAction";
import { syncDocUpload, syncDocDelete } from "@/src/app/(main)/profil/doc-actions";

const DOC_TYPES: DocType[] = ["rib", "kbis", "identite"];

function DocCard({ type, authId }: { type: DocType; authId: string }) {
  const supabase = useRef(createClient()).current;
  const [url, setUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [checking, setChecking] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      const { data: files } = await supabase.storage.from(BUCKET).list(authId, { search: `${type}.pdf` });
      if (!files?.length) { setChecking(false); return; }
      const { data } = await supabase.storage.from(BUCKET).createSignedUrl(`${authId}/${type}.pdf`, 3600);
      setUrl(data?.signedUrl ?? null);
      setChecking(false);
    })();
  }, [authId, type]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const path = `${authId}/${type}.pdf`;
    await supabase.storage.from(BUCKET).upload(path, file, { upsert: true });
    const { data } = await supabase.storage.from(BUCKET).createSignedUrl(path, 3600);
    setUrl(data?.signedUrl ?? null);
    await syncDocUpload(type, path);
    setUploading(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    await supabase.storage.from(BUCKET).remove([`${authId}/${type}.pdf`]);
    await syncDocDelete(type);
    setUrl(null);
    setDeleting(false);
  };

  return (
    <div className="flex items-center gap-4 py-5 border-b border-sapin/8 last:border-0">
      <div className="w-12 h-12 rounded-xl bg-lime border border-sapin shadow-[2px_2px_0_0_#06573F] flex items-center justify-center shrink-0">
        {checking
          ? <div className="w-4 h-4 rounded-full border-2 border-sapin/30 border-t-sapin animate-spin" />
          : url ? <Check size={18} className="text-sapin" />
          : <FileText size={18} className="text-sapin" />}
      </div>
      <div className="flex-1 min-w-0">
        <span className="block font-black text-sapin leading-tight text-xl">{DOC_LABELS[type]}</span>
        <div className="flex items-center gap-1.5 mt-1.5">
          <div className={`w-2 h-2 rounded-full shrink-0 ${url ? "bg-lime border border-sapin/30" : "bg-sapin/15"}`} />
          <span className="text-sm text-sapin/60 font-medium">
            {checking ? "Vérification…" : url ? "Document déposé" : "Non déposé · PDF uniquement"}
          </span>
        </div>
      </div>
      <div className="flex gap-1.5 shrink-0">
        {url ? (
          <>
            <DownloadAction href={url} />
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

function AdminDocsView() {
  const [entries, setEntries] = useState<UserDocEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminAllDocuments().then((data) => { setEntries(data); setLoading(false); });
  }, []);

  if (loading)
    return <div className="flex items-center justify-center py-16"><div className="w-6 h-6 rounded-full border-2 border-sapin/20 border-t-sapin animate-spin" /></div>;

  if (!entries.length)
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <Shield size={28} className="text-sapin/20" />
        <p className="text-sapin/40 font-semibold">Aucun document déposé.</p>
      </div>
    );

  return (
    <div className="flex flex-col gap-6">
      {entries.map((entry) => (
        <div key={entry.authId}>
          <p className="font-bold text-sapin">{entry.nom}</p>
          <p className="text-[11px] text-sapin/40 mb-2">{entry.email}</p>
          <div className="flex flex-wrap gap-2">
            {entry.docs.map((doc) => (
              <a key={doc.type} href={doc.url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-sapin/15 text-sapin text-xs font-semibold hover:bg-sapin hover:text-cream transition-all">
                {DOC_LABELS[doc.type]}
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DocsTab({ role, authId }: { role: "commercant" | "association" | "admin"; authId: string }) {
  if (role === "admin") return <AdminDocsView />;
  return (
    <div>
      <p className="text-sapin/50 mb-5">
        Vos documents sont sécurisés et accessibles uniquement par l'équipe Récoltéo.
      </p>
      {DOC_TYPES.map((type) => <DocCard key={type} type={type} authId={authId} />)}
    </div>
  );
}
