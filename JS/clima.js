//Api del clima
const WEATHER_API_KEY = "2b16a3c568bf4bdc9d572041251506";
//Ciudad seleccionada
const selectCity = document.getElementById("citySelect");
//Carga el clima actual en una constante
const climaActualContainer = document.getElementById("climaActual");
//Carga el pronostico para los 5 dias en una costante
const pronosticoContainer = document.getElementById("pronostico");
//Carga las alertas en una constante
const alertasContainer = document.getElementById("alertas");
//Carga el boton del clima en una constante
const cargarBtn = document.getElementById("cargarClima");

//Cuando hacemos click en cargar clima, se carga en la función
cargarBtn.addEventListener("click", () => {
  const ciudad = selectCity.value;
  fetchClima(ciudad);
});

//Función para obtener el clima
async function fetchClima(ciudad) {
  try {
    const response = await fetch(
      //Llamada a la API
      `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${ciudad}&days=5&aqi=no&alerts=yes`
    );
    //Convierte la respuestas a JSON
    const data = await response.json();

    // Comprobar que la respuesta no tenga error
    if (data.error) {
      throw new Error(data.error.message);
    }

    // Clima actual por horas (ejemplo simplificado)
    const horas = ["00:00", "08:00", "12:00", "18:00"];
    //Filtra las horas específicas
    const forecastToday = data.forecast.forecastday[0].hour.filter(h =>
      horas.includes(h.time.split(" ")[1])
    );

    //Crea el HTML con la respuesta
    //Muestra el tiempo por horas
    climaActualContainer.innerHTML = forecastToday
      .map(hour => `
        <div class="card mb-2">
          <div class="card-body">
            <h5>${hour.time.split(" ")[1]}</h5>
            <p>Temp: ${hour.temp_c}°C, Viento: ${hour.wind_kph} km/h</p>
            <p>Precipitación: ${hour.precip_mm} mm</p>
            <img src="https:${hour.condition.icon}" alt="${hour.condition.text}" />
          </div>
        </div>`)
      .join("");

    //Muestra el pronostico para los próximos 5 días
    pronosticoContainer.innerHTML = data.forecast.forecastday
      .map(day => `
        <div class="card mb-2">
          <div class="card-body">
            <h5>${day.date}</h5>
            <p>Máx: ${day.day.maxtemp_c}°C / Mín: ${day.day.mintemp_c}°C</p>
            <p>Viento: ${day.day.maxwind_kph} km/h, Precipitación: ${day.day.totalprecip_mm} mm</p>
            <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}" />
          </div>
        </div>`)
      .join("");

    //Muestra alertas
    if (data.alerts && data.alerts.alert && data.alerts.alert.length > 0) {
      alertasContainer.innerHTML = data.alerts.alert
        .map(a => `<div class="alert alert-danger"><strong>⚠️ ${a.headline}</strong><br>${a.desc}</div>`)
        .join("");
    } else {
      alertasContainer.innerHTML = "<p>No hay alertas meteorológicas para esta ubicación.</p>";
    }
  } catch (err) {
    //Manejo de errores
    climaActualContainer.innerHTML = `<p>Error al cargar el clima: ${err.message}</p>`;
    pronosticoContainer.innerHTML = "";
    alertasContainer.innerHTML = "";
  }
}

//Carga el clima al inicio
document.addEventListener("DOMContentLoaded", () => {
  fetchClima(selectCity.value);
});

