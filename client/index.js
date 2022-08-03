import "../server/lib/cloudinary"
(function main() {
  var dataURL
    const myDropzone = new Dropzone(".foto-input", {
        url: "/falsa",
        autoProcessQueue: false,
      });
      
      myDropzone.on("thumbnail", function (file) {
        console.log(file.dataURL);
        dataURL = file.dataURL
      });
  const formEl = document.querySelector(".my-form");
  formEl.addEventListener("submit", (e) => {
    e.preventDefault();
    let name = e.target["name"].value;
    let bio = e.target["bio"].value;
    let imageUrl = dataURL;
  });
})();

fetch("/profiles",
{
  method:"POST",
  headers:{
    "content-type":"application/json"
  },
  body: JSON.stringify({
    name,bio,imageUrl
  })
})
