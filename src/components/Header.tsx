import { auth } from '@/lib/auth';
import HeaderClient from './HeaderClient';

function formatDateFr(date: Date): string {
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function Header() {
  const session = await auth();
  const userName = session?.user?.name ?? null;
  const formattedDate = formatDateFr(new Date());

  return <HeaderClient formattedDate={formattedDate} userName={userName} />;
}
