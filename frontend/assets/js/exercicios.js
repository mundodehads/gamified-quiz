function fecharModal(){
   $("#myModal").modal("hide");
};
count = 1;
$(document).ready(function(){
});

function prox(){
    $("#q"+count).addClass("escondido");
    count++;
    $("#q"+count).removeClass("escondido"); 
};

function fim(){
    alert("acabou");
};

var foi = 0;
function dica(){
    if (foi === 0 && confirm('Para ver a dica gaste 10 moedas')) {
        foi = 1;
        $("#dicas").removeClass("escondido");
    } else {
        // Do nothing!
    }
}

