/* (c) 2024 Bookmarklet Collection. MIT License */
(function() {
    'use strict';

    // --- TOP-LEVEL CONSTANTS ---
    const LOCAL_KEYS = {
        theme: 'bookmarklet-theme',
        usage: (slug) => `bookmarklet-usage-${slug}`
    };

    // Set dark theme by default if not set
    const savedTheme = localStorage.getItem(LOCAL_KEYS.theme) || 'dark';
    // Don't set it directly here, let the init function handle it
    // to ensure all theme-related initialization happens in one place

    // --- SNIPPETS DATA ---
    const SNIPPETS = {
        'editable': {
            title: 'Editable Toggle',
            desc: 'Toggle in-place editing of the page body.',
            code: `javascript:(() => {
    window.__editableToggleCount = window.__editableToggleCount || 0;
    const body = document.querySelector('body');
    body.contentEditable = (window.__editableToggleCount % 2 === 0) ? 'true' : 'false';
    window.__editableToggleCount++;
})();`
        },
        'hitboxes': {
            title: 'Hitboxes Outline',
            desc: 'Prompt for a color and outline every element to show hitboxes.',
            code: `javascript:(() => {
    const id = 'hbx';
    const existing = document.getElementById(id);
    if (existing) { existing.remove(); return; }
    const color = prompt('Outline color? (e.g. red or #ff0000)');
    if (!color) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = '* { outline: 2px solid ' + color + ' !important; }';
    document.head.appendChild(style);
})();`
        },
        'invert_colors': {
            title: 'Invert Colors',
            desc: 'Toggle color inversion while attempting to preserve images and media.',
            code: `javascript:(() => {
    const id = 'invert-colors-style';
    let style = document.getElementById(id);
    if (style) { style.remove(); return; }
    style = document.createElement('style'); style.id = id;
    style.textContent = [
        'html { filter: invert(1) hue-rotate(180deg); background: black !important; }',
        'img, video, iframe, picture, svg { filter: invert(1) hue-rotate(180deg) !important; }'
    ].join('\\n');
    document.head.appendChild(style);
})();`
        },
        'remove_styles': {
            title: 'Remove All Styles',
            desc: 'Strip all styling from the current page for better readability.',
            code: `javascript:(() => {
    const style = document.createElement('style');
    style.textContent = '* { all: revert !important; }';
    document.head.appendChild(style);
})();`
        },
        'show_password': {
            title: 'Show Passwords',
            desc: 'Toggle password fields to show their contents.',
            code: `javascript:(() => {
    const inputs = document.querySelectorAll('input[type=password]');
    inputs.forEach(input => {
        input.type = input.type === 'password' ? 'text' : 'password';
    });
})();`
        },
        'find_images': {
            title: 'Find Large Images',
            desc: 'Highlight and list all images larger than a specified size.',
            code: `javascript:(() => {
    const minSize = prompt('Minimum image size in KB?', '100');
    if (!minSize) return;
    const size = parseInt(minSize) * 1024;
    const images = Array.from(document.images).filter(img => img.naturalWidth * img.naturalHeight > 0);
    
    images.forEach(img => {
        if (img.src && img.naturalWidth * img.naturalHeight > size) {
            img.style.outline = '4px solid #ff0000';
            img.style.boxShadow = '0 0 10px #ff0000';
        }
    });
    
    alert('Found ' + images.length + ' images. Large images are highlighted in red.');
})();`
        },
        'word_count': {
            title: 'Word Count',
            desc: 'Count and display the number of words on the page.',
            code: `javascript:(() => {
    const text = document.body.innerText;
    const wordCount = text.trim().split(/\\s+/).length;
    alert('Word count: ' + wordCount);
})();`
        },
        'scroll_to_top': {
            title: 'Scroll to Top',
            desc: 'Smoothly scroll to the top of the page.',
            code: `javascript:(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
})();`
        },
        'table_to_csv': {
            title: 'Table to CSV',
            desc: 'Convert HTML tables to CSV format that can be copied to clipboard.',
            code: `javascript:(() => {
    const tables = document.querySelectorAll('table');
    if (tables.length === 0) {
        alert('No tables found on this page.');
        return;
    }
    
    let csvContent = '';
    tables.forEach((table, index) => {
        const rows = table.querySelectorAll('tr');
        const csv = [];
        
        rows.forEach(row => {
            const rowData = [];
            const cells = row.querySelectorAll('th, td');
            
            cells.forEach(cell => {
                rowData.push('"' + cell.innerText.replace(/"/g, '""') + '"');
            });
            
            csv.push(rowData.join(','));
        });
        
        csvContent += 'Table ' + (index + 1) + ':\\n' + csv.join('\\n') + '\\n\\n';
    });
    
    navigator.clipboard.writeText(csvContent).then(() => {
        alert('Table(s) copied as CSV to clipboard!');
    }).catch(() => {
        prompt('Copy the following CSV:', csvContent);
    });
})();`
        },
        'clear_storage': {
            title: 'Clear Storage',
            desc: 'Clear localStorage and sessionStorage for the current domain.',
            code: `javascript:(() => {
    if (confirm('Clear all local and session storage for this domain?')) {
        localStorage.clear();
        sessionStorage.clear();
        alert('Storage cleared!');
    }
})();`
        },
        'view_source': {
            title: 'View Source',
            desc: 'View the page source in a new tab.',
            code: `javascript:(() => {
    const source = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Source: ' + 
                  location.href + '</title><style>body{font-family:monospace;white-space:pre;margin:20px;}</style></head><body>' + 
                  document.documentElement.outerHTML.replace(/</g, '&lt;').replace(/>/g, '&gt;') + 
                  '</body></html>';
    const win = window.open('about:blank', '_blank');
    win.document.write(source);
})();`
        },
        'dark_mode': {
            title: 'Dark Mode',
            desc: 'Toggle dark mode for the current page.',
            code: `javascript:(() => {
    const style = document.createElement('style');
    style.id = 'dark-mode-style';
    style.textContent = 'html { filter: invert(1) hue-rotate(180deg) !important; background: #000 !important; } ' +
                       'img, video, iframe, svg { filter: invert(1) hue-rotate(180deg) !important; }';
    
    const existing = document.getElementById('dark-mode-style');
    if (existing) {
        existing.remove();
    } else {
        document.head.appendChild(style);
    }
})();`
        },
        'remove_overlays': {
            title: 'Remove Overlays',
            desc: 'Remove popups, modals, and overlays that block content.',
            code: `javascript:(() => {
    const selectors = [
        '.overlay', '.modal', '.popup', '.lightbox',
        '[class*="overlay"]', '[class*="modal"]',
        '[class*="popup"]', '[class*="lightbox"]',
        '.ReactModal__Overlay', '.fancybox-overlay'
    ];
    
    selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.style.display = 'none';
            el.remove();
        });
    });
    
    document.body.style.overflow = 'auto';
    document.body.style.position = 'static';
})();`
        }
    };

    // --- APP INITIALIZATION ---
    const App = (function() {
        // --- STATE ---
        let dom = {};

        // --- INITIALIZATION ---
        function init() {
            cacheDom();
            bindEvents();
            
            // Set initial theme
            let savedTheme = localStorage.getItem(LOCAL_KEYS.theme) || 'dark';
            
            // Ensure the theme is valid, fallback to dark if not
            if (!THEMES.includes(savedTheme)) {
                savedTheme = 'dark';
                localStorage.setItem(LOCAL_KEYS.theme, savedTheme);
            }
            
            // Apply the theme
            document.documentElement.setAttribute('data-theme', savedTheme);
            
            // Update theme switcher state
            if (dom.themeSwitcher) {
                dom.themeSwitcher.setAttribute('data-theme', savedTheme);
            }
            
            // Force a reflow to ensure the transition happens
            document.documentElement.offsetHeight;
            
            // Render the cards
            renderCards();
        }

        function cacheDom() {
            dom = {
                appContainer: document.getElementById('app-container'),
                themeSwitcher: document.getElementById('theme-switcher'),
                themeList: document.getElementById('theme-list')
            };
        }

        function bindEvents() {
            if (dom.themeSwitcher) {
                dom.themeSwitcher.addEventListener('click', cycleTheme);
            }
        }

        // --- THEME MANAGEMENT ---
        const THEMES = ['light', 'dark', 'ocean', 'sunset', 'midnight'];
        
        function cycleTheme() {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const currentIndex = THEMES.indexOf(currentTheme);
            const nextTheme = THEMES[(currentIndex + 1) % THEMES.length];
            setTheme(nextTheme);
        }

        function setTheme(theme) {
            if (!THEMES.includes(theme)) {
                theme = 'dark'; // Fallback to dark theme
            }
            
            // Save to local storage first
            localStorage.setItem(LOCAL_KEYS.theme, theme);
            
            // Update theme switcher
            if (dom.themeSwitcher) {
                dom.themeSwitcher.setAttribute('data-theme', theme);
            }
            
            // Add transition class
            document.documentElement.classList.add('theme-transition');
            
            // Update the root element's data-theme attribute
            document.documentElement.setAttribute('data-theme', theme);
            
            // Force a reflow to ensure the transition happens
            document.documentElement.offsetHeight;
            
            // Remove transition class after animation
            setTimeout(() => {
                document.documentElement.classList.remove('theme-transition');
            }, 300);
        }
        
        function updateThemeVariables(theme) {
            // This function will be called when the theme changes
            // The actual theme variables are defined in the CSS using [data-theme] selectors
            // We just need to ensure the theme class is properly set on the html element
            document.documentElement.setAttribute('data-theme', theme);
        }

        // --- CARD RENDERING ---
        function renderCards() {
            const fragment = document.createDocumentFragment();
            Object.entries(SNIPPETS).forEach(([slug, data]) => {
                fragment.appendChild(createCardElement(slug, data));
            });
            dom.appContainer.innerHTML = '';
            dom.appContainer.appendChild(fragment);
        }

        function createCardElement(slug, data) {
            const snippet = data;
            if (!snippet) return null;

            const code = snippet.code;
            const description = snippet.desc || 'No description available.';
            const minifiedCode = minifyForHref(code);
            
            // Create card element
            const card = document.createElement('div');
            card.className = 'bookmarklet-card';
            card.dataset.slug = slug;
            card.style.cursor = 'default';
            
            // Store snippet data on the card element
            card._snippetData = snippet;
            
            // Add hover-to-copy tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'copy-tooltip';
            tooltip.textContent = 'Click to copy';
            
            // Add drag handle for drag-to-bookmark
            const dragHandle = document.createElement('div');
            dragHandle.className = 'drag-handle';
            dragHandle.innerHTML = '⋮⋮';
            dragHandle.draggable = true;
            dragHandle.title = 'Drag to bookmarks bar';
            
            // Set up drag data
            dragHandle.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', minifiedCode);
                e.dataTransfer.effectAllowed = 'copy';
                document.getElementById('drag-helper').style.display = 'block';
                e.dataTransfer.setDragImage(document.getElementById('drag-helper'), 0, 0);
            });
            
            dragHandle.addEventListener('dragend', () => {
                document.getElementById('drag-helper').style.display = 'none';
            });

            card.innerHTML = `
                <div class="card-header">
                    <div class="card-title">${escapeHtml(snippet.title || 'Bookmarklet')}</div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <button class="info-button" title="View description">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="16" x2="12" y2="12"></line>
                                <line x1="12" y1="8" x2="12.01" y2="8"></line>
                            </svg>
                            <span>Description</span>
                        </button>
                    </div>
                    <button class="action-button copy-button">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        Copy
                    </button>
                </div>
                <div class="editor-container">
                    <div class="editor">
                        <pre class="editor__code">${syntaxHighlight(snippet.code)}</pre>
                    </div>
                </div>
            `;

            // Add event listeners
            const copyButton = card.querySelector('.copy-button');
            const infoButton = card.querySelector('.info-button');
            const codeElement = card.querySelector('.editor__code');

            // Toggle code visibility on card click and handle copy on left-click
            card.addEventListener('click', (e) => {
                // If clicking on code, copy it
                if (e.target === codeElement || e.target.closest('.editor__code')) {
                    e.preventDefault();
                    e.stopPropagation();
                    copyToClipboard(minifyForHref(snippetCode))
                        .then(() => {
                            showCopyFeedback('Bookmarklet copied to clipboard!');
                            updateUsage(slug, { copy: true });
                            
                            // Add mini feedback
                            const feedback = document.createElement('div');
                            feedback.className = 'copy-feedback-mini';
                            feedback.textContent = 'Copied!';
                            document.body.appendChild(feedback);
                            
                            // Position near the cursor
                            const x = e.clientX;
                            const y = e.clientY - 40;
                            feedback.style.left = `${x}px`;
                            feedback.style.top = `${y}px`;
                            
                            // Show and then remove feedback
                            requestAnimationFrame(() => {
                                feedback.classList.add('show');
                                setTimeout(() => {
                                    feedback.classList.remove('show');
                                    setTimeout(() => {
                                        if (feedback.parentNode) feedback.remove();
                                    }, 200);
                                }, 1000);
                            });
                        })
                        .catch(err => {
                            console.error('Failed to copy:', err);
                            showCopyFeedback('Failed to copy to clipboard', 'error');
                        });
                }
                // Toggle expansion for card click
                else if (e.target === card) {
                    card.classList.toggle('expanded');
                }
            });

            // Set up event listeners
            const snippetData = card._snippetData;
            const snippetCode = snippetData.code;
            const snippetTitle = snippetData.title;
            const snippetDesc = snippetData.desc;

            // Copy button with animation
            copyButton.addEventListener('click', (e) => {
                e.stopPropagation();
                copyToClipboard(minifyForHref(snippetCode))
                    .then(() => {
                        showCopyFeedback('Bookmarklet copied!');
                        updateUsage(slug, { copy: true });
                        copyButton.classList.add('pulse');
                        setTimeout(() => copyButton.classList.remove('pulse'), 300);
                    })
                    .catch(err => {
                        console.error('Failed to copy:', err);
                        showCopyFeedback('Failed to copy', 'error');
                    });
            });

            // Info button - show description modal
            infoButton.addEventListener('click', (e) => {
                e.stopPropagation();
                createDescriptionModal(snippetTitle, snippetDesc, snippetCode);
            });

            // Right-click to copy with visual feedback
            card.addEventListener('contextmenu', (e) => {
                if (e.target === card || e.target === codeElement || e.target.closest('.editor__code')) {
                    e.preventDefault();
                    copyToClipboard(minifyForHref(snippetCode))
                        .then(() => {
                            // First show the main feedback
                            showCopyFeedback('Bookmarklet copied to clipboard!');
                            updateUsage(slug, { copy: true });
                            
                            // Create and position the mini feedback
                            const feedback = document.createElement('div');
                            feedback.className = 'copy-feedback-mini';
                            feedback.textContent = 'Copied!';
                            document.body.appendChild(feedback); // Append to body to ensure it's on top
                            
                            // Position the feedback near the cursor
                            const x = e.clientX;
                            const y = e.clientY - 40; // Position above the cursor
                            
                            feedback.style.left = `${x}px`;
                            feedback.style.top = `${y}px`;
                            
                            // Show the feedback
                            requestAnimationFrame(() => {
                                feedback.classList.add('show');
                                
                                // Hide and remove after delay
                                setTimeout(() => {
                                    feedback.classList.remove('show');
                                    setTimeout(() => {
                                        if (feedback.parentNode) {
                                            feedback.remove();
                                        }
                                    }, 200);
                                }, 1000);
                            });
                        })
                        .catch(err => {
                            console.error('Failed to copy:', err);
                            showCopyFeedback('Failed to copy to clipboard', 'error');
                        });
                }
            });

            return card;
        }

        // --- MODAL & FEEDBACK ---
        function createDescriptionModal(title, description, code) {
            const modal = document.createElement('div');
            modal.className = 'description-card';
            modal.innerHTML = `
                <button class="close-btn" aria-label="Close">&times;</button>
                <h3>${escapeHtml(title)}</h3>
                <p>${escapeHtml(description)}</p>
                <div class="card-actions">
                    <button class="action-button copy-button" style="width: 100%; justify-content: center;">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        Copy Bookmarklet
                    </button>
                </div>
            `;

            const closeBtn = modal.querySelector('.close-btn');
            const copyBtn = modal.querySelector('.copy-button');
            const runBtn = modal.querySelector('.run-button');
            const overlay = document.createElement('div');
            overlay.className = 'overlay';

            const closeModal = () => {
                modal.classList.remove('visible');
                overlay.classList.remove('visible');
                setTimeout(() => {
                    if (modal.parentNode) document.body.removeChild(modal);
                    if (overlay.parentNode) document.body.removeChild(overlay);
                }, 300);
            };

            closeBtn.addEventListener('click', closeModal);
            overlay.addEventListener('click', closeModal);
            
            if (copyBtn) {
                copyBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    copyToClipboard(code)
                        .then(() => showCopyFeedback('Code copied to clipboard!'))
                        .catch(() => showCopyFeedback('Failed to copy code', 'error'));
                });
            }

            if (runBtn) {
                runBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    runSnippet(code);
                    closeModal();
                });
            }

            document.body.appendChild(overlay);
            document.body.appendChild(modal);
            
            // Trigger animation
            setTimeout(() => {
                modal.classList.add('visible');
                overlay.classList.add('visible');
            }, 10);
            
            return modal;
        }

        function showCopyFeedback(message, type = 'success') {
            // Remove any existing feedback
            const existingFeedback = document.querySelector('.copy-feedback');
            if (existingFeedback) {
                existingFeedback.remove();
            }

            const feedback = document.createElement('div');
            feedback.className = `copy-feedback ${type}`;
            feedback.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span>${message}</span>
            `;
            
            document.body.appendChild(feedback);
            
            // Trigger animation
            requestAnimationFrame(() => {
                feedback.classList.add('visible');
            });
            
            // Remove after delay
            setTimeout(() => {
                feedback.classList.remove('visible');
                setTimeout(() => {
                    if (feedback.parentNode) {
                        feedback.remove();
                    }
                }, 300);
            }, 2000);
        }

        // --- SNIPPET ACTIONS ---
        function runSnippet(code) {
            const cleanCode = code.startsWith('javascript:') ? code.substring(11) : code;
            console.log(`%cExecuting Bookmarklet at ${new Date().toLocaleTimeString()}`, 'font-weight: bold; color: orange;');
            console.warn('Security: This code runs with full permissions on the current page.');
            try {
                new Function(cleanCode)();
                return true;
            } catch (e) {
                console.error('Bookmarklet execution failed:', e);
                showCopyFeedback(`Error: ${e.message}`, 'error');
                return false;
            }
        }

        // --- HELPERS ---
        function updateUsage(slug, { copy = false, run = false }) {
            const key = LOCAL_KEYS.usage(slug);
            const usage = JSON.parse(localStorage.getItem(key) || '{"copies":0,"runs":0}');
            if (copy) usage.copies++;
            if (run) usage.runs++;
            usage.lastUsed = new Date().toISOString();
            localStorage.setItem(key, JSON.stringify(usage));
        }

        return { init };
    })();

    // --- UTILITIES ---
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function minifyForHref(code) {
        return 'javascript:' + code
            .replace(/^javascript:/, '')
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/\/\/.*$/gm, '')
            .replace(/\s+/g, ' ')
            .replace(/\s*([{}()\[\]=+\-*\/%<>!&|?:;,.])\s*/g, '$1')
            .trim();
    }

    function copyToClipboard(text) {
        if (navigator.clipboard) {
            return navigator.clipboard.writeText(text);
        }
        
        // Fallback for older browsers
        return new Promise((resolve, reject) => {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();

            try {
                const successful = document.execCommand('copy');
                document.body.removeChild(textarea);
                if (successful) {
                    resolve();
                } else {
                    reject(new Error('Failed to copy text'));
                }
            } catch (err) {
                document.body.removeChild(textarea);
                reject(err);
            }
        });
    }

    function syntaxHighlight(code) {
        // Remove the javascript: prefix if present
        let cleanCode = code.startsWith('javascript:') ? code.substring(11) : code;
        
        // Remove IIFE wrapper if present
        cleanCode = cleanCode
            .replace(/^\(\s*function\s*\([^)]*\)\s*\{|^\(\(\)\s*=>\s*\{/m, '')
            .replace(/}\)\(\)\s*;?\s*$/, '')
            .trim();
        
        // Basic syntax highlighting
        return escapeHtml(cleanCode)
            .replace(/(\/\*[\s\S]*?\*\/|\/\/.*)/g, '<span class="token comment">$&</span>')
            .replace(/(['"])(?:(?!\1)[^\\]|\\.)*?\1/g, '<span class="token string">$&</span>')
            .replace(/\b(const|let|var|function|return|if|else|for|while|in|of|new|this|true|false|null|undefined|document|window|console|try|catch|alert|prompt)\b/g, 
                '<span class="token keyword">$&</span>')
            .replace(/\b(\d+)\b/g, '<span class="token number">$&</span>');
    }

    // --- INITIALIZE APP ---
    document.addEventListener('DOMContentLoaded', () => {
        if (window.App && typeof window.App.init === 'function') {
            window.App.init();
        } else {
            console.error('App not found or init function missing');
        }
    });

    // Make App globally available
    window.App = App;
})();