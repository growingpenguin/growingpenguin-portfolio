const COOKIE_NAMES = ["About", "Projects", "Skills", "Contact"];
const COOKIE_IMAGE_PATH = (name) => `images/cookies/${name.toLowerCase()}.png`;
const PENGUIN_NORMAL_SRC = "images/penguin/normal.png";
const PENGUIN_WINK_SRC = "images/penguin/wink.png";

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("three-cube");
  const ctx = canvas.getContext("2d");

  const NAVBAR_HEIGHT = 20;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - NAVBAR_HEIGHT;

  let penguinImg = new Image();
  let cookies = [];
  let isWinking = false;

  let dragging = null;
  let offsetX = 0;
  let offsetY = 0;

  function getResponsiveValues() {
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const penguinWidth = canvasWidth * 0.2;
    const penguinHeight = penguinWidth * 0.85;
    const penguinX = canvasWidth * 0.25;
    const penguinY = canvasHeight - penguinHeight - 40;

    const cookieSize = canvasWidth * 0.1;
    const startX = canvasWidth - cookieSize - 50;
    const startY = canvasHeight * 0.55;
    const gapY = cookieSize + 20;

    return { penguinWidth, penguinHeight, penguinX, penguinY, cookieSize, startX, startY, gapY };
  }

  function loadPenguin(src) {
    penguinImg.src = src;
  }

  function createCookies() {
    const { cookieSize, startX, startY, gapY } = getResponsiveValues();
    COOKIE_NAMES.forEach((name, i) => {
      const img = new Image();
      img.src = COOKIE_IMAGE_PATH(name);
      const x = startX;
      const y = startY + i * gapY;
      cookies.push({
        name,
        img,
        x,
        y,
        width: cookieSize,
        height: cookieSize,
        originalX: x,
        originalY: y
      });
    });
  }

  function drawScene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const { penguinWidth, penguinHeight, penguinX, penguinY } = getResponsiveValues();
    ctx.drawImage(penguinImg, penguinX, penguinY, penguinWidth, penguinHeight);

    for (const cookie of cookies) {
      ctx.drawImage(cookie.img, cookie.x, cookie.y, cookie.width, cookie.height);
    }
  }

  function isInside(x, y, rect) {
    return (
      x >= rect.x &&
      x <= rect.x + rect.width &&
      y >= rect.y &&
      y <= rect.y + rect.height
    );
  }

  function isOverlapping(cookie, penguinRect) {
    return !(
      cookie.x + cookie.width < penguinRect.x ||
      cookie.x > penguinRect.x + penguinRect.width ||
      cookie.y + cookie.height < penguinRect.y ||
      cookie.y > penguinRect.y + penguinRect.height
    );
  }

  function winkAndScroll(sectionName) {
    if (isWinking) return;
    isWinking = true;

    loadPenguin(PENGUIN_WINK_SRC);
    drawScene();

    setTimeout(() => {
      loadPenguin(PENGUIN_NORMAL_SRC);
      drawScene();
      isWinking = false;

      const target = document.getElementById(sectionName.toLowerCase());
      if (target) target.scrollIntoView({ behavior: "smooth" });
    }, 1000);
  }

  canvas.addEventListener("mousedown", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    for (const cookie of cookies) {
      if (isInside(mouseX, mouseY, cookie)) {
        dragging = cookie;
        offsetX = mouseX - cookie.x;
        offsetY = mouseY - cookie.y;
        break;
      }
    }
  });

  canvas.addEventListener("mousemove", (e) => {
    if (dragging) {
      const rect = canvas.getBoundingClientRect();
      dragging.x = e.clientX - rect.left - offsetX;
      dragging.y = e.clientY - rect.top - offsetY;
      drawScene();
    }
  });

  canvas.addEventListener("mouseup", () => {
    if (dragging) {
      const { penguinWidth, penguinHeight, penguinX, penguinY } = getResponsiveValues();
      const penguinRect = { x: penguinX, y: penguinY, width: penguinWidth, height: penguinHeight };

      if (isOverlapping(dragging, penguinRect)) {
        winkAndScroll(dragging.name);
      }

      dragging.x = dragging.originalX;
      dragging.y = dragging.originalY;
      dragging = null;
      drawScene();
    }
  });

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - NAVBAR_HEIGHT;

    cookies.forEach((cookie, i) => {
      const { cookieSize, startX, startY, gapY } = getResponsiveValues();
      cookie.width = cookieSize;
      cookie.height = cookieSize;
      cookie.x = startX;
      cookie.y = startY + i * gapY;
      cookie.originalX = cookie.x;
      cookie.originalY = cookie.y;
    });

    drawScene();
  });

  function init() {
    loadPenguin(PENGUIN_NORMAL_SRC);
    createCookies();
    penguinImg.onload = drawScene;
  }

  init();
});
