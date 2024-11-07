// 加载库存数据
let inventory = JSON.parse(localStorage.getItem("inventory")) || {}; // 从本地存储中获取库存数据，如果不存在则初始化为空对象
let inStock = JSON.parse(localStorage.getItem("inStock")) || {}; // 从本地存储中获取入库数据，如果不存在则初始化为空对象
let outStock = JSON.parse(localStorage.getItem("outStock")) || {}; // 从本地存储中获取出库数据，如果不存在则初始化为空对象

// 库存管理
function addItemToInventory(item, quantity) {
  if (inventory[item]) {
    inventory[item] += quantity; // 如果商品已存在，则增加数量
  } else {
    inventory[item] = quantity; // 如果商品不存在，则新增商品
  }
  saveInventoryToLocalStorage(); // 保存库存数据到本地存储
}

function removeItemFromInventory(item, quantity) {
  if (inventory[item] && inventory[item] >= quantity) {
    inventory[item] -= quantity; // 减少商品数量
    if (inventory[item] === 0) {
      delete inventory[item]; // 如果数量为0，则删除该商品
    }
    saveInventoryToLocalStorage(); // 保存库存数据到本地存储
  } else {
    alert("库存不足或商品不存在"); // 提示库存不足或商品不存在
  }
}

// 保存库存到本地存储
function saveInventoryToLocalStorage() {
  localStorage.setItem("inventory", JSON.stringify(inventory)); // 将库存数据转换为JSON字符串并保存到本地存储
}

// 更新入库数据
function updateInStock(item, quantity) {
  if (inStock[item]) {
    inStock[item] += quantity; // 如果商品已存在，则增加数量
  } else {
    inStock[item] = quantity; // 如果商品不存在，则新增商品
  }
  saveInStockToLocalStorage(); // 保存入库数据到本地存储
}

// 更新出库数据
function updateOutStock(item, quantity) {
  if (outStock[item]) {
    outStock[item] += quantity; // 如果商品已存在，则增加数量
  } else {
    outStock[item] = quantity; // 如果商品不存在，则新增商品
  }
  saveOutStockToLocalStorage(); // 保存出库数据到本地存储
}

// 保存入库数据到本地存储
function saveInStockToLocalStorage() {
  localStorage.setItem("inStock", JSON.stringify(inStock)); // 将入库数据转换为JSON字符串并保存到本地存储
}

// 保存出库数据到本地存储
function saveOutStockToLocalStorage() {
  localStorage.setItem("outStock", JSON.stringify(outStock)); // 将出库数据转换为JSON字符串并保存到本地存储
}

// 清空库存
document
  .getElementById("clearInventoryButton")
  .addEventListener("click", function () {
    inventory = {}; // 清空库存数据
    inStock = {}; // 清空入库数据
    outStock = {}; // 清空出库数据
    saveInventoryToLocalStorage(); // 保存清空后的库存数据到本地存储
    saveInStockToLocalStorage(); // 保存清空后的入库数据到本地存储
    saveOutStockToLocalStorage(); // 保存清空后的出库数据到本地存储
    location.reload(); // 重新加载页面以更新显示
  });

// 更新库存列表
function updateInventoryTable() {
  const tbody = document.querySelector("#inventoryTable tbody"); // 获取表格的tbody元素
  tbody.innerHTML = ""; // 清空表格内容
  for (const item of Object.keys(inventory)) {
    // 遍历库存中的所有商品
    const quantity = inventory[item] || 0; // 获取商品的库存数量
    const inQuantity = inStock[item] || 0; // 获取商品的入库数量
    const outQuantity = outStock[item] || 0; // 获取商品的出库数量
    const row = `<tr data-item="${item}"><td>${item}</td><td>${quantity}</td><td>${inQuantity}</td><td>${outQuantity}</td></tr>`; // 创建新的表格行
    tbody.insertAdjacentHTML("beforeend", row); // 将新的表格行插入到tbody末尾
  }

  // 添加长按和右键点击事件
  tbody.querySelectorAll("tr").forEach((row) => {
    let timeoutId;

    row.addEventListener("mousedown", () => {
      timeoutId = setTimeout(() => {
        deleteItem(row.dataset.item); // 长按1秒触发删除
      }, 1000);
    });

    row.addEventListener("mouseup", () => {
      clearTimeout(timeoutId); // 取消长按计时器
    });

    row.addEventListener("contextmenu", (e) => {
      e.preventDefault(); // 阻止默认右键菜单
      deleteItem(row.dataset.item); // 右键点击触发删除
    });
  });
}

