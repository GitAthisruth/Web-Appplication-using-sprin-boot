document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('slider');
    const slides = slider.querySelectorAll('.slide');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');

    let currentIndex = 0;

    function updateSlider() {
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlider();
    });

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlider();
    });

    updateSlider();
});


function switchSeat(type, el) {
    // Hide all slides
    document.querySelectorAll('.bass-slide').forEach(slide => {
        slide.classList.remove('active');
    });

    // Remove 'active' from all links
    document.querySelectorAll('.bass-slider-link').forEach(link => {
        link.classList.remove('active');
    });

    // Show selected slide
    document.getElementById(`${type}-slide`).classList.add('active');
    el.classList.add('active');
}

function switchTab(tab) {
    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    // Activate the clicked tab
    document.querySelector(`.tab-btn[onclick*="${tab}"]`).classList.add('active');
    document.getElementById('tab-' + tab).classList.add('active');
}


let currentExterior = 'Grey';
let currentWheels = 'Alloy 1';
function updateConfig(type, value) {
    if (type === 'exterior') {
        currentExterior = value;
        document.getElementById('exterior-name').textContent = value;
        updateImages(); // Call image updater
    }

    if (type === 'interior') {
        document.getElementById('interior-name').textContent = value;

        const interiorImages = {
            'Black Leather': '/images/octa/interior/interior_black.avif',
            'Beige Leather': '/images/octa/interior/interior_beige.jpg',
            'Grey Fabric': '/images/octa/interior/interior_grey.avif'
        };
        const selectedInterior = interiorImages[value];
        if (selectedInterior) {
            document.getElementById('vehicle-interior').src = selectedInterior;
        }
    }

    if (type === 'wheels') {
        currentWheels = value;
        document.getElementById('wheels-name').textContent = value;
        updateImages(); // Call image updater
    }
}
function updateImages() {
    const imageMap = {
        'Grey': {
            'Alloy 1': {
                side: '/images/octa/grey/octa_grey_side_1.jpg',
                front: '/images/octa/grey/octa_grey_front_1.webp',
                back: '/images/octa/grey/octa_grey_back_1.jpg',
            },
            'Alloy 2': {
                side: '/images/octa/copper/octa_copper_side_2.jpg',
                front: '/images/octa/copper/octa_copper_front_2.webp',
                back: '/images/octa/copper/octa_copper_back_2.webp'
            },
            'Alloy 3': {
                side: '/images/octa/grey/octa_grey_side_3.jpg',
                front: '/images/octa/grey/octa_grey_front_3.webp',
                back: '/images/octa/grey/octa_grey_back_3.jpg',
            }
        },
        'Copper': {
            'Alloy 1': {
                side: '/images/octa/copper/alloy1/side.webp',
                front: '/images/octa/copper/alloy1/front.webp',
                back: '/images/octa/copper/alloy1/back.webp'
            },
            'Alloy 2': {
                side: '/images/octa/copper/alloy2/side.jpg',
                front: '/images/octa/copper/alloy2/front.jpg',
                back: '/images/octa/copper/alloy2/back.jpg'
            },
            'Alloy 3': {
                side: '/images/octa/copper/alloy3/side.jpg',
                front: '/images/octa/copper/alloy3/front.jpg',
                back: '/images/octa/copper/alloy3/back.jpg'
            }
        },
        'Blue': {
            'Alloy 1': {
                side: '/images/octa/blue/alloy1/side.jpg',
                front: '/images/octa/blue/alloy1/front.jpg',
                back: '/images/octa/blue/alloy1/back.jpg'
            },
            'Alloy 2': {
                side: '/images/octa/blue/alloy2/side.jpg',
                front: '/images/octa/blue/alloy2/front.jpg',
                back: '/images/octa/blue/alloy2/back.jpg'
            },
            'Alloy 3': {
                side: '/images/octa/blue/alloy3/side.jpg',
                front: '/images/octa/blue/alloy3/front.jpg',
                back: '/images/octa/blue/alloy3/back.jpg'
            }
        }
    };

    const selectedSet = imageMap[currentExterior]?.[currentWheels];
    if (selectedSet) {
        document.getElementById('slider-img-1').src = selectedSet.side;
        document.getElementById('slider-img-2').src = selectedSet.front;
        document.getElementById('slider-img-3').src = selectedSet.back;
        document.getElementById('vehicle-wheels').src = selectedSet.side;
    }
}


let currentSlide = 0;

function showSlide(index) {
    const slides = document.querySelectorAll('#vehicle-slider .vehicle-slide');
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
}

function nextSlide() {
    const slides = document.querySelectorAll('#vehicle-slider .vehicle-slide');
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function prevSlide() {
    const slides = document.querySelectorAll('#vehicle-slider .vehicle-slide');
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

document.addEventListener('DOMContentLoaded', () => {
    showSlide(currentSlide);
});

