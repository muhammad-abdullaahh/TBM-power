document.addEventListener('DOMContentLoaded', () => {
    initProjectsModal();
});

function initProjectsModal() {
    const modal = document.getElementById('galleryModal');
    const modalContent = document.getElementById('modalProjectContent');
    const closeBtn = document.getElementById('modalCloseBtn');
    
    if (!modal || !modalContent) return;

    // Delegate clicks to "View Case Details" buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('view-project-details')) {
            const card = e.target.closest('.project-card');
            if (!card) return;

            const fullDetailsContainer = card.querySelector('.project-details-full');
            if (fullDetailsContainer) {
                // Populate modal content with the hidden structure
                modalContent.innerHTML = fullDetailsContainer.innerHTML;
                modal.classList.add('active');
            }
        }
    });

    // Close Modal Event
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            modalContent.innerHTML = '';
        });
    }

    // Close Modal on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            modalContent.innerHTML = '';
        }
    });
}
