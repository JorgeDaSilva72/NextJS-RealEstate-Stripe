# AfricanCitiesSearch Component

Un composant React moderne pour rechercher et explorer les villes africaines directement depuis le fichier `africanCities.json`.

## Fonctionnalités

✅ **Sélection de pays** : Dropdown pour choisir un pays africain  
✅ **Affichage des villes** : Liste/grid responsive de toutes les villes du pays sélectionné  
✅ **Recherche de villes** : Filtre en temps réel pour rechercher une ville spécifique  
✅ **Navigation** : Clic sur une ville pour naviguer vers les résultats de recherche  
✅ **Design responsive** : S'adapte à tous les écrans (mobile, tablette, desktop)  
✅ **Mode sombre** : Support du dark mode  
✅ **Performance** : Utilise `useMemo` pour optimiser les calculs

## Utilisation

```tsx
import AfricanCitiesSearch from "./components/AfricanCitiesSearch";

export default function HomePage() {
  return (
    <div>
      <AfricanCitiesSearch />
    </div>
  );
}
```

## Structure des données

Le composant utilise directement le fichier `africanCities.json` à la racine du projet :

```json
{
  "Angola": ["Luanda", "Benguela", ...],
  "Botswana": ["Gaborone", "Francistown", ...],
  ...
}
```

## Comportement

1. **État initial** : Affiche un message d'accueil avec des boutons de pays populaires
2. **Sélection d'un pays** : 
   - Affiche toutes les villes du pays dans une grille responsive
   - Affiche un champ de recherche pour filtrer les villes
   - Affiche le nombre total de villes
3. **Recherche de ville** : Filtre les villes en temps réel selon la requête
4. **Clic sur une ville** : Navigue vers `/status/{status}?city={cityName}&country={countryName}`

## Personnalisation

Le composant utilise les composants shadcn/ui :
- `Select` pour le dropdown de pays
- `Input` pour la recherche de ville
- `Button` pour les actions
- Tailwind CSS pour le styling

## Notes

- Les villes invalides (nombres uniquement) sont automatiquement filtrées
- Le composant est entièrement client-side (`"use client"`)
- Support multilingue via `next-intl` (prêt pour les traductions)





