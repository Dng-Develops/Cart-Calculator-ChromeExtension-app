import ProductController from "/product.js";
import StorageController from "/storage.js";
import UIController from "/uı.js";

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
