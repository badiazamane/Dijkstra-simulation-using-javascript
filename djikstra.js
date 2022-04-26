const alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

const canv = document.querySelector('canvas');
const context = canv.getContext('2d');
const buttonOne = document.getElementById("buttonOne");
const buttonTwo = document.getElementById("buttonTwo");

let MyGraph={};
let unvisitedVertices={};
let thePreviousvertex={};
var nodes = [];
var edges = [];
var selection = undefined;
let i=0;

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

function within(x, y) {
    return nodes.find(n => {
        return x > (n.x - n.radius) && 
            y > (n.y - n.radius) &&
            x < (n.x + n.radius) &&
            y < (n.y + n.radius);
    });
}

function move(e) {
    if (selection && e.buttons) {
        selection.x = e.x-270;
        selection.y = e.y-10;
        draw();
    }
}


function up(e) {
    if (!selection) {
        let node = {
            x: e.x-270,
            y: e.y-10,
            radius: 30,
            font :'18pt Calibri',
            fillText : alphabet[i],
            selectedFill: '#88aaaa',
            strokeStyle: '#020202',
            selected: false
        };
        console.log(node.fillText);
        nodes.push(node);
        MyGraph[nodes[i].fillText]={};
        unvisitedVertices[nodes[i].fillText]=Infinity;
        thePreviousvertex[nodes[i].fillText]=[nodes[i].fillText,0];
        
        draw();
        i+=1;
    }
    if (selection && !selection.selected) {
        selection = undefined;
    }
    draw();
}


function draw() {
    context.clearRect(0, 0, canv.width ,  canv.height);

    for (let i = 0; i < edges.length; i++) {
        let fromNode = edges[i].from;
        let toNode = edges[i].to;
        context.beginPath();
        context.strokeStyle = fromNode.strokeStyle;
        context.moveTo(fromNode.x, fromNode.y);
        context.lineTo(toNode.x, toNode.y);
        context.fillText(edges[i].random, ((fromNode.x)+(toNode.x))/2, ((fromNode.y)+(toNode.y))/2);
        context.stroke();
    }

    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        context.beginPath();
        context.fillStyle = node.selected ? node.selectedFill : node.fillStyle;
        context.arc(node.x, node.y, node.radius, 0, Math.PI * 2, true);
        context.fillStyle = "#ccc975 ";
        context.strokeStyle = node.strokeStyle;
        context.font = node.font;
        context.fillText(node.fillText, node.x-50, node.y+5);
        context.fill();
        context.stroke();
    }
}

function down(e) {
    let target = within(e.x-270, e.y-10);
    if (selection && selection.selected) {
        selection.selected = false;
    }
    if (target) {
        if (selection && selection !== target) {
            // The weight of the edges is random
            let rand = getRandomArbitrary(1,10);           
            edges.push({ from: selection, to: target ,random:rand});
            if(MyGraph.hasOwnProperty([selection.fillText]))  {
                MyGraph[selection.fillText][[target.fillText]] = rand; 
                MyGraph[target.fillText][[selection.fillText]] = rand; 
            }
        }
        selection = target;
        selection.selected = true;
        draw();
    }
}



buttonOne.addEventListener("click", function() {
    const elements = document.getElementsByClassName("reply");
    
    for (var i = 0; i < elements.length; i++){
    if (elements[i].style.display === 'none') {
        elements[i].style.display = 'block';
    } else {
        elements[i].style.display = 'none';}
    }
});

buttonTwo.addEventListener("click",function(){
    const val = document.querySelector('input').value;
    if(unvisitedVertices.hasOwnProperty(val)){
        unvisitedVertices[val]=0;
    }

    console.log("Edges : ",edges);
    console.log("MyGraph : ",MyGraph);
    console.log("Unvisited Vertices : ",unvisitedVertices);
    console.log("The Previous vertex",thePreviousvertex);



// implementation of Djikstra algorithm
function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

while (Object.keys(unvisitedVertices).length !== 0 || unvisitedVertices.constructor !== Object){
    const minDistance =Math.min.apply(Math,Object.values(unvisitedVertices));
    const currentVertex = getKeyByValue(unvisitedVertices,minDistance);
    let theNewDistance=[];
    for (let X of Object.values(MyGraph[currentVertex])) {
        theNewDistance.push(X+unvisitedVertices[currentVertex]);
    }
    let i=0;
    for(let XX of Object.keys(MyGraph[currentVertex])){
        // Edge Relaxation
        if (theNewDistance[i] < unvisitedVertices[XX]) {
            unvisitedVertices[XX]=theNewDistance[i] ;
            thePreviousvertex[XX]=[currentVertex,theNewDistance[i]] ;
        } 
        i++;
    }
    delete unvisitedVertices[currentVertex];

}

console.info("\nThe vertex   |  The previous vertex  |  The shortest distance from the start vertex ");
for (let Y of Object.keys(thePreviousvertex)){
    console.log(Y,"           |            ",thePreviousvertex[Y][0],"        |                 ",thePreviousvertex[Y][1]);
}
});

canv.onmousemove = move;
canv.onmousedown = down;
canv.onmouseup = up;

