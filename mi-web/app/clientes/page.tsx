"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Lock, Mail, ArrowLeft, AlertCircle } from "lucide-react";
import Isotipo from "@/components/Isotipo";
import { loginCliente } from "./actions";

export default function ClientesLoginPage() {
  const [state, formAction, isPending] = useActionState(loginCliente, null);

  return (
    <div className="min-h-screen bg-[#0B192C] flex flex-col justify-center items-center px-6 py-12 text-white">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-4 transition">
            <ArrowLeft className="w-4 h-4" /> Volver al inicio
          </Link>
          <div className="flex justify-center">
            <Isotipo className="h-28 w-auto" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight pt-2">
            Portal de Clientes <span className="text-red-500">EnergyProyec</span>
          </h1>
          <p className="text-slate-400 text-sm">
            Ingresa tus credenciales para consultar el avance de tus proyectos eléctricos.
          </p>
        </div>

        <form action={formAction} className="bg-slate-900/90 border border-slate-800 p-8 rounded-2xl shadow-2xl space-y-6">
          {state?.error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3.5 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 block">Correo Corporativo</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                name="email"
                required
                placeholder="correo@empresa.com"
                className="w-full bg-slate-950 border border-slate-800 focus:border-red-500 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white outline-none transition"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 block">Contraseña</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 focus:border-red-500 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white outline-none transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition shadow-lg shadow-red-600/20 cursor-pointer"
          >
            {isPending ? "Verificando acceso..." : "Ingresar al Portal"}
          </button>

          <p className="text-[11px] text-slate-400 text-center leading-relaxed pt-1">
            Al ingresar o iniciar sesión, aceptas nuestros{" "}
            <Link
              href="/terminos-y-condiciones" target="_blank" rel="noopener noreferrer"
              className="text-red-400 hover:text-red-300 underline underline-offset-2 font-medium transition"
            >
              Términos y Condiciones y Política de Tratamiento de Datos (Ley 1581 de 2012)
            </Link>
            .
          </p>
        </form>
      </div>
    </div>
  );
}