// selectors
const favList = document.querySelector(".fav-list");
const button = document.getElementsByTagName("button");


// fetch all the heroes from the local storage
function fetchFromLocal(){
    if(localStorage.getItem("heroes") != null){

        let heroes = JSON.parse(localStorage.getItem("heroes"));
        heroes.forEach(element => {
            fetch(`https://www.superheroapi.com/api.php/2764401060530200/${element.heroId}/image`)
                .then(response => {
                    // convert the response in JSON
                    return response.json();
                })
                .then(data => {
                    // pass the json data to the function which create the search card and append to the ul
                    displayFavList(data.url, element.heroName, element.heroId);
                });
        });

    }else{
        const h1 = document.createElement("h1");
        h1.innerText = "Add Your Fav Heores :)";
        favList.appendChild(h1);
    }
}



// display all the hero from the fav list
function displayFavList(imgUrl, heroName, heroId){
    const div = document.createElement("div");
    div.classList.add("item");

    const imgDiv = document.createElement("div");
    imgDiv.classList.add("hero-img");
    div.appendChild(imgDiv);

    const img = document.createElement("img");
    img.src = imgUrl;
    imgDiv.appendChild(img);

    const p = document.createElement("p");
    p.innerText = heroName;
    div.appendChild(p);

    const favButton = document.createElement("button");
    favButton.innerHTML = "<i class='far fa-heart'></i> Remove Favourite";
    favButton.classList.add("remove-btn");
    favButton.setAttribute("hero-id", heroId);
    div.appendChild(favButton);
    // removing this item if this button get clicked
    favButton.addEventListener("click", function () {
        const parentElement = this.parentElement;
        parentElement.remove();
        let heroId = this.getAttribute("hero-id");
        removeFromLocal(heroId);
    });

    favList.appendChild(div);
}

// removing the hero from local storage
function removeFromLocal(heroId){
    let heroes = JSON.parse(localStorage.getItem("heroes"));
    const heroIndex = heroes.findIndex(o => o.heroId == heroId);
    heroes.splice(heroIndex, 1);
    if(heroes.length > 0){
        localStorage.setItem("heroes", JSON.stringify(heroes));
    }else{
        localStorage.removeItem("heroes");
        const h1 = document.createElement("h1");
        h1.innerText = "Add Your Fav Heores :)";
        favList.appendChild(h1);
    }
}



window.addEventListener("load", fetchFromLocal);