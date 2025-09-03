// DOM Robustness Testing JavaScript
// This script provides functionality for testing WebFAST algorithm robustness

class RobustnessTestManager {
    constructor() {
        this.dynamicIdCounter = 1;
        this.testResults = {};
        this.init();
    }

    init() {
        this.setupDynamicIdButton();
        this.setupListInteractions();
        this.setupAriaButton();
        this.setupNestedElementTests();
        this.initializeMetrics();
    }

    // Dynamic ID Button functionality
    setupDynamicIdButton() {
        const dynamicButton = document.getElementById('dynamic-id-btn');
        if (dynamicButton) {
            dynamicButton.addEventListener('click', () => {
                const oldId = dynamicButton.id;
                const newId = `dynamic-btn-${this.dynamicIdCounter++}`;
                dynamicButton.id = newId;
                
                // Update button text to reflect ID change
                dynamicButton.innerHTML = `🔄 Dynamic ID Button (ID: ${newId})`;
                
                // Log the ID change for testing purposes
                this.logEvent('dynamic-id-change', {
                    oldId: oldId,
                    newId: newId,
                    timestamp: Date.now()
                });

                // Visual feedback
                dynamicButton.style.backgroundColor = '#27ae60';
                setTimeout(() => {
                    dynamicButton.style.backgroundColor = '';
                }, 500);
            });
        }
    }

