document.getElementById('uploadForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Previne o comportamento padrão do formulário

    // Obtém o arquivo de imagem do input
    const fileInput = document.getElementById('imageFile');
    const file = fileInput.files[0];

    // Verifica se um arquivo foi selecionado
    if (!file) {
        document.getElementById('result').innerText = "Por favor, selecione uma imagem para enviar.";
        return;
    }

    // URL do blob storage
    const blobUrl = "https://armazenamentoblob123.blob.core.windows.net/meu-container/"; // Atualizado para incluir o nome correto do container

    // SAS Token gerado
    const sasToken = "sp=racw&st=2024-11-19T03:23:50Z&se=2024-12-25T11:23:50Z&sv=2022-11-02&sr=c&sig=1Lt8TgweEzDi6baeDkSFVwSZoCFzN27eGcg1%2FVCrg8c%3D"; // Substitua pela SAS Token gerada

    // URL completa para upload com codificação do nome do arquivo
    const uploadUrl = blobUrl + file.name + "?" + sasToken;

    try {
        // Cria os cabeçalhos, incluindo o tipo do conteúdo e o tipo de blob
        const headers = {
            "Content-Type": file.type,   // Cabeçalho Content-Type baseado no tipo do arquivo
            "x-ms-blob-type": "BlockBlob" // Cabeçalho obrigatório para Azure
        };

        // Exibindo a mensagem de carregamento enquanto a requisição é feita
        document.getElementById('result').innerText = "Enviando imagem para o Azure...";

        // Envia o arquivo diretamente para o Blob Storage
        const response = await fetch(uploadUrl, {
            method: 'PUT',
            headers: headers,
            body: file
        });

        if (response.ok) {
            // Se o upload for bem-sucedido, obtém a URL pública do blob
            const uploadedImageUrl = blobUrl + encodeURIComponent(file.name);

            console.log('Imagem enviada com sucesso:', uploadedImageUrl);

            // Agora você pode usar essa URL para análise facial
            processFaceAnalysis(uploadedImageUrl);
        } else {
            console.error('Falha no upload:', response.statusText);
            document.getElementById('result').innerText = 'Falha no upload do arquivo.';
        }
    } catch (error) {
        console.error('Erro ao enviar o arquivo:', error);
        document.getElementById('result').innerText = 'Erro ao enviar o arquivo.';
    }
});

async function processFaceAnalysis(imageUrl) {
    // URL da API de análise facial
    const endpoint = "https://brazilsouth.api.cognitive.microsoft.com/face/v1.0/detect";
    const subscriptionKey = "d5b0d1bacd4140d887429a948b974584";  // Sua chave de API

    const params = new URLSearchParams({
        "returnFaceId": "false",
        "returnFaceLandmarks": "false"
    });

    try {
        // Exibindo a mensagem de carregamento enquanto a requisição é feita
        document.getElementById('result').innerText = "Enviando imagem para análise...";

        const response = await fetch(endpoint + "?" + params.toString(), {
            method: 'POST',
            headers: {
                'Ocp-Apim-Subscription-Key': subscriptionKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: imageUrl })
        });

        if (response.ok) {
            const result = await response.json();
            if (result.length > 0) {
                document.getElementById('result').innerText = "É um rosto!";
                






            } else {
                document.getElementById('result').innerText = "Não é um rosto.";








            }
        } else {
            const errorDetail = await response.text();
            console.error("Erro na API:", errorDetail);
            document.getElementById('result').innerText = `Erro ao enviar os dados para análise facial. Detalhes: ${errorDetail}`;
        }
    } catch (error) {
        console.error('Erro ao enviar os dados para análise facial:', error);
        document.getElementById('result').innerText = 'Erro ao enviar os dados.';
    }



}
