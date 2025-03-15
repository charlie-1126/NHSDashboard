import { type RouteConfig, route, index } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('/signin', './routes/signin.tsx'),
  route('/dashboard', './routes/dashboard.tsx'),
  route('/LNFMS', './routes/LNFMS.tsx'),
] satisfies RouteConfig;
