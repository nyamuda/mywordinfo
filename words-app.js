let searchInput = document.querySelector("#search-input");
let searchButton = document.querySelector("#search-btn");
let listContainer = document.querySelector("#results-list-container");

let wordPronunciation = document.querySelector("#word-pronunciation");
let wordDefinition = document.querySelector("#word-definition");
let wordpartSpeech = document.querySelector("#word-part-speech");
let wordSynonyms = document.querySelector("#word-synonyms");
let wordTypeOf = document.querySelector("#word-typeof");
let wordExamples = document.querySelector("#word-examples");


let totalResults = document.querySelector("#total-results");
let searchContainer = document.querySelector("#search-container");

let theWordObject = "";

let theArrow = document.querySelector(".toggler");


let collapseContent = document.querySelector(".collapsible-content-inner");



//THE INTRODUCTORY TEXT



let introText = document.querySelector("#introduction");

let newIntroduction = () => {
	introText.innerHTML = `Here are the definitions that are associated with the word  <span style="font-weight:bold">${theWordObject["word"]}</span>. Click them to get more information about these definitions.`
}

//THE LOADING ICON

let theLoader = document.querySelector("#loader");

let loadData = (status) => {
	if (status === "on") {
		introText.style.display = "none";
		searchContainer.style.display = "none";
		theLoader.style.display = "block";
	} else if (status === "off") {
		introText.style.display = "block";
		searchContainer.style.display = "block";
		theLoader.style.display = "none";
	}
}



//FETCHING DATA FOR THE SEARCHED WORD FROM THE WORDS API

let getWord = word => {
	fetch(`https://wordsapiv1.p.rapidapi.com/words/${word}`, {
			"method": "GET",
			"headers": {
				"x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
				"x-rapidapi-key": "3dbcf6ea40mshbabf32ffef2d4b0p12d39djsn516819e7e052"
			}
		})
		.then(result => {
			console.log(result);
			return result.json();
		})
		.then(data => {
			console.log(data);

			searchContainer.style.display = "block";


			theWordObject = data;

			listContainer.style.display = "block";
			theArrow.style.display = "block"

			let resultsArray = theWordObject.results;

			//resultsArray is an array of objects

			resultsArray.forEach(val => {
				let item = document.createElement("li");
				item.innerHTML = val.definition;
				//adding an event listener to the item
				item.setAttribute("onclick", "clickSearchResult(event)");

				listContainer.appendChild(item);
			});


			//showing the total number of results
			totalResults.innerHTML = `Search Results:${listContainer.childElementCount}`;

			//changing the introductory text
			newIntroduction()

			//turning off the loading icon
			loadData("off")
		})
		.catch(err => {
			loadData("off");

			listContainer.style.display = "none";

			theArrow.style.display = "none"


			introText.innerHTML = "<img src='images/sorry.jpg' width='50px'><span style='font-style:italic;font-size:1rem' >Sorry, no results found - try a different search selection or check your internet connection.<span>";


			introText.setAttribute("style", "display:flex;flex-direction:row;align-items:center;justify-content:center")


		});

	totalResults.innerHTML = 'Search Results:0';
};



//when the user clicks the search buttton
searchButton.addEventListener("click", event => {
	console.log(searchInput.value)

	getWord(searchInput.value);

	listContainer.innerHTML = "";

	loadData("on");

	event.preventDefault()




});






//GETTING THE AUDIO OF THE WORD FROM THE WORDNIK API

let audioIcon = document.querySelector("#audio-icon");
let wordAudio = document.querySelector("#word-audio");
let audioTag = document.querySelector("audio");

//adding an event listener for for the audioIcon

audioIcon.addEventListener("click", () => {

	wordAudio.play()
})

