export class DragManager {
    constructor(uiController) {
        this.uic = uiController;
        this.draggableElements = new Map(); // Speichert alle draggable Elemente
    }

    // Element draggable machen
    makeDraggable(elementId) {
        console.log("DragManager: makeDraggable wurde aufgerufen");
        
        const element = this.uic.find(elementId);
        if (!element) {
            console.error(`Element mit ID ${elementId} nicht gefunden`);
            return;
        }

        // Position absolut setzen, falls noch nicht geschehen
        element.style.position = 'absolute';
        element.style.cursor = 'move';
        element.style.userSelect = 'none';
        
        // Tracking-Variablen
        let isDragging = false;
        let offsetX, offsetY;
        
        // Event-Listener
        const mouseDownHandler = (e) => {
            isDragging = true;
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;
            e.preventDefault();
        };
        
        const mouseMoveHandler = (e) => {
            if (!isDragging) return;
            
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            
            element.style.left = x + 'px';
            element.style.top = y + 'px';
        };
        
        const mouseUpHandler = () => {
            isDragging = false;
        };
        
        // Event-Listener hinzufügen
        element.addEventListener('mousedown', mouseDownHandler);
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
        
        // Listener in Map speichern, um sie später entfernen zu können
        this.draggableElements.set(elementId, {
            element,
            listeners: {
                mousedown: mouseDownHandler,
                mousemove: mouseMoveHandler,
                mouseup: mouseUpHandler
            }
        });
        
        return element;
    }
    
    // Element nicht mehr draggable machen
    removeDraggable(elementId) {
        const dragData = this.draggableElements.get(elementId);
        if (!dragData) return;
        
        const { element, listeners } = dragData;
        
        element.removeEventListener('mousedown', listeners.mousedown);
        document.removeEventListener('mousemove', listeners.mousemove);
        document.removeEventListener('mouseup', listeners.mouseup);
        
        this.draggableElements.delete(elementId);
    }
}

