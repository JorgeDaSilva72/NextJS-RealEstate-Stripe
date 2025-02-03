// export const navigationItems = [
//   {
//     label: "Acheter",
//     dropdownItems: [
//       {
//         key: "buy-apartment",
//         title: "Acheter appartement",
//         description: "Acheter le bien qui me ressemble",
//         href: "/buy",
//       },
//       {
//         key: "buy-house",
//         title: "Acheter maison",
//         description: "Trouvez la maison de vos rêves",
//         href: "/buy",
//       },
//     ],
//   },
//   {
//     label: "Louer",
//     dropdownItems: [
//       {
//         key: "rent-apartment",
//         title: "Louer appartement",
//         description: "Location d'appartements",
//         href: "/rent",
//       },
//       {
//         key: "rent-house",
//         title: "Louer maison",
//         description: "Location de maisons",
//         href: "/rent",
//       },
//       {
//         key: "seasonal-rent",
//         title: "Louer pour une saison",
//         description: "Location saisonnière",
//         href: "/seasonal-rent",
//       },
//       {
//         key: "furnished-rent",
//         title: "Louer un bien meublé",
//         description: "Location meublée",
//         href: "/furnished-rent",
//       },
//       {
//         key: "exclusive-rentals",
//         title: "Louer un bien exclusif",
//         description: "Location exclusive AFRIQUE AVENIR",
//         href: "/exclusive-rentals",
//       },
//     ],
//   },
// ];
import { useTranslations } from "next-intl";

export const useNavigationItems = () => {
  const t = useTranslations("navigation");

  return [
    {
      label: t("acheter"),
      dropdownItems: [
        {
          key: "buy-apartment",
          title: t("buy-apartment.title"),
          description: t("buy-apartment.description"),
          href: "/buy",
        },
        {
          key: "buy-house",
          title: t("buy-house.title"),
          description: t("buy-house.description"),
          href: "/buy",
        },
      ],
    },
    {
      label: t("louer"),
      dropdownItems: [
        {
          key: "rent-apartment",
          title: t("rent-apartment.title"),
          description: t("rent-apartment.description"),
          href: "/rent",
        },
        {
          key: "rent-house",
          title: t("rent-house.title"),
          description: t("rent-house.description"),
          href: "/rent",
        },
        {
          key: "seasonal-rent",
          title: t("seasonal-rent.title"),
          description: t("seasonal-rent.description"),
          href: "/seasonal-rent",
        },
        {
          key: "furnished-rent",
          title: t("furnished-rent.title"),
          description: t("furnished-rent.description"),
          href: "/furnished-rent",
        },
        {
          key: "exclusive-rentals",
          title: t("exclusive-rentals.title"),
          description: t("exclusive-rentals.description"),
          href: "/exclusive-rentals",
        },
      ],
    },
  ];
};
