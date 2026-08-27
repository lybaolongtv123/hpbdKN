import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

/* ============================================================
   Galaxy Gift 3D — Birthday Universe
   - 17 ảnh trong gift/ (3 orbits: 5 + 6 + 6)
   - Trái tim particle trung tâm (implicit heart eq)
   - Galaxy spiral particle background
   - Floating hearts bay lên
   - Raycaster click/hover 17 ảnh
   - Landing + Modal (DOM)
   - Responsive + dispose sạch
   ============================================================ */

const WISHES_DATA = [
  {
    img: "gift/2aOboQtIKrS8EeVOs0NwBQswfxcFNylwmr67szBY.jpg",
    title: "Special Card ✨",
    text: "Nếu em có vô tình mở trúng tấm hình này thì hãy nhắn lại 'emyeuanh' với anh để được nhận 1 tô bún bò đặc biệt nhé. Vì đây là tấm ảnh anh thích nhất",
  },
  {
    img: "gift/2aOboQtIKrriIMQZ3OGUZCuJOgEGuuBTUFR6miXI.jpg",
    title: "Nụ cười đáng yêu 💖",
    text: "Nụ cười của em có thể làm xua tan cả ngày mưa buồn. Hãy luôn cười như vậy nhé, vì nụ cười đó thật đáng yêu.",
  },
  {
    img: "gift/2aOboQtIKsEfN1GKVraFONvWkPz5GCPxk2EoF5pg.jpg",
    title: "Ngày nắng đẹp ☀️",
    text: "Anh muốn gặp em nhiều hơn vì mỗi lần được ngồi bên cạnh em, cảm giác như cả thế giới đều tươi sáng, ấm áp hơn rất nhiều. Happy Birthday Ngọc Như!",
  },
  {
    img: "gift/2aOboQtIKtauB4sECgAOm46bLMP4x7oRjkabZXBQ.jpg",
    title: "Hoa hồng 🌹",
    text: "Chúc Ngọc Như tuổi mới luôn xinh đẹp như một bông hoa, thật xinh đẹp và lộng lẫy.",
  },
  {
    img: "gift/2aOboQtIKtuPBQqdMsZLJafwHEXgC3D8SLzIdNGy.jpg",
    title: "Ước mơ tỏa sáng 🌟",
    text: "Hãy luôn tự tin bước theo con đường mình chọn, vì em thật sự xứng đáng với tất cả những điều tuyệt vời nhất trên đời.",
  },
  {
    img: "gift/2aOboQtIKuZRgrl9s4pAIA2SpZYNppgonwy2wGC8.jpg",
    title: "Điểm tựa tinh thần 💪 ",
    text: "Sẽ thật tuyệt vời nếu như bờ vai của anh đủ rộng để em cảm thấy an tâm và anh được cùng em giải quyết các rắc rối phía trước để cùng nhau tận hưởng niềm hạnh phúc phía sau ",
  },
  {
    img: "gift/2aOboQtIKvOILi4SDBakIz6yXch7EAffH1wzr11M.jpg",
    title: "Bầu trời 🌌",
    text: "Nếu em là một ngôi sao, em chắc chắn là ngôi sao sáng nhất trên bầu trời đêm vốn hiu quạnh của anh. Luôn tỏa sáng nhé!",
  },
  {
    img: "gift/2aOboQtIKvdRKrWmVKyU95VVUL1T8smYpbERgnei.jpg",
    title: "Khoảnh khắc 🍬",
    text: "Khoảnh khắc nào đứng cạnh em, nghe những lời em nói, anh cũng cảm thấy vui, thời gian như trôi nhanh hơn. Chúc tuổi mới thật nhiều niềm vui như vậy.",
  },
  {
    img: "gift/2aOboQtIKvqcgvu9d6efmLj6PtY4cgScsQMSkQZE.jpg",
    title: "Bước chân tự tin 👣",
    text: "Mỗi bước chân của em hãy luôn mang niềm vui và sự tự tin. Luôn nhớ rằng luôn có những người đặt trọn niềm tin vào em đó là gia đình và cả anh nữa, anh tin em sẽ làm được tất cả những điều mình mong muốn chỉ cần là không từ bỏ.",
  },
  {
    img: "gift/2aOboQtIKw9XCxksFBwkepDVDWqOwycTDTMkmXXU.jpg",
    title: "Đôi mắt lấp lánh 🌈",
    text: "Đôi mắt của em như có cả một vườn đom đóm ở bên trong - rực rỡ, lung linh. Đừng bao giờ để nỗi buồn che khuất ánh mắt đó nhé.",
  },
  {
    img: "gift/2aOboQtILFmaFNBkdA4SEA2iTEcQ71A2yw6VyedU.jpg",
    title: "Gia đình 🏡",
    text: "Chúc Ngọc Như luôn có một gia đình thật ấm áp, được nhận thật nhiều tình yêu thương từ những người thân yêu (đừng quên có cả chồng của em nữa). ",
  },
  {
    img: "gift/2aOboQtILGxl3jGkNQAjYnGfqsVrfoMOGUMBIOa8.jpg",
    title: "Hành trình mới 🚀",
    text: "Tuổi mới là một hành trình mới đầy niềm vui và bất ngờ. Anh sẽ luôn ở đây, cùng em trải qua từng bước chân trên con đường ấy.",
  },
  {
    img: "gift/2aOboQtILHUg15GngdV0naDVI7Eb68tDcxQfWbku.jpg",
    title: "Không thể quên 🌺",
    text: "Dù thời gian trôi qua thế nào, những kỷ niệm đầu tiên về em anh sẽ không bao giờ quên. Em thật đặc biệt.",
  },
  {
    img: "gift/2aOboQtILIbZfsiTZGKT7T2C5pqOzGUaKJ5BfsJ6.jpg",
    title: "Con người tuyệt vời 💫",
    text: "Em không chỉ là người con gái đáng yêu trong mắt anh mà còn cả những người xung quanh nữa. Kiếm người ghét mình không khó, nhưng kiếm người thương mình mới khó. Cảm ơn em vì đã luôn là chính mình.",
  },
  {
    img: "gift/2aOboQtILIib6xGKfQmfDnTUgEzzHrfd70hwMuw4.jpg",
    title: "Nét đẹp tâm hồn 🎨",
    text: "Dù cuộc đời có tô vẽ thế nào đi nữa, anh vẫn mong em sẽ luôn giữ được cái tâm hồn trong sáng và đáng yêu của riêng mình.",
  },
  {
    img: "gift/4003a761dfd75e8907c6.jpg",
    title: "Quà tặng vũ trụ 🌠",
    text: "Nếu anh có thể mang cả vũ trụ đến tặng em, anh cũng sẽ làm. Nhưng bây giờ, chỉ có cả trái tim này thôi — dành cho em.",
  },
  {
    img: "gift/ebdd01bf7909f857a118.jpg",
    title: "Tương lai tươi đẹp 💗 ",
    text: "Anh không biết trong tương lai sẽ như nào. Nhưng hiện tại anh chỉ mong em luôn được vui vẻ, hạnh phúc. Anh yêu em 💗",
  },
];

