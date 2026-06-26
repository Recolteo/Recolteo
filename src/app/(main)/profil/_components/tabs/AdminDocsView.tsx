"use client";

import { useState, useEffect } from "react";
import { Shield } from "@deemlol/next-icons";
import { getAdminAllDocuments } from "@/src/lib/supabase/documents";
import { DOC_LABELS, type UserDocEntry } from "@/src/lib/supabase/documents-types";

export default function AdminDocsView() {
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
