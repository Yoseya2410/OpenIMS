// 从本地存储加载商品列表
let items = JSON.parse(localStorage.getItem("items")) || [
  "苹果",
  "香蕉",
  "橙子",
]; // 获取本地存储中的商品列表，如果不存在则使用默认值

// 初始化下拉菜单
function initializeDropdowns() {
  const inDropdown = document.getElementById("inDropdown"); // 获取入库下拉菜单元素
  const outDropdown = document.getElementById("outDropdown"); // 获取出库下拉菜单元素

  inDropdown.innerHTML = ""; // 清空现有内容
  outDropdown.innerHTML = ""; // 清空现有内容

  items.forEach((item) => {
    const link = document.createElement("a"); // 创建新的链接元素
    link.href = "#"; // 设置链接的href属性
    link.textContent = item; // 设置链接的文本内容
    link.onclick = () => selectItem("inItem", item); // 设置点击事件，选择商品
    inDropdown.appendChild(link); // 将链接添加到入库下拉菜单

    const outLink = document.createElement("a"); // 创建新的链接元素
    outLink.href = "#"; // 设置链接的href属性
    outLink.textContent = item; // 设置链接的文本内容
    outLink.onclick = () => selectItem("outItem", item); // 设置点击事件，选择商品
    outDropdown.appendChild(outLink); // 将链接添加到出库下拉菜单

    // 添加删除按钮
    const deleteButton = document.createElement("span"); // 创建删除按钮元素
    deleteButton.className = "delete-button"; // 设置类名
    deleteButton.textContent = "✕"; // 设置文本内容
    deleteButton.onclick = () => deleteItem(item); // 设置点击事件，删除商品
    link.appendChild(deleteButton); // 将删除按钮添加到链接
    outLink.appendChild(deleteButton.cloneNode(true)); // 将删除按钮克隆并添加到出库链接
  });
}

// 处理表单提交和更新库存列表
document.getElementById("inForm").addEventListener("submit", function (event) {
  event.preventDefault(); // 阻止表单默认提交行为
  const item = document.getElementById("inItem").value; // 获取商品名称
  const quantity = parseInt(document.getElementById("inQuantity").value); // 获取商品数量
  addItemToInventory(item, quantity); // 将商品添加到库存
  updateInStock(item, quantity); // 更新入库数据
  this.reset(); // 重置表单
});

document.getElementById("outForm").addEventListener("submit", function (event) {
  event.preventDefault(); // 阻止表单默认提交行为
  const item = document.getElementById("outItem").value; // 获取商品名称
  const quantity = parseInt(document.getElementById("outQuantity").value); // 获取商品数量
  removeItemFromInventory(item, quantity); // 从库存中移除商品
  updateOutStock(item, quantity); // 更新出库数据
  this.reset(); // 重置表单
});

// 添加新商品
document
  .getElementById("addFormItem")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // 阻止表单默认提交行为
    const newItem = document.getElementById("newItem").value.trim(); // 获取新商品名称并去除空格
    if (newItem && !items.includes(newItem)) {
      // 检查商品是否已存在
      items.push(newItem); // 将新商品添加到列表
      addNewItemToDropdowns(newItem); // 将新商品添加到下拉菜单
      localStorage.setItem("items", JSON.stringify(items)); // 保存商品列表到本地存储
      this.reset(); // 重置表单
      closeModal("addNewItemModal"); // 关闭弹窗
    } else {
      alert("商品已存在或输入无效"); // 提示用户商品已存在或输入无效
    }
  });

// 添加新商品到下拉菜单
function addNewItemToDropdowns(item) {
  const inDropdown = document.getElementById("inDropdown"); // 获取入库下拉菜单元素
  const outDropdown = document.getElementById("outDropdown"); // 获取出库下拉菜单元素

  const link = document.createElement("a"); // 创建新的链接元素
  link.href = "#"; // 设置链接的href属性
  link.textContent = item; // 设置链接的文本内容
  link.onclick = () => selectItem("inItem", item); // 设置点击事件，选择商品
  inDropdown.appendChild(link); // 将链接添加到入库下拉菜单

  const outLink = document.createElement("a"); // 创建新的链接元素
  outLink.href = "#"; // 设置链接的href属性
  outLink.textContent = item; // 设置链接的文本内容
  outLink.onclick = () => selectItem("outItem", item); // 设置点击事件，选择商品
  outDropdown.appendChild(outLink); // 将链接添加到出库下拉菜单

  // 添加删除按钮
  const deleteButton = document.createElement("span"); // 创建删除按钮元素
  deleteButton.className = "delete-button"; // 设置类名
  deleteButton.textContent = "✕"; // 设置文本内容
  deleteButton.onclick = () => deleteItem(item); // 设置点击事件，删除商品
  link.appendChild(deleteButton); // 将删除按钮添加到链接
  outLink.appendChild(deleteButton.cloneNode(true)); // 将删除按钮克隆并添加到出库链接
}

