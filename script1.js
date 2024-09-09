class NewsAPI {
    constructor(apiKey) {
      this.apiKey = apiKey;
      this.newsList = [];
      this.currentPage = 1;
      this.newsPerPage = 5;
      this.searchValue = '';
      this.sortOrder = 'asc';
    }
  
    async fetchNews() {
      try {
        const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${this.apiKey}`);
        const data = await response.json();
        this.newsList = data.articles;
        this.displayNews();
      } catch (error) {
        console.error(error);
      }
    }
  
    displayNews() {
      const mainContainer = document.querySelector("#mainContainer");
      mainContainer.innerHTML = '';
  
      let filteredNews = this.newsList.filter(news => news.title.toLowerCase().includes(this.searchValue.toLowerCase()));
  
      if (this.sortOrder === 'asc') {
        filteredNews.sort((a, b) => a.title.localeCompare(b.title));
      } else {
        filteredNews.sort((a, b) => b.title.localeCompare(a.title));
      }
  
      const start = (this.currentPage - 1) * this.newsPerPage;
      const end = start + this.newsPerPage;
  
      for (let i = start; i < end; i++) {
        if (i >= filteredNews.length) break;
  
        const newsArticle = document.createElement('div');
        newsArticle.classList.add('news-article');
  
        const newsTitle = document.createElement('h2');
        newsTitle.textContent = filteredNews[i].title;
        newsArticle.appendChild(newsTitle);
  
        const newsDescription = document.createElement('p');
        newsDescription.textContent = filteredNews[i].description;
        newsArticle.appendChild(newsDescription);
  
        const newsImage = document.createElement('img');
        newsImage.src = filteredNews[i].urlToImage;
        newsArticle.appendChild(newsImage);
  
        const newsLink = document.createElement('a');
        newsLink.href = filteredNews[i].url;
        newsLink.textContent = 'Read more';
        newsArticle.appendChild(newsLink);
  
        mainContainer.appendChild(newsArticle);
      }
  
      this.displayPagination(filteredNews);
    }
  
    displayPagination(filteredNews) {
      const paginationContainer = document.querySelector("#paginationContainer");
      paginationContainer.innerHTML = '';
  
      const totalPages = Math.ceil(filteredNews.length / this.newsPerPage);
  
      for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.addEventListener('click', () => {
          this.currentPage = i;
          this.displayNews();
        });
        paginationContainer.appendChild(pageButton);
      }
    }
  
    updateSearchValue(value) {
      this.searchValue = value;
      this.currentPage = 1;
      this.displayNews();
    }
  
    updateSortOrder(value) {
      this.sortOrder = value;
      this.displayNews();
    }
  }
  
  const apiKey = '8d3012a941154d3abc5e675926a65196';
  const newsAPI = new NewsAPI(apiKey);
  
  const fetchNewsButton = document.querySelector("#fetchnews");
  fetchNewsButton.addEventListener('click', () => {
    newsAPI.fetchNews();
  });
  
  const searchInput = document.querySelector("#search");
  searchInput.addEventListener('input', (e) => {
    newsAPI.updateSearchValue(e.target.value);
  });
  
  const sortSelect = document.querySelector("#sort");
  sortSelect.addEventListener('change', (e) => {
    newsAPI.updateSortOrder(e.target.value);
  });