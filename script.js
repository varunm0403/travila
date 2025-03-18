//script for hero section
document.querySelectorAll('.tab-link').forEach(link => {
  link.addEventListener('click', function(event) {
      event.preventDefault();
      
      document.querySelectorAll('.tab-link').forEach(el => {
          el.classList.remove('bg-black', 'text-white');
      });

      this.classList.add('bg-black', 'text-white');
  });
});

document.addEventListener("DOMContentLoaded", async () => {
try {
const response = await fetch("config/main.json"); // Adjust path if needed
const heroData = await response.json();

if (heroData.length > 0) {
  const data = heroData[0];

  // Set Background Image
  document.querySelector(".hero-section").style.backgroundImage = `url('${data["bg-image"]}')`;

  // Set Text Content
  document.querySelector(".hero-pre-heading").textContent = data["pre-heading"];
  document.querySelector(".hero-heading").innerHTML = data["heading"];
  document.querySelector(".hero-sub-heading1").textContent = data["sub-heading1"];
  document.querySelector(".hero-sub-heading2").textContent = data["sub-heading2"];
  document.querySelector(".hero-sub-heading3").textContent = data["sub-heading3"];
}
} catch (error) {
console.error("Error loading main.json:", error);
}
});
let dataStore = {};
let selectedTab = "tours";

document.addEventListener("DOMContentLoaded", () => {
const tabButtons = document.querySelectorAll(".tab-btn");
const form = document.querySelector("form");
const resultsSection = document.getElementById("results");
const resultContainers = document.querySelectorAll(".result-card-container");

// Tab switching logic
tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tabButtons.forEach((btn) => btn.classList.remove("bg-black", "text-white"));
    button.classList.add("bg-black", "text-white");

    selectedTab = button.dataset.tab;
  });
});

// Fetch all data
Promise.all([
  fetch("config/destinations.json").then((res) => res.json()),
  fetch("config/recommended.json").then((res) => res.json()),
  fetch("config/flights.json").then((res) => res.json()),
])
  .then(([tours, hotels, flights]) => {
    dataStore = { tours, hotels, flights };
    populateInitialData();
    initializeSearchLogic(form, resultsSection, resultContainers);
  })
  .catch((error) => console.error("Error loading JSON data:", error));
});

function getMinGuests(guestString) {
const match = guestString.match(/\d+/); // Extract first number
return match ? parseInt(match[0], 10) : 0; // Convert to number or default to 0
}

function populateInitialData() {
populateCards(".destinations_card", dataStore.tours, (card, item) => {
  card.dataset.location = item.title.toLowerCase();
  card.querySelector(".destinations_image").src = item.image;
  card.querySelector(".destinations_title").textContent = item.title;
  card.querySelector(".destinations_tour").textContent = item.tours;
});

// Sort hotels by minimum guest count (ascending)
dataStore.hotels.sort((a, b) => getMinGuests(a.guests) - getMinGuests(b.guests));

populateCards(".recommended-card", dataStore.hotels, (card, item) => {
  card.dataset.guests = getMinGuests(item.guests);
  card.querySelector(".rec-tag-button").textContent = item.tag;
  card.querySelector(".rec-article-img").src = item.image;
  card.querySelector(".rec-duration").textContent = item.duration;
  card.querySelector(".rec-guests").textContent = item.guests;
  card.querySelector(".rec-rate").textContent = item.rate;
  card.querySelector(".rec-title-1").textContent = item.title1;
  card.querySelector(".rec-title-2").textContent = item.title2;
});

populateCards(".flight-card", dataStore.flights, (card, item) => {
  card.dataset.location = item.from.toLowerCase();
  card.querySelector(".flight-image").src = item.image;
  card.querySelector(".flight_date_from").textContent = item.date_from;
  card.querySelector(".flight_from").textContent = item.from;
  card.querySelector(".flight_rate").textContent = item.rate;
  card.querySelector(".flight_rate_2").textContent = item.rate;
  card.querySelector(".flight_seats").textContent = item.seats;
  card.querySelector(".flight_to").textContent = item.to;
  card.querySelector(".flight_date_to").textContent = item.date_to;
});
}

function populateCards(selector, data, callback) {
const cards = document.querySelectorAll(selector);
cards.forEach((card, index) => {
  if (data[index]) callback(card, data[index]);
});
}

