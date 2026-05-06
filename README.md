# 🌐 Website Cloner em JavaScript — @Nk Petrov

Um **clonador simples de sites em JavaScript** usando **Node.js**, que permite baixar HTML, CSS, JS e imagens automaticamente de qualquer site.

Simples, leve e funcional — perfeito pra estudar estrutura de sites ou rodar testes locais direto no celular.

---

## ⚙️ Como usar (Termux)

### 🧩 1️⃣ Acesse o armazenamento

```bash
cd /sdcard
```

---

### 📥 2️⃣ Clone o projeto

```bash
git clone https://github.com/Nk-Petrov/Website-Cloner
```

---

### 📂 3️⃣ Entre na pasta

```bash
cd /sdcard/Website-Cloner
```

---

### ▶️ 4️⃣ Execute o script

```bash
node test.js
```

---

## 🧠 Como funciona

Após iniciar, o sistema vai pedir:

```
URL DO SITE:
```

👉 Exemplo:

```
https://exemplo.com
```

---

## 📂 O que ele faz

✔ Baixa o HTML do site  
✔ Extrai e baixa:
- CSS  
- JavaScript  
- Imagens  

✔ Organiza automaticamente:

```
output/
 └── dominio/
     ├── index.html
     ├── css/
     ├── js/
     └── img/
```

✔ Gera um `.zip` final:

```
output/dominio.zip
```

---

## ⚠️ Observações

- Alguns sites podem não funcionar corretamente
- Sites com muito JavaScript podem não ser clonados 100%
- Uso recomendado apenas para **estudo e testes**

---

## 👤 Autor

👨‍💻 **Nk Petrov**  
🔗 https://github.com/Nk-Petrov
