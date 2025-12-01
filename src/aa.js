// aa.js
// Node 18+ -> fetch est déjà disponible

async function testAnalytics() {
    try {
      const response = await fetch(
        'https://afriqueavenirimmobilier.com/api/analytics/data?type=topPages&startDate=30daysAgo&endDate=today&limit=10',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer TON_TOKEN_ICI', // remplace par ton token
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (!response.ok) {
        console.error('Erreur:', response.status, response.statusText);
        const text = await response.text();
        console.error('Détails:', text);
        return;
      }
  
      const data = await response.json();
      console.log('Données Analytics:', data);
    } catch (err) {
      console.error('Erreur de fetch:', err);
    }
  }
  
  testAnalytics();
  