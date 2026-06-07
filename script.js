var firstClick = true;
var gDisplayText;
var gDisplayElement;
var gOptionsElement;
var gAudioElement;
var gBgAudioElement;
var gAudioSource;
var gAudioHrefs;
var gAudioButtonElement;
var gImageElement;
var gIndex;
var audioPlaying;

var prompts;
var options;
var responses;
var gImageHrefs;


function consoleTest(s) {
	console.log(s);
}

function lookingBack() {
	console.log("Looking back");
	gIndex += 1;
	if (gIndex >= gImageHrefs.length) { gIndex = 0; }
	gImageElement.src = "images/" + gImageHrefs[gIndex];
	if (audioPlaying) { toggleAudio(); }
	gAudioSource.src = "audio/" + gAudioHrefs[gIndex];
	gAudioElement.load();
}

function goHome() {
	localStorage.setItem("stayingHere", "0")
	window.location.href = "/home";
}

function stayHere() {
	console.log("Stay here");
	localStorage.setItem("stayingHere", "1");
	gDisplayElement.style.display = "none";
	gOptionsElement.style.display = "none";
	gImageElement.onclick = lookingBack;
	gImageElement.classList.add("hover_over");
	document.body.onclick = "";
}

function addOption (id, optionText, onClick) {
	let para = document.createElement("p");
	para.setAttribute("id", id);
	para.setAttribute("onclick", onClick);
	gOptionsElement.appendChild(para);
	document.getElementById(id).innerHTML = optionText;
}

function displayOptions(isOptions) {
	if (isOptions) {
		if (gIndex < 6) {
			for (let i=0; i < options[gIndex].length; i++) {
				addOption(("option" + i.toString()), options[gIndex][i], "promptResponse(" + i.toString() + ")");
			}
		}
		else{
			addOption("option0", options[gIndex][0], "goHome()");
			addOption("option1", options[gIndex][1], "stayHere()");
		}
	}
	else {
		addOption("continue", "Continue...", "startStage();");
	}
	
	gOptionsElement.style.display = "";
}

function hideOptions() {
	gOptionsElement.style.display = "none";
	gOptionsElement.innerHTML = "";
}

function typeTextRecursive(displayIndex, maxIndex, delay, isOptions) {
	if (displayIndex > maxIndex) {
		displayOptions(isOptions);
		return; 
	}
	else {
		let tempChar = gDisplayText.charAt(displayIndex);
		if (tempChar == " ") { tempChar = "&nbsp;"; }
		gDisplayElement.innerHTML += tempChar;
		setTimeout(typeTextRecursive, delay, displayIndex+1, maxIndex, delay, isOptions);
	}
}

function toggleAudio() {
	console.log("toggleAudio");
	if (firstClick) { return; }
	
	if (audioPlaying) {
		gAudioElement.pause();
		gBgAudioElement.play();
		gAudioButtonElement.innerText = "Listen";
	}
	else {
		gBgAudioElement.pause();
		gAudioElement.play();
		gAudioButtonElement.innerText = "Pause";
	}
	audioPlaying = !(audioPlaying)
	console.log("audioPlaying " + audioPlaying);
}

function promptResponse(chosenOption) {
	//Display appropriate response
	hideOptions();
	gDisplayElement.innerText = "";
	gDisplayText = responses[gIndex][chosenOption];
	
	typeTextRecursive(0, (gDisplayText.length - 1), 20, false)
}

function startStage() {
	console.log("startStage");
	gIndex += 1;
	if (gIndex >= prompts.length) {
		// Game's over
		console.log("Finished");
		return;
	}
	
	if (audioPlaying) { toggleAudio(); }
	gAudioSource.src = "audio/" + gAudioHrefs[gIndex];
	gAudioElement.load();
	
	gImageElement.src = "images/" + gImageHrefs[gIndex];
	
	console.log("gAudioSource.src " + gAudioSource.src);
	console.log("gImageElement.src " + gImageElement.src);
	
	gDisplayElement.innerText = "";
	hideOptions();
	
	gDisplayText = prompts[gIndex];
		
	typeTextRecursive(0, (gDisplayText.length - 1), 20, true);
}

function startPage() {
	console.log("startPage");
	if (firstClick) {
		
		firstClick = false;
		
		gDisplayText = "";
		gDisplayElement = document.getElementById("clickPrompt");
		gOptionsElement = document.getElementById("options");
		gAudioElement = document.getElementById("audio0");
		gBgAudioElement = document.getElementById("bgMusic");
		gAudioButtonElement = document.getElementById("audioButton");
		gAudioSource = document.getElementById("audio_source");
		gImageElement = document.getElementById("mem_image");
		gIndex = -1;
		audioPlaying = false;

		prompts = ["Are these your memories? You know you can't go back, right?", "This one's from the same day. Was it a good day?", "Look, I get it. You like this bittersweet feeling, but you have to stop looking back, it'll do you no good.", "If you keep looking back, you'll miss what's ahead.", "There's more of this to come you know? It happened once, it can happen again.", "Oh, now this one's really pushing it.", "Final chance, take my hand and come back to the present. If you stay any longer, I can't help you."];
		options = [["I know.", "I want to go back."], ["No.", "I can't remember."], ["Okay.", "I want to live in this feeling forever."], ["I want to see what's ahead.", "Who cares?"], ["Really?", "Liar."], ["I'm sorry.", "Go away."], ["Accept", "Refuse"]];
		responses = [["Good.", 'Too bad.'], ["I see...", "You can just pretend it was, no one will know."], ["I know it hurts.", "..."], ["I'm so glad.", "Stop it."], ["Of course.", "I'm so sorry."], ["It's okay.", "Don't do this."]];
		gImageHrefs = ["chelt_peace.png", "chelt_peace2.png", "langley_peace.png", "station_peace.png", "ports_peace2.jpg", "ports_peace4.jpg", "ports_peace3.jpg"];
		gAudioHrefs = ["chelt_peace.wav", "chelt_peace2.wav", "langley_peace.wav", "station_peace.wav", "ports_peace2.wav", "ports_peace4.wav", "ports_peace3.wav"];
		
		gBgAudioElement.play();
		
		if (localStorage.getItem("stayingHere") !== null) {
			if (localStorage.getItem("stayingHere") == "1") {
				gIndex = 0;
				stayHere();
				return;
			}
			else if (localStorage.getItem("stayingHere") == "0") {
				alert("You're back? Just be careful, don't get stuck here.");
			}
		}
		
		startStage();
	}
	else { return; }
}