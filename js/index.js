// selectors
const searchBar = document.getElementById("search");
const searchItems = document.querySelector(".search-items");

// event listeners
searchBar.addEventListener("keyup", debounce(searchHero));
searchItems.addEventListener("click", addFavList);

// function


// used debouncing concept so that after 350ms searchHero function call
function debounce(cb, delay = 350) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            cb(...args);
        }, delay)
    }
}

function searchHero(e) {
    // call the api
    fetch(`https://www.superheroapi.com/api.php/2764401060530200/search/${searchBar.value}`)
    .then(response => {
        // convert the response in JSON
        return response.json();
    })
    .then(data => {
        // pass the json data to the function which create the search card and append to the ul
        createSearchItem(data.results);
    });
    
}

function createSearchItem(data){
    // delete all the previous search result
    removePrevious();
    if (data) {
        // loop through the data array
        for(let i of data){
            // creating the div
            const div = document.createElement("div");
            div.classList.add("item");

            const aTag = document.createElement("a");
            aTag.innerText = i.name;
            aTag.href = "super_hero.html";
            aTag.target = "_blank";
            aTag.setAttribute("hero-id", i.id);
            aTag.onclick = displayDetails(aTag);
            div.appendChild(aTag);

            const favButton = document.createElement("button");
            if (isPresentInFav(i.id)) {
                favButton.innerHTML = "<i class='far fa-heart'></i> Remove Favourite";
                favButton.classList.add("remove-btn");
            } else {
                favButton.innerHTML = "<i class='far fa-heart'></i> Add Favourite";
                favButton.classList.add("add-btn");
            }
            div.appendChild(favButton);
            
            searchItems.appendChild(div);
        }
    }
}

function displayDetails(data){
    localStorage.setItem("clickedId", data.getAttribute("hero-id"));
}

function removePrevious(){
    while (searchItems.firstChild) {
        searchItems.removeChild(searchItems.firstChild);
    }
}


function addFavList(e){
    // e.preventDefault();
    let targetElement = e.target;

    if(targetElement.href){

        displayDetails(targetElement);

    }else if(targetElement.classList[0] == "add-btn"){
        // add this hero to the fav list
        const item = targetElement.parentElement;
        let heroName = item.firstChild.innerText;
        let heroId = item.firstChild.getAttribute("hero-id");

        saveLocal({heroName: heroName, heroId: heroId});

        targetElement.innerHTML = "<i class='far fa-heart'></i> Remove Favourite";

        targetElement.classList.remove("add-btn");
        targetElement.classList.add("remove-btn");
    }else if(targetElement.classList[0] == "remove-btn"){
        // remove from the local storage
        const item = targetElement.parentElement;
        let heroId = item.firstChild.getAttribute("hero-id");

        removeFromLocal(heroId);

        targetElement.innerHTML = "<i class='far fa-heart'></i> Add Favourite";
        targetElement.classList.remove("remove-btn");
        targetElement.classList.add("add-btn");
    }

}

function saveLocal(hero){
    let heroes;
    if(localStorage.getItem("heroes") == null){
        heroes = [];
    }else{
        heroes = JSON.parse(localStorage.getItem("heroes"));
    }

    heroes.push(hero);
    localStorage.setItem("heroes", JSON.stringify(heroes));
}


function removeFromLocal(heroId){
    let heroes;
    if (localStorage.getItem("heroes") == null) {
        heroes = [];
    } else {
        heroes = JSON.parse(localStorage.getItem("heroes"));
    }

    const heroIndex = heroes.findIndex(o => o.heroId == heroId);
    heroes.splice(heroIndex, 1);
    if (heroes.length > 0) {
        localStorage.setItem("heroes", JSON.stringify(heroes));
    } else {
        localStorage.removeItem("heroes");
    }

}

function isPresentInFav(id) {
    let heroes;
    if (localStorage.getItem("heroes") == null) {
        heroes = [];
    } else {
        heroes = JSON.parse(localStorage.getItem("heroes"));
    }

    const idx = heroes.findIndex(o => o.heroId == id);

    return idx != -1 ? true : false;
}