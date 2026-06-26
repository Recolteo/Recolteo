"use client";

import Link from "next/link";
import { Clock, Users, CheckSquare } from "@deemlol/next-icons";
import Reveal from "@/src/components/animations/Reveal";

interface AdminLandingProps {
  adminPrenom: string;
  adminNom: string;
  pendingTotal: number;
  totalStructures: number;
  pendingCollects: number;
}

export default function AdminLanding({
  adminPrenom,
  adminNom,
  pendingTotal,
  totalStructures,
  pendingCollects,
}: AdminLandingProps) {
  return (
    <div className="flex flex-col gap-12">
      <Reveal delay={0}>
        <div>
          <h1 className="text-sapin font-black">
            Bonjour{" "}
            <span className="relative italic whitespace-nowrap ml-4">
              <span
                className="absolute inset-0 bg-lime rounded-xl -rotate-1 scale-x-110"
                aria-hidden="true"
              />
              <span className="relative">
                {adminPrenom} {adminNom}
              </span>
            </span>
          </h1>
          <p className="text-sapin mt-4">Que souhaitez-vous faire ?</p>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/admin/validation" className="group block">
            <div className="flex items-start gap-5 bg-lime/5 border border-sapin rounded-2xl shadow-[4px_4px_0_0_#06573F] px-6 py-5 transition-all duration-200 group-hover:-translate-y-1">
              <div className="w-10 h-10 bg-lime border border-sapin rounded-xl shadow-[2px_2px_0_0_#06573F] flex items-center justify-center shrink-0 text-sapin mt-0.5">
                <Clock size={20} />
              </div>
              <div className="flex-1">
                <h2 className="text-sapin font-bold text-base mb-1">Validations en attente</h2>
                <p className="text-sapin/60 text-sm leading-relaxed">
                  Approuver ou rejeter les nouveaux inscrits
                </p>
              </div>
              {pendingTotal > 0 && (
                <span className="px-2.5 py-0.5 bg-peach text-cream text-sm font-bold rounded-full shrink-0 self-center">
                  {pendingTotal}
                </span>
              )}
            </div>
          </Link>

          <Link href="/admin/structures" className="group block">
            <div className="flex items-start gap-5 bg-lime/5 border border-sapin rounded-2xl shadow-[4px_4px_0_0_#06573F] px-6 py-5 transition-all duration-200 group-hover:-translate-y-1">
              <div className="w-10 h-10 bg-lime border border-sapin rounded-xl shadow-[2px_2px_0_0_#06573F] flex items-center justify-center shrink-0 text-sapin mt-0.5">
                <Users size={20} />
              </div>
              <div className="flex-1">
                <h2 className="text-sapin font-bold text-base mb-1">Toutes les structures</h2>
                <p className="text-sapin/60 text-sm leading-relaxed">
                  Accéder aux données et documents de tous les inscrits
                </p>
              </div>
              <span className="px-2.5 py-0.5 bg-sapin/10 text-sapin text-sm font-bold rounded-full shrink-0 self-center">
                {totalStructures}
              </span>
            </div>
          </Link>

          <Link href="/admin/collectes" className="group block">
            <div className="flex items-start gap-5 bg-lime/5 border border-sapin rounded-2xl shadow-[4px_4px_0_0_#06573F] px-6 py-5 transition-all duration-200 group-hover:-translate-y-1">
              <div className="w-10 h-10 bg-lime border border-sapin rounded-xl shadow-[2px_2px_0_0_#06573F] flex items-center justify-center shrink-0 text-sapin mt-0.5">
                <CheckSquare size={20} />
              </div>
              <div className="flex-1">
                <h2 className="text-sapin font-bold text-base mb-1">Collectes en attente</h2>
                <p className="text-sapin/60 text-sm leading-relaxed">
                  Valider une collecte au nom du commerçant ou de l'association
                </p>
              </div>
              {pendingCollects > 0 && (
                <span className="px-2.5 py-0.5 bg-peach text-cream text-sm font-bold rounded-full shrink-0 self-center">
                  {pendingCollects}
                </span>
              )}
            </div>
          </Link>

        </div>
      </Reveal>
    </div>
  );
}
