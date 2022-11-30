// ACCESSING ALL THE VARIABLES
const searchBar = document.querySelector("input");
const mealContainer = document.getElementsByClassName("meal-content");
const result = document.getElementsByClassName("result");
const mealSection = document.getElementsByClassName("meals");
const model = document.getElementsByClassName("more-details");
const image = document.querySelector(".more-details .meals-image .image");
const reciepe = document.querySelector(".more-details .reciepe p");
const dishName = document.querySelector(".more-details .dish-name");
const watchVedio = document.querySelectorAll(
  ".more-details .container .btn-container button"
);
const headerLink = document.getElementsByClassName("fav");
const icon = document.getElementsByClassName("icon");
const favourites = document.getElementsByClassName("favourites");
const FavMealSection = document.getElementsByClassName("fav-meals");
let favMealList = [];

// Creating functions 
async function getMealDetails(mealid) {
  const url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + mealid;
  const response = await fetch(url);
  const data = await response.json();
  const [meal] = data.meals;
  image.style.backgroundImage = `url(${meal.strMealThumb})`;
  reciepe.innerText = meal.strInstructions;
  dishName.innerText = meal.strMeal;
  // adding event listener to watch-vedio button
  watchVedio[0].addEventListener("click", () => {
    window.open(meal.strYoutube);
  });
  // adding event listener to back-button 
  watchVedio[1].addEventListener("click", () => {
    model[0].style.visibility = "hidden";
  });
}

async function displayMeal(dishName) {
  mealContainer[0].innerHTML = "";
  const url =
    "https://www.themealdb.com/api/json/v1/1/search.php?s=" + dishName;
  const response = await fetch(url);
  const data = await response.json();
  const meals = data.meals;
  if (meals == null) {
    result[0].style.visibility = "initial";
    return;
  } else {
    result[0].style.visibility = "hidden";
  }
  renderSearchMeals(meals);
}

// RENDERING SEARCHED MEALS
function renderSearchMeals(meals) {
  mealContainer[0].innerHTML = "";
  for (let meal of meals) {
    let name = "heart-circle";
    if (favMealList.includes(meal.idMeal)) {
      name = "heart";
    }
    const html = `<div class="meal-card">
    <div class="image">
      <img src=${meal.strMealThumb} alt="meal" />
    </div>
    <h3>${meal.strMeal}</h3>
    <div class="button-container">
      <button data-id=${meal.idMeal}  type="button">More Details</button>
      <ion-icon data-id=${meal.idMeal} name=${name}></ion-icon>
    </div>
  </div>`;
    mealContainer[0].insertAdjacentHTML("beforeend", html);
  }
  // Handling event listeners on all buttons to get details of the meals
  const getDetailButton = document.querySelectorAll(".button-container button");
  const favIcon = document.querySelectorAll(".meals ion-icon");
  for (let btn of getDetailButton) {
    btn.addEventListener("click", (e) => {
      model[0].style.visibility = "visible";
      const mealid = e.target.getAttribute("data-id");
      getMealDetails(mealid);
    });
  }

  // ADDING AND REMOVING MEALS from favMealsList
  for (let i of favIcon) {
    i.addEventListener("click", (e) => {
      const Name = e.target.getAttribute("name");
      const mealid = e.target.getAttribute("data-id");
      if (Name == "heart-circle") {
        favMealList.push(mealid);
        e.target.setAttribute("name", "heart");
      } else {
        e.target.setAttribute("name", "heart-circle");
        favMealList = favMealList.filter((id) => {
          return id != mealid;
        });
      }
    });
  }
}

// toggling icons
function toggleIcons() {
  mealContainer[1].innerHTML = "";
  const name = headerLink[0].innerText;
  if (name == "Favourites") {
    headerLink[0].innerText = "Search Meals";
    mealSection[0].style.display = "none";
    FavMealSection[0].style.display = "initial";
  } else {
    mealSection[0].style.display = "initial";
    FavMealSection[0].style.display = "none";
    displayMeal(searchBar.value);
    headerLink[0].innerText = "Favourites";
  }
  const iconName = icon[0].getAttribute("name");
  if (iconName == "search") {
    icon[0].setAttribute("name", "heart");
  } else {
    icon[0].setAttribute("name", "search");
  }
  renderMeals();
}

// RENDERING FAVIOURATE MEALS
async function renderMeals() {
  mealContainer[1].innerHTML = "";
  for (let mealid of favMealList) {
    const url =
      "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + mealid;
    const response = await fetch(url);
    const data = await response.json();
    const [meal] = data.meals;
    const html = `<div class="meal-card">
    <div class="image">
      <img src=${meal.strMealThumb} alt="meal" />
    </div>
    <h3>${meal.strMeal}</h3>
    <div class="button-container">
      <button data-id=${meal.idMeal}  type="button">More Details</button>
      <ion-icon data-id=${meal.idMeal} name="heart"></ion-icon>
    </div>
  </div>`;
    mealContainer[1].insertAdjacentHTML("beforeend", html);
  }
  // handling event listeners on buttons
  const getDetailButton = document.querySelectorAll(
    " .button-container button"
  );
  const favIcon = document.querySelectorAll(".fav-meals ion-icon");
  for (let btn of getDetailButton) {
    btn.addEventListener("click", (e) => {
      model[0].style.visibility = "visible";
      const mealid = e.target.getAttribute("data-id");
      getMealDetails(mealid);
    });
  }
  //  REMOVING MEALS from favMealsList
  for (let i of favIcon) {
    i.addEventListener("click", (e) => {
      const mealid = e.target.getAttribute("data-id");
      favMealList = favMealList.filter((id) => {
        return id != mealid;
      });
      renderMeals();
    });
  }
}
// Adding Event Listeners
searchBar.addEventListener("keyup", (e) => {
  mealContainer[0].innerHTML = "";
  if (e.target.value == "") {
    return;
  }

  displayMeal(e.target.value);
});

favourites[0].addEventListener("click", toggleIcons);
