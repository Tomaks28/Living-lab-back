const leboncoin = require("leboncoin-api");

const searchLeboncoin = (settings) => {
  const lat = parseFloat(settings.lat);
  const lng = parseFloat(settings.lng);
  const radius = parseFloat(settings.radius);
  const minPrice = parseFloat(settings.minPrice);
  const maxPrice = parseFloat(settings.maxPrice);

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
      return results;
      if (results.length > 0) {
        results[0].getDetails().then(
          (details) => {
            console.log(details); // the item 0 with more data such as description, all images, author, ...
          },
          (err) => console.log(err)
        );
        results[0].getPhoneNumber().then(
          (phoneNumber) => console.log(phoneNumber), // the phone number of the author if available
          (err) => console.log(err)
        );
        return true;
      } else {
        return false;
      }
    },
    (err) => console.log(err)
  );
};

module.exports = searchLeboncoin;