function initializeSearchLogic(form, resultsSection, resultContainers) {
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const selectedLocation = document.getElementById("location").value.toLowerCase().trim();
  const selectedGuests = parseInt(document.getElementById("guests").value.trim(), 10);

  resultsSection.classList.remove("hidden");
  resultContainers.forEach((container) => container.classList.add("hidden"));

  let activeContainer = document.getElementById(`${selectedTab}-card-container`);
  if (!activeContainer) return; // If the container doesn't exist, exit

  activeContainer.classList.remove("hidden");

  const isHotels = selectedTab === "hotels"; // Hotels filter by guests, others by location
  const cards = activeContainer.querySelectorAll(
    `.${isHotels ? "recommended-card" : selectedTab === "tours" ? "destinations_card" : "flight-card"}`
  );

  let hasResults = false;

  cards.forEach((card) => {
    if (isHotels) {
      // Hotels: Filter by guests
      const cardGuests = parseInt(card.dataset.guests, 10);
      if (cardGuests === selectedGuests) {
        card.classList.remove("hidden");
        hasResults = true;
      } else {
        card.classList.add("hidden");
      }
    } else {
      // Tours & Flights: Filter by location
      const cardLocation = card.dataset.location;
      if (cardLocation === selectedLocation) {
        card.classList.remove("hidden");
        hasResults = true;
      } else {
        card.classList.add("hidden");
      }
    }
  });

  // Hide all other sections (so only selected tab is displayed)
  resultContainers.forEach((container) => {
    if (container !== activeContainer) {
      container.classList.add("hidden");
    }
  });

  // Show "No results found" message
  let noResultsMessage = activeContainer.querySelector(".no-results-message");
  if (!hasResults) {
    if (!noResultsMessage) {
      noResultsMessage = document.createElement("p");
      noResultsMessage.classList.add("no-results-message", "text-red-500");
      noResultsMessage.textContent = `No results found for ${isHotels ? "your guest preference" : "this location"}.`;
      activeContainer.appendChild(noResultsMessage);
    }
    noResultsMessage.classList.remove("hidden");
  } else if (noResultsMessage) {
    noResultsMessage.classList.add("hidden");
  }
});
}

//header
const menuToggle = document.getElementById('menuToggle');
const closeMenu = document.getElementById('closeMenu');
const mobileMenu = document.getElementById('mobileMenu');
let activeDropdown = null;

menuToggle.addEventListener('click', () => {
  mobileMenu.classList.remove('-translate-x-full');
});
closeMenu.addEventListener('click', () => {
  mobileMenu.classList.add('-translate-x-full');
});

function toggleDropdown(event, id) {
  event.stopPropagation();
  const dropdown = document.getElementById(id);
  if (activeDropdown && activeDropdown !== dropdown) {
      activeDropdown.classList.add('hidden');
  }
  dropdown.classList.toggle('hidden');
  activeDropdown = dropdown.classList.contains('hidden') ? null : dropdown;
}
document.addEventListener('click', (event) => {
  if (activeDropdown && !event.target.closest('.relative')) {
      activeDropdown.classList.add('hidden');
      activeDropdown = null;
  }
});

// document.getElementById('menu-btn').addEventListener('click', function () {
//     document.getElementById('mobile-menu').classList.toggle('hidden');
// });

document.querySelectorAll(".tab-link").forEach(link => {
            link.addEventListener("click", function() {
              document.querySelectorAll(".tab-link").forEach(l => l.classList.remove("bg-black", "text-white"));
              this.classList.add("bg-black", "text-white");
            });
});

document.addEventListener("DOMContentLoaded", function () {
  fetch("/config/recommended.json") // Fetch JSON data from external file
.then(response => response.json()) // Convert response to JSON
.then(articles => {
 const cards = document.querySelectorAll(".recommended-card");

 cards.forEach((card, index) => {
   if (articles[index]) {
     card.querySelector(".rec-tag-button").textContent = articles[index].tag;
     card.querySelector(".rec-article-img").src = articles[index].image;
     card.querySelector(".rec-duration").textContent = articles[index].duration;
     card.querySelector(".rec-guests").textContent = articles[index].guests;
     card.querySelector(".rec-rate").textContent = articles[index].rate;
     card.querySelector(".rec-title-1").textContent = articles[index].title1;
     card.querySelector(".rec-title-2").textContent = articles[index].title2;
   }
 });
})
.catch(error => console.error("Error loading JSON data:", error));
});

const extraSection = document.getElementById("rec-extraSection");
const toggleButton = document.getElementById("rec-toggleButton");

