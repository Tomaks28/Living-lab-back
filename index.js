const express = require("express");
const cors = require("cors");
const formidableMiddleware = require("express-formidable");
const leboncoin = require("leboncoin-api");

const app = express();
app.use(cors());
app.use(formidableMiddleware());

// Endpoint de recherche sur le boncoin
app.post("/search", (req, res) => {
  try {
    const lat = parseFloat(req.fields.lat);
    const lng = parseFloat(req.fields.lng);
    const radius = parseFloat(req.fields.radius);
    const minPrice = parseFloat(req.fields.minPrice);
    const maxPrice = parseFloat(req.fields.maxPrice);

    var search = new leboncoin.Search()
      .setPage(1)
      .setQuery("renove")
      .setFilter(leboncoin.FILTERS.ALL)
      .setCategory("locations")
      .setArea({ lat, lng, radius })
      //.setSort({sort_by:"date",sort_order:"asc"})
      .addSearchExtra("price", { min: minPrice, max: maxPrice }) // will add a range of price
      .addSearchExtra("furnished", ["1", "Non meublé"]); // will add enums for Meublé and Non meublé

    search.run().then(
      ({ page, pages, nbResult, results }) => {
        console.log(`${page}/${pages} sur ${nbResult} de pages`);
        res.send(results);
      },
      (err) => console.log(err)
    );
  } catch (err) {
    res.status(500).send({ error: "Erreur serveur" });
  }
});

// route par défaut si non trouvée
app.all("*", function (req, res) {
  res.send({ message: "La route n'existe pas" });
});

// démarrage du serveur
app.listen(3000, () => {
  console.log("Server has started");
});
