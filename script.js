class Despesa{//criar objeto despesa
    constructor(ano,mes,dia,tipo,descricao,valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }
    validaDados(){//checando se os dados foram preenchidos
        for(let i in this){
            if(this[i] == undefined || this[i]=='' || this[i]==null){
                return false
            }
        }
        return true
    }
}
//pela nescessidade de termos um id dinamico, iremos criar uma nova classe para implementar está lógica na nossa aplicação 
class Bd{//parte do id 
    constructor(){
        let id = localStorage.getItem('id')//criando um item id que começa igual a 0
        if(id === null){
            localStorage.setItem('id',0)
        }
    }
    recuperarRegistros(){
        let despesas = Array()
        let id = localStorage.getItem('id') //id é a chave e ele está pegando o valor que está contido dentro dele
        for(let i = 1;i<=id;i++){ //passando o array todo e pegando os valores de cada item 
            let despesa = JSON.parse(localStorage.getItem(i))
            if(despesa !==null){
                despesa.id = i
                despesas.push(despesa)
            }
        }
        return despesas
    }
    proximoId(){
        let idproximo= localStorage.getItem('id')
        console.log(parseInt(idproximo) + 1)
        return parseInt(idproximo) + 1
    }
    //toda esta lógica foi só colocar ids que não são iguais
    gravar(d){
        let id = this.proximoId()//usou a função anterior para conseguir o próximo id, pq se tiver um sobre o outro 
        // ele acaam por se sobreescrever
        localStorage.setItem(id, JSON.stringify(d))
        localStorage.setItem('id',id)//PRECISA disso aqui, para garantir que o id de nome id será mudado
        //se não ele interpretará sempre como o mesmo id e não vai ir para o próximo item
    }
    pesquisarProd(despesaPesquisa){//aqui está a lógica da página consulta para colocar na lista somente os itens pesquisadados

        let despesasFiltradas = Array()
        despesasFiltradas = this.recuperarRegistros()//esta referenciando-se ao método da própria classe
        // console.log(p)//vai mostrar a lista que foi criada com os critérios que foram estabelecidos na outra função 
        // console.log(despesasFiltradas)//mostra a lista de todos os objetos
        if(despesaPesquisa.dia != ''){
            despesasFiltradas =despesasFiltradas.filter(d=>d.dia ==despesaPesquisa.dia) 
        }
        if(despesaPesquisa.mes != ''){
            despesasFiltradas =despesasFiltradas.filter(d=>d.mes ==despesaPesquisa.mes) 
        }
        if(despesaPesquisa.ano != ''){
            despesasFiltradas =despesasFiltradas.filter(d=>d.ano ==despesaPesquisa.ano) 
        }
        if(despesaPesquisa.tipo != ''){
            despesasFiltradas =despesasFiltradas.filter(d=>d.tipo ==despesaPesquisa.tipo) 
        }
        if(despesaPesquisa.valor != ''){
            despesasFiltradas =despesasFiltradas.filter(d=>d.valor ==despesaPesquisa.valor) 
        }
        if(despesaPesquisa.descricao != ''){
            despesasFiltradas =despesasFiltradas.filter(d=>d.descricao ==despesaPesquisa.descricao) 
        }
        return despesasFiltradas
    }
    remover(id){
        localStorage.removeItem(id)
    }
}
let bd = new Bd 

function pegandoValorDespesa(){
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia= document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao= document.getElementById('descricao')
    let valor = document.getElementById('valor')
    let despesa = new Despesa(ano.value,mes.value,dia.value,tipo.value,descricao.value,valor.value)//criou um objeto com os valores que estão na página HTML
    //precisamos gravar dentro do localStorage
    if(despesa.validaDados()){//modal caso sucesso
        let titulo= document.getElementById('titulo')
        let texto = document.getElementById('texto')
        let botao = document.getElementById('botao')
        let divAcima = document.getElementById('divTitulo')
        titulo.innerHTML = 'Certo'
        texto.innerHTML = 'suas despesas foram inseridas com sucesso'
        bd.gravar(despesa)
        $('#modalRegistraDespesa').modal('show')
        botao.className = 'btn btn-success'
        botao.innerHTML = 'Voltar'
        divAcima.className ='modal-header text-success'
    }else{//modal caso erro
        let titulo= document.getElementById('titulo')
        let texto = document.getElementById('texto')
        let botao = document.getElementById('botao')
        let divAcima = document.getElementById('divTitulo')
        titulo.innerHTML = 'errado'
        texto.innerHTML = 'suas despesas não foram inseridas com sucesso'
        bd.gravar(despesa)
        $('#modalRegistraDespesa').modal('show')
        botao.className = 'btn btn-danger'
        botao.innerHTML = 'Voltar e corrigir'
        divAcima.className ='modal-header text-danger'
    }
    ano.value = ''
    mes.value = ''
    dia.value = ''
    tipo.value = 0
    descricao.value = ''
    valor.value = ''
    despesa.value = ''
    
}
function carregaListaDespesa(despesas = Array(), filtro = false){
    if (despesas.length ==0 && filtro == false){
        despesas = bd.recuperarRegistros()
    }//para checar se não tem nenhum filtro, aí pode colocar todos os elementos da list sem problemas
    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''
    despesas.forEach(function(d){
        // criando a linha tr
        let linha  = listaDespesas.insertRow()
        //criando a coluna td
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano} `
        switch(d.tipo){
            case '1':d.tipo = 'Alimentação'
                break
            case '2':d.tipo = 'Educação'
                break
            case '3':d.tipo = 'Lazer'
                break
            case '4':d.tipo = 'Saúde'
                break
            case '5':d.tipo = 'Transporte'
                break
        }
        linha.insertCell(1).innerHTML = d.tipo

        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor
        let btn = document.createElement('button')
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class = "fas fa-times"></i>'
        btn.id = `id_despesa_${d.id}`
        btn.onclick= function(){
            let id = this.id.replace('id_despesa_','')
            bd.remover(id)
            window.location.reload()
        }
        linha.insertCell(4).append(btn)
    })

}
function pesquisar(){
    let dia = document.getElementById('dia').value
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value
    let tipo = document.getElementById('tipo').value
    let pesquisa = new Despesa(ano,mes,dia,tipo,descricao,valor)
    let pesquisaLista =bd.pesquisarProd(pesquisa)
    this.carregaListaDespesa(pesquisaLista, true)
    // //criando a linha
    // pesquisaLista.forEach((d)=>{
    //     //criando a linha (tr)
    //     let linha = tbodyPesquisa.insertRow()
    //     //criando os dados (td)
    //     linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
    //     switch(d.tipo){
    //         case '1':d.tipo = 'Alimentação'
    //             break
    //         case '2':d.tipo = 'Educação'
    //             break
    //         case '3':d.tipo = 'Lazer'
    //             break
    //         case '4':d.tipo = 'Saúde'
    //             break
    //         case '5':d.tipo = 'Transporte'
    //             break
    //     }
    //     linha.insertCell(1).innerHTML = d.tipo
    //     linha.insertCell(2).innerHTML = d.descricao
    //     linha.insertCell(3).innerHTML = d.valor
    // })

    //ele tirou todo bloco acima e colocou na função 
    //lembrete tudo que é repetido dá para melhorar
}