toggleButton.addEventListener("click", () => {
       if (extraSection.classList.contains("hidden")) {
           extraSection.classList.remove("hidden");
           toggleButton.textContent = "Load Less Tours";
       } else {
           extraSection.classList.add("hidden");
           toggleButton.textContent = "Load More Tours";
       }
});


document.addEventListener("DOMContentLoaded", () => {
  const scrollContainer = document.getElementById("scrollContainer");
  const scrollLeft = document.getElementById("scrollLeft");
  const scrollRight = document.getElementById("scrollRight");

  const scrollAmount = 600; // Pixels to scroll

  scrollLeft.addEventListener("click", () => {
    scrollContainer.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  });

  scrollRight.addEventListener("click", () => {
    scrollContainer.scrollBy({ left: scrollAmount, behavior: "smooth" });
  });
});

document.addEventListener("DOMContentLoaded", async () => {
const container = document.getElementById("scrollContainer");

const sections = container.querySelectorAll("section"); // Select existing sections

try {
  const response = await fetch("config/wonders.json");
  const destinations = await response.json();

  // Ensure we don't exceed the number of existing sections
  sections.forEach((section, index) => {
   

      // Select the relevant child elements
      const img = section.querySelector("img");
      const name = section.querySelector("p:nth-of-type(1)"); // First <p> tag
      const tours = section.querySelector("p:nth-of-type(2)"); // Second <p> tag

      // Update content without changing structure
      if (img) img.src = destinations[index%destinations.length].image;
      if (img) img.alt = destinations[index%destinations.length].name;
      if (name) name.innerText = destinations[index%destinations.length].name;
      if (tours) tours.innerText = destinations[index%destinations.length].tours;
    
  });

} catch (error) {
  console.error("Error loading destinations:", error);
}
});


async function fetchStats() {
  try {
      const response = await fetch("config/numbers.json"); // Update with actual JSON file path
      const data = await response.json();

      const statsContainer = document.getElementById("stats");

      const statsSection = document.createElement("section");
      statsSection.className = "mt-4 flex flex-col sm:flex-row items-center justify-center";

      data.forEach((item, index) => {
          const statBlock = document.createElement("section");
          statBlock.className = "sm:mt-2 h-[50px] flex flex-row sm:flex-col justify-center items-center space-x-4 sm:px-4";

          statBlock.innerHTML = `
              <p class="text-[#FFFFFF] font-[Manrope] font-extrabold text-lg sm:text-xl md:text-3xl lg:text-4xl xl:text-[52px] leading-[72px]">
                  ${item.figure}
              </p>
              <p class="text-[#FFFFFF] font-[Manrope] font-bold text-14px sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px] leading-[32px] sm:pt-2">
                  ${item.text}
              </p>
          `;

          statsSection.appendChild(statBlock);

          if (index !== data.length - 1) {
              const divider = document.createElement("section");
              divider.className = "w-[1px] text-[#E4E6E8] bg-[#E4E6E8] h-14 hidden sm:inline";
              statsSection.appendChild(divider);
          }
      });

      statsContainer.appendChild(statsSection);
  } catch (error) {
      console.error("Error fetching stats:", error);
  }
}

document.addEventListener("DOMContentLoaded", fetchStats);


document.addEventListener("DOMContentLoaded", function () {
  fetch("/config/flights.json") // Fetch JSON data from external file
.then(response => response.json()) // Convert response to JSON
.then(articles => {
 const cards = document.querySelectorAll(".flight-card");
 const cards1 = document.querySelectorAll(".flight-card1");

 cards.forEach((card, index) => {
   if (articles[index]) {
     card.querySelector(".flight-image").src = articles[index].image;
     card.querySelector(".flight_date_from").textContent = articles[index].date_from;
     card.querySelector(".flight_from").textContent = articles[index].from;
     card.querySelector(".flight_rate").textContent = articles[index].rate;
     card.querySelector(".flight_rate_2").textContent = articles[index].rate;
     card.querySelector(".flight_seats").textContent = articles[index].seats;
     card.querySelector(".flight_to").textContent = articles[index].to;
     card.querySelector(".flight_date_to").textContent = articles[index].date_to;
   }
 });

 cards1.forEach((card, index) => {
   if (articles[index]) {
     card.querySelector(".flight-image").src = articles[index].image;
     card.querySelector(".flight_date_from").textContent = articles[index].date_from;
     card.querySelector(".flight_from").textContent = articles[index].from;
     card.querySelector(".flight_rate").textContent = articles[index].rate;
     card.querySelector(".flight_rate_2").textContent = articles[index].rate;
     card.querySelector(".flight_seats").textContent = articles[index].seats;
     card.querySelector(".flight_to").textContent = articles[index].to;
     card.querySelector(".flight_date_to").textContent = articles[index].date_to;
   }
 });
})
.catch(error => console.error("Error loading JSON data:", error));
});

