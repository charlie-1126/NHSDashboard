import type { Route } from './+types/home';
import { Dashboard } from '../components/dashboard';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'NHS Dashboard' }, { name: 'description', content: '능주고 대시보드' }];
}

export default function Home() {
  return <Dashboard />;
}
