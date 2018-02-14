var locations = [], 
usedLocations = [],
arrows = 5, 
gotArrow = false,
newArrows,
paralysis = false,
terminal = document.querySelector('.console'),
types = ['MediumPurple','IndianRed','grey','gold', 'darkorange','darkred'],
triggers = [
function(){ //wumpus
    die('You got caught by the faunus', 'lose')
},
function(){ //buraco
    die("You've fallen into the endless pit", 'lose')
},
function(){ //morcegos
    locations[0].x = Math.floor(Math.random() * 5),
    locations[0].y = Math.floor(Math.random() * 5);
    color('ruby', 0);
    danger(locations[0].x, locations[0].y);
},
function(){ //flecha
    if(gotArrow===false){
        print("You've found an arrow.<br><br>");
        arrows = arrows + 1;
        gotArrow = true;
     //   console.log(gotArrow);
        print(`You now have ${arrows} arrows.<br><br>`);
    }
}
];

function print(text){
    if(paralysis!==true){
        terminal.innerHTML += text;
        terminal.scrollTop = terminal.scrollHeight;
    }
}

function hint(){
   // console.log(`Você está em ${locations[0].x}, ${locations[0].y}`);

    for(a=1;a<4;a++){
        let wX = locations[a].x, wY = locations[a].y,
        posHint = [
            [wX, wY - 1],
            [wX - 1, wY],
            [wX, wY + 1],
            [wX + 1, wY],
            [wX - 1, wY + 1],
            [wX + 1, wY + 1],
            [wX + 1, wY - 1],
            [wX - 1, wY - 1]
        ],
        calls = ['You smell a faunus', 'You feel a breeze', 'You hear flapping'];

        for(i=0;i<posHint.length;i++){
            if(locations[0].x == posHint[i][0] && locations[0].y == posHint[i][1]){
                print(`${calls[a - 1]}.<br><br>`);
            }
        }
    }
}

function die(message, type){
    if(type=='lose'){
        document.querySelector('.ruby').style.display = 'none';
        print(`${message}.<br><span style="color:#ff0000;">GAME OVER.</span> Press Enter to restart.<br><br>`);
        paralysis = true;
    }
    else{
        color('blake', 1);
        document.querySelector('.blake').style.display = 'block';
        print('<span style="color:#00FFFF;">YOU WON!</span> Press Enter to play again.<br><br>');
        paralysis = true;
    }
    window.addEventListener("keydown", function(e){
        if(e.keyCode==13){
            start(true);
        }
    });
}

function verify(x, y){
    for(i=0;i<usedLocations.length;i++){
        if(x == usedLocations[i].x && y == usedLocations[i].y){
            return true;
        }
    }
    return false;
}

function color(char, number){
        let point = document.querySelector(`.${char}`), posX = 4 + 74 * locations[number].x, posY = 3 + 75 * locations[number].y; 
        point.style.setProperty('margin', `${posY}px 0 0 ${posX}px`);
}

function change(pos, kind){
        if(kind=='minus'){
            locations[0][pos] = locations[0][pos] - 1;
        }
        else{
            locations[0][pos] = locations[0][pos] + 1;
        }
        color('ruby', 0);
}

function danger(x, y){
    for(i=1;i<5;i++){
        if(x==locations[i].x && y==locations[i].y){
            triggers[i - 1]();
        }
    }
}

function arrow(aX, aY){
    if(arrows!=0 && aX == locations[1].x && aY == locations[1].y){
        die('win')
    }

    newArrows = arrows - 1;
    arrows = newArrows;


    if(newArrows <= 0 && gotArrow===false){
        arrows = 0;
    }
    else if(newArrows == 0 && gotArrow===true){
        die('You ran out of arrows', 'lose');
    }

    if(locations[1].y==0 && arrows!=0){
        locations[1].y = locations[1].y + 4;
    }
    else if(locations[1].y > 0 && arrows!=0){
        locations[1].y = locations[1].y - 1;
    }
    
    if(locations[1].x==0 && arrows!=0){
        locations[1].x = locations[1].x + 1;
    }
    else if(locations[1].x > 0 && arrows!=0){
        locations[1].x = locations[1].x - 1;
    }

    print(`You now have ${arrows} arrows.<br><br>`);
}

function start(n){ //contar número de caçadas (mudar caçador?)
    paralysis = false;
    print(`You have ${arrows} arrows. Hunt the faunus.<br><br>`);
    document.querySelector('.ruby').style.display = 'block';

    if(n===true){
    		document.querySelector('.blake').style.display = 'none';
        terminal.innerHTML = "";
        print(`You have ${arrows} arrows. Hunt the faunus.<br><br>`);
        locations = [], usedLocations = [];
        //limpar as bolinhas
        let aside = document.querySelectorAll('aside');
        for(i=0;i<aside.length;i++){
            aside[i].style.setProperty('background', types[5]);
        }
        arrows = 5, gotArrow = false, newArrows = 0;
    }
    
    while(locations.length < 5){
        let x = Math.floor(Math.random() * 5), 
        y  = Math.floor(Math.random() * 5),
        type = types[locations.length];
    
        if(locations.length == 0){
            usedLocations.push({x, y});
            locations.push({x, y});
            continue;
        }
    
        if(verify(x, y)===true){
            continue;
        }
    
        usedLocations.push({x, y});
        locations.push({x, y});
    }
    
    for(i=0;i<locations.length;i++){
        //console.log(locations[i], types[i]);
    }

    color('ruby', 0);
    hint(locations[0].x, locations[0].y);
}

window.addEventListener("keydown", function(e){
    if(paralysis!==true){
        switch(e.keyCode){
            case 87:
                if(locations[0].y!=0){
                    change('y', 'minus');
                }
                break;
            case 65:
                if(locations[0].x!=0){
                    change('x', 'minus');
                }
                break;
            case 83:
                if(locations[0].y!=4){
                    change('y', 'more');
                }
                break;
            case 68:
                if(locations[0].x!=4){
                    change('x', 'more');
                }
                break;
            case 38:
                arrow(locations[0].x, locations[0].y - 1);
                break;
            case 37:
                arrow(locations[0].x - 1, locations[0].y);
                break;
            case 40:
                arrow(locations[0].x, locations[0].y + 1);
                break;
            case 39:
                arrow(locations[0].x + 1, locations[0].y);
                break;
            default:
                return;
        }

        danger(locations[0].x, locations[0].y);
        hint();
    }
});

print('Welcome to Hunt The Faunus! Press Enter to begin.<br><br>');
paralysis = true;
window.addEventListener("keydown", function(e){
    if(e.keyCode==13){
        start();
    }
});
