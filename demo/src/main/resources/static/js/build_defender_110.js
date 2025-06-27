function resetSaveState110() {
    isBuildSaved = false;
    updateSaveButtonUI110(false);
}


async function saveBuild110() {
    const buttons = document.querySelectorAll('.save-build-btn');

    if (!isBuildSaved) {
        // Save build
        const buildData = {
            model: selectedModel,
            color: selectedColor,
            finish: selectedFinish,
            wheel: selectedWheel,
            trim: selectedTrim,
            interior: selectedInterior,
            headlining: selectedHeadlining,
            brakeCalipers: selectedBrakeCalipers
        };
        console.log("Saving build with data:", buildData);

        // Get CSRF token and header name from meta tags
        const csrfToken = document.querySelector('meta[name="_csrf"]')?.getAttribute('content');
        const csrfHeader = document.querySelector('meta[name="_csrf_header"]')?.getAttribute('content');

        console.log("CSRF Token:", csrfToken);
        console.log("CSRF Header:", csrfHeader);

        try {
            const response = await fetch('/test/save-build', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    [csrfHeader]: csrfToken
                },
                body: JSON.stringify(buildData)
            });

            if (response.ok) {
                console.log('Build saved successfully');
                isBuildSaved = true;
                updateSaveButtonUI110(true);
            } else {
                console.error('Failed to save build');
            }
        } catch (error) {
            console.error('Error saving build:', error);
        }
    }
}


async function fetchSavedBuilds110() {
try {
    const response = await fetch('/test', {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    });

    if (!response.ok) throw new Error('Failed to load builds');
    const builds = await response.json();
    renderBuilds110(builds);
} catch (err) {
    console.error("Error fetching builds:", err);
}
}


function renderBuilds110(builds) {
const container = document.getElementById('builds-list');
container.innerHTML = '';

builds.forEach((build, index) => {
    const card = document.createElement('div');
    card.className = 'p-4 border border-gray-300 rounded-lg shadow hover:shadow-md transition bg-white relative';

    card.innerHTML = `
        <button class="absolute top-2 right-2 text-red-500 hover:text-red-700 text-lg font-bold delete-btn" title="Delete Build">&times;</button>
        <h4 class="text-sm font-bold mb-2 cursor-pointer">Build ${index + 1}</h4>
        <ul class="text-xs text-gray-700 leading-tight space-y-1 cursor-pointer">
            <li><strong>Model:</strong> ${build.model}</li>
            <li><strong>Color:</strong> ${build.color}</li>
            <li><strong>Finish:</strong> ${build.finish}</li>
            <li><strong>Wheel:</strong> ${build.wheel}</li>
            <li><strong>Trim:</strong> ${build.trim}</li>
            <li><strong>Interior:</strong> ${build.interior}</li>
            <li><strong>Headlining:</strong> ${build.headlining}</li>
            <li><strong>Brake Calipers:</strong> ${build.brakeCalipers || 'N/A'}</li>
        </ul>
    `;

    const handleBuildClick = () => {
localStorage.setItem('selectedBuild', JSON.stringify(build));
toggleBuildsModal110(); // close modal
applyBuild110(build);   // apply immediately without reload
};

card.querySelector('h4').addEventListener('click', handleBuildClick);
card.querySelector('ul').addEventListener('click', () => {
    localStorage.setItem('selectedBuild', JSON.stringify(build));

    // Redirect based on model
    const model = build.model
    console.log("defender 110", model)
    let targetUrl = "/build_your_own"; // default fallback

    if (model === "Defender 110") targetUrl = "/build_defender_110";
    else if (model === "Defender 110") targetUrl = "/build_defender_110";
    else if (model === "Defender 130") targetUrl = "/build_defender_130";

    window.location.href = targetUrl;
});

    // Delete button
    const deleteBtn = card.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', async (e) => {
        e.stopPropagation(); // prevent card click

        if (!confirm("Are you sure you want to delete this build?")) return;

        try {
            const csrfToken = document.querySelector('meta[name="_csrf"]')?.getAttribute('content');
            const csrfHeader = document.querySelector('meta[name="_csrf_header"]')?.getAttribute('content');

            const response = await fetch('/test/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    [csrfHeader]: csrfToken
                },
                body: JSON.stringify(build)
            });

            if (response.ok) {
                console.log("Build deleted successfully");
                // Re-fetch builds after delete
                fetchSavedBuilds110();
            } else {
                console.error("Failed to delete build");
            }
        } catch (err) {
            console.error("Error deleting build:", err);
        }
    });

    container.appendChild(card);
});
}


window.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('selectedBuild');
    if (saved) {
        try {
            const build = JSON.parse(saved);
            if (build.model === "Defender 110") {
                applyBuild110(build);
            } // This function should apply the customizations
            localStorage.removeItem('selectedBuild');
        } catch (e) {
            console.error("Invalid build format from storage", e);
        }
    } else {
        //  Default-select Wheel1 if no saved build
        const defaultWheel = document.querySelector('.wheel-thumb-wrapper[data-wheel="Wheel1"]');
        if (defaultWheel) {
            updateConfig110('wheels', 'Wheel1', defaultWheel);
        }
    }

    // Optionally initialize default brake caliper selection if needed
    if (!isBuildApplied) {
        const selectedBrake = document.querySelector('.brake-thumb-wrapper[data-selected="true"]');
        if (selectedBrake) {
            const text = selectedBrake.querySelector('p')?.innerText.trim();
            updateConfig90('brake', text, selectedBrake);
        }
    }
});


function toggleBuildsModal110() {
    const modal = document.getElementById('savedBuildsModal');
    if (modal.classList.contains('hidden')) {
        modal.classList.remove('hidden');
        fetchSavedBuilds110(); // load builds when opening
    } else {
        modal.classList.add('hidden');
    }
}

function applyBuild110(build) {

    // 1. Apply Exterior Color
    const colorEl = document.querySelector(`[title="${build.color}"]`);
    if (colorEl) {
        selectColor110(colorEl, build.color);
    } else {
        console.warn("Color not found:", build.color);
    }

    // 2. Apply Finish Type
    const finishBtn = [...document.querySelectorAll('.finish-btn')]
        .find(btn => btn.textContent.trim().toLowerCase() === build.finish.toLowerCase());
    if (finishBtn) {
        selectFinish110(finishBtn, build.finish);
    } else {
        console.warn("Finish not found:", build.finish);
    }

    // 3. Apply Wheels
    const wheelEl = document.querySelector(`.wheel-thumb-wrapper[data-wheel="${build.wheel}"]`);
    if (wheelEl) {
        selectedWheel = build.wheel;
        updateConfig110('wheels', build.wheel, wheelEl);
    }

    // 4. Apply Brake Calipers
    if (build.brakeCalipers) {
        const brakeEl = [...document.querySelectorAll('.brake-thumb-wrapper')]
            .find(el => el.textContent.trim().includes(build.brakeCalipers));
        if (brakeEl) {
            updateConfig110('brake', build.brakeCalipers, brakeEl);
        } else {
            console.warn("Brake caliper not found:", build.brakeCalipers);
        }
    }

    // 5. Apply Trim (this controls which interior options are visible)
    selectTrim110(build.trim);

    // 6. Apply Interior and Headlining after DOM updates from trim
    setTimeout(() => {
        // Interior
        const interiorOption = [...document.querySelectorAll('.interior-option')]
            .find(opt => opt.getAttribute('onclick')?.includes(build.interior));
        if (interiorOption) {
            selectInteriorOption110(interiorOption, build.interior);
        } else {
            console.warn("Interior option not found:", build.interior);
        }

        // Headlining
        const headliningOption = [...document.querySelectorAll('.headlining-option')]
            .find(opt => opt.textContent.toLowerCase().includes(build.headlining.replace(/_/g, ' ').toLowerCase()));
        if (headliningOption) {
            headliningOption.click();
        } else {
            console.warn("Headlining not found:", build.headlining);
        }

        updateMappedImages110();
        updateInteriorImage110();
    }, 100); // Slight delay to ensure UI updates

    resetSaveState110();
}





