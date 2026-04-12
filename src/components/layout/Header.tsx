type HeaderProps = {
  titulo: string;
  subtitulo?: string;
};

export function Header({ titulo, subtitulo }: HeaderProps) {
  return (
    <header className="border-b border-neutral-200 bg-white px-4 py-4 sm:px-8">
      <h1 className="text-xl font-bold text-emerald-950 sm:text-2xl">{titulo}</h1>
      {subtitulo ? <p className="mt-1 text-base text-neutral-600">{subtitulo}</p> : null}
    </header>
  );
}
