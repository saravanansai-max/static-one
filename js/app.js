const UI_STRINGS = {
  en: {
    showMore: "Show more",
    showLess: "Show less",
    noImages: "No images available",
    imageAltPrefix: "Article image",
    allStories: "All stories",
    noStoriesTitle: "No stories found",
    noStoriesText: "No stories with tag",
    showAllStories: "Show all stories",
    loadErrorTitle: "Data loading error",
    loadErrorHint: "Check that articles.json exists in the project folder.",
  },
  sv: {
    showMore: "Visa mer",
    showLess: "Visa mindre",
    noImages: "Inga bilder tillgängliga",
    imageAltPrefix: "Artikelbild",
    allStories: "Alla berättelser",
    noStoriesTitle: "Inga berättelser hittades",
    noStoriesText: "Inga berättelser med taggen",
    showAllStories: "Visa alla berättelser",
    loadErrorTitle: "Fel vid datainläsning",
    loadErrorHint: "Kontrollera att articles.json finns i projektmappen.",
  },
};

let activeFilter = null;
let allTags = [];
let currentArticlesData = null;

function getCurrentLanguage() {
  if (typeof window.getSiteLanguage === "function") {
    return window.getSiteLanguage();
  }

  const htmlLanguage = (document.documentElement.lang || "en").slice(0, 2);
  return htmlLanguage === "sv" ? "sv" : "en";
}

function getUIStrings() {
  const language = getCurrentLanguage();
  return UI_STRINGS[language] || UI_STRINGS.en;
}

function getLocalizedValue(value) {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "object") {
    const language = getCurrentLanguage();
    return value[language] || value.en || Object.values(value)[0] || "";
  }

  return String(value);
}

function getLocalizedTags(tags) {
  if (!tags) {
    return [];
  }

  if (Array.isArray(tags)) {
    return tags;
  }

  if (typeof tags === "object") {
    const language = getCurrentLanguage();
    return tags[language] || tags.en || Object.values(tags)[0] || [];
  }

  return [];
}

function getLocalizedArticle(article) {
  return {
    ...article,
    title: getLocalizedValue(article.title),
    description: getLocalizedValue(article.description),
    author: getLocalizedValue(article.author),
    tags: getLocalizedTags(article.tags),
  };
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

function createImagesHTML(images) {
  const ui = getUIStrings();

  if (!images || images.length === 0) {
    return `<div class="no-image">${ui.noImages}</div>`;
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
    const imageAlt = `${ui.imageAltPrefix} ${index + 1}`;
    imagesHTML += `<img src="${image}" loading="lazy" alt="${imageAlt}">`;
  });

  imagesHTML += "</div>";

  return imagesHTML;
}

function createArticleCard(article) {
  const ui = getUIStrings();
  const localizedArticle = getLocalizedArticle(article);

  return `
    <div class="article-card" data-id="${localizedArticle.id}">
      <div class="article-header">
        <h2 class="article-title">${localizedArticle.title}</h2>
        <div class="article-meta">
          <span class="article-author">${localizedArticle.author}</span>
          <span class="article-date">${formatDate(localizedArticle.date)}</span>
        </div>
      </div>
      <div class="article-content">
        <div class="article-description description-short" id="desc-${localizedArticle.id}">
          ${localizedArticle.description}
        </div>
        <button class="show-more-btn" data-id="${localizedArticle.id}">${ui.showMore}</button>
        <div class="article-images">
          ${createImagesHTML(localizedArticle.images)}
        </div>
        <div class="article-tags">
          ${localizedArticle.tags
            .map(
              (tag) => `<span class="tag" data-tag="${tag}">${tag}</span>`
            )
            .join("")}
        </div>
      </div>
    </div>
  `;
}

function handleShowMoreClick(articleId) {
  const ui = getUIStrings();
  const descElement = document.getElementById(`desc-${articleId}`);
  const button = document.querySelector(`.show-more-btn[data-id="${articleId}"]`);

  if (!descElement || !button) {
    return;
  }

  if (descElement.classList.contains("description-short")) {
    descElement.classList.remove("description-short");
    button.textContent = ui.showLess;
  } else {
    descElement.classList.add("description-short");
    button.textContent = ui.showMore;
  }
}

function bindShowMoreButtons() {
  document.querySelectorAll(".show-more-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const articleId = this.getAttribute("data-id");
      handleShowMoreClick(articleId);
    });
  });
}

function bindArticleTagButtons() {
  document.querySelectorAll(".article-tags .tag").forEach((tagElement) => {
    tagElement.addEventListener("click", function () {
      const tag = this.getAttribute("data-tag");
      filterByTag(tag);
    });
  });
}

function getAllUniqueTags(articles) {
  const tags = new Set();

  articles.forEach((article) => {
    getLocalizedTags(article.tags).forEach((tag) => tags.add(tag));
  });

  return Array.from(tags).sort();
}

