export class DragManager {
    constructor(uiController) {
        this.uic = uiController;
        this.draggableElements = new Map();
        this.activeElement = null;
        
        // Initialisierung der Event-Listener
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Maus-Events
        this.onMouseMove = this.handleMouseMove.bind(this);
        this.onMouseUp = this.handleMouseUp.bind(this);
        
        // Füge globale Event-Listener hinzu
        window.addEventListener('mousemove', this.onMouseMove, { capture: true });
        window.addEventListener('mouseup', this.onMouseUp, { capture: true });
    }

    makeDraggable(elementId) {
        console.log("DragManager: makeDraggable wurde aufgerufen für", elementId);
        
        const element = this.uic.find(elementId);
        if (!element) {
            console.error(`Element mit ID ${elementId} nicht gefunden`);
            return;
        }
        
        // Setze Styling für das draggable Element
        element.style.position = 'absolute';
        element.style.cursor = 'move';
        element.style.userSelect = 'none';
        
        // Mache die initiale Position verfügbar (falls nicht gesetzt)
        if (!element.style.left && !element.style.top) {
            const rect = element.getBoundingClientRect();
            element.style.left = rect.left + 'px';
            element.style.top = rect.top + 'px';
        }
        
        // Erstelle Mousedown-Handler
        const onMouseDown = this.handleMouseDown.bind(this, element);
        element.addEventListener('mousedown', onMouseDown);
        
        // Speichere die Konfiguration
        this.draggableElements.set(elementId, {
            element,
            listeners: {
                mousedown: onMouseDown
            }
        });
        
        return element;
    }
    
    handleMouseDown(element, e) {
        // Vermeide Bubbling
        e.stopPropagation();
        e.preventDefault();
        
        // Setze das aktive Element
        this.activeElement = element;
        
        // Speichere den Offset, damit Elemente nicht zum Cursor springen
        const rect = element.getBoundingClientRect();
        this.offsetX = e.clientX - rect.left;
        this.offsetY = e.clientY - rect.top;
    }
    
    handleMouseMove(e) {
        if (!this.activeElement) return;
        
        // Vermeide Standardaktionen wie Text-Selektion
        e.preventDefault();
        
        // Berechne die neue Position
        // Verwende direkte Position mit Offset-Korrektur
        const x = e.clientX - this.offsetX;
        const y = e.clientY - this.offsetY;
        
        // Setze die neue Position sofort für beste Responsivität
        this.activeElement.style.left = x + 'px';
        this.activeElement.style.top = y + 'px';
    }
    
    handleMouseUp() {
        this.activeElement = null;
    }
    
    removeDraggable(elementId) {
        const dragData = this.draggableElements.get(elementId);
        if (!dragData) return;
        
        const { element, listeners } = dragData;
        element.removeEventListener('mousedown', listeners.mousedown);
        
        this.draggableElements.delete(elementId);
    }
    
    // Cleanup
    destroy() {
        window.removeEventListener('mousemove', this.onMouseMove, { capture: true });
        window.removeEventListener('mouseup', this.onMouseUp, { capture: true });
        
        // Entferne alle draggable-Funktionalitäten
        for (const [elementId] of this.draggableElements) {
            this.removeDraggable(elementId);
        }
    }
}