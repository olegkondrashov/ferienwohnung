
function createImageViewer(props) {
    const gallerySelector = props.gallerySelector;
    const viewerSelector = props.viewerSelector;
    const viewerImgSelector = props.viewerImgSelector;
    const closeButtonSelector = props.closeButtonSelector;

    const galleryItems = document.querySelectorAll(gallerySelector);
    const viewer = document.querySelector(viewerSelector);
    const viewerImg = document.querySelector(viewerImgSelector);
    const closeViewer = document.querySelector(closeButtonSelector);


    // Klick auf ein Bild in der Galerie
    galleryItems.forEach((img) => {
        img.addEventListener('click', () => {
            viewerImg.src = img.src; // Bildquelle setzen
            viewer.style.display = 'flex'; // Vollbild aktivieren
        });
    });

    // Schließen der Vollbildansicht
    closeViewer.addEventListener('click', () => {
        viewer.style.display = 'none'; // Vollbild schließen
    });

    // Schließen bei Klick außerhalb des Bildes
    viewer.addEventListener('click', (e) => {
        if (e.target !== viewerImg) {
            viewer.style.display = 'none'; // Vollbild schließen
        }
    });
}
function initializeImageViewer(selectorType) {
    try {
        switch (selectorType) {
            case 'gallery':
                createImageViewer({
                    gallerySelector: '.gallery-item img',
                    viewerSelector: '#image-viewer',
                    viewerImgSelector: '#viewer-img',
                    closeButtonSelector: '#close-viewer'
                });
                break;

            case 'image-container':
                createImageViewer({
                    gallerySelector: '.image-container img',
                    viewerSelector: '#image-viewer',
                    viewerImgSelector: '#viewer-img',
                    closeButtonSelector: '#close-viewer'
                });
                break;

            case 'section':
                createImageViewer({
                    gallerySelector: '.section img',
                    viewerSelector: '#image-viewer',
                    viewerImgSelector: '#viewer-img',
                    closeButtonSelector: '#close-viewer'
                });
                break;

            case 'slider-section':
                createImageViewer({
                    gallerySelector: '.slider-section img',
                    viewerSelector: '#image-viewer',
                    viewerImgSelector: '#viewer-img',
                    closeButtonSelector: '#close-viewer'
                });
                break;

            case 'about-section':
                createImageViewer({
                    gallerySelector: '.about-us img',
                    viewerSelector: '#image-viewer',
                    viewerImgSelector: '#viewer-img',
                    closeButtonSelector: '#close-viewer'
                });
                break;

            default:
                console.error('Unbekannter Selektortyp:', selectorType);
                break;
        }
    } catch (error) {
        console.error('Fehler beim Initialisieren des ImageViewers:', error);
    }
}

// Verwendung der Funktion
initializeImageViewer('gallery');
initializeImageViewer('image-container');
initializeImageViewer('section');
initializeImageViewer('slider-section');
initializeImageViewer('about-section');

