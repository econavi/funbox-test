// получаем нужные элементы
var mainDivs = document.querySelectorAll('.product-content-js');
var maxHeight = 0;
// вычисляем самый высокий
for (var i = 0; i < mainDivs.length; i++){
    if (maxHeight < mainDivs[i].clientHeight){
        maxHeight = mainDivs[i].clientHeight;
    }
}
// задаем всем элементам высоту по самому высокому
for (var i = 0; i < mainDivs.length; i++){
    mainDivs[i].style.height = maxHeight + "px";
}
