
    let cpfAtual = null;
    const token = localStorage.getItem("token");
    if (!token) window.location.href = "index.html";

    // Cadastro do munícipe
    document.getElementById("cadastroForm").addEventListener("submit", async e => {
      e.preventDefault();
      const form = e.target;
      const formData = new FormData(form);
      formData.delete("pdf"); // não enviar arquivo no JSON
      const jsonBody = Object.fromEntries(formData);

      try {
        const res = await fetch("http://localhost:5000/api/municipes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(jsonBody)
        });
        if (!res.ok) throw new Error("Erro ao cadastrar");

        // enviar PDF
        formData.set("cpf", jsonBody.cpf);
        formData.append("pdf", document.querySelector('input[name=pdf]').files[0]);
        const up = await fetch("http://localhost:5000/api/upload-pdf-drive", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData
        });
        if (!up.ok) throw new Error("Erro ao enviar PDF");

        alert("Munícipe cadastrado com sucesso!");
        form.reset();
        document.getElementById("cadastroFormContainer").style.display = "none";
        // já pode exibir no modal
        buscarMunicipe();
      } catch (err) {
        alert(err.message);
      }
    });

    // Comentários (definido uma única vez)
    document.getElementById("comentarioForm").addEventListener("submit", async e => {
      e.preventDefault();
      const novo = document.getElementById("comentario").value.trim();
       const cat = document.getElementById("categoria").value; 
      if (!novo ||  !cat ||  !cpfAtual) {
        return alert("Preencha comentário, categoria e busque um munícipe.");
      }
      try {
        const res = await fetch("http://localhost:5000/api/municipes/comentario", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ cpf: cpfAtual, comentario: novo , categoria: cat  })
        });
        if (!res.ok) throw new Error("Erro ao salvar comentário");
        document.getElementById("comentario").value = "";
        document.getElementById("categoria").value = "";
        carregarComentarios(); // atualizar lista
        buscarMunicipe();
      } catch (err) {
        alert(err.message);
      }
    });

    // Buscar munícipe e exibir modal
    async function buscarMunicipe() {
      const cpf = document.getElementById("buscarCpf").value.trim();
      if (!cpf) return alert("Digite um CPF");
      cpfAtual = cpf;
      try {
        const res = await fetch(`http://localhost:5000/api/municipes?cpf=${cpf}`);
        if (res.status === 404) {
          // exibe form de cadastro
          document.getElementById("cadastroFormContainer").style.display = "block";
          document.querySelector("#cadastroForm [name=cpf]").value = cpf;
          return;
        }
        const m = await res.json();
        // preencher dados
        ["nome","cpf","rg","endereco","numero","bairro","cep","cidade","estado"]
          .forEach(f => document.getElementById(f+"Modal").textContent = m[f]);
        document.getElementById("btnBaixarPdf").href = `https://drive.google.com/file/d/${m.pdfId}/view`;

        // mostrar comentários
        carregarComentarios(m.comentarios);
        

        const modal = new bootstrap.Modal(document.getElementById("modalMunicipe"));
        modal.show();
      } catch (err) {
        alert("Erro ao buscar munícipe");
      }
    }

    // Atualiza lista de comentários (recebe array ou refaz fetch)
    function carregarComentarios(arr) {
      const lista = document.getElementById("listaComentarios");
      lista.innerHTML = "";0
      const comentarios = arr || [];
      comentarios.forEach(c => {
        const li = document.createElement("li");
        li.classList.add("list-group-item");
        const d = new Date(c.data);
        li.innerHTML = `<small class="text-muted">${d.toLocaleDateString("pt-BR")} às ${d.toLocaleTimeString("pt-BR",{hour:'2-digit',minute:'2-digit'})}</small><br>
                        <strong>${c.categoria}:</strong> ${c.texto}`;
        lista.appendChild(li);
      });
    }

/*     // Stub para buscar ordens de serviço
    function buscarOrdemServico() {
      const cat = document.getElementById("buscarOrdem").value;
      if (!cat) return alert("Selecione uma categoria");
      // aqui você implementa a real busca de OS...
      alert("Buscando ordens de serviço de " + cat);
    } */


// Stub para buscar ordens de serviço
async function buscarOrdemServico() {
    const cat = document.getElementById("buscarOrdem").value;
    if (!cat) return alert("Selecione uma categoria");

    try {
      const res = await fetch(`http://localhost:5000/api/municipes/comentarios/categoria?categoria=${cat}`);
      if (!res.ok) throw new Error("Erro ao buscar comentários");
      const comentarios = await res.json();

      // Limpar o conteúdo do modal
      const modalBody = document.getElementById("modalOrdemServicoBody");
      modalBody.innerHTML = "";

      if (comentarios.length === 0) {
          modalBody.innerHTML = "<p>Nenhum comentário encontrado para esta categoria.</p>";
      } else {
        // Adicionar os resultados ao modal
        comentarios.forEach(c => {
          const item = document.createElement("div");
          item.innerHTML = `
            <p><strong>Nome:</strong> ${c.nome}</p>
            <p><strong>CPF:</strong> ${c.cpf}</p>
            <p><strong>Categoria:</strong> ${c.categoria}</p>
            <p><strong>Comentário:</strong> ${c.texto}</p>
            <hr>
          `;
          modalBody.appendChild(item);
        });
      }

      // Exibir o modal
      const modal = new bootstrap.Modal(document.getElementById("modalOrdemServico"));
      modal.show();
    } catch (error) {
      alert(error.message);
    }
  }


    // Placeholder para “editar campo” (você pode implementar inline editing)
    function editarCampo(campo) {
      const span = document.getElementById(campo + "Modal");
      const valor = span.textContent;
      const novo = prompt(`Editar ${campo}:`, valor);
      if (novo !== null) span.textContent = novo;
      // e aqui você faz PATCH no back-end, se quiser...
    }