function makeResponsiveCfg() {
  const w = window.innerWidth;
  if (w < 500) {
    return {
      heartCount: 6500,
      galaxyCount: 12000,
      floatingHearts: 60,
      photoScale: 0.72,
      orbitScale: 0.78,
      heartSize: 0.05,
      galaxySize: 0.04,
      floatingSize: 0.17,
    };
  }
  if (w < 900) {
    return {
      heartCount: 11000,
      galaxyCount: 22000,
      floatingHearts: 95,
      photoScale: 0.86,
      orbitScale: 0.9,
      heartSize: 0.046,
      galaxySize: 0.036,
      floatingSize: 0.19,
    };
  }
  return {
    heartCount: 16000,
    galaxyCount: 32000,
    floatingHearts: 140,
    photoScale: 1,
    orbitScale: 1,
    heartSize: 0.042,
    galaxySize: 0.034,
    floatingSize: 0.22,
  };
}

function createGlowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.3, "rgba(255,255,255,0.8)");
  g.addColorStop(1, "rgba(0,0,0,0)");
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
  ctx.fillStyle = "#ff3d8a";
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

function createPhotoCircleTexture(imgPath, onReady, onError) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  const img = new Image();
  img.onload = () => {
    ctx.clearRect(0, 0, 512, 512);
    ctx.beginPath();
    ctx.arc(256, 256, 248, 0, Math.PI * 2);
    const grad = ctx.createRadialGradient(256, 256, 232, 256, 256, 250);
    grad.addColorStop(0, "rgba(255, 60, 140, 0)");
    grad.addColorStop(1, "rgba(255, 60, 140, 0.95)");
    ctx.fillStyle = grad;
    ctx.lineWidth = 8;
    ctx.strokeStyle = "#ff3d8a";
    ctx.shadowColor = "rgba(255, 60, 140, 0.9)";
    ctx.shadowBlur = 28;
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.save();
    ctx.beginPath();
    ctx.arc(256, 256, 230, 0, Math.PI * 2);
    ctx.clip();
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    let sx = 0,
      sy = 0,
      sw = iw,
      sh = ih;
    if (iw > ih) {
      sx = (iw - ih) / 2;
      sw = ih;
    } else {
      sy = (ih - iw) / 2;
      sh = iw;
    }
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, 512, 512);
    ctx.restore();
    ctx.beginPath();
    ctx.arc(256, 256, 230, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255, 180, 220, 0.35)";
    ctx.lineWidth = 2;
    ctx.stroke();
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

