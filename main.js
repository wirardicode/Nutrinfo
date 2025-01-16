document.getElementById("barcode-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const input = document.getElementById("search-input").value.trim();
  let url;

  // Deteksi apakah input berupa barcode (hanya angka) atau nama produk
  if (/^\d+$/.test(input)) {
      url = `https://world.openfoodfacts.org/api/v2/product/${input}.json`;
  } else {
      url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(input)}&search_simple=1&action=process&json=true`;
  }

  try {
      const response = await fetch(url);
      const data = await response.json();

      const resultDiv = document.getElementById("result");
      if (/^\d+$/.test(input)) {
          // Proses hasil pencarian berdasarkan barcode
          if (data.status === 1) {
              const product = data.product;
              document.getElementById("product-name").textContent = `Nama: ${product.product_name || "Tidak diketahui"}`;
              document.getElementById("calories").textContent = `Kalori: ${product.nutriments.energy || "Tidak diketahui"} kcal`;
              document.getElementById("protein").textContent = `Protein: ${product.nutriments.proteins || "Tidak diketahui"} g`;
              document.getElementById("carbohydrates").textContent = `Karbohidrat: ${product.nutriments.carbohydrates || "Tidak diketahui"} g`;
              document.getElementById("suggar").textContent = `Gula: ${product.nutriments.sugars || "Tidak diketahui"} g`;

              if (product.nutrition_grades === 'a' || product.nutrition_grades === 'b') {
                  document.getElementById("nutrition").textContent = `Kelas nutrisi: ${product.nutrition_grades}, (baik untuk kesehatan)`;
              } else if (
                  product.nutrition_grades === 'c' ||
                  product.nutrition_grades === 'd' ||
                  product.nutrition_grades === 'e'
              ) {
                  document.getElementById("nutrition").textContent = `Kelas nutrisi: ${product.nutrition_grades}, (kurang disarankan untuk kesehatan)`;
              } else {
                  document.getElementById("nutrition").textContent = `Kelas nutrisi: ${product.nutrition_grades || "Tidak diketahui"}`;
              }
          } else {
              resultDiv.innerHTML = `<p>Produk tidak ditemukan.</p>`;
          }
      } else {
          // Proses hasil pencarian berdasarkan nama produk
          if (data.products && data.products.length > 0) {
              const product = data.products[0]; // Ambil produk pertama dari hasil pencarian
              document.getElementById("product-name").textContent = `Nama: ${product.product_name || "Tidak diketahui"}`;
              document.getElementById("calories").textContent = `Kalori: ${product.nutriments.energy || "Tidak diketahui"} kcal`;
              document.getElementById("protein").textContent = `Protein: ${product.nutriments.proteins || "Tidak diketahui"} g`;
              document.getElementById("carbohydrates").textContent = `Karbohidrat: ${product.nutriments.carbohydrates || "Tidak diketahui"} g`;
              document.getElementById("suggar").textContent = `Gula: ${product.nutriments.sugars || "Tidak diketahui"} g`;

              if (product.nutrition_grades === 'a' || product.nutrition_grades === 'b') {
                  document.getElementById("nutrition").textContent = `Kelas nutrisi: ${product.nutrition_grades}, (baik untuk kesehatan)`;
              } else if (
                  product.nutrition_grades === 'c' || product.nutrition_grades === 'd' || product.nutrition_grades === 'e') {
                  document.getElementById("nutrition").textContent = `Kelas nutrisi: ${product.nutrition_grades}, (kurang disarankan untuk kesehatan)`;
              } else {
                  document.getElementById("nutrition").textContent = `Kelas nutrisi: ${product.nutrition_grades || "Tidak diketahui"}`;
              }
          } else {
              resultDiv.innerHTML = `<p>Produk tidak ditemukan.</p>`;
          }
      }
  } catch (error) {
      console.error("Error fetching data:", error);
      alert("Terjadi kesalahan saat mengambil data. Silakan coba lagi nanti.");
  }
});
