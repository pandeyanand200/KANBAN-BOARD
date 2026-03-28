const columns = document.querySelectorAll(".column");
const modal = document.querySelector(".modal");
const openBtn = document.getElementById("openModal");
const addBtn = document.getElementById("addTask");

let dragged = null;

/* ========= MODAL ========= */

openBtn.onclick = () => modal.classList.add("active");

document.querySelector(".overlay").onclick = () => {
  modal.classList.remove("active");
};

/* ========= CREATE TASK ========= */

function createTask(title, desc) {
  const div = document.createElement("div");
  div.className = "task";
  div.draggable = true;

  div.innerHTML = `
    <h3>${title}</h3>
    <p>${desc}</p>
    <button>Delete</button>
  `;

  div.addEventListener("dragstart", () => {
    dragged = div;
  });

  div.querySelector("button").onclick = () => {
    div.remove();
    updateCounts();
    saveData();
  };

  return div;
}

/* ========= ADD TASK ========= */

addBtn.onclick = () => {
  const title = document.getElementById("title").value;
  const desc = document.getElementById("desc").value;

  if (!title || !desc) return;

  const task = createTask(title, desc);
  document.getElementById("todo").appendChild(task);

  modal.classList.remove("active");

  updateCounts();
  saveData();
};

/* ========= DRAG DROP ========= */

columns.forEach(col => {

  col.addEventListener("dragover", e => e.preventDefault());

  col.addEventListener("dragenter", () => {
    col.classList.add("hover");
  });

  col.addEventListener("dragleave", () => {
    col.classList.remove("hover");
  });

  col.addEventListener("drop", () => {
    col.appendChild(dragged);
    col.classList.remove("hover");

    updateCounts();
    saveData();
  });

});

/* ========= COUNT ========= */

function updateCounts() {
  columns.forEach(col => {
    const count = col.querySelector(".count");
    count.innerText = col.querySelectorAll(".task").length;
  });
}

/* ========= STORAGE ========= */

function saveData() {
  const data = {};

  columns.forEach(col => {
    data[col.id] = [];

    col.querySelectorAll(".task").forEach(task => {
      data[col.id].push({
        title: task.querySelector("h3").innerText,
        desc: task.querySelector("p").innerText
      });
    });
  });

  localStorage.setItem("kanbanPro", JSON.stringify(data));
}

function loadData() {
  const data = JSON.parse(localStorage.getItem("kanbanPro"));
  if (!data) return;

  Object.keys(data).forEach(colId => {
    const column = document.getElementById(colId);

    data[colId].forEach(task => {
      const el = createTask(task.title, task.desc);
      column.appendChild(el);
    });
  });

  updateCounts();
}

/* ========= INIT ========= */

loadData();