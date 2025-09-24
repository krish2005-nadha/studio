import { Header } from '@/components/layout/header';
import SkyShieldClient from '@/components/sky-shield/sky-shield-client';
import { Footer } from '@/components/layout/footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background/80 backdrop-blur-sm text-foreground">
      <Header />
      <main className="flex-1">
        <SkyShieldClient />
      </main>
      <Footer />
    </div>
  );
}
