document.getElementById('uploadForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Previne o comportamento padrão do formulário

    // Pega os valores dos campos
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const interest = document.getElementById('interest').value;
    const faceImage = document.getElementById('faceImage').files[0];
    const documentFile = document.getElementById('document').files[0];

    // Aqui você pode processar os dados, fazer upload para o servidor ou chamar APIs
    console.log("Email:", email);
    console.log("Senha:", password);
    console.log("Área de Interesse:", interest);
    console.log("Imagem do Rosto:", faceImage);
    console.log("Documento:", documentFile);

    // Exemplo de como você poderia usar a API do Azure para enviar a imagem do rosto:
    try {
        const formData = new FormData();
        formData.append('image', faceImage);
        formData.append('document', documentFile);

        // Exemplo de requisição para a API
        const response = await fetch('/api/receber-imagem', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const result = await response.json();
            document.getElementById('result').innerText = `Análise realizada com sucesso! Resultados: ${JSON.stringify(result)}`;
        } else {
            document.getElementById('result').innerText = 'Erro ao enviar os dados.';
        }
    } catch (error) {
        console.error('Erro:', error);
        document.getElementById('result').innerText = 'Erro ao enviar os dados.';
    }
});
