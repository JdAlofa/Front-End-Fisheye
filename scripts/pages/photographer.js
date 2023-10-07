function photographerPage(data) {
    


}

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
console.log(id); // Display the id parameter in the console

link.setAttribute("href", `./photographer.html?id=${id}`);