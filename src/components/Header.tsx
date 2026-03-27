import { auth } from '@/lib/auth';
import { formatDateFr } from '@/utils/formatDate';
import HeaderClient from './HeaderClient';

export default async function Header() {
  const session = await auth();
  const userName = session?.user?.name ?? null;
  const formattedDate = formatDateFr(new Date());

  return <HeaderClient formattedDate={formattedDate} userName={userName} />;
}
