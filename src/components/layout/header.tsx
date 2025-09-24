import { Rainbow } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Rainbow className="h-7 w-7 text-primary" />
          <h1 className="text-xl font-bold tracking-tighter text-foreground">
            Will It Rain On My Pride?
          </h1>
        </div>
      </div>
    </header>
  );
}
