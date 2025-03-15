import type { Route } from './+types/home';
import { LNFMS } from '../components/LNFMS';

export function meta({ }: Route.MetaArgs) {
    return [{ title: 'LFNMS' }, { name: 'description', content: '능주고 분실물관리 시스템' }];
}

export default function Home() {
    return <LNFMS />;
}