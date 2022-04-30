window.onload = function(){

    let taskList = document.getElementById('lista-tarefas');
    let textImput = document.getElementById('texto-tarefa');
    textImput.focus();

    //Verifica se existem valores salvos no localStorage, caso sim, cria li`s e exibe na tela
    if(localStorage.length > 0){

        //"-1" pois o ultimo index é resevado a um array de index's com das tags com class 'completed'
        for(i = 0; i < localStorage.length - 1; i += 1){

            let itemList = document.createElement('li');
            itemList.classList.add('item-lista');
            itemList.innerText = localStorage.getItem(i);

            taskList.appendChild(itemList);
        };

        //Converte string retornada p/ um array de index's e add class 'completed' e style.texDecoration aos respectivos index's do array
        let lastIndexLocalStorag = localStorage.getItem('indexArrayCompletedList').split(',');

        if(localStorage.getItem('indexArrayCompletedList') !== ''){

            for(i = 0; i < lastIndexLocalStorag.length; i += 1){

                let index = parseInt(lastIndexLocalStorag[i]);
                let classItem = document.querySelectorAll('.item-lista');

                classItem[index].classList.add('completed');
                classItem[index].style.textDecoration = 'line-through solid black';
            };
        };
    };

    document.getElementById('criar-tarefa').addEventListener('click', createItemList);

    //Cria e adiciona itens a lista de tarefa e esvazia o input
    function createItemList(){

        let itemList = document.createElement('li');
        itemList.classList.add('item-lista');
        itemList.innerText = textImput.value;

        taskList.appendChild(itemList);

        textImput.value = '';
        textImput.focus();
    };

    //Adiciona backgroundColor 'gray' ao item da lista que for selecionado com 'click'
    document.addEventListener('click', function(event){

        if(event.target.classList.contains('item-lista')){

            let classItem = document.getElementsByClassName('item-lista');

            //Remove backgroundColor de todos 'item-lista'antes de adicionar
            for(i = 0; i < classItem.length; i += 1){
                classItem[i].style.backgroundColor = '';
            };

            event.target.style.backgroundColor = 'gray';

            removeClassSelected();
            event.target.classList.add('selected');
        };
    });

    //Remove class 'selected' de todos os 'item-lista'
    function removeClassSelected(){

        let listClass = document.getElementsByClassName('item-lista');

        for(i = 0; i < listClass.length; i += 1){
            listClass[i].classList.remove('selected');
        };
    };

    //Adiciona o style "riscado" ao clicar duas vezes em um item da lista
    document.addEventListener('dblclick', function(event){

        if(event.target.classList.contains('item-lista')){

            if(event.target.classList.contains('completed')){
                event.target.classList.remove('completed');
                event.target.style.textDecoration = '';
            }else{
                event.target.classList.add('completed');
                event.target.style.textDecoration = 'line-through solid black';
            };
        };
    });

    //Remove todos os itens da lista
    document.getElementById('apaga-tudo').addEventListener('click', function(){

        while(taskList.hasChildNodes()){
            taskList.removeChild(taskList.firstChild);
        };
    });

    //Remove somente os itens que possuem class 'completed' (itens "riscados")
    document.getElementById('remover-finalizados').addEventListener('click', function(){

        let classItem = document.getElementsByClassName('item-lista');
        
        let indexRemove = []; //Verifico quais index's contém a class 'completed' e adiciono a um array
        for(i = 0; i < classItem.length; i += 1){
            if(classItem[i].classList.contains('completed')){
                indexRemove.push(i);
            };
        };
        
        //Removo o item no index referentes aos valores do array 'indexRemove', porém decremento a variavel count, pois a cada passagem do for, os index's vão ocupar os valores dos index's anteriormente removidos
        let count = 0;
        for(j of indexRemove){
            taskList.removeChild(classItem[j - count]);
            count += 1;
        };
    });

    //Salvar a lista adicionada no localStorage, em raso de refresh da pagina, a lista permanece inalterada
    document.querySelector('#salvar-tarefas').addEventListener('click', function(){

        let arrayCompletedItens = [];//Armazena o index das class que possuem 'completed'
        
        localStorage.clear();
        
        let fullList = document.querySelectorAll('.item-lista');

        for(i = 0; i < fullList.length; i += 1){
            localStorage.setItem(i, fullList[i].innerText);

            if(fullList[i].classList.contains('completed')){
                arrayCompletedItens.push(i);
            };
        };

        //Armazena o arrayCompletedItens na ultima posição do localStorage
        if(localStorage.length > 0){
            localStorage.setItem('indexArrayCompletedList', arrayCompletedItens);
        };
    });
    //Botão para mover o item com class 'selected' para cima
    document.getElementById('mover-cima').addEventListener('click', function(){

        let classItemLista = document.getElementsByClassName('item-lista'); 
        
        //Busca na lista de itens, qual o index do elemento que possui a class 'selected'
        let indexSelected;
        for(i = 0; i < classItemLista.length; i += 1){
            if(classItemLista[i].classList.contains('selected')){
                indexSelected = i;
            };  
        };
        //Verifica se o indexSelected é diferente de 0 p/ q não seja feita a tentativa de mover o primeiro item para cima e se o mesmo e diferente de undefined pois não sendo selecionado nenhum item, nãp haverá valor de index
        if(indexSelected !== 0 && indexSelected !== undefined){
            //Armazena todas as propriedades do item acima do que possui a class 'selected'
            let itemUp = {
                htmlValue: classItemLista[indexSelected - 1].innerHTML,
                allClass: classItemLista[indexSelected - 1].getAttribute('class'),
            };
            //Armazena todas as propriedades do item que possui a class 'selected'
            let itemBottom = {
                htmlValue: classItemLista[indexSelected].innerHTML,
                allClass: classItemLista[indexSelected].getAttribute('class').split(' '),
            };

            //Adiciona o valor de innerHTML ao item de cima
            classItemLista[indexSelected - 1].innerHTML = itemBottom.htmlValue;
            //Se o item de cima possuir class 'completed', estiver "riscado" e o de baixo não, inverte as propiedades
            if(classItemLista[indexSelected - 1].classList.contains('completed') === true && classItemLista[indexSelected].classList.contains('completed') === false){
                classItemLista[indexSelected - 1].classList.remove('completed');
                classItemLista[indexSelected - 1].style.textDecoration = '';
    
                classItemLista[indexSelected].classList.add('completed');
            //Se o item de cima não possuir class 'completed', não estiver "riscado" e o de baixo sim, remove a propiedade do de baixo
            }else if(classItemLista[indexSelected - 1].classList.contains('completed') === false && classItemLista[indexSelected].classList.contains('completed') === true){
                classItemLista[indexSelected].style.textDecoration = '';
            };
            //Se ambos os itens tiverem class 'completed'
            if(classItemLista[indexSelected - 1].classList.contains('completed') === true && classItemLista[indexSelected].classList.contains('completed') === true){
                for(i = 1; i < itemBottom.allClass.length; i += 1){
                    //Adiciona todas as class que o item de baixo possui ao item de cima e remove apenas a class 'selected' do item de baixo
                    classItemLista[indexSelected - 1].classList.add(itemBottom.allClass[i]);
                    classItemLista[indexSelected].classList.remove('selected');
                };
            }else{//Caso contrario inverto as classes
                for(i = 1; i < itemBottom.allClass.length; i += 1){
                    classItemLista[indexSelected - 1].classList.add(itemBottom.allClass[i]);
                    classItemLista[indexSelected].classList.remove(itemBottom.allClass[i]);
                };
            };
            //Chama a função que adiciona a propriedade textDecoration ao itens que possuirem a class 'completed'
            linethrough(classItemLista);
            //Adiciona o valor do item de cima ao item de baixo/selecionado
            classItemLista[indexSelected].innerHTML = itemUp.htmlValue;
            //Procura na lista de <li> qual possui a class 'selected' e adicona back-groundcolor 'gray' e remove das demais, que não possuem a classe
            for(i = 0; i < classItemLista.length; i += 1){
                if(classItemLista[i].classList.contains('selected')){
                    classItemLista[i].style.backgroundColor = 'grey';
                }else{
                    classItemLista[i].style.backgroundColor = '';
                };
            };  
        };
    });
    //Botão para mover o item com class 'selected' para baixo
    document.getElementById('mover-baixo').addEventListener('click', function(){

        let classItemLista = document.getElementsByClassName('item-lista'); 
        
        //Busca na lista de itens, qual o index do elemento que possui a class 'selected'
        let indexSelected;
        for(i = 0; i < classItemLista.length; i += 1){
            if(classItemLista[i].classList.contains('selected')){
                indexSelected = i;
            };  
        };
        //Verifica se o indexSelected é diferente do ultimo valor de index da lista de <li> p/ q não seja feita a tentativa de mover o ultimo item para baixo e se o mesmo e diferente de undefined pois não sendo selecionado nenhum item, nãp haverá valor de index
        if(indexSelected !== classItemLista.length - 1 && indexSelected !== undefined){
            //Armazena todas as propriedades do item que possui a class 'selected'
            let itemUp = {
                htmlValue: classItemLista[indexSelected].innerHTML,
                allClass: classItemLista[indexSelected].getAttribute('class').split(' '),
            };
            //Armazena todas as propriedades do item abaixo do que possui a class 'selected'
            let itemBottom = {
                htmlValue: classItemLista[indexSelected + 1].innerHTML,
                allClass: classItemLista[indexSelected + 1].getAttribute('class'),
            };

            //Adiciona o valor de innerHTML ao item de baixo
            classItemLista[indexSelected + 1].innerHTML = itemUp.htmlValue;
            //Se o item de baixo possuir class 'completed', estiver "riscado" e o de baixo não, inverte as propiedades
            if(classItemLista[indexSelected + 1].classList.contains('completed') === true && classItemLista[indexSelected].classList.contains('completed') === false){
                classItemLista[indexSelected + 1].classList.remove('completed');
                classItemLista[indexSelected + 1].style.textDecoration = '';
    
                classItemLista[indexSelected].classList.add('completed');
            //Se o item de baixo não possuir class 'completed', não estiver "riscado" e o de cima sim, remove a propiedade do de cima
            }else if(classItemLista[indexSelected + 1].classList.contains('completed') === false && classItemLista[indexSelected].classList.contains('completed') === true){
                classItemLista[indexSelected].style.textDecoration = '';
            };
            //Se ambos os itens tiverem class 'completed'
            if(classItemLista[indexSelected + 1].classList.contains('completed') === true && classItemLista[indexSelected].classList.contains('completed') === true){
                for(i = 1; i < itemUp.allClass.length; i += 1){
                    //Adiciona todas as class que o item de cima possui ao item de baixo e remove apenas a class 'selected' do item de cima
                    classItemLista[indexSelected + 1].classList.add(itemUp.allClass[i]);
                    classItemLista[indexSelected].classList.remove('selected');
                };
            }else{//Caso contrario inverto as classes
                for(i = 1; i < itemUp.allClass.length; i += 1){
                    classItemLista[indexSelected + 1].classList.add(itemUp.allClass[i]);
                    classItemLista[indexSelected].classList.remove(itemUp.allClass[i]);
                };
            };
            //Chama a função que adiciona a propriedade textDecoration ao itens que possuirem a class 'completed'
            linethrough(classItemLista);
            //Adiciona o valor do item de baixo ao item de cima/selecionado
            classItemLista[indexSelected].innerHTML = itemBottom.htmlValue;
            //Procura na lista de <li> qual possui a class 'selected' e adicona back-groundcolor 'gray' e remove das demais, que não possuem a classe
            for(i = 0; i < classItemLista.length; i += 1){
                if(classItemLista[i].classList.contains('selected')){
                    classItemLista[i].style.backgroundColor = 'grey';
                }else{
                    classItemLista[i].style.backgroundColor = '';
                };
            };
        };  
    });

    //Adiciona a propriedade textDecoration ao itens que possuirem a class 'completed'
    function linethrough(classItem){
        for(i = 0; i < classItem.length; i += 1){
            if(classItem[i].classList.contains('completed')){
                classItem[i].style.textDecoration = 'line-through solid black';
            };
        };
    };
    //Remove o item selecionado
    document.querySelector('#remover-selecionado').addEventListener('click', function(){
        let allItemList = document.querySelectorAll('.item-lista');
        let index;
        //Captura o index que possui a class 'selected' p depois remover o item no respectivo index
        for(let i = 0; i < allItemList.length; i += 1){         
            if(allItemList[i].classList.contains('selected')){
              index = i;  
            };
        };   
        taskList.removeChild(allItemList[index]);
    });  
};