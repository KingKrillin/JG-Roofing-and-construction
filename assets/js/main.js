// ===== Footer year =====
(function setYear(){
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
})();

// ===== Mobile nav toggle =====
(function navToggle(){
    var btn = document.getElementById('navToggle');
    var links = document.querySelector('.nav-links');
    if (!btn || !links) return;
    btn.addEventListener('click', function(){ links.classList.toggle('open'); });

    var back = document.getElementById('navBack');
    if (back) back.addEventListener('click', function(){ links.classList.remove('open'); });

    document.querySelectorAll('.nav-dropdown > a').forEach(function(a){
        a.addEventListener('click', function(e){
            if (window.innerWidth > 760) return;
            e.preventDefault();
            a.parentElement.classList.toggle('open');
        });
    });
})();

// ===== Move the hero form into its own section on mobile only; desktop keeps it in the hero =====
(function relocateHeroForm(){
    var heroRight = document.querySelector('.hero-right');
    var heroSection = document.getElementById('home');
    var mobileSlot = document.getElementById('mobileFormSection');
    if (!heroRight || !heroSection || !mobileSlot) return;
    var mq = window.matchMedia('(max-width: 760px)');
    function place(){
        if (mq.matches) mobileSlot.appendChild(heroRight);
        else heroSection.appendChild(heroRight);
    }
    place();
    if (mq.addEventListener) mq.addEventListener('change', place);
    else mq.addListener(place);
})();

// ===== Multi-step hero form =====
function ss(card){ // select service
    document.querySelectorAll('#s1 .msf-scard').forEach(function(c){ c.classList.remove('selected'); });
    card.classList.add('selected');
    document.getElementById('nb1').classList.remove('off');
    var hidden = document.getElementById('heroService');
    var nm = card.querySelector('.nm');
    if (hidden && nm) hidden.value = nm.textContent.trim();
}

function gs(step){ // go to step
    for (var i = 1; i <= 4; i++){
        var el = document.getElementById('s' + i);
        if (el) el.classList.toggle('active', i === step);
    }
    var dots = { 1:'d1', 2:'d2', 3:'d3' };
    var labels = { 1:'l1', 2:'l2', 3:'l3' };
    Object.keys(dots).forEach(function(k){
        var n = parseInt(k, 10);
        var dot = document.getElementById(dots[k]);
        var label = document.getElementById(labels[k]);
        if (dot) dot.classList.toggle('active', n <= step);
        if (label) label.classList.toggle('active', n === step);
    });
}

// validates the required, currently-visible fields within a given step before letting the user move forward
function validateStep(stepId){
    var el = document.getElementById(stepId);
    if (!el) return true;
    var inputs = el.querySelectorAll('[required]');
    for (var i = 0; i < inputs.length; i++){
        if (!inputs[i].reportValidity()) return false;
    }
    return true;
}

// ===== Shared lead-form submission -> FormSubmit (relays to jgroofingconstruction01@gmail.com) =====
var LEAD_FORM_ENDPOINT = 'https://formsubmit.co/ajax/jgroofingconstruction01@gmail.com';

function submitLeadForm(form, onSuccess){
    var submitBtn = form.querySelector('button[type="submit"]');
    var originalText = submitBtn ? submitBtn.textContent : '';
    if (submitBtn){ submitBtn.disabled = true; submitBtn.textContent = 'Sending...'; }

    fetch(LEAD_FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
    }).then(function(res){
        if (!res.ok) throw new Error('Bad response from form endpoint');
        return res.json();
    }).then(function(){
        onSuccess();
    }).catch(function(){
        if (submitBtn){ submitBtn.disabled = false; submitBtn.textContent = originalText; }
        alert("Sorry, something went wrong sending your request. Please call us directly at (832) 430-0148 and we'll take care of you right away.");
    });
}

(function heroForm(){
    var f = document.getElementById('heroForm');
    if (!f) return;
    f.addEventListener('submit', function(e){
        e.preventDefault();
        submitLeadForm(f, function(){ gs(4); });
    });
})();

(function midForm(){
    var f = document.getElementById('midForm');
    if (!f) return;
    f.addEventListener('submit', function(e){
        e.preventDefault();
        submitLeadForm(f, function(){
            f.innerHTML = '<div class="msf-done"><div class="msf-done-icon">&#10003;</div><h3 style="color:#fff">Thank You!</h3><p style="color:#C9CDD1">Your submission was received &mdash; we\'ll get right back to you as soon as possible.</p></div>';
        });
    });
})();

