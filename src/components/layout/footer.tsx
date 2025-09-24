'use client';

import { useState, useEffect } from 'react';

export function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="p-4 text-center text-sm text-muted-foreground">
      <p>&copy; {year} SkyShield. All rights reserved.</p>
    </footer>
  );
}