function updateSaveButtonUI110(saved) {
    const buttons = document.querySelectorAll('.save-build-btn');
    buttons.forEach(button => {
        button.setAttribute('data-selected', saved.toString());
        if (saved) {
            button.classList.add('bg-black', 'text-white');
            button.classList.remove('bg-white', 'text-black');
            button.textContent = "Saved";
        } else {
            button.classList.add('bg-white', 'text-black');
            button.classList.remove('bg-black', 'text-white');
            button.textContent = "Save Build";
        }
    });
}

let selectedModel = 'Defender 110';
function changeModel110(button, imageFileName, modelName) {
    selectedModel = modelName;

    // Update image
    const image = document.getElementById('modelImage');
    if (image) {
        image.src = `/images/${imageFileName}`;
        image.alt = modelName;
    }

    // Highlight selected button
    document.querySelectorAll('.model-button').forEach(btn => {
        btn.classList.remove('bg-black', 'text-white');
        btn.classList.add('bg-white', 'text-black');
    });

    button.classList.remove('bg-white', 'text-black');
    button.classList.add('bg-black', 'text-white');

    // Update any dependent UI
    updateMappedImages110();
    resetSaveState110();
}

// // Optional: Set default selection on page load
// window.addEventListener('DOMContentLoaded', () => {
//     const defaultButton = document.getElementById('defender90Btn');
//     if (defaultButton) {
//         defaultButton.click();  // Trigger changeModel90
//     }
// });




function nextSlide110() {
    const slides = document.querySelectorAll('#imageSlider .slide');
    const totalSlides = slides.length;
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlider110();
}

function prevSlide110() {
    const slides = document.querySelectorAll('#imageSlider .slide');
    const totalSlides = slides.length;
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateSlider110();
}

let selectedColor = 'Borasco Grey';
let selectedFinish = 'Gloss Finish';
function selectColor110(el, colorName) {
    selectedColor = colorName;

   
    document.querySelectorAll(".color-circle div").forEach(dot => {
        dot.classList.remove("border-black");
        dot.classList.add("border-gray-400");
    });

    // Add black border to selected
    const dot = el.querySelector("div");
    dot.classList.remove("border-gray-400");
    dot.classList.add("border-black");

    // Update shared text
    if (colorName !== "Borasco Grey") {
        document.getElementById("selected-color-name").textContent = colorName;
    } else {
        document.getElementById("selected-color-name").textContent = "";
    }

    updateMappedImages110();
    resetSaveState110();
}

function selectFinish110(button, finishName) {
    selectedFinish = finishName;

    document.querySelectorAll(".finish-btn").forEach(btn => {
        btn.classList.remove("bg-black", "text-white", "border-black");
        btn.classList.add("text-gray-800", "border-gray-400");
    });

    button.classList.remove("text-gray-800", "border-gray-400");
    button.classList.add("bg-black", "text-white", "border-black");

    document.getElementById("selected-finish-type").textContent = finishName;

    // Add this line for debugging
    console.log('Finish selected:', finishName);

    updateMappedImages110();
    resetSaveState110();
}

function updateMappedImages110() {
    console.log('Updating images for:', selectedModel, selectedColor, selectedFinish, selectedWheel, selectedInterior);

    const map = imageMap[selectedModel]?.[selectedColor]?.[selectedFinish]?.[selectedWheel];
    if (!map) {
        console.warn('Image map not found for:', selectedModel, selectedColor, selectedFinish, selectedWheel);
        return;
    }

    const imgs = document.querySelectorAll('#imageSlider .slide img');
    ['slide1', 'slide2', 'slide3', 'slide4'].forEach((key, i) => {
        if (imgs[i] && map[key]) {
            console.log(`Updating slide ${i} with:`, map[key]);
            imgs[i].src = map[key];
            imgs[i].alt = `${selectedModel} - ${selectedColor} - ${selectedFinish} - ${selectedWheel} - ${key}`;
        }
    });

}

const wheelNameMap = {
    'Wheel1': '20" Style 1086 - Satin Dark Tint',
    'Wheel2': '22" Style 7026 - Diamond Turned',
    'Wheel3': '22" Style 7026 - Gloss Black'
};
let selectedWheel = wheelNameMap['Wheel1'];
let selectedBrakeCalipers = 'Phosphor Bronze front brake calipers';

function updateConfig110(category, value, el) {
    if (category === 'wheels') {
    document.querySelectorAll('.wheel-thumb-wrapper').forEach(div => {
        div.classList.remove('border-black');
        div.classList.add('border-gray-300');
    });

    el.classList.remove('border-gray-300');
    el.classList.add('border-black');

    // Save the data-wheel value instead of label
    selectedWheel = el.getAttribute('data-wheel') || 'Wheel1';

    // Visual name update remains
    const displayText = wheelNameMap[selectedWheel] || selectedWheel;
    document.getElementById('wheels-name').textContent = displayText;

    updateMappedImages110();
    resetSaveState110();
}


    if (category === 'brake') {
        document.querySelectorAll('.brake-thumb-wrapper').forEach(div => {
            div.classList.remove('border-black');
            div.classList.add('border-gray-300');
        });

        el.classList.remove('border-gray-300');
        el.classList.add('border-black');

        selectedBrakeCalipers = value;
        resetSaveState110();
    }

    console.log(`Updated ${category}: ${value}`);
}


window.addEventListener('DOMContentLoaded', () => {
    const selectedBrake = document.querySelector('.brake-thumb-wrapper[data-selected="true"]');
    if (selectedBrake) {
        const text = selectedBrake.querySelector('p')?.innerText.trim();
        updateConfig110('brake', text, selectedBrake);
    }
});


let selectedTrim = 'semi-aniline'; // default
let selectedInterior = 'burnt_sienna'; // default

function selectTrim110(type) {
const semi = document.getElementById('trim-options-semi-aniline');
const ultra = document.getElementById('trim-options-ultrafabric');

if (type === 'semi-aniline') {
    semi.classList.remove('hidden');
    ultra.classList.add('hidden');
} else {
    ultra.classList.remove('hidden');
    semi.classList.add('hidden');
}

// Reset UI of trim buttons
document.querySelectorAll('.trim-btn').forEach(btn => {
    btn.classList.remove('bg-black', 'text-white');
    btn.classList.add('text-gray-800');
});
document.getElementById(`trim-${type}`).classList.add('bg-black', 'text-white');

selectedTrim = type;
resetSaveState110();
}

window.addEventListener('DOMContentLoaded', () => {
const defaultBrake = [...document.querySelectorAll('.brake-thumb-wrapper')].find(div =>
    div.textContent.trim().includes('Phosphor Bronze')
);

if (defaultBrake) {
    updateConfig110('brake', selectedBrakeCalipers, defaultBrake);
}
});
function selectInteriorOption110(el, value) {
    document.querySelectorAll('.interior-option').forEach(option => {
        option.classList.remove('border-black');
        option.classList.add('border-gray-300');
    });

    el.classList.remove('border-gray-300');
    el.classList.add('border-black');

    selectedInterior = value; // <-- store current selection globally
    console.log("selectedInterior: ",selectedInterior)
    console.log("Interior selected:", value);
    updateInteriorImage110();
    resetSaveState110();
}

function scrollToBuildsAndLoad110(event) {
event.preventDefault();
const buildsSection = document.getElementById('builds');
if (buildsSection) {
    buildsSection.scrollIntoView({ behavior: 'smooth' });
    fetchAndDisplayBuilds110();
}
}

