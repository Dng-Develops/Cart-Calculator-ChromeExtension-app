//####### Storage Controller #######//
const StorageController = (function () {
  return {
    storeProduct: function (product) {
      let products;
      if (localStorage.getItem("products") === null) {
        products = [];
        products.push(product);
      } else {
        products = JSON.parse(localStorage.getItem("products"));
        products.push(product);
      }
      localStorage.setItem("products", JSON.stringify(products));
    },
    getProducts: function () {
      let products;
      if (localStorage.getItem("products") === null) {
        products = [];
      } else {
        products = JSON.parse(localStorage.getItem("products"));
      }
      return products;
    },
    updateProductLS: function (product) {
      let products = JSON.parse(localStorage.getItem("products"));

      products.forEach(function (item, index) {
        if (product.id == item.id) {
          products.splice(index, 1, product);
        }
      });
      localStorage.setItem("products", JSON.stringify(products));
    },

    deleteProductLS: function (id) {
      let products = JSON.parse(localStorage.getItem("products"));

      products.forEach(function (item, index) {
        if (id == item.id) {
          products.splice(index, 1);
        }
      });
      localStorage.setItem("products", JSON.stringify(products));
    },
  };
})();

export default StorageController;