// 删除商品
function deleteItem(item) {
  if (confirm(`确定要删除商品 "${item}" 吗？`)) {
    // 确认删除
    items = items.filter((i) => i !== item); // 从商品列表中移除商品
    localStorage.setItem("items", JSON.stringify(items)); // 保存更新后的商品列表到本地存储
    initializeDropdowns(); // 重新初始化下拉菜单
    removeItemFromInventory(item, inventory[item]); // 从库存中移除商品
    delete inStock[item]; // 从入库数据中移除商品
    delete outStock[item]; // 从出库数据中移除商品
    saveInStockToLocalStorage(); // 保存入库数据到本地存储
    saveOutStockToLocalStorage(); // 保存出库数据到本地存储
  }
}

// 库存管理
let inventory = {}; // 库存对象
let inStock = JSON.parse(localStorage.getItem("inStock")) || {}; // 从本地存储加载入库数据
let outStock = JSON.parse(localStorage.getItem("outStock")) || {}; // 从本地存储加载出库数据

function addItemToInventory(item, quantity) {
  if (inventory[item]) {
    inventory[item] += quantity; // 如果商品已存在，增加数量
  } else {
    inventory[item] = quantity; // 如果商品不存在，添加新商品
  }
  saveInventoryToLocalStorage(); // 保存库存到本地存储
}

function removeItemFromInventory(item, quantity) {
  if (inventory[item] && inventory[item] >= quantity) {
    inventory[item] -= quantity; // 如果库存数量足够，减少数量
    if (inventory[item] === 0) {
      delete inventory[item]; // 如果库存数量为0，移除商品
    }
    saveInventoryToLocalStorage(); // 保存库存到本地存储
  }
}

// 保存库存到本地存储
function saveInventoryToLocalStorage() {
  localStorage.setItem("inventory", JSON.stringify(inventory)); // 保存库存到本地存储
}

// 更新入库数据
function updateInStock(item, quantity) {
  if (inStock[item]) {
    inStock[item] += quantity; // 如果商品已存在，增加数量
  } else {
    inStock[item] = quantity; // 如果商品不存在，添加新商品
  }
  saveInStockToLocalStorage(); // 保存入库数据到本地存储
}

// 更新出库数据
function updateOutStock(item, quantity) {
  if (outStock[item]) {
    outStock[item] += quantity; // 如果商品已存在，增加数量
  } else {
    outStock[item] = quantity; // 如果商品不存在，添加新商品
  }
  saveOutStockToLocalStorage(); // 保存出库数据到本地存储
}

// 保存入库数据到本地存储
function saveInStockToLocalStorage() {
  localStorage.setItem("inStock", JSON.stringify(inStock)); // 保存入库数据到本地存储
}

// 保存出库数据到本地存储
function saveOutStockToLocalStorage() {
  localStorage.setItem("outStock", JSON.stringify(outStock)); // 保存出库数据到本地存储
}

// 清空库存
document
  .getElementById("clearInventoryButton")
  .addEventListener("click", function () {
    inventory = {}; // 清空库存
    inStock = {}; // 清空入库数据
    outStock = {}; // 清空出库数据
    saveInventoryToLocalStorage(); // 保存库存到本地存储
    saveInStockToLocalStorage(); // 保存入库数据到本地存储
    saveOutStockToLocalStorage(); // 保存出库数据到本地存储
    location.reload(); // 重新加载页面以更新显示
  });

// 下拉菜单操作
function toggleDropdown(dropdownId) {
  const dropdown = document.getElementById(dropdownId); // 获取下拉菜单元素
  dropdown.classList.toggle("show"); // 切换显示状态
}

function selectItem(inputId, item) {
  document.getElementById(inputId).value = item; // 设置输入框的值为选中的商品
  toggleDropdown(inputId.replace("Item", "Dropdown")); // 关闭下拉菜单
}

// 弹窗操作
function openModal(modalId) {
  document.getElementById(modalId).style.display = "flex"; // 显示弹窗
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none"; // 隐藏弹窗
}

closeModal("addNewItemModal"); // 弹窗默认关闭
document
  .getElementById("addNewItemButton")
  .addEventListener("click", () => openModal("addNewItemModal")); // 打开添加商品弹窗
document
  .getElementById("closeAddNewItemModal")
  .addEventListener("click", () => closeModal("addNewItemModal")); // 关闭添加商品弹窗

// 关闭下拉菜单
window.onclick = function (event) {
  if (!event.target.matches(".dropdown input")) {
    const dropdowns = document.getElementsByClassName("dropdown-content"); // 获取所有下拉菜单
    for (let i = 0; i < dropdowns.length; i++) {
      const openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show"); // 关闭显示的下拉菜单
      }
    }
  }
  if (event.target == document.getElementById("addNewItemModal")) {
    closeModal("addNewItemModal"); // 点击弹窗外区域关闭弹窗
  }
};

// 初始化下拉菜单
initializeDropdowns();

// 加载库存数据
const storedInventory = localStorage.getItem("inventory"); // 从本地存储获取库存数据
if (storedInventory) {
  inventory = JSON.parse(storedInventory); // 解析库存数据
}

// 加载入库数据
const storedInStock = localStorage.getItem("inStock"); // 从本地存储获取入库数据
if (storedInStock) {
  inStock = JSON.parse(storedInStock); // 解析入库数据
}

// 加载出库数据
const storedOutStock = localStorage.getItem("outStock"); // 从本地存储获取出库数据
if (storedOutStock) {
  outStock = JSON.parse(storedOutStock); // 解析出库数据
}
