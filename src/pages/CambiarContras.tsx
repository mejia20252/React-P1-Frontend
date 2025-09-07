// src/pages/ChangePassword.tsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../app/axiosInstance";
import { toUiError } from "../api/error"; // ⬅️ helper centralizado
import { useAuth } from "../contexts/AuthContext";

type FormState = {
  current_password: string;
  new_password: string;
  confirm_new_password: string;
};
export type ChangePasswordPayload = {
  current_password?: string;
  new_password: string;
  confirm_new_password: string;
};

export async function changePassword(userId: number, payload: ChangePasswordPayload): Promise<void> {
  await axiosInstance.post(`/usuarios/${userId}/set-password/`, payload, {
    validateStatus: (s) => s >= 200 && s < 300,
  });
}

// Pequeños componentes de iconos (SVG inline)
function EyeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth="2" d="M1.5 12S5 5.5 12 5.5 22.5 12 22.5 12 19 18.5 12 18.5 1.5 12 1.5 12Z" />
      <circle cx="12" cy="12" r="3.5" strokeWidth="2" />
    </svg>
  );
}
function EyeSlashIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth="2" d="M3 3l18 18" />
      <path strokeWidth="2" d="M1.5 12S5 5.5 12 5.5c2.23 0 4.14.58 5.74 1.45M22.5 12S19 18.5 12 18.5c-2.23 0-4.14-.58-5.74-1.45" />
      <path strokeWidth="2" d="M9.5 9.5A3.5 3.5 0 0012 15.5c.51 0 1-.11 1.45-.3" />
    </svg>
  );
}

export default function ChangePassword() {
  const nav = useNavigate();
  const { user: authUser, signout } = useAuth();

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [fieldErrs, setFieldErrs] = useState<Record<string, string[]>>({});

  const [form, setForm] = useState<FormState>({
    current_password: "",
    new_password: "",
    confirm_new_password: "",
  });

  // Estados para mostrar/ocultar cada campo
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Solo usamos el id del AuthContext
  const myId = useMemo(() => authUser?.id ?? null, [authUser]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
    // Si se edita un campo, limpiamos su error específico para mejor UX
    if (fieldErrs[e.target.name]) {
      const { [e.target.name]: _removed, ...rest } = fieldErrs;
      setFieldErrs(rest);
    }
  };

  const validate = (): string | null => {
    if (!form.current_password || form.current_password.length < 1) {
      return "Debes ingresar tu contraseña actual.";
    }
    if (!form.new_password || form.new_password.length < 6) {
      return "La nueva contraseña debe tener al menos 6 caracteres.";
    }
    if (form.new_password === form.current_password) {
      return "La nueva contraseña no puede ser igual a la actual.";
    }
    if (form.new_password !== form.confirm_new_password) {
      return "La confirmación no coincide.";
    }
    return null;
  };

  const hs = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setOk(null);
    setFieldErrs({});

    const clientErr = validate();
    if (clientErr) {
      setErr(clientErr);
      return;
    }
    if (!myId) {
      setErr("No se pudo identificar al usuario.");
      return;
    }

    try {
      setLoading(true);
      await changePassword(myId, {
        current_password: form.current_password,
        new_password: form.new_password,
        confirm_new_password: form.confirm_new_password,
      });
      setOk("Contraseña actualizada. Vuelve a iniciar sesión.");
      setTimeout(() => {
        signout?.();
        nav("/login");
      }, 800);
    } catch (error) {
      const ui = toUiError(error);
      setErr(ui.message || "No se pudo cambiar la contraseña.");
      setFieldErrs(ui.fields ?? {});
    } finally {
      setLoading(false);
    }
  };

  // Helper para mostrar errores bajo inputs
  const renderFieldError = (name: keyof FormState) =>
    fieldErrs?.[name]?.length ? (
      <p className="text-xs text-red-600 mt-1">{fieldErrs[name].join(" ")}</p>
    ) : null;

  // Botón reutilizable de mostrar/ocultar
  const ToggleBtn = ({
    shown,
    onClick,
    labelShown = "Ocultar contraseña",
    labelHidden = "Mostrar contraseña",
  }: {
    shown: boolean;
    onClick: () => void;
    labelShown?: string;
    labelHidden?: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      aria-label={shown ? labelShown : labelHidden}
      className="absolute inset-y-0 right-2 flex items-center p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
      title={shown ? labelShown : labelHidden}
    >
      {shown ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
    </button>
  );

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold mb-4">Cambiar contraseña</h1>

      <form noValidate onSubmit={hs} className="space-y-4">
        {/* Contraseña actual */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="current_password">
            Contraseña actual
          </label>
          <div className="relative">
            <input
              id="current_password"
              name="current_password"
              type={showCurrent ? "text" : "password"}
              autoComplete="current-password"
              className="w-full rounded-md border px-3 py-2 pr-10 outline-none focus:ring"
              value={form.current_password}
              onChange={onChange}
              required
            />
            <ToggleBtn shown={showCurrent} onClick={() => setShowCurrent((s) => !s)} />
          </div>
          {renderFieldError("current_password")}
        </div>

        {/* Nueva contraseña */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="new_password">
            Nueva contraseña
          </label>
          <div className="relative">
            <input
              id="new_password"
              name="new_password"
              type={showNew ? "text" : "password"}
              autoComplete="new-password"
              className="w-full rounded-md border px-3 py-2 pr-10 outline-none focus:ring"
              value={form.new_password}
              onChange={onChange}
              required
              minLength={6}
            />
            <ToggleBtn shown={showNew} onClick={() => setShowNew((s) => !s)} />
          </div>
          <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres.</p>
          {renderFieldError("new_password")}
        </div>

        {/* Confirmar nueva contraseña */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="confirm_new_password">
            Confirmar nueva contraseña
          </label>
          <div className="relative">
            <input
              id="confirm_new_password"
              name="confirm_new_password"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              className="w-full rounded-md border px-3 py-2 pr-10 outline-none focus:ring"
              value={form.confirm_new_password}
              onChange={onChange}
              required
            />
            <ToggleBtn shown={showConfirm} onClick={() => setShowConfirm((s) => !s)} />
          </div>
          {renderFieldError("confirm_new_password")}
        </div>

        {err && (
          <div className="rounded-md bg-red-50 border border-red-200 text-red-700 p-3 text-sm">
            {err}
          </div>
        )}
        {ok && (
          <div className="rounded-md bg-green-50 border border-green-200 text-green-700 p-3 text-sm">
            {ok}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-blue-600 text-white py-2 font-medium hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Guardando..." : "Cambiar contraseña"}
        </button>
      </form>

      {/* Botones de navegación de tu ejemplo */}
      <button onClick={() => { nav(-1); }} className="mt-4 underline">vakkj</button>
      <br />
      <button onClick={() => { nav('/administrador/dashboard'); }} className="underline">cacel</button>
    </div>
  );
}