// 删除商品
function deleteItem(item) {
  if (confirm(`确定要删除商品 "${item}" 吗？`)) {
    // 确认删除操作
    delete inventory[item]; // 从库存中删除商品
    delete inStock[item]; // 从入库数据中删除商品
    delete outStock[item]; // 从出库数据中删除商品
    saveInventoryToLocalStorage(); // 保存更新后的库存数据到本地存储
    saveInStockToLocalStorage(); // 保存更新后的入库数据到本地存储
    saveOutStockToLocalStorage(); // 保存更新后的出库数据到本地存储
    updateInventoryTable(); // 更新库存列表
  }
}

// 初始化库存列表
updateInventoryTable(); // 调用更新库存列表函数

// 过滤库存列表
function filterInventory() {
  const searchValue = document
    .getElementById("searchInput")
    .value.toLowerCase(); // 获取搜索框的值并转换为小写
  const rows = document.querySelectorAll("#inventoryTable tbody tr"); // 获取所有表格行
  rows.forEach((row) => {
    const itemName = row
      .querySelector("td:first-child")
      .textContent.toLowerCase(); // 获取商品名称并转换为小写
    if (itemName.includes(searchValue)) {
      row.style.display = ""; // 如果商品名称包含搜索值，则显示该行
    } else {
      row.style.display = "none"; // 如果商品名称不包含搜索值，则隐藏该行
    }
  });
}

// 导出库存数据为CSV文件
document.getElementById("exportButton").addEventListener("click", function () {
  const csvContent = [
    ["商品名称", "库存", "入库", "出库"].join(","), // CSV文件的表头
    ...Object.keys(inventory).map((item) =>
      [
        // 遍历库存中的所有商品
        item,
        inventory[item] || 0,
        inStock[item] || 0,
        outStock[item] || 0,
      ].join(",")
    ),
  ].join("\n"); // 将所有数据行连接成一个字符串

  // 添加BOM以确保文件正确识别为UTF-8编码
  const bom = "\uFEFF";
  const encodedUri = encodeURI(bom + csvContent); // 编码CSV内容
  const link = document.createElement("a"); // 创建一个a标签
  link.setAttribute("href", "data:text/csv;charset=utf-8," + encodedUri); // 设置a标签的href属性
  link.setAttribute("download", "库存数据.csv"); // 设置下载文件的名称
  document.body.appendChild(link); // 将a标签添加到文档中
  link.click(); // 触发点击事件以下载文件
  document.body.removeChild(link); // 移除a标签
});

// 导入CSV文件
document.getElementById("importButton").addEventListener("click", function () {
  document.getElementById("fileInput").click(); // 触发文件选择对话框
});

document
  .getElementById("fileInput")
  .addEventListener("change", function (event) {
    const file = event.target.files[0]; // 获取选中的文件
    if (file) {
      const reader = new FileReader(); // 创建FileReader对象
      reader.onload = function (e) {
        const csvContent = e.target.result; // 获取文件内容
        parseCSV(csvContent); // 解析CSV内容
      };
      reader.readAsText(file, "UTF-8"); // 读取文件内容为文本
    }
  });

// 解析CSV文件
function parseCSV(csvContent) {
  const lines = csvContent.split("\n"); // 将CSV内容按行分割
  const headers = lines[0].split(","); // 获取表头
  const data = []; // 存储解析后的数据

  for (let i = 1; i < lines.length; i++) {
    // 遍历每一行数据
    const values = lines[i].split(","); // 将行数据按逗号分割
    if (values.length === headers.length) {
      // 如果行数据长度与表头长度一致
      const item = {}; // 创建一个对象存储当前行的数据
      for (let j = 0; j < headers.length; j++) {
        item[headers[j]] = values[j]; // 将表头和值对应存储到对象中
      }
      data.push(item); // 将对象添加到数据数组中
    }
  }

  // 清空现有数据
  inventory = {}; // 清空库存数据
  inStock = {}; // 清空入库数据
  outStock = {}; // 清空出库数据

  // 填充新数据
  data.forEach((item) => {
    const itemName = item["商品名称"]; // 获取商品名称
    const quantity = parseInt(item["库存"], 10); // 获取库存数量并转换为整数
    const inQuantity = parseInt(item["入库"], 10); // 获取入库数量并转换为整数
    const outQuantity = parseInt(item["出库"], 10); // 获取出库数量并转换为整数

    if (!isNaN(quantity)) {
      inventory[itemName] = quantity; // 如果库存数量有效，则添加到库存数据中
    }
    if (!isNaN(inQuantity)) {
      inStock[itemName] = inQuantity; // 如果入库数量有效，则添加到入库数据中
    }
    if (!isNaN(outQuantity)) {
      outStock[itemName] = outQuantity; // 如果出库数量有效，则添加到出库数据中
    }
  });

  // 保存新数据到本地存储
  saveInventoryToLocalStorage(); // 保存库存数据到本地存储
  saveInStockToLocalStorage(); // 保存入库数据到本地存储
  saveOutStockToLocalStorage(); // 保存出库数据到本地存储

  // 更新库存列表
  updateInventoryTable(); // 更新库存列表
}
