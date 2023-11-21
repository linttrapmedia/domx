document.addEventListener("DOMContentLoaded", function () {
  // Initial state
  let currentState = "red";

  // Function to handle the transition
  function transitionState() {
    console.log(currentState);
    if (currentState === "red") {
      currentState = "green";
    } else if (currentState === "green") {
      currentState = "yellow";
    } else if (currentState === "yellow") {
      currentState = "red";
    }

    updateSVGState();
  }

  // Function to visually update the SVG based on the current state
  function updateSVGState() {
    document
      .querySelectorAll(`circle:not([id="${currentState}"])`)
      .forEach((circle) => {
        circle.style.opacity = 0.25;
      });

    document.querySelector(`circle[id="${currentState}"]`).style.opacity = 1;
  }

  // Simulate a timer event
  setInterval(transitionState, 1000);
});
