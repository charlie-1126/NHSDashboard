import { type RouteConfig, route, index } from '@react-router/dev/routes';

export default [
  index('./routes/home.tsx'),
  route('/login', './routes/login.tsx'),
  route('/dashboard', './routes/dashboard.tsx'),
  route('/LNFMS', './routes/LNFMS.tsx'),
  route('/item/:id', './routes/item.tsx'),
] satisfies RouteConfig;
