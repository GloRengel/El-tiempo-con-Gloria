const WEATHER_API_KEY = "2b16a3c568bf4bdc9d572041251506";
const selectCity = document.getElementById("citySelect");
const climaActualContainer = document.getElementById("climaActual");
const pronosticoContainer = document.getElementById("pronostico");
const alertasContainer = document.getElementById("alertas");
const cargarBtn = document.getElementById("cargarClima");

cargarBtn.addEventListener("click", () => {
  const ciudad = selectCity.value;
  fetchClima(ciudad);
});

async function fetchClima(ciudad) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${ciudad}&days=5&aqi=no&alerts=yes`
    );
    const data = await response.json();

    // Comprobar que la respuesta no tenga error
    if (data.error) {
      throw new Error(data.error.message);
    }

    // Clima actual por horas (ejemplo simplificado)
    const horas = ["00:00", "08:00", "12:00", "18:00"];
    const forecastToday = data.forecast.forecastday[0].hour.filter(h =>
      horas.includes(h.time.split(" ")[1])
    );

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

    if (data.alerts && data.alerts.alert && data.alerts.alert.length > 0) {
      alertasContainer.innerHTML = data.alerts.alert
        .map(a => `<div class="alert alert-danger"><strong>⚠️ ${a.headline}</strong><br>${a.desc}</div>`)
        .join("");
    } else {
      alertasContainer.innerHTML = "<p>No hay alertas meteorológicas para esta ubicación.</p>";
    }
  } catch (err) {
    climaActualContainer.innerHTML = `<p>Error al cargar el clima: ${err.message}</p>`;
    pronosticoContainer.innerHTML = "";
    alertasContainer.innerHTML = "";
  }
}

// Opcional: cargar clima inicial
document.addEventListener("DOMContentLoaded", () => {
  fetchClima(selectCity.value);
});

