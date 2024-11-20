document.getElementById('uploadForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Previne o comportamento padrão do formulário

    // Obtém os dados do formulário
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const interest = document.getElementById('interest').value;
    const fileInput = document.getElementById('imageFile');
    const file = fileInput.files[0];
    const documentFile = document.getElementById('document').files[0];

    // Verifica se os campos obrigatórios foram preenchidos
    if (!email || !password || !interest || !file || !documentFile) {
        document.getElementById('result').innerText = "Por favor, preencha todos os campos e selecione os arquivos.";
        return;
    }

    // URL do blob storage
    const blobUrl = "https://armazenamentoblob123.blob.core.windows.net/meu-container/"; // Atualizado para incluir o nome correto do container
    const sasToken = "sp=racw&st=2024-11-19T03:23:50Z&se=2024-12-25T11:23:50Z&sv=2022-11-02&sr=c&sig=1Lt8TgweEzDi6baeDkSFVwSZoCFzN27eGcg1%2FVCrg8c%3D"; // Substitua pela SAS Token gerada

    // Envia os arquivos para o Blob Storage (imagem do rosto e documento)
    const uploadImageUrl = blobUrl + encodeURIComponent(file.name) + "?" + sasToken;
    const uploadDocUrl = blobUrl + encodeURIComponent(documentFile.name) + "?" + sasToken;

    // Cabeçalhos para upload de arquivos
    const headers = {
        "Content-Type": file.type,
        "x-ms-blob-type": "BlockBlob"
    };

    try {
        // Envia imagem do rosto para o Blob Storage
        const imgResponse = await fetch(uploadImageUrl, {
            method: 'PUT',
            headers: headers,
            body: file
        });

        if (!imgResponse.ok) {
            document.getElementById('result').innerText = 'Falha ao enviar a imagem do rosto.';
            return;
        }

        // Envia documento para o Blob Storage
        const docResponse = await fetch(uploadDocUrl, {
            method: 'PUT',
            headers: headers,
            body: documentFile
        });

        if (!docResponse.ok) {
            document.getElementById('result').innerText = 'Falha ao enviar o documento.';
            return;
        }

        // URL pública da imagem e do documento no Blob
        const uploadedImageUrl = blobUrl + encodeURIComponent(file.name);
        const uploadedDocUrl = blobUrl + encodeURIComponent(documentFile.name);

        // Envia os dados do formulário para a API
        const response = await fetch('https://apiparadatabase.azurewebsites.net/api/insertUsuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
                interest: interest,
                faceImage: uploadedImageUrl,
                documentImage: uploadedDocUrl
            })
        });

        const result = await response.json();
        if (response.ok) {
            document.getElementById('result').innerText = result.body;
        } else {
            document.getElementById('result').innerText = 'Erro ao enviar os dados para a API.';
        }
    } catch (error) {
        console.error('Erro ao enviar os dados:', error);
        document.getElementById('result').innerText = 'Erro ao enviar os dados.';
    }
});
