import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

/* ============================================================
   Galaxy Gift 3D — Birthday Universe
   Tương đồng tối đa với models/demo.png:
   - Thiên mã pha lê 3D phát quang nội tại (Cosmic Crystal Horse)
   - Bệ thiên thể đa tầng đính huy hiệu ngôi sao 8 cánh vàng rực rỡ nổi bật ở mặt trước
   - Mặt sàn gương vũ trụ với các vòng tròn ma thuật đồng tâm (Concentric Light Ripples)
   - Dải ánh sáng quỹ đạo 3D (Glowing Orbital Trails / Ribbons) uốn lượn quanh ngựa
   - 8 ảnh kỷ niệm luôn nổi trên không trung (không bị chìm nền), khung neon + đính sao vàng (✦)
   - Các trái tim lơ lửng tạo hình bằng chùm hạt màu tím phát sáng (Purple Particle Hearts)
   - Cơn lốc xoáy Galaxy nhỏ ở phía xa (Top-Right) rực rỡ, nổi bật với hàng nghìn hạt tím & tâm sáng
   - Dải thiên hà lớn nằm phẳng bên dưới phần nền của model làm bệ đỡ vũ trụ
   - Sao băng (Shooting Stars) vụt ngang bầu trời & cánh hoa hồng/bụi sao bay lơ lửng
   - Tương tác kéo xoay 360°, click ảnh mở modal, tối ưu mượt mà cho mọi thiết bị
   ============================================================ */

const WISHES_DATA = [
  {
    img: "gift/2aoborb8xaa3er9je3ezx7eaespdfesdxoqfzavi3.jpg",
    title: "Lắng nghe ✨",
    text: "Cảm ơn vì lúc nào cũng lắng nghe những câu chuyện và cho tui lời khuyên",
    crop: { x: 0.5, y: 0.16 },
  },
  {
    img: "gift/2aoborb8xamcwoluxl78y8ddmwkoxh7vyqjrvb2e2.jpg",
    title: "Nụ cười",
    text: "Nụ cười có thể làm xua tan cả ngày mưa buồn. Hãy luôn cười như vậy nhé.",
    crop: { x: 0.52, y: 0.32 },
  },
  {
    img: "gift/2aoborb8xb4qpqjjm3mxbi8tzdhmrhvfecorjquu4.jpg",
    title: "Ngày nắng đẹp ☀️",
    text: "Mong rằng chị sẽ có thật nhiều ngày vui vẻ, được đi đến những nơi mình thích, gặp được những người trân trọng mình!",
    crop: { x: 0.5, y: 0.52 },
  },
  {
    img: "gift/2aoborb8xbcukbcmgismkhtxbijx4gboa7w9sooa6.jpg",
    title: "Hoa hồng 🌹",
    text: "Chúc chị tuổi mới luôn xinh đẹp và lộng lẫy.",
    crop: { x: 0.48, y: 0.18 },
  },
  {
    img: "gift/2aoborb8xbnsduzatlhc1bt7qs24b5ddmxys8fik5.jpg",
    title: "Ước mơ tỏa sáng 🌟",
    text: "Hãy luôn tự tin bước theo con đường mình chọn, vì chị xứng đáng với tất cả những điều tốt đẹp.",
    crop: { x: 0.66, y: 0.28 },
  },
  {
    img: "gift/2aoborb8xbqibp3nro7bsvd8kqe51ht7pr0zjpma7.jpg",
    title: "Điểm tựa tinh thần 💪 ",
    text: "Hãy tiến về phía trước, nếu có vấp ngã thì hãy luôn nhớ mình còn có gia đình, bạn bè và cả anh K nữa",
    crop: { x: 0.5, y: 0.18 },
  },
  {
    img: "gift/2aoborb8xc5efps46dwhndki1covkpef0pyxggtq8.jpg",
    title: "Bầu trời 🌌",
    text: "Hãy là ngôi sao tỏa sáng nhất bầu trời của riêng mình, những người yêu quý mình.",
    crop: { x: 0.5, y: 0.48 },
  },
  {
    img: "gift/2aoborb8xcdoejiunpk1nkzeugeionvas2ahai809.jpg",
    title: "Năng lượng tích cực 🌈",
    text: "Mỗi năm trôi qua, lại có thêm những trải nghiệm và câu chuyện của riêng mình. Mong chị luôn sống theo cách chị muốn, không vội vàng, không áp lực và luôn tự hào về chính mình.",
    crop: { x: 0.32, y: 0.36 },
  },
];

function makeResponsiveCfg() {
  const w = window.innerWidth;
  if (w < 500) {
    return {
      galaxyCount: 22000,
      vortexCount: 3200,
      floatingHearts: 50,
      petalsCount: 24,
      photoScale: 0.9,
      orbitScale: 0.84,
      galaxySize: 0.038, // Hạt galaxy nền dưới bệ vừa vặn, không che model
      vortexSize: 0.16, // Hạt galaxy nhỏ ở xa to rõ, nổi bật
      floatingSize: 0.18,
      bloomStrength: 0.35,
      maxDPR: 1.5,
    };
  }
  if (w < 900) {
    return {
      galaxyCount: 32000,
      vortexCount: 4200,
      floatingHearts: 80,
      petalsCount: 32,
      photoScale: 1.0,
      orbitScale: 0.94,
      galaxySize: 0.042,
      vortexSize: 0.18,
      floatingSize: 0.2,
      bloomStrength: 0.37,
      maxDPR: 1.75,
    };
  }
  return {
    galaxyCount: 42000,
    vortexCount: 5400,
    floatingHearts: 110,
    petalsCount: 42,
    photoScale: 1.1,
    orbitScale: 1.0,
    galaxySize: 0.046,
    vortexSize: 0.2,
    floatingSize: 0.22,
    bloomStrength: 0.38,
    maxDPR: 2.0,
  };
}

/* ---------- Texture Generators ---------- */

function createGlowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255, 255, 255, 1)");
  g.addColorStop(0.2, "rgba(255, 235, 255, 0.95)");
  g.addColorStop(0.5, "rgba(225, 110, 255, 0.45)");
  g.addColorStop(0.8, "rgba(160, 40, 255, 0.15)");
  g.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function createHeartTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ff3d94";
  ctx.shadowColor = "#ff7bc8";
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.moveTo(32, 22);
  ctx.bezierCurveTo(32, 14, 22, 6, 12, 6);
  ctx.bezierCurveTo(0, 6, 0, 22, 0, 22);
  ctx.bezierCurveTo(0, 36, 18, 50, 32, 60);
  ctx.bezierCurveTo(46, 50, 64, 36, 64, 22);
  ctx.bezierCurveTo(64, 22, 64, 6, 52, 6);
  ctx.bezierCurveTo(42, 6, 32, 14, 32, 22);
  ctx.fill();
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function createPetalTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  const g = ctx.createRadialGradient(28, 28, 4, 32, 32, 30);
  g.addColorStop(0, "rgba(255, 190, 230, 0.95)");
  g.addColorStop(0.6, "rgba(255, 105, 180, 0.75)");
  g.addColorStop(1, "rgba(220, 50, 160, 0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(32, 32, 24, 14, Math.PI / 4, 0, Math.PI * 2);
  ctx.fill();
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function createCloudTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  const g = ctx.createRadialGradient(128, 128, 20, 128, 128, 128);
  g.addColorStop(0, "rgba(180, 70, 230, 0.45)");
  g.addColorStop(0.45, "rgba(130, 40, 190, 0.25)");
  g.addColorStop(0.8, "rgba(60, 15, 110, 0.08)");
  g.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function drawOrnamentStar(ctx, cx, cy, outerR, innerR) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.shadowColor = "#ffe682";
  ctx.shadowBlur = 14;

  const grad = ctx.createRadialGradient(0, 0, 2, 0, 0, outerR);
  grad.addColorStop(0, "#ffffff");
  grad.addColorStop(0.35, "#fff2b3");
  grad.addColorStop(1, "#ffc947");
  ctx.fillStyle = grad;

  ctx.beginPath();
  for (let i = 0; i < 16; i++) {
    const angle = (i * Math.PI) / 8;
    const r =
      i % 2 === 0 ? (i % 4 === 0 ? outerR : outerR * 0.52) : innerR * 0.45;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();

  // Diamond bright core
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(0, 0, innerR * 0.35, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/* Biểu tượng ngôi sao 8 cánh hoàng gia siêu nét, nổi khối 3D rực rỡ cho bệ đỡ (512x512) */
function createStarEmblemTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  const cx = 256;
  const cy = 256;

  // 1. Vòng hào quang vàng rực rỡ ngoài cùng
  const outerHalo = ctx.createRadialGradient(cx, cy, 180, cx, cy, 254);
  outerHalo.addColorStop(0, "rgba(255, 215, 90, 0.65)");
  outerHalo.addColorStop(0.5, "rgba(255, 160, 40, 0.25)");
  outerHalo.addColorStop(1, "rgba(255, 120, 20, 0)");
  ctx.fillStyle = outerHalo;
  ctx.beginPath();
  ctx.arc(cx, cy, 254, 0, Math.PI * 2);
  ctx.fill();

  // 2. Nền đĩa kim loại đặc (Solid Medallion Disc) - giúp ngôi sao nổi bật 100%, không bị chìm
  const discGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 226);
  discGrad.addColorStop(0, "#3d0e59");
  discGrad.addColorStop(0.65, "#1e052e");
  discGrad.addColorStop(0.92, "#12021c");
  discGrad.addColorStop(1, "#ffe285");
  ctx.fillStyle = discGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 224, 0, Math.PI * 2);
  ctx.fill();

  // 3. Vành vàng hoàng gia dày nổi bật (Outer Gold Beveled Ring)
  ctx.lineWidth = 12;
  const ringGrad = ctx.createLinearGradient(
    cx - 220,
    cy - 220,
    cx + 220,
    cy + 220,
  );
  ringGrad.addColorStop(0, "#ffffff");
  ringGrad.addColorStop(0.25, "#ffe694");
  ringGrad.addColorStop(0.5, "#d48818");
  ringGrad.addColorStop(0.75, "#fff0b0");
  ringGrad.addColorStop(1, "#8a4805");
  ctx.strokeStyle = ringGrad;
  ctx.shadowColor = "#ffbf38";
  ctx.shadowBlur = 18;
  ctx.beginPath();
  ctx.arc(cx, cy, 218, 0, Math.PI * 2);
  ctx.stroke();

  // 4. Vòng chỉ thiên văn thanh mảnh bên trong (Inner Accent Ring)
  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(255, 230, 140, 0.9)";
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.arc(cx, cy, 198, 0, Math.PI * 2);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // 5. 16 Chấm ngọc thiên văn trên vành huy hiệu
  for (let i = 0; i < 16; i++) {
    const a = (i * Math.PI) / 8;
    const dotX = cx + Math.cos(a) * 208;
    const dotY = cy + Math.sin(a) * 208;
    ctx.fillStyle = i % 2 === 0 ? "#ffffff" : "#ffd76a";
    ctx.beginPath();
    ctx.arc(dotX, dotY, i % 4 === 0 ? 4.5 : 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // 6. Ngôi sao 8 cánh 3D NỔI KHỐI ĐẶC SẮC (Faceted 3D Beveled Star)
  const outerR = 186; // Bán kính 4 cánh chính (Bắc - Nam - Đông - Tây)
  const diagR = 138; // Bán kính 4 cánh chéo
  const innerR = 56; // Bán kính đáy giao giữa các cánh

  for (let k = 0; k < 8; k++) {
    const tipAngle = (k * Math.PI) / 4 - Math.PI / 2;
    const leftValleyAngle = tipAngle - Math.PI / 8;
    const rightValleyAngle = tipAngle + Math.PI / 8;

    const rTip = k % 2 === 0 ? outerR : diagR;
    const tipX = cx + Math.cos(tipAngle) * rTip;
    const tipY = cy + Math.sin(tipAngle) * rTip;

    const leftX = cx + Math.cos(leftValleyAngle) * innerR;
    const leftY = cy + Math.sin(leftValleyAngle) * innerR;

    const rightX = cx + Math.cos(rightValleyAngle) * innerR;
    const rightY = cy + Math.sin(rightValleyAngle) * innerR;

    const isLightHalf = Math.cos(tipAngle - Math.PI * 0.75) > 0;
    const lightGrad = ctx.createLinearGradient(cx, cy, tipX, tipY);
    lightGrad.addColorStop(0, "#ffffff");
    lightGrad.addColorStop(0.35, "#fff3b8");
    lightGrad.addColorStop(1, "#ffc947");

    const darkGrad = ctx.createLinearGradient(cx, cy, tipX, tipY);
    darkGrad.addColorStop(0, "#ffd970");
    darkGrad.addColorStop(0.5, "#d98212");
    darkGrad.addColorStop(1, "#8c4402");

    // Nửa trái
    ctx.fillStyle = isLightHalf ? lightGrad : darkGrad;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(tipX, tipY);
    ctx.lineTo(leftX, leftY);
    ctx.closePath();
    ctx.fill();

    // Nửa phải
    ctx.fillStyle = isLightHalf ? darkGrad : lightGrad;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(tipX, tipY);
    ctx.lineTo(rightX, rightY);
    ctx.closePath();
    ctx.fill();
  }

  // 7. Tâm kim cương phát sáng rực rỡ ở chính giữa ngôi sao
  ctx.save();
  ctx.shadowColor = "#ffffff";
  ctx.shadowBlur = 20;
  const coreGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 32);
  coreGrad.addColorStop(0, "#ffffff");
  coreGrad.addColorStop(0.3, "#fff8db");
  coreGrad.addColorStop(0.7, "#ffc842");
  coreGrad.addColorStop(1, "rgba(255, 180, 40, 0)");
  ctx.fillStyle = coreGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 32, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Điểm ngọc kim cương 8 cạnh ở tâm
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    const r = i % 2 === 0 ? 18 : 10;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();

  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function createFloorRippleTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");

  // Central bright pool of light
  const centerGrad = ctx.createRadialGradient(512, 512, 0, 512, 512, 490);
  centerGrad.addColorStop(0, "rgba(235, 90, 255, 0.85)");
  centerGrad.addColorStop(0.2, "rgba(180, 50, 240, 0.45)");
  centerGrad.addColorStop(0.5, "rgba(90, 20, 160, 0.18)");
  centerGrad.addColorStop(0.85, "rgba(40, 5, 80, 0.05)");
  centerGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = centerGrad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Concentric magical rings
  const rings = [
    { r: 120, w: 4, col: "rgba(255, 225, 140, 0.85)" },
    { r: 180, w: 2.5, col: "rgba(255, 100, 210, 0.75)" },
    { r: 250, w: 5, col: "rgba(255, 230, 150, 0.9)" },
    { r: 320, w: 2, col: "rgba(220, 90, 255, 0.6)" },
    { r: 380, w: 4, col: "rgba(255, 120, 220, 0.8)" },
    { r: 440, w: 2.5, col: "rgba(255, 220, 130, 0.75)" },
    { r: 480, w: 1.5, col: "rgba(190, 80, 255, 0.5)" },
  ];

  ctx.shadowColor = "#ff70df";
  ctx.shadowBlur = 12;

  rings.forEach((ring) => {
    ctx.strokeStyle = ring.col;
    ctx.lineWidth = ring.w;
    ctx.beginPath();
    ctx.arc(512, 512, ring.r, 0, Math.PI * 2);
    ctx.stroke();
  });

  // Astrological ticks around outer ring
  ctx.strokeStyle = "rgba(255, 230, 160, 0.75)";
  ctx.lineWidth = 2;
  const tickCount = 48;
  for (let i = 0; i < tickCount; i++) {
    const a = (i / tickCount) * Math.PI * 2;
    const isMajor = i % 4 === 0;
    const len = isMajor ? 18 : 10;
    const x1 = 512 + Math.cos(a) * (380 - len / 2);
    const y1 = 512 + Math.sin(a) * (380 - len / 2);
    const x2 = 512 + Math.cos(a) * (380 + len / 2);
    const y2 = 512 + Math.sin(a) * (380 + len / 2);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  // Radial light rays emanating from center
  const rayCount = 16;
  ctx.strokeStyle = "rgba(255, 130, 230, 0.15)";
  ctx.lineWidth = 1.5;
  for (let i = 0; i < rayCount; i++) {
    const a = (i / rayCount) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(512 + Math.cos(a) * 120, 512 + Math.sin(a) * 120);
    ctx.lineTo(512 + Math.cos(a) * 480, 512 + Math.sin(a) * 480);
    ctx.stroke();
  }

  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* ---------- Photo Frame Texture Generator ---------- */

function createPhotoCircleTexture(itemOrPath, onReady, onError) {
  const imgPath = typeof itemOrPath === "string" ? itemOrPath : itemOrPath.img;
  const crop =
    typeof itemOrPath === "object" && itemOrPath.crop
      ? itemOrPath.crop
      : { x: 0.5, y: 0.35 };

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  const img = new Image();

  img.onload = () => {
    ctx.clearRect(0, 0, 512, 512);

    // Cắt ảnh vuông theo tỷ lệ, căn chỉnh tâm điểm gương mặt theo crop
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const size = Math.min(iw, ih);
    let sx = 0;
    let sy = 0;
    if (iw > ih) {
      const maxSx = iw - size;
      sx = Math.max(0, Math.min(maxSx, iw * crop.x - size * 0.5));
      sy = 0;
    } else {
      const maxSy = ih - size;
      sy = Math.max(0, Math.min(maxSy, ih * crop.y - size * 0.42));
      sx = 0;
    }

    // Outer Neon Glow Halo
    const haloGrad = ctx.createRadialGradient(256, 256, 224, 256, 256, 256);
    haloGrad.addColorStop(0, "rgba(255, 45, 160, 0.95)");
    haloGrad.addColorStop(0.45, "rgba(255, 60, 190, 0.45)");
    haloGrad.addColorStop(1, "rgba(180, 40, 255, 0)");
    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.arc(256, 256, 254, 0, Math.PI * 2);
    ctx.fill();

    // Clip circular photo area
    ctx.save();
    ctx.beginPath();
    ctx.arc(256, 256, 228, 0, Math.PI * 2);
    ctx.clip();

    // Vẽ ảnh đúng khuôn mặt - 100% rõ nét, không bị chói sáng hay phủ màng mờ
    ctx.drawImage(img, sx, sy, size, size, 28, 28, 456, 456);
    ctx.restore();

    // Neon Frame Ring (Viền neon hồng magenta sắc nét, gọn gàng, không bị nhòe chói vào ảnh)
    ctx.beginPath();
    ctx.arc(256, 256, 234, 0, Math.PI * 2);
    ctx.lineWidth = 9;
    ctx.strokeStyle = "#ff2e9e";
    ctx.shadowColor = "#ff38b8";
    ctx.shadowBlur = 8;
    ctx.stroke();

    // Inner Gold Accent Ring (Viền vàng ánh kim thanh mảnh)
    ctx.beginPath();
    ctx.arc(256, 256, 227, 0, Math.PI * 2);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#ffe28a";
    ctx.shadowColor = "#ffb03a";
    ctx.shadowBlur = 4;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Golden Sparkle Star Ornament (✦) đính trên viền khung (giống hệt demo.png)
    const starAngle = -Math.PI * 0.25;
    const starX = 256 + Math.cos(starAngle) * 232;
    const starY = 256 + Math.sin(starAngle) * 232;
    drawOrnamentStar(ctx, starX, starY, 24, 10);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    onReady && onReady(tex);
  };

  img.onerror = (e) => {
    ctx.clearRect(0, 0, 512, 512);
    ctx.fillStyle = "#2a0a38";
    ctx.fillRect(0, 0, 512, 512);
    ctx.fillStyle = "#ff9bc8";
    ctx.font = "bold 52px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("💗", 256, 256);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    onError && onError(tex, e);
  };

  img.src = imgPath;
}

/* ---------- Purple Particle Heart Geometry Generator ---------- */

function createPurpleParticleHeartGeometry(count = 220, scale = 1.0) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const color = new THREE.Color();

  for (let i = 0; i < count; i++) {
    const isOutline = i < count * 0.55;
    const t = Math.random() * Math.PI * 2;
    const sint = Math.sin(t);
    const cost = Math.cos(t);

    const hx = Math.pow(sint, 3);
    const hy =
      (13 * cost -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t)) /
      16;

    const r = isOutline
      ? 0.94 + Math.random() * 0.12
      : Math.sqrt(Math.random()) * 0.9;
    const x = hx * r * scale;
    const y = hy * r * scale;

    const maxZ = Math.max(0, 1 - r * 0.8) * 0.38 * scale;
    const z = (Math.random() - 0.5) * 2 * maxZ;

    pos[i * 3 + 0] = x;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = z;

    const tint = Math.random();
    if (tint < 0.25) {
      color.setRGB(1.0, 0.82, 1.0);
    } else if (tint < 0.6) {
      color.setRGB(0.88, 0.28, 1.0);
    } else if (tint < 0.85) {
      color.setRGB(0.68, 0.14, 0.96);
    } else {
      color.setRGB(1.0, 0.42, 0.88);
    }

    const brightness = 0.65 + Math.random() * 0.35;
    col[i * 3 + 0] = color.r * brightness;
    col[i * 3 + 1] = color.g * brightness;
    col[i * 3 + 2] = color.b * brightness;
  }

  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  return geo;
}

/* ---------- Photo Orbit Positioning (Đã nâng toàn bộ ảnh lên cao, không bị chìm nền) ---------- */

function makePhotoOrbitConfig(total, orbitScale) {
  // Toàn bộ 8 ảnh được nâng lên cao an toàn (baseY từ -0.2 đến 2.2), lơ lửng trên không trung
  const preset = [
    // 4 ảnh bên trái
    { r: 4.6 * orbitScale, angle: 2.2, y: 2.2, tilt: 0.08, speedMul: 0.8 },
    { r: 5.4 * orbitScale, angle: 2.8, y: 1.35, tilt: -0.06, speedMul: 0.72 },
    { r: 6.0 * orbitScale, angle: 3.4, y: 0.55, tilt: 0.08, speedMul: 0.68 },
    { r: 4.8 * orbitScale, angle: 4.0, y: -0.15, tilt: -0.05, speedMul: 0.82 },
    // 4 ảnh bên phải
    { r: 4.5 * orbitScale, angle: 0.9, y: 2.1, tilt: -0.08, speedMul: 0.85 },
    { r: 5.3 * orbitScale, angle: 0.3, y: 1.25, tilt: 0.06, speedMul: 0.75 },
    { r: 5.9 * orbitScale, angle: -0.3, y: 0.5, tilt: -0.08, speedMul: 0.7 },
    { r: 4.7 * orbitScale, angle: -0.9, y: -0.2, tilt: 0.05, speedMul: 0.84 },
  ];

  return preset.slice(0, total).map((p, idx) => ({
    idx,
    angle: p.angle,
    radius: p.r,
    baseY: p.y,
    tilt: p.tilt,
    speedMul: p.speedMul,
    photoMul: 1.0,
    floatPhase: (idx * Math.PI) / 4,
    floatAmp: 0.1,
    floatSpeed: 0.8 + (idx % 3) * 0.2,
  }));
}

/* ============================================================
   Mount 3D Gift Universe
   ============================================================ */

export function mountGift3D(canvas) {
  const cfg = makeResponsiveCfg();
  const totalPhotos = Math.min(WISHES_DATA.length, 8);

  /* ---------- DOM Bindings ---------- */
  const $ = (id) => document.getElementById(id);
  const landingEl = $("galaxyLanding");
  const enterBtn = $("galaxyEnterBtn");
  const wishModal = $("galaxyWishModal");
  const wishImg = $("galaxyWishImg");
  const wishTitle = $("galaxyWishTitle");
  const wishText = $("galaxyWishText");
  const wishClose = $("galaxyWishClose");
  const wishOk = $("galaxyWishOk");
  const hintEl = $("giftHint");

  let landed = false;
  let broken = false;
  let running = true;
  let rafId = 0;

  /* ---------- Renderer / Scene / Camera ---------- */
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x070114, 0.032);
  scene.background = new THREE.Color(0x070114);

  const camera = new THREE.PerspectiveCamera(
    56,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    500,
  );
  camera.position.set(0, 1.2, 7.8);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, cfg.maxDPR));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.94;

  /* ---------- Controls ---------- */
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.enablePan = false;
  controls.minDistance = 3.6;
  controls.maxDistance = 14;
  controls.maxPolarAngle = Math.PI * 0.82;
  controls.minPolarAngle = Math.PI * 0.18;
  controls.target.set(0, 0.2, 0);
  controls.update();

  /* ---------- Post-processing (UnrealBloom — Ngưỡng threshold 0.82 để ảnh 100% rõ nét, hoàn toàn không bị chói lóa) ---------- */
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(canvas.clientWidth, canvas.clientHeight),
    cfg.bloomStrength,
    0.35,
    0.82,
  );
  composer.addPass(bloomPass);
  composer.addPass(new OutputPass());

  /* ---------- Lights ---------- */
  const ambient = new THREE.AmbientLight(0xfff0ff, 0.6);
  scene.add(ambient);

  const pinkLight = new THREE.PointLight(0xff3fa8, 1.8, 18, 2);
  pinkLight.position.set(0.8, 1.2, 2.6);
  scene.add(pinkLight);

  const purpleLight = new THREE.PointLight(0xa538f5, 1.5, 22, 2);
  purpleLight.position.set(-2.2, -0.4, -2.5);
  scene.add(purpleLight);

  const blueLight = new THREE.PointLight(0x738aff, 0.7, 26, 2);
  blueLight.position.set(2.8, -1.2, -1.2);
  scene.add(blueLight);

  /* ---------- Shared Textures ---------- */
  const glowTex = createGlowTexture();
  const heartSmallTex = createHeartTexture();
  const petalTex = createPetalTexture();
  const cloudTex = createCloudTexture();
  const starEmblemTex = createStarEmblemTexture();
  const floorRippleTex = createFloorRippleTexture();

  /* ---------- Main Rotating Group ---------- */
  const mainGroup = new THREE.Group();
  scene.add(mainGroup);

  /* ---------- Far Nebula Sphere ---------- */
  const nebulaCanvas = document.createElement("canvas");
  nebulaCanvas.width = 512;
  nebulaCanvas.height = 512;
  (function paintNebula() {
    const ctx = nebulaCanvas.getContext("2d");
    const g = ctx.createRadialGradient(256, 256, 20, 256, 256, 320);
    g.addColorStop(0, "rgba(255, 95, 180, 0.42)");
    g.addColorStop(0.35, "rgba(145, 50, 220, 0.38)");
    g.addColorStop(0.7, "rgba(25, 4, 60, 0.88)");
    g.addColorStop(1, "rgba(0, 0, 0, 1)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const rr = Math.random() * 1.8 + 0.3;
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.75 + 0.25})`;
      ctx.beginPath();
      ctx.arc(x, y, rr, 0, Math.PI * 2);
      ctx.fill();
    }
  })();
  const nebulaTex = new THREE.CanvasTexture(nebulaCanvas);
  nebulaTex.colorSpace = THREE.SRGBColorSpace;
  const farNebula = new THREE.Mesh(
    new THREE.SphereGeometry(95, 32, 32),
    new THREE.MeshBasicMaterial({
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.65,
      map: nebulaTex,
      depthWrite: false,
    }),
  );
  scene.add(farNebula);

  /* ---------- GALAXY NHỎ Ở PHÍA XA (Top-Right) — RỰC RỠ, NỔI BẬT & BẮT MẮT NHƯ DEMO.PNG ---------- */
  const vortexGroup = new THREE.Group();
  // Đặt ở góc trên bên phải bầu trời phía xa, hướng thẳng vào camera
  vortexGroup.position.set(12.5, 7.8, -13.5);
  vortexGroup.rotation.set(0.42, -0.52, 0.15);
  scene.add(vortexGroup);

  // Đèn rọi tím vũ trụ tạo vầng hào quang rực sáng xung quanh galaxy nhỏ ở xa
  const vortexLight = new THREE.PointLight(0xd642ff, 2.6, 16, 2);
  vortexLight.position.set(12.5, 7.8, -12.5);
  scene.add(vortexLight);

  // Lõi thiên hà sáng trắng tím phát quang (Core Flare)
  const coreFlareMat = new THREE.SpriteMaterial({
    map: glowTex,
    color: 0xffe6ff,
    transparent: true,
    blending: THREE.AdditiveBlending,
    opacity: 0.95,
    depthWrite: false,
  });
  const coreFlare = new THREE.Sprite(coreFlareMat);
  coreFlare.scale.set(4.2, 4.2, 1);
  vortexGroup.add(coreFlare);

  // Cơn lốc xoáy gồm hàng nghìn hạt sao tím cuộn tròn nhiều tầng
  const vCount = cfg.vortexCount;
  const vGeo = new THREE.BufferGeometry();
  const vPos = new Float32Array(vCount * 3);
  const vCol = new Float32Array(vCount * 3);
  const vTmpCol = new THREE.Color();

  for (let i = 0; i < vCount; i++) {
    const isCore = i < vCount * 0.25;
    let r, a, z;

    if (isCore) {
      // Vùng tâm dày đặc hạt sáng rực
      r = Math.pow(Math.random(), 2.0) * 2.2;
      a = Math.random() * Math.PI * 2;
      z = (Math.random() - 0.5) * (0.8 - r * 0.2);
    } else {
      // 3 cánh tay xoắn ốc uốn lượn sắc sảo
      const arm = i % 3;
      r = 1.0 + Math.pow(Math.random(), 1.5) * 8.2;
      const spiralAngle = arm * ((Math.PI * 2) / 3) + Math.pow(r, 0.65) * 2.4;
      const spread = (Math.random() - 0.5) * (0.3 + r * 0.08);
      a = spiralAngle + spread;
      z = (Math.random() - 0.5) * (0.4 + r * 0.06);
    }

    vPos[i * 3 + 0] = Math.cos(a) * r;
    vPos[i * 3 + 1] = Math.sin(a) * r;
    vPos[i * 3 + 2] = z;

    const normR = r / 9.2;
    if (normR < 0.16) {
      vTmpCol.setRGB(1.0, 0.95, 1.0); // Tâm sáng trắng tinh khiết
    } else if (normR < 0.42) {
      vTmpCol.setRGB(0.98, 0.42, 1.0); // Tím neon sáng rực
    } else if (normR < 0.72) {
      vTmpCol.setRGB(0.82, 0.22, 0.98); // Tím thạch anh đậm đà
    } else {
      vTmpCol.setRGB(0.58, 0.1, 0.9); // Tím vũ trụ huyền ảo ở đầu cánh
    }

    const brightness = 0.85 + Math.random() * 0.45;
    vCol[i * 3 + 0] = vTmpCol.r * brightness;
    vCol[i * 3 + 1] = vTmpCol.g * brightness;
    vCol[i * 3 + 2] = vTmpCol.b * brightness;
  }

  vGeo.setAttribute("position", new THREE.BufferAttribute(vPos, 3));
  vGeo.setAttribute("color", new THREE.BufferAttribute(vCol, 3));

  const vMat = new THREE.PointsMaterial({
    size: cfg.vortexSize,
    map: glowTex,
    vertexColors: true,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });

  const vPoints = new THREE.Points(vGeo, vMat);
  vortexGroup.add(vPoints);

  /* ---------- GALAXY TO Ở GẦN (NẰM DƯỚI PHẦN NỀN / BỆ CỦA MODEL — KHÔNG CHE MODEL) ---------- */
  const galaxyParams = {
    count: cfg.galaxyCount,
    radius: 12.5,
    branches: 4,
    spin: 1.25,
  };
  const galaxyGeo = new THREE.BufferGeometry();
  const galaxyPos = new Float32Array(galaxyParams.count * 3);
  const galaxyCol = new Float32Array(galaxyParams.count * 3);
  const tmpColor = new THREE.Color();

  for (let i = 0; i < galaxyParams.count; i++) {
    const r = Math.pow(Math.random(), 2.1) * galaxyParams.radius;
    const spin = r * galaxyParams.spin;
    const branchAngle =
      ((i % galaxyParams.branches) / galaxyParams.branches) * Math.PI * 2;
    const spread = (Math.random() - 0.5) * (0.28 + r * 0.07);
    const vertical = (Math.random() - 0.5) * 0.08; // Độ dày mỏng phẳng nằm song song dưới nền

    galaxyPos[i * 3 + 0] =
      Math.cos(branchAngle + spin) * r + spread * Math.cos(branchAngle + spin);
    galaxyPos[i * 3 + 1] = vertical;
    galaxyPos[i * 3 + 2] =
      Math.sin(branchAngle + spin) * r + spread * Math.sin(branchAngle + spin);

    const tint = Math.random();
    if (tint < 0.35) {
      tmpColor.setRGB(0.95, 0.45, 0.88);
    } else if (tint < 0.7) {
      tmpColor.setRGB(0.78, 0.38, 1.0);
    } else if (tint < 0.88) {
      tmpColor.setRGB(0.88, 0.75, 1.0);
    } else {
      tmpColor.setRGB(1.0, 1.0, 1.0);
    }

    const s = 0.75 + Math.random() * 0.35;
    galaxyCol[i * 3 + 0] = tmpColor.r * s;
    galaxyCol[i * 3 + 1] = tmpColor.g * s;
    galaxyCol[i * 3 + 2] = tmpColor.b * s;
  }

  galaxyGeo.setAttribute("position", new THREE.BufferAttribute(galaxyPos, 3));
  galaxyGeo.setAttribute("color", new THREE.BufferAttribute(galaxyCol, 3));

  const galaxyMat = new THREE.PointsMaterial({
    size: cfg.galaxySize,
    map: glowTex,
    vertexColors: true,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });

  const galaxyPoints = new THREE.Points(galaxyGeo, galaxyMat);
  // Đặt dải ngân hà to nằm phẳng song song, nằm phía dưới nền của model một xíu (y = -1.36)
  galaxyPoints.position.set(0, -1.36, 0);
  galaxyPoints.rotation.set(0, 0, 0); // Tọa độ hạt vốn dĩ đã ở mặt phẳng ngang XZ, để góc quay 0 thì song song hoàn toàn với mặt sàn
  mainGroup.add(galaxyPoints);

  /* ---------- Glossy Cosmic Floor with Concentric Magic Rings ---------- */
  const floorGroup = new THREE.Group();
  floorGroup.position.y = -1.22;
  scene.add(floorGroup);

  // Dark reflective base disc
  const floorBaseMesh = new THREE.Mesh(
    new THREE.CircleGeometry(10, 64),
    new THREE.MeshStandardMaterial({
      color: 0x060112,
      roughness: 0.12,
      metalness: 0.85,
    }),
  );
  floorBaseMesh.rotation.x = -Math.PI / 2;
  floorBaseMesh.position.y = -0.02;
  floorGroup.add(floorBaseMesh);

  // Concentric magic ripple light rings plane
  const floorRipplesMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(18, 18),
    new THREE.MeshBasicMaterial({
      map: floorRippleTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.92,
    }),
  );
  floorRipplesMesh.rotation.x = -Math.PI / 2;
  floorGroup.add(floorRipplesMesh);

  /* ---------- Cosmic Horse & Pedestal Group ---------- */
  const horseGroup = new THREE.Group();
  horseGroup.position.set(0, -0.28, 0);
  mainGroup.add(horseGroup);

  // Vật liệu cho bệ
  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xffdf8e,
    metalness: 0.88,
    roughness: 0.18,
    emissive: 0xba6822,
    emissiveIntensity: 0.32,
  });
  const pinkCrystalMat = new THREE.MeshPhysicalMaterial({
    color: 0xffa4e0,
    metalness: 0.28,
    roughness: 0.14,
    transmission: 0.22,
    clearcoat: 1,
    emissive: 0xc22896,
    emissiveIntensity: 0.42,
  });
  const darkBaseMat = new THREE.MeshStandardMaterial({
    color: 0x220838,
    metalness: 0.85,
    roughness: 0.22,
    emissive: 0x440f66,
    emissiveIntensity: 0.25,
  });

  // Bệ thiên thể nhiều tầng
  const platform = new THREE.Group();
  platform.position.y = -1.12;
  horseGroup.add(platform);

  function addPlatformCylinder(geo, mat, pos, scale = [1, 1, 1]) {
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(...pos);
    mesh.scale.set(...scale);
    platform.add(mesh);
    return mesh;
  }

  addPlatformCylinder(
    new THREE.CylinderGeometry(1.48, 1.65, 0.18, 64),
    darkBaseMat,
    [0, 0, 0],
  );
  addPlatformCylinder(
    new THREE.CylinderGeometry(1.18, 1.34, 0.12, 64),
    goldMat,
    [0, 0.13, 0],
  );
  addPlatformCylinder(
    new THREE.CylinderGeometry(0.96, 1.08, 0.1, 64),
    pinkCrystalMat,
    [0, 0.23, 0],
  );

  const platformRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.52, 0.028, 8, 96),
    goldMat,
  );
  platformRing.rotation.x = Math.PI / 2;
  platformRing.position.y = 0.1;
  platform.add(platformRing);

  const upperRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.12, 0.02, 8, 96),
    pinkCrystalMat,
  );
  upperRing.rotation.x = Math.PI / 2;
  upperRing.position.y = 0.3;
  platform.add(upperRing);

  /* ---------- HUY HIỆU NGÔI SAO 8 CÁNH VÀNG NỔI KHỐI 3D (Đính nổi bật ở mặt trước bệ đài) ---------- */
  const emblemGroup = new THREE.Group();
  horseGroup.add(emblemGroup);

  // 1. Đế kim loại vàng dày dặn đúc khối (Solid 3D Gold Coin Base)
  const medalBaseMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.52, 0.52, 0.05, 48),
    goldMat,
  );
  medalBaseMesh.rotation.x = Math.PI / 2;
  emblemGroup.add(medalBaseMesh);

  // 2. Vành kim loại vàng tròn 3D bao quanh viền huy hiệu (3D Golden Torus Bevel Rim)
  const medalRimMesh = new THREE.Mesh(
    new THREE.TorusGeometry(0.52, 0.024, 16, 64),
    goldMat,
  );
  medalRimMesh.position.z = 0.026;
  emblemGroup.add(medalRimMesh);

  // 3. Mặt huy hiệu sắc nét, tương phản cao, nổi khối 100% không bị chìm
  const starEmblemMesh = new THREE.Mesh(
    new THREE.CircleGeometry(0.5, 48),
    new THREE.MeshBasicMaterial({
      map: starEmblemTex,
      transparent: true,
      side: THREE.FrontSide,
    }),
  );
  starEmblemMesh.position.z = 0.028;
  emblemGroup.add(starEmblemMesh);

  // 4. Lớp hào quang vàng tỏa sáng bao quanh huy hiệu (Soft Golden Aura)
  const medalGlowMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({
      map: glowTex,
      color: 0xffb733,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.9,
    }),
  );
  medalGlowMesh.position.z = -0.01;
  emblemGroup.add(medalGlowMesh);

  // Tọa độ đặt huy hiệu: Nằm nổi phía trên mặt nền, ngay trước mặt bệ đài, nghiêng nhẹ hướng lên camera
  emblemGroup.position.set(0, -0.3, 1.5);
  emblemGroup.rotation.set(-0.18, 0, 0);
  emblemGroup.renderOrder = 10;
  starEmblemMesh.renderOrder = 11;
  medalBaseMesh.renderOrder = 10;
  medalRimMesh.renderOrder = 10;
  medalGlowMesh.renderOrder = 9;

  // Đèn vàng rọi riêng trực tiếp cho huy hiệu ngôi sao 8 cánh tỏa sáng rực rỡ
  const emblemLight = new THREE.PointLight(0xffdf7a, 3.5, 5.0, 2);
  emblemLight.position.set(0, -0.66, 1.85);
  horseGroup.add(emblemLight);

  // Vòng thiên văn phía sau ngựa (điều chỉnh kích thước tương xứng với ngựa lớn hơn)
  const zodiacRing = new THREE.Mesh(
    new THREE.TorusGeometry(2.15, 0.016, 8, 128),
    goldMat,
  );
  zodiacRing.position.set(0, 0.88, -0.68);
  horseGroup.add(zodiacRing);

  const zodiacRing2 = new THREE.Mesh(
    new THREE.TorusGeometry(2.35, 0.012, 8, 128),
    pinkCrystalMat,
  );
  zodiacRing2.position.set(0, 0.88, -0.72);
  horseGroup.add(zodiacRing2);

  // Biểu tượng chữ "午" (Ngọ - Ngựa) phát sáng vàng
  const zodiacCanvas = document.createElement("canvas");
  zodiacCanvas.width = 256;
  zodiacCanvas.height = 256;
  const zodiacCtx = zodiacCanvas.getContext("2d");
  zodiacCtx.clearRect(0, 0, 256, 256);
  zodiacCtx.textAlign = "center";
  zodiacCtx.textBaseline = "middle";
  zodiacCtx.shadowColor = "#ffbe55";
  zodiacCtx.shadowBlur = 18;
  const zGrad = zodiacCtx.createLinearGradient(0, 30, 0, 220);
  zGrad.addColorStop(0, "#ffffff");
  zGrad.addColorStop(0.4, "#ffe8a3");
  zGrad.addColorStop(1, "#ffa834");
  zodiacCtx.fillStyle = zGrad;
  zodiacCtx.font = "bold 156px serif";
  zodiacCtx.fillText("午", 128, 128);
  const zodiacTexture = new THREE.CanvasTexture(zodiacCanvas);
  zodiacTexture.colorSpace = THREE.SRGBColorSpace;
  const zodiacSprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: zodiacTexture,
      transparent: true,
      depthWrite: false,
      opacity: 0.9,
    }),
  );
  zodiacSprite.position.set(0, 2.82, -0.52);
  zodiacSprite.scale.set(0.92, 0.92, 1);
  horseGroup.add(zodiacSprite);

  // Đèn rọi nhấn mạnh mẽ cho mô hình ngựa
  const horseCoreLight = new THREE.PointLight(0xff52cc, 2.5, 7, 2);
  horseCoreLight.position.set(0, 0.5, 0.4);
  horseGroup.add(horseCoreLight);

  const horseGoldLight = new THREE.PointLight(0xffc247, 1.8, 6, 2);
  horseGoldLight.position.set(-1.2, -0.4, 1.2);
  horseGroup.add(horseGoldLight);

  // Môi trường phản chiếu pha lê
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;

  // Loader FBX cho ngựa pha lê
  const BLANK = "data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=";
  const fbxManager = new THREE.LoadingManager();
  fbxManager.setURLModifier((url) =>
    /\.(png|jpe?g|tga|webp)$/i.test(url) ? BLANK : url,
  );

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xda8aff,
    metalness: 0.12,
    roughness: 0.12,
    transmission: 0.35,
    thickness: 1.2,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    iridescence: 0.85,
    emissive: 0x8a24c2,
    emissiveIntensity: 0.42,
    envMapIntensity: 1.6,
    side: THREE.DoubleSide,
  });

  const wireMat = new THREE.MeshBasicMaterial({
    color: 0xffdf8a,
    wireframe: true,
    transparent: true,
    opacity: 0.08,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  let horseModel = null;
  let horseMixer = null;

  new FBXLoader(fbxManager).load(
    "models/horse.fbx",
    (fbx) => {
      if (!running) return;
      horseModel = fbx;

      const horseMeshes = [];
      fbx.traverse((o) => {
        if (o.isMesh) horseMeshes.push(o);
      });
      horseMeshes.forEach((o) => {
        o.material = glassMat;
        if (!o.isSkinnedMesh) o.add(new THREE.Mesh(o.geometry, wireMat));
      });

      const box = new THREE.Box3().setFromObject(fbx);
      const size = box.getSize(new THREE.Vector3());
      fbx.scale.setScalar(3.7 / Math.max(size.x, size.y, size.z));
      box.setFromObject(fbx);
      const c = box.getCenter(new THREE.Vector3());
      fbx.position.x -= c.x;
      fbx.position.z -= c.z;
      fbx.position.y += -0.84 - box.min.y;
      fbx.rotation.y = -0.6;

      horseGroup.add(fbx);

      if (fbx.animations && fbx.animations.length) {
        horseMixer = new THREE.AnimationMixer(fbx);
        horseMixer.clipAction(fbx.animations[0]).play();
      }
    },
    undefined,
    (err) => console.error("Không load được horse.fbx:", err),
  );

  /* ---------- 3D Glowing Orbital Light Trails / Ribbons ---------- */
  const orbitalTrailsGroup = new THREE.Group();
  mainGroup.add(orbitalTrailsGroup);

  const trailMatCore = new THREE.MeshBasicMaterial({
    color: 0xffe6b0,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending,
  });
  const trailMatOuter = new THREE.MeshBasicMaterial({
    color: 0xda38ff,
    transparent: true,
    opacity: 0.34,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  // Curve 1: Dải xoắn ốc uốn lượn nâng cao theo các ảnh
  const pts1 = [];
  const loops1 = 2.4;
  const count1 = 48;
  for (let i = 0; i <= count1; i++) {
    const t = (i / count1) * Math.PI * 2 * loops1;
    const prog = i / count1;
    const r = (3.8 + Math.sin(prog * Math.PI) * 1.8) * cfg.orbitScale;
    const y = -0.3 + prog * 2.8 + Math.sin(t * 1.5) * 0.3;
    const x = Math.cos(t + 0.3) * r;
    const z = Math.sin(t + 0.3) * (r * 0.88);
    pts1.push(new THREE.Vector3(x, y, z));
  }
  const curve1 = new THREE.CatmullRomCurve3(pts1);
  const trail1Core = new THREE.Mesh(
    new THREE.TubeGeometry(curve1, 180, 0.024, 8, false),
    trailMatCore,
  );
  const trail1Outer = new THREE.Mesh(
    new THREE.TubeGeometry(curve1, 180, 0.07, 8, false),
    trailMatOuter,
  );
  orbitalTrailsGroup.add(trail1Core);
  orbitalTrailsGroup.add(trail1Outer);

  // Curve 2: Vòng elip thiên thể uốn lượn tầng trên
  const pts2 = [];
  const count2 = 36;
  for (let i = 0; i <= count2; i++) {
    const a = (i / count2) * Math.PI * 2;
    const x = Math.cos(a) * (4.5 * cfg.orbitScale);
    const z = Math.sin(a) * (3.6 * cfg.orbitScale);
    const y = 1.0 + Math.sin(a) * 0.9 + Math.cos(a * 2) * 0.25;
    pts2.push(new THREE.Vector3(x, y, z));
  }
  const curve2 = new THREE.CatmullRomCurve3(pts2, true);
  const trail2Core = new THREE.Mesh(
    new THREE.TubeGeometry(curve2, 140, 0.02, 8, false),
    trailMatCore,
  );
  const trail2Outer = new THREE.Mesh(
    new THREE.TubeGeometry(curve2, 140, 0.06, 8, false),
    trailMatOuter,
  );
  orbitalTrailsGroup.add(trail2Core);
  orbitalTrailsGroup.add(trail2Outer);

  // Curve 3: Vòng xoáy sóng nhẹ tầng giữa
  const pts3 = [];
  const count3 = 36;
  for (let i = 0; i <= count3; i++) {
    const a = (i / count3) * Math.PI * 2;
    const x = Math.cos(a) * (5.8 * cfg.orbitScale);
    const z = Math.sin(a) * (4.8 * cfg.orbitScale);
    const y = 0.2 + Math.sin(a + 0.5) * 0.6;
    pts3.push(new THREE.Vector3(x, y, z));
  }
  const curve3 = new THREE.CatmullRomCurve3(pts3, true);
  const trail3Core = new THREE.Mesh(
    new THREE.TubeGeometry(curve3, 140, 0.018, 8, false),
    trailMatCore,
  );
  const trail3Outer = new THREE.Mesh(
    new THREE.TubeGeometry(curve3, 140, 0.055, 8, false),
    trailMatOuter,
  );
  orbitalTrailsGroup.add(trail3Core);
  orbitalTrailsGroup.add(trail3Outer);

  /* ---------- Purple Particle Hearts (Trái tim hạt tím lơ lửng an toàn trên không trung) ---------- */
  const particleHeartMat = new THREE.PointsMaterial({
    size: 0.15,
    map: glowTex,
    vertexColors: true,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });

  const particleHeartsData = [
    { pos: [-5.2, 3.6, -2.0], scale: 1.15, phase: 0.2 },
    { pos: [-6.6, 1.2, -1.0], scale: 1.05, phase: 1.4 },
    { pos: [-3.8, 0.2, 2.2], scale: 0.9, phase: 2.7 },
    { pos: [-5.8, -0.4, 0.6], scale: 0.95, phase: 4.1 },
    { pos: [5.8, 3.4, -1.6], scale: 1.1, phase: 0.9 },
    { pos: [6.6, 0.8, 1.4], scale: 1.0, phase: 2.1 },
    { pos: [5.2, -0.35, 1.9], scale: 0.98, phase: 3.5 },
    { pos: [-1.8, 0.4, 3.0], scale: 0.75, phase: 5.0 },
  ];

  const particleHeartMeshes = [];
  const particleHeartGeos = [];

  particleHeartsData.forEach((d) => {
    const geo = createPurpleParticleHeartGeometry(220, d.scale);
    particleHeartGeos.push(geo);

    const pts = new THREE.Points(geo, particleHeartMat);
    pts.position.set(...d.pos);
    pts.userData = {
      baseY: d.pos[1],
      baseScale: 1.0,
      phase: d.phase,
      rotSpeedY: 0.35 + Math.random() * 0.25,
      rotSpeedX: 0.18 + Math.random() * 0.18,
    };
    mainGroup.add(pts);
    particleHeartMeshes.push(pts);
  });

  /* ---------- Cosmic Fog / Clouds (Làn mây tím bồng bềnh dịu mắt ở tầng đáy phía sau) ---------- */
  const cloudGroup = new THREE.Group();
  scene.add(cloudGroup);

  const cloudMat = new THREE.SpriteMaterial({
    map: cloudTex,
    transparent: true,
    blending: THREE.AdditiveBlending,
    opacity: 0.2,
    depthWrite: false,
  });
  const cloudPositions = [
    [-5.2, -2.2, -1.0, 7.5],
    [-3.2, -2.4, -2.0, 6.0],
    [5.2, -2.2, -1.0, 7.5],
    [3.2, -2.4, -2.0, 6.0],
  ];
  const cloudSprites = [];
  cloudPositions.forEach((cp) => {
    const s = new THREE.Sprite(cloudMat);
    s.position.set(cp[0], cp[1], cp[2]);
    s.scale.set(cp[3], cp[3] * 0.6, 1);
    cloudGroup.add(s);
    cloudSprites.push(s);
  });

  /* ---------- Shooting Stars (Sao Băng) ---------- */
  const shootingStars = [];
  const shootStarMat = new THREE.LineBasicMaterial({
    color: 0xffe5ff,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
  });
  const shootStarHeadMat = new THREE.SpriteMaterial({
    map: glowTex,
    color: 0xffffff,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
  });

  for (let i = 0; i < 3; i++) {
    const pts = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(-3.2, 2.2, 0)];
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const line = new THREE.Line(geo, shootStarMat.clone());
    const head = new THREE.Sprite(shootStarHeadMat.clone());
    head.scale.set(0.65, 0.65, 1);
    scene.add(line);
    scene.add(head);

    shootingStars.push({
      line,
      head,
      active: false,
      delay: i * 2.5 + Math.random() * 2,
      progress: 0,
      startX: 0,
      startY: 0,
      startZ: 0,
    });
  }

  function spawnShootingStar(s) {
    s.active = true;
    s.progress = 0;
    s.startX = -14 + Math.random() * 10;
    s.startY = 8 + Math.random() * 5;
    s.startZ = -12 - Math.random() * 8;
  }

  /* ---------- Falling Petals (Cánh hoa rơi) ---------- */
  const pCount = cfg.petalsCount;
  const petalGeo = new THREE.BufferGeometry();
  const petalPos = new Float32Array(pCount * 3);
  const petalBase = [];
  for (let i = 0; i < pCount; i++) {
    petalPos[i * 3 + 0] = (Math.random() - 0.5) * 16;
    petalPos[i * 3 + 1] = 6 + Math.random() * 6;
    petalPos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    petalBase.push({
      speedY: 0.008 + Math.random() * 0.014,
      driftX: (Math.random() - 0.5) * 0.008,
      driftZ: (Math.random() - 0.5) * 0.008,
      phase: Math.random() * Math.PI * 2,
    });
  }
  petalGeo.setAttribute("position", new THREE.BufferAttribute(petalPos, 3));
  const petalMat = new THREE.PointsMaterial({
    size: 0.28,
    map: petalTex,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    opacity: 0.72,
  });
  const petalPoints = new THREE.Points(petalGeo, petalMat);
  scene.add(petalPoints);

  /* ---------- Floating Small Particle Hearts Rising ---------- */
  const fhCount = cfg.floatingHearts;
  const floatingGeo = new THREE.BufferGeometry();
  const floatingPos = new Float32Array(fhCount * 3);
  const floatingBase = [];
  for (let i = 0; i < fhCount; i++) {
    floatingPos[i * 3 + 0] = (Math.random() - 0.5) * 18;
    floatingPos[i * 3 + 1] = -5 + Math.random() * 12;
    floatingPos[i * 3 + 2] = (Math.random() - 0.5) * 18;
    floatingBase.push({
      speed: 0.012 + Math.random() * 0.022,
      drift: (Math.random() - 0.5) * 0.006,
      phase: Math.random() * Math.PI * 2,
    });
  }
  floatingGeo.setAttribute(
    "position",
    new THREE.BufferAttribute(floatingPos, 3),
  );
  const floatingMat = new THREE.PointsMaterial({
    size: cfg.floatingSize,
    map: heartSmallTex,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    opacity: 0.55,
  });
  const floatingPoints = new THREE.Points(floatingGeo, floatingMat);
  scene.add(floatingPoints);

  /* ---------- 8 Photos (Sprites) Orbiting (Luôn nổi trên mặt sàn) ---------- */
  const photoSprites = [];
  const photoUserData = [];
  const hovered = { current: null };
  const photoOrbitCfg = makePhotoOrbitConfig(totalPhotos, cfg.orbitScale);

  function applyOrbitPosition(sprite, cfgEntry, time) {
    const floatY =
      Math.sin(time * cfgEntry.floatSpeed + cfgEntry.floatPhase) *
      cfgEntry.floatAmp;
    const a = cfgEntry.angle;
    const cos = Math.cos(a);
    const sin = Math.sin(a);
    const x = cos * cfgEntry.radius;
    const z = sin * cfgEntry.radius;
    const yTilt = Math.sin(a * 2) * cfgEntry.tilt * cfgEntry.radius;

    sprite.position.x = x;
    sprite.position.z = z;
    sprite.position.y = Math.max(-0.35, cfgEntry.baseY + yTilt + floatY);
  }

  const photoGroup = new THREE.Group();
  mainGroup.add(photoGroup);

  const raycaster = new THREE.Raycaster();
  const pointerNDC = new THREE.Vector2();

  function setHover(sprite, on) {
    if (!sprite) return;
    const ud = sprite.userData;
    const base = ud.baseScale || 1;
    if (on) {
      sprite.scale.set(base * 1.25, base * 1.25, 1);
      if (sprite.material) sprite.material.opacity = 1.0;
      canvas.style.cursor = "pointer";
    } else {
      sprite.scale.set(base, base, 1);
      if (sprite.material) sprite.material.opacity = 1.0;
      if (hovered.current === sprite) canvas.style.cursor = "";
    }
  }

  for (let i = 0; i < totalPhotos; i++) {
    const wish = WISHES_DATA[i];
    const orbitCfg = photoOrbitCfg[i];
    const basePhotoScale =
      1.04 * cfg.photoScale * (orbitCfg ? orbitCfg.photoMul : 1) || 1.0;

    const placeholder = document.createElement("canvas");
    placeholder.width = 512;
    placeholder.height = 512;
    const pctx = placeholder.getContext("2d");
    pctx.fillStyle = "#22082e";
    pctx.fillRect(0, 0, 512, 512);
    pctx.fillStyle = "#ff9bc8";
    pctx.font = "bold 72px sans-serif";
    pctx.textAlign = "center";
    pctx.textBaseline = "middle";
    pctx.fillText("💗", 256, 256);
    const placeholderTex = new THREE.CanvasTexture(placeholder);
    placeholderTex.colorSpace = THREE.SRGBColorSpace;

    const mat = new THREE.SpriteMaterial({
      map: placeholderTex,
      transparent: true,
      depthTest: true,
      depthWrite: false,
      opacity: 1.0,
    });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(basePhotoScale, basePhotoScale, 1);
    sprite.userData = {
      index: i,
      baseScale: basePhotoScale,
      orbit: orbitCfg,
      material: mat,
      placeholderTex,
      realTex: null,
    };
    if (orbitCfg) applyOrbitPosition(sprite, orbitCfg, 0);
    photoGroup.add(sprite);
    photoSprites.push(sprite);
    photoUserData.push(sprite.userData);

    createPhotoCircleTexture(
      wish,
      (tex) => {
        if (!running) {
          tex.dispose();
          return;
        }
        const old = mat.map;
        mat.map = tex;
        mat.needsUpdate = true;
        sprite.userData.realTex = tex;
        if (old && old !== placeholderTex) old.dispose();
      },
      (fallbackTex) => {
        const old = mat.map;
        mat.map = fallbackTex;
        mat.needsUpdate = true;
        if (old && old !== placeholderTex) old.dispose();
      },
    );
  }

  /* ---------- Landing Screen ---------- */
  function enterGalaxy() {
    if (landed) return;
    landed = true;
    broken = true;
    if (landingEl) landingEl.classList.add("hidden");
    if (hintEl) hintEl.classList.remove("hidden");
    if (
      window.__giftApi &&
      typeof window.__giftApi.ensureMusicOnAnyInteraction === "function"
    ) {
      try {
        window.__giftApi.ensureMusicOnAnyInteraction();
      } catch (e) {}
    }
  }

  if (enterBtn) enterBtn.addEventListener("click", enterGalaxy);

  /* ---------- Wish Modal ---------- */
  function openWishModal(index) {
    if (index < 0 || index >= WISHES_DATA.length) return;
    const data = WISHES_DATA[index];
    if (wishImg) {
      wishImg.src = data.img;
      if (data.crop) {
        wishImg.style.objectPosition = `${data.crop.x * 100}% ${data.crop.y * 100}%`;
      } else {
        wishImg.style.objectPosition = "center";
      }
    }
    if (wishTitle) wishTitle.textContent = data.title;
    if (wishText) wishText.textContent = data.text;
    if (wishModal) wishModal.classList.add("active");
  }

  function closeWishModal() {
    if (wishModal) wishModal.classList.remove("active");
  }

  if (wishClose) wishClose.addEventListener("click", closeWishModal);
  if (wishOk) wishOk.addEventListener("click", closeWishModal);
  function onWishModalBackdropClick(e) {
    if (e.target === wishModal) closeWishModal();
  }
  if (wishModal) wishModal.addEventListener("click", onWishModalBackdropClick);

  /* ---------- Pointer / Raycaster ---------- */
  function clientToNDC(e) {
    const rect = canvas.getBoundingClientRect();
    const cx =
      e.clientX !== undefined
        ? e.clientX
        : e.touches && e.touches[0]
          ? e.touches[0].clientX
          : 0;
    const cy =
      e.clientY !== undefined
        ? e.clientY
        : e.touches && e.touches[0]
          ? e.touches[0].clientY
          : 0;
    pointerNDC.x = ((cx - rect.left) / rect.width) * 2 - 1;
    pointerNDC.y = -((cy - rect.top) / rect.height) * 2 + 1;
  }

  function findIntersectedPhoto() {
    raycaster.setFromCamera(pointerNDC, camera);
    const intersects = raycaster.intersectObjects(photoSprites, false);
    if (intersects.length > 0) return intersects[0].object;
    return null;
  }

  let pointerDown = false;
  let pointerDownX = 0;
  let pointerDownY = 0;
  let pointerDownT = 0;

  function onPointerDown(e) {
    pointerDown = true;
    pointerDownX =
      e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    pointerDownY =
      e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
    pointerDownT = performance.now();
  }

  function onPointerMove(e) {
    if (!landed) return;
    clientToNDC(e);
    const hit = findIntersectedPhoto();
    if (hit !== hovered.current) {
      if (hovered.current) setHover(hovered.current, false);
      hovered.current = hit;
      if (hit) setHover(hit, true);
    }
  }

  function onPointerUp(e) {
    const curX =
      e.clientX ||
      (e.changedTouches && e.changedTouches[0]
        ? e.changedTouches[0].clientX
        : pointerDownX);
    const curY =
      e.clientY ||
      (e.changedTouches && e.changedTouches[0]
        ? e.changedTouches[0].clientY
        : pointerDownY);
    const dx = Math.abs(curX - pointerDownX);
    const dy = Math.abs(curY - pointerDownY);
    const dt = performance.now() - pointerDownT;
    const wasTap = dx < 8 && dy < 8 && dt < 480;
    pointerDown = false;

    if (!landed) {
      if (wasTap && !e.target.closest(".galaxy-landing-card")) {
        enterGalaxy();
      }
      return;
    }
    if (!wasTap) return;
    if (
      (e.target && e.target.closest(".galaxy-wish-card")) ||
      (e.target && e.target.closest(".galaxy-landing-card"))
    )
      return;

    clientToNDC(e);
    const hit = findIntersectedPhoto();
    if (hit) {
      openWishModal(hit.userData.index);
    }
  }

  canvas.addEventListener("pointerdown", onPointerDown, { passive: true });
  canvas.addEventListener("pointermove", onPointerMove, { passive: true });
  canvas.addEventListener("pointerup", onPointerUp, { passive: true });
  canvas.addEventListener("pointercancel", onPointerUp, { passive: true });
  function onPointerLeave() {
    if (hovered.current) {
      setHover(hovered.current, false);
      hovered.current = null;
    }
  }
  canvas.addEventListener("pointerleave", onPointerLeave);

  /* ---------- Resize Handler ---------- */
  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w === 0 || h === 0) return;
    composer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  window.addEventListener("resize", resize);

  /* ---------- Animation Loop ---------- */
  const clock = new THREE.Clock();
  let modalOpenLast = false;

  function tick() {
    if (!running) return;
    const dt = clock.getDelta();
    const t = clock.elapsedTime;
    if (horseMixer) horseMixer.update(dt);

    if (!modalOpenLast && wishModal && wishModal.classList.contains("active")) {
      modalOpenLast = true;
      controls.enabled = false;
    } else if (
      modalOpenLast &&
      wishModal &&
      !wishModal.classList.contains("active")
    ) {
      modalOpenLast = false;
      controls.enabled = true;
    }

    // Nhịp thở và xoay nhẹ nhàng của thiên mã
    const horseBreath = 1 + Math.sin(t * 1.8) * 0.012;
    horseGroup.scale.set(horseBreath, horseBreath, horseBreath);
    horseGroup.position.y = -0.28 + Math.sin(t * 1.25) * 0.045;
    horseGroup.rotation.y = Math.sin(t * 0.38) * 0.08;

    zodiacRing.rotation.z += dt * 0.045;
    zodiacRing2.rotation.z -= dt * 0.032;

    // Hiệu ứng ngôi sao 8 cánh lấp lánh nhẹ nhàng theo nhịp tim
    const emblemBreath = 1.0 + Math.sin(t * 2.2) * 0.04;
    emblemGroup.scale.set(emblemBreath, emblemBreath, emblemBreath);
    emblemLight.intensity = 3.2 + Math.sin(t * 2.2) * 0.6;

    // Đèn phát quang thiên mã
    horseCoreLight.intensity = 2.5 + Math.sin(t * 2.2) * 0.45;
    pinkLight.intensity = 1.8 + Math.sin(t * 2.1) * 0.35;

    // Xoay dải hạt ngân hà lớn nằm phẳng song song dưới nền (quay quanh trục thẳng đứng Y)
    galaxyPoints.rotation.y += dt * 0.035;
    farNebula.rotation.y -= dt * 0.006;

    // Xoay và phát sáng nhấp nháy cho galaxy nhỏ tím ở phía xa
    vortexGroup.rotation.z += dt * 0.09;
    const flarePulse = 4.2 + Math.sin(t * 2.0) * 0.6;
    coreFlare.scale.set(flarePulse, flarePulse, 1);
    vortexLight.intensity = 2.6 + Math.sin(t * 1.8) * 0.5;

    // Mặt sàn gương phản chiếu gợn sóng nhẹ
    floorRipplesMesh.rotation.z += dt * 0.02;

    if (landed) {
      mainGroup.rotation.y += dt * 0.035;
    } else {
      mainGroup.rotation.y = Math.sin(t * 0.25) * 0.18;
    }

    // Bồng bềnh, nhấp nháy và tự xoay của các trái tim hạt tím 3D
    particleHeartMeshes.forEach((pts) => {
      const ud = pts.userData;
      pts.position.y = ud.baseY + Math.sin(t * 1.4 + ud.phase) * 0.12;
      pts.rotation.y += dt * ud.rotSpeedY;
      pts.rotation.x = Math.sin(t * 0.75 + ud.phase) * 0.16;
      pts.rotation.z = Math.cos(t * 0.55 + ud.phase) * 0.12;

      // Nhịp tim đập nhẹ
      const pulse = ud.baseScale * (1 + Math.sin(t * 2.2 + ud.phase) * 0.045);
      pts.scale.set(pulse, pulse, pulse);
    });

    // Cánh hoa rơi bồng bềnh
    const pPos = petalGeo.attributes.position.array;
    for (let i = 0; i < pCount; i++) {
      const b = petalBase[i];
      pPos[i * 3 + 1] -= b.speedY;
      pPos[i * 3 + 0] += Math.sin(t * 1.2 + b.phase) * 0.008 + b.driftX;
      pPos[i * 3 + 2] += Math.cos(t * 1.0 + b.phase) * 0.008 + b.driftZ;
      if (pPos[i * 3 + 1] < -3.5) {
        pPos[i * 3 + 1] = 6.5 + Math.random() * 2;
        pPos[i * 3 + 0] = (Math.random() - 0.5) * 16;
        pPos[i * 3 + 2] = (Math.random() - 0.5) * 12;
      }
    }
    petalGeo.attributes.position.needsUpdate = true;

    // Hạt tim nhỏ bay lên
    const pos = floatingGeo.attributes.position.array;
    for (let i = 0; i < fhCount; i++) {
      const f = floatingBase[i];
      pos[i * 3 + 1] += f.speed;
      pos[i * 3 + 0] += Math.sin(t * 0.6 + f.phase) * 0.004 + f.drift;
      if (pos[i * 3 + 1] > 8) {
        pos[i * 3 + 1] = -5.5 - Math.random() * 2;
        pos[i * 3 + 0] = (Math.random() - 0.5) * 18;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 18;
      }
    }
    floatingGeo.attributes.position.needsUpdate = true;

    // Quản lý sao băng
    shootingStars.forEach((s) => {
      if (!s.active) {
        s.delay -= dt;
        if (s.delay <= 0) spawnShootingStar(s);
      } else {
        s.progress += dt * 0.9;
        const curX = s.startX + s.progress * 18;
        const curY = s.startY - s.progress * 11;
        const curZ = s.startZ;

        s.line.position.set(curX, curY, curZ);
        s.head.position.set(curX, curY, curZ);

        let alpha = 0;
        if (s.progress < 0.25) alpha = s.progress / 0.25;
        else if (s.progress < 0.8) alpha = 1.0;
        else alpha = Math.max(0, 1.0 - (s.progress - 0.8) / 0.2);

        s.line.material.opacity = alpha * 0.85;
        s.head.material.opacity = alpha * 0.95;

        if (s.progress >= 1.0) {
          s.active = false;
          s.delay = 3 + Math.random() * 4;
          s.line.material.opacity = 0;
          s.head.material.opacity = 0;
        }
      }
    });

    // Cập nhật vị trí các bức ảnh theo quỹ đạo (Luôn đảm bảo nổi trên cao)
    for (let i = 0; i < photoSprites.length; i++) {
      const s = photoSprites[i];
      const o = s.userData.orbit;
      if (o) {
        o.angle += dt * 0.035 * o.speedMul;
        applyOrbitPosition(s, o, t);
      }
      if (hovered.current !== s) {
        const pulse =
          s.userData.baseScale * (1 + Math.sin(t * 1.2 + i * 0.73) * 0.025);
        s.scale.set(pulse, pulse, 1);
      }
    }

    controls.update();
    composer.render();
    rafId = requestAnimationFrame(tick);
  }
  tick();

  /* ---------- Public API ---------- */
  function breakHeart() {
    if (!landed) enterGalaxy();
    broken = true;
  }

  function destroy() {
    running = false;
    cancelAnimationFrame(rafId);

    window.removeEventListener("resize", resize);
    canvas.removeEventListener("pointerdown", onPointerDown);
    canvas.removeEventListener("pointermove", onPointerMove);
    canvas.removeEventListener("pointerup", onPointerUp);
    canvas.removeEventListener("pointercancel", onPointerUp);
    canvas.removeEventListener("pointerleave", onPointerLeave);

    if (enterBtn) enterBtn.removeEventListener("click", enterGalaxy);
    if (wishClose) wishClose.removeEventListener("click", closeWishModal);
    if (wishOk) wishOk.removeEventListener("click", closeWishModal);
    if (wishModal) {
      wishModal.removeEventListener("click", onWishModalBackdropClick);
      closeWishModal();
    }
    hovered.current = null;
    canvas.style.cursor = "";
    if (landingEl) landingEl.classList.remove("hidden");

    controls.dispose();
    composer.dispose();
    if (horseMixer) horseMixer.stopAllAction();

    glassMat.dispose();
    wireMat.dispose();
    envTex.dispose();
    pmrem.dispose();

    galaxyGeo.dispose();
    galaxyMat.dispose();
    vGeo.dispose();
    vMat.dispose();
    coreFlareMat.dispose();

    floorBaseMesh.geometry.dispose();
    floorBaseMesh.material.dispose();
    floorRipplesMesh.geometry.dispose();
    floorRipplesMesh.material.dispose();

    particleHeartGeos.forEach((g) => g.dispose());
    particleHeartMat.dispose();

    cloudMat.dispose();

    trailMatCore.dispose();
    trailMatOuter.dispose();
    trail1Core.geometry.dispose();
    trail1Outer.geometry.dispose();
    trail2Core.geometry.dispose();
    trail2Outer.geometry.dispose();
    trail3Core.geometry.dispose();
    trail3Outer.geometry.dispose();

    petalGeo.dispose();
    petalMat.dispose();
    floatingGeo.dispose();
    floatingMat.dispose();

    glowTex.dispose();
    heartSmallTex.dispose();
    petalTex.dispose();
    cloudTex.dispose();
    starEmblemTex.dispose();
    floorRippleTex.dispose();
    nebulaTex.dispose();
    farNebula.material.dispose();
    farNebula.geometry.dispose();
    zodiacTexture.dispose();

    goldMat.dispose();
    pinkCrystalMat.dispose();
    darkBaseMat.dispose();

    horseGroup.traverse((object) => {
      if (object.geometry) object.geometry.dispose();
      if (object.material) {
        if (Array.isArray(object.material))
          object.material.forEach((m) => m.dispose());
        else object.material.dispose();
      }
    });

    cloudGroup.traverse((object) => {
      if (object.geometry) object.geometry.dispose();
      if (object.material) {
        if (Array.isArray(object.material))
          object.material.forEach((m) => m.dispose());
        else object.material.dispose();
      }
    });

    shootingStars.forEach((s) => {
      s.line.geometry.dispose();
      s.line.material.dispose();
      s.head.material.dispose();
    });

    photoSprites.forEach((s) => {
      const ud = s.userData;
      if (ud.placeholderTex) ud.placeholderTex.dispose();
      if (ud.realTex) ud.realTex.dispose();
      if (ud.material) ud.material.dispose();
    });

    renderer.dispose();
    try {
      renderer.forceContextLoss && renderer.forceContextLoss();
    } catch (e) {}
  }

  return {
    breakHeart,
    destroy,
    isBroken: () => broken,
  };
}