// ===== Core values orbit (animated constellation) =====
var ORBIT_DATA = [
    { name: 'Precision', tag: 'Our Standard', color: '#E8121C', desc: "We care about every detail, from the first nail to the final walkthrough. Every measurement, cut, and fastener is placed with intention — because a roof or a remodel is only as strong as the crew's attention to the parts nobody else notices. If it's not right, it's not finished." },
    { name: 'Ownership', tag: 'Our Promise', color: '#9AA0A6', desc: "We own everything that happens on our job sites — every call, every delay, every decision, every result. When something goes wrong, we don't point fingers or hide behind excuses; we fix it, explain it, and make it right. That's what it means to actually stand behind your work." },
    { name: 'Communication', tag: 'Our Discipline', color: '#B0181F', desc: "Confusion is where good projects go bad. We keep it simple: clients know what's happening at every stage, our crews stay aligned in the field, and nothing gets lost between the estimate and the final invoice. You'll never have to chase us for an update." },
    { name: 'Innovation', tag: 'Our Mission', color: '#FFFFFF', desc: "We're not interested in doing things the way roofing has always been done. We invest in better materials, smarter installation techniques, and modern tools — drone inspections, digital estimates, tighter project tracking — so every job reflects where the industry is headed, not where it's been." },
    { name: 'Customer First', tag: 'Our Foundation', color: '#FF7A7A', desc: "Your home or business is one of the biggest investments you'll make, and we treat every project like it's our own. Clear pricing, honest timelines, and a crew that shows up when we say we will — that's the baseline, not the upsell." }
];

var orbActiveIndex = null;

function orbClick(i){
    var nodeEls = document.querySelectorAll('.orbit-node');
    var detail = document.getElementById('orbitDetail');
    var detailInner = document.getElementById('orbitDetailInner');
    if (orbActiveIndex === i){
        orbActiveIndex = null;
        nodeEls.forEach(function(n){ n.classList.remove('active', 'dimmed'); });
        if (detail) detail.classList.remove('show');
    } else {
        orbActiveIndex = i;
        nodeEls.forEach(function(n){
            var ni = parseInt(n.getAttribute('data-i'), 10);
            n.classList.toggle('active', ni === i);
            n.classList.toggle('dimmed', ni !== i);
        });
        var d = ORBIT_DATA[i];
        if (detailInner && d){
            detailInner.innerHTML =
                '<div class="orbit-detail-name" style="color:' + d.color + '">' + d.name + '</div>' +
                '<div class="orbit-detail-tag">' + d.tag + '</div>' +
                '<p class="orbit-detail-desc">' + d.desc + '</p>';
        }
        if (detail) detail.classList.add('show');
    }
    var wrap = document.getElementById('orbitWrap');
    if (wrap && wrap.dataset) wrap.classList.toggle('paused', wrap.dataset.hovering === '1' || orbActiveIndex !== null);
}

