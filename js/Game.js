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

  const penguinWidth = 370;
  const penguinHeight = 350;
  const penguinX = 320;
  const penguinY = canvas.height - penguinHeight - 40;

  let penguinImg = new Image();
  let cookies = [];
  let isWinking = false;

  let dragging = null;
  let offsetX = 0;
  let offsetY = 0;

  function loadPenguin(src) {
    penguinImg.src = src;
  }

  function createCookies() {
    const startX = canvas.width - 400;
    const startY = 122;
    const gapY = 50;

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
        width: 160,
        height: 160,
        originalX: x,
        originalY: y
      });
    });
  }

  function drawScene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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

  // Change to wink image and draw
  loadPenguin(PENGUIN_WINK_SRC);
  drawScene();

  // Hold the wink for 1 second before switching back to normal and scrolling
  setTimeout(() => {
    loadPenguin(PENGUIN_NORMAL_SRC);
    drawScene();
    isWinking = false;

    // Now scroll to section after wink is done
    const target = document.getElementById(sectionName.toLowerCase());
    if (target) target.scrollIntoView({ behavior: "smooth" });

  }, 1000); // Keep wink for 1000 ms (1 second)
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
      const penguinRect = {
        x: penguinX,
        y: penguinY,
        width: penguinWidth,
        height: penguinHeight,
      };

      if (isOverlapping(dragging, penguinRect)) {
        winkAndScroll(dragging.name);
      }

      // Reset cookie to original position after release
      dragging.x = dragging.originalX;
      dragging.y = dragging.originalY;

      dragging = null;
      drawScene();
    }
  });

  function init() {
    loadPenguin(PENGUIN_NORMAL_SRC);
    createCookies();
    penguinImg.onload = drawScene;
  }

  init();
});
