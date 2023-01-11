const alpha = "abcdefghijklmnopqrstuvwxyz";
const alphalist = document.querySelector(".alphabetlist");
const search = document.querySelector(".searchicon");
const randhold = document.querySelector(".random-holder");
const imgholder = document.querySelector("#imgul");
const popupcon = document.querySelector(".popupcon");

//for random meal info
async function fetchrandomdata() {
  const posts = await fetch(
    "https://www.themealdb.com/api/json/v1/1/random.php"
  );
  const datas = await posts.json();

  const res = datas.meals[0];
  return res;
}
async function getrandomdata() {
  const datas = await fetchrandomdata();
  const rand = document.createElement("div");
  rand.classList.add("rand");
  rand.innerHTML = `<div class="img-holder">
  <img src=${datas.strMealThumb} />
  <p id="recommend">recommendation</p>
  <div class="re-heart">
    <p>${datas.strMeal}</p>
    <i class="ri-heart-fill" id=${datas.idMeal}></i>
  </div>
</div>`;
  randhold.appendChild(rand);
  const randd = randhold.querySelector(".re-heart i");
  const randimg = randhold.querySelector(".img-holder img");
  randimg.addEventListener("click", async () => {
    console.log(randd.getAttribute("id"));
    const data = await getdataid(randd.getAttribute("id"));
    console.log(data);
    sitepopup(data);
  });
  randd.addEventListener("click", () => {
    favtoggle(randd);
  });
}
getrandomdata();

//for input
function getinputvalue() {
  search.addEventListener("click", () => {
    const val = document.querySelector("#inputs").value;
    fetchinputdata(val);
    imgholder.scrollIntoView({
      behavior: "smooth",
    });
  });
}
getinputvalue();

function enterbtn() {
  const val = document.querySelector("#inputs");
  val.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      console.log("succeess");
      event.preventDefault();
      search.click();
    }
  });
}
enterbtn();
const dan = document.querySelector(".danger");
//show input value images
async function fetchinputdata(val) {
  let post = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${val}`
  );
  const datas = await post.json();

  try {
    if (datas.meals === null) {
      throw "some lost";
    } else {
      console.log("in");

      const res = datas.meals;
      setinputvalue(res);
      return res;
    }
  } catch (e) {
    if (!dan.classList.contains("fordan")) {
      dan.classList.add("fordan");
      imgholder.innerHTML = "";
    }
    dan.innerHTML = `not found ${val}`;
  }
}
async function setinputvalue(datas) {
  let html = "";
  if (dan.classList.contains("fordan")) {
    dan.classList.remove("fordan");
    dan.innerHTML = "";
  }

  datas.forEach((data) => {
    html += `<li>
      <img src=${data.strMealThumb} id=${data.idMeal} />
      <div class="re-heart">
        <p>${data.strMeal}</p>
        <i class="ri-heart-fill heart" id=${data.idMeal}></i>
      </div>
    </li>`;
  });
  imgholder.innerHTML = html;
  showpopup(imgholder);
  favbtnid(imgholder);
}

function favbtnid(imgholder) {
  let hearts = imgholder.querySelectorAll("i");
  hearts.forEach((btn) => {
    btn.addEventListener("click", () => {
      favtoggle(btn);
    });
  });
}

function favtoggle(btn) {
  const id = btn.getAttribute("id");

  if (btn.classList.contains("hactive")) {
    btn.classList.remove("hactive");
    removelsdata(id);
    showfavdish();
  } else {
    btn.classList.add("hactive");
    setlsdata(id);
    showfavdish();
  }
}

async function showfavdish() {
  const favhold = document.querySelector("#favlist");
  const lsdata = getlsdata();

  htm = "";
  for (let i = 0; i < lsdata.length; i++) {
    let iddatas = await getdataid(lsdata[i]);
    iddatas.forEach((img) => {
      htm += `<li>
      <img src=${img.strMealThumb} id=${img.idMeal} />
      <button><i class="ri-close-line favclose" id=${img.idMeal} ></i></button>
    </li>`;
    });
  }
  favhold.innerHTML = htm;
  const favimg = favhold.querySelectorAll("#favlist img");
  favimg.forEach((fimg) => {
    fimg.addEventListener("click", async () => {
      let data = await getdataid(fimg.getAttribute("id"));
      sitepopup(data);
    });
  });

  favrej(favhold);
}
showfavdish();

function favrej(favhold) {
  let btns = favhold.querySelectorAll(".favclose");
  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      removelsdata(btn.getAttribute("id"));
      showfavdish();
    });
  });
}

function showpopup(datas) {
  const imgs = datas.querySelectorAll("img");
  imgs.forEach((img) => {
    img.addEventListener("click", async () => {
      const data = await getdataid(img.getAttribute("id"));
      sitepopup(data);
    });
  });
}

//get data by id
async function getdataid(id) {
  const posts =
    await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}
`);
  const datas = await posts.json();
  const data = datas.meals;

  return data;
}

function sitepopup(data) {
  let html = "";
  data.forEach((ele) => {
    html = `<div class="popup">
    <i class="ri-close-fill close"></i>
    <img src=${ele.strMealThumb} />
    <p class="content">
     ${ele.strInstructions}
    </p>
  </div>`;
  });
  popupcon.classList.toggle("active");
  popupcon.innerHTML = html;
  const close = popupcon.querySelector(".close");
  close.addEventListener("click", () => {
    popupcon.classList.toggle("active");
  });
}

async function getcatdata(val) {
  const posts = await fetch(
    `https://themealdb.com/api/json/v1/1/filter.php?c=${val}`
  );
  const datas = await posts.json();
  const res = datas.meals;
  setinputvalue(res);
}

//for categories
const categoryholder = document.querySelector(".categories");
async function fetchcategoryarea() {
  const ul = document.createElement("ul");
  const posts = await fetch(
    "https://www.themealdb.com/api/json/v1/1/categories.php"
  );
  const res = await posts.json();
  let html = "";
  res.categories.forEach((data) => {
    html += `<li><button id="catbtn">${data.strCategory}</button></li>`;
  });
  ul.innerHTML = html;
  categoryholder.appendChild(ul);
  setcatitems(ul);
}
fetchcategoryarea();

//set categories items
async function setcatitems(ullist) {
  const catbtns = ullist.querySelectorAll(".categories ul #catbtn");

  catbtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      getcatdata(btn.innerHTML);
      document.getElementById("image-con").scrollIntoView({
        behavior: "smooth",
      });
    });
  });
}

setcatitems();

//fetch data by area name
async function fetchareadata(val) {
  //console.log(val);
  const posts = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${val}`
  );
  const datas = await posts.json();
  const meals = datas.meals;
  setinputvalue(meals);
}

function getflagdata() {
  const flags = document.querySelectorAll("#flag");
  flags.forEach((flag) => {
    flag.addEventListener("click", () => {
      const data = flag.getAttribute("data");
      fetchareadata(data);
      document.getElementById("image-con").scrollIntoView({
        behavior: "smooth",
      });
    });
  });
}
getflagdata();

//fetch alphabet data
async function alphadata(val) {
  const posts = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${val}`
  );
  const datas = await posts.json();
  const res = datas.meals;
  setinputvalue(res);
}

//alphabets
function makealpha() {
  html = "";
  for (let i = 0; i < 26; i++) {
    html += `<li><button>${alpha.slice(i, i + 1)}</button></li>`;
  }
  alphalist.innerHTML = html;
  showalphaimg(alphalist);
}
makealpha();
function showalphaimg(list) {
  const data = list.querySelectorAll("button");

  data.forEach((btn) => {
    btn.addEventListener("click", () => {
      alphadata(btn.innerHTML);
      document.getElementById("image-con").scrollIntoView({
        behavior: "smooth",
      });
    });
  });
}

//local storage
function getlsdata() {
  const data = JSON.parse(localStorage.getItem("mealid"));
  return data == null ? [] : data;
}

function setlsdata(btnid) {
  const mealid = getlsdata();
  localStorage.setItem("mealid", JSON.stringify([...mealid, btnid]));
}
function removelsdata(btnid) {
  const mealid = getlsdata();
  localStorage.setItem(
    "mealid",
    JSON.stringify(
      mealid.filter((id) => {
        return id != btnid;
      })
    )
  );
}
