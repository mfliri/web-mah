require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const path = require("path");
const fs = require("fs");
const { parse } = require("query-string");
const bodyParser = require("body-parser");
const fetch = require("isomorphic-fetch");

app.use(bodyParser.json());
app.get('/microsite', function (request, response) {
  fetch(
    `${
      process.env.REACT_APP_API
    }/graphql?query={GetAgencyDetail(id:${request.query.c_id}){profileImage,agencyName}}`
  ).then(res => res.json())
  .then(({ data }) => {
    const filePath = path.resolve(__dirname, "./build", "index.html");
      fs.readFile(filePath, "utf8", function(err, htmlData) {
        if (err) {
          return console.log(err);
        }
        const { GetAgencyDetail } = data;
        const { profileImage, agencyName} = GetAgencyDetail;

        htmlData = htmlData.replace(
          /\$OG_TITLE/g,
          `Visitar concesionaria ${agencyName}`
        );
        htmlData = htmlData.replace(
          /\$OG_DESCRIPTION/g,
           `Descubre los autos de concesionaria ${agencyName} en Mi auto hoy y cambia la forma de comprar o vender tu auto`
        );
        result = htmlData.replace(
          /\$OG_IMAGE/g,
          `${process.env.REACT_APP_API}/images/${profileImage}`
        );
        response.send(result);
      });
    })
    .catch(err => console.log("error", err));
})
app.get("/carDetail", function(request, response) {
  fetch(
    `${
      process.env.REACT_APP_API
    }/graphql?query={Publication(id%3A${request.query.publication_id}){ImageGroup{image1}modelName%2Cbrand%2Cobservation}}`
  )
    .then(res => res.json())
    .then(({ data }) => {
      const filePath = path.resolve(__dirname, "./build", "index.html");
      fs.readFile(filePath, "utf8", function(err, htmlData) {
        if (err) {
          return console.log(err);
        }
        const { Publication } = data;
        const { ImageGroup } = Publication;

        htmlData = htmlData.replace(
          /\$OG_TITLE/g,
          `${Publication.brand} - ${Publication.modelName}`
        );
        htmlData = htmlData.replace(
          /\$OG_DESCRIPTION/g,
          Publication.observation === null ? "Mi auto hoy. Cambia la forma de comprar o vender tu auto" : Publication.observation
        );
        result = htmlData.replace(
          /\$OG_IMAGE/g,
          `${process.env.REACT_APP_API}/images/${ImageGroup.image1}`
        );
        response.send(result);
      });
    })
    .catch(err => console.log("error", err));
});
app.use(express.static(path.resolve(__dirname, "./build")));

app.get("*", function(request, response) {
  const filePath = path.resolve(__dirname, "./build", "index.html");
  response.sendFile(filePath);
});
app.listen(port, () => console.log(`Listening on port ${port}`));
