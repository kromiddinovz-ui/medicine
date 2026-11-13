const API_URL = 'http://localhost:3000/medicines';

const form = document.getElementById('medicineForm');
const tableBody = document.getElementById('adminTableBody');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');

// 1. Barcha dorilarni yuklash va jadvalga chiqarish
async function loadMedicines() {
  try {
    const res = await fetch(API_URL);
    const medicines = await res.json();

    tableBody.innerHTML = medicines
      .map(
        (med) => `
      <tr>
        <td><img src="${med.image}" class="med-thumb" onerror="this.src='https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200'"></td>
        <td><b>${med.name}</b></td>
        <td>${med.category}</td>
        <td>${Number(med.price).toLocaleString()} so'm</td>
        <td>
          <button class="btn-edit" onclick="editMedicine('${med.id}')">Tahrirlash</button>
          <button class="btn-delete" onclick="deleteMedicine('${med.id}')">O'chirish</button>
        </td>
      </tr>
    `
      )
      .join('');
  } catch (err) {
    console.error("Ma'lumot yuklashda xatolik:", err);
  }
}

// 2. Yangi dori qo'shish yoki tahrirlanganini saqlash
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('medId').value;
  const medicineData = {
    name: document.getElementById('medName').value,
    category: document.getElementById('medCategory').value,
    price: Number(document.getElementById('medPrice').value),
    image: document.getElementById('medImage').value,
  };

  try {
    if (id) {
      // Tahrirlash (PUT)
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(medicineData),
      });
      alert('Dori muvaffaqiyatli yangilandi!');
    } else {
      // Yangi qo'shish (POST)
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(medicineData),
      });
      alert("Yangi dori bazaga qo'shildi!");
    }

    resetForm();
    loadMedicines();
  } catch (err) {
    console.error('Saqlashda xatolik:', err);
  }
});

// 3. Dorini o'chirish (DELETE)
async function deleteMedicine(id) {
  if (!confirm("Rostdan ham bu dorini o'chirmoqchimisiz?")) return;

  try {
    await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    loadMedicines();
  } catch (err) {
    console.error("O'chirishda xatolik:", err);
  }
}

// 4. Tahrirlash uchun formaga ma'lumotni yuklash
async function editMedicine(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    const med = await res.json();

    document.getElementById('medId').value = med.id;
    document.getElementById('medName').value = med.name;
    document.getElementById('medCategory').value = med.category;
    document.getElementById('medPrice').value = med.price;
    document.getElementById('medImage').value = med.image;

    formTitle.textContent = 'Dorini tahrirlash';
    submitBtn.textContent = 'Yangilash';
    submitBtn.style.background = '#f39c12';
  } catch (err) {
    console.error('Xatolik:', err);
  }
}

function resetForm() {
  form.reset();
  document.getElementById('medId').value = '';
  formTitle.textContent = "Yangi dori qo'shish";
  submitBtn.textContent = 'Saqlash';
  submitBtn.style.background = '#28a745';
}

// Sahifa ochilganda ro'yxatni yuklash
loadMedicines();