(function orbit(){
    var wrap = document.getElementById('orbitWrap');
    var lines = document.getElementById('orbitLines');
    var glow = document.getElementById('orbitGlow');
    if (!wrap || !lines) return;

    var svgns = 'http://www.w3.org/2000/svg';
    var nodeEls = Array.prototype.slice.call(wrap.querySelectorAll('.orbit-node'));

    // give each node its brand color (matches data-color, drives currentColor everywhere inside it)
    nodeEls.forEach(function(node){
        var c = node.getAttribute('data-color');
        if (c) node.style.color = c;
    });

    // boot-in entrance once the constellation scrolls into view
    function bootNodes(){
        nodeEls.forEach(function(node, i){
            setTimeout(function(){ node.classList.add('booted'); }, i * 130);
        });
    }
    if ('IntersectionObserver' in window){
        var io = new IntersectionObserver(function(entries){
            entries.forEach(function(entry){
                if (entry.isIntersecting){
                    bootNodes();
                    io.disconnect();
                }
            });
        }, { threshold: 0.3 });
        io.observe(wrap);
    } else {
        bootNodes();
    }

    // cursor glow follows the pointer inside the constellation
    wrap.addEventListener('mousemove', function(e){
        var r = wrap.getBoundingClientRect();
        glow.style.left = (e.clientX - r.left) + 'px';
        glow.style.top = (e.clientY - r.top) + 'px';
        glow.style.opacity = '1';
    });
    wrap.addEventListener('mouseenter', function(){
        wrap.dataset.hovering = '1';
        wrap.classList.add('paused');
    });
    wrap.addEventListener('mouseleave', function(){
        wrap.dataset.hovering = '0';
        glow.style.opacity = '0';
        wrap.classList.toggle('paused', orbActiveIndex !== null);
    });

    // redraw the hub-to-node lines + traveling pulse dots, following live (rotating) node positions
    function updateLines(){
        var wrapRect = wrap.getBoundingClientRect();
        if (!wrapRect.width) return;
        lines.innerHTML = '';
        nodeEls.forEach(function(node, i){
            var r = node.getBoundingClientRect();
            var x = ((r.left + r.width / 2) - wrapRect.left) / wrapRect.width * 600;
            var y = ((r.top + r.height / 2) - wrapRect.top) / wrapRect.height * 600;
            var isActive = orbActiveIndex === i;
            var color = node.getAttribute('data-color') || '#E8121C';

            var line = document.createElementNS(svgns, 'line');
            line.setAttribute('x1', 300);
            line.setAttribute('y1', 300);
            line.setAttribute('x2', x.toFixed(1));
            line.setAttribute('y2', y.toFixed(1));
            line.setAttribute('stroke', color);
            line.setAttribute('stroke-width', isActive ? 2.5 : 1);
            line.setAttribute('stroke-opacity', isActive ? 0.55 : 0.15);
            line.setAttribute('stroke-linecap', 'round');
            lines.appendChild(line);

            var path = 'M' + x.toFixed(1) + ',' + y.toFixed(1) + ' L300,300';
            var dotCount = isActive ? 3 : 2;
            var dur = isActive ? 1.5 : 3;
            var stagger = isActive ? 0.5 : 1;
            for (var k = 0; k < dotCount; k++){
                var dot = document.createElementNS(svgns, 'circle');
                dot.setAttribute('r', isActive ? 4 : 3);
                dot.setAttribute('fill', color);
                dot.setAttribute('opacity', isActive ? 0.9 : 0.4);
                var anim = document.createElementNS(svgns, 'animateMotion');
                anim.setAttribute('dur', dur + 's');
                anim.setAttribute('begin', (k * stagger) + 's');
                anim.setAttribute('repeatCount', 'indefinite');
                anim.setAttribute('path', path);
                dot.appendChild(anim);
                lines.appendChild(dot);
            }
        });
    }
    updateLines();
    setInterval(updateLines, 120);
    window.addEventListener('resize', updateLines);
})();

// ===== Reviews carousel =====
var reviewIndex = 0;
function rgo(i){
    var cards = document.querySelectorAll('.review-card');
    var dots = document.querySelectorAll('.rdot');
    cards.forEach(function(c, idx){ c.classList.toggle('active', idx === i); });
    dots.forEach(function(d, idx){ d.classList.toggle('active', idx === i); });
    reviewIndex = i;
}
(function reviewsAuto(){
    var cards = document.querySelectorAll('.review-card');
    if (!cards.length) return;
    setInterval(function(){
        rgo((reviewIndex + 1) % cards.length);
    }, 6000);
})();

// ===== Aerial flyover video tiles: click play opens fullscreen for a better look =====
function projectVideoTap(e, video){
    e.stopPropagation();
    video.muted = false;
    if (video.webkitEnterFullscreen){
        video.webkitEnterFullscreen();
    } else if (video.requestFullscreen || video.webkitRequestFullscreen){
        video.controls = true;
        (video.requestFullscreen || video.webkitRequestFullscreen).call(video);
    }
    video.play();
}
document.addEventListener('fullscreenchange', function(){
    if (!document.fullscreenElement){
        document.querySelectorAll('.project-video').forEach(function(v){
            v.controls = false;
            v.muted = true;
            v.pause();
        });
    }
});
document.addEventListener('webkitendfullscreen', function(e){
    var v = e.target;
    if (v && v.classList && v.classList.contains('project-video')){
        v.muted = true;
        v.pause();
    }
}, true);

// ===== Apartment complex gallery: expand/collapse the rest of the photos =====
function toggleApartmentGallery(){
    var grid = document.getElementById('apartmentGrid');
    var toggle = document.getElementById('apartmentFolderToggle');
    var text = toggle.querySelector('.project-folder-text');
    var expanded = grid.classList.toggle('expanded');
    toggle.classList.toggle('open', expanded);
    text.textContent = expanded ? 'Show Less' : 'Open More';
}

// ===== Project gallery lightbox =====
var PROJECT_PHOTOS = Array.prototype.slice.call(document.querySelectorAll('.projects-grid .project-tile img')).map(function(img){ return { src: img.getAttribute('src'), alt: img.getAttribute('alt') }; });
var lightboxIndex = 0;
function openLightbox(i){
    if (!PROJECT_PHOTOS.length) return;
    lightboxIndex = i;
    var box = document.getElementById('lightbox');
    var img = document.getElementById('lightboxImg');
    img.src = PROJECT_PHOTOS[i].src;
    img.alt = PROJECT_PHOTOS[i].alt || '';
    box.classList.add('open');
}
function closeLightbox(e){
    if (e) e.stopPropagation();
    document.getElementById('lightbox').classList.remove('open');
}
function navLightbox(e, dir){
    if (e) e.stopPropagation();
    lightboxIndex = (lightboxIndex + dir + PROJECT_PHOTOS.length) % PROJECT_PHOTOS.length;
    var img = document.getElementById('lightboxImg');
    img.src = PROJECT_PHOTOS[lightboxIndex].src;
    img.alt = PROJECT_PHOTOS[lightboxIndex].alt || '';
}
document.addEventListener('keydown', function(e){
    var box = document.getElementById('lightbox');
    if (!box || !box.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') navLightbox(null, 1);
    if (e.key === 'ArrowLeft') navLightbox(null, -1);
});

// ===== Service area cities around Houston =====
var HOUSTON_CITIES = {
    all: [
        { name: 'Houston', coords: [29.7604, -95.3698] },
        { name: 'Bellaire', coords: [29.7058, -95.4588] },
        { name: 'Galena Park', coords: [29.7355, -95.2419] },
        { name: 'Jacinto City', coords: [29.7625, -95.216] },
        { name: 'South Houston', coords: [29.6688, -95.233] },
        { name: 'Jersey Village', coords: [29.8916, -95.5413] },
        { name: 'Channelview', coords: [29.7791, -95.111] },
        { name: 'Deer Park', coords: [29.705, -95.1266] },
        { name: 'Aldine', coords: [29.9255, -95.3949] },
        { name: 'Spring', coords: [30.0799, -95.4172] },
        { name: 'Humble', coords: [29.9988, -95.2622] },
        { name: 'Atascocita', coords: [29.9963, -95.1761] },
        { name: 'Cypress', coords: [29.9691, -95.6972] },
        { name: 'Tomball', coords: [30.0972, -95.6161] },
        { name: 'Magnolia', coords: [30.2102, -95.7466] },
        { name: 'Hockley', coords: [30.0438, -95.84] },
        { name: 'Montgomery', coords: [30.3849, -95.6975] },
        { name: 'Willis', coords: [30.4227, -95.4791] },
        { name: 'The Woodlands', coords: [30.1658, -95.4613] },
        { name: 'Shenandoah', coords: [30.1838, -95.4577] },
        { name: 'Oak Ridge North', coords: [30.1538, -95.4477] },
        { name: 'Conroe', coords: [30.3119, -95.4561] },
        { name: 'Splendora', coords: [30.2316, -95.1697] },
        { name: 'New Caney', coords: [30.153, -95.208] },
        { name: 'Porter', coords: [30.0894, -95.2202] },
        { name: 'Huffman', coords: [29.9994, -95.1466] },
        { name: 'Waller', coords: [30.0716, -95.9436] },
        { name: 'Hempstead', coords: [30.0966, -96.0775] },
        { name: 'Brookshire', coords: [29.7888, -95.9555] },
        { name: 'Baytown', coords: [29.7355, -94.9774] },
        { name: 'Beach City', coords: [29.7747, -94.9744] },
        { name: 'Mont Belvieu', coords: [29.8458, -94.8949] },
        { name: 'Anahuac', coords: [29.7644, -94.6852] },
        { name: 'Liberty', coords: [30.0577, -94.7955] },
        { name: 'Dayton', coords: [30.0466, -94.8908] },
        { name: 'Cleveland', coords: [30.3416, -95.0858] },
        { name: 'Crosby', coords: [29.9166, -95.0658] },
        { name: 'Highlands', coords: [29.8233, -95.0408] },
        { name: 'La Porte', coords: [29.6658, -95.0194] },
        { name: 'Pasadena', coords: [29.6911, -95.2091] },
        { name: 'League City', coords: [29.5074, -95.0949] },
        { name: 'Webster', coords: [29.5385, -95.1216] },
        { name: 'Seabrook', coords: [29.5644, -95.0188] },
        { name: 'Kemah', coords: [29.5346, -95.0177] },
        { name: 'Dickinson', coords: [29.4608, -95.0535] },
        { name: 'Friendswood', coords: [29.5294, -95.201] },
        { name: 'Galveston', coords: [29.3013, -94.7977] },
        { name: 'Texas City', coords: [29.3838, -94.9027] },
        { name: 'La Marque', coords: [29.3697, -94.976] },
        { name: 'Hitchcock', coords: [29.3375, -95.0152] },
        { name: 'Santa Fe', coords: [29.3855, -95.1066] },
        { name: 'Bacliff', coords: [29.5097, -94.9716] },
        { name: 'San Leon', coords: [29.4977, -94.9438] },
        { name: 'Pearland', coords: [29.5635, -95.286] },
        { name: 'Manvel', coords: [29.4838, -95.3577] },
        { name: 'Alvin', coords: [29.4238, -95.2441] },
        { name: 'Arcola', coords: [29.4513, -95.4441] },
        { name: 'Iowa Colony', coords: [29.4416, -95.4111] },
        { name: 'Rosharon', coords: [29.3613, -95.4452] },
        { name: 'Angleton', coords: [29.1688, -95.4313] },
        { name: 'Brazoria', coords: [29.1683, -95.5666] },
        { name: 'West Columbia', coords: [29.1488, -95.6488] },
        { name: 'Lake Jackson', coords: [29.0339, -95.4339] },
        { name: 'Danbury', coords: [29.228, -95.3327] },
        { name: 'Sweeny', coords: [29.0297, -95.6963] },
        { name: 'Missouri City', coords: [29.6186, -95.5377] },
        { name: 'Sugar Land', coords: [29.6196, -95.6349] },
        { name: 'Stafford', coords: [29.6158, -95.5577] },
        { name: 'Fresno', coords: [29.5466, -95.4452] },
        { name: 'Richmond', coords: [29.5822, -95.7607] },
        { name: 'Rosenberg', coords: [29.5572, -95.8086] },
        { name: 'Fulshear', coords: [29.6886, -95.8997] },
        { name: 'Katy', coords: [29.7858, -95.8245] },
        { name: 'Simonton', coords: [29.6766, -95.9947] },
        { name: 'Wallis', coords: [29.6627, -96.0791] },
        { name: 'Sealy', coords: [29.7647, -96.1577] },
        { name: 'Wharton', coords: [29.3116, -96.103] },
        { name: 'Needville', coords: [29.3958, -95.8266] }
    ]
};

// ===== Leaflet service-area map =====
(function initMap(){
    var el = document.getElementById('areasMap');
    if (!el || typeof L === 'undefined') return;
    var map = L.map(el, { scrollWheelZoom: false });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    HOUSTON_CITIES.all.forEach(function(c){
        var isHub = c.name === 'Houston';
        L.circleMarker(c.coords, {
            radius: isHub ? 8 : 6,
            color: '#fff',
            weight: 2,
            fillColor: '#E8121C',
            fillOpacity: 1
        })
            .addTo(map)
            .bindTooltip(c.name, {
                direction: 'top',
                offset: [0, -6],
                className: isHub ? 'city-label city-label-hub' : 'city-label'
            });
    });
    map.setView([29.7604, -95.3698], 9);
})();

// ===== Sticky CTA hide on scroll down past hero =====
(function stickyCta(){
    var bar = document.getElementById('stickyCta');
    if (!bar) return;
    var lastY = window.scrollY;
    window.addEventListener('scroll', function(){
        var y = window.scrollY;
        if (y > lastY && y > 300) bar.style.transform = 'translateY(-100%)';
        else bar.style.transform = 'translateY(0)';
        bar.style.transition = 'transform .25s';
        lastY = y;
    });
})();

// ===== Mobile header: hide on scroll down, reveal on scroll up =====
(function navAutoHide(){
    var nav = document.getElementById('mainNav');
    var navLinks = document.querySelector('.nav-links');
    if (!nav) return;
    var lastY = window.scrollY;
    var mq = window.matchMedia('(max-width: 760px)');
    window.addEventListener('scroll', function(){
        var y = window.scrollY;
        if (!mq.matches || (navLinks && navLinks.classList.contains('open'))){
            nav.style.transform = 'translateY(0)';
            lastY = y;
            return;
        }
        nav.style.transition = 'transform .25s';
        nav.style.transform = (y > lastY && y > 80) ? 'translateY(-100%)' : 'translateY(0)';
        lastY = y;
    });
})();