let AudioWordOfTheDay = word => {
	fetch(`https://api.wordnik.com/v4/word.json/${word}/audio?useCanonical=false&limit=50&api_key=rpgg239mclulm2av9j69xubyc3prhim5p7vtybblo36mj0hb7`)
		.then(result => result.json())
		.then(randomData => {
			console.log(randomData);

			let audioURL = randomData[1].fileUrl;

			wordAudio.setAttribute("src", audioURL);

			audioIcon.style.display = "block";

		})
		.catch(error => {
			console.log(error)
		})
}






//THE FUNCTION THAT RESETS EVERY DESCRIPTION ABOUT THE WORD 

let resetAll = (...arr) => {
	arr.forEach(val => val.innerHTML = "")
};

let fullWordBlock = document.querySelector("#full-word-block");
let searchedWord = document.querySelector("#searched-word");

//EVENT LISTENER FOR THE DISPLAYED SEARCH RESULTS

let clickSearchResult = event => {
	let clickedDefinition = event.target.innerText;
	console.log(event.target.innerText);
	theWordObject.results.forEach(val => {
		if (clickedDefinition === val.definition) {
			fullWordBlock.style.display = "block";

			//display the searched word

			searchedWord.innerHTML = theWordObject["word"];

			//display the audio icon of the the searched word

			AudioWordOfTheDay(theWordObject["word"]);



			//clear all the the information about the previous word using our reset function

			resetAll(wordPronunciation, wordDefinition, wordExamples, wordpartSpeech, wordSynonyms);

			let howToPronounce = theWordObject.pronunciation;

			// the value of theWordObject.pronunciation is an object with only one property-----> all
			wordPronunciation.innerHTML = howToPronounce.all;
			wordDefinition.innerHTML = val.definition;
			wordpartSpeech.innerHTML = val.partOfSpeech;

			//synonyms property value is an array.
			//also sometimes the synonyms property is not available for certain words.
			//we use the else/if statement in case if that happens
			if (val.synonyms != undefined || val.synonyms != null) {
				wordSynonyms.innerHTML = val.synonyms.join(", ");
			}


			//typeOf property value is an array
			//also sometimes the typeOf property is not available for certain words.
			//we use the else/if statement in case if that happens
			if (val.typeOf != undefined || val.typeOf != null) {
				wordTypeOf.innerHTML = val.typeOf.join(", ");
			}

			//examples property value is an array
			//also sometimes the examples property is not available for certain words.
			//we use the else/if statement in case if that happens
			if (val.examples != undefined || val.examples != null) {
				wordExamples.innerHTML = val.examples.join(", ");
			}
		}
	});
};








//GETTING THE WORD OF THE DAY FROM THE WORDNIK API

let wordDayExamples = document.querySelector("#word-day-examples");
let todayDate = document.querySelector("#the-date");
let wordOfToday = document.querySelector("#word-of-day");
let wordDayDefinition = document.querySelector("#word-day-definition");
let noteAboutWord = document.querySelector("#note-about-word");


let getDayWord = () => {
	fetch("https://api.wordnik.com/v4/words.json/wordOfTheDay?api_key=rpgg239mclulm2av9j69xubyc3prhim5p7vtybblo36mj0hb7")
		.then(result => result.json())
		.then(randomData => {
			console.log(randomData);
			//getting the date of the day
			todayDate.innerHTML = randomData.pdd;

			//getting the word of that day

			wordOfToday.innerHTML = randomData.word;


			//where the word come from
			noteAboutWord.innerHTML = randomData.note;

			//the definiton of the word

			wordDayDefinition.innerHTML = `<span style="font-weight:bold">Definition:</span><br>${randomData.definitions[0].text}`;

			//adding some examples of the use of the word

			//the examples property value is an array of objects
			wordDayExamples.innerHTML = "<p style='font-weight:bold'>Examples:</p>"
			randomData.examples.forEach(val => {
				let newExample = document.createElement("p");
				newExample.innerHTML = val.text;

				wordDayExamples.appendChild(newExample)

			})

			console.log(wordDayExamples)

		})
		.catch(error => {
			console.log(error)
		})

}

getDayWord();