function updateInteriorImage110() {
    const trimType = document.getElementById('trim-options-semi-aniline').classList.contains('hidden')
        ? 'ultrafabric'
        : 'semi-aniline';

    const interiorSlides = imageMap[selectedModel]?.interiorImages?.[trimType]?.[selectedInterior];
    console.log("Trim Type:", trimType);
    console.log("Selected Model:", selectedModel);
    console.log("Selected Interior:", selectedInterior);
    console.log("Interior Slides:", interiorSlides);
    console.log(imageMap['Defender 110'].interiorImages['semi-aniline']['burnt_sienna']);

    if (interiorSlides) {
        const imgs = document.querySelectorAll('#imageSlider .slide img');
        console.log("Image nodes found:", imgs.length); // should be at least 6

        // Check for headlining override
        const headliningKey = selectedHeadlining?.toLowerCase().replace(/\s+/g, '_');
        const headliningSlides = interiorSlides.headliningImages?.[headliningKey];

        // Slide 5
        if (imgs[4]) {
            if (headliningSlides?.slide5) {
                imgs[4].src = headliningSlides.slide5;
                imgs[4].alt = `${headliningKey} - Headlining Dashboard`;
            } else if (interiorSlides.slide5) {
                imgs[4].src = interiorSlides.slide5;
                imgs[4].alt = `${trimType} - ${selectedInterior} - Interior View 1`;
            }
        }

        // Slide 6
        if (imgs[5]) {
            if (headliningSlides?.slide6) {
                imgs[5].src = headliningSlides.slide6;
                imgs[5].alt = `${headliningKey} - Headlining Rear View`;
            } else if (interiorSlides.slide6) {
                imgs[5].src = interiorSlides.slide6;
                imgs[5].alt = `${trimType} - ${selectedInterior} - Interior View 2`;
            }
        }

        console.log('Interior images updated via updateInteriorImage:', {
            interiorSlides,
            headliningOverride: headliningSlides
        });
    } else {
        console.warn("No interior images found for", trimType, selectedInterior);
    }
}



function selectHeadliningOption110(el, value) {
    document.querySelectorAll('.headlining-option').forEach(option => {
        option.classList.remove('ring-2', 'ring-black');
    });

    el.classList.add('ring-2', 'ring-black');

    selectedHeadlining = value.toLowerCase().replace(/\s+/g, '_'); // Normalize to match key in imageMap

    console.log("Headlining selected:", value);
    console.log("Normalized headlining key:", selectedHeadlining);

    // Trigger image update
    updateInteriorImage110();
    resetSaveState110();
}

window.addEventListener('DOMContentLoaded', () => {
    const lightCloud = [...document.querySelectorAll('.headlining-option')].find(el =>
        el.textContent.toLowerCase().includes('light cloud')
    );
    if (lightCloud) {
        lightCloud.click();
    }
});



let currentIndex = 0;

function updateSlider110() {
    const slider = document.getElementById("imageSlider");
    if (slider) {
        const offset = currentIndex * 100;
        slider.style.transform = `translateX(-${offset}%)`;
        console.log(`Slider moved to index ${currentIndex}, offset: ${offset}%`);
    } else {
        console.error("Slider not found!");
    }
}
function goToSlide110(index) {
    const totalSlides = document.querySelectorAll("#imageSlider .slide").length;
    console.log(`goToSlide called with index: ${index}`);

    if (index >= 0 && index < totalSlides) {
        currentIndex = index;
        updateSlider110();
        console.log(`Slide updated to index: ${index}`);
    } else {
        console.warn(`Invalid slide index: ${index}`);
    }
}

window.addEventListener("DOMContentLoaded", () => {
    // 1. Apply default selections
    if (!isBuildApplied) {
        // Default Exterior Color
        const defaultColorEl = document.querySelector('[title="Borasco Grey"]');
        if (defaultColorEl) {
            selectColor90(defaultColorEl, 'Borasco Grey');
        } 
    const defaultFinishBtn = document.querySelector('.finish-btn');
    if (defaultFinishBtn) {
        selectFinish90(defaultFinishBtn, 'Gloss Finish');
}
   
      selectTrim90('semi-aniline');
  
  
    const defaultInteriorEl = document.querySelector('[onclick*="burnt_sienna"]');
    if (defaultInteriorEl) {
        selectInteriorOption90(defaultInteriorEl, 'burnt_sienna');}
    } 

    updateInteriorImage90();

    const defaultButton = document.getElementById('defender90Btn');
if (defaultButton) {
    defaultButton.click();
}

    // 2. Initialize visibility map and observer
    let visibilityMap = {
        bodystyle: 0,
        model: 0,
        engine: 0,
        exterior: 0,
        wheels: 0,
        interior: 0,
        headlining: 0,
        headlining: 0
    };

    let currentSlideIndex = null;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.id;
            if (id in visibilityMap) {
                visibilityMap[id] = entry.intersectionRatio;
                console.log(`Section ${id} visibility: ${visibilityMap[id].toFixed(2)}`);
            }
        });

        // Slide switching logic
        const showSlide0 = ['bodystyle', 'model', 'engine', 'exterior']
            .some(section => visibilityMap[section] > 0.1);

        if (showSlide0 && currentSlideIndex !== 0) {
            goToSlide90(0);
            currentSlideIndex = 0;
        } else if (
            (visibilityMap.interior > visibilityMap.wheels || visibilityMap.headlining > visibilityMap.wheels || visibilityMap.headlining > visibilityMap.wheels) &&
            (visibilityMap.interior > 0.1 || visibilityMap.headlining > 0.1 || visibilityMap.headlining > 0.1) &&
            currentSlideIndex !== 5
        ) {
            goToSlide90(5);
            currentSlideIndex = 5;
        } else if (visibilityMap.wheels > 0.1 && currentSlideIndex !== 2) {
            goToSlide90(2);
            currentSlideIndex = 2;
        }
    }, {
        root: document.getElementById('scrollable-panel'),
        threshold: 0.1
    });

    // 3. Observe all relevant sections
    Object.keys(visibilityMap).forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            console.log(`Observing section: ${id}`);
            observer.observe(el);
        } else {
            console.warn(`Section not found: ${id}`);
        }
    });
});

