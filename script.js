document.addEventListener("DOMContentLoaded", function () {
    const spinButton = document.getElementById("spinButton");
    const moodButtons = document.querySelectorAll(".mood-btn");
    const wheelContainer = document.getElementById("colorWheelContainer");

    // Mood palettes
    const moodPalettes = {
        happy: ["#FFD700", "#FFA500", "#FF4500", "#FF8C00"],
        calm: ["#ADD8E6", "#87CEFA", "#4682B4", "#5F9EA0"],
        excited: ["#FF6347", "#FF4500", "#FF0000", "#DC143C"],
        sad: ["#A9A9A9", "#808080", "#696969", "#778899"],
        creative: ["#800080", "#DA70D6", "#9932CC", "#BA55D3"],
        relaxed: ["#FFC0CB", "#FFB6C1", "#FF69B4", "#DB7093"]
    };

    let currentAngle = 0; // To track rotation

    // Function to create the SVG wheel
    function createWheel(mood) {
        let colors = moodPalettes[mood];
        if (!colors) {
            console.error("Invalid mood selected:", mood);
            return;
        }

        // Clear previous wheel if it exists
        wheelContainer.innerHTML = "";

        // Create an SVG element
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", "160");
        svg.setAttribute("height", "160");
        svg.setAttribute("viewBox", "0 0 200 200");

        // Create wheel slices
        const totalSlices = colors.length;
        const anglePerSlice = 360 / totalSlices;
        let startAngle = 0;

        colors.forEach((color, index) => {
            const endAngle = startAngle + anglePerSlice;
            const largeArc = anglePerSlice > 180 ? 1 : 0;

            // Convert polar to cartesian coordinates for SVG path
            const x1 = 100 + 100 * Math.cos((Math.PI * startAngle) / 180);
            const y1 = 100 + 100 * Math.sin((Math.PI * startAngle) / 180);
            const x2 = 100 + 100 * Math.cos((Math.PI * endAngle) / 180);
            const y2 = 100 + 100 * Math.sin((Math.PI * endAngle) / 180);

            const path = document.createElementNS(svgNS, "path");
            path.setAttribute("d", `M100,100 L${x1},${y1} A100,100 0 ${largeArc},1 ${x2},${y2} Z`);
            path.setAttribute("fill", color);
            svg.appendChild(path);

            startAngle = endAngle;
        });

        // Add an inner circle for better appearance
        const innerCircle = document.createElementNS(svgNS, "circle");
        innerCircle.setAttribute("cx", "100");
        innerCircle.setAttribute("cy", "100");
        innerCircle.setAttribute("r", "40");
        innerCircle.setAttribute("fill", "white");
        svg.appendChild(innerCircle);

        // Set initial rotation
        svg.style.transform = `rotate(${currentAngle}deg)`;
        svg.style.transition = "transform 2s ease-out";
        svg.setAttribute("id", "svgWheel");

        wheelContainer.appendChild(svg);
    }

    // Function to spin the wheel
    function spinWheel() {
        const svgWheel = document.getElementById("svgWheel");
        if (!svgWheel) {
            console.error("SVG Wheel not found!");
            return;
        }
    
        // Get the active mood from the clicked button
        const activeMoodButton = document.querySelector(".mood-btn.selected");
        if (!activeMoodButton) {
            console.error("No mood selected!");
            return;
        }
        const activeMood = activeMoodButton.innerText.toLowerCase();
        const colors = moodPalettes[activeMood];
    
        if (!colors) {
            console.error("Invalid mood palette");
            return;
        }
    
        // Generate a spin with 5-10 full rotations + a final stop
        const randomExtraRotation = Math.floor(Math.random() * 360);
        const totalRotation = 360 * (5 + Math.floor(Math.random() * 5)) + randomExtraRotation;
        currentAngle += totalRotation;
    
        svgWheel.style.transform = `rotate(${currentAngle}deg)`;
    
        // Determine final color after spin stops
        setTimeout(() => {
            const totalSlices = colors.length; // Get number of slices for the selected mood
            const anglePerSlice = 360 / totalSlices;
            
            // Normalize angle
            let stoppedAngle = (currentAngle % 360 + 360) % 360;
            let selectedIndex = Math.floor(stoppedAngle / anglePerSlice) % totalSlices;
    
            // Get the corresponding color
            let selectedColor = colors[selectedIndex];
    
            // Update background color
            document.body.style.backgroundColor = selectedColor;
        }, 2000);
    }
    
    
    // Attach event listeners to mood buttons
    moodButtons.forEach(button => {
        button.addEventListener("click", function () {
            moodButtons.forEach(btn => btn.classList.remove("selected")); // Remove from all
            this.classList.add("selected"); // Add to clicked button
            let mood = this.innerText.toLowerCase();
            createWheel(mood);
        });
    });
    

    // Spin button event
    spinButton.addEventListener("click", spinWheel);

    // Load the default wheel
    createWheel("happy");
});
