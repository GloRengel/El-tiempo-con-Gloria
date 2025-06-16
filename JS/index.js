// Claves API propias
const WEATHER_API_KEY = "2b16a3c568bf4bdc9d572041251506";
const GNEWS_API_KEY = "73de273f7e7098192ce0d1d4801532f3";

// Ciudad predeterminada
const city = "Málaga";

// Elementos para cargar los datos en HTML
const weatherContainer = document.getElementById("weather");
const newsContainer = document.getElementById("news");

// Clima por horas específicas
//Función de buscar las horas y el clima
async function fetchWeather() {
  try {
    const response = await fetch(
      //Llama a la API para que nos de el pronostico
      `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${city}&days=1&aqi=no&alerts=no`
    );
    //Convierte la respuesta a JSON
    const data = await response.json();
    //Horas específicas
    const horas = ["00:00", "08:00", "12:00", "18:00"];
    const forecast = data.forecast.forecastday[0].hour;
    //Filtra las horas específicas
    const horasfiltradas = forecast.filter(h =>
      horas.includes(h.time.split(" ")[1])
    );
    //Crea el HTML
    weatherContainer.innerHTML = horasfiltradas
      .map(hour => `
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">${hour.time.split(" ")[1]}</h5>
            <p>Temperatura: ${hour.temp_c}°C</p>
            <p>Viento: ${hour.wind_kph} km/h</p>
            <p>Precipitación: ${hour.precip_mm} mm</p>
            <img src="https:${hour.condition.icon}" alt="${hour.condition.text}" />
          </div>
        </div>
      `)
      .join("");
  } catch (error) {
    //Si hay algún error muestra este mensaje
    weatherContainer.innerHTML = "<p>Error al obtener el clima.</p>";
  }
}

// Noticias de España
//Función de buscar las noticias
async function fetchNews() {
  try {
    const response = await fetch(
      //Llama a la API para buscar noticias en español
      `https://gnews.io/api/v4/top-headlines?lang=es&max=5&apikey=${GNEWS_API_KEY}`
    );
    //Convierte los datos a JSON
    const data = await response.json();
    //Crea el HTML con las noticias
    newsContainer.innerHTML = data.articles
      .map(article => `
        <div class="card mb-3">
          <div class="row g-0">
            <div class="col-md-4">
              <img src="${article.image}" class="img-fluid rounded-start" alt="imagen noticia">
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title">${article.title}</h5>
                <p class="card-text">${article.description}</p>
                <p class="card-text"><small class="text-muted">${article.source.name}</small></p>
                <a href="${article.url}" target="_blank" class="btn btn-primary btn-sm">Leer más</a>
              </div>
            </div>
          </div>
        </div>
      `)
      .join("");
  } catch (error) {
    //Si ocurre algún error, devuelve ese parrafo
    newsContainer.innerHTML = "<p>Error al obtener las noticias.</p>";
  }
}

// Ejecuta funciones al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  fetchWeather();
  fetchNews();
});
