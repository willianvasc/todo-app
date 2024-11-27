import { Button, Paper, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function Form({ addTodo }) {
  const [text, setText] = useState("");  // Estado para o texto da nova tarefa
  const [id, setId] = useState(0);

  // useEffect para carregar os todos quando a página for carregada
  useEffect(() => {
    axios.get('http://localhost:3000/todos')
      .then(response => {
        console.log('Todos carregados com sucesso!', response.data);
        // Adiciona todos os todos ao estado
        response.data.forEach(todo => addTodo(todo));
      })
      .catch(error => {
        console.error('Erro ao carregar os todos:', error);
        alert('Ocorreu um erro ao carregar os todos. Tente novamente!');
      });
  }, []); // O array vazio faz com que o efeito seja executado apenas uma vez, ao carregar a página

  const todoCreate = (text) => {
    // Verifica se o texto é nulo, vazio ou contém apenas espaços em branco
    if (!text || text.trim() === "") {
      alert('O campo de tarefa não pode ser vazio!');
      return;
    }

    const todoObj = { text: text.trim(), id: id, conclude: 'F' }; // Remove espaços desnecessários
    setId(id + 1);

    // Fazer a requisição POST para o backend usando Axios
    axios.post('http://localhost:3000/todos', { title: text })
      .then(response => {
        console.log('Tarefa criada com sucesso!', response.data);
        addTodo(response.data); // Adiciona o todo retornado pelo backend
        setText(""); // Reinicia o valor do estado do input
      })
      .catch(error => {
        console.error('Erro ao criar a tarefa:', error);
        alert('Ocorreu um erro ao criar a tarefa. Tente novamente!');
      });
  };

  return (
    <Paper style={{ padding: "1em" }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <TextField
          id="outlined-basic"
          label="Tarefa"
          variant="outlined"
          value={text} // Usa o estado 'text' para controlar o valor do input
          onChange={(e) => setText(e.target.value)}  // Atualiza o estado 'text' quando o input mudar
          fullWidth
        />
        <Button variant="text" onClick={() => todoCreate(text)}>
          Add
        </Button>
      </div>
    </Paper>
  );
}
