```javascript
const https = require('https');
const readline = require('readline');

// Crear interfaz para entrada del usuario
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Función para hacer solicitudes HTTPS
function fetchNews(query, callback) {
  const options = {
    hostname: 'newsapi.org',
    path: `/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&language=es&pageSize=5`,
    method: 'GET',
    headers: {
      'X-Api-Key': 'demo' // Usando demo key de NewsAPI
    }
  };

  https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        callback(null, JSON.parse(data));
      } catch (e) {
        callback(e, null);
      }
    });
  }).on('error', (err) => {
    callback(err, null);
  }).end();
}

// Función para buscar noticias localmente (demo)
function searchNewsLocally(query) {
  const newsDatabase = {
    'tecnología': [
      { title: 'IA revoluciona la industria tecnológica', source: 'TechNews', date: '2024-01-15', description: 'Nuevos avances en inteligencia artificial' },
      { title: 'Nuevos smartphones del 2024', source: 'TechReview', date: '2024-01-14', description: 'Lanzamiento de últimos modelos' },
      { title: 'Ciberseguridad en tendencia', source: 'SecureNet', date: '2024-01-13', description: 'Empresas invierten en protección' }
    ],
    'ciencia': [
      { title: 'Descubrimiento de nuevas galaxias', source: 'Astronomy Today', date: '2024-01-15', description: 'Telescopio espacial revela secretos del universo' },
      { title: 'Avances en medicina genética', source: 'ScienceDaily', date: '2024-01-14', description: 'Nuevos tratamientos para enfermedades' },
      { title: 'Cambio climático acelerado', source: 'EcoNews', date: '2024-01-13', description: 'Científicos advierten sobre el futuro' }
    ],
    'negocios': [
      { title: 'Mercados alcistas en 2024', source: 'Financial Times', date: '2024-01-15', description: 'Bolsas globales muestran crecimiento' },
      { title: 'Startups recaudan millones', source: 'Business Insider', date: '2024-01-14', description: 'Inversión en nuevos emprendimientos' },
      { title: 'Fusiones empresariales importantes', source: 'Bloomberg', date: '2024-01-13', description: 'Grandes acuerdos comerciales' }
    ],
    'deportes': [
      { title: 'Equipo gana campeonato mundial', source: 'Sports Central', date: '2024-01-15', description: 'Victoria histórica en competencia internacional' },
      { title: 'Atleta rompe récord mundial', source: 'Olympic News', date: '2024-01-14', description: 'Desempeño excepcional en competencia' },
      { title: 'Fichaje de jugador estrella', source: 'Sports Magazine', date: '2024-01-13', description: 'Club acuerda contrato millonario' }
    ],
    'salud': [
      { title: 'Avance en vacunas del futuro', source: 'Health Times', date: '2024-01-15', description: 'Investigación promete revolucionar medicina' },
      { title: 'Ejercicio reduce enfermedades', source: 'Wellness Daily', date: '2024-01-14', description: 'Estudio científico lo confirma' },
      { title: 'Nutrición y longevidad', source: 'Health Journal', date: '2024-01-13', description: 'Expertos revelan secretos de vida saludable' }
    ]
  };

  const lowerQuery = query.toLowerCase();
  
  for (const [category, articles] of Object.entries(newsDatabase)) {
    if (lowerQuery.includes(category) || category.includes(lowerQuery)) {
      return articles;
    }
  }

  // Búsqueda por palabra clave en títulos
  const allNews = Object.values(newsDatabase).flat();
  return allNews.filter(article => 
    article.title.toLowerCase().includes(lowerQuery) ||
    article.description.toLowerCase().includes(lowerQuery)
  ).slice(0, 5);
}

// Función para mostrar noticias
function displayNews(articles) {
  if (!articles || articles.length === 0) {
    console.log('\n❌ No se encontraron noticias para su búsqueda.\n');
    return;
  }

  console.log('\n' + '='.repeat(80));
  console.log('📰 RESULTADOS DE NOTICIAS');
  console.log('='.repeat(80));

  articles.forEach((article, index) => {
    console.log(`\n${index + 1}. ${article.title}`);
    console.log(`   📰 Fuente: ${article.source || 'Desconocida'}`);
    console.log(`   📅 Fecha: ${article.date || article.publishedAt || 'N/A'}`);
    console.log(`   📝 ${article.description || article.description || 'Sin descripción'}`);