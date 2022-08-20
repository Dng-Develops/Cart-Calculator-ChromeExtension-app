import ProductController from "/product.js";

//####### Excahnge Rates Api #######//
// Github = https://github.com/fawazahmed0/currency-api

const api =
  "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd/try.json";

async function getData(api) {
  return fetch(api).then((res) => res.json().then((data) => data.try));
}

const currentRate = await getData(api);
console.log(currentRate);

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
        (total * currentRate).toFixed(2) + " TL";
      //Wihout api
      // (total * 17.92).toFixed(2) + " TL";

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

export default UIController;
