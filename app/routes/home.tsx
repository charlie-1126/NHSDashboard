import type { Route } from './+types/home';
import { Main } from '../components/main';
import { LNFCard } from '../components/ui/LNF_card';

export function meta({ }: Route.MetaArgs) {
  return [{ title: 'NHS Dashboard' }, { name: 'description', content: '능주고 대시보드' }];
}

export default function Home() {
  return <Main />;
}
