//####### Excahnge Rates Api #######//
// Site url = https://rates.hirak.site/
// const api =
//   "https://rates.hirak.site/rate.php?from=USD&to=TRY&token=57b00d44989865016296053f62879c30";

// let currentRate = 0;

// function getData(api) {
//   fetch(api)
//     .then((res) => {
//       return res.json();
//     })
//     .then((data) => {
//       currentRate = data.rate;
//     });
// }

// getData(api);

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

//####### IU Controller #######//

const UIController = (function () {
  const Selectors = {
    productsList: "#item-list",
    productListItems: "#item-list tr",
    addButton: ".addBtn",
    updateButton: ".updateBtn",
    deleteButton: ".deleteBtn",
    cancelButton: ".cancelBtn",
    productName: "#productName",
    productPrice: "#productPrice",
    productCard: "#productCard",
    totalTL: "#total-tl",
    totalDollar: "#total-dollar",
  };
  return {
    createProductList: function (products) {
      let html = "";
      products.forEach((item) => {
        html += `            
        <tr>
        <td>${item.id}</td>
        <td>${item.name}</td>
        <td>${item.price} $</td>
        <td class="text-right">
            <i class="far fa-edit edit-product"></i>          
        </td>
      </tr>`;
      });

      document.querySelector(Selectors.productsList).innerHTML = html;
    },
    getSelectors: function () {
      return Selectors;
    },
    addProduct: function (product) {
      document.querySelector(Selectors.productCard).style.display = "block";
      var item = `
      <tr>
      <td>${product.id}</td>
      <td>${product.name}</td>
      <td>${product.price} $</td>
      <td class="text-right">
          <i class="far fa-edit edit-product"></i>
      </td>
    </tr>
      `;

      document.querySelector(Selectors.productsList).innerHTML += item;
    },

    updateProductFromUI: function (prd) {
      let updatedItem = null;

      let items = document.querySelectorAll(Selectors.productListItems);
      items.forEach((item) => {
        if (item.classList.contains("bg-warning")) {
          item.children[1].textContent = prd.name;
          item.children[2].textContent = prd.price + " $";
          updatedItem = item;
          console.log("asdfs");
        }
      });

      return updatedItem;
    },

    clerInputs: function () {
      document.querySelector(Selectors.productName).value = "";
      document.querySelector(Selectors.productPrice).value = "";
    },

    clearWarnings: function () {
      const items = document.querySelectorAll(Selectors.productListItems);
      items.forEach((item) => {
        if (item.classList.contains("bg-warning")) {
          item.classList.remove("bg-warning");
        }
      });
    },

    hideCard: function () {
      document.querySelector(Selectors.productCard).style.display = "none";
    },
    showTotal: function (total) {
      document.querySelector(Selectors.totalTL).textContent =
        (total * 17.92).toFixed(2) + " TL";

      //With Api
      // (total * currentRate).toFixed(2) + " TL";

      document.querySelector(Selectors.totalDollar).textContent =
        total.toFixed(2) + " $";
    },
    addProductToForm: function () {
      const selectedProduct = ProductController.getCurrentProduct();
      document.querySelector(Selectors.productName).value =
        selectedProduct.name;
      document.querySelector(Selectors.productPrice).value =
        selectedProduct.price;
    },

    deleteProductUI: function () {
      let items = document.querySelectorAll(Selectors.productListItems);
      items.forEach((item) => {
        if (item.classList.contains("bg-warning")) {
          item.remove();
        }
      });
    },

    addingState: function (item) {
      UIController.clearWarnings();
      UIController.clerInputs();
      document.querySelector(Selectors.addButton).style.display = "inline";
      document.querySelector(Selectors.updateButton).style.display = "none";
      document.querySelector(Selectors.deleteButton).style.display = "none";
      document.querySelector(Selectors.cancelButton).style.display = "none";
    },
    editState: function (tr) {
      tr.classList.add("bg-warning");
      document.querySelector(Selectors.addButton).style.display = "none";
      document.querySelector(Selectors.updateButton).style.display = "inline";
      document.querySelector(Selectors.deleteButton).style.display = "inline";
      document.querySelector(Selectors.cancelButton).style.display = "inline";
    },
  };
})();