const scrollContainers = [
document.getElementById("flight_scrollContainer1"),
document.getElementById("flight_scrollContainer2")
];
const scrollLeftButton = document.getElementById("flight_scrollLeft");
const scrollRightButton = document.getElementById("flight_scrollRight");

// Function to check and update button states for all containers
function updateButtonState() {
scrollLeftButton.disabled = scrollContainers.every(container => container.scrollLeft <= 0);
scrollRightButton.disabled = scrollContainers.every(container => 
   container.scrollLeft + container.clientWidth >= container.scrollWidth
);
}

// Function to scroll both sections
function scrollBothSections(offset) {
scrollContainers.forEach(container => {
   container. scrollBy({ left: offset, behavior: "smooth" });
});

// Delay state update to allow smooth scrolling
setTimeout(updateButtonState, 300);
}

// Add event listeners to buttons
scrollRightButton.addEventListener("click", () => scrollBothSections(500));
scrollLeftButton.addEventListener("click", () => scrollBothSections(-500));

// Add event listeners to update button state on scroll
scrollContainers.forEach(container => container.addEventListener("scroll", updateButtonState));

// Initialize button states
updateButtonState();

document.addEventListener("DOMContentLoaded", async function () {
  try {
    const response = await fetch("/config/support.json"); // Adjust the path based on your file location
    const data = await response.json();

    const section = document.querySelector(".support_section"); // Target the section
    section.style.backgroundImage = `url('${data.support_bg_image}')`;

    document.querySelector(".support_1").src = data.support_1;
    document.querySelector(".support_2").src = data.support_2;

    document.querySelector(".support_best").style.backgroundImage = `url('${data.support_best}')`;
    document.querySelector(".support_explore").style.backgroundImage = `url('${data.support_explore}')`;
    document.querySelector(".support_right").style.backgroundImage = `url('${data.support_bg}')`;
  } catch (error) {
    console.error("Error loading JSON data:", error);
  }
});

//love
document.addEventListener("DOMContentLoaded", async function () {
  try {
      const response = await fetch("/config/love.json"); // Fetch JSON data from external file
      const data = await response.json(); // Convert response to JSON

      document.getElementById("love_bg").src = data.bg_image;
      document.getElementById("love_heading").innerText = data.heading;
      document.getElementById("love_subheading").innerText = data.sub_heading;
      
      const cards = document.querySelectorAll(".love_card");

      cards.forEach((card, index) => {
          if (data.cards[index]) {
              card.querySelector(".love_image").src = data.cards[index].icon;
              card.querySelector(".love_title").textContent = data.cards[index].title;
              card.querySelector(".love_content").textContent = data.cards[index].content;
          }
      });
  } catch (error) {
      console.error("Error loading JSON data:", error);
  }
});

//popdes
document.addEventListener("DOMContentLoaded", async function () {
  try {
      const response = await fetch("/config/destinations.json"); // Fetch JSON data from external file
      const articles = await response.json(); // Convert response to JSON

      const cards = document.querySelectorAll(".destinations_card");

      cards.forEach((card, index) => {
          if (articles[index]) {
              card.querySelector(".destinations_image").src = articles[index].image;
              card.querySelector(".destinations_title").textContent = articles[index].title;
              card.querySelector(".destinations_tour").textContent = articles[index].tours;
          }
      });
  } catch (error) {
      console.error("Error loading JSON data:", error);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const filters = {
    category: null,
    price: null,
    rating: null,
    duration: null
  };

  // Function to filter cards
  function filterCards() {
    document.querySelectorAll(".destinations_card").forEach(card => {
      const category = card.getAttribute("data-category");
      const price = card.getAttribute("data-price");
      const rating = card.getAttribute("data-rating");
      const duration = card.getAttribute("data-duration");

      // Check if card matches all selected filters
      const isVisible =
        (!filters.category || filters.category === category) &&
        (!filters.price || filters.price === price) &&
        (!filters.rating || filters.rating === rating) &&
        (!filters.duration || filters.duration === duration);

      card.style.display = isVisible ? "block" : "none";
    });
  }

  // Handle dropdown selection
  document.querySelectorAll(".custom-dropdown .option").forEach(option => {
    option.addEventListener("click", function () {
      const dropdown = this.closest(".custom-dropdown");
      const filterName = dropdown.querySelector(".selected").getAttribute("data-name");
      filters[filterName] = this.getAttribute("data-value");

      // Update selected value display
      dropdown.querySelector(".selected").textContent = this.textContent;

      // Apply filters
      filterCards();
    });
  });
});


//video
const apiKey = "AIzaSyDHIp4ReZByrNrh6pyUZZs5QRkChYRLPs8"; // Replace with your YouTube API Key
const searchQuery = "best travel destinations"; // Change search term as needed
const maxResults = 3; // Number of videos to fetch

document.getElementById("loadMoreBtn").addEventListener("click", function () {
fetch(
  `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&maxResults=${maxResults}&key=${apiKey}`
)
  .then((response) => response.json())
  .then((data) => {
    const grid = document.getElementById("videoGrid");

    data.items.forEach((video) => {
      const videoContainer = document.createElement("section");
      videoContainer.className =
        "bg-gray-600 rounded-[32px] overflow-hidden transition-transform duration-500 delay-300 ease-in-out hover:scale-105 hover:shadow-xl";

      videoContainer.innerHTML = `
        <iframe class="w-full" src="https://www.youtube.com/embed/${video.id.videoId}" frameborder="0" allowfullscreen></iframe>
      `;

      grid.appendChild(videoContainer);
    });
  })
  .catch((error) => console.error("Error fetching videos:", error));
});

//faqs
document.addEventListener("DOMContentLoaded", function () {
  fetch("/config/faqs.json") // Fetch JSON data
      .then(response => response.json())
      .then(articles => {
          const faqContainer = document.querySelector(".faq-container"); // Parent container
          faqContainer.innerHTML = ""; // Clear any existing content
          
          articles.forEach((article, index) => {
              // Create FAQ section dynamically
              const faqItem = document.createElement("section");
              faqItem.classList.add("faq-item", "flex", "flex-col", "w-full");

              faqItem.innerHTML = `
                  <section class="h-auto px-4 space-x-4 flex flex-row items-center justify-between border-b border-[#E4E6E8] border-[1px] p-8">
                      <section class="faq_1 flex flex-row items-center space-x-4">
                          <span class="faqs_no font-[Manrope] font-extrabold text-[28px] md:text-[44px] leading-[58px]">${article.faqs_no}</span>
                          <p class="faqs_que mr-1 font-[Urbanist] font-bold text-[16px] md:text-[24px] leading-[32px]">${article.faqs_que}</p>
                      </section>
                      <button aria-label="faqs" class="faq-toggle-button min-w-[28px] md:w-[42px] h-[42px] rounded-[4px] bg-[#000000] flex justify-center items-center">
                          <i class="fa-solid fa-plus text-[#ffffff]"></i>
                      </button>
                  </section>
                  <section class="p-4 faq_ans hidden max-w-[100%] h-auto px-4 space-x-4 flex flex-row items-center justify-between bg-[#F2F4F6] rounded-bl-[16px] rounded-br-[16px] border-b border-[#E4E6E8] border-[1px]">
                      <section class="faq_2 flex flex-row justify-center h-auto space-x-4 lg:ml-4">
                          <p class="text-justify faqs_answer mx-8 font-[Manrope] font-normal text-[18px] leading-[24px]">${article.faqs_ans}</p>
                      </section>
                  </section>
              `;

              faqContainer.appendChild(faqItem);
          });

          // **Now attach event listeners after the content is loaded**
          attachToggleEvents();
      });

  // Function to attach toggle events
  function attachToggleEvents() {
      const toggleButtons = document.querySelectorAll(".faq-toggle-button");

      toggleButtons.forEach(button => {
          button.addEventListener("click", function () {
              const answerSection = this.parentElement.nextElementSibling; // Find corresponding answer
              const icon = this.querySelector("i"); // Select icon inside the button

              // **Close all other sections first**
              document.querySelectorAll(".faq_ans").forEach(section => {
                  if (section !== answerSection) {
                      section.classList.add("hidden");
                      section.previousElementSibling.querySelector("i").classList.remove("fa-xmark");
                      section.previousElementSibling.querySelector("i").classList.add("fa-plus");
                  }
              });

              // **Toggle the clicked section**
              answerSection.classList.toggle("hidden");

              // Toggle between plus and cross icons
              icon.classList.toggle("fa-plus");
              icon.classList.toggle("fa-xmark");
          });
      });
  }
});


//news
document.addEventListener("DOMContentLoaded", async function () {
  try {
      const response = await fetch("/config/news.json"); // Fetch JSON data from external file
      const articles = await response.json(); // Convert response to JSON

      const populateNewsCards = (selector) => {
          const cards = document.querySelectorAll(selector);
          cards.forEach((card, index) => {
              if (articles[index]) {
                  card.querySelector(".tag-button").textContent = articles[index].tag;
                  card.querySelector(".article-img").src = articles[index].image;
                  card.querySelector(".date").textContent = articles[index].date;
                  card.querySelector(".duration").textContent = articles[index].duration;
                  card.querySelector(".comments").textContent = articles[index].comments;
                  card.querySelector(".title").textContent = articles[index].title;
              }
          });
      };

      // Populate both sets of news cards
      populateNewsCards(".news-card");
      populateNewsCards(".news-card1");

  } catch (error) {
      console.error("Error loading JSON data:", error);
  }
});

// Toggle extra news section
document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("news-toggleButton");
  const extraCard = document.getElementById("news-extraCard");
  const buttonText = toggleButton.querySelector(".news-button-text");

  toggleButton.addEventListener("click", function () {
      if (extraCard.classList.contains("hidden")) {
          extraCard.classList.remove("hidden"); // Show the extra section
          buttonText.textContent = "View Less"; // Change button text
      } else {
          extraCard.classList.add("hidden"); // Hide the extra section
          buttonText.textContent = "View More"; // Reset button text
      }
  });
});