function makePhotoOrbitConfig(total, orbitScale) {
  const orbits = [
    {
      count: 5,
      r: 2.3 * orbitScale,
      tilt: 0.12,
      yVar: 0.35,
      speedMul: 1.35,
      photoMul: 1.05,
    },
    {
      count: 6,
      r: 3.8 * orbitScale,
      tilt: -0.18,
      yVar: 0.55,
      speedMul: 1.0,
      photoMul: 0.98,
    },
    {
      count: 6,
      r: 5.4 * orbitScale,
      tilt: 0.26,
      yVar: 0.85,
      speedMul: 0.72,
      photoMul: 0.92,
    },
  ];
  const out = [];
  let idx = 0;
  for (let o = 0; o < orbits.length; o++) {
    const orbit = orbits[o];
    const count = orbit.count;
    for (let k = 0; k < count; k++) {
      const baseAngle = (k / count) * Math.PI * 2 + o * 0.55;
      const radius = orbit.r + (Math.random() - 0.5) * 0.3;
      const yJitter = (Math.random() - 0.5) * orbit.yVar;
      const zJitter = (Math.random() - 0.5) * 0.25;
      const floatPhase = Math.random() * Math.PI * 2;
      const floatAmp = 0.12 + Math.random() * 0.18;
      const floatSpeed = 0.5 + Math.random() * 0.7;
      out.push({
        idx,
        orbitIdx: o,
        angle: baseAngle,
        radius,
        baseY: yJitter,
        zJitter,
        tilt: orbit.tilt,
        speedMul: orbit.speedMul * (0.9 + Math.random() * 0.25),
        photoMul: orbit.photoMul,
        floatPhase,
        floatAmp,
        floatSpeed,
      });
      idx++;
      if (idx >= total) return out;
    }
  }
  return out;
}

