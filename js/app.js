// Функция для форматирования даты
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

// Функция для создания разметки изображений
function createImagesHTML(images) {
  if (!images || images.length === 0) {
    return '<div class="no-image">Изображения отсутствуют</div>';
  }

  const count = images.length;
  let gridClass = "";

  if (count === 1) {
    gridClass = "single-image";
  } else if (count === 2) {
    gridClass = "two-images";
  } else if (count === 3) {
    gridClass = "three-images";
  } else if (count === 4) {
    gridClass = "four-images";
  } else if (count === 5) {
    gridClass = "five-images";
  }

  let imagesHTML = `<div class="images-grid ${gridClass}">`;

  images.forEach((image, index) => {
    imagesHTML += `<img src="${image}" loading="lazy" alt="Изображение ${
      index + 1
    } для статьи">`;
  });

  imagesHTML += "</div>";

  return imagesHTML;
}

// Функция для создания HTML карточки статьи
function createArticleCard(article) {
  return `
        <div class="article-card" data-id="${article.id}">
            <div class="article-header">
                <h2 class="article-title">${article.title}</h2>
                <div class="article-meta">
                    <span class="article-author">${article.author}</span>
                    <span class="article-date">${formatDate(
                      article.date
                    )}</span>
                </div>
            </div>
            
            <div class="article-content">
                <div class="article-description description-short" id="desc-${
                  article.id
                }">
                    ${article.description}
                </div>
                
                <button class="show-more-btn" data-id="${
                  article.id
                }">Visa mer</button>
                
                <div class="article-images">
                    ${createImagesHTML(article.images)}
                </div>
                
                <div class="article-tags">
                    ${article.tags
                      .map((tag) => `<span class="tag" data-tag="${tag}">${tag}</span>`)
                      .join("")}
                </div>
            </div>
        </div>
    `;
}

// Функция для обработки клика по кнопке "показать еще"
function handleShowMoreClick(articleId) {
  const descElement = document.getElementById(`desc-${articleId}`);
  const button = document.querySelector(
    `.show-more-btn[data-id="${articleId}"]`
  );

  if (descElement.classList.contains("description-short")) {
    // Показываем полный текст
    descElement.classList.remove("description-short");
    button.textContent = "Скрыть";
  } else {
    // Скрываем текст обратно
    descElement.classList.add("description-short");
    button.textContent = "Visa mer";
  }
}

// Функция для отображения всех статей
function renderAllArticles(articlesData) {
  const container = document.getElementById("articlesContainer");
  container.innerHTML = "";

  articlesData.articles.forEach((article) => {
    container.innerHTML += createArticleCard(article);
  });

  // Добавляем обработчики событий для кнопок "показать еще"
  document.querySelectorAll(".show-more-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const articleId = this.getAttribute("data-id");
      handleShowMoreClick(articleId);
    });
  });
}

// Переменные для управления фильтрацией
let activeFilter = null;
let allTags = [];
let currentArticlesData = null; // Для хранения загруженных данных

// Функция для получения всех уникальных тегов из статей
function getAllUniqueTags(articles) {
    const tags = new Set();
    
    articles.forEach(article => {
        article.tags.forEach(tag => {
            tags.add(tag);
        });
    });
    
    return Array.from(tags).sort();
}

// Функция для отображения фильтров по тегам
function renderTagFilters(articles) {
    const tagsContainer = document.getElementById('tagsContainer');
    if (!tagsContainer) return;
    
    allTags = getAllUniqueTags(articles);
    
    let tagsHTML = '<button class="tag-filter all-tags active" data-tag="all">Все статьи</button>';
    
    allTags.forEach(tag => {
        tagsHTML += `<button class="tag-filter" data-tag="${tag}">${tag}</button>`;
    });
    
    tagsContainer.innerHTML = tagsHTML;
    
    // Добавляем обработчики кликов на кнопки тегов
    document.querySelectorAll('.tag-filter').forEach(btn => {
        btn.addEventListener('click', function() {
            const selectedTag = this.getAttribute('data-tag');
            filterByTag(selectedTag);
        });
    });
}

