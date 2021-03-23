/*   
* News Navigator Js App Using Bing News API.
* Async parsing to fetch and render the news data from the API source. 
* Developed By Omar Mahrous.* 
* 23 March 2021.
* © All Rights Reserved.
*/
class NewsAsyncCls {


    /* A class constructor to set api host and key */
    constructor($Host, $ApiKey) {
        this.Host = $Host;
        this.ApiKey = $ApiKey;
    }

    /* Prepare fetch request and connect to api source  */
    fetchApi = () => {
        let url = "https://" + this.Host + this.endPoint +
            "?safeSearch=Off&textFormat=Raw&originalImg=true&setLang=en&cc=US"
            + this.query
            + this.offset
            + this.cat
            ;
        console.log(url);

        return fetch(url, {
            "method": "GET",
            "headers": {
                "x-bingapis-sdk": "true",
                "x-rapidapi-key": this.ApiKey,
                "x-rapidapi-host": this.Host
            }
        });

    }

      /* Configure the endpoint and request paramaters then handle the reponse from api  */
    getNews = async (endPoint = null, query = null, offset = 0, cat = null) => {
        document.querySelector("main").innerHTML = '<i id="spin" class="fa fa-spinner fa-spin"></i>';
        let newsData = '';
        this.endPoint = endPoint != null ? endPoint : '';
        this.query = query != null ? "&q=" + query : '';
        this.offset = "&offset=" + offset;
        this.cat = cat != null ? "&category=" + cat : '';

        try {
            let newsSource = await this.fetchApi();
            if (!newsSource.ok) {
                throw new Error(`HTTP error! status: ${newsSource.status}`);
            }

            newsData = await newsSource.json();
            console.log(newsData);

        } catch (e) {
            console.log("Something went wrong: " + e.message);
        }

        return newsData;

    }
/*  Render the response from api  */
    renderNewsBlock = async (Data = '') => {
        document.querySelector("#spin").remove();

        if (!Data) {
            document.querySelector("main").innerHTML = "<b>Couldn't connect to news source!</b>";
        }

        else if (Data.value.length == 0) {
            document.querySelector("main").innerHTML = '<b>No News Found!</b>';
        }

        else await Data.value.forEach(el => {
            let article_obj = document.createElement("article");
            let img_url = el.image != undefined ? el.image.thumbnail.contentUrl.split("&pid=News")[0] : 'empty.jpg';
            article_obj.innerHTML = `<div class="news-img"><img src="${img_url}"></div>
         <div class="content">
          <p>  <div class="author">${el.provider[0].name}</div> <div class="date">${new Date(el.datePublished).toUTCString()}</div></p> 
         <h2>${el.name}</h2>
         <p>${el.description}</p>
          <a href="${el.url}" target="blank"><button >Read More >></button> </a>      
        </div>`;

        document.querySelector("main").appendChild(article_obj);

        });
    }
}




let host = "bing-news-search1.p.rapidapi.com/news/"; // Set hostname to news source 
let apiKey = "322519c3f7mshb1c6ee1da1482dfp1122e4jsn696d1d6211ed"; // Set Apikey to news source 
let newsObj = new NewsAsyncCls(host, apiKey); 
let NewsData = newsObj.getNews(null, null, 0); // Get Top trending news
console.log(NewsData);
NewsData.then((val) => { // handle the fullfilled promise
    newsObj.renderNewsBlock(val); // render news to dom
});

document.querySelector("#searchBtn").addEventListener("click", (e) => { // Search for news
    e.preventDefault();
    let query = document.querySelector("input[name='search']").value; // Search keyword
    let NewsData = newsObj.getNews("search", query, 0); 
    NewsData.then((val) => {
        newsObj.renderNewsBlock(val);
    });
});


/* Get news by category   */
let catsEls = document.querySelector("#cat").children; // Get available categories from Dom
Array.from(catsEls).forEach(catEl => {
    catEl.addEventListener("click", (e) => {
        e.preventDefault();
        let cat = catEl.getAttribute("id"); // category name
        console.log(cat);
        let NewsData = newsObj.getNews(null, null, 0, cat);
        NewsData.then((val) => {
            newsObj.renderNewsBlock(val);
        });
    });
}); // end foreach









