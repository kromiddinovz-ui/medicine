async function getMedicines() {
  try {
    const res = await fetch("http://localhost:3000/medicines");
    return await res.json();
  } catch (err) {
    console.error("Xatolik:", err);
    return [];
  }
}


async function startApp() {
  const list = await getMedicines();

  const box = document.getElementById("medicineContainer");
  const search = document.querySelector(".search-box");
  const cartCount = document.getElementById("cartCount");
  const seeBtn = document.querySelector(".seeAll");

  let count = 0;
  let all = false;

  function render(items) {
    if (!box) return;

    // See All bosilsa hammasi, Hide All bosilsa (all=false) 5 ta ko'rsatiladi
    const currentList = all ? items : items.slice(0, 5);

    box.innerHTML = currentList
      .map(
        (item) => `
      <div class="card">
        <img src="${item.image}" alt="${item.name}" class="medicine-img" onerror="this.src='https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop'">
        <div>
          <h3>${item.name}</h3>
          <p>${item.category}</p>
          <p><b>${item.price.toLocaleString()} so'm</b></p>
        </div>
        <button class="btn-buy">Sotib olish</button>
        <button class="btn-sell">Bekor qilish</button>
      </div>
    `,
      )
      .join("");

    document.querySelectorAll(".btn-buy").forEach((btn) => {
      btn.addEventListener("click", () => {
        count++;
        if (cartCount) cartCount.textContent = count;
        alert("Dori savatga qo'shildi!");
      });
    });

    document.querySelectorAll(".btn-sell").forEach((btn) => {
      btn.addEventListener("click", () => {
        count = Math.max(0, count - 1);
        if (cartCount) cartCount.textContent = count;
        alert("Dori savatdan o'chirildi!");
      });
    });
  }

  render(list);

  if (seeBtn) {
    seeBtn.addEventListener("click", () => {
      all = !all;
      seeBtn.textContent = all ? "Hide All" : "See All";
      render(list);
    });
  }

  if (search) {
    search.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase();
      const filtered = list.filter((item) =>
        item.name.toLowerCase().includes(query),
      );
      render(filtered);
    });
  }
}

function initSlider() {
  const slides = document.querySelectorAll(".slide");
  if (slides.length === 0) return;

  let currentIndex = 0;

  setInterval(() => {
    slides[currentIndex].classList.remove("active");
    currentIndex = (currentIndex + 1) % slides.length;
    slides[currentIndex].classList.add("active");
  }, 3000); // Har 3 soniyada almashadi
}

// runApp() ichida chaqirasiz:
// initSlider();

async function runApp() {
  initBannerTimer();
  await startApp();
}

runApp();

let swiper = new Swiper(".mySwiper", {
  loop: true,
  spaceBetween: 30,
  centeredSlides: true,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

// Telegram Bot
const BOT_TOKEN = "8849704525:AAEF7aVmN8bnjVsiIyf-QBiU0pdnx43e8iA";
const CHAT_ID = "8849704525";

const contactForm = document.querySelector(".contact-form");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const [name, phone, specialist, message] = contactForm.elements;

  const text =
    `🏥 <b>Yangi so'rov</b>\n\n` +
    `👤 Ism: ${name.value}\n` +
    `📞 Telefon: ${phone.value}\n` +
    `🩺 Mutaxassis: ${specialist.value}\n` +
    `💬 Xabar: ${message.value || "-"}`;

  try {
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: text,
      parse_mode: "HTML",
    });

    alert("Rahmat! Tez orada siz bilan bog'lanamiz.");
    contactForm.reset();
  } catch (err) {
    console.error(err);
    alert("Yuborib bo'lmadi, keyinroq urinib ko'ring.");
  }
});
