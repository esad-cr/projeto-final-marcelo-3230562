

// ------------------------------------------------------
// VARIÁVEIS GERAIS
// ------------------------------------------------------
let batteryLevel = 0.75;
let cyanColor;
let moonImg;

// Controle da lua
let moonX, moonY;
let moonSize = 80;
let moonActive = false;

// Controle da barra
let barDuration = 3600; // 1 hora em segundos
let barStartTime = 0;

// ------------------------------------------------------
// PRELOAD
// ------------------------------------------------------
function preload() {
  moonImg = loadImage("A_vector_graphic_features_a_white_crescent_moon_sy.png");
}

// ------------------------------------------------------
// SETUP
// ------------------------------------------------------
function setup() {
  var p5Canvas = createCanvas(450, 450);
  p5Canvas.parent("p5Canvas");
  rectMode(CENTER);
  textAlign(CENTER, CENTER);

  cyanColor = color(0, 255, 255);

  // Posição padrão da lua (embaixo à esquerda)
  moonX = width / 2;
  moonY = 350;
}

// ------------------------------------------------------
// DRAW
// ------------------------------------------------------
function draw() {
  background(255);

  // fundo preto
  noStroke();
  fill(0);
  rect(width / 2, height / 2, 430, 430, 50);

  // borda ciano
  noFill();
  stroke(cyanColor);
  strokeWeight(6);
  rect(width / 2, height / 2, 430, 430, 50);

  drawClock();
  drawDate();
  drawBatteryIcon(batteryLevel);
  drawGPSArrow();
  drawMoonIcon();

  if (moonActive) {
    drawCountdownBar();
  }
}

// ------------------------------------------------------
// RELÓGIO
// ------------------------------------------------------
function drawClock() {
  let h = hour();
  let m = minute();
  if (h < 10) h = "0" + h;
  if (m < 10) m = "0" + m;

  fill(255);
  noStroke();
  textSize(120);
  text(`${h}:${m}`, width / 2, height / 2 - 40);
}

// ------------------------------------------------------
// DATA
// ------------------------------------------------------
function drawDate() {
  let d = day();
  let mo = month();
  let y = year();

  if (d < 10) d = "0" + d;
  if (mo < 10) mo = "0" + mo;

  const weekDays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  let weekdayName = weekDays[new Date().getDay()];
  let dateText = `${weekdayName}, ${d}/${mo}/${y}`;

  fill(255);
  noStroke();
  textSize(22);
  text(dateText, width / 2, height / 2 + 40);
}

// ------------------------------------------------------
// BATERIA
// ------------------------------------------------------
function drawBatteryIcon(level) {
  push();
  let x = width - 85;
  let y = 43;

  stroke(255);
  strokeWeight(2);
  noFill();
  rectMode(CORNER);

  rect(x, y, 35, 18, 4);   
  rect(x + 35, y + 4, 4, 10, 2);

  // cor dinâmica
  let currentColor = level > 0.3 ? cyanColor : color(255, 0, 255);

  noStroke();
  fill(currentColor);
  rect(x + 1, y + 1, 33 * level, 16, 3);
  pop();
}

// ------------------------------------------------------
// LUA (CRESCENTE BRANCA)
// ------------------------------------------------------
function drawMoonIcon() {
  imageMode(CENTER);

  // Se a barra estiver ativa, a lua sobe para cima da barra
  if (moonActive) {
    moonX = width / 2;
    moonY = 340;
  } else {
    moonX = 325;
    moonY = 340;
  }

  image(moonImg, moonX, moonY, moonSize, moonSize);
}

// ------------------------------------------------------
// BARRA DE COUNTDOWN (1 hora)
// ------------------------------------------------------
function drawCountdownBar() {
  let elapsed = (millis() - barStartTime) / 1000;
  let progress = constrain(1 - elapsed / barDuration, 0, 1);

  let barWidth = 300;
  let barHeight = 15;
  let barX = width / 2;
  let barY = 390;

  // Cor muda quando faltar 30%
  let barColor = progress > 0.3 ? cyanColor : color(255, 0, 255);

  // fundo da barra
  noFill();
  stroke(255);
  strokeWeight(0);
  rect(barX, barY, barWidth, barHeight, 10);

  // parte preenchida
  noStroke();
  fill(barColor);
  rect(barX - barWidth/2 + (barWidth * progress)/2, barY, barWidth * progress, barHeight - 4, 8);

  // se acabar o tempo, desliga tudo
  if (progress === 0) {
    moonActive = false;
  }
}

// ------------------------------------------------------
// CLIQUE NA LUA → LIGA/DESLIGA
// ------------------------------------------------------
function mousePressed() {

  // distância do clique até o centro da lua
  let d = dist(mouseX, mouseY, moonX, moonY);

  if (d < moonSize / 2) {
    moonActive = !moonActive;

    if (moonActive) {
      barStartTime = millis();
    }
  }
}
// ------------------- SETA GPS -------------------
function drawGPSArrow() {
  push();

  // posição ajustada (mais baixa e centralizada)
  translate(width / 2, 68);

  // mais inclinada para a direita
  rotate(radians(20));

  stroke(255);
  strokeWeight(3);
  strokeJoin(ROUND);   // arredonda cantos
  strokeCap(ROUND);    // arredonda a ponta
  noFill();

  // ---- Contorno geral ----
  beginShape();
  vertex(0, -20);    // ponta superior arredondada pela stroke
  vertex(16, 16);    // lado direito
  vertex(0, 10);     // ponto obtuso na base
  vertex(-16, 16);   // lado esquerdo
  endShape(CLOSE);

  // ---- Metade branca ----
  fill(255);
  beginShape();
  vertex(0, -20);
  vertex(16, 16);
  vertex(0, 10);
  endShape(CLOSE);

  // ---- Metade preta ----
  fill(0);
  beginShape();
  vertex(0, -20);
  vertex(0, 10);
  vertex(-16, 16);
  endShape(CLOSE);

  pop();
}
