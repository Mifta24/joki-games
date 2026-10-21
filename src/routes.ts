import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("joki/:slug", "routes/game.tsx"),
  route("cara-order", "routes/cara-order.tsx"),
  route("syarat-ketentuan", "routes/syarat-ketentuan.tsx"),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