export function mountGift3D(canvas) {
  const cfg = makeResponsiveCfg();
  const totalPhotos = Math.min(WISHES_DATA.length, 17);

  /* ---------- DOM ---------- */
  const $ = (id) => document.getElementById(id);
  const giftView = $("giftView");
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
  scene.fog = new THREE.FogExp2(0x05020f, 0.035);

  const camera = new THREE.PerspectiveCamera(
    58,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    500,
  );
  camera.position.set(0, 1.2, 7.6);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;

  /* ---------- Controls ---------- */
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.enablePan = false;
  controls.minDistance = 3.8;
  controls.maxDistance = 14;
  controls.maxPolarAngle = Math.PI * 0.85;
  controls.minPolarAngle = Math.PI * 0.15;
  controls.target.set(0, 0.2, 0);
  controls.update();

  /* ---------- Lights ---------- */
  const ambient = new THREE.AmbientLight(0xffffff, 0.55);
  scene.add(ambient);

  const pinkLight = new THREE.PointLight(0xff4da3, 2.2, 16, 2);
  pinkLight.position.set(0.5, 0.8, 2.2);
  scene.add(pinkLight);

  const purpleLight = new THREE.PointLight(0xa04cd0, 1.8, 20, 2);
  purpleLight.position.set(-1.8, -0.6, -2.4);
  scene.add(purpleLight);

  const blueLight = new THREE.PointLight(0x6688ff, 0.7, 24, 2);
  blueLight.position.set(2.2, -1.4, -0.8);
  scene.add(blueLight);

  /* ---------- Shared textures ---------- */
  const glowTex = createGlowTexture();
  const heartSmallTex = createHeartTexture();

  /* ---------- Main galaxy group (rotates slowly) ---------- */
  const mainGroup = new THREE.Group();
  scene.add(mainGroup);

  /* ---------- Far Nebula Sphere (background) ---------- */
  const nebulaCanvas = document.createElement("canvas");
  nebulaCanvas.width = 512;
  nebulaCanvas.height = 512;
  (function paintNebula() {
    const ctx = nebulaCanvas.getContext("2d");
    const g = ctx.createRadialGradient(256, 256, 20, 256, 256, 300);
    g.addColorStop(0, "rgba(255, 110, 180, 0.35)");
    g.addColorStop(0.35, "rgba(140, 60, 200, 0.35)");
    g.addColorStop(0.7, "rgba(20, 5, 50, 0.85)");
    g.addColorStop(1, "rgba(0, 0, 0, 1)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 160; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const rr = Math.random() * 1.8 + 0.3;
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.7 + 0.2})`;
      ctx.beginPath();
      ctx.arc(x, y, rr, 0, Math.PI * 2);
      ctx.fill();
    }
  })();
  const nebulaTex = new THREE.CanvasTexture(nebulaCanvas);
  nebulaTex.colorSpace = THREE.SRGBColorSpace;
  const farNebula = new THREE.Mesh(
    new THREE.SphereGeometry(90, 32, 32),
    new THREE.MeshBasicMaterial({
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.85,
      map: nebulaTex,
      depthWrite: false,
    }),
  );
  scene.add(farNebula);

  /* ---------- Galaxy Spiral Particles ---------- */
  const galaxyParams = {
    count: cfg.galaxyCount,
    radius: 11,
    branches: 4,
    spin: 1.25,
  };
  const galaxyGeo = new THREE.BufferGeometry();
  const galaxyPos = new Float32Array(galaxyParams.count * 3);
  const galaxyCol = new Float32Array(galaxyParams.count * 3);
  const tmpColor = new THREE.Color();
  for (let i = 0; i < galaxyParams.count; i++) {
    const r = Math.pow(Math.random(), 2.3) * galaxyParams.radius;
    const spin = r * galaxyParams.spin;
    const branchAngle =
      ((i % galaxyParams.branches) / galaxyParams.branches) * Math.PI * 2;
    const spread = (Math.random() - 0.5) * (0.25 + r * 0.06);
    const vertical = (Math.random() - 0.5) * 0.25;

    galaxyPos[i * 3 + 0] =
      Math.cos(branchAngle + spin) * r + spread * Math.cos(branchAngle + spin);
    galaxyPos[i * 3 + 1] = vertical;
    galaxyPos[i * 3 + 2] =
      Math.sin(branchAngle + spin) * r + spread * Math.sin(branchAngle + spin);

    const tint = Math.random();
    if (tint < 0.4) tmpColor.setRGB(1, 0.5, 0.85);
    else if (tint < 0.75) tmpColor.setRGB(0.78, 0.45, 1);
    else if (tint < 0.9) tmpColor.setRGB(1, 0.8, 0.95);
    else tmpColor.setRGB(1, 1, 1);
    const s = 0.55 + Math.random() * 0.5;
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
  galaxyPoints.rotation.x = 0.55;
  galaxyPoints.rotation.z = 0.2;
  mainGroup.add(galaxyPoints);

  /* ---------- Heart Particle Center ---------- */
  const heartGeo = new THREE.BufferGeometry();
  const heartCount = cfg.heartCount;
  const heartPos = new Float32Array(heartCount * 3);
  const heartCol = new Float32Array(heartCount * 3);
  for (let i = 0; i < heartCount; i++) {
    let x = 0,
      y = 0,
      z = 0;
    let inside = false;
    let tries = 0;
    while (!inside && tries < 20) {
      tries++;
      x = (Math.random() - 0.5) * 2.7;
      y = (Math.random() - 0.5) * 2.7;
      z = (Math.random() - 0.5) * 2.7;
      const a = x * x + (9 / 4) * y * y + z * z - 1;
      if (a * a * a - x * x * z * z * z - (9 / 80) * y * y * z * z * z <= 0) {
        inside = true;
      }
    }
    heartPos[i * 3 + 0] = x * 1.1;
    heartPos[i * 3 + 1] = z * 1.1 + 0.25;
    heartPos[i * 3 + 2] = y * 1.1;

    const tintRatio = Math.random();
    if (tintRatio < 0.55) tmpColor.setRGB(1, 0.18, 0.5);
    else if (tintRatio < 0.85) tmpColor.setRGB(1, 0.45, 0.7);
    else tmpColor.setRGB(0.9, 0.35, 0.9);
    const s = 0.75 + Math.random() * 0.3;
    heartCol[i * 3 + 0] = tmpColor.r * s;
    heartCol[i * 3 + 1] = tmpColor.g * s;
    heartCol[i * 3 + 2] = tmpColor.b * s;
  }
  heartGeo.setAttribute("position", new THREE.BufferAttribute(heartPos, 3));
  heartGeo.setAttribute("color", new THREE.BufferAttribute(heartCol, 3));
  const heartMat = new THREE.PointsMaterial({
    size: cfg.heartSize,
    map: glowTex,
    vertexColors: true,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });
  const heartPoints = new THREE.Points(heartGeo, heartMat);
  heartPoints.position.y = 0.2;
  mainGroup.add(heartPoints);

  /* ---------- Floating small hearts rising ---------- */
  const fhCount = cfg.floatingHearts;
  const floatingGeo = new THREE.BufferGeometry();
  const floatingPos = new Float32Array(fhCount * 3);
  const floatingBase = [];
  for (let i = 0; i < fhCount; i++) {
    floatingPos[i * 3 + 0] = (Math.random() - 0.5) * 18;
    floatingPos[i * 3 + 1] = -6 + Math.random() * 12;
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
    opacity: 0.85,
  });
  const floatingPoints = new THREE.Points(floatingGeo, floatingMat);
  scene.add(floatingPoints);

  /* ---------- 17 Photos (Sprites) ---------- */
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
    sprite.position.x = x + cfgEntry.zJitter * sin;
    sprite.position.z = z + cfgEntry.zJitter * cos;
    sprite.position.y = cfgEntry.baseY + yTilt + floatY;
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
      sprite.scale.set(base * 1.22, base * 1.22, 1);
      if (sprite.material) sprite.material.opacity = 1;
      canvas.style.cursor = "pointer";
    } else {
      sprite.scale.set(base, base, 1);
      if (sprite.material) sprite.material.opacity = 0.98;
      if (hovered.current === sprite) canvas.style.cursor = "";
    }
  }

  for (let i = 0; i < totalPhotos; i++) {
    const wish = WISHES_DATA[i];
    const orbitCfg = photoOrbitCfg[i];
    const basePhotoScale =
      0.88 * cfg.photoScale * (orbitCfg ? orbitCfg.photoMul : 1) || 0.88;

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
      depthWrite: false,
      opacity: 0.98,
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
      wish.img,
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
    if (landingEl) {
      landingEl.classList.add("hidden");
    }
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

  function bindLanding() {
    if (enterBtn) {
      enterBtn.addEventListener("click", enterGalaxy);
    }
  }
  bindLanding();

  /* ---------- Wish Modal ---------- */
  function openWishModal(index) {
    if (index < 0 || index >= WISHES_DATA.length) return;
    const data = WISHES_DATA[index];
    if (wishImg) wishImg.src = data.img;
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
  if (wishModal) {
    wishModal.addEventListener("click", onWishModalBackdropClick);
  }

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
    pointerDownX = e.clientX;
    pointerDownY = e.clientY;
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
    const dx = Math.abs((e.clientX || 0) - pointerDownX);
    const dy = Math.abs((e.clientY || 0) - pointerDownY);
    const dt = performance.now() - pointerDownT;
    const wasTap = dx < 6 && dy < 6 && dt < 420;
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

  /* ---------- Resize ---------- */
  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w === 0 || h === 0) return;
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

    const heartBeat = 1 + Math.sin(t * 2.2) * 0.045 + Math.sin(t * 4.4) * 0.018;
    heartPoints.scale.set(heartBeat, heartBeat, heartBeat);
    heartPoints.rotation.y += dt * 0.12;
    pinkLight.intensity = 2.0 + Math.sin(t * 2.2) * 0.6;

    galaxyPoints.rotation.z += dt * 0.04;
    farNebula.rotation.y -= dt * 0.008;
    if (landed) {
      mainGroup.rotation.y += dt * 0.035;
    } else {
      mainGroup.rotation.y = Math.sin(t * 0.25) * 0.2;
    }

    const pos = floatingGeo.attributes.position.array;
    for (let i = 0; i < fhCount; i++) {
      const f = floatingBase[i];
      pos[i * 3 + 1] += f.speed;
      pos[i * 3 + 0] += Math.sin(t * 0.6 + f.phase) * 0.004 + f.drift;
      if (pos[i * 3 + 1] > 8) {
        pos[i * 3 + 1] = -6 - Math.random() * 2;
        pos[i * 3 + 0] = (Math.random() - 0.5) * 18;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 18;
      }
    }
    floatingGeo.attributes.position.needsUpdate = true;

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
    renderer.render(scene, camera);
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

    galaxyGeo.dispose();
    galaxyMat.dispose();
    heartGeo.dispose();
    heartMat.dispose();
    floatingGeo.dispose();
    floatingMat.dispose();
    glowTex.dispose();
    heartSmallTex.dispose();
    nebulaTex.dispose();
    farNebula.material.dispose();
    farNebula.geometry.dispose();

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
