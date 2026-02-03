const content_dir = 'contents/'
const config_file = 'config.yml'
const section_names = ['home', 'awards', 'experience', 'publications'];


window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });


    // Yaml
    fetch(content_dir + config_file)
        .then(response => response.text())
        .then(text => {
            const yml = jsyaml.load(text);
            Object.keys(yml).forEach(key => {
                try {
                    const el = document.getElementById(key);
                    if (!el) return;
                    // Normalize and remove zero-width / non-breaking spaces that might be invisible
                    const raw = yml[key] === undefined || yml[key] === null ? '' : yml[key].toString();
                    const normalized = raw.replace(/[\u00A0\u200B\uFEFF]/g, ' ');
                    // If the value contains HTML entities/tags, keep using innerHTML; otherwise use textContent to preserve spaces
                    if (/<\/?.+>/i.test(normalized) || /&[a-zA-Z]+;/.test(normalized)) {
                        el.innerHTML = normalized;
                    } else {
                        el.textContent = normalized;
                    }
                } catch (e) {
                    console.log("Unknown id and value: " + key + "," + yml[key].toString(), e)
                }

            })
        })
        .catch(error => console.log(error));


    // Marked
    marked.use({ mangle: false, headerIds: false })
    section_names.forEach((name, idx) => {
        fetch(content_dir + name + '.md')
            .then(response => response.text())
            .then(markdown => {
                const html = marked.parse(markdown);
                document.getElementById(name + '-md').innerHTML = html;
            }).then(() => {
                // MathJax
                MathJax.typeset();
            })
            .catch(error => console.log(error));
    })

}); 
