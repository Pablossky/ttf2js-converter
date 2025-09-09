const dropZone = document.getElementById('dropZone');
const chooseBtn = document.getElementById('chooseBtn');
const status = document.getElementById('status');

async function handleFile(filePath) {
    status.textContent = 'Konwertowanie...';
    const result = await window.electronAPI.convertTTF(filePath);
    if (result.success) {
        status.textContent = `Zapisano JS: ${result.path}`;
    } else {
        status.textContent = 'Anulowano lub błąd';
    }
}

dropZone.addEventListener('dragover', e => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});
dropZone.addEventListener('dragleave', e => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
});
dropZone.addEventListener('drop', e => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0].path);
    }
});

chooseBtn.addEventListener('click', async () => {
    const { canceled, filePath } = await window.electronAPI.selectTTFFile();
    if (!canceled) handleFile(filePath);
});
