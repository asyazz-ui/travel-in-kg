// ===== CONTACT MODAL =====

const modal = document.querySelector('.modal');
const modalClose = document.querySelector('.modal_close');
const modalTriggers = document.querySelectorAll('#btn-get, [data-open-modal]');

if (modalTriggers.length > 0) {
    modalTriggers.forEach((trigger) => {
        trigger.addEventListener('click', () => {
            if (modal) {
                modal.classList.add('active');
            }
        });
    });
}

if (modalClose) {
    modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
    });
}

if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal) {
        modal.classList.remove('active');
    }
});
