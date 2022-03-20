const storyData = './story.json';

function insertHTML(){
	return `
        <div id='mainbox'>
			<div id='spritebox' class='rightalign'>
				<img src=''>
			</div>
			<div id='namebox'>
					<span>Loading...</span>
			</div>
			<div id='textbox'>
				<p>Loading...</p>
				<div id='optionsbox'></div>
			</div>
		</div>
    `
}


const htmlData = insertHTML();
document.getElementById('StoryEngine').insertAdjacentHTML("beforebegin", htmlData);


const $textbox = document.querySelector("#textbox p");
const $optionsbox = document.querySelector('#optionsbox');
const $namebox = document.querySelector("#namebox span")
const $spritebox = document.querySelector("#spritebox img");
const $mainbox = document.querySelector('#mainbox');

let json, to;

var sceneNum = 0;
var currentScene;

async function pullData() {

	const resp = await fetch(storyData)

	json = await resp.json();
	
	currentScene = Object.keys(json.Scene1.SCENES)[sceneNum];
	
	initialize(json);
	handleOptions(json);
	
}

async function initialize(data){
	
	$spritebox.src = '';
	$namebox.innerText = '';
	$textbox.innerText = ''; 
	
	$spritebox.src = data.Characters[data.Scene1.SCENES[currentScene].Character][data.Scene1.SCENES[currentScene].Sprite];
	
	$namebox.innerText = data.Scene1.SCENES[currentScene].Character;
	
	typeWriter(data.Scene1.SCENES[currentScene].SceneText)	
	
	$mainbox.style.backgroundImage = "url(" + data.Scene1.Background + ")"; 
	
}

function handleOptions(data){

	$optionsbox.innerHTML = "";

	if(data.Scene1.SCENES[currentScene].hasOwnProperty('Options')){
		var o = data.Scene1.SCENES[currentScene].Options;
		var str = Object.keys(o).forEach(k => {
			const row = document.createElement('div');
            row.setAttribute('id','opt_id');
			row.innerHTML = `${k}`
			$optionsbox.appendChild(row);
			row.addEventListener('click', () => { 
				currentScene = (o[k]);
				sceneNum = Object.keys(json.Scene1.SCENES).indexOf(currentScene);
				initialize(json); 
				$optionsbox.innerHTML = "";
			})
			
		})
	}
	
	
}

function typeWriter(txt, i) {
	i = i || 0;
	if(!i) {
		$textbox.innerHTML = '';
		clearTimeout(to);
	}
	var speed = 10; 
	if (i < txt.length) {
		var c = txt.charAt(i++);
		if(c === ' ') c = '&nbsp;'
	    $textbox.innerHTML += c;
	    to = setTimeout(function() {
	    	typeWriter(txt, i)
	    }, speed);
	}
}

function checkScene(data){
	if(data.Scene1.SCENES[currentScene].hasOwnProperty('Options')) return false;
	if(data.Scene1.SCENES[currentScene].hasOwnProperty('NextScene')) {
		if(data.Scene1.SCENES[currentScene].NextScene == "End") return false;
	}
	
	return true;
}

document.addEventListener('keydown', (e) => {
	if(!json) return;
	if(e.key == "ArrowRight" && checkScene(json)){
		
		if(json.Scene1.SCENES[currentScene].hasOwnProperty('NextScene')){
			currentScene = json.Scene1.SCENES[currentScene].NextScene;
		}
		else {
			sceneNum++;
			currentScene = Object.keys(json.Scene1.SCENES)[sceneNum];
		}
		
		initialize(json);
		handleOptions(json);
	}
	else return;
	
})

// document.addEventListener('click', (e) => {
// 	if(!json) return;

//     // var options_exist = document.querySelector('#optionsbox');
//     var observed = document.getElementById('opt_id');
//     var observed1 = document.querySelector('opt_id');

//     console.log(observed);
//     console.log(observed1);
//     //console.log(observed.textContent);
//     if (observed === null) {
// //observed.innerHTML === "" &&
//         if(checkScene(json)){
		
//             if(json.Scene1.SCENES[currentScene].hasOwnProperty('NextScene')){
//                 currentScene = json.Scene1.SCENES[currentScene].NextScene;
//             }
//             else {
//                 sceneNum++;
//                 currentScene = Object.keys(json.Scene1.SCENES)[sceneNum];
//             }
            
//             initialize(json);
//             handleOptions(json);
//         }
//         else return;
    
//     }
	
// })


pullData();