//####### App Controller #######//
const App = (function (ProductCtrl, UICtrl, StorageCtrl) {
  const UISelectors = UICtrl.getSelectors();

  // Load Event Listeners
  const loadEventListeners = function () {
    //Add product event
    document
      .querySelector(UISelectors.addButton)
      .addEventListener("click", productAddSubmit);

    // Edit Product click
    document
      .querySelector(UISelectors.productsList)
      .addEventListener("click", productEditClick);

    // edit product submit
    document
      .querySelector(UISelectors.updateButton)
      .addEventListener("click", editProductSubmit);

    // Cancel button click
    document
      .querySelector(UISelectors.cancelButton)
      .addEventListener("click", cancelUpdate);

    // Delete button click
    document
      .querySelector(UISelectors.deleteButton)
      .addEventListener("click", deleteProductSubmit);
  };

  const productAddSubmit = function (e) {
    const productName = document.querySelector(UISelectors.productName).value;

    const productPrice = document.querySelector(UISelectors.productPrice).value;

    if (productName != "" && productPrice != "") {
      //Add product
      const newProduct = ProductCtrl.addProduct(productName, productPrice);

      //Add item to list
      UICtrl.addProduct(newProduct);

      //Add item to LS
      StorageCtrl.storeProduct(newProduct);
      //get total
      const total = ProductCtrl.getTotal();

      //show total
      UICtrl.showTotal(total);

      //Clear inputs
      UICtrl.clerInputs();
    }

    console.log(productName, productPrice);
    e.preventDefault();
  };

  const productEditClick = function (e) {
    if (e.target.classList.contains("edit-product")) {
      const id =
        e.target.parentNode.previousElementSibling.previousElementSibling
          .previousElementSibling.textContent;

      // get selected product
      const product = ProductCtrl.getProductById(id);

      // set current product
      ProductCtrl.setCurrentProduct(product);

      UICtrl.clearWarnings();

      // add product to UI
      UICtrl.addProductToForm();

      UICtrl.editState(e.target.parentNode.parentNode);
    }
    e.preventDefault();
  };

  const editProductSubmit = function (e) {
    const productName = document.querySelector(UISelectors.productName).value;

    const productPrice = document.querySelector(UISelectors.productPrice).value;

    if (productName !== "" && productPrice !== "") {
      //Update product
      const updatedProduct = ProductCtrl.updateProduct(
        productName,
        productPrice
      );

      // Update ui
      let item = UICtrl.updateProductFromUI(updatedProduct);

      //get total
      const total = ProductCtrl.getTotal();

      //show total
      UICtrl.showTotal(total);

      // update storage
      StorageCtrl.updateProductLS(updatedProduct);

      UICtrl.addingState();
    }

    e.preventDefault();
  };

  const cancelUpdate = function (e) {
    UICtrl.addingState();
    UICtrl.clearWarnings();
    e.preventDefault();
  };

  const deleteProductSubmit = function (e) {
    //Get selected product
    const selectedProduct = ProductCtrl.getCurrentProduct();

    //Delete Product
    ProductCtrl.deleteProduct(selectedProduct);

    //Delete From UI
    UICtrl.deleteProductUI();

    //get total
    const total = ProductCtrl.getTotal();

    //show total
    UICtrl.showTotal(total);

    // Delete from LS

    StorageCtrl.deleteProductLS(selectedProduct.id);

    UICtrl.addingState();

    if (total == 0) {
      UICtrl.hideCard();
    }

    e.preventDefault();
  };

  return {
    init: function () {
      console.log("starting app...");

      UICtrl.addingState();

      const products = ProductCtrl.getProducts();

      if (products.length == 0) {
        UICtrl.hideCard();
      } else {
        UICtrl.createProductList(products);
        let total = ProductCtrl.getTotal();
        UICtrl.showTotal(total);
      }
      loadEventListeners();
    },
  };
})(ProductController, UIController, StorageController);

App.init();