function renderTagFilters(articles) {
  const tagsContainer = document.getElementById("tagsContainer");
  if (!tagsContainer) {
    return;
  }

  const ui = getUIStrings();
  allTags = getAllUniqueTags(articles);

  let tagsHTML = `<button class="tag-filter all-tags active" data-tag="all">${ui.allStories}</button>`;

  allTags.forEach((tag) => {
    tagsHTML += `<button class="tag-filter" data-tag="${tag}">${tag}</button>`;
  });

  tagsContainer.innerHTML = tagsHTML;

  document.querySelectorAll(".tag-filter").forEach((button) => {
    button.addEventListener("click", function () {
      const selectedTag = this.getAttribute("data-tag");
      filterByTag(selectedTag);
    });
  });
}

function updateFilterInfo(tag) {
  const filterInfo = document.getElementById("activeFilterInfo");
  const activeTagName = document.getElementById("activeTagName");

  if (!filterInfo || !activeTagName) {
    return;
  }

  if (tag) {
    filterInfo.style.display = "flex";
    activeTagName.textContent = tag;
  } else {
    filterInfo.style.display = "none";
    activeTagName.textContent = "";
  }
}

function filterByTag(tag) {
  if (!currentArticlesData) {
    return;
  }

  activeFilter = tag === "all" ? null : tag;

  document.querySelectorAll(".tag-filter").forEach((button) => {
    const buttonTag = button.getAttribute("data-tag");
    if ((tag === "all" && buttonTag === "all") || buttonTag === tag) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });

  updateFilterInfo(activeFilter);
  renderFilteredArticles();
}

function clearFilter() {
  filterByTag("all");
}

window.clearFilter = clearFilter;

function renderNoStories(container) {
  const ui = getUIStrings();

  container.innerHTML = `
    <div class="no-articles-message">
      <h3>${ui.noStoriesTitle}</h3>
      <p>${ui.noStoriesText} "${activeFilter}"</p>
      <button class="clear-filter-btn" onclick="clearFilter()" style="margin-top: 10px;">${ui.showAllStories}</button>
    </div>
  `;
}

function renderFilteredArticles() {
  const container = document.getElementById("articlesContainer");
  if (!container || !currentArticlesData) {
    return;
  }

  container.innerHTML = "";

  let filteredArticles = currentArticlesData.articles;

  if (activeFilter) {
    filteredArticles = currentArticlesData.articles.filter((article) =>
      getLocalizedTags(article.tags).includes(activeFilter)
    );
  }

  if (filteredArticles.length === 0) {
    renderNoStories(container);
    return;
  }

  filteredArticles.forEach((article) => {
    container.innerHTML += createArticleCard(article);
  });

  bindShowMoreButtons();
  bindArticleTagButtons();
}

function renderAllArticles(articlesData) {
  const container = document.getElementById("articlesContainer");
  if (!container) {
    return;
  }

  container.innerHTML = "";

  articlesData.articles.forEach((article) => {
    container.innerHTML += createArticleCard(article);
  });

  bindShowMoreButtons();
  bindArticleTagButtons();
}

async function loadArticlesData() {
  try {
    const response = await fetch("articles.json");

    if (!response.ok) {
      throw new Error(`Loading failed: ${response.status} ${response.statusText}`);
    }

    currentArticlesData = await response.json();
    return currentArticlesData;
  } catch (error) {
    console.error("Failed to load articles data:", error);

    const container = document.getElementById("articlesContainer");
    if (container) {
      const ui = getUIStrings();
      container.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #ff4444;">
          <h3>${ui.loadErrorTitle}</h3>
          <p>${error.message}</p>
          <p>${ui.loadErrorHint}</p>
        </div>
      `;
    }

    return null;
  }
}

function initializeFaq() {
  document.querySelectorAll(".question").forEach((question) => {
    question.addEventListener("click", () => {
      const answer = question.nextElementSibling;
      if (!answer) {
        return;
      }

      if (answer.style.display === "block") {
        answer.style.display = "none";
        question.classList.remove("active");
      } else {
        answer.style.display = "block";
        question.classList.add("active");
      }
    });
  });
}

function renderArticlesForCurrentPage() {
  if (!currentArticlesData) {
    return;
  }

  const hasTagsContainer = !!document.getElementById("tagsContainer");
  const hasArticlesContainer = !!document.getElementById("articlesContainer");

  if (!hasArticlesContainer && !hasTagsContainer) {
    return;
  }

  if (hasTagsContainer) {
    renderTagFilters(currentArticlesData.articles);
    renderFilteredArticles();
  } else {
    renderAllArticles(currentArticlesData);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  initializeFaq();

  const hasTagsContainer = !!document.getElementById("tagsContainer");
  const hasArticlesContainer = !!document.getElementById("articlesContainer");

  if (!hasTagsContainer && !hasArticlesContainer) {
    return;
  }

  const articlesData = await loadArticlesData();
  if (!articlesData) {
    return;
  }

  renderArticlesForCurrentPage();

  const clearFilterButton = document.querySelector(".clear-filter-btn");
  if (clearFilterButton) {
    clearFilterButton.addEventListener("click", clearFilter);
  }
});

document.addEventListener("site-language-changed", () => {
  activeFilter = null;
  updateFilterInfo(null);
  renderArticlesForCurrentPage();
});
