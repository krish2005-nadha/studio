import { Header } from '@/components/layout/header';
import SkyShieldClient from '@/components/sky-shield/sky-shield-client';

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background/80 backdrop-blur-sm text-foreground">
      <Header />
      <main className="flex-1">
        <SkyShieldClient />
      </main>
      <footer className="p-4 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} SkyShield. All rights reserved.</p>
      </footer>
    </div>
  );
}
