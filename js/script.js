// ==========================================================================
// Mobile Navigation Drawer with Overlay & Animated Hamburger
// ==========================================================================
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const navOverlay = document.getElementById("navOverlay");

function openMenu() {
  if (!menuToggle || !navLinks) return;
  menuToggle.classList.add("active");
  menuToggle.setAttribute("aria-expanded", "true");
  navLinks.classList.add("open");
  if (navOverlay) navOverlay.classList.add("open");
  document.body.classList.add("menu-locked");
}

function closeMenu() {
  if (!menuToggle || !navLinks) return;
  menuToggle.classList.remove("active");
  menuToggle.setAttribute("aria-expanded", "false");
  navLinks.classList.remove("open");
  if (navOverlay) navOverlay.classList.remove("open");
  document.body.classList.remove("menu-locked");
}

function toggleMenu(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  if (navLinks.classList.contains("open")) {
    closeMenu();
  } else {
    openMenu();
  }
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", toggleMenu);

  if (navOverlay) {
    navOverlay.addEventListener("click", closeMenu);
  }

  document.addEventListener("click", function (e) {
    if (navLinks.classList.contains("open") && !navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && navLinks.classList.contains("open")) {
      closeMenu();
    }
  });

  const links = navLinks.querySelectorAll("a");
  links.forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });
}

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskError = document.getElementById("taskError");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const emptyMessage = document.getElementById("emptyMessage");
const clearCompleted = document.getElementById("clearCompleted");

let savedTasks = localStorage.getItem("myTasks");
let tasks = [];

if (savedTasks) {
  try {
    tasks = JSON.parse(savedTasks);
  } catch (e) {
    tasks = [];
  }
} else {
  tasks = [
    { name: "Study COS 106 HTML5 Semantic Elements", completed: true },
    { name: "Build Responsive CSS Grid & Flexbox Layouts", completed: false },
    { name: "Complete JavaScript Academic Planner Term Project", completed: false }
  ];
  localStorage.setItem("myTasks", JSON.stringify(tasks));
}

function saveTasks() {
  localStorage.setItem("myTasks", JSON.stringify(tasks));
}

function updateStats() {
  const remaining = tasks.filter(function (t) { return !t.completed; }).length;
  taskCount.textContent = remaining + (remaining === 1 ? " task left" : " tasks left");
  emptyMessage.style.display = tasks.length === 0 ? "block" : "none";
}

function renderTasks() {
  if (!taskList) return;
  taskList.innerHTML = "";

  tasks.forEach(function (task, index) {
    const li = document.createElement("li");
    if (task.completed) {
      li.classList.add("completed");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", "Mark task as completed");
    checkbox.addEventListener("change", function () {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.name;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "✕ Delete";
    deleteBtn.setAttribute("aria-label", "Delete task");
    deleteBtn.addEventListener("click", function () {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    li.appendChild(checkbox);
    li.appendChild(text);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });

  updateStats();
}

if (taskForm) {
  taskForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const taskName = taskInput.value.trim();

    if (taskName === "") {
      taskError.textContent = "Please type a task before adding.";
      return;
    }

    taskError.textContent = "";
    tasks.push({ name: taskName, completed: false });
    saveTasks();
    renderTasks();
    taskInput.value = "";
    taskInput.focus();
  });

  if (clearCompleted) {
    clearCompleted.addEventListener("click", function () {
      tasks = tasks.filter(function (task) {
        return task.completed === false;
      });
      saveTasks();
      renderTasks();
    });
  }

  renderTasks();
}

const contactForm = document.getElementById("contactForm");

function setError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (!input || !error) return;

  error.textContent = message;

  if (message === "") {
    input.classList.remove("invalid");
  } else {
    input.classList.add("invalid");
  }
}

function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

if (contactForm) {
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const message = document.getElementById("message").value.trim();
    const successMessage = document.getElementById("successMessage");

    let isValid = true;

    if (name === "") {
      setError("name", "nameError", "Full name is required.");
      isValid = false;
    } else {
      setError("name", "nameError", "");
    }

    if (email === "") {
      setError("email", "emailError", "Email address is required.");
      isValid = false;
    } else if (!isValidEmail(email)) {
      setError("email", "emailError", "Please enter a valid email address (e.g. name@example.com).");
      isValid = false;
    } else {
      setError("email", "emailError", "");
    }

    if (phone === "") {
      setError("phone", "phoneError", "Phone number is required.");
      isValid = false;
    } else if (!/^\d+$/.test(phone)) {
      setError("phone", "phoneError", "Phone number must contain digits only.");
      isValid = false;
    } else {
      setError("phone", "phoneError", "");
    }

    if (message === "") {
      setError("message", "messageError", "Please provide a message.");
      isValid = false;
    } else {
      setError("message", "messageError", "");
    }

    if (isValid) {
      successMessage.textContent =
        "✓ Thank you, " + name + "! Your message has been received successfully.";
      successMessage.classList.add("show");
      contactForm.reset();

      setTimeout(function () {
        successMessage.classList.remove("show");
      }, 6000);
    } else {
      successMessage.classList.remove("show");
      successMessage.textContent = "";
    }
  });
}
