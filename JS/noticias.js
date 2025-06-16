//Constante con la API propia
const GNEWS_API_KEY = "73de273f7e7098192ce0d1d4801532f3";
//Crea una constante donde se van a cargas las noticias
const noticiasContainer = document.getElementById("noticias");


//Funcion de buscar noticias
async function fetchNoticias() {
  try {
    const response = await fetch(
      //Llamada a la API
      `https://gnews.io/api/v4/top-headlines?lang=es&max=5&token=${GNEWS_API_KEY}`
    );
    //Convierte la respuesta en JSON
    const data = await response.json();

    //Comprueba si hay errores y si no hay carga las noticias
    if (data.articles && data.articles.length > 0) {
      noticiasContainer.innerHTML = data.articles
        .map(n => `
          <div class="card mb-3">
            <img src="${n.image || 'https://via.placeholder.com/150'}" class="card-img-top" alt="imagen noticia">
            <div class="card-body">
              <h5 class="card-title">${n.title}</h5>
              <p class="card-text">${n.description || ''}</p>
              <a href="${n.url}" class="btn btn-primary btn-sm" target="_blank" rel="noopener noreferrer">Leer más</a>
              <p class="card-text"><small class="text-muted">Fuente: ${n.source.name}</small></p>
            </div>
          </div>`)
        .join("");
    } else {
      //Por si no se encuentran noticias
      noticiasContainer.innerHTML = "<p>No se encontraron noticias.</p>";
    }
  } catch (e) {
    //Se lanza si hay algún error
    noticiasContainer.innerHTML = "<p>Error al cargar noticias.</p>";
    console.error(e);
  }
}

//Carga las noticias al cargar la página
document.addEventListener("DOMContentLoaded", fetchNoticias);
