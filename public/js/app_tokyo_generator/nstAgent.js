function runAgent(cells){
    var t=Math.floor(Math.random()* (cells.length-1));
        var c=cells[t].mp();
        debugSphere(c,1);
}