document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("subscribeForm");
  const emailInput = document.getElementById("email");
  const errorMessage = document.getElementById("email-error");

  form.addEventListener("submit", function (event) {
      const email = emailInput.value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Standard email regex

      if (!emailPattern.test(email)) {
          event.preventDefault(); // Prevent form submission
          errorMessage.textContent = "Please enter a valid email address";
      } else {
          errorMessage.textContent = ""; // Clear error message if valid
      }
  });
});
//
const apiKey1 = "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"; // Replace with your OpenRouter API key
const apiUrl = "https://openrouter.ai/api/v1/chat/completions";

// Toggle chatbot visibility
function toggleChatbot() {
  const chatContainer = document.getElementById("chat-container");
  chatContainer.classList.toggle("hidden");
}

// Send message to OpenRouter API
async function sendMessage() {
  const inputElement = document.getElementById("userInput");
  const chatbox = document.getElementById("chatbox");
  
  const userMessage = inputElement.value.trim();
  if (!userMessage) return;

  // Append user message
  chatbox.innerHTML += `<section class="text-right"><span class="bg-blue-500 text-white px-3 py-1 rounded-lg">${userMessage}</span></section>`;
  inputElement.value = "";
  chatbox.scrollTop = chatbox.scrollHeight;

  try {
      const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${apiKey1}`
          },
          body: JSON.stringify({
              model: "deepseek/deepseek-chat:free",
              messages: [
                  { role: "system", content: "You are a chatbot that only answers travel-related questions. If the question is unrelated to travel, politely decline." },
                  { role: "user", content: userMessage }
              ]
          })
      });

      const data = await response.json();
      const botMessage = data.choices[0].message.content;

      // Append bot response
      chatbox.innerHTML += `<section class="text-justify text-left"><span class="text-justify px-3 py-2 rounded-lg">${botMessage}</span></section>`;
      chatbox.scrollTop = chatbox.scrollHeight;
  } catch (error) {
      console.error("Error:", error);
      chatbox.innerHTML += `<section class="text-left text-red-500">Error fetching response.</section>`;
  }
}

// Add event listener to detect Enter key press
document.getElementById("userInput").addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
      event.preventDefault(); // Prevents form submission if inside a form
      sendMessage();
  }
});

document.addEventListener("DOMContentLoaded", function () {
          const dropdowns = document.querySelectorAll(".custom-dropdown");

          dropdowns.forEach(dropdown => {
              const selected = dropdown.querySelector(".selected");
              const options = dropdown.querySelectorAll(".option");

              selected.addEventListener("click", () => {
                  dropdown.classList.toggle("active");
              });

              options.forEach(option => {
                  option.addEventListener("click", () => {
                      selected.textContent = option.textContent;
                      selected.setAttribute("data-value", option.getAttribute("data-value"));
                      dropdown.classList.remove("active");
                  });
              });

              // Close dropdown when clicking outside
              document.addEventListener("click", (e) => {
                  if (!dropdown.contains(e.target)) {
                      dropdown.classList.remove("active");
                  }
              });
          });
});




