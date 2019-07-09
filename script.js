var difficulty = 2;
var PLAYER = "X";
var COMPUTER = "O";
var end = false;
var board = [0,0,0,0,0,0,0,0,0];

var td = document.getElementsByTagName("td");
for(i=0;i<td.length;i++){
	td[i].id = i;
	td[i].onclick = function(){
		if(this.innerHTML != "" || end)
			return false;
		this.innerHTML = PLAYER;
		board[this.id] = PLAYER;
		if((s = status(board)) != 0){
			close(s);
			return;
		}
		
		move = getMove(board);
		td[move].innerHTML = COMPUTER;
		board[move] = COMPUTER;
		if((s = status(board)) != 0){
			close(s);
			return;
		}
	};
}
function close(status){
	if(status == 0)
		return;
	end = true;
	var str;
	if(status == PLAYER)
		str = "Gratulacje, wygrałeś!";
	else if(status == COMPUTER)
		str = "Przegrałeś!";
	else
		str = "REMIS!";
	setTimeout(function(){
		if(confirm(str+"\nCzy chcesz zrestartować?"))
			restart();
	},100);
}
function restart(diff){
	if(diff != null && diff != 'undefined'){
		difficulty = diff;
		var button = document.getElementsByTagName("button");
		for(var i=0;i<button.length;i++){
			button[i].classList.remove("on");
		}
		button[difficulty-1].classList.add("on");
	}
	end = false;
	board = [0,0,0,0,0,0,0,0,0];
	for(var i=0;i<td.length;i++){
		td[i].innerHTML = "";
	}
}
function getMove(tboard){
	var move = -1;
	if(difficulty == 2){
		var is = COMPUTER;
		loop: for(var z=0;z<2;z++){
			for(var i=0;i<9;i++){
				if(tboard[i] !== 0)
					continue;
				tboard[i] = is;
				if(status(tboard) == is){
					move = i;
					tboard[i] = 0;
					break loop;
				}
				tboard[i] = 0;
			}
			is = PLAYER;
		}
	}else if(difficulty >= 3){
		move = minmax(board,0,COMPUTER);
	}
	if(move == -1 && tboard[(move = Math.floor(Math.random()*9))] !== 0)
		return getMove(tboard);
	return move;
}
function minmax(tboard,depth,player){
    if((s = status(tboard)) == 1)
        return 0;
    else if (s == PLAYER)
        return depth-10;
    else if (s == COMPUTER)
        return 10-depth;
    depth++;
    var scores = [];
    var moves = [];
	for(var i=0;i<9;i++){
        if(tboard[i] != 0)
			continue;
		tboard[i] = player;
		scores.push(minmax(tboard,depth,player == COMPUTER ? PLAYER : COMPUTER));
		moves.push(i);
		tboard[i] = 0;
    }
	return (depth == 1 ? moves : scores)[scores.indexOf(player == COMPUTER ? Math.max.apply(null, scores) : Math.min.apply(null, scores))];
}
function status(field){
	var is = PLAYER;
	for(var z=0;z<2;z++){
		for(var i=0;i<=3;i++){
			if((field[i] == is && field[i+3] == is && field[i+6] == is) || (field[i*3] == is && field[(i*3)+1] == is && field[(i*3)+2] == is))
				return is;
		}
		if((field[0] == is && field[4] == is && field[8] == is) || (field[6] == is && field[4] == is && field[2] == is))
			return is;
		is = COMPUTER;
	}
	for(var i=0;i<9;i++){
		if(field[i] == 0)
			return 0;
	}
	return 1;
}
