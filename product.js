import StorageController from "/storage.js";

//####### Product Controller #######//
const ProductController = (function () {
  //Private
  const Product = function (id, name, price) {
    this.id = id;
    this.name = name;
    this.price = price;
  };

  const data = {
    products: StorageController.getProducts(),
    selectedProduct: null,
    totalPrice: 0,
  };

  //Public
  return {
    getProducts: function () {
      return data.products;
    },
    getData: function () {
      return data;
    },
    getProductById: function (id) {
      let product = null;
      data.products.forEach((item) => {
        if (item.id == id) product = item;
      });
      return product;
    },
    setCurrentProduct: function (product) {
      data.selectedProduct = product;
    },
    getCurrentProduct: function () {
      return data.selectedProduct;
    },
    addProduct: function (name, price) {
      let id;

      if (data.products.length > 0) {
        id = data.products[data.products.length - 1].id + 1;
      } else {
        id = 0;
      }

      const newProduct = new Product(id, name, parseFloat(price));
      data.products.push(newProduct);
      return newProduct;
    },

    updateProduct: function (name, price) {
      let product = null;
      data.products.forEach((item) => {
        if (item.id == data.selectedProduct.id) {
          item.name = name;
          item.price = parseFloat(price);
          product = item;
        }
      });
      return product;
    },

    deleteProduct: function (product) {
      data.products.forEach(function (item, index) {
        if (item.id == product.id) {
          data.products.splice(index, 1);
        }
      });
    },

    getTotal: function () {
      let total = 0;
      data.products.forEach((item) => {
        total += item.price;
      });
      data.totalPrice = total;
      return data.totalPrice;
    },
  };
})();

export default ProductController;
