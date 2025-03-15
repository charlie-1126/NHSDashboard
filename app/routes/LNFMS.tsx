import type { Route } from './+types/home';
import { LNFMS } from '../components/LNFMS';
// import { redirect } from 'react-router';
// import { sessionStorage } from '~/auth.server';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'LFNMS' }, { name: 'description', content: '능주고 분실물관리 시스템' }];
}

// export async function loader({ request }: Route.LoaderArgs) {
//   let session = await sessionStorage.getSession(request.headers.get('cookie'));
//   let user = session.get('user');
//   if (!user) return redirect('/loginq');
//   return;
// }

export default function home() {
  return <LNFMS />;
}
