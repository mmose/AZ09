const container = document.querySelector(".container");

Array.from(container.querySelectorAll(".card")).forEach(card => {
  card.addEventListener("click", (e) => {  
    
    // Clone the clicked element
    const clone = card.cloneNode(true);
    card.classList.toggle("flat");
    
    
    /* Set some initial styles to match it, 
     * but fix the position and flow it outside of the grid
     */   
    clone.style.position = "fixed";
    clone.style.left = card.offsetLeft + "px";
    clone.style.top = card.offsetTop + "px"; 
    clone.style.width = card.clientWidth + "px";  
    clone.style.height = card.clientHeight + "px";    
    
    // Add the cloned element
    card.parentElement.appendChild(clone);
    
    // Add the card-full class on the next tick to keep the animation
    setTimeout(() => clone.classList.add("card-full"), 100);
    
    // Shrink the full view back down to where it came from, then remove it
    clone.addEventListener("click", e => {
      clone.classList.remove("card-full");
      card.classList.toggle("flat");
      setTimeout(() => clone.remove(), 300);
    })
  })
})