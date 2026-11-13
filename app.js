async function getMedicines() {
  try {
    const res = await fetch("https://6af709ede844c7ff741be929.mockapi.io/api/medicines");
    if (!res.ok) throw new Error("Serverdan ma'lumot kelmadi");
    return await res.json();
  } catch (err) {
    console.error("Xatolik:", err);
    return [];
  }
}

// localStorage'dan savatchadagi ma'lumotlarni o'qib olish
let count = Number(localStorage.getItem("cartCount")) || 0;
let savedCart = JSON.parse(localStorage.getItem("cartItems")) || [];

async function startApp() {
  const list = await getMedicines();

  const box = document.getElementById("medicineContainer");
  const search = document.querySelector(".search-box");
  const cartCount = document.getElementById("cartCount");
  const seeBtn = document.querySelector(".seeAll");

  if (cartCount) cartCount.textContent = count;
  let all = false;

  function render(items) {
    if (!box) return;

    const currentList = all ? items : items.slice(0, 4);

    box.innerHTML = currentList
      .map(
        (item) => `
      <div class="card">
        <img src="${item.image}" alt="${item.name}" class="medicine-img" onerror="this.src='https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop'">
        <div>
          <h3>${item.name || "Nomsiz dori"}</h3>
          <p class="category"><b>Kategoriya:</b> ${item.category || ""}</p>
          <p class="form"><b>Shakli:</b> ${item.form || ""}</p>
          <p class="manufacturer"><b>Ishlab chiqaruvchi:</b> ${item.manufacturer || ""}</p>
          <p class="price"><b>Narxi:</b> ${Number(item.price || 0).toLocaleString()} so'm</p>
          <p class="desc">${item.description || ""}</p>
        </div>
        <button class="btn-buy" data-id="${item.id}">Sotib olish</button>
        <button class="btn-sell" data-id="${item.id}">Bekor qilish</button>
      </div>
    `
      )
      .join("");

    // Sotib olish tugmasi
    document.querySelectorAll(".btn-buy").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        const item = list.find((i) => i.id == id);

        count++;
        if (item) savedCart.push(item);

        localStorage.setItem("cartCount", count);
        localStorage.setItem("cartItems", JSON.stringify(savedCart));

        if (cartCount) cartCount.textContent = count;
        alert("Dori savatga qo'shildi!");
      });
    });

    // Bekor qilish tugmasi
    document.querySelectorAll(".btn-sell").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");

        if (count > 0) {
          count--;
          const index = savedCart.findIndex((i) => i.id == id);
          if (index !== -1) savedCart.splice(index, 1);

          localStorage.setItem("cartCount", count);
          localStorage.setItem("cartItems", JSON.stringify(savedCart));

          if (cartCount) cartCount.textContent = count;
          alert("Dori savatdan o'chirildi!");
        }
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
        (item.name || "").toLowerCase().includes(query)
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
  }, 3000);
}

async function runApp() {
  initSlider();
  await startApp();
}

runApp();

if (document.querySelector(".mySwiper")) {
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
}

// Telegram Bot
const BOT_TOKEN = "8849704525:AAEF7aVmN8bnjVsiIyf-QBiU0pdnx43e8iA";
const CHAT_ID = "8849704525";

const contactForm = document.querySelector(".contact-form");

if (contactForm) {
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
}