// Функция для фильтрации статей по тегу
function filterByTag(tag) {
    if (!currentArticlesData) return;
    
    activeFilter = tag === 'all' ? null : tag;
    
    // Обновляем активные кнопки фильтров
    document.querySelectorAll('.tag-filter').forEach(btn => {
        const btnTag = btn.getAttribute('data-tag');
        if ((tag === 'all' && btnTag === 'all') || btnTag === tag) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Отображаем информацию об активном фильтре
    const filterInfo = document.getElementById('activeFilterInfo');
    const activeTagName = document.getElementById('activeTagName');
    
    if (activeFilter) {
        if (filterInfo) {
            filterInfo.style.display = 'flex';
            activeTagName.textContent = tag;
        }
    } else {
        if (filterInfo) {
            filterInfo.style.display = 'none';
        }
    }
    
    // Отображаем статьи
    renderFilteredArticles();
}

// Функция для сброса фильтра
function clearFilter() {
    filterByTag('all');
}

// Функция для отображения отфильтрованных статей
function renderFilteredArticles() {
    if (!currentArticlesData) return;
    
    const container = document.getElementById('articlesContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    let filteredArticles = currentArticlesData.articles;
    
    if (activeFilter) {
        filteredArticles = currentArticlesData.articles.filter(article => 
            article.tags.includes(activeFilter)
        );
    }
    
    if (filteredArticles.length === 0) {
        container.innerHTML = `
            <div class="no-articles-message">
                <h3>Статьи не найдены</h3>
                <p>Нет статей с тегом "${activeFilter}"</p>
                <button class="clear-filter-btn" onclick="clearFilter()" style="margin-top: 10px;">Показать все статьи</button>
            </div>
        `;
        return;
    }
    
    filteredArticles.forEach(article => {
        container.innerHTML += createArticleCard(article);
    });
    
    // Добавляем обработчики событий для кнопок "показать еще"
    document.querySelectorAll('.show-more-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const articleId = this.getAttribute('data-id');
            handleShowMoreClick(articleId);
        });
    });
    
    // Добавляем обработчики кликов на теги в карточках статей
    document.querySelectorAll('.article-tags .tag').forEach(tagElement => {
        tagElement.addEventListener('click', function() {
            const tag = this.getAttribute('data-tag');
            filterByTag(tag);
        });
    });
}

// Функция для загрузки данных из JSON файла
async function loadArticlesData() {
  try {
    const response = await fetch("articles.json");

    if (!response.ok) {
      throw new Error(
        `Ошибка загрузки: ${response.status} ${response.statusText}`
      );
    }

    const articlesData = await response.json();
    currentArticlesData = articlesData; // Сохраняем данные
    return articlesData;
  } catch (error) {
    console.error("Ошибка при загрузке данных:", error);

    // Показываем сообщение об ошибке
    const container = document.getElementById("articlesContainer");
    if (container) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #ff4444;">
          <h3>Ошибка загрузки данных</h3>
          <p>${error.message}</p>
          <p>Проверьте наличие файла articles.json в папке с проектом.</p>
        </div>
      `;
    }

    return null;
  }
}

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", async () => {
  const articlesData = await loadArticlesData();

  if (articlesData) {
    // Проверяем, есть ли контейнер для тегов (значит, это страница со статьями с фильтрацией)
    const tagsContainer = document.getElementById('tagsContainer');
    if (tagsContainer) {
      // Отрисовываем фильтры по тегам
      renderTagFilters(articlesData.articles);
      // Отрисовываем статьи с учетом фильтра (изначально активный фильтр - null, т.е. все)
      renderFilteredArticles();
    } else {
      // Иначе просто отрисовываем все статьи (без фильтров)
      renderAllArticles(articlesData);
    }
  }
});

// FAQ функционал (для других страниц)
document.querySelectorAll(".question").forEach((question) => {
  question.addEventListener("click", () => {
    const answer = question.nextElementSibling; // Получаем следующий элемент (ответ)
    if (answer.style.display === "block") {
      answer.style.display = "none"; // Скрываем ответ, если он открыт
      question.classList.remove("active"); // Убираем класс активности
    } else {
      answer.style.display = "block"; // Показываем ответ
      question.classList.add("active"); // Добавляем класс активности
    }
  });
});

// Добавляем обработчик для кнопки сброса фильтра
document.addEventListener('DOMContentLoaded', function() {
  const clearFilterBtn = document.querySelector('.clear-filter-btn');
  if (clearFilterBtn) {
    clearFilterBtn.addEventListener('click', clearFilter);
  }
});