//oRPC客户端和路由器TanStack Query：获取用户信息，数据放入路由器的 context
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";

import { ErrorScreen } from "./components/layout/error-screen";
import { LoadingScreen } from "./components/layout/loading-screen";
import { NotFoundScreen } from "./components/layout/not-found-screen";
import { getSession } from "./integrations/auth/functions";
import { client, orpc } from "./integrations/orpc/client";
import { getQueryClient } from "./integrations/query/client";
import { routeTree } from "./routeTree.gen";
import { getLocale, loadLocale } from "./utils/locale";
import { getTheme } from "./utils/theme";

export const getRouter = async () => {
  const queryClient = getQueryClient();
  //预取全局数据
  const [theme, locale, session, flags] = await Promise.all([
    getTheme(),
    getLocale(),
    getSession(),
    client.flags.get(),
  ]);

  await loadLocale(locale);
  //创建路由实例
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultViewTransition: true,
    defaultStructuralSharing: true,
    defaultErrorComponent: ErrorScreen,
    defaultPendingComponent: LoadingScreen,
    defaultNotFoundComponent: NotFoundScreen,
    context: { orpc, queryClient, theme, locale, session, flags },
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
    handleRedirects: true,
    wrapQueryClient: true,
  });

  return router;
};
