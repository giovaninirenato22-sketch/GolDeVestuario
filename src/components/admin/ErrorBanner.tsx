export function ErrorBanner({ mensaje }: { mensaje?: string }) {
  if (!mensaje) return null;

  return (
    <div className="text-body-small mb-6 rounded-md border border-error bg-error/10 px-4 py-3 text-fg">
      {mensaje}
    </div>
  );
}