const imageMap = {
    'Defender 110': {
        'Borasco Grey': {
            'Gloss Finish': {
                'Wheel1': {
                   'slide1': `/images/octa/build/110_front_1.jpg`,
                    'slide2': `/images/octa/build/110_side_1.png`,
                    'slide3': `/images/octa/build/110_back_1.jpg`,
                    'slide4': `/images/octa/build/octa_top_blue_1.jpg`
                },
                'Wheel2': {
                    'slide1': `/images/octa/wheel/wheel2_front.jpg`,
                    'slide2': `/images/octa/wheel/wheel2_side.jpg`,
                    'slide3': `/images/octa/wheel/wheel2_back.jpg`,
                    'slide4': `/images/octa/wheel/wheel2_top.jpg`
                },
                'Wheel3': {
                    'slide1': `/images/octa/grey/octa_grey_front_3.jpg`,
                    'slide2': `/images/octa/grey/octa_grey_side_3.jpg`,
                    'slide3': `/images/octa/wheel/wheel3_back.jpg`,
                    'slide4': `/images/octa/wheel/wheel3_top.jpg`
                }
            },
            'Matte Protective Film': {
                'Wheel1': {
                    'slide1': `/images/octa/copper/octa_copper_front_1.webp`,
                    'slide2': `/images/octa/copper/octa_copper_side_1.webp`,
                    'slide3': `/images/octa/copper/octa_copper_back_1.webp`,
                    'slide4': `/images/octa/build/octa_copper_top_1.jpg`
                },
                'Wheel2': {
                    'slide1': `/images/octa/wheel/wheel2_matte_front.jpg`,
                    'slide2': `/images/octa/wheel/wheel2_matte_side.jpg`,
                    'slide3': `/images/octa/wheel/wheel2_matte_back.jpg`,
                    'slide4': `/images/octa/wheel/wheel2_matte_top.jpg`
                },
                'Wheel3': {
                    'slide1': `/images/octa/wheel/wheel3_matte_front.jpg`,
                    'slide2': `/images/octa/wheel/wheel3_matte_side.jpg`,
                    'slide3': `/images/octa/wheel/wheel3_matte_back.jpg`,
                    'slide4': `/images/octa/wheel/wheel3_matte_top.jpg`
                }
            }
        },
        'Charente Grey': {
            'Gloss Finish': {
                'Wheel1': {
                    'slide1': `/images/charente_grey/gloss/charente_grey_gloss_front_1.webp`,
                    'slide2': `/images/charente_grey/gloss/charente_grey_gloss_side_1.jpg`,
                    'slide3': `/images/charente_grey/gloss/charente_grey_gloss_back_1.jpg`,
                    'slide4': `/images/charente_grey/gloss/charente_grey_gloss_top_1.jpg`
                },
                'Wheel2': {
                    'slide1': `/images/charente_grey/gloss/wheel2_front.jpg`,
                    'slide2': `/images/charente_grey/gloss/wheel2_side.jpg`,
                    'slide3': `/images/charente_grey/gloss/wheel2_back.jpg`,
                    'slide4': `/images/charente_grey/gloss/wheel2_top.jpg`
                },
                'Wheel3': {
                    'slide1': `/images/charente_grey/gloss/wheel3_front.jpg`,
                    'slide2': `/images/charente_grey/gloss/wheel3_side.jpg`,
                    'slide3': `/images/charente_grey/gloss/wheel3_back.jpg`,
                    'slide4': `/images/charente_grey/gloss/wheel3_top.jpg`
                }
            },
            'Matte Protective Film': {
                'Wheel1': {
                    'slide1': `/images/charente_grey/matte/charente_grey_matte_front_1.jpg`,
                    'slide2': `/images/charente_grey/matte/charente_grey_matte_side_1.jpg`,
                    'slide3': `/images/charente_grey/matte/charente_grey_matte_back_1.jpg`,
                    'slide4': `/images/charente_grey/matte/charente_grey_matte_top_1.jpg`
                },
                'Wheel2': {
                    'slide1': `/images/charente_grey/matte/wheel2_front.jpg`,
                    'slide2': `/images/charente_grey/matte/wheel2_side.jpg`,
                    'slide3': `/images/charente_grey/matte/wheel2_back.jpg`,
                    'slide4': `/images/charente_grey/matte/wheel2_top.jpg`
                },
                'Wheel3': {
                    'slide1': `/images/charente_grey/matte/wheel3_front.jpg`,
                    'slide2': `/images/charente_grey/matte/wheel3_side.jpg`,
                    'slide3': `/images/charente_grey/matte/wheel3_back.jpg`,
                    'slide4': `/images/charente_grey/matte/wheel3_top.jpg`
                }
            }
        },
        'Sargasso Blue': {
            'Gloss Finish': {
                'Wheel1': {
                    'slide1': `/images/octa/build/octa_blue_front_1.jpg`,
                    'slide2': `/images/octa/build/octa_blue_side_1.png`,
                    'slide3': `/images/octa/build/octa_blue_back_1.png`,
                    'slide4': `/images/octa/build/octa_blue_top_1.png`
                },
                'Wheel2': {
                    'slide1': `/images/sargasso_blue/gloss/wheel2_front.jpg`,
                    'slide2': `/images/sargasso_blue/gloss/wheel2_side.jpg`,
                    'slide3': `/images/sargasso_blue/gloss/wheel2_back.jpg`,
                    'slide4': `/images/sargasso_blue/gloss/wheel2_top.jpg`
                },
                'Wheel3': {
                    'slide1': `/images/sargasso_blue/gloss/wheel3_front.jpg`,
                    'slide2': `/images/sargasso_blue/gloss/wheel3_side.jpg`,
                    'slide3': `/images/sargasso_blue/gloss/wheel3_back.jpg`,
                    'slide4': `/images/sargasso_blue/gloss/wheel3_top.jpg`
                }
            },
            'Matte Protective Film': {
                'Wheel1': {
                    'slide1': `/images/sargasso_blue/matte/sargasso_blue_matte_front_1.jpg`,
                    'slide2': `/images/sargasso_blue/matte/sargasso_blue_matte_side_1.jpg`,
                    'slide3': `/images/sargasso_blue/matte/sargasso_blue_matte_back_1.jpg`,
                    'slide4': `/images/sargasso_blue/matte/sargasso_blue_matte_top_1.jpg`
                },
                'Wheel2': {
                    'slide1': `/images/sargasso_blue/matte/wheel2_front.jpg`,
                    'slide2': `/images/sargasso_blue/matte/wheel2_side.jpg`,
                    'slide3': `/images/sargasso_blue/matte/wheel2_back.jpg`,
                    'slide4': `/images/sargasso_blue/matte/wheel2_top.jpg`
                },
                'Wheel3': {
                    'slide1': `/images/sargasso_blue/matte/wheel3_front.jpg`,
                    'slide2': `/images/sargasso_blue/matte/wheel3_side.jpg`,
                    'slide3': `/images/sargasso_blue/matte/wheel3_back.jpg`,
                    'slide4': `/images/sargasso_blue/matte/wheel3_top.jpg`
                }
            }
        },
        'Petra Copper': {
            'Gloss Finish': {
                'Wheel1': {
                    'slide1': `/images/octa/copper/octa_copper_front_1.webp`,
                    'slide2': `/images/octa/copper/octa_copper_side_1.webp`,
                    'slide3': `/images/octa/copper/octa_copper_back_1.webp`,
                    'slide4': `/images/octa/build/octa_copper_top_1.jpg`
                },
                'Wheel2': {
                    'slide1': `/images/petra_copper/gloss/wheel2_front.jpg`,
                    'slide2': `/images/petra_copper/gloss/wheel2_side.jpg`,
                    'slide3': `/images/petra_copper/gloss/wheel2_back.jpg`,
                    'slide4': `/images/petra_copper/gloss/wheel2_top.jpg`
                },
                'Wheel3': {
                    'slide1': `/images/octa/grey/octa_grey_side_3.jpg`,
                    'slide2': `/images/petra_copper/gloss/wheel3_side.jpg`,
                    'slide3': `/images/petra_copper/gloss/wheel3_back.jpg`,
                    'slide4': `/images/petra_copper/gloss/wheel3_top.jpg`
                }
            },
            'Matte Protective Film': {
                'Wheel1': {
                    'slide1': `/images/petra_copper/matte/petra_copper_matte_front_1.jpg`,
                    'slide2': `/images/petra_copper/matte/petra_copper_matte_side_1.jpg`,
                    'slide3': `/images/petra_copper/matte/petra_copper_matte_back_1.jpg`,
                    'slide4': `/images/petra_copper/matte/petra_copper_matte_top_1.jpg`
                },
                'Wheel2': {
                    'slide1': `/images/petra_copper/matte/wheel2_front.jpg`,
                    'slide2': `/images/petra_copper/matte/wheel2_side.jpg`,
                    'slide3': `/images/petra_copper/matte/wheel2_back.jpg`,
                    'slide4': `/images/petra_copper/matte/wheel2_top.jpg`
                },
                'Wheel3': {
                    'slide1': `/images/petra_copper/matte/wheel3_front.jpg`,
                    'slide2': `/images/petra_copper/matte/wheel3_side.jpg`,
                    'slide3': `/images/petra_copper/matte/wheel3_back.jpg`,
                    'slide4': `/images/petra_copper/matte/wheel3_top.jpg`
                }
            }
        },

        // Interior slides (5 and 6)
        interiorImages: {
            'semi-aniline': {
                'burnt_sienna': {
                    slide5: '/images/octa/build/octa_dashboard_trim_1.jpg',
                    slide6: '/images/octa/build/octa_interior_trim_1.jpg',
                    headliningImages: {
                        ebony_suedecloth_headlining: {
                            slide5: '/images/octa/build/headlining_dash_1.jpg',
                            slide6: '/images/octa/build/headlining_1.jpg'
                        },
                        light_cloud_suedecloth_headlining: {
                            slide5: '/images/octa/build/headlining_4.webp',
                            slide6: '/images/octa/build/headlining_2.avif'
                        }
                    }
                },
                'kvadrat_ebony': {
                    slide5: '/images/octa/build/octa_dashboard_trim_2.png',
                    slide6: '/images/octa/build/octa_interior_trim_2.webp',
                    headliningImages: {
                        ebony_suedecloth_headlining: {
                            slide5: '/images/octa/build/headlining_1.jpg',
                            slide6: '/images/octa/build/headlining_2.avif'
                        },
                        light_cloud_suedecloth_headlining: {
                            slide5: '/images/octa/build/headlining_3.avif',
                            slide6: '/images/octa/build/headlining_4.webp'
                        }
                    }
                }
            },
            'ultrafabric': {
                'cloud_lunar': {
                    slide5: '/images/octa/interior/grey_cloud_lunar_front.jpg',
                    slide6: '/images/octa/interior/grey_cloud_lunar_back.jpg',
                    headliningImages: {
                        ebony_suedecloth_headlining: {
                            slide5: '/images/octa/build/headlining_1.jpg',
                            slide6: '/images/octa/build/headlining_2.avif'
                        },
                        light_cloud_suedecloth_headlining: {
                            slide5: '/images/octa/build/headlining_3.avif',
                            slide6: '/images/octa/build/headlining_4.webp'
                        }
                    }
                },
                'khaki_ebony': {
                    slide5: '/images/octa/interior/grey_khaki_ebony_front.jpg',
                    slide6: '/images/octa/interior/grey_khaki_ebony_back.jpg',
                    headliningImages: {
                        ebony_suedecloth_headlining: {
                            slide5: '/images/octa/headlining/ebony_trim_1.jpg',
                            slide6: '/images/octa/headlining/ebony_trim_2.jpg'
                        },
                        light_cloud_suedecloth_headlining: {
                            slide5: '/images/octa/headlining/lightcloud_trim_1.jpg',
                            slide6: '/images/octa/headlining/lightcloud_trim_2.jpg'
                        }
                    }
                }
            }
        }}};
