/* (c) 2024 Bookmarklet Collection. MIT License */
(function() {
    'use strict';

    // --- TOP-LEVEL CONSTANTS ---
    const LOCAL_KEYS = {
        theme: 'bookmarklet-theme',
        usage: (slug) => `bookmarklet-usage-${slug}`
    };

    // Set flamingo theme by default if not set
    const savedTheme = localStorage.getItem(LOCAL_KEYS.theme) || 'flamingo';
    // Don't set it directly here, let the init function handle it
    // to ensure all theme-related initialization happens in one place

    // --- SNIPPETS DATA ---
    const SNIPPETS = {
        // Development Tools
        'word-count': {
            title: 'Word Counter',
            desc: 'Count words, characters, and paragraphs on any webpage',
            category: 'Development',
            code: `javascript:(function(){var t=document.body.innerText||document.body.textContent||'';var w=t.trim().split(/\\s+/).length;var c=t.length;var p=t.split(/\\n\\s*\\n/).length;alert('Words: '+w+'\\nCharacters: '+c+'\\nParagraphs: '+p);})();`,
            tags: ['text', 'analysis', 'writing']
        },
        'highlight-links': {
            title: 'Highlight All Links',
            desc: 'Highlight all clickable links on the page with a bright border',
            category: 'Development',
            code: `javascript:(function(){var links=document.getElementsByTagName('a');for(var i=0;i<links.length;i++){links[i].style.border='3px solid red';links[i].style.backgroundColor='yellow';}})();`,
            tags: ['links', 'debug', 'navigation']
        },
        'image-alt-text': {
            title: 'Show Image Alt Text',
            desc: 'Display alt text for all images on the page',
            category: 'Development',
            code: `javascript:(function(){var imgs=document.getElementsByTagName('img');for(var i=0;i<imgs.length;i++){var alt=imgs[i].alt||'(no alt text)';imgs[i].style.border='2px solid blue';imgs[i].title=alt;imgs[i].setAttribute('data-original-title',alt);}alert('Hover over images to see alt text');})();`,
            tags: ['accessibility', 'images', 'alt-text']
        },
        'color-picker': {
            title: 'Color Picker',
            desc: 'Click on any element to see its color information',
            category: 'Development',
            code: `javascript:(function(){function getColor(el){var style=window.getComputedStyle(el);return{bg:style.backgroundColor,color:style.color,border:style.borderColor};}function showColors(e){e.preventDefault();var colors=getColor(e.target);alert('Background: '+colors.bg+'\\nText: '+colors.color+'\\nBorder: '+colors.border);document.removeEventListener('click',showColors,true);}alert('Click on any element to see its colors');document.addEventListener('click',showColors,true);})();`,
            tags: ['colors', 'css', 'design']
        },
        'page-info': {
            title: 'Page Information',
            desc: 'Display detailed information about the current page',
            category: 'Development',
            code: `javascript:(function(){var info='Page Info:\\n\\n';info+='Title: '+document.title+'\\n';info+='URL: '+window.location.href+'\\n';info+='Domain: '+window.location.hostname+'\\n';info+='Last Modified: '+document.lastModified+'\\n';info+='Images: '+document.images.length+'\\n';info+='Links: '+document.links.length+'\\n';info+='Forms: '+document.forms.length+'\\n';info+='Scripts: '+document.scripts.length;alert(info);})();`,
            tags: ['info', 'debug', 'analysis']
        },
        'view-source': {
            title: 'View Page Source',
            desc: 'Open the page source in a new window',
            category: 'Development',
            code: `javascript:(function(){window.open('view-source:'+location.href);})();`,
            tags: ['source', 'html', 'debug']
        },
        'outline-elements': {
            title: 'Outline All Elements',
            desc: 'Add colored outlines to all HTML elements for layout debugging',
            category: 'Development',
            code: `javascript:(function(){var css='*{outline:1px solid red!important;}div{outline-color:blue!important;}span{outline-color:green!important;}p{outline-color:orange!important;}';var style=document.createElement('style');style.innerHTML=css;document.head.appendChild(style);})();`,
            tags: ['layout', 'debug', 'css']
        },
        'responsive-test': {
            title: 'Responsive Design Test',
            desc: 'Test common mobile and tablet viewport sizes',
            category: 'Development',
            code: `javascript:(function(){var sizes=[{name:'iPhone',w:375,h:667},{name:'iPad',w:768,h:1024},{name:'Desktop',w:1200,h:800}];var current=0;function resize(){var size=sizes[current];window.resizeTo(size.w,size.h);alert('Viewport: '+size.name+' ('+size.w+'x'+size.h+')');current=(current+1)%sizes.length;}resize();})();`,
            tags: ['responsive', 'mobile', 'testing']
        },
        'console-clear': {
            title: 'Clear Console',
            desc: 'Clear the browser console and show a success message',
            category: 'Development',
            code: `javascript:(function(){console.clear();console.log('%cConsole cleared! 🧹','color:green;font-size:16px;font-weight:bold;');alert('Console cleared successfully!');})();`,
            tags: ['console', 'debug', 'clean']
        },
        'find-broken-images': {
            title: 'Find Broken Images',
            desc: 'Highlight all broken images on the page',
            category: 'Development',
            code: `javascript:(function(){var imgs=document.getElementsByTagName('img');var broken=0;for(var i=0;i<imgs.length;i++){if(!imgs[i].complete||imgs[i].naturalWidth===0){imgs[i].style.border='3px solid red';imgs[i].style.backgroundColor='pink';broken++;}}alert('Found '+broken+' broken images (highlighted in red)');})();`,
            tags: ['images', 'debug', 'broken']
        },

        // Productivity Tools
        'extract-emails': {
            title: 'Extract Emails',
            desc: 'Find and display all email addresses on the current page',
            category: 'Productivity',
            code: `javascript:(function(){var emails=document.body.innerHTML.match(/[\\w\\.-]+@[\\w\\.-]+\\.[a-zA-Z]{2,}/g);if(emails){var unique=[...new Set(emails)];prompt('Found '+unique.length+' unique emails (copy with Ctrl+C):',unique.join('\\n'));}else{alert('No emails found');}})();`,
            tags: ['email', 'extract', 'contact']
        },
        'extract-phone': {
            title: 'Extract Phone Numbers',
            desc: 'Find and display all phone numbers on the page',
            category: 'Productivity',
            code: `javascript:(function(){var phones=document.body.innerHTML.match(/\\b\\d{3}[-.]?\\d{3}[-.]?\\d{4}\\b|\\(\\d{3}\\)\\s?\\d{3}[-.]?\\d{4}/g);if(phones){var unique=[...new Set(phones)];prompt('Found '+unique.length+' phone numbers (copy with Ctrl+C):',unique.join('\\n'));}else{alert('No phone numbers found');}})();`,
            tags: ['phone', 'extract', 'contact']
        },
        'qr-generator': {
            title: 'QR Code Generator',
            desc: 'Generate a QR code for the current page URL',
            category: 'Productivity',
            code: `javascript:(function(){var url=encodeURIComponent(window.location.href);window.open('https://api.qrserver.com/v1/create-qr-code/?size=300x300&data='+url,'_blank');})();`,
            tags: ['qr', 'share', 'mobile']
        },
        'print-clean': {
            title: 'Print Clean',
            desc: 'Remove ads and unnecessary elements before printing',
            category: 'Productivity',
            code: `javascript:(function(){var elements=document.querySelectorAll('header,nav,aside,footer,.sidebar,.ads,.advertisement,.social,.comments');for(var i=0;i<elements.length;i++){elements[i].style.display='none';}window.print();})();`,
            tags: ['print', 'clean', 'remove']
        },
        'save-as-pdf': {
            title: 'Save as PDF',
            desc: 'Open the browser print dialog optimized for PDF saving',
            category: 'Productivity',
            code: `javascript:(function(){var css='@media print{*{-webkit-print-color-adjust:exact!important;color-adjust:exact!important;}}';var style=document.createElement('style');style.innerHTML=css;document.head.appendChild(style);window.print();})();`,
            tags: ['pdf', 'save', 'print']
        },
        'copy-url': {
            title: 'Copy Current URL',
            desc: 'Copy the current page URL to clipboard',
            category: 'Productivity',
            code: `javascript:(function(){navigator.clipboard.writeText(window.location.href).then(function(){alert('URL copied to clipboard!');}).catch(function(){prompt('Copy this URL:',window.location.href);});})();`,
            tags: ['url', 'copy', 'clipboard']
        },
        'word-replace': {
            title: 'Find & Replace Text',
            desc: 'Find and replace text on the current page',
            category: 'Productivity',
            code: `javascript:(function(){var find=prompt('Find text:');if(find){var replace=prompt('Replace with:');if(replace!==null){var regex=new RegExp(find,'gi');document.body.innerHTML=document.body.innerHTML.replace(regex,replace);alert('Replaced all instances of "'+find+'" with "'+replace+'"');}}})();`,
            tags: ['text', 'replace', 'edit']
        },
        'timer': {
            title: 'Page Timer',
            desc: 'Start a timer to track time spent on the page',
            category: 'Productivity',
            code: `javascript:(function(){if(window.pageTimer){clearInterval(window.pageTimer);delete window.pageTimer;alert('Timer stopped!');}else{var start=Date.now();window.pageTimer=setInterval(function(){var elapsed=Math.floor((Date.now()-start)/1000);document.title='['+Math.floor(elapsed/60)+':'+String(elapsed%60).padStart(2,'0')+'] '+document.title.replace(/^\\[\\d+:\\d+\\] /,'');},1000);alert('Timer started! Check the page title.');}})();`,
            tags: ['timer', 'productivity', 'tracking']
        },

        // Reading Tools
        'reading-mode': {
            title: 'Reading Mode',
            desc: 'Strip away distractions and focus on the main content',
            category: 'Reading',
            code: `javascript:(function(){var d=document;var s=d.createElement('style');s.innerHTML='*{background:white!important;color:black!important;font-family:Georgia,serif!important;line-height:1.6!important;}img,video{max-width:100%!important;}';d.head.appendChild(s);var els=d.querySelectorAll('header,nav,aside,footer,.sidebar,.ads,.social');for(var i=0;i<els.length;i++){els[i].style.display='none';}})();`,
            tags: ['reading', 'focus', 'clean']
        },
        'font-size-toggle': {
            title: 'Font Size Toggle',
            desc: 'Increase font size for better readability',
            category: 'Reading',
            code: `javascript:(function(){var currentSize=window.fontSize||16;var newSize=currentSize>=24?16:currentSize+4;document.body.style.fontSize=newSize+'px';window.fontSize=newSize;alert('Font size: '+newSize+'px');})();`,
            tags: ['font', 'accessibility', 'reading']
        },
        'dark-mode': {
            title: 'Dark Mode Toggle',
            desc: 'Toggle dark mode for any website',
            category: 'Reading',
            code: `javascript:(function(){if(document.body.style.filter==='invert(1) hue-rotate(180deg)'){document.body.style.filter='';document.body.style.background='';}else{document.body.style.filter='invert(1) hue-rotate(180deg)';document.body.style.background='#111';}})();`,
            tags: ['dark', 'theme', 'invert']
        },
        'reading-time': {
            title: 'Reading Time Calculator',
            desc: 'Calculate estimated reading time for the page content',
            category: 'Reading',
            code: `javascript:(function(){var text=document.body.innerText||document.body.textContent||'';var words=text.trim().split(/\\s+/).length;var minutes=Math.ceil(words/200);alert('Estimated reading time: '+minutes+' minute'+(minutes!==1?'s':'')+' ('+words+' words)');})();`,
            tags: ['reading', 'time', 'estimate']
        },
        'text-to-speech': {
            title: 'Text to Speech',
            desc: 'Read the page content aloud using browser speech synthesis',
            category: 'Reading',
            code: `javascript:(function(){if(window.speechSynthesis.speaking){window.speechSynthesis.cancel();alert('Speech stopped');}else{var text=document.body.innerText||document.body.textContent||'';if(text.length>500)text=text.substring(0,500)+'...';var utterance=new SpeechSynthesisUtterance(text);window.speechSynthesis.speak(utterance);alert('Reading page content...');}})();`,
            tags: ['speech', 'audio', 'accessibility']
        },

        // Social Media & Sharing
        'social-share': {
            title: 'Quick Share',
            desc: 'Open sharing options for the current page',
            category: 'Social Media',
            code: `javascript:(function(){var url=encodeURIComponent(window.location.href);var title=encodeURIComponent(document.title);var twitter='https://twitter.com/intent/tweet?url='+url+'&text='+title;var facebook='https://www.facebook.com/sharer/sharer.php?u='+url;var linkedin='https://www.linkedin.com/sharing/share-offsite/?url='+url;if(navigator.share){navigator.share({title:document.title,url:window.location.href});}else{var choice=prompt('Choose sharing option:\\n1. Twitter\\n2. Facebook\\n3. LinkedIn\\n4. Copy URL\\n\\nEnter number (1-4):');if(choice==='1')window.open(twitter);else if(choice==='2')window.open(facebook);else if(choice==='3')window.open(linkedin);else if(choice==='4')navigator.clipboard.writeText(window.location.href).then(()=>alert('URL copied!'));}})();`,
            tags: ['sharing', 'social', 'url']
        },
        'tweet-page': {
            title: 'Tweet This Page',
            desc: 'Quickly tweet the current page with title and URL',
            category: 'Social Media',
            code: `javascript:(function(){var url=encodeURIComponent(window.location.href);var title=encodeURIComponent(document.title);window.open('https://twitter.com/intent/tweet?text='+title+'&url='+url,'_blank');})();`,
            tags: ['twitter', 'tweet', 'share']
        },
        'linkedin-share': {
            title: 'Share on LinkedIn',
            desc: 'Share the current page on LinkedIn',
            category: 'Social Media',
            code: `javascript:(function(){var url=encodeURIComponent(window.location.href);window.open('https://www.linkedin.com/sharing/share-offsite/?url='+url,'_blank');})();`,
            tags: ['linkedin', 'professional', 'share']
        },
        'reddit-submit': {
            title: 'Submit to Reddit',
            desc: 'Submit the current page to Reddit',
            category: 'Social Media',
            code: `javascript:(function(){var url=encodeURIComponent(window.location.href);var title=encodeURIComponent(document.title);window.open('https://www.reddit.com/submit?url='+url+'&title='+title,'_blank');})();`,
            tags: ['reddit', 'submit', 'community']
        },

        // Utilities
        'password-reveal': {
            title: 'Password Revealer',
            desc: 'Show hidden passwords in password fields',
            category: 'Utilities',
            code: `javascript:(function(){var inputs=document.querySelectorAll('input[type="password"]');for(var i=0;i<inputs.length;i++){inputs[i].type='text';}alert('All passwords revealed!');})();`,
            tags: ['password', 'form', 'debug']
        },
        'translate-page': {
            title: 'Translate Page',
            desc: 'Open Google Translate for the current page',
            category: 'Utilities',
            code: `javascript:(function(){window.open('https://translate.google.com/translate?sl=auto&tl=en&u='+encodeURIComponent(window.location.href),'_blank');})();`,
            tags: ['translate', 'language', 'google']
        },
        'scroll-to-top': {
            title: 'Scroll to Top',
            desc: 'Smoothly scroll to the top of the page',
            category: 'Utilities',
            code: `javascript:(function(){window.scrollTo({top:0,behavior:'smooth'});})();`,
            tags: ['scroll', 'navigation', 'top']
        },
        'scroll-to-bottom': {
            title: 'Scroll to Bottom',
            desc: 'Smoothly scroll to the bottom of the page',
            category: 'Utilities',
            code: `javascript:(function(){window.scrollTo({top:document.body.scrollHeight,behavior:'smooth'});})();`,
            tags: ['scroll', 'navigation', 'bottom']
        },
        'auto-scroll': {
            title: 'Auto Scroll',
            desc: 'Automatically scroll the page at a steady pace',
            category: 'Utilities',
            code: `javascript:(function(){if(window.autoScroller){clearInterval(window.autoScroller);delete window.autoScroller;alert('Auto scroll stopped');}else{window.autoScroller=setInterval(function(){window.scrollBy(0,1);},50);alert('Auto scroll started (run again to stop)');}})();`,
            tags: ['scroll', 'auto', 'reading']
        },
        'remove-ads': {
            title: 'Ad Blocker',
            desc: 'Remove common advertisement elements from the page',
            category: 'Utilities',
            code: `javascript:(function(){var selectors=['.ad','.ads','[id*="ad"]','[class*="ad"]','.advertisement','.banner','.popup','.modal','iframe[src*="ads"]','iframe[src*="doubleclick"]'];selectors.forEach(function(sel){var els=document.querySelectorAll(sel);for(var i=0;i<els.length;i++){els[i].style.display='none';}});alert('Ads removed!');})();`,
            tags: ['ads', 'block', 'clean']
        },
        'cookie-notice': {
            title: 'Remove Cookie Notices',
            desc: 'Remove annoying cookie consent banners',
            category: 'Utilities',
            code: `javascript:(function(){var selectors=['.cookie','.gdpr','[id*="cookie"]','[class*="cookie"]','[id*="consent"]','[class*="consent"]','.privacy-notice'];selectors.forEach(function(sel){var els=document.querySelectorAll(sel);for(var i=0;i<els.length;i++){els[i].style.display='none';}});alert('Cookie notices removed!');})();`,
            tags: ['cookies', 'gdpr', 'privacy']
        },
        'wayback-machine': {
            title: 'Wayback Machine',
            desc: 'View the current page in the Internet Archive',
            category: 'Utilities',
            code: `javascript:(function(){window.open('https://web.archive.org/web/*/'+window.location.href,'_blank');})();`,
            tags: ['archive', 'history', 'wayback']
        },
        'page-speed': {
            title: 'Page Speed Test',
            desc: 'Test page speed with Google PageSpeed Insights',
            category: 'Utilities',
            code: `javascript:(function(){window.open('https://pagespeed.web.dev/report?url='+encodeURIComponent(window.location.href),'_blank');})();`,
            tags: ['speed', 'performance', 'google']
        },
        'whois-lookup': {
            title: 'WHOIS Lookup',
            desc: 'Look up domain information for the current site',
            category: 'Utilities',
            code: `javascript:(function(){var domain=window.location.hostname;window.open('https://whois.net/'+domain,'_blank');})();`,
            tags: ['whois', 'domain', 'info']
        },

        // Visual & Design
        'rainbow-text': {
            title: 'Rainbow Text',
            desc: 'Make all text on the page rainbow colored',
            category: 'Visual',
            code: `javascript:(function(){var elements=document.querySelectorAll('*');var colors=['red','orange','yellow','green','blue','indigo','violet'];for(var i=0;i<elements.length;i++){if(elements[i].innerText&&elements[i].children.length===0){elements[i].style.color=colors[i%colors.length];}}})();`,
            tags: ['rainbow', 'color', 'fun']
        },
        'grayscale': {
            title: 'Grayscale Mode',
            desc: 'Convert the entire page to grayscale',
            category: 'Visual',
            code: `javascript:(function(){if(document.body.style.filter==='grayscale(100%)'){document.body.style.filter='';}else{document.body.style.filter='grayscale(100%)';}})();`,
            tags: ['grayscale', 'filter', 'visual']
        },
        'blur-images': {
            title: 'Blur All Images',
            desc: 'Blur all images on the page (toggle on/off)',
            category: 'Visual',
            code: `javascript:(function(){var imgs=document.getElementsByTagName('img');var isBlurred=imgs[0]&&imgs[0].style.filter==='blur(10px)';for(var i=0;i<imgs.length;i++){imgs[i].style.filter=isBlurred?'':'blur(10px)';}alert(isBlurred?'Images unblurred':'Images blurred');})();`,
            tags: ['blur', 'images', 'privacy']
        },
        'zoom-page': {
            title: 'Zoom Page',
            desc: 'Zoom the page in or out',
            category: 'Visual',
            code: `javascript:(function(){var currentZoom=window.zoomLevel||100;var newZoom=currentZoom>=150?100:currentZoom+25;document.body.style.zoom=newZoom+'%';window.zoomLevel=newZoom;alert('Zoom: '+newZoom+'%');})();`,
            tags: ['zoom', 'scale', 'accessibility']
        },
        'night-mode': {
            title: 'Night Mode',
            desc: 'Apply a warm, eye-friendly filter for night reading',
            category: 'Visual',
            code: `javascript:(function(){if(document.body.style.filter.includes('sepia')){document.body.style.filter='';}else{document.body.style.filter='sepia(100%) saturate(90%) hue-rotate(315deg) brightness(0.8)';}})();`,
            tags: ['night', 'sepia', 'eyes']
        },

        // Security & Privacy
        'clear-cookies': {
            title: 'Clear Site Cookies',
            desc: 'Clear all cookies for the current domain',
            category: 'Security',
            code: `javascript:(function(){var cookies=document.cookie.split(';');for(var i=0;i<cookies.length;i++){var cookie=cookies[i];var eqPos=cookie.indexOf('=');var name=eqPos>-1?cookie.substr(0,eqPos).trim():cookie.trim();document.cookie=name+'=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';}alert('Cookies cleared for '+window.location.hostname);})();`,
            tags: ['cookies', 'privacy', 'clear']
        },
        'show-passwords': {
            title: 'Show All Passwords',
            desc: 'Reveal all password fields on the page',
            category: 'Security',
            code: `javascript:(function(){var inputs=document.querySelectorAll('input[type="password"]');var count=0;for(var i=0;i<inputs.length;i++){inputs[i].type='text';count++;}alert('Revealed '+count+' password fields');})();`,
            tags: ['password', 'reveal', 'form']
        },
        'ssl-check': {
            title: 'SSL Certificate Info',
            desc: 'Check if the current page is using HTTPS',
            category: 'Security',
            code: `javascript:(function(){var protocol=window.location.protocol;var isSecure=protocol==='https:';var message=isSecure?'✅ This page is secure (HTTPS)':'⚠️ This page is NOT secure (HTTP)';alert(message+'\\n\\nProtocol: '+protocol+'\\nDomain: '+window.location.hostname);})();`,
            tags: ['ssl', 'https', 'security']
        },

        // Fun & Entertainment
        'konami-code': {
            title: 'Konami Code',
            desc: 'Add the famous Konami code easter egg to any page',
            category: 'Fun',
            code: `javascript:(function(){var keys=[];var konami=[38,38,40,40,37,39,37,39,66,65];document.addEventListener('keydown',function(e){keys.push(e.keyCode);if(keys.length>konami.length)keys.shift();if(keys.join(',')==konami.join(',')){alert('🎉 KONAMI CODE ACTIVATED! 🎉');document.body.style.transform='rotate(360deg)';document.body.style.transition='transform 2s';}});alert('Konami code listener added! Try: ↑↑↓↓←→←→BA');})();`,
            tags: ['konami', 'easter-egg', 'game']
        },
        'snow-effect': {
            title: 'Snow Effect',
            desc: 'Add falling snow animation to any webpage',
            category: 'Fun',
            code: `javascript:(function(){if(document.getElementById('snow-style')){document.getElementById('snow-style').remove();var flakes=document.querySelectorAll('.snowflake');for(var i=0;i<flakes.length;i++)flakes[i].remove();return;}var css='@keyframes snow{0%{transform:translateY(-100vh) rotate(0deg);}100%{transform:translateY(100vh) rotate(360deg);}}.snowflake{position:fixed;top:-10px;color:white;user-select:none;pointer-events:none;animation:snow 10s linear infinite;z-index:9999;}';var style=document.createElement('style');style.id='snow-style';style.innerHTML=css;document.head.appendChild(style);for(var i=0;i<50;i++){var flake=document.createElement('div');flake.className='snowflake';flake.innerHTML='❄';flake.style.left=Math.random()*100+'%';flake.style.animationDelay=Math.random()*10+'s';flake.style.fontSize=Math.random()*20+10+'px';document.body.appendChild(flake);}})();`,
            tags: ['snow', 'animation', 'winter']
        },
        'matrix-rain': {
            title: 'Matrix Rain',
            desc: 'Add Matrix-style falling characters effect',
            category: 'Fun',
            code: `javascript:(function(){if(document.getElementById('matrix-canvas')){document.getElementById('matrix-canvas').remove();return;}var canvas=document.createElement('canvas');canvas.id='matrix-canvas';canvas.style.position='fixed';canvas.style.top='0';canvas.style.left='0';canvas.style.width='100%';canvas.style.height='100%';canvas.style.zIndex='9999';canvas.style.pointerEvents='none';canvas.style.background='rgba(0,0,0,0.8)';document.body.appendChild(canvas);var ctx=canvas.getContext('2d');canvas.width=window.innerWidth;canvas.height=window.innerHeight;var chars='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';var drops=[];for(var i=0;i<canvas.width/20;i++)drops[i]=1;function draw(){ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle='#0F0';ctx.font='20px monospace';for(var i=0;i<drops.length;i++){var text=chars[Math.floor(Math.random()*chars.length)];ctx.fillText(text,i*20,drops[i]*20);if(drops[i]*20>canvas.height&&Math.random()>0.975)drops[i]=0;drops[i]++;}}setInterval(draw,50);})();`,
            tags: ['matrix', 'animation', 'effect']
        },
        'disco-mode': {
            title: 'Disco Mode',
            desc: 'Make the page background flash rainbow colors',
            category: 'Fun',
            code: `javascript:(function(){if(window.discoMode){clearInterval(window.discoMode);delete window.discoMode;document.body.style.backgroundColor='';alert('Disco mode OFF');}else{var colors=['red','orange','yellow','green','blue','indigo','violet'];var i=0;window.discoMode=setInterval(function(){document.body.style.backgroundColor=colors[i%colors.length];i++;},200);alert('Disco mode ON! (run again to stop)');}})();`,
            tags: ['disco', 'colors', 'party']
        },

        // Image & Media
        'download-images': {
            title: 'Download All Images',
            desc: 'Open all images on the page in new tabs for downloading',
            category: 'Media',
            code: `javascript:(function(){var imgs=document.getElementsByTagName('img');var count=0;for(var i=0;i<imgs.length;i++){if(imgs[i].src&&!imgs[i].src.startsWith('data:')){window.open(imgs[i].src,'_blank');count++;}}alert('Opened '+count+' images in new tabs');})();`,
            tags: ['images', 'download', 'media']
        },
        'image-gallery': {
            title: 'Image Gallery View',
            desc: 'View all images on the page in a gallery format',
            category: 'Media',
            code: `javascript:(function(){var imgs=document.getElementsByTagName('img');var gallery='<div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:99999;overflow:auto;padding:20px;"><h2 style="color:white;text-align:center;">Image Gallery (Click to close)</h2>';for(var i=0;i<imgs.length;i++){if(imgs[i].src)gallery+='<img src="'+imgs[i].src+'" style="max-width:300px;margin:10px;border:2px solid white;">';}gallery+='</div>';var div=document.createElement('div');div.innerHTML=gallery;div.onclick=function(){document.body.removeChild(div);};document.body.appendChild(div);})();`,
            tags: ['gallery', 'images', 'view']
        },
        'video-controls': {
            title: 'Video Speed Control',
            desc: 'Add speed controls to all videos on the page',
            category: 'Media',
            code: `javascript:(function(){var videos=document.getElementsByTagName('video');for(var i=0;i<videos.length;i++){var v=videos[i];var controls=document.createElement('div');controls.innerHTML='<button onclick="this.parentNode.previousSibling.playbackRate=0.5">0.5x</button><button onclick="this.parentNode.previousSibling.playbackRate=1">1x</button><button onclick="this.parentNode.previousSibling.playbackRate=1.5">1.5x</button><button onclick="this.parentNode.previousSibling.playbackRate=2">2x</button>';controls.style.cssText='margin:5px 0;';v.parentNode.insertBefore(controls,v.nextSibling);}alert('Speed controls added to '+videos.length+' videos');})();`,
            tags: ['video', 'speed', 'controls']
        },

        // Analytics & SEO
        'meta-tags': {
            title: 'View Meta Tags',
            desc: 'Display all meta tags and their content',
            category: 'SEO',
            code: `javascript:(function(){var metas=document.getElementsByTagName('meta');var info='Meta Tags:\\n\\n';for(var i=0;i<metas.length;i++){var name=metas[i].name||metas[i].property||metas[i].httpEquiv||'unnamed';var content=metas[i].content||'(no content)';info+=name+': '+content+'\\n';}alert(info);})();`,
            tags: ['meta', 'seo', 'tags']
        },
        'heading-structure': {
            title: 'Heading Structure',
            desc: 'Show the heading hierarchy (H1-H6) of the page',
            category: 'SEO',
            code: `javascript:(function(){var headings=document.querySelectorAll('h1,h2,h3,h4,h5,h6');var structure='Heading Structure:\\n\\n';for(var i=0;i<headings.length;i++){var level=headings[i].tagName;var text=headings[i].innerText.substring(0,50);structure+=level+': '+text+'\\n';}if(structure.length>20)alert(structure);else alert('No headings found on this page');})();`,
            tags: ['headings', 'structure', 'seo']
        },
        'check-alt-tags': {
            title: 'Check Alt Tags',
            desc: 'Find images missing alt attributes for SEO',
            category: 'SEO',
            code: `javascript:(function(){var imgs=document.getElementsByTagName('img');var missing=0;var total=imgs.length;for(var i=0;i<imgs.length;i++){if(!imgs[i].alt||imgs[i].alt.trim()===''){imgs[i].style.border='3px solid red';missing++;}}alert('Images: '+total+'\\nMissing alt text: '+missing+'\\n\\n'+(missing>0?'Images missing alt text are highlighted in red':'All images have alt text!'));})();`,
            tags: ['alt', 'seo', 'accessibility']
        },

        // Form Tools
        'fill-forms': {
            title: 'Auto Fill Forms',
            desc: 'Fill all form fields with placeholder text',
            category: 'Forms',
            code: `javascript:(function(){var inputs=document.querySelectorAll('input[type="text"],input[type="email"],textarea');for(var i=0;i<inputs.length;i++){var input=inputs[i];if(input.type==='email')input.value='test@example.com';else if(input.name&&input.name.toLowerCase().includes('name'))input.value='John Doe';else input.value='Sample text';}alert('Forms filled with sample data');})();`,
            tags: ['forms', 'fill', 'testing']
        },
        'form-data': {
            title: 'Extract Form Data',
            desc: 'Show all form data on the page',
            category: 'Forms',
            code: `javascript:(function(){var forms=document.getElementsByTagName('form');var data='Form Data:\\n\\n';for(var f=0;f<forms.length;f++){data+='Form '+(f+1)+':\\n';var elements=forms[f].elements;for(var i=0;i<elements.length;i++){var el=elements[i];if(el.name&&el.value)data+=el.name+': '+el.value+'\\n';}data+='\\n';}if(data.length>15)alert(data);else alert('No form data found');})();`,
            tags: ['forms', 'data', 'extract']
        },
        'clear-forms': {
            title: 'Clear All Forms',
            desc: 'Clear all form inputs on the page',
            category: 'Forms',
            code: `javascript:(function(){var inputs=document.querySelectorAll('input,textarea,select');var count=0;for(var i=0;i<inputs.length;i++){if(inputs[i].type!=='submit'&&inputs[i].type!=='button'){inputs[i].value='';count++;}}alert('Cleared '+count+' form fields');})();`,
            tags: ['forms', 'clear', 'reset']
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
            let savedTheme = localStorage.getItem(LOCAL_KEYS.theme) || 'flamingo';
            
            // Ensure the theme is valid, fallback to flamingo if not
            if (!THEMES.includes(savedTheme)) {
                savedTheme = 'flamingo';
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
        const THEMES = ['light', 'dark', 'flamingo', 'ocean', 'sunset', 'midnight'];
        
        // Set flamingo theme on initial load if no theme is set
        if (!localStorage.getItem(LOCAL_KEYS.theme)) {
            setTheme('flamingo');
        }
        
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
                    // Copy the original code, not the displayed HTML
                    const codeToCopy = minifyForHref(snippetCode);
                    copyToClipboard(codeToCopy)
                        .then(() => {
                            showCopyFeedback();
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
                        showCopyFeedback();
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
                            // Show the feedback
                            showCopyFeedback();
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
                        .then(() => showCopyFeedback())
                        .catch(() => showCopyFeedback('Failed to copy to clipboard', 'error'));
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

        function showCopyFeedback(message = 'Bookmarklet copied to clipboard!', type = 'success') {
            const container = document.getElementById('toast-container');
            
            // Remove any existing toasts to prevent stacking
            container.innerHTML = '';
            
            const toast = document.createElement('div');
            toast.className = `toast`;
            toast.setAttribute('role', 'alert');
            toast.setAttribute('aria-live', 'assertive');
            
            // Create toast content with icon
            const icon = document.createElement('div');
            icon.className = 'toast-icon';
            icon.innerHTML = '✓';
            
            const content = document.createElement('div');
            content.className = 'toast-content';
            content.textContent = message;
            
            // Create progress bar
            const progress = document.createElement('div');
            progress.className = 'toast-progress';
            
            // Build toast structure
            const toastContent = document.createElement('div');
            toastContent.className = 'toast-content';
            toastContent.appendChild(icon);
            toastContent.appendChild(content);
            
            toast.appendChild(toastContent);
            toast.appendChild(progress);
            
            container.appendChild(toast);
            
            // Trigger animation
            requestAnimationFrame(() => {
                toast.classList.add('show');
                
                // Animate progress bar
                setTimeout(() => {
                    progress.style.transform = 'scaleX(0)';
                }, 10);
            });
            
            // Auto-remove after delay
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    if (toast.parentNode === container) {
                        container.removeChild(toast);
                    }
                }, 300);
            }, 3000);
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
        // Ensure the code starts with javascript:
        if (!code.startsWith('javascript:')) {
            code = 'javascript:' + code;
        }
        
        // Return the code as-is since it's already properly formatted
        return code;
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