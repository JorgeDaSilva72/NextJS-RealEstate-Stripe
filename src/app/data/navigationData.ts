export const navigationItems = [
  {
    label: "Acheter",
    dropdownItems: [
      {
        key: "buy-apartment",
        title: "Acheter appartement",
        description: "Acheter le bien qui me ressemble",
        href: "/buy",
      },
      {
        key: "buy-house",
        title: "Acheter maison",
        description: "Trouvez la maison de vos rêves",
        href: "/buy",
      },
    ],
  },
  {
    label: "Louer",
    dropdownItems: [
      {
        key: "rent-apartment",
        title: "Louer appartement",
        description: "Location d'appartements",
        href: "/rent",
      },
      {
        key: "rent-house",
        title: "Louer maison",
        description: "Location de maisons",
        href: "/rent",
      },
      {
        key: "seasonal-rent",
        title: "Louer pour une saison",
        description: "Location saisonnière",
        href: "/seasonal-rent",
      },
      {
        key: "furnished-rent",
        title: "Louer un bien meublé",
        description: "Location meublée",
        href: "/furnished-rent",
      },
    ],
  },
];
