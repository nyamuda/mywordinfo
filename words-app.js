let searchInput = document.querySelector("#search-input");
let searchButton = document.querySelector("#search-btn");
let listContainer = document.querySelector("#results-list-container");

let wordPronunciation = document.querySelector("#word-pronunciation");
let wordDefinition = document.querySelector("#word-definition");
let wordpartSpeech = document.querySelector("#word-part-speech");
let wordSynonyms = document.querySelector("#word-synonyms");
let wordTypeOf = document.querySelector("#word-typeof");
let wordExamples = document.querySelector("#word-examples");

let collapseArrow = document.querySelector("#collapse-arrow");

let totalResults = document.querySelector("#total-results");
let searchContainer = document.querySelector("#search-container");

let theWordObject = "";

let getWord = word => {
	fetch(`https://wordsapiv1.p.mashape.com/words/${word}`, {
			method: "GET",
			headers: {
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
			let resultsArray = theWordObject.results;

			//resultsArray is an array of objects
			resultsArray.forEach(val => {
				let item = document.createElement("li");
				item.innerHTML = val.definition;
				//adding an event listener to the item
				item.setAttribute("onclick", "clickSearchResult(event)");

				listContainer.appendChild(item);
			});

			collapseArrow.style.transform = "rotate(90deg)";

			//showing the total number of results
			totalResults.innerHTML = `Search Results:${listContainer.childElementCount}`;
		})
		.catch(err => {
			console.log(err);
		});
};




searchButton.addEventListener("click", () => {
	
	getWord(searchInput.value);
	
	listContainer.innerHTML = "";

	

});




//when the search results are displayed

let resultsNumber = document.querySelector("#results-number");
//keeping track of the clicks to resultsNumber block
let clicks = 0;


resultsNumber.onclick = () => {
	if (clicks == 0) {
		listContainer.style.display = "block";
		collapseArrow.style.transform = "rotate(90deg)";
		++clicks;
		console.log(clicks)
	} else {
		listContainer.style.display = "none";
		collapseArrow.style.transform = "rotate(0deg)";
		--clicks;
		console.log(clicks)
	}
};



//the function that resets every description about the word

let resetAll = (...arr) => {
	arr.forEach(val => val.innerHTML = "")
};

let fullWordBlock = document.querySelector("#full-word-block");
let searchedWord = document.querySelector("#searched-word");

//event listener for the displayed search results
let clickSearchResult = event => {
	let clickedDefinition = event.target.innerText;
	console.log(event.target.innerText);
	theWordObject.results.forEach(val => {
		if (clickedDefinition === val.definition) {
			fullWordBlock.style.display = "block";

			//display the searched word

			searchedWord.innerHTML = theWordObject["word"];

			/*since the user clicked one search result, we hide all the results to display more information about the clicked word*/
			collapseArrow.style.transform = "rotate(0deg)";
			listContainer.style.display = "none";
			clicks = 0;


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


//the introductory text

let introText=document.querySelector("#introduction");

let newIntroduction= () => {
	
}