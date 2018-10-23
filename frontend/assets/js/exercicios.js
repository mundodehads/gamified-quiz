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
