// data/saved-searches.tsx
import Link from 'next/link';
import { getUserIdFromToken, getSavedSearchTest, getFilterValues, SavedSearch } from '@/app/components/savedSearch';

const SavedSearchesPage = ({ savedSearches }: { savedSearches: any[] }) => {
    console.log('test saved search')
    return (
        <div>
            <h1>Mes recherches sauvegardées</h1>

            <ul>
                {savedSearches.map(search => (
                    <li key={search.id}>
                        <Link href={`/result?${new URLSearchParams(search.filters).toString()}`}>
                            {search.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

// Exemple de récupération des données côté serveur
export async function getServerSideProps() {
    // const savedSearches = await fetchSavedSearches(); // Remplacez par votre logique
    const userId = await getUserIdFromToken();
    const savedSearch = await getSavedSearchTest(userId) ?? null;

    console.log('user id avec savedsearch', savedSearch)
    console.log('table savedSearch', savedSearch)

    return { props: { savedSearch } };
}

export default SavedSearchesPage;