    // ARIA button functionality
    setupAriaButton() {
        const ariaButton = document.querySelector('[role="button"]');
        if (ariaButton) {
            ariaButton.addEventListener('click', () => {
                this.logEvent('aria-button-click', {
                    role: ariaButton.getAttribute('role'),
                    tagName: ariaButton.tagName,
                    timestamp: Date.now()
                });

                ariaButton.textContent = '✅ ARIA Button Clicked!';
                setTimeout(() => {
                    ariaButton.textContent = '🎯 ARIA Role Button';
                }, 2000);
            });

            // Add keyboard support for accessibility
            ariaButton.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    ariaButton.click();
                }
            });
        }
    }

    // Nested element interactions
    setupNestedElementTests() {
        const nestedElements = document.querySelectorAll('.deeply-nested span');
        nestedElements.forEach((element, index) => {
            element.addEventListener('click', (e) => {
                e.stopPropagation();
                
                this.logEvent('nested-element-click', {
                    elementIndex: index,
                    nestingLevel: this.calculateNestingLevel(element),
                    cssPath: this.generateCssPath(element),
                    timestamp: Date.now()
                });

                // Visual feedback with ripple effect
                this.createRippleEffect(element);
            });
        });
    }

    // List item interactions (no stable IDs)
    setupListInteractions() {
        const listItems = document.querySelectorAll('#unstable-list li');
        listItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                this.logEvent('unstable-list-click', {
                    itemIndex: index,
                    itemText: item.textContent.trim(),
                    timestamp: Date.now()
                });

                // Add temporary highlight
                item.style.backgroundColor = '#fff3cd';
                setTimeout(() => {
                    item.style.backgroundColor = '';
                }, 1000);
            });
        });
    }

    // Calculate nesting level of an element
    calculateNestingLevel(element) {
        let level = 0;
        let parent = element.parentElement;
        while (parent && parent !== document.body) {
            level++;
            parent = parent.parentElement;
        }
        return level;
    }

    // Generate CSS path for element (simplified version)
    generateCssPath(element) {
        const path = [];
        let current = element;
        
        while (current && current !== document.body) {
            let selector = current.tagName.toLowerCase();
            
            if (current.id) {
                selector += `#${current.id}`;
            } else if (current.className) {
                selector += `.${Array.from(current.classList).join('.')}`;
            }
            
            path.unshift(selector);
            current = current.parentElement;
        }
        
        return path.join(' > ');
    }

    // Create visual ripple effect
    createRippleEffect(element) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    // DOM manipulation stress test
    performStressTest() {
        const container = document.getElementById('stress-test-container');
        if (!container) return;

        // Clear existing content
        container.innerHTML = '';

        // Create complex nested structure
        for (let i = 0; i < 5; i++) {
            const section = document.createElement('div');
            section.className = `stress-section-${i}`;
            
            for (let j = 0; j < 3; j++) {
                const subsection = document.createElement('div');
                subsection.className = `stress-subsection-${j}`;
                
                const button = document.createElement('button');
                button.className = 'stress-test-btn';
                button.textContent = `Dynamic Button ${i}-${j}`;
                button.addEventListener('click', () => {
                    this.logEvent('stress-test-click', {
                        sectionIndex: i,
                        subsectionIndex: j,
                        timestamp: Date.now()
                    });
                });
                
                subsection.appendChild(button);
                section.appendChild(subsection);
            }
            
            container.appendChild(section);
        }

        this.logEvent('stress-test-performed', {
            timestamp: Date.now(),
            elementsCreated: 15
        });
    }

    // Event logging system
    logEvent(eventType, data) {
        if (!this.testResults[eventType]) {
            this.testResults[eventType] = [];
        }
        
        this.testResults[eventType].push(data);
        
        // Update metrics display
        this.updateMetricsDisplay();
        
        // Console log for debugging
        console.log(`[WebFAST Robustness Test] ${eventType}:`, data);
    }

    // Initialize metrics tracking
    initializeMetrics() {
        this.startTime = Date.now();
        this.updateMetricsDisplay();
    }

    // Update metrics display
    updateMetricsDisplay() {
        const metricsContainer = document.getElementById('test-metrics');
        if (!metricsContainer) return;

        const totalEvents = Object.values(this.testResults).reduce((sum, events) => sum + events.length, 0);
        const eventTypes = Object.keys(this.testResults).length;
        const testDuration = Date.now() - this.startTime;

        metricsContainer.innerHTML = `
            <div class="metric-card">
                <h4>Total Events</h4>
                <div class="metric-value">${totalEvents}</div>
            </div>
            <div class="metric-card">
                <h4>Event Types</h4>
                <div class="metric-value">${eventTypes}</div>
            </div>
            <div class="metric-card">
                <h4>Test Duration</h4>
                <div class="metric-value">${Math.round(testDuration / 1000)}s</div>
            </div>
        `;
    }

    // Export test results for analysis
    exportTestResults() {
        const results = {
            testResults: this.testResults,
            testDuration: Date.now() - this.startTime,
            timestamp: new Date().toISOString(),
            totalEvents: Object.values(this.testResults).reduce((sum, events) => sum + events.length, 0)
        };

        const blob = new Blob([JSON.stringify(results, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `webfast-robustness-test-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Reset test state
    resetTests() {
        this.testResults = {};
        this.dynamicIdCounter = 1;
        this.startTime = Date.now();
        this.updateMetricsDisplay();
        
        // Reset dynamic button
        const dynamicButton = document.getElementById('dynamic-id-btn') || 
                            document.querySelector('[id^="dynamic-btn-"]');
        if (dynamicButton) {
            dynamicButton.id = 'dynamic-id-btn';
            dynamicButton.innerHTML = '🔄 Dynamic ID Button';
        }
        
        console.log('[WebFAST Robustness Test] Tests reset');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const testManager = new RobustnessTestManager();
    
    // Expose to global scope for external testing
    window.WebFASTRobustnessTest = testManager;
    
    // Setup export button
    const exportBtn = document.getElementById('export-results-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => testManager.exportTestResults());
    }
    
    // Setup reset button
    const resetBtn = document.getElementById('reset-tests-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => testManager.resetTests());
    }
    
    // Setup stress test button
    const stressBtn = document.getElementById('run-stress-test-btn');
    if (stressBtn) {
        stressBtn.addEventListener('click', () => testManager.performStressTest());
    }
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(35, 131, 226, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        margin-top: -10px;
        margin-left: -10px;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .stress-test-btn {
        margin: 0.25rem;
        padding: 0.5rem 1rem;
        background: var(--color-secondary);
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s ease;
    }
    
    .stress-test-btn:hover {
        background: var(--color-primary);
    }
`;
document.head.appendChild(style);