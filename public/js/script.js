const fetchButton = document.querySelector("#fetch-btn")
const donutInput = document.querySelector("#donut-input")
const donutList = document.querySelector("#donut-list")

function makeList(donutsList) {
    for (i of donutsList) {
        div = document.createElement("article")
        li = document.createElement("li")
        li.innerText = i.donut
        button = document.createElement("button")
        button.innerText = "Remove"
        li.appendChild(button)
        li.className = "card"
        div.className = "card"
        div.appendChild(li)
        donutList.appendChild(div)
        button.addEventListener("click", async () => {
            await fetch("/.netlify/functions/donut", {
                method: "DELETE",
                body: JSON.stringify({
                    donut: button.parentNode.innerHTML.split("<")[0]
                })
            })
            var data = await (await fetch("/.netlify/functions/donut")).json();
            console.log(data.donutList);
            makeList(data.donutList)
        })
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    var data = await (await fetch("/.netlify/functions/donut")).json();
    console.log(data.donutList);
    makeList(data.donutList)
})

fetchButton.addEventListener("click", async (e) => {
    var donut = donutInput.value
    console.log(donut);
    e.preventDefault();
    var data = await (await fetch("/.netlify/functions/donut", {
        method: "POST",
        body: JSON.stringify({
            donut: donut
        })
    })).json();
    var li = document.createElement("li")
    li.innerText = donut
    donutList.appendChild(li)
    document.querySelector("#target").innerText = data.message;
})