//     }};, 'Defender 90': {
//         'Borasco Grey': {
//             'Gloss Finish': {
//                 'Wheel1': {
//                     'slide1': `/images/octa/build/90_front_1.jpg`,
//                     'slide2': `/images/octa/build/90_side_1.png`,
//                     'slide3': `/images/octa/build/90_back_1.jpg`,
//                     'slide4': `/images/octa/build/octa_top_blue_1.jpg`
//                 },
//                 'Wheel2': {
//                     'slide1': `/images/octa/wheel/wheel2_front.jpg`,
//                     'slide2': `/images/octa/wheel/wheel2_side.jpg`,
//                     'slide3': `/images/octa/wheel/wheel2_back.jpg`,
//                     'slide4': `/images/octa/wheel/wheel2_top.jpg`
//                 },
//                 'Wheel3': {
//                     'slide1': `/images/octa/grey/octa_grey_front_3.jpg`,
//                     'slide2': `/images/octa/grey/octa_grey_side_3.jpg`,
//                     'slide3': `/images/octa/wheel/wheel3_back.jpg`,
//                     'slide4': `/images/octa/wheel/wheel3_top.jpg`
//                 }
//             },
//             'Matte Protective Film': {
//                 'Wheel1': {
//                     'slide1': `/images/octa/copper/octa_copper_front_1.webp`,
//                     'slide2': `/images/octa/copper/octa_copper_side_1.webp`,
//                     'slide3': `/images/octa/copper/octa_copper_back_1.webp`,
//                     'slide4': `/images/octa/build/octa_copper_top_1.jpg`
//                 },
//                 'Wheel2': {
//                     'slide1': `/images/octa/wheel/wheel2_matte_front.jpg`,
//                     'slide2': `/images/octa/wheel/wheel2_matte_side.jpg`,
//                     'slide3': `/images/octa/wheel/wheel2_matte_back.jpg`,
//                     'slide4': `/images/octa/wheel/wheel2_matte_top.jpg`
//                 },
//                 'Wheel3': {
//                     'slide1': `/images/octa/wheel/wheel3_matte_front.jpg`,
//                     'slide2': `/images/octa/wheel/wheel3_matte_side.jpg`,
//                     'slide3': `/images/octa/wheel/wheel3_matte_back.jpg`,
//                     'slide4': `/images/octa/wheel/wheel3_matte_top.jpg`
//                 }
//             }
//         },
//         'Charente Grey': {
//             'Gloss Finish': {
//                 'Wheel1': {
//                     'slide1': `/images/charente_grey/gloss/charente_grey_gloss_front_1.webp`,
//                     'slide2': `/images/charente_grey/gloss/charente_grey_gloss_side_1.jpg`,
//                     'slide3': `/images/charente_grey/gloss/charente_grey_gloss_back_1.jpg`,
//                     'slide4': `/images/charente_grey/gloss/charente_grey_gloss_top_1.jpg`
//                 },
//                 'Wheel2': {
//                     'slide1': `/images/charente_grey/gloss/wheel2_front.jpg`,
//                     'slide2': `/images/charente_grey/gloss/wheel2_side.jpg`,
//                     'slide3': `/images/charente_grey/gloss/wheel2_back.jpg`,
//                     'slide4': `/images/charente_grey/gloss/wheel2_top.jpg`
//                 },
//                 'Wheel3': {
//                     'slide1': `/images/charente_grey/gloss/wheel3_front.jpg`,
//                     'slide2': `/images/charente_grey/gloss/wheel3_side.jpg`,
//                     'slide3': `/images/charente_grey/gloss/wheel3_back.jpg`,
//                     'slide4': `/images/charente_grey/gloss/wheel3_top.jpg`
//                 }
//             },
//             'Matte Protective Film': {
//                 'Wheel1': {
//                     'slide1': `/images/charente_grey/matte/charente_grey_matte_front_1.jpg`,
//                     'slide2': `/images/charente_grey/matte/charente_grey_matte_side_1.jpg`,
//                     'slide3': `/images/charente_grey/matte/charente_grey_matte_back_1.jpg`,
//                     'slide4': `/images/charente_grey/matte/charente_grey_matte_top_1.jpg`
//                 },
//                 'Wheel2': {
//                     'slide1': `/images/charente_grey/matte/wheel2_front.jpg`,
//                     'slide2': `/images/charente_grey/matte/wheel2_side.jpg`,
//                     'slide3': `/images/charente_grey/matte/wheel2_back.jpg`,
//                     'slide4': `/images/charente_grey/matte/wheel2_top.jpg`
//                 },
//                 'Wheel3': {
//                     'slide1': `/images/charente_grey/matte/wheel3_front.jpg`,
//                     'slide2': `/images/charente_grey/matte/wheel3_side.jpg`,
//                     'slide3': `/images/charente_grey/matte/wheel3_back.jpg`,
//                     'slide4': `/images/charente_grey/matte/wheel3_top.jpg`
//                 }
//             }
//         },
//         'Sargasso Blue': {
//             'Gloss Finish': {
//                 'Wheel1': {
//                     'slide1': `/images/octa/build/octa_blue_front_1.jpg`,
//                     'slide2': `/images/octa/build/octa_blue_side_1.png`,
//                     'slide3': `/images/octa/build/octa_blue_back_1.png`,
//                     'slide4': `/images/octa/build/octa_blue_top_1.png`
//                 },
//                 'Wheel2': {
//                     'slide1': `/images/sargasso_blue/gloss/wheel2_front.jpg`,
//                     'slide2': `/images/sargasso_blue/gloss/wheel2_side.jpg`,
//                     'slide3': `/images/sargasso_blue/gloss/wheel2_back.jpg`,
//                     'slide4': `/images/sargasso_blue/gloss/wheel2_top.jpg`
//                 },
//                 'Wheel3': {
//                     'slide1': `/images/sargasso_blue/gloss/wheel3_front.jpg`,
//                     'slide2': `/images/sargasso_blue/gloss/wheel3_side.jpg`,
//                     'slide3': `/images/sargasso_blue/gloss/wheel3_back.jpg`,
//                     'slide4': `/images/sargasso_blue/gloss/wheel3_top.jpg`
//                 }
//             },
//             'Matte Protective Film': {
//                 'Wheel1': {
//                     'slide1': `/images/sargasso_blue/matte/sargasso_blue_matte_front_1.jpg`,
//                     'slide2': `/images/sargasso_blue/matte/sargasso_blue_matte_side_1.jpg`,
//                     'slide3': `/images/sargasso_blue/matte/sargasso_blue_matte_back_1.jpg`,
//                     'slide4': `/images/sargasso_blue/matte/sargasso_blue_matte_top_1.jpg`
//                 },
//                 'Wheel2': {
//                     'slide1': `/images/sargasso_blue/matte/wheel2_front.jpg`,
//                     'slide2': `/images/sargasso_blue/matte/wheel2_side.jpg`,
//                     'slide3': `/images/sargasso_blue/matte/wheel2_back.jpg`,
//                     'slide4': `/images/sargasso_blue/matte/wheel2_top.jpg`
//                 },
//                 'Wheel3': {
//                     'slide1': `/images/sargasso_blue/matte/wheel3_front.jpg`,
//                     'slide2': `/images/sargasso_blue/matte/wheel3_side.jpg`,
//                     'slide3': `/images/sargasso_blue/matte/wheel3_back.jpg`,
//                     'slide4': `/images/sargasso_blue/matte/wheel3_top.jpg`
//                 }
//             }
//         },
//         'Petra Copper': {
//             'Gloss Finish': {
//                 'Wheel1': {
//                     'slide1': `/images/octa/copper/octa_copper_front_1.webp`,
//                     'slide2': `/images/octa/copper/octa_copper_side_1.webp`,
//                     'slide3': `/images/octa/copper/octa_copper_back_1.webp`,
//                     'slide4': `/images/octa/build/octa_copper_top_1.jpg`
//                 },
//                 'Wheel2': {
//                     'slide1': `/images/petra_copper/gloss/wheel2_front.jpg`,
//                     'slide2': `/images/petra_copper/gloss/wheel2_side.jpg`,
//                     'slide3': `/images/petra_copper/gloss/wheel2_back.jpg`,
//                     'slide4': `/images/petra_copper/gloss/wheel2_top.jpg`
//                 },
//                 'Wheel3': {
//                     'slide1': `/images/octa/grey/octa_grey_side_3.jpg`,
//                     'slide2': `/images/petra_copper/gloss/wheel3_side.jpg`,
//                     'slide3': `/images/petra_copper/gloss/wheel3_back.jpg`,
//                     'slide4': `/images/petra_copper/gloss/wheel3_top.jpg`
//                 }
//             },
//             'Matte Protective Film': {
//                 'Wheel1': {
//                     'slide1': `/images/petra_copper/matte/petra_copper_matte_front_1.jpg`,
//                     'slide2': `/images/petra_copper/matte/petra_copper_matte_side_1.jpg`,
//                     'slide3': `/images/petra_copper/matte/petra_copper_matte_back_1.jpg`,
//                     'slide4': `/images/petra_copper/matte/petra_copper_matte_top_1.jpg`
//                 },
//                 'Wheel2': {
//                     'slide1': `/images/petra_copper/matte/wheel2_front.jpg`,
//                     'slide2': `/images/petra_copper/matte/wheel2_side.jpg`,
//                     'slide3': `/images/petra_copper/matte/wheel2_back.jpg`,
//                     'slide4': `/images/petra_copper/matte/wheel2_top.jpg`
//                 },
//                 'Wheel3': {
//                     'slide1': `/images/petra_copper/matte/wheel3_front.jpg`,
//                     'slide2': `/images/petra_copper/matte/wheel3_side.jpg`,
//                     'slide3': `/images/petra_copper/matte/wheel3_back.jpg`,
//                     'slide4': `/images/petra_copper/matte/wheel3_top.jpg`
//                 }
//             }
//         }
//     },
//     'Defender 110': {
//         'Borasco Grey': {
//             'Gloss Finish': {
//                 'Wheel1': {
//                     'slide1': `/images/octa/build/110_front_1.jpg`,
//                     'slide2': `/images/octa/build/octa_grey_side_1.jpg`,
//                     'slide3': `/images/octa/build/octa_grey_back_1.jpg`,
//                     'slide4': `/images/octa/build/octa_grey_top_1.jpg`
//                 },
//                 'Wheel2': {
//                     'slide1': `/images/octa/wheel/wheel2_front.jpg`,
//                     'slide2': `/images/octa/wheel/wheel2_side.jpg`,
//                     'slide3': `/images/octa/wheel/wheel2_back.jpg`,
//                     'slide4': `/images/octa/wheel/wheel2_top.jpg`
//                 },
//                 'Wheel3': {
//                     'slide1': `/images/octa/grey/octa_grey_front_3.jpg`,
//                     'slide2': `/images/octa/grey/octa_grey_side_3.jpg`,
//                     'slide3': `/images/octa/wheel/wheel3_back.jpg`,
//                     'slide4': `/images/octa/wheel/wheel3_top.jpg`
//                 }
//             },
//             'Matte Protective Film': {
//                 'Wheel1': {
//                     'slide1': `/images/octa/copper/octa_copper_front_1.webp`,
//                     'slide2': `/images/octa/copper/octa_copper_side_1.webp`,
//                     'slide3': `/images/octa/copper/octa_copper_back_1.webp`,
//                     'slide4': `/images/octa/build/octa_copper_top_1.jpg`
//                 },
//                 'Wheel2': {
//                     'slide1': `/images/octa/wheel/wheel2_matte_front.jpg`,
//                     'slide2': `/images/octa/wheel/wheel2_matte_side.jpg`,
//                     'slide3': `/images/octa/wheel/wheel2_matte_back.jpg`,
//                     'slide4': `/images/octa/wheel/wheel2_matte_top.jpg`
//                 },
//                 'Wheel3': {
//                     'slide1': `/images/octa/wheel/wheel3_matte_front.jpg`,
//                     'slide2': `/images/octa/wheel/wheel3_matte_side.jpg`,
//                     'slide3': `/images/octa/wheel/wheel3_matte_back.jpg`,
//                     'slide4': `/images/octa/wheel/wheel3_matte_top.jpg`
//                 }
//             }
//         },
//         'Charente Grey': {
//             'Gloss Finish': {
//                 'Wheel1': {
//                     'slide1': `/images/charente_grey/gloss/charente_grey_gloss_front_1.webp`,
//                     'slide2': `/images/charente_grey/gloss/charente_grey_gloss_side_1.jpg`,
//                     'slide3': `/images/charente_grey/gloss/charente_grey_gloss_back_1.jpg`,
//                     'slide4': `/images/charente_grey/gloss/charente_grey_gloss_top_1.jpg`
//                 },
//                 'Wheel2': {
//                     'slide1': `/images/charente_grey/gloss/wheel2_front.jpg`,
//                     'slide2': `/images/charente_grey/gloss/wheel2_side.jpg`,
//                     'slide3': `/images/charente_grey/gloss/wheel2_back.jpg`,
//                     'slide4': `/images/charente_grey/gloss/wheel2_top.jpg`
//                 },
//                 'Wheel3': {
//                     'slide1': `/images/charente_grey/gloss/wheel3_front.jpg`,
//                     'slide2': `/images/charente_grey/gloss/wheel3_side.jpg`,
//                     'slide3': `/images/charente_grey/gloss/wheel3_back.jpg`,
//                     'slide4': `/images/charente_grey/gloss/wheel3_top.jpg`
//                 }
//             },
//             'Matte Protective Film': {
//                 'Wheel1': {
//                     'slide1': `/images/charente_grey/matte/charente_grey_matte_front_1.jpg`,
//                     'slide2': `/images/charente_grey/matte/charente_grey_matte_side_1.jpg`,
//                     'slide3': `/images/charente_grey/matte/charente_grey_matte_back_1.jpg`,
//                     'slide4': `/images/charente_grey/matte/charente_grey_matte_top_1.jpg`
//                 },
//                 'Wheel2': {
//                     'slide1': `/images/charente_grey/matte/wheel2_front.jpg`,
//                     'slide2': `/images/charente_grey/matte/wheel2_side.jpg`,
//                     'slide3': `/images/charente_grey/matte/wheel2_back.jpg`,
//                     'slide4': `/images/charente_grey/matte/wheel2_top.jpg`
//                 },
//                 'Wheel3': {
//                     'slide1': `/images/charente_grey/matte/wheel3_front.jpg`,
//                     'slide2': `/images/charente_grey/matte/wheel3_side.jpg`,
//                     'slide3': `/images/charente_grey/matte/wheel3_back.jpg`,
//                     'slide4': `/images/charente_grey/matte/wheel3_top.jpg`
//                 }
//             }
//         },
//         'Sargasso Blue': {
//             'Gloss Finish': {
//                 'Wheel1': {
//                     'slide1': `/images/octa/build/octa_blue_front_1.jpg`,
//                     'slide2': `/images/octa/build/octa_blue_side_1.png`,
//                     'slide3': `/images/octa/build/octa_blue_back_1.png`,
//                     'slide4': `/images/octa/build/octa_blue_top_1.png`
//                 },
//                 'Wheel2': {
//                     'slide1': `/images/sargasso_blue/gloss/wheel2_front.jpg`,
//                     'slide2': `/images/sargasso_blue/gloss/wheel2_side.jpg`,
//                     'slide3': `/images/sargasso_blue/gloss/wheel2_back.jpg`,
//                     'slide4': `/images/sargasso_blue/gloss/wheel2_top.jpg`
//                 },
//                 'Wheel3': {
//                     'slide1': `/images/sargasso_blue/gloss/wheel3_front.jpg`,
//                     'slide2': `/images/sargasso_blue/gloss/wheel3_side.jpg`,
//                     'slide3': `/images/sargasso_blue/gloss/wheel3_back.jpg`,
//                     'slide4': `/images/sargasso_blue/gloss/wheel3_top.jpg`
//                 }
//             },
//             'Matte Protective Film': {
//                 'Wheel1': {
//                     'slide1': `/images/sargasso_blue/matte/sargasso_blue_matte_front_1.jpg`,
//                     'slide2': `/images/sargasso_blue/matte/sargasso_blue_matte_side_1.jpg`,
//                     'slide3': `/images/sargasso_blue/matte/sargasso_blue_matte_back_1.jpg`,
//                     'slide4': `/images/sargasso_blue/matte/sargasso_blue_matte_top_1.jpg`
//                 },
//                 'Wheel2': {
//                     'slide1': `/images/sargasso_blue/matte/wheel2_front.jpg`,
//                     'slide2': `/images/sargasso_blue/matte/wheel2_side.jpg`,
//                     'slide3': `/images/sargasso_blue/matte/wheel2_back.jpg`,
//                     'slide4': `/images/sargasso_blue/matte/wheel2_top.jpg`
//                 },
//                 'Wheel3': {
//                     'slide1': `/images/sargasso_blue/matte/wheel3_front.jpg`,
//                     'slide2': `/images/sargasso_blue/matte/wheel3_side.jpg`,
//                     'slide3': `/images/sargasso_blue/matte/wheel3_back.jpg`,
//                     'slide4': `/images/sargasso_blue/matte/wheel3_top.jpg`
//                 }
//             }
//         },
//         'Petra Copper': {
//             'Gloss Finish': {
//                 'Wheel1': {
//                     'slide1': `/images/octa/copper/octa_copper_front_1.webp`,
//                     'slide2': `/images/octa/copper/octa_copper_side_1.webp`,
//                     'slide3': `/images/octa/copper/octa_copper_back_1.webp`,
//                     'slide4': `/images/octa/build/octa_copper_top_1.jpg`
//                 },
//                 'Wheel2': {
//                     'slide1': `/images/petra_copper/gloss/wheel2_front.jpg`,
//                     'slide2': `/images/petra_copper/gloss/wheel2_side.jpg`,
//                     'slide3': `/images/petra_copper/gloss/wheel2_back.jpg`,
//                     'slide4': `/images/petra_copper/gloss/wheel2_top.jpg`
//                 },
//                 'Wheel3': {
//                     'slide1': `/images/octa/grey/octa_grey_side_3.jpg`,
//                     'slide2': `/images/petra_copper/gloss/wheel3_side.jpg`,
//                     'slide3': `/images/petra_copper/gloss/wheel3_back.jpg`,
//                     'slide4': `/images/petra_copper/gloss/wheel3_top.jpg`
//                 }
//             },
//             'Matte Protective Film': {
//                 'Wheel1': {
//                     'slide1': `/images/petra_copper/matte/petra_copper_matte_front_1.jpg`,
//                     'slide2': `/images/petra_copper/matte/petra_copper_matte_side_1.jpg`,
//                     'slide3': `/images/petra_copper/matte/petra_copper_matte_back_1.jpg`,
//                     'slide4': `/images/petra_copper/matte/petra_copper_matte_top_1.jpg`
//                 },
//                 'Wheel2': {
//                     'slide1': `/images/petra_copper/matte/wheel2_front.jpg`,
//                     'slide2': `/images/petra_copper/matte/wheel2_side.jpg`,
//                     'slide3': `/images/petra_copper/matte/wheel2_back.jpg`,
//                     'slide4': `/images/petra_copper/matte/wheel2_top.jpg`
//                 },
//                 'Wheel3': {
//                     'slide1': `/images/petra_copper/matte/wheel3_front.jpg`,
//                     'slide2': `/images/petra_copper/matte/wheel3_side.jpg`,
//                     'slide3': `/images/petra_copper/matte/wheel3_back.jpg`,
//                     'slide4': `/images/petra_copper/matte/wheel3_top.jpg`
//                 }
//             }
//         }
//     },
//     'Defender 130': {
//         'Borasco Grey': {
//             'Gloss Finish': {
//                 'Wheel1': {
//                     'slide1': `/images/octa/build/130_front_1.jpeg`,
//                     'slide2': `/images/octa/build/octa_grey_side_1.jpg`,
//                     'slide3': `/images/octa/build/octa_grey_back_1.jpg`,
//                     'slide4': `/images/octa/build/octa_grey_top_1.jpg`
//                 },
//                 'Wheel2': {
//                     'slide1': `/images/octa/wheel/wheel2_front.jpg`,
//                     'slide2': `/images/octa/wheel/wheel2_side.jpg`,
//                     'slide3': `/images/octa/wheel/wheel2_back.jpg`,
//                     'slide4': `/images/octa/wheel/wheel2_top.jpg`
//                 },
//                 'Wheel3': {
//                     'slide1': `/images/octa/grey/octa_grey_front_3.jpg`,
//                     'slide2': `/images/octa/grey/octa_grey_side_3.jpg`,
//                     'slide3': `/images/octa/wheel/wheel3_back.jpg`,
//                     'slide4': `/images/octa/wheel/wheel3_top.jpg`
//                 }
//             },
//             'Matte Protective Film': {
//                 'Wheel1': {
//                     'slide1': `/images/octa/copper/octa_copper_front_1.webp`,
//                     'slide2': `/images/octa/copper/octa_copper_side_1.webp`,
//                     'slide3': `/images/octa/copper/octa_copper_back_1.webp`,
//                     'slide4': `/images/octa/build/octa_copper_top_1.jpg`
//                 },
//                 'Wheel2': {
//                     'slide1': `/images/octa/wheel/wheel2_matte_front.jpg`,
//                     'slide2': `/images/octa/wheel/wheel2_matte_side.jpg`,
//                     'slide3': `/images/octa/wheel/wheel2_matte_back.jpg`,
//                     'slide4': `/images/octa/wheel/wheel2_matte_top.jpg`
//                 },
//                 'Wheel3': {
//                     'slide1': `/images/octa/wheel/wheel3_matte_front.jpg`,
//                     'slide2': `/images/octa/wheel/wheel3_matte_side.jpg`,
//                     'slide3': `/images/octa/wheel/wheel3_matte_back.jpg`,
//                     'slide4': `/images/octa/wheel/wheel3_matte_top.jpg`
//                 }
//             }
//         },
//         'Charente Grey': {
//             'Gloss Finish': {
//                 'Wheel1': {
//                     'slide1': `/images/charente_grey/gloss/charente_grey_gloss_front_1.webp`,
//                     'slide2': `/images/charente_grey/gloss/charente_grey_gloss_side_1.jpg`,
//                     'slide3': `/images/charente_grey/gloss/charente_grey_gloss_back_1.jpg`,
//                     'slide4': `/images/charente_grey/gloss/charente_grey_gloss_top_1.jpg`
//                 },
//                 'Wheel2': {
//                     'slide1': `/images/charente_grey/gloss/wheel2_front.jpg`,
//                     'slide2': `/images/charente_grey/gloss/wheel2_side.jpg`,
//                     'slide3': `/images/charente_grey/gloss/wheel2_back.jpg`,
//                     'slide4': `/images/charente_grey/gloss/wheel2_top.jpg`
//                 },
//                 'Wheel3': {
//                     'slide1': `/images/charente_grey/gloss/wheel3_front.jpg`,
//                     'slide2': `/images/charente_grey/gloss/wheel3_side.jpg`,
//                     'slide3': `/images/charente_grey/gloss/wheel3_back.jpg`,
//                     'slide4': `/images/charente_grey/gloss/wheel3_top.jpg`
//                 }
//             },
//             'Matte Protective Film': {
//                 'Wheel1': {
//                     'slide1': `/images/charente_grey/matte/charente_grey_matte_front_1.jpg`,
//                     'slide2': `/images/charente_grey/matte/charente_grey_matte_side_1.jpg`,
//                     'slide3': `/images/charente_grey/matte/charente_grey_matte_back_1.jpg`,
//                     'slide4': `/images/charente_grey/matte/charente_grey_matte_top_1.jpg`
//                 },
//                 'Wheel2': {
//                     'slide1': `/images/charente_grey/matte/wheel2_front.jpg`,
//                     'slide2': `/images/charente_grey/matte/wheel2_side.jpg`,
//                     'slide3': `/images/charente_grey/matte/wheel2_back.jpg`,
//                     'slide4': `/images/charente_grey/matte/wheel2_top.jpg`
//                 },
//                 'Wheel3': {
//                     'slide1': `/images/charente_grey/matte/wheel3_front.jpg`,
//                     'slide2': `/images/charente_grey/matte/wheel3_side.jpg`,
//                     'slide3': `/images/charente_grey/matte/wheel3_back.jpg`,
//                     'slide4': `/images/charente_grey/matte/wheel3_top.jpg`
//                 }
//             }
//         },
//         'Sargasso Blue': {
//             'Gloss Finish': {
//                 'Wheel1': {
//                     'slide1': `/images/octa/build/octa_blue_front_1.jpg`,
//                     'slide2': `/images/octa/build/octa_blue_side_1.png`,
//                     'slide3': `/images/octa/build/octa_blue_back_1.png`,
//                     'slide4': `/images/octa/build/octa_blue_top_1.png`
//                 },
//                 'Wheel2': {
//                     'slide1': `/images/sargasso_blue/gloss/wheel2_front.jpg`,
//                     'slide2': `/images/sargasso_blue/gloss/wheel2_side.jpg`,
//                     'slide3': `/images/sargasso_blue/gloss/wheel2_back.jpg`,
//                     'slide4': `/images/sargasso_blue/gloss/wheel2_top.jpg`
//                 },
//                 'Wheel3': {
//                     'slide1': `/images/sargasso_blue/gloss/wheel3_front.jpg`,
//                     'slide2': `/images/sargasso_blue/gloss/wheel3_side.jpg`,
//                     'slide3': `/images/sargasso_blue/gloss/wheel3_back.jpg`,
//                     'slide4': `/images/sargasso_blue/gloss/wheel3_top.jpg`
//                 }
//             },
//             'Matte Protective Film': {
//                 'Wheel1': {
//                     'slide1': `/images/sargasso_blue/matte/sargasso_blue_matte_front_1.jpg`,
//                     'slide2': `/images/sargasso_blue/matte/sargasso_blue_matte_side_1.jpg`,
//                     'slide3': `/images/sargasso_blue/matte/sargasso_blue_matte_back_1.jpg`,
//                     'slide4': `/images/sargasso_blue/matte/sargasso_blue_matte_top_1.jpg`
//                 },
//                 'Wheel2': {
//                     'slide1': `/images/sargasso_blue/matte/wheel2_front.jpg`,
//                     'slide2': `/images/sargasso_blue/matte/wheel2_side.jpg`,
//                     'slide3': `/images/sargasso_blue/matte/wheel2_back.jpg`,
//                     'slide4': `/images/sargasso_blue/matte/wheel2_top.jpg`
//                 },
//                 'Wheel3': {
//                     'slide1': `/images/sargasso_blue/matte/wheel3_front.jpg`,
//                     'slide2': `/images/sargasso_blue/matte/wheel3_side.jpg`,
//                     'slide3': `/images/sargasso_blue/matte/wheel3_back.jpg`,
//                     'slide4': `/images/sargasso_blue/matte/wheel3_top.jpg`
//                 }
//             }
//         },
//         'Petra Copper': {
//             'Gloss Finish': {
//                 'Wheel1': {
//                     'slide1': `/images/octa/copper/octa_copper_front_1.webp`,
//                     'slide2': `/images/octa/copper/octa_copper_side_1.webp`,
//                     'slide3': `/images/octa/copper/octa_copper_back_1.webp`,
//                     'slide4': `/images/octa/build/octa_copper_top_1.jpg`
//                 },
//                 'Wheel2': {
//                     'slide1': `/images/petra_copper/gloss/wheel2_front.jpg`,
//                     'slide2': `/images/petra_copper/gloss/wheel2_side.jpg`,
//                     'slide3': `/images/petra_copper/gloss/wheel2_back.jpg`,
//                     'slide4': `/images/petra_copper/gloss/wheel2_top.jpg`
//                 },
//                 'Wheel3': {
//                     'slide1': `/images/octa/grey/octa_grey_side_3.jpg`,
//                     'slide2': `/images/petra_copper/gloss/wheel3_side.jpg`,
//                     'slide3': `/images/petra_copper/gloss/wheel3_back.jpg`,
//                     'slide4': `/images/petra_copper/gloss/wheel3_top.jpg`
//                 }
//             },
//             'Matte Protective Film': {
//                 'Wheel1': {
//                     'slide1': `/images/petra_copper/matte/petra_copper_matte_front_1.jpg`,
//                     'slide2': `/images/petra_copper/matte/petra_copper_matte_side_1.jpg`,
//                     'slide3': `/images/petra_copper/matte/petra_copper_matte_back_1.jpg`,
//                     'slide4': `/images/petra_copper/matte/petra_copper_matte_top_1.jpg`
//                 },
//                 'Wheel2': {
//                     'slide1': `/images/petra_copper/matte/wheel2_front.jpg`,
//                     'slide2': `/images/petra_copper/matte/wheel2_side.jpg`,
//                     'slide3': `/images/petra_copper/matte/wheel2_back.jpg`,
//                     'slide4': `/images/petra_copper/matte/wheel2_top.jpg`
//                 },
//                 'Wheel3': {
//                     'slide1': `/images/petra_copper/matte/wheel3_front.jpg`,
//                     'slide2': `/images/petra_copper/matte/wheel3_side.jpg`,
//                     'slide3': `/images/petra_copper/matte/wheel3_back.jpg`,
//                     'slide4': `/images/petra_copper/matte/wheel3_top.jpg`
//                 }
//             }
//         }
//     },
// };

