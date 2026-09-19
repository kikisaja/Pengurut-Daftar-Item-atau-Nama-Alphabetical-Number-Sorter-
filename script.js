document.addEventListener("DOMContentLoaded", function () {
    // 1. Ambil Elemen DOM
    const textInput = document.getElementById("textInput");
    const optRemoveDuplicates = document.getElementById("optRemoveDuplicates");
    const optNaturalSort = document.getElementById("optNaturalSort");

    const sortButtons = document.querySelectorAll(".btn-action");
    const btnCopy = document.getElementById("btnCopy");
    const btnClear = document.getElementById("btnClear");

    const totalLinesDisplay = document.getElementById("totalLines");
    const uniqueLinesDisplay = document.getElementById("uniqueLines");

    // Hitung statistik baris
    function updateStats() {
        const rawText = textInput.value;
        if (!rawText.trim()) {
            totalLinesDisplay.textContent = "0";
            uniqueLinesDisplay.textContent = "0";
            return;
        }

        const lines = rawText.split("\n").filter(line => line.trim() !== "");
        const uniqueLines = new Set(lines.map(line => line.trim()));

        totalLinesDisplay.textContent = lines.length;
        uniqueLinesDisplay.textContent = uniqueLines.size;
    }

    // 2. Logika Utama Pengurutan
    function sortList(type) {
        let text = textInput.value;
        if (!text.trim()) return;

        // Ambil per baris dan bersihkan spasi tambahan
        let items = text.split("\n").map(item => item.trim()).filter(item => item !== "");

        // Opsi: Hapus Duplikat menggunakan Set
        if (optRemoveDuplicates.checked) {
            items = Array.from(new Set(items));
        }

        const isNatural = optNaturalSort.checked;

        // Terapkan Logika Pengurutan
        switch (type) {
            case "asc":
                items.sort((a, b) => {
                    return isNatural 
                        ? a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
                        : a.localeCompare(b);
                });
                break;

            case "desc":
                items.sort((a, b) => {
                    return isNatural 
                        ? b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' })
                        : b.localeCompare(a);
                });
                break;

            case "length":
                items.sort((a, b) => a.length - b.length || a.localeCompare(b));
                break;

            case "shuffle":
                // Algoritma Fisher-Yates Shuffle
                for (let i = items.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [items[i], items[j]] = [items[j], items[i]];
                }
                break;

            default:
                break;
        }

        // Tampilkan hasil kembali ke Textarea
        textInput.value = items.join("\n");
        updateStats();
    }

    // 3. Fitur Salin Hasil
    function copyText() {
        if (!textInput.value) return;

        navigator.clipboard.writeText(textInput.value).then(() => {
            const originalText = btnCopy.textContent;
            btnCopy.textContent = "Tersalin! ✓";
            btnCopy.style.backgroundColor = "#0284c7";

            setTimeout(() => {
                btnCopy.textContent = originalText;
                btnCopy.style.backgroundColor = "#16a34a";
            }, 1500);
        });
    }

    // 4. Fitur Hapus Semua
    function clearText() {
        textInput.value = "";
        updateStats();
    }

    // Event Listener
    textInput.addEventListener("input", updateStats);

    sortButtons.forEach(button => {
        button.addEventListener("click", function () {
            const sortType = this.getAttribute("data-sort");
            sortList(sortType);
        });
    });

    btnCopy.addEventListener("click", copyText);
    btnClear.addEventListener("click", clearText);

    // Inisialisasi statistik awal
    updateStats();
});
