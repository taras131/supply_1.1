import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WarningIcon from "@mui/icons-material/Warning";
import NewReleasesIcon from "@mui/icons-material/NewReleases";

export const engineTypes = [
  { id: 0, title: "Дизельный" },
  { id: 1, title: "Бензиновый" },
  { id: 4, title: "Электрический" },
  { id: 5, title: "Гибридный" },
];

export const tractionTypes = [
  { id: 0, title: "Колёсный" },
  { id: 1, title: "Гусенечный" },
  { id: 4, title: "Стационарный" },
  { id: 5, title: "Шагающий" },
];

export const transmissionTypes = [
  { id: 0, title: "Механическая" },
  { id: 1, title: "Гидростатическая" },
];

export const operatingTypes = [
  { id: 0, title: "Час" },
  { id: 1, title: "Километр" },
];

export const machineryTypes = [
  { id: 0, title: "Легковые а/м" },
  { id: 1, title: "Грузовые а/м" },
  { id: 4, title: "Асфальтоукладчики" },
  { id: 5, title: "Беспилотная/роботизированная платформа" },
  { id: 6, title: "Бетоносмеситель" },
  { id: 7, title: "Бульдозер" },
  { id: 8, title: "Бульдозер для мусора" },
  { id: 9, title: "Буровой станок" },
  { id: 10, title: "Вибропогружатель" },
  { id: 11, title: "Генератор электрический" },
  { id: 12, title: "Грефер телескопический" },
  { id: 13, title: "Драглайн (экскаватор тросовый)" },
  { id: 14, title: "Драга" },
  { id: 15, title: "Дробилка передвижная" },
  { id: 16, title: "Земснаряд" },
  { id: 17, title: "Каток дорожный" },
  { id: 18, title: "Комбайн сельскохозяйственный" },
  { id: 19, title: "Кран самоходный" },
  { id: 20, title: "Планировщики холодного типа" },
  { id: 21, title: "Погрузчик вилочный" },
  { id: 22, title: "Погрузчик стреловой (перегружатель)" },
  { id: 23, title: "Погрузчик с бортовым поворотом" },
  { id: 24, title: "Погрузчик с телескопической стрелой" },
  { id: 25, title: "Погрузчик со сменным оборудованием" },
  { id: 26, title: "Погрузчик фронтальный" },
  { id: 27, title: "Погрузчик-экскаватор (бахалодер)" },
  { id: 28, title: "Самосвал внедорожный" },
  { id: 29, title: "Самосвал с шарнирной рамой" },
  { id: 30, title: "Сваебойки (коппер)" },
  { id: 31, title: "Скрепер" },
  { id: 32, title: "Скрепер прицепной" },
  { id: 33, title: "Смесительные машины для регенерации/стабилизации дорожного полотна" },
  { id: 34, title: "Трактор сельскохозяйственный" },
  { id: 35, title: "Трелевочный трактор (скиддер)" },
  { id: 36, title: "Трубоукладчик" },
  { id: 37, title: "Уплотнитель грунта и отходов" },
  { id: 38, title: "Форвадер" },
  { id: 39, title: "Фреза" },
  { id: 40, title: "Харвейстер" },
  { id: 41, title: "Экскаватор гидравлический" },
  { id: 10000, title: "Другое" },
];

export const PRIORITIES = [
  { id: 1, title: "Ждёт", icon: AccessTimeIcon, color: "primary" },
  { id: 2, title: "Важно", icon: NewReleasesIcon, color: "warning" },
  { id: 3, title: "Срочно", icon: WarningIcon, color: "error" },
  //   {id: 4, title: "Срочно и важно", icon: WarningIcon, color: "error"},
];

export const problemCategories = [
  { id: 1, title: "Силовая установка" },
  { id: 2, title: "Система трансмиссии" },
  { id: 3, title: "Подвеска и ходовая часть" },
  { id: 4, title: "Тормозная система" },
  { id: 5, title: "Рулевое управление" },
  { id: 6, title: "Электрооборудование" },
  { id: 7, title: "Климатическая система" },
  { id: 8, title: "Система безопасности" },
  { id: 9, title: "Кузов и внешний вид" },
  { id: 10, title: "Вспомогательные и дополнительные системы" },
  { id: 11, title: "Системы управления двигателем" },
  { id: 12, title: "Рабочее оборудование"},
];
