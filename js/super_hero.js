// get the id of the clicked superhero
const id = localStorage.getItem("clickedId");


// selectors
const imgContainer = document.querySelector(".img-container");
const detailsContainer = document.querySelector(".details-container");


function init() {
    // call the api
    fetch(`https://www.superheroapi.com/api.php/2764401060530200/${id}`)
    .then(response => {
        // convert the response in JSON
        return response.json();
    })
    .then(data => {
        // pass the json data to the function which create the search card and append to the ul
       showDetailsHero(data);
    })
    .catch(err => console.log(err));
}


function showDetailsHero(data){
    // create img tag
    const img = document.createElement("img");
    img.src = data.image.url;
    img.classList.add("img");
    imgContainer.appendChild(img);

    document.getElementById("name").innerText = data.name;
    document.getElementById("intelligence").innerText = data.powerstats.intelligence;
    document.getElementById("strength").innerText = data.powerstats.strength;
    document.getElementById("speed").innerText = data.powerstats.speed;
    document.getElementById("durability").innerText = data.powerstats.durability;
    document.getElementById("power").innerText = data.powerstats.power;

    document.getElementById("full-name").innerText = data.biography["full-name"];
    document.getElementById("alter-egos").innerText = data.biography["alter-egos"];
    document.getElementById("place-of-birth").innerText = data.biography["place-of-birth"];
    document.getElementById("first-appearance").innerText = data.biography["first-appearance"];

    const favButton = document.createElement("button");
    if(isPresentInFav(id)){
        favButton.innerHTML = "<i class='far fa-heart'></i> Remove Favourite";
        favButton.classList.add("remove-btn");
    }else{
        favButton.innerHTML = "<i class='far fa-heart'></i> Add Favourite";
        favButton.classList.add("add-btn");
    }
    favButton.addEventListener("click", function(){
        btnFuntion(favButton, data);
    });

    document.querySelector(".details-container").appendChild(favButton);
    
}

function btnFuntion(btn, hero){
    if(btn.classList[0] == "add-btn"){
        saveLocal({heroName: hero.name, heroId: hero.id})
        btn.innerHTML = "<i class='far fa-heart'></i> Remove Favourite";
        btn.classList.remove("add-btn");
        btn.classList.add("remove-btn");
    }else{
        removeFromLocal(id);
        btn.innerHTML = "<i class='far fa-heart'></i> Add Favourite";
        btn.classList.add("add-btn");
        btn.classList.remove("remove-btn");
    }
}

function isPresentInFav(id){
    let heroes;
    if (localStorage.getItem("heroes") == null) {
        heroes = [];
    } else {
        heroes = JSON.parse(localStorage.getItem("heroes"));
    }

    const idx = heroes.findIndex(o => o.heroId == id);

    return idx != -1 ? true : false;
}

function removeFromLocal(heroId) {
    let heroes;
    if (localStorage.getItem("heroes") == null) {
        heroes = [];
    } else {
        heroes = JSON.parse(localStorage.getItem("heroes"));
    }

    const heroIndex = heroes.findIndex(o => o.heroId == heroId);
    heroes.splice(heroIndex, 1);
    localStorage.setItem("heroes", JSON.stringify(heroes));

}

function saveLocal(hero) {
    let heroes;
    if (localStorage.getItem("heroes") == null) {
        heroes = [];
    } else {
        heroes = JSON.parse(localStorage.getItem("heroes"));
    }

    heroes.push(hero);
    localStorage.setItem("heroes", JSON.stringify(heroes));
}


window.addEventListener("load", init);
