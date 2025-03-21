// Import Firebase stuff
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
	getFirestore,
	collection,
	addDoc,
	getDocs,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyB2kruEpfYTKV6khtOstwRC6Hn3MTS82pw",
	authDomain: "micro-lessons.firebaseapp.com",
	projectId: "micro-lessons",
	storageBucket: "micro-lessons.firebasestorage.app",
	messagingSenderId: "137701896423",
	appId: "1:137701896423:web:cf0eed5b72ae93be373242",
	measurementId: "G-94FZXPPT64",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Save a lesson when the button is clicked
async function saveLesson() {
	let title = document.getElementById("title").value;
	let content = document.getElementById("content").value;
	let video = document.getElementById("video").value;
	let quiz = document.getElementById("quiz").value;

	if (title === "" || content === "") {
		alert("Yo, fill in the title and lesson text!");
		return;
	}

	let lesson = { title, content, video, quiz };

	try {
		await addDoc(collection(db, "lessons"), lesson);
		console.log("Lesson saved!");
	} catch (error) {
		console.error("Error saving lesson: ", error);
	}

	// Clear the form
	document.getElementById("title").value = "";
	document.getElementById("content").value = "";
	document.getElementById("video").value = "";
	document.getElementById("quiz").value = "";

	// Refresh the lesson list
	showLessons();
}

// Show all lessons from Firestore
async function showLessons() {
	let list = document.getElementById("lessonList");
	list.innerHTML = ""; // Clear the list first

	try {
		const querySnapshot = await getDocs(collection(db, "lessons"));
		console.log("Got lessons: ", querySnapshot.docs.length);
		querySnapshot.forEach((doc) => {
			let lesson = doc.data();
			list.innerHTML += `
        <h3>${lesson.title}</h3>
        <p>${lesson.content}</p>
        ${
					lesson.video
						? `<a href="${lesson.video}" target="_blank">Watch Video</a>`
						: ""
				}
        <p>Quiz: ${lesson.quiz}</p>
        <hr>
      `;
		});
	} catch (error) {
		console.error("Error getting lessons: ", error);
	}
}

// Add button click listener
document.querySelector("button").addEventListener("click", saveLesson);

// Load lessons when the page opens
showLessons();
