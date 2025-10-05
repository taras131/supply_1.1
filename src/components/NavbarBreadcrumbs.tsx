import React from 'react';
import {useLocation, Link, matchPath} from 'react-router-dom';
import { Breadcrumbs, Typography, styled } from '@mui/material';
import { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import {routes} from "../utils/routes";

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

// Конфигурация хлебных крошек с иерархией
const breadcrumbConfig: Record<string, { label: string; parent?: string }> = {
  [routes.main]: { label: 'Главная' },

  // Счета
  [routes.invoices]: { label: 'Счета', parent: routes.main },
  [routes.invoicesDetails]: { label: 'Подробности', parent: routes.invoices },
  [routes.invoicesAddNew]: { label: 'Новый счёт', parent: routes.invoices },

  // Поставщики
  [routes.suppliers]: { label: 'Поставщики', parent: routes.main },

  // Отгрузки
  [routes.shipments]: { label: 'Отгрузки', parent: routes.main },
  [routes.shipmentsAddNew]: { label: 'Новая отгрузка', parent: routes.shipments },

  // Заявки
  [routes.orders]: { label: 'Заявки', parent: routes.main },
  [routes.ordersDetails]: { label: 'Подробности', parent: routes.orders },
  [routes.ordersAddNew]: { label: 'Новая заявка', parent: routes.orders },

  // Сотрудники
  [routes.users]: { label: 'Сотрудники', parent: routes.main },
  [routes.profile]: { label: 'Профиль', parent: routes.main },

  // Техника - базовая категория
  '/machinery': { label: 'Техника', parent: routes.main },

  // Техника - подразделы
  [routes.machinery]: { label: 'Список', parent: '/machinery' },
  [routes.addNewMachinery]: { label: 'Новая техника', parent: routes.machinery },
  [routes.machineryDetails]: { label: 'Подробности', parent: routes.machinery },

  [routes.machineryMaintenance]: { label: 'Календарь ТО', parent: '/machinery' },
  [routes.machineryProblems]: { label: 'Проблемы', parent: '/machinery' },
  [routes.machineryProblemDetails]: { label: 'Подробности проблемы', parent: routes.machineryProblems },
  [routes.machineryAddProblem]: { label: 'Новая проблема', parent: routes.machineryProblems },

  [routes.machineryTasks]: { label: 'Задачи', parent: '/machinery' },
  [routes.machineryTaskDetails]: { label: 'Подробности задачи', parent: routes.machineryTasks },
  [routes.machineryAddTask]: { label: 'Новая задача', parent: routes.machineryTasks },

  [routes.machineryComments]: { label: 'Заметки', parent: '/machinery' },
};

interface BreadcrumbItem {
  label: string;
  path: string;
  isLast: boolean;
}

export default function NavbarBreadcrumbs() {
  const location = useLocation();

  // Функция для поиска соответствующего роута с параметрами
  const findMatchingRoute = (pathname: string): { routePath: string; config: typeof breadcrumbConfig[string] } | null => {
    // Сначала проверяем точное соответствие
    if (breadcrumbConfig[pathname]) {
      return { routePath: pathname, config: breadcrumbConfig[pathname] };
    }

    // Затем проверяем роуты с параметрами
    for (const [routePath, config] of Object.entries(breadcrumbConfig)) {
      if (routePath.includes(':')) {
        const match = matchPath(
            { path: routePath, end: true },
            location.pathname
        );
        if (match) {
          return { routePath, config };
        }
      }
    }

    return null;
  };

  // Функция для построения иерархии хлебных крошек
  const buildBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [];
    const currentMatch = findMatchingRoute(location.pathname);

    if (!currentMatch) {
      // Если роут не найден, показываем базовую навигацию
      return [{
        label: 'Страница не найдена',
        path: location.pathname,
        isLast: true
      }];
    }

    // Функция для построения цепочки родителей
    const buildParentChain = (routePath: string, config: typeof breadcrumbConfig[string]): BreadcrumbItem[] => {
      const chain: BreadcrumbItem[] = [];

      if (config.parent) {
        const parentConfig = breadcrumbConfig[config.parent];
        if (parentConfig) {
          chain.push(...buildParentChain(config.parent, parentConfig));
          chain.push({
            label: parentConfig.label,
            path: config.parent,
            isLast: false
          });
        }
      }

      return chain;
    };

    // Строим цепочку родителей
    const parentChain = buildParentChain(currentMatch.routePath, currentMatch.config);
    breadcrumbs.push(...parentChain);

    // Добавляем текущую страницу
    breadcrumbs.push({
      label: currentMatch.config.label,
      path: location.pathname, // Используем реальный путь с параметрами
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
                    key={index}
                    variant="body1"
                    sx={{ color: 'text.primary', fontWeight: 600 }}
                >
                  {crumb.label}
                </Typography>
            ) : (
                <Link
                    key={index}
                    to={crumb.path}
                    style={{ textDecoration: 'none', color: 'inherit' }}
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
