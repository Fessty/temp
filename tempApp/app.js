const sensHead = document.querySelector('.sensors_head');
const pMessage = document.querySelector('.sensors_head p');


document.querySelector('#sens-btn').addEventListener('click', () => {
    let dataName = document.querySelector('#name_check').value;
    let dataSelect = document.querySelector('#sensor_temp').value;

    let format = document.querySelector('.errorMsg');
    let degreeName = '';


    if (dataName.length > 15) {
        format.style.display = 'block';
        return format.innerText = 'Слишком длинное наименование'
    }
    if (dataName.indexOf(' ') > -1 || dataName.length === 0) {
        format.style.display = 'block';
        return format.innerText = 'Поле не может быть пустым'
    }
    if (dataName.length < 3) {
        format.style.display = 'block';
        return format.innerText = 'Название должно быть больше 3х символов'
    } else {
        format.style.display = 'none';
    }
    if (dataSelect === '0') {
        degreeName = 'Цельсий';
    } else {
        degreeName = 'Фаренгейт';

    }

    const sensHTML = `
      <div class="content">
             <button class="close_btn"  type="button">X</button>
          <div class="input_sensor">
            <span class="nameSens"> ${dataName} (${degreeName})</span>
            <input class="sensor_input" onmouseleave="viewAver()" id="sens_inp" required type="number"  data-type-sens=${dataSelect} ">
            <div class="alert"></div>
         </div>
     </div> `;


    sensHead.insertAdjacentHTML('beforeend', sensHTML);

    function handleClick(e) {
        const currentBtn = e.currentTarget;
        currentBtn.closest('.content').remove()

    }

    let delBtns = document.querySelectorAll('.close_btn')
    console.log(delBtns)
    for (let dels of delBtns) {
        dels.addEventListener('click', handleClick)

    }
    pMessage.style.display = 'none'
    document.getElementById("sens-btn").onclick = function (e) {
        document.getElementById("name_check").value = "";
    };
});


function calcTemp(formatDegree, arraySensors) {
    let valueSum = 0;
    let average = 0;
    /*
     вытаскиваем значение типа температуры для расчета среднего значения
     вытаскиваем значение каждого датчика
     вытаскиваем значение типа каждого датчика
     проверяем значение типа датчика и выбраного типа температуры

     -перевод значений датчиков-
     если фаренг выбран при расчете и в датчике фаринг, то
     суммируем значение к имеющемуся значению
     если фаринг выбран прирасчете, а в датчике цельсий, то переводим значение датчика в фаренгейт

     если ценсий выбран при расчете и в датчике цельсий, то
        суммируем значение к имеющемуся значению
     если цельсий выбран при расчете, а в датчике фаренгейт, то переводим значение датчика в цельсий
     -конец перевода-
     -расчитываем среднее значение температуры-
     суммируем значения датчиков в т.ч. измененных и делим на количество
     */
    parseInt(formatDegree);
    for (let sensT of arraySensors) {
        //значение каждого датчика
        let valueSens = sensT[1];
        parseInt(valueSens);
        //значение типа каждого датчика
        let typeTemp = sensT[0];
        parseInt(typeTemp);
        //проверяем значение типа датчика и выбраного типа температуры
        //      -перевод значений датчиков-
        //если фаренг выбран при расчете и в датчике фаринг, то

        if (formatDegree == 1 && typeTemp == 1) {
            //суммируем значение к имеющемуся значению
            valueSum += valueSens;
        }
        //если фаринг выбран прирасчете, а в датчике цельсий,
        if (formatDegree == 1 && typeTemp == 0) {
            //то переводим значение датчика в фаренгейт
            valueSum += (valueSens * 1.8 + 32);
        }
        if (formatDegree == 0 && typeTemp == 0) {
            valueSum += valueSens;
        }
        if (formatDegree == 0 && typeTemp == 1) {
            valueSum += (valueSens - 32) / 1.8;
        }
    }
    average = valueSum / arraySensors.length;
    return average.toFixed(1);


}

function selectDegree() {
    const formatDegree = document.querySelector('#result_temp_selector').value;
    return formatDegree;
}

function viewAver() {
    let inpCheck = document.querySelector('#result');
    let inpResult = document.querySelector('#result_inp');
    //Получаем массив инпутов датчиков
    let array = document.querySelectorAll(".sensor_input");
    let arraySensors = [];
    //прогоняем массив инпутов
    for (let item of array) {
        //получаем значения аттрибутов
        let typeTemp = item.getAttribute("data-type-sens");
        let valueTemp = item.value;
        typeTemp = parseInt(typeTemp);
        valueTemp = parseInt(valueTemp);
        if (!item.value) {
            item.nextElementSibling.innerText = 'Это поле не может быть пустым!';
            item.nextElementSibling.classList.add('errorMsg');
            item.nextElementSibling.style.display = 'block';
            inpCheck.setAttribute('disabled', 'disabled');
            inpResult.value = '';
            return
        }
        if (item.value % 1 !== 0) {
            item.nextElementSibling.innerText = 'Значение должно быть целым числом!';
            item.nextElementSibling.classList.add('errorMsg');
            item.nextElementSibling.style.display = 'block';
            inpCheck.setAttribute('disabled', 'disabled');
            inpResult.value = '';
            return;
        } else {
            item.nextElementSibling.innerText = '';
            item.nextElementSibling.style.display = 'none';
            inpCheck.removeAttribute('disabled');
        }
        arraySensors.push([typeTemp, valueTemp]);

    }
    document.querySelector('#result_inp').value = calcTemp(selectDegree(), arraySensors);
}


