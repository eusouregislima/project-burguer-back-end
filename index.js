const express = require('express') // importando o express
const uuid = require('uuid') // importando uuid para gerar ids
const app = express() // uma constante app para guardar o express
const port = 3001 // abri essa constante para a porta para o caso de eu precisar trocar o numero da porta
app.use(express.json()) // avisando o express que vou usar por padrão o json


const burguerOrders = [] // criando a contante para todos os pedidos


const checkId = (request, response, next) =>{ //checagem de id
    const {id} = request.params // buscando o id no params

    const index = burguerOrders.findIndex(index => index.id === id) 
    // verificando a posição do usuário no array
    //verificando se o id enviado retorna um número maior que zero
    // se retorna -1 é pq não foi encontrado

    if(index<0) { // Esse caso é se não for encontrado
        return response.status(404).json({message: "User not found."})
    }

    userId = id // id do usuário
    userIndex = index //posição do usuário dentro do array

    next() // seguindo
}

// Criando um meddleware que imprima o tipo da requisição e a url da requisição
const methodUrl = (request, response, next) => {
    const method = request.method 
    const url = request.path // path significa caminho

    console.log(`Method:${method} URL: ${url}`) //Imprimindo

    next() // seguindo
}


app.get('/users', methodUrl, (request, response) => { // essa rota me entrega todos os pedidos, url e método
    return response.json(burguerOrders) // respondendo com os dados de todos os pedidos
})


app.post('/users', methodUrl, (request, response) => { // aqui estou enviando dados para o navegador
    const {order, name, value} = request.body // parte que eu digito
    const requestBurguer = {id: uuid.v4(), order, name, value, status: "Em preparação"} // criando o meu usuário. uuid cria o id, o resto vem pelo body
    
    burguerOrders.push(requestBurguer) // inserindo os dados no array principal
    return response.status(201).json(requestBurguer) // adicionei o status 201 que é de informação adicionada
})


app.put('/users/:id', checkId, methodUrl, (request, response) => { // busquei pelo id, chequei e imprime url e metodo
    //primeiro ele vai executar a checkId - estando ok, vem para cá
    const { id } = request.params
    const { order, name, value,} = request.body
    const changeRequest = {id, order, name, value, status: "Em preparação"} // criando meu usuário

    
    burguerOrders[userIndex] = changeRequest // Se ele encontrar, vai ser trocado pelos dados enviados.

    return response.json(changeRequest) // retorna somente o usuário modificado
})


app.delete('/users/:id', checkId, methodUrl, (request, response) => { 
  
    burguerOrders.splice(userIndex,1) //somente apaga a posição encontrada

    return response.status(204).json() //204 é status de sem conteúdo
})


app.get('/users/:id', checkId, methodUrl, (request, response) => { 
    
    const index = userIndex //posição do usuário no array
        
    return response.json(burguerOrders[index]) 
})


app.patch('/users/:id', checkId, methodUrl, (request, response) => { //atualizando parcialmente
    const index = userIndex
   
    burguerOrders[index].status = "Pronto"
 
    return response.json(burguerOrders[index])
    
})


app.listen(3001, ()=>{ // aqui estou acessando a minha porta e imprimindo o start do servidor
    console.log(`🚀 Server started on port ${port}`) // mensagem de status
}) // porta 3000 é usada para aplicações node



