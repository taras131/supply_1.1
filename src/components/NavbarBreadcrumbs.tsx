import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Breadcrumbs, Typography, styled } from '@mui/material';
import { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import {IRouteConfig, routesConfig} from "../config/routes";

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: 'center',
  },
}));

interface BreadcrumbItem {
  label: string;
  path: string;
  isLast: boolean;
}

export default function NavbarBreadcrumbs() {
  const location = useLocation();

  // Функция для поиска роута по пути
  const findRouteByPath = (path: string, routes: IRouteConfig[]): IRouteConfig | null => {
    for (const route of routes) {
      // Пропускаем wildcard роуты
      if (route.path === "*" || route.path === "/*") {
        continue;
      }

      // Точное соответствие пути
      if (route.path === path) {
        return route;
      }

      // Поиск в детях
      if (route.children) {
        const childRoute = findRouteByPath(path, route.children);
        if (childRoute) return childRoute;
      }

      // Проверка динамических роутов (например, /invoices/:id)
      // Только если путь содержит параметры
      if (route.path.includes(':')) {
        try {
          const dynamicRoutePattern = route.path.replace(/:[^/]+/g, '[^/]+');
          const regex = new RegExp(`^${dynamicRoutePattern}$`);
          if (regex.test(path)) {
            return route;
          }
        } catch (error) {
          console.warn(`Invalid route pattern: ${route.path}`);
          continue;
        }
      }
    }
    return null;
  };

  // Функция для поиска родительского роута
  const findParentRoute = (targetPath: string, routes: IRouteConfig[]): IRouteConfig | null => {
    for (const route of routes) {
      if (route.children) {
        for (const child of route.children) {
          if (child.path === targetPath) {
            return route;
          }
        }
        // Рекурсивный поиск в детях
        const found = findParentRoute(targetPath, route.children);
        if (found) return route;
      }
    }
    return null;
  };

  // Функция для построения иерархии хлебных крошек
  const buildBreadcrumbs = (): BreadcrumbItem[] => {
    const currentPath = location.pathname;
    const breadcrumbs: BreadcrumbItem[] = [];

    // Найти текущий роут
    const currentRoute = findRouteByPath(currentPath, routesConfig);

    if (!currentRoute) {
      // Если роут не найден, показываем базовую навигацию
      breadcrumbs.push({
        label: 'Главная',
        path: '/',
        isLast: false
      });
      breadcrumbs.push({
        label: 'Страница не найдена',
        path: currentPath,
        isLast: true
      });
      return breadcrumbs;
    }

    // Строим иерархию от корня к текущей странице
    const buildHierarchy = (route: IRouteConfig): BreadcrumbItem[] => {
      const hierarchy: BreadcrumbItem[] = [];

      // Найти родителя
      const parent = findParentRoute(route.path, routesConfig);
      if (parent && parent.path !== route.path) {
        hierarchy.push(...buildHierarchy(parent));
        hierarchy.push({
          label: parent.label,
          path: parent.path,
          isLast: false
        });
      }

      return hierarchy;
    };

    // Получить всю иерархию
    const hierarchy = buildHierarchy(currentRoute);

    // Добавить главную страницу в начало, если её нет
    if (hierarchy.length === 0 || hierarchy[0].path !== '/') {
      const homeRoute = findRouteByPath('/', routesConfig);
      if (homeRoute && currentRoute.path !== '/') {
        breadcrumbs.push({
          label: homeRoute.label,
          path: homeRoute.path,
          isLast: false
        });
      }
    }

    // Добавить иерархию
    breadcrumbs.push(...hierarchy);

    // Добавить текущую страницу
    breadcrumbs.push({
      label: currentRoute.label,
      path: currentRoute.path,
      isLast: true
    });

    return breadcrumbs;
  };

  const breadcrumbs = buildBreadcrumbs();

  return (
      <StyledBreadcrumbs
          aria-label="breadcrumb"
          separator={<NavigateNextRoundedIcon fontSize="small" />}
      >
        {breadcrumbs.map((crumb, index) => (
            crumb.isLast ? (
                <Typography
                    key={`${crumb.path}-${index}`}
                    variant="body1"
                    sx={{ color: 'text.primary', fontWeight: 600 }}
                >
                  {crumb.label}
                </Typography>
            ) : (
                <Link
                    key={`${crumb.path}-${index}`}
                    to={crumb.path}
                    style={{
                      textDecoration: 'none',
                      color: 'inherit'
                    }}
                >
                  <Typography
                      variant="body1"
                      sx={{
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                  >
                    {crumb.label}
                  </Typography>
                </Link>
            )
        ))}
      </StyledBreadcrumbs>
  );
}