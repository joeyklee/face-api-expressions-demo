const MODEL_URL = '../libraries/face-api/weights/';
let vid;
let expression;
let btn;
let div;
let points;
let font;

let tx = 1000;
let ty = 0;

function preload() {
  font = loadFont('fonts/IBMPlexSans-Regular.otf');
}

function setup() {
    textAlign(RIGHT);
    div = createDiv('<br> please wait while face-api models are loading...');
    
    createCanvas(320, 240).parent('myCanvas');

    points = font.textToPoints('smile', 0, 0, 80, {
        sampleFactor: 5,
        simplifyThreshold: 0
      });
    
    // use an async callback to load in the models and run the getExpression() function
    vid = createCapture(VIDEO, async () => {
            await faceapi.loadSsdMobilenetv1Model(MODEL_URL)
            await faceapi.loadFaceLandmarkModel(MODEL_URL)
            await faceapi.loadFaceRecognitionModel(MODEL_URL)
            await faceapi.loadFaceExpressionModel(MODEL_URL)
            div.elt.innerHTML = '<br>model loaded!'
            getExpression();
    }).parent('myCanvas');
    vid.size(320, 240);
    // vid.hide();
}



async function getExpression(){
    expression = await faceapi.detectAllFaces(vid.elt).withFaceExpressions()
    getExpression()
}


function draw() {
    background(200)
    // image(vid,0,0)
    // console.log(expression)
    
    if(expression){
        if(expression.length > 0){

        const {expressions} = expression[0]
        

        push();
        translate(60, height/2);
        
        if(expressions[1].probability > 0.5){
            beginShape()
            noFill();
            stroke(0)
            points.forEach(p => {
                // ellipse(p.x + random(-2, 2), p.y + random(-2, 2), 1, 1);
                curveVertex(p.x + noise(tx)*10, p.y + noise(ty)*10 )
                tx+= 0.001;
                ty+=0.005;
            });
            
            endShape()    
        } else {
            fill(0);
            noStroke();
            points.forEach(p => {
                ellipse(p.x, p.y, 1, 1);
            });
            
        }
        pop();
        
        // div.elt.innerHTML = '';
        // expressions.forEach( (item, idx) => {
        //     const {expression, probability} = item;
        //     fill(255)
        //     // text(`${expression}: ${probability}`, 20, idx*20 )
        //     textSize(12)
        //     text(`${expression}:`, 70, idx*20 + 20 )
        //     const val = map(probability, 0, 1, 0, width/2)
        //     rect(80, idx*20 +10 , val, 15)
        //     // div.elt.innerHTML += `${expression}: ${probability} <br>`
        // })
        // }


